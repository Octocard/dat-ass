var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var repoSchema = new Schema({
  name: String,
  contributors: []
});

var Repo = mongoose.model('Repo', repoSchema);

module.exports = Repo;
