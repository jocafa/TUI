MOCHA = ./node_modules/.bin/mocha

node_modules: package.json
	@npm install
