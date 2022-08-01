const axios = require('axios');
const fs = require('fs');

const data = require('./v1_mdisk_urls.json');
const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const storeOverWriteData = (path, data) => {
  try {
    fs.writeFileSync(path, JSON.stringify(data));
  } catch (err) {
    console.error(err);
  }
};

const storeData = (path, data) => {
  try {
    fs.appendFileSync(path, '\n' + JSON.stringify(data));
  } catch (err) {
    console.error(err);
  }
};

const getLinks = async () => {
  const urls = data.slice(0, 10000);
  for (const el of urls) {
    await sleep(0.2);
    const elArr = el.url.split('/');
    const videoId = elArr[elArr.length - 1];
    try {
      const response = await axios.get(
        `https://diskuploader.entertainvideo.com/v1/file/cdnurl?param=${videoId}`
      );
    } catch (error) {
      storeData(`./save/errorUrls.json`, videoId);
      console.log('error', error);
    }
    storeOverWriteData(`./save/current.json`, urls.indexOf(el) + '=' + videoId);
    console.log('el', urls.indexOf(el), '@  ', videoId);
  }
};
getLinks();
