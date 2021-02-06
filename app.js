require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose');
const config = require('config')
const chalk = require('chalk')

//const MONGODB_URI = "mongodb://admin:admin@.localhost:27017/contact_app?authSource=admin&w=1";
const MONGODB_URI = `mongodb+srv://${config.get('db-username')}:${config.get('db-password')}@cluster0.klx6f.mongodb.net/node_blog?retryWrites=true&w=majority`;

// Import Middleware
const setMiddleware = require('./middleware/middleware')

// Import Routes
const setRoutes = require('./routes/routes')

const app = express()

// Setup View Engine
app.set('view engine', 'ejs')
app.set('views', 'views')


// Using Middleware from Middleware Dir
setMiddleware(app)

//Using Routes from Route Dir
setRoutes(app)

app.use((req, res, next) => {
    let error = new Error('404 Not Found')
    error.status = 404
    next(error)
})

app.use((error, req, res, next) => {
    if (error.status === 404) {
        return res.render('pages/errors/404')
    }
    console.log(chalk.red.inverse(error.message))
    console.log(error)
    return res.render('pages/errors/500')
})

const PORT = config.get('port') || 7070

mongoose.connect(MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {
    app.listen(PORT, () => {
        console.log(chalk.green.inverse(`Server is Running on PORT ${PORT}`))
    });
})
.catch(e => {
    console.log(e)
})