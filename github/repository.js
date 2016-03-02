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

    function getAllRepositoryStatistics(repository, page) {
        const username = process.env.GITHUB_USERNAME;
        const password = process.env.GITHUB_PASSWORD || process.env.GITHUB_ACCESS_TOKEN;
        return request({
            method: 'GET',
            uri: ('https://api.github.com/repos/{user}/{repo}/stats/contributors?page=' + page)
                .replace('{user}', repository.organization.login)
                .replace('{repo}', repository.name),
            json: true,
            headers: {
                Authorization: "Basic " + new Buffer(username + ":" + password, "ascii").toString("base64"),
                'User-Agent': 'Dat-Ass-Inspector'
            }
        }).then((statistics) => {
            return [repository,
                statistics.map((contributor) => {
                    contributor.weeks = contributor.weeks.filter((week) => {
                        return week.a > 0 || week.c > 0 || week.d > 0;
                    }).map((week) => {
                        return {
                            linesAdded: week.a,
                            linesDeleted: week.d,
                            numCommits: week.c,
                            startDayOfWeek: new Date(week.w * 1000)
                        };
                    });
                    return contributor;
                }).filter((contributor) => {
                    return contributor.weeks.length > 0;
                })
            ];
        });
        // The stats API doesn't paginate for some reason...
        //     .spread((repository, stats) => {
        //     if (stats.length === 100) {
        //         return getAllRepositoryStatistics(repository, page + 1)
        //             .spread((respository, moreStats) => {
        //                 return [repository, stats.concat(moreStats)];
        //             });
        //     }
        //     return [repository, stats];
        // });
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
            return getAllRepositoryStatistics(repository, 0);
        }
    };
}());