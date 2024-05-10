.PHONY: i
i:
	docker compose run --rm app npm i

.PHONY: dev
dev:
	docker compose run --rm app npm run dev

.PHONY: build
build:
	docker compose run --rm app npm run build

.PHONY: package
package:
	docker compose run --rm app npm run package