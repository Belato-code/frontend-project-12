install:
	npm ci

postinstall:
	npm run postinstall

start:
	make -C frontend server


lint-frontend:
	make -C frontend lint