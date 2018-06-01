const express = require('express')
const app = express()
const session = require('express-session')
const bodyParser = require('body-parser')
// define middleware functions
let PP = {
    session: 
    	session({
			secret: 'passwordProtected',
			resave: false,
			saveUninitialized: true,
			unset: 'destroy',
			name: 'passwordProtected',
			cookie: {
				maxAge: 1000 * 60 * 60 * 24 // 1 day
			}
		}),
    configure: 
    	function(options) {
    		return function(req, res, next) {
    			if(!req.session.PP) {
    				req.session.PP = {
    					username: options.username,
    					password: options.password,
    					loggedIn: false
    				}
    			}
				next()    			
    		}
    	},    
    login: 
    	function(req, res, next) {
    		console.log("body   ", req.body)
			// check if logged in using session, continue to other express routes in app    		
    		if(req.session.PP && req.session.PP.loggedIn) {
				console.log('logged in already')
    			next()
    		}
			// attempting to login using password protected login form; check username and password; if so, let proceed and save loggedIn as true   		
			else if(req.body && (req.body.PPU1 == req.session.PP.username) && (req.body.PPP1 == req.session.PP.password)) {
				req.session.PP.loggedIn = true
				console.log('logged in just now')
				next()
			}
			// deny access
			else {
				console.log('denied access')
				res.send('<html><body><form method="post" action="/login"><input type="text" name="PPU1"/><input type="text" name="PPP1" value="test"/><button type="submit"></form>')
			}		

    	}
}

// return multiple middleware functions as array inside function with options parameter
module.exports = function(options) {
  return [bodyParser.urlencoded({extended: true}), PP.session, PP.configure(options), PP.login]
}
