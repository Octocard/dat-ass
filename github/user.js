'use strict';
(function() { 
    const Github = require('github');
    const Promise = require('bluebird');

    var github = new Github({
        // required
        version: '3.0.0',
        debug: false,
        protocol: 'https',
        host: 'api.github.com',
        timeout: 5000,
        headers: {
            'user-agent': 'Dat-Ass-Crawler' // GitHub is happy with a unique user agent
        }
    });

    function authenticate() {
        return new Promise(function (resolve) {
            github.authenticate({
                type: 'basic',
                username: process.env.GITHUB_USERNAME,
                password: process.env.GITHUB_PASSWORD || process.env.GITHUB_ACCESS_TOKEN
            });
            resolve();
        });
    }

}());