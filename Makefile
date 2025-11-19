install:
	npm ci

postinstall:
	npm run postinstall

start:
	make -C frontend server

build:
	make -C frontend build

lint-frontend:
	make -C frontend lint