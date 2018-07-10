'use strict';

const mongoose = require('mongoose');
const { MONGODB_URI } = require('../config');

const Note = require('../models/note');

//Find/Search for notes using Note.find

mongoose.connect(MONGODB_URI)
  .then(() => {
    const searchTerm = /lady gaga/i;
    let filter = {};

    if (searchTerm) {
      filter.title = { $regex: searchTerm };
    }
    console.log('FILTER', filter);

    return Note.find(filter).sort({ updatedAt: 'desc' });
  })    
  .then(results => {
    console.log(results);
  })
  .then(() => {
    return mongoose.disconnect();
  })
  .catch(err => {
    console.error(`ERROR: ${err.message}`);
    console.error(err);
  });

//Find note by id using Note.findById

// mongoose.connect(MONGODB_URI)
//   .then(() => {
//     const searchId = '000000000000000000000004';

//     return Note.findById(searchId);
//   })
//   .then(results => {
//     console.log(results);
//   })
//   .then(() => {
//     return mongoose.disconnect();
//   })
//   .catch(err => {
//     console.error(`ERROR: ${err.message}`);
//     console.error(err);
//   });

//Create a new note using Note.create

// mongoose.connect(MONGODB_URI)
//   .then(() => {
//     const newNote = {
//       title: 'Adding a new note',
//       content: 'Adding the best content.'
//     };

//     return Note.create(newNote);
//   })
//   .then(results => {
//     console.log(results);
//   })
//   .then(() => {
//     return mongoose.disconnect();
//   })
//   .catch(err => {
//     console.error(`ERROR: ${err.message}`);
//     console.error(err);
//   });

//Update a note by id using Note.findByIdAndUpdate

// mongoose.connect(MONGODB_URI)
//   .then(() => {
//     const updateId = '000000000000000000000004';
//     const updateNote = {
//       title: 'Updating a note',
//       content: 'SEEING THAT I UPDATED AGAIN ONCE AGAIN.'
//     };
//     return Note.findByIdAndUpdate(updateId, updateNote, {new: true});
//   })
//   .then(results => {
//     console.log(results);
//   })
//   .then(() => {
//     return mongoose.disconnect();
//   })
//   .catch(err => {
//     console.error(`ERROR: ${err.message}`);
//     console.error(err);
//   });

//Delete a note by id using Note.findByIdAndRemove

// mongoose.connect(MONGODB_URI)
//   .then(() => {
//     const deleteId = '000000000000000000000005';

//     return Note.findByIdAndRemove(deleteId);
//   })
//   .then(results => {
//     console.log(results);
//   })
//   .then(() => {
//     return mongoose.disconnect();
//   })
//   .catch(err => {
//     console.error(`ERROR: ${err.message}`);
//     console.error(err);
//   });


