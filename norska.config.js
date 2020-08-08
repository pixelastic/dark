const characters = require('./src/_data/characters.json');
const _ = require('golgoth/lib/lodash');
const pMap = require('golgoth/lib/pMap');

module.exports = {
  hooks: {
    async afterHtml({ createPage }) {
      await pMap(characters, async (data) => {
        const id = _.camelCase(
          `${data.year}-${data.lastName}-${data.firstName}-${data.id}`
        );
        const template = '_includes/templates/card.pug';
        const destination = `cards/${id}/index.html`;
        await createPage(template, destination, { character: data });
      });
    },
  },
};
