const express = require('express')
const app = express()
const session = require('express-session')
const bodyParser = require('body-parser')
const pug = require('pug')

// define middleware functions
let PP = {
    session: 
        function(options) {
            return session({
                secret: 'passwordProtected',
                resave: false,
                saveUninitialized: true,
                unset: 'destroy',
                name: 'passwordProtected',
                cookie: {
                    maxAge: (options.maxAge) ? options.maxAge : (1000 * 60 * 60 * 24) // default is 1 day
                }
            })
        },   
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
			// check if logged in using session, continue to other express routes in app    		
    		if(req.session.PP && req.session.PP.loggedIn) {
    			next()
    		}
			// attempting to login using password protected login form; check username and password; if so, let proceed and save loggedIn as true   		
			else if(req.body && (req.body.PPU1 == req.session.PP.username) && (req.body.PPP1 == req.session.PP.password)) {
				req.session.PP.loggedIn = true
				next()
			}
			// deny access
			else {
				res.send(pug.renderFile(__dirname + '/loginPage.pug'))
			}		

    	}
}

// return multiple middleware functions as array inside function with options parameter
module.exports = function(options) {
  return [bodyParser.urlencoded({extended: true}), PP.session(options), PP.configure(options), PP.login]
}
