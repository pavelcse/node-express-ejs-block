//require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session);
const flash = require('connect-flash')
const config = require('config')

const {bindUserWithRequest} = require('./authMiddleware')
const setLocals = require('./setLocals')

//const MONGODB_URI = "mongodb://admin:admin@.localhost:27017/contact_app?authSource=admin&w=1";
const MONGODB_URI = `mongodb+srv://${config.get('db-username')}:${config.get('db-password')}@cluster0.klx6f.mongodb.net/node_blog?retryWrites=true&w=majority`;

const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions',
    expires: 1000 * 60 * 60 * 2
});


const middleware = [
    morgan('dev'),
    express.static('public'),
    express.urlencoded({extensions: true}),
    express.json(),
    session({
        secret: config.get('secret') || 'SECRET_KEY',
        resave: false,
        saveUninitialized: false,
        store: store
    }),
    flash(),
    bindUserWithRequest(),
    setLocals()
]

module.exports = app => {
    middleware.forEach(m => {
        app.use(m)
    })
}