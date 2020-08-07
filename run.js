const pMap = require('golgoth/lib/pMap');
// const read = require('firost/lib/read');
// const urlToFilepath = require('firost/lib/urlToFilepath');
// const exists = require('firost/lib/exists');
// const download = require('firost/lib/download');
// const run = require('firost/lib/run');
const writeJson = require('firost/lib/writeJson');
const readJson = require('firost/lib/readJson');
const _ = require('golgoth/lib/lodash');

(async () => {
  const characters = await readJson('./lib/data.json');
  const newData = [];
  await pMap(characters, async (character) => {
    const { wikiUrl, name, world, time, picture } = character;
    const slug = _.camelCase(`${name}-${time}-${world}`);

    // const picturePath = `./src/assets/pictures/${slug}.png`;
    // if (!(await exists(picturePath))) {
    //   await download(picture, picturePath);
    // }

    const newCharacter = {
      name,
      wiki: {
        picture,
        url: wikiUrl,
      },
      time,
      world,
      slug,
    };

    newData.push(newCharacter);
  });

  await writeJson(newData, './src/_data/characters.json');
})();
