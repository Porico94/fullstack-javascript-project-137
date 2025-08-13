install:
	npm install

start:
	npm run start

build:
	npm run build

test:
	npm test -s

test-coverage:
	npm test -- --coverage

lint:
	npx eslint .

lint-fix:
	npx eslint . --fix