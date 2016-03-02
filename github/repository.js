'use strict';
(function () {
    const Promise = require('bluebird');
    const request = require('request-promise');

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
        },
        getPublicRepository: (github, organizationName, repositoryName) => {
            return github.repos.getAsync({
                user: organizationName,
                repo: repositoryName
            });
        },
        getStatistics: (repository) => {
            const username = process.env.GITHUB_USERNAME;
            const password = process.env.GITHUB_PASSWORD || process.env.GITHUB_ACCESS_TOKEN;
            return request({
                method: 'GET',
                uri: 'https://api.github.com/repos/{user}/{repo}/stats/contributors'
                    .replace('{user}', repository.organization.login)
                    .replace('{repo}', repository.name),
                json: true,
                headers: {
                    Authorization: "Basic " + new Buffer(username + ":" + password, "ascii").toString("base64"),
                    'User-Agent': 'Dat-Ass-Inspector'
                }
            }).then((statistics) => {
                return statistics.map((contributor) => {
                   contributor.weeks = contributor.weeks.filter((week) => {
                        return week.a > 0 || week.c > 0 || week.d > 0;
                   });
                    return contributor;
                }).filter((contributor) => {
                    return contributor.weeks.length > 0;
                });
            });
        }
    };
}());