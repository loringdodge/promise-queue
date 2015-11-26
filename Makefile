default: server watch

server:
	cd dev && python -m SimpleHTTPServer

watch:
	node_modules/watchify/bin/cmd.js src/main.js -o dev/bundle.js

test:
	node test/test.js | faucet