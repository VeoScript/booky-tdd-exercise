package helpers

import (
	"log"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgtype"
)

func StringToUUID(s string) (pgtype.UUID, error) {
	parsed, err := uuid.Parse(s)
	if err != nil {
		log.Printf("Error parsing UUID string '%s': %v", s, err)
		return pgtype.UUID{}, err
	}
	var pgUUID pgtype.UUID
	err = pgUUID.Scan(parsed)
	if err != nil {
		log.Printf("Error scanning parsed UUID '%s': %v", parsed, err)
	} else {
		log.Printf("Successfully scanned UUID '%s'", parsed)
	}
	return pgUUID, err
}
