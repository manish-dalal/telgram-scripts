const axios = require('axios');

const SITE_ID = '957174';

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
let axiosConfig = {
  headers: {
    Authorization: 'Bearer 43b6eda9dda0b151fa31ca8406362558b9764c62',
  },
};
const SIZES = ['300x250', '900x250', '728x90'];

// cerate zone
var count = 0;
(async () => {
  for (const i of Array(5)) {
    try {
      await sleep(200);
      const postData = {
        name: count.toString(),
        subcategory: 0,
        idsite: SITE_ID,
        size: SIZES[count % 2],
        border: 0,
        'in-video-pre': null,
        'in-video-post': null,
        'in-video-pause': null,
        'vertical-position': null,
        'horizontal-position': null,
        'in-stream-skip-after': 0,
        'user-capping': null,
        'in-video-vast-config': {},
        'floor-cpm': 0,
        'floor-type-cpm': 0,
        'alternate-html': '',
        is_responsive_zone: '1',
        publisher_ad_type: 2,
        next_trigger_clicks: null,
        first_trigger_clicks: null,
      };
      const res = await axios.post(
        `https://api.exoclick.com/v2/zones?idsite=${SITE_ID}`,
        postData,
        axiosConfig
      );
      console.log('index', count, 'length', res.data);
      if (res?.data) {
        count++;
      } else {
        return false;
      }
    } catch (error) {
      console.log('error', error.message);
    }
  }
})();

// update zones
// const axios = require('axios');
// const zones = require('./data');

// const SITE_ID = '957174';

// const sleep = (ms) => {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// };
// let axiosConfig = {
//   headers: {
//     Authorization: 'Bearer 43b6eda9dda0b151fa31ca8406362558b9764c62',
//   },
// };
// const SIZES = ['300x250', '900x250', '728x90'];

// var count = 0;
// (async () => {
//   for (const i of zones.result) {
//     try {
//       await sleep(200);
//       const postData = {
//         name: i.name,
//         subcategory: 0,
//         idsite: SITE_ID,
//         size: i.size,
//         border: 0,
//         'in-video-pre': 0,
//         'in-video-post': 0,
//         'in-video-pause': 0,
//         'vertical-position': null,
//         'horizontal-position': null,
//         'in-stream-skip-after': null,
//         'user-capping': 0,
//         'in-video-vast-config': {},
//         'floor-cpm': 0,
//         'floor-type-cpm': 0,
//         'alternate-html': '',
//         is_responsive_zone: '1',
//         next_trigger_clicks: null,
//         first_trigger_clicks: null,
//       };
//       const res = await axios.put(
//         `https://api.exoclick.com/v2/zones/${i.id}`,
//         postData,
//         axiosConfig
//       );
//       console.log('index', count, 'length', res.data);
//       if (res?.data) {
//         count++;
//       } else {
//         return false;
//       }
//     } catch (error) {
//       console.log('error', error.message);
//     }
//   }
// })();
