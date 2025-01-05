-- name: GetGroceries :many
SELECT * 
FROM grocery_items
WHERE 
  (($4::boolean = TRUE AND deleted_at IS NOT NULL) OR ($4 = FALSE AND deleted_at IS NULL) OR $4 IS NULL)
  AND (
    ($1::boolean IS NULL AND bought_at IS NULL)
    OR ($1 = TRUE AND bought_at IS NOT NULL)
    OR ($1 = FALSE AND bought_at IS NULL)
  )
ORDER BY created_at DESC
LIMIT $2 OFFSET $3;

-- name: CountGroceries :one
SELECT COUNT(*) 
FROM grocery_items
WHERE 
  (($2::boolean = TRUE AND deleted_at IS NOT NULL) OR ($2 = FALSE AND deleted_at IS NULL) OR $2 IS NULL)
  AND (
    ($1::boolean IS NULL AND bought_at IS NULL)
    OR ($1 = TRUE AND bought_at IS NOT NULL)
    OR ($1 = FALSE AND bought_at IS NULL)
  );

-- name: CreateGrocery :one
INSERT INTO grocery_items(
	name)
	VALUES ($1)
RETURNING *;

-- name: UpdateGrocery :exec
UPDATE grocery_items
SET 
  name = $1
WHERE id = $2;

-- name: ToBuy :exec
UPDATE grocery_items
SET 
  bought_at = $1
WHERE id = $2;

-- name: ToRestore :exec
UPDATE grocery_items
SET 
  bought_at = null
WHERE id = $1;

-- name: ToDelete :exec
UPDATE grocery_items
SET 
  deleted_at = $1
WHERE id = $2;
