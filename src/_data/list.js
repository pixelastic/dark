const characters = require('./characters.json');
const _ = require('golgoth/lodash');

module.exports = async () => {
  const value = _.chain(characters)
    .sortBy(['lastName', 'firstName'])
    .groupBy('world')
    .value();
  return value;
};
