'use strict';
(function () {
    const Promise = require('bluebird');
    const Repository = require('./repository');

    module.exports = {
        importUser: (github, username) => {
            return github.user.getAsync({
                    username: username
                })
                .then((res) => {
                    // User exists, let's grab their Public Repos.
                    return Repository.getPublicRepositories(github, res);
                })
                .then((repositories) => {
                    debugger;
                });
        }
    };
}());