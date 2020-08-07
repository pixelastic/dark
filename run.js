const pMap = require('golgoth/lib/pMap');
// const read = require('firost/lib/read');
// const urlToFilepath = require('firost/lib/urlToFilepath');
// const exists = require('firost/lib/exists');
const download = require('firost/lib/download');
// const run = require('firost/lib/run');
// const writeJson = require('firost/lib/writeJson');
const readJson = require('firost/lib/readJson');
const _ = require('golgoth/lib/lodash');

(async () => {
  const old = await readJson('./lib/data.json');
  await pMap(
    old,
    async (character) => {
      const name = character.name;
      const [firstName, lastName] = _.words(name);

      const world = character.world;
      const year = character.time;

      const slug = _.camelCase(`${lastName}-${firstName}-${world}-${year}`);
      const pictureUrl = character.wiki.picture.replace(
        'scale-to-width-down/350',
        ''
      );
      const picturePath = `assets/pictures/${slug}.png`;
      console.info(name);
      await download(pictureUrl, `src/${picturePath}`);
    },
    { concurrency: 1 }
  );
})();
