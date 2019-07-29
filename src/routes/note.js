'use strict';

const express = require('express');
const router = express.Router();
const NoteSchema = require('../models/note');
const auth = require('../helpers/auth');

router.use('/notes', auth.isAuthenticated);

router.get('/notes/add', (req, res) => {
  res.render('notes/new-note');
});

router.post('/notes/new-note', (req, res) => {
  const { title, description } = req.body;
  const errors = [];

  if (!title) {
    errors.push({ text: 'Please write a title' });
  }

  if (!description) {
    errors.push({ text: 'Please write a description' });
  }

  if (errors.length) {
    return res.render('notes/new-note', { errors, title, description });
  }

  const note = new NoteSchema({ title, description });

  note.user = req.user.id;

  note.save()
    .then(() => {
      req.flash('successMsg', 'Note Added Successfully');
      res.redirect('/notes');
    });
});

router.get('/notes', (req, res) => {
  NoteSchema.find({ user: req.user.id }).sort({ date: 'desc' })
    .then(notes => res.render('notes/all-notes', { notes }));
});

router.get('/notes/edit/:id', (req, res) => {
  NoteSchema.findById(req.params.id)
    .then(note => res.render('notes/edit-note', { note }));
});

router.put('/notes/edit-note/:id', (req, res) => {
  const { title, description } = req.body;

  NoteSchema.findByIdAndUpdate(req.params.id, { title, description })
    .then(() => {
      req.flash('successMsg', 'Note Updated Successfully');
      res.redirect('/notes');
    });
});

router.delete('/notes/delete/:id', (req, res) => {
  NoteSchema.findByIdAndDelete(req.params.id)
    .then(() => {
      req.flash('successMsg', 'Note Deleted Successfully');
      res.redirect('/notes');
    });
});

module.exports = router;
