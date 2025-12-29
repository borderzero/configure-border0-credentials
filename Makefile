.PHONY: help install build format lint test clean tag push-tag release

# Default version if not specified
VERSION ?= v0.0.5

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-15s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

install: ## Install dependencies
	npm install

build: ## Build the action
	npm run build

format: ## Format code
	npm run format

lint: ## Lint code
	npm run lint

test: ## Run tests
	npm test

clean: ## Clean build artifacts
	rm -rf dist/
	rm -rf node_modules/

all: format lint build test ## Run format, lint, build, and test

# Git tagging and release
tag: ## Create a git tag
	@echo "Creating tag $(VERSION)..."
	git add dist/
	git commit -m "Release $(VERSION)" || true
	git tag -a $(VERSION) -m "Release $(VERSION)"
	@echo "Tag $(VERSION) created. Run 'make push-tag VERSION=$(VERSION)' to push it."

push-tag: ## Push tag to remote
	@echo "Pushing tag $(VERSION)..."
	git push origin $(VERSION)
	git push origin main
	@echo "Tag $(VERSION) pushed!"

release: all ## Full release: build, test, commit, tag, and push
	@echo "Preparing release $(VERSION)..."
	git add dist/
	git commit -m "Release $(VERSION)" || true
	git tag -a $(VERSION) -m "Release $(VERSION)"
	git push origin $(VERSION)
	git push origin main
	@echo "Release $(VERSION) complete!"
