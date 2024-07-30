const express = require('express');
const {
  getItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  addRatingAndComment,
} = require('../controllers/item.controller');

const router = express.Router();

router.get('/', getItems);
router.post('/', createItem);
router.get('/:id', getItemById);
router.put('/:id', updateItem);
router.delete('/:id', deleteItem);
router.post('/:itemId/rating-comment', addRatingAndComment);

module.exports = router;
