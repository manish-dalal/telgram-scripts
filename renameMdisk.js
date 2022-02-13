const axios = require('axios');
const fs = require('fs');

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
    let params = {
      token: MDISKTOKEN,
      rid: elArr[elArr.length - 1],
    };
    try {
      const url = new URL(infoUrl);
      url.search = new URLSearchParams(params);
      const res = await axios.get(url.href);
      const { data = {} } = res;
      console.log('@@@', urls.indexOf(el), data);
      const newFilename = data.filename.replace(/@.[a-zA-Z0-9_]*/g, CHANNEL);
      if (data.status === 'ok' && data.filename !== newFilename) {
        dataWithName.push({
          rid: elArr[elArr.length - 1],
          filename: newFilename,
        });
      }
      allData.push({
        rid: elArr[elArr.length - 1],
        filename: newFilename,
      });
      if (el === urls[urls.length - 1]) {
        // console.log('Final data', JSON.stringify(dataWithName));
        // console.log('errorUrls', JSON.stringify(errorUrls));
        for (const elFinal of dataWithName) {
          let params1 = {
            token: MDISKTOKEN,
            ...elFinal,
          };
          const url1 = new URL(renameUrl);
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
            storeData('./save/allData.json', allData);
            storeData('./save/errorUrls.json', errorUrls);
          }
        }
        storeData('./save/allData.json', allData);
        storeData('./save/errorUrls.json', errorUrls);
      }
    } catch (error) {
      errorUrls.push(el);
    }
  }
};
getLinkObj();
