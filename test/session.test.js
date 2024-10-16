const express = require('express')
const session = require('express-session')
const pgSession = require('connect-pg-simple')(session)
const pool = require('../config/database') // Path to your database config
const sessionMiddleware = require('../config/session') // Path to your session config

const request = require('supertest')
const { expect } = require('chai')

describe('Session Management', function () {
    let app

    before(function () {
        app = express()

        app.use(sessionMiddleware)

        app.get('/set-session', (req, res) => {
            req.session.userId = 12345
            res.send('Session set')
        })

        app.get('/get-session', (req, res) => {
            if (req.session.userId) {
                res.json({ userId: req.session.userId })
            } else {
                res.status(404).send('No session found')
            }
        })
    })

    after(function (done) {
        pool.end(done)
    })

    it('should store session in PostgreSQL and retrieve it', function (done) {
        const agent = request.agent(app)

        agent
            .get('/set-session')
            .expect(200, 'Session set')
            .end(function (err) {
                if (err) return done(err)

                agent
                    .get('/get-session')
                    .expect(200)
                    .end(function (err, res) {
                        if (err) return done(err)

                        expect(res.body).to.deep.equal({ userId: 12345 })
                        done()
                    })
            })
    })

    it('should return 404 when session does not exist', function (done) {
        request(app)
            .get('/get-session')
            .expect(404, 'No session found')
            .end(done)
    })
})
