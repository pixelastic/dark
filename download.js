const pMap = require('golgoth/pMap');
const read = require('firost/read');
const urlToFilepath = require('firost/urlToFilepath');
const exists = require('firost/exists');
const download = require('firost/download');
const run = require('firost/run');
const writeJson = require('firost/writeJson');
const _ = require('golgoth/lodash');

const hx = async (filepath, selector, attribute) => {
  const command = `hx "${filepath}" "${selector}" "${attribute}"`;
  const { stdout } = await run(command, {
    shell: true,
    stdout: false,
  });
  return stdout;
};

(async () => {
  const worlds = ['adam', 'eva', 'original'];
  const characters = [];
  await pMap(worlds, async (world) => {
    const urls = await read(`./tmp/${world}.txt`);
    await pMap(urls.split('\n'), async (url) => {
      const fullUrl = `https://dark-netflix.fandom.com/${url}`;
      const localFile = './tmp/cache/' + urlToFilepath(fullUrl);
      if (!(await exists(localFile))) {
        await download(fullUrl, localFile);
      }

      const title = await hx(localFile, 'meta[name=twitter:title]', 'content');
      const name = title.replace(' | Dark Wiki | Fandom', '');

      // Get images
      const imgs = JSON.parse(await hx(localFile, '.pi-image-thumbnail', ''));

      _.each(_.castArray(imgs), (img) => {
        const time = img.alt;
        const picture = img.src;
        characters.push({
          name,
          world,
          time,
          picture,
          wikiUrl: fullUrl,
        });
      });
    });
  });

  const dataPath = './lib/data.json';
  await writeJson(characters, dataPath);
})();
