'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

const app = require('../server');
const { TEST_MONGODB_URI } = require('../config');

const Tag = require('../models/tag');

const tagNotes = require('../db/seed/tags');

const expect = chai.expect;
chai.use(chaiHttp);


describe('Noteful Tag Tests', function() {

  before(function () {
    this.timeout(5000);
    return mongoose.connect(TEST_MONGODB_URI, {connectTimeoutMS: 4000})
      .then(() => mongoose.connection.db.dropDatabase());
  });

  beforeEach(function () {
    return Tag.insertMany(tagNotes);
  });

  afterEach(function () {
    return mongoose.connection.db.dropDatabase();
  });

  after(function () {
    return mongoose.disconnect();
  });



  describe('GET /api/tags', function() {
    it('should return all existing tags with the correct fields', function() {
      return Promise.all([
        Tag.find(),
        chai.request(app).get('/api/tags')
      ])
        .then(([data, res]) => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          expect(res.body).to.have.length(data.length);
          res.body.forEach(function (item, i) {
            expect(item).to.be.a('object');
            expect(item).to.have.keys('id', 'name', 'createdAt', 'updatedAt');
          });
        });
    });


    
  });

  describe('GET /api/tags/:id', function() {
    it('should return correct tag', function () {
      let data;
      // 1) First, call the database
      return Tag.findOne()
        .then(_data => {
          data = _data;
          // 2) then call the API with the ID
          return chai.request(app).get(`/api/tags/${data.id}`);
        })
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;

          expect(res.body).to.be.an('object');
          expect(res.body).to.have.keys('id', 'name', 'createdAt', 'updatedAt');

          // 3) then compare database results to API response
          expect(res.body.id).to.equal(data.id);
          expect(res.body.name).to.equal(data.name);
          expect(new Date(res.body.createdAt)).to.eql(data.createdAt);
          expect(new Date(res.body.updatedAt)).to.eql(data.updatedAt);
        });
    });

    it('should respond with a 400 for an invalid id', function () {
      return chai.request(app)
        .get('/api/tags/NOT-A-VALID-ID')
        .then(res => {
          expect(res).to.have.status(400);
          expect(res.body.message).to.eq('The `id` is not valid');
        });
    });
  });
  
  
  describe('POST /api/tags', function () {
    it('should create and return a new tag when provided valid data', function () {
      const newItem = {
        'name': 'Random'
      };

      let res;
      // 1) First, call the API
      return chai.request(app)
        .post('/api/tags')
        .send(newItem)
        .then(function (_res) {
          res = _res;
          expect(res).to.have.status(201);
          expect(res).to.have.header('location');
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.keys('id', 'name', 'createdAt', 'updatedAt');
          // 2) then call the database
          return Tag.findById(res.body.id);
        })
        // 3) then compare the API response to the database results
        .then(data => {
          expect(res.body.id).to.equal(data.id);
          expect(res.body.name).to.equal(data.name);
          expect(new Date(res.body.createdAt)).to.eql(data.createdAt);
          expect(new Date(res.body.updatedAt)).to.eql(data.updatedAt);
        });
    });

    it('should return an error when missing "name" field', function () {
      const newItem = { 'foo': 'bar' };
      return chai.request(app)
        .post('/api/tags')
        .send(newItem)
        .then(res => {
          expect(res).to.have.status(400);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body.message).to.equal('Missing `name` in request body');
        });
    });
  });

  describe('PUT /api/tags/:id', function() {
    it('should update the tag', function() {
      const updateItem = {
        'name': 'New Tag!',
      };
      let data;
      // 1) First, call the database
      return Tag.findOne()
        .then(_data => {
          data = _data;
          // 2) then call the API with the ID
          return chai.request(app)
            .put(`/api/tags/${data.id}`)
            .send(updateItem);
        })
        .then(function (res) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.keys('id', 'name', 'createdAt', 'updatedAt');
          expect(res.body.id).to.equal(data.id);
          expect(res.body.name).to.equal(updateItem.name);
        });
    });

    it('should respond with a 400 for an invalid id', function () {
      const updateItem = { 'name': 'Blah' };
      return chai.request(app)
        .put('/api/tags/NOT-A-VALID-ID')
        .send(updateItem)
        .then(res => {
          expect(res).to.have.status(400);
          expect(res.body.message).to.eq('The `id` is not valid');
        });
    });
  });

  describe('DELETE  /api/tags/:id', function() {
    it('should delete an item by id', function () {
      let data;
      return Tag.findOne()
        .then(_data => {
          data = _data;
          return chai.request(app).delete(`/api/tags/${data.id}`);
        })
        .then(function (res) {
          expect(res).to.have.status(204);
          expect(res.message).to.equal(undefined);
        });
    });

    it('should respond with status 400 and an error message when `id` is not valid', function() {
      return chai.request(app)
        .delete('/api/tags/NOT-A-VALID-ID')
        .then(res => {
          expect(res).to.have.status(400);
          expect(res.body.message).to.eq('The `id` is not valid');
        });
    });
  });
});