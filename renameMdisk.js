const axios = require('axios');
const fs = require('fs');
var emojiStrip = require('emoji-strip');

const storeData = (path, data) => {
  try {
    fs.writeFileSync(path, JSON.stringify(data));
  } catch (err) {
    console.error(err);
  }
};

const dataStr = require('./NewData/data');

// const data2Str = require('./NewData/english1');

const CHANNEL = '@premium_stocks';
const MDISKTOKEN = 'yjl3syUTD46UZ3D4bhwa';

// get
const infoUrl = 'https://diskuploader.mypowerdisk.com/v1/tp/filename';
// params = { token: 'l3ae9WQ7ru5ys5Dxxc3O', rid: 'MZdAES ' };

// post
const renameUrl = 'https://diskuploader.mypowerdisk.com/v1/tp/info';
// param = {'token': 'l3ae9WQ7ru5ys5Dxxc3O','rid':'MZdAES','filename':'name_1'}

const getLinkObj = async () => {
  const allData = [];
  const dataWithName = [];
  const errorUrls = [];

  var urlRegex = /(https?:\/\/[^ ]*)/g;
  var urls = dataStr.replace(/\r?\n|\r/g, ' ').match(urlRegex);
  console.log('urls', urls.length);
  for (const el of urls) {
    const elArr = el.split('/');
    const videoRid = elArr[elArr.length - 1];
    let params = {
      token: MDISKTOKEN,
      rid: videoRid,
    };
    try {
      const url = new URL(infoUrl);
      url.search = new URLSearchParams(params);
      const res = await axios.get(url.href);
      const { data = {} } = res;
      console.log('@@@', urls.indexOf(el), JSON.stringify(data));
      const newFilename = emojiStrip(data.filename).replace(
        /@.[a-zA-Z0-9_]*/g,
        CHANNEL
      );
      if (data.filename !== newFilename) {
        dataWithName.push({
          rid: videoRid,
          filename: newFilename.replace(
            /[`~!#$%^&*()|+\-=?;:'",.<>\{\}\[\]\\\/]/gi,
            ' '
          ),
        });
      }
      allData.push({
        rid: videoRid,
        filename: newFilename,
      });
    } catch (error) {
      errorUrls.push({
        action: 'fetch info',
        data: el,
      });
    }
    if (el === urls[urls.length - 1]) {
      // console.log('Final data', JSON.stringify(dataWithName));
      // console.log('errorUrls', JSON.stringify(errorUrls));
      const date = new Date();
      const dateStr =
        date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear();
      storeData(`./save/allData-${dateStr}.json`, allData);
      storeData(`./save/errorUrls-${dateStr}.json`, errorUrls);
      for (const elFinal of dataWithName) {
        let params1 = {
          token: MDISKTOKEN,
          ...elFinal,
        };
        const url1 = new URL(renameUrl);
        try {
          const res1 = await axios.post(url1.href, params1);
          const { data: data1 } = res1;
          console.log(
            'd=',
            dataWithName.indexOf(elFinal),
            JSON.stringify(data1)
          );
          if (elFinal === dataWithName[dataWithName.length - 1]) {
            console.log('allData', allData.length);
            console.log('dataWithName', dataWithName.length);
            console.log('errorUrls', JSON.stringify(errorUrls));
            const date = new Date();
            const dateStr =
              date.getDate() +
              '-' +
              (date.getMonth() + 1) +
              '-' +
              date.getFullYear();
            storeData(`./save/allData-${dateStr}.json`, allData);
            storeData(`./save/errorUrls-${dateStr}.json`, errorUrls);
          }
        } catch (error1) {
          errorUrls.push({
            action: 'rename',
            data: elFinal,
          });
        }
      }
    }
  }
};
getLinkObj();
