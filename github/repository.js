'use strict';
(function () {
    const Promise = require('bluebird');

    function getAllPublicRepositories(github, username, page) {
        return github.repos.getFromUserAsync({
            user: username,
            page: page,
            per_page: 100
        }).then((res) => {
            debugger;
        });
    }

    module.exports = {
        getPublicRepositories: (github, user) => {
            return getAllPublicRepositories(github, user.login);
        }
    };
}());