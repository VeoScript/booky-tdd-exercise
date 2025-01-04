package helpers

import "strconv"

const defaultPage = 1
const defaultLimit = 20

func GetPage(pageStr string) int {
	pageInt, err := strconv.Atoi(pageStr)
	if err != nil {
		return defaultPage
	}

	return pageInt
}

func GetItemsPerPage(itemsStr string) int {
	itemsInt, err := strconv.Atoi(itemsStr)
	if err != nil {
		return defaultLimit
	}

	return itemsInt
}

func ComputePageOffset(page int, items int) int32 {
	return int32((page - 1) * items)
}
