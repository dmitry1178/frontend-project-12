start-frontend:
	make -C frontend start

start-backend:
	npx start-server

start:
	make start-backend & make start-frontend

deploy:
	git push heroku master

lint-frontend:
	make -C frontend lint

install:
	npm install & npm ci

build:
	npm run build
	npm run start