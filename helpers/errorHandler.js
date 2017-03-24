'use strict';

function format(error) {
  return `Error occurred: ${error.message}`;
}

module.exports = {
  format
}