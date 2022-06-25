const axios = require('axios');

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

var count = 1;
(async () => {
  for (const i of Array(500)) {
    try {
      await sleep(2000);
      const res = await axios.get(
        'https://diskuploader.glitch.me/api/message/update-cloudinary?cname=v1&linkType=mdisk&pageSize=10'
      );
      console.log('Done index', count);
      count++;
    } catch (error) {
      console.log('error', error.message);
    }
  }
})();
