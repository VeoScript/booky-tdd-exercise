package helpers

import (
	"time"

	"github.com/jackc/pgx/v5/pgtype"
)

func ToNullableText(s string) pgtype.Text {
	return pgtype.Text{
		String: s,
		Valid:  s != "",
	}
}

func PtrOrNil(t time.Time) *time.Time {
	if t.IsZero() {
		return nil
	}
	return &t
}
