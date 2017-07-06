var chai = require('chai');
var chaiHttp = require('chai-http');
var app = require('../bin/www');
var expect = chai.expect;

var redis = require('../services/redis');
chai.use(chaiHttp);

describe('App', function() {
    beforeEach(function () {
        return redis.client().flushdbAsync();
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
                    id: 1,
                    location: {
                        lon: 12.12001,
                        lat: 12.13001,
                    }
                }).end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res).to.have.property('body');
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.property('result');
                    expect(res.body.result).to.be.an('object');
                    chai.request(app)
                        .get('/location').query({id: 1}).end(function (err, res) {
                            expect(res).to.have.status(200);
                            expect(res.body.result).to.be.an('object');
                            done();
                    });
            })
        })
    })
});
