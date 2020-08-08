const mql = require('@microlink/mql');
const download = require('firost/lib/download');
const exists = require('firost/lib/exists');
const pMap = require('golgoth/lib/pMap');
const characters = require('./src/_data/characters.json');
const _ = require('golgoth/lib/lodash');

(async () => {
  await pMap(
    [characters[6]],
    async (character) => {
      const id = _.camelCase(
        `${character.year}-${character.lastName}-${character.firstName}-${character.id}`
      );
      const cardUrl = `https://projects.pixelastic.com/dark/cards/${id}/index.html`;
      console.info(cardUrl);
      try {
        const { data } = await mql(cardUrl, {
          screenshot: true,
          force: true,
          waitUntil: 'networkidle1',
          element: '.__card',
        });
        console.info(data.screenshot);
        const url = data.screenshot.url;
        const card = `./cards/${id}.png`;
        if (!(await exists(card))) {
          await download(url, card);
        }
      } catch (err) {
        console.info('Microlin error');
        console.info(err);
      }
    },
    { concurrency: 2 }
  );
})();
