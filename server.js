'use strict';

var express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    github = require('./github'),
    Org = require('./models/orgs'),
    Repo = require('./models/repo'),
    Contrib = require('./models/contrib');

mongoose.connect('mongodb://localhost/dat-ass');

app.use(bodyParser.json());

app.use(bodyParser.json({ type: 'application/vnd.api+json'}));

app.use(bodyParser.urlencoded({extended: true}));


app.use(methodOverride('X-HTTP-Method-Override'));
var CORS = function(req, res, next) {
res.header('Access-Control-Allow-Origin', '*');
res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
res.header('Access-Control-Allow-Headers', 'Content-Type');
if ('OPTIONS' === req.method) {
  res.send(200);
}
else {
  next();
}
};
app.use(CORS);

app.get('/', function (req, res) {
    res.send('Check out Dat Ass!!!');
});

app.get('/joi', function (req, res) {
    // Org.find({"name": "hapijs"}, function (err, orgs) {
    //   var contributors = orgs[0].repos[0].contributors;
    //   contributors.forEach(function (user) {
    //     // do stuff with the user
    //     console.log(contributors[0])
    //   });
    // });
    github.importRepository('expressjs', 'session').spread((repository, repositoryStats) => {
        var organization = new Org({
          name: 'expressjs',
          repos: []
        });
        var repository = new Repo({
          name: 'session',
          contributors: []
        });
        repositoryStats.forEach(function (stat) {
            var contributor = new Contrib({
              name: stat.author.login,
              totalCommits: stat.total,
              contributions: stat.weeks
            });
            return repository.contributors.push(contributor);
        });
        Org.find({"name": organization.name}, function(err, org) {
          if (err) return handleError(err);
          if (org) {
            return;
          }
        })
        organization.repos.push(repository);
        organization.save(function (err) {
          if (err) return handleError(err);

          res.status(200).send(organization);
        });
    });
});

app.get('/octocard/:username', function (req, res) {
    var contributor = [];
    Org.find(function (err, orgs) {
      if (err) return handleError(err);
      orgs.forEach(function (organization) {
        organization.repos.forEach(function (repo) {
          repo.contributors.forEach(function (user) {
            var username = user.name.toLowerCase();
            var paramsUser = req.params.username.toLowerCase()
            if (username === paramsUser) {
              return contributor.push({
                org: organization.name,
                repo: repo.name,
                contributions: user.contributions,
                totalCommits: user.totalCommits
              })
            }
          });
        });
      });

      return res.status(200).json(contributor);
    });
})

// seeding db
// github.importRepository('hapijs', 'joi').spread((repository, repositoryStats) => {
//     var organization = new Org({
//       name: 'hapijs',
//       repos: []
//     });
//     var repository = new Repo({
//       name: 'joi',
//       contributors: []
//     });
//     repositoryStats.forEach(function (stat) {
//         var contributor = new Contrib({
//           name: stat.author.login,
//           totalCommits: stat.total,
//           contributions: stat.weeks
//         });
//         return repository.contributors.push(contributor);
//     });
//     organization.repos.push(repository);
//     organization.save(function (err) {
//       if (err) return handleError(err);
//
//       res.status(200).send(organization);
//     });
// });

app.listen('8081');
exports.module = app;
