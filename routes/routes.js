const authRoutes = require('./authRouter')
const dashboardRoutes = require('./dashboardRouter')
const uploadRoutes = require('./uploadRoutes')
const postRoutes = require('./postRoutes')
const apiRoutes = require('../api/routes/apiRoutes')
const explorerRoutes = require('./explorerRoutes')
const searchRoutes = require('./searchRotes')
const authorRoutes = require('./authorRoutes')

// Playground Routes
// const validatorRoutes = require('../playground/validator') // TODO:: Should be Remove
const fileUploadRoutes = require('../playground/play') // TODO:: Should be Remove

const routes = [
    {
        path: '/api',
        handler: apiRoutes
    },
    {
        path: '/auth',
        handler: authRoutes
    },
    {
        path: '/dashboard',
        handler: dashboardRoutes
    },
    {
        path: '/uploads',
        handler: uploadRoutes
    },
    {
        path: '/posts',
        handler: postRoutes
    },
    {
        path: '/explorer',
        handler: explorerRoutes
    },
    {
        path: '/search',
        handler: searchRoutes
    },
    {
        path: '/author',
        handler: authorRoutes
    },
    { // TODO:: Should be Remove
        path: '/playground',
        handler: fileUploadRoutes // validatorRoutes
    },
    {
        path: '/',
        handler: (req, res) => {
            res.redirect('/explorer')
        }
    },
]

module.exports = app => {
    routes.forEach(r => {
        if(r.path === '/') {
            app.get(r.path, r.handler)
        } else {
            app.use(r.path, r.handler)
        }
    })
}