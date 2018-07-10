'use strict';

const express = require('express');
const mongoose = require('mongoose');
const { MONGODB_URI } = require('../config');
const Note = require('../models/note');
const router = express.Router();

/* ========== GET/READ ALL ITEMS ========== */
router.get('/', (req, res, next) => {
  mongoose.connect(MONGODB_URI)
    .then(() => {
      const {searchTerm} = req.query;
      let filter = {};
      
      if (searchTerm) {
        filter.title = new RegExp(searchTerm, 'i');
        //filter.$or = [{ 'title': { $regex: searchTerm } }, { 'content': { $regex: searchTerm } }];
      }

      return Note.find(filter).sort({ updatedAt: 'desc' });
    })    
    .then(results => {
      res.json(results);
    })
    .then(() => {
      return mongoose.disconnect();
    })
    .catch(err => {
      console.error(`ERROR: ${err.message}`);
      console.error(err);
    });

});

/* ========== GET/READ A SINGLE ITEM ========== */
router.get('/:id', (req, res, next) => {
  mongoose.connect(MONGODB_URI)
    .then(() => {
      const searchId = req.params.id;

      return Note.findById(searchId);
    })
    .then(results => {
      res.json(results);
    })
    .then(() => {
      return mongoose.disconnect();
    })
    .catch(err => {
      console.error(`ERROR: ${err.message}`);
      console.error(err);
    });

});

/* ========== POST/CREATE AN ITEM ========== */
router.post('/', (req, res, next) => {

  mongoose.connect(MONGODB_URI)
    .then(() => {
      const { title, content} = req.body;
      const newNote = {
        title: title,
        content: content
      };

      return Note.create(newNote);
    })
    .then(results => {
      res.json(results);
    })
    .then(() => {
      return mongoose.disconnect();
    })
    .catch(err => {
      console.error(`ERROR: ${err.message}`);
      console.error(err);
    });

});

/* ========== PUT/UPDATE A SINGLE ITEM ========== */
router.put('/:id', (req, res, next) => {
  mongoose.connect(MONGODB_URI)
    .then(() => {
      const updateId = req.params.id;
      const { title, content } = req.body;
      const updateNote = {
        title: title,
        content: content
      };
      return Note.findByIdAndUpdate(updateId, updateNote, {new: true});
    })
    .then(results => {
      res.json(results);
    })
    .then(() => {
      return mongoose.disconnect();
    })
    .catch(err => {
      console.error(`ERROR: ${err.message}`);
      console.error(err);
    });

});

/* ========== DELETE/REMOVE A SINGLE ITEM ========== */
router.delete('/:id', (req, res, next) => {

  mongoose.connect(MONGODB_URI)
    .then(() => {
      const deleteId = req.params.id;

      return Note.findByIdAndRemove(deleteId);
    })
    .then(() => {
      res.status(204).end();
    })
    .then(() => {
      return mongoose.disconnect();
    })
    .catch(err => {
      console.error(`ERROR: ${err.message}`);
      console.error(err);
    });
});

module.exports = router;