const pMap = require('golgoth/lib/pMap');
// const read = require('firost/lib/read');
// const urlToFilepath = require('firost/lib/urlToFilepath');
// const exists = require('firost/lib/exists');
const download = require('firost/lib/download');
// const run = require('firost/lib/run');
const writeJson = require('firost/lib/writeJson');
const readJson = require('firost/lib/readJson');
const _ = require('golgoth/lib/lodash');

(async () => {
  const characters = await readJson('./src/_data/characters.json');
  const newData = [];
  await pMap(characters, async (character) => {
    const name = character.name;
    const [firstName, _lastName] = _.words(name);
    const lastName = _.upperCase(_lastName);

    const world = character.world;
    const year = character.time;
    const wikiUrl = character.wiki.url;

    const slug = _.camelCase(`${lastName}-${firstName}-${world}-${year}`);
    const pictureUrl = character.wiki.picture;
    const picturePath = `assets/pictures/${slug}.png`;
    await download(pictureUrl, picturePath);

    newData.push({
      firstName,
      lastName,
      world,
      year,
      wikiUrl,
      picture: picturePath,
    });
  });
  console.info(newData);

  // await writeJson(newData, './src/_data/characters.json');
})();
