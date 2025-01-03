package main

import (
	"backend/db/database"
	"backend/helpers"
	"context"
	"log"
	"net/http"
	"strings"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/jackc/pgx/v5/pgxpool"
	apigw "github.com/scrambledeggs/booky-go-common/apigatewayresponse"
	"github.com/scrambledeggs/booky-go-common/logs"
)

var dbPool *pgxpool.Pool

func init() {
	var err error
	dbPool, err = helpers.InitializeDB()
	if err != nil {
		log.Fatal(err)
	}
}

func handler(request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	logs.Request = request
	page := helpers.GetPage(request.QueryStringParameters["page"])
	items := helpers.GetItemsPerPage(request.QueryStringParameters["items"])
	groceryType := request.QueryStringParameters["type"]

	var pageOffset = helpers.ComputePageOffset(page, items)
	var resultsPerPage = int32(items)

	var filterGroceryType bool
	if groceryType == "bought" {
		filterGroceryType = true
	} else if groceryType == "to-buy" {
		filterGroceryType = false
	} else {
		return apigw.SingleErrorResponse(
			http.StatusBadRequest,
			apigw.ErrorResponseBody{
				Message: "Invalid 'type' query parameter. It should be 'bought' or 'to-buy'.",
				Code:    "INVALID_GROCERY_QUERY_PARAM_TYPE",
			})
	}

	queries := database.New(dbPool)
	groceries, err := queries.GetGroceries(context.Background(), database.GetGroceriesParams{
		Column1: filterGroceryType,
		Offset:  pageOffset,
		Limit:   resultsPerPage,
	})
	if err != nil {
		logs.Error("GetGroceries", err.Error())
		message := err.Error()
		if strings.Contains(err.Error(), "failed to connect to") {
			message = "Fetching groceries failed."
		}
		return apigw.SingleErrorResponse(
			http.StatusInternalServerError,
			apigw.ErrorResponseBody{
				Message: message,
				Code:    "GET_GROCERIES_ERROR",
			})
	}

	count, err := queries.CountGroceries(context.Background(), filterGroceryType)
	if err != nil {
		logs.Error("CountGroceries", err.Error())
		return apigw.SingleErrorResponse(
			http.StatusBadRequest,
			apigw.ErrorResponseBody{
				Message: err.Error(),
				Code:    "GET_GROCERIES_COUNT_ERROR",
			})
	}

	return apigw.MultipleSuccessResponse(
		http.StatusOK,
		groceries,
		map[string]any{
			"total_count":      int(count),
			"results_per_page": int(items),
			"page":             page,
		},
	)
}

func main() {
	lambda.Start(handler)
}
