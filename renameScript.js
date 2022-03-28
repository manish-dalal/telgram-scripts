// https://doodapi.com/api/file/rename?key=72288nzohhhv0hp933n07&file_code=f8mn0gk9gpzw&title=5064846493114958090+Screenshots

// https://doodapi.com/api/file/list?key=72288nzohhhv0hp933n07&page=2&per_page=10

const axios = require('axios');

const CHANNEL = '@primexmov';
const DOODSTREAMAPI = '83465j7qggcbkgc0mx6xu';
// other
// const DOODSTREAMAPI = '81085or5p8wkfj6dty6r8';
const RECORD_PER_PAGE = 200; // max 200
const LIST_MAX_PAGES = 40;

const operations = async (array1) => {
  let x = 0;
  for (const element of array1) {
    if (element.title.includes(CHANNEL)) {
      console.log('Index', x, 'Already renamed');
    } else if (element.title.includes('@')) {
      let params = {
        key: DOODSTREAMAPI,
        file_code: element.file_code,
        title: element.title.replace(/@.[a-zA-Z0-9_]*/g, CHANNEL),
      };
      const url = new URL(`https://doodapi.com/api/file/rename`);
      url.search = new URLSearchParams(params);
      const res = await axios.get(url.href);
      console.log('Index', x, 'res', JSON.stringify(res?.data));
    } else {
      console.log('Index', x, 'No @ found ');
    }
    x++;
  }
};

const getData = async () => {
  let data = [];
  let loopArr = Array(LIST_MAX_PAGES);
  let element = 0;
  for (const el of loopArr) {
    element = element + 1;
    let params = {
      key: DOODSTREAMAPI,
      page: element,
      per_page: RECORD_PER_PAGE,
    };
    const url = new URL(`https://doodapi.com/api/file/list`);
    url.search = new URLSearchParams(params);
    const res = await axios.get(url.href);
    const { result = {} } = res?.data;
    const files = result?.files || [];
    data.push(...files);
    if (
      result?.total_pages === element ||
      element === loopArr[loopArr.length - 1] ||
      element === LIST_MAX_PAGES
    ) {
      console.log('data length', data.length, 'element===', element);
      // console.log(
      //   JSON.stringify(
      //     data.map((e) => ({ download_url: e.download_url, length: e.length }))
      //   )
      // );
      operations(data);
      break;
    }
  }
};
module.exports = getData;
// getData();
