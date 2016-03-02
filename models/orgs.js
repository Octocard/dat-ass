var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var orgSchema = new Schema({
  name: String,
  repos: [],
});

var Org = mongoose.model('Org', orgSchema);

module.exports = Org;
