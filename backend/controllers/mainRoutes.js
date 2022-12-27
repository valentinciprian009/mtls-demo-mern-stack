const mainRouter = require('express').Router()

mainRouter.get('/', (request, response) => {
    response.send('<h1>Hello programmers!</h1><p>This is an API (demo vers.) which is secured using mTLS!<p/>' +
        '<p>To access its functionalities please use the endpoints listed at /news<p/>')
})

module.exports = mainRouter