install:
	npm ci

postinstall:
	npm run postinstall

start:
	npx start-server -s ./frontend/dist

build:
	make -C frontend build

lint-frontend:
	make -C frontend lint