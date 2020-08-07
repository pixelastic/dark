const characters = require('../../lib/data.json');
const _ = require('golgoth/lib/lodash');

module.exports = async () => {
  const value = _.chain(characters)
    .map((character) => {
      const [firstName, lastName] = _.words(character.name);
      return {
        ...character,
        firstName,
        lastName,
      };
    })
    .sortBy(['lastName', 'firstName'])
    .groupBy('world')
    .value();
  console.info(value);
  return value;
};
