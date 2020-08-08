const mql = require('@microlink/mql');
const read = require('firost/lib/read');
const download = require('firost/lib/download');
const exists = require('firost/lib/exists');
const pMap = require('golgoth/lib/pMap');

(async () => {
  const ids = (await read('./tmp/ids.txt')).split('\n');
  await pMap(
    [ids[12]],
    async (id) => {
      console.info(id);
      const { data } = await mql('https://projects.pixelastic.com/dark/', {
        screenshot: true,
        waitUntil: 'load',
        element: `#${id}`,
      });
      const url = data.screenshot.url;
      console.info(data.screenshot);
      const card = `./cards/${id}.png`;
      if (!(await exists(card))) {
        await download(url, card);
      }
    },
    { concurrency: 2 }
  );
})();
