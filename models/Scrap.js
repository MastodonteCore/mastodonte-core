const mongoose = require('mongoose');

const scrapSchema = new mongoose.Schema({
  name: String,
  url: String,
  fields: Array
})

const Scrap = mongoose.model('Scrap', scrapSchema);

module.exports = Scrap;