#!/usr/bin/env node
require('dotenv').config();
var elastic = require('../services/elasticsearch');

elastic.indices.create({
    index: process.env.ELASTICSEARCH_INDEX,
    body: {
        mappings: {
            trip: {
                properties: {
                    node_id: {
                        type: 'keyword',
                    },
                    trip_id: {
                        type: 'keyword',
                    },
                    trace: {
                        properties: {
                            t: {
                                type: 'long'
                            },
                            l: {
                                type: 'geo_point'
                            }
                        }
                    }
                }
            }
        }
    }
});