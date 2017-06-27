var chai = require('chai');
var chaiHttp = require('chai-http');
var app = require('../bin/www');
var expect = chai.expect;

var redis = require('redis');
var client = redis.createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    db: process.env.REDIS_DB
});

chai.use(chaiHttp);

describe('App', function() {
    beforeEach(function () {
        client.flushdb();
    });
    describe('GET /', function() {
        it('responds with status 200', function(done) {
            chai.request(app)
                .get('/')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body.result).to.equal('Location service up and running!');
                    done();
                });
        });
    });

    describe('POST /location', function () {
        it('respods with status 200', function(done) {
            chai.request(app)
                .post('/location').send({
                    node: 1,
                    location: {
                        lon: 12.12001,
                        lat: 12.13001,
                    }
                }).end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res).to.have.property('body');
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.property('result');
                    expect(res.body.result).to.equal(1);
                    chai.request(app)
                        .get('/location').query({node: 1, n: 2}).end(function (err, res) {
                            expect(res).to.have.status(200);
                            expect(res.body.result).to.have.lengthOf(1);
                            done();
                    });
            })
        })
    })
});
