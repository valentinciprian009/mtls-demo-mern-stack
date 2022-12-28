const newsRouter = require('express').Router()
const config = require('../config/config')

const getRemainingTime = date => {
    const expiry = new Date(date).valueOf()
    const now = new Date().valueOf()
    return expiry - now
}

newsRouter.get('/', (request, response) => {
    response.send('<h1>News</h1><p>Here you can find the latest news from the MTA<p/>' +
        '<p>To access the news please use the endpoints listed below<p/>' +
        '<p>/news/public - for everyone<p/>' +
        '<p>/news/private - for MTA employees<p/>' +
        '<p>/news/admin - for MTA admins<p/>')
})

newsRouter.get('/admin', (request, response) => {
    if(request.socket.getPeerCertificate().subject.O !== 'MTA' ||
        request.socket.getPeerCertificate().subject.OU !== 'Master-Admin' ||
        request.socket.getPeerCertificate().subject.CN !== 'mtls-demo') {
        response.status(403).send('You are not authorized to access this resource');
        return;
    }

    if(getRemainingTime(request.socket.getPeerCertificate().valid_to) <= 0) {
        response.status(403).send('You are not authorized to access this resource because your certificate is expired');
        return;
    }

    response.sendFile('admin_news.json', { root: './resources' })
})

newsRouter.get('/public', (request, response) => {
    response.sendFile('public_news.json', { root: './resources' })
})

newsRouter.get('/private', (request, response) => {
    if(request.socket.getPeerCertificate().subject.O !== 'MTA' ||
    !(request.socket.getPeerCertificate().subject.OU === 'Master-Admin' || request.socket.getPeerCertificate().subject.OU === 'Master-Private') ||
        request.socket.getPeerCertificate().subject.CN !== 'mtls-demo') {
        response.status(403).send('You are not authorized to access this resource');
        return;
    }

    if(getRemainingTime(request.socket.getPeerCertificate().valid_to) <= 0) {
        response.status(403).send('You are not authorized to access this resource because your certificate is expired');
        return;
    }

    response.sendFile('private_news.json', { root: './resources' })
})

module.exports = newsRouter