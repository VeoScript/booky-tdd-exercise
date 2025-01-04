-- name: GetGroceries :many
SELECT * 
FROM grocery_items
WHERE 
  ($1::boolean IS NULL AND bought_at IS NULL)
  OR ($1::boolean = TRUE AND bought_at IS NOT NULL)
  OR ($1::boolean = FALSE AND bought_at IS NULL)  
ORDER BY created_at DESC
LIMIT $2 OFFSET $3;

-- name: CountGroceries :one
SELECT COUNT(*) 
FROM grocery_items
WHERE 
  ($1::boolean IS NULL AND bought_at IS NULL) 
  OR ($1::boolean = TRUE AND bought_at IS NOT NULL)
  OR ($1::boolean = FALSE AND bought_at IS NULL);

-- name: CreateGrocery :one
INSERT INTO grocery_items(
	name)
	VALUES ($1)
RETURNING *;
