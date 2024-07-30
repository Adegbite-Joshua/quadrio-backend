const Item = require('../models/items');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();



cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const getItems = async (req, res) => {
  const items = await Item.find({});
  res.json(items);
};

const getItemById = async (req, res) => {
  const item = await Item.findById(req.params.id);

  if (item) {
    res.json(item);
  } else {
    res.status(404).json({ message: 'Item not found' });
  }
};

const createItem = async (req, res) => {
  const { name, description, price, imageBase64 } = req.body;

  try {
    const uploadResponse = await cloudinary.uploader.upload(imageBase64, {
      folder: 'items',
    });

    const item = new Item({
      name,
      description,
      price,
      imageUrl: uploadResponse.secure_url,
    });
    console.log(uploadResponse);

    const createdItem = await item.save();
    console.log(createdItem);
    res.status(201).json(createdItem);
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
};

const updateItem = async (req, res) => {
  const { name, description, price } = req.body;

  const item = await Item.findById(req.params.id);

  if (item) {
    item.name = name;
    item.description = description;
    item.price = price;

    const updatedItem = await item.save();
    res.json(updatedItem);
  } else {
    res.status(404).json({ message: 'Item not found' });
  }
};

const deleteItem = async (req, res) => {
  const item = await Item.findByIdAndDelete(req.params.id);

  if (item) {
    res.json({ message: 'Item removed' });
  } else {
    res.status(404).json({ message: 'Item not found' });
  }
};

const addRatingAndComment = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { user, rating, comment } = req.body;

    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    item.ratingComments.push({ user, rating, comment });

    await item.save();

    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { getItems, getItemById, createItem, updateItem, deleteItem, addRatingAndComment }