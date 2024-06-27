const express = require('express');
const router = express.Router();
const Gun = require('../models/Gun');
const { verifyToken } = require('../middleware/authMiddleware');


// Middleware to get gun by ID
async function getGun(req, res, next) {
  let gun;
  try {
    gun = await Gun.findById(req.params.id);
    if (!gun) {
      return res.status(404).json({ message: 'Cannot find gun' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.gun = gun;
  next();
}

// Get all guns
router.get('/', verifyToken, async (req, res) => {
  try {
    const guns = await Gun.find();
    res.json(guns);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a gun by ID
router.get('/:id', getGun, (req, res) => {
  res.json(res.gun);
});

// Create a new gun
router.post('/', async (req, res) => {
  const gun = new Gun({
    id: req.body.id,
    name: req.body.name,
    author: req.body.author,
    price: req.body.price,
    picURL: req.body.picURL,
    describe: req.body.describe,
    isInStock: req.body.isInStock,
    type: req.body.type,
    origin: req.body.origin,
  });
  try {
    const newGun = await gun.save();
    res.status(201).json(newGun);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a gun by ID
router.put('/:id', getGun, async (req, res) => {
  try {
    res.gun.name = req.body.name;
    res.gun.author = req.body.author;
    res.gun.price = req.body.price;
    res.gun.picURL = req.body.picURL;
    res.gun.describe = req.body.describe;
    res.gun.isInStock = req.body.isInStock;
    res.gun.type = req.body.type;
    res.gun.origin = req.body.origin;

    const updatedGun = await res.gun.save();
    res.json(updatedGun);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a gun by ID
router.delete('/:id', getGun, async (req, res) => {
  try {
    await res.gun.deleteOne();
    res.json({ message: 'Deleted Gun' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Search guns by name or type
router.get('/search', async (req, res) => {
  try {
    const query = req.query.q;
    const guns = await Gun.find({
      $or: [
        { name: { $regex: query, $options: 'i' } }, // case-insensitive name search
        { type: { $regex: query, $options: 'i' } }, // case-insensitive type search
      ]
    });
    res.json(guns);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get paginated list of guns
router.get('/page/:pageNum', async (req, res) => {
  const pageSize = 10; // number of items per page
  const pageNum = req.params.pageNum || 1; // page number (default: 1)
  try {
    const guns = await Gun.find()
      .skip((pageNum - 1) * pageSize)
      .limit(pageSize)
      .exec();
    res.json(guns);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get sorted list of guns
router.get('/sort/:field/:order', async (req, res) => {
  const { field, order } = req.params;
  const sortOrder = order === 'desc' ? -1 : 1;
  try {
    const guns = await Gun.find().sort({ [field]: sortOrder });
    res.json(guns);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get count of guns
router.get('/count', async (req, res) => {
  try {
    const count = await Gun.countDocuments();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get guns by availability
router.get('/availability/:status', async (req, res) => {
  const { status } = req.params;
  try {
    const isInStock = status === 'inStock'; // check if guns are in stock
    const guns = await Gun.find({ isInStock });
    res.json(guns);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;