.PHONY: build
build:
	sam build

.PHONY: dev
dev: build
	sam local start-api --host 0.0.0.0 --port 3333 --env-vars env.json