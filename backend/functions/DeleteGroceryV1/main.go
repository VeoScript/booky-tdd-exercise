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
	ID        string    `json:"id"`
	DeletedAt time.Time `json:"deleted_at"`
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
				Code:    "TO_DELETE_GROCERY_PAYLOAD_ERROR",
			},
		)
	}

	var deletedAt pgtype.Timestamp
	if grocery.DeletedAt.IsZero() {
		deletedAt = pgtype.Timestamp{}
	} else {
		deletedAt.Scan(grocery.DeletedAt)
	}

	queries := database.New(dbPool)
	err = queries.ToDelete(context.Background(), database.ToDeleteParams{
		ID:        uuid,
		DeletedAt: deletedAt,
	})
	if err != nil {
		logs.Error("TO_DELETE_GROCERY_QUERY_ERROR", err.Error())
		return apigw.SingleErrorResponse(
			http.StatusInternalServerError,
			apigw.ErrorResponseBody{
				Message: err.Error(),
				Code:    "TO_DELETE_GROCERY_QUERY_ERROR",
			},
		)
	}

	return apigw.SingleSuccessResponse(http.StatusOK, "Deleted successfully")
}

func main() {
	lambda.Start(handler)
}
