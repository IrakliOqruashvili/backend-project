const mongoose = require('mongoose');

const gunSchema = new mongoose.Schema({
  name: { type: String, required: true },
  author: String,
  price: Number,
  picURL: String,
  describe: String,
  isInStock: Boolean,
  type: String,
  origin: String,
});

const Gun = mongoose.model('Gun', gunSchema);

module.exports = Gun;
