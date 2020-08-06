const pMap = require('golgoth/lib/pMap');
const read = require('firost/lib/read');
const urlToFilepath = require('firost/lib/urlToFilepath');
const exists = require('firost/lib/exists');
const download = require('firost/lib/download');
const run = require('firost/lib/run');
const writeJson = require('firost/lib/writeJson');
const _ = require('golgoth/lib/lodash');

(async () => {
  const world = 'adam';
  const urls = await read(`./tmp/${world}.txt`);
  const characters = [];
  await pMap(
    urls.split('\n'),
    async (url) => {
      const fullUrl = `https://dark-netflix.fandom.com/${url}`;
      const localFile = './tmp/cache/' + urlToFilepath(fullUrl);
      if (!(await exists(localFile))) {
        await download(fullUrl, localFile);
      }

      const { stdout: title } = await run(
        `hx ${localFile} "meta[name=twitter:title]" content`,
        {
          shell: true,
          stdout: false,
        }
      );
      const name = title.replace(' | Dark Wiki | Fandom', '');

      // Get images
      const command = `hx ${localFile} ".pi-image-thumbnail"`;
      const { stdout } = await run(command, { shell: true, stdout: false });
      const imgs = JSON.parse(stdout);

      _.each(imgs, (img) => {
        const time = img.alt;
        const picture = img.src;
        characters.push({
          name,
          world,
          time,
          picture,
        });
      });
    },
  );

  const dataPath = './lib/data.json';
  await writeJson(characters, dataPath);
})();
