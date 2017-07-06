var elasticsearch = require('elasticsearch');

var client = new elasticsearch.Client({
    host: process.env.ELASTICSEARCH_ENDPOINT,
    log: 'trace'
});

module.exports = client;