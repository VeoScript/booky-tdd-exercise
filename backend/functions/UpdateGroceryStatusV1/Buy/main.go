package main

import (
	"backend/db/database"
	"backend/helpers"
	"context"
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/jackc/pgx/v5/pgxpool"
	apigw "github.com/scrambledeggs/booky-go-common/apigatewayresponse"
	"github.com/scrambledeggs/booky-go-common/logs"
)

var dbPool *pgxpool.Pool

type Grocery struct {
	ID       string    `json:"id"`
	BoughtAt time.Time `json:"bought_at"`
}

func init() {
	var err error
	dbPool, err = helpers.InitializeDB()
	if err != nil {
		log.Fatal(err)
	}
}

func handler(request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	logs.Request = request
	groceryID := request.PathParameters["id"]

	var uuid pgtype.UUID
	err := uuid.Scan(groceryID)
	if err != nil {
		logs.Error("UUID Parse Error", err.Error())
		return apigw.SingleErrorResponse(
			http.StatusBadRequest,
			apigw.ErrorResponseBody{
				Message: "Invalid UUID format",
				Code:    "INVALID_UUID_FORMAT",
			},
		)
	}

	grocery := Grocery{}
	if err := json.Unmarshal([]byte(request.Body), &grocery); err != nil {
		logs.Error("json.Unmarshal", err.Error())
		return apigw.SingleErrorResponse(
			http.StatusBadRequest,
			apigw.ErrorResponseBody{
				Message: err.Error(),
				Code:    "TO_BUY_GROCERY_PAYLOAD_ERROR",
			},
		)
	}

	var boughtAt pgtype.Timestamp
	if grocery.BoughtAt.IsZero() {
		boughtAt = pgtype.Timestamp{}
	} else {
		boughtAt.Scan(grocery.BoughtAt)
	}

	queries := database.New(dbPool)
	err = queries.ToBuy(context.Background(), database.ToBuyParams{
		ID:       uuid,
		BoughtAt: boughtAt,
	})
	if err != nil {
		logs.Error("TO_BUY_GROCERY_QUERY_ERROR", err.Error())
		return apigw.SingleErrorResponse(
			http.StatusInternalServerError,
			apigw.ErrorResponseBody{
				Message: err.Error(),
				Code:    "TO_BUY_GROCERY_QUERY_ERROR",
			},
		)
	}

	return apigw.SingleSuccessResponse(http.StatusOK, "Updated successfully")
}

func main() {
	lambda.Start(handler)
}
