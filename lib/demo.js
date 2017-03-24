'use strict';

const errorHandler = require('../helpers/errorHandler');
const request = require('supertest-as-promised');
const Promise = require('bluebird');

let cachedResponse = {};
function simpleFunction(id) {
  if(id === undefined || (typeof id !== 'number')) {
    return 'Invalid input';
  }
  if (id === 0) {
    const errorObject = {
      message: 'Zero value for id is not acceptable'
    };
    const returnValue = errorHandler.format(errorObject);
    return returnValue;
  }
  if(cachedResponse[id]) {
    return new Promise((resolve, reject) => {
      return resolve(cachedResponse[id]);
    });
  } else {
    return request('https://jsonplaceholder.typicode.com')
      .get('/comments')
      .query({
        id
      })
      .expect(200)
      .then(response => {
        cachedResponse[id] = response.body;
        return response.body;
      });
  }
}

module.exports = {
  simpleFunction
};



