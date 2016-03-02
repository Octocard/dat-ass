var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var contribSchema = new Schema({
  name: String,
  contributions: [],
  totalCommits: Number
});

var Contrib = mongoose.model('Contrib', contribSchema);

module.exports = Contrib;
