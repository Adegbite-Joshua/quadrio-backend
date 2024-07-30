const mongoose = require('mongoose');

const RatingCommentSchema = new mongoose.Schema({
  user: { type: String, required: true },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
});

const ItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  imageUrl: { type: String },
  ratingComments: [RatingCommentSchema],
});

const Item = mongoose.model('Item', ItemSchema);

module.exports = Item;
