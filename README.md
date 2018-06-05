# express-password-protected

Simple password protection middleware for Express intended for development purposes.

Can be used in your Express Routes before the routes you need to protect.

maxAge is the duration of the cookie used to store your session, in milliseconds. Defaults to 1 day.

Example Usage

```sh
const app = require('express')()
const session = require('express-session')
const passwordProtected = require('express-password-protect')

const config = {
	username: "john",
	password: "1234",
	maxAge: 60000 // 1 minute
}

app.use(passwordProtected(config))

app.use(function(req, res) {
	res.send(200)
})

app.listen(3000, function() {
	console.log("listening on port 3000")
})
```