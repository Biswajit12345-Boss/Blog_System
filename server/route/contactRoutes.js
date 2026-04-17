const express = require('express');
const router = express.Router();
const Contact = require('../model/Contact');

router.post('/', async (req, res) => {
  try {
    const contact = await Contact.create(req.body);
    res.status(201).json({ message: 'Message sent', data: contact });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find({}).sort({ createdAt: -1 });
    res.json({ data: contacts });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
