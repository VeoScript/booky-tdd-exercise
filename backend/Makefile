.PHONY: build
build:
	sam build

.PHONY: dev
dev: build
	sam local start-api --port 3333 --env-vars env.json