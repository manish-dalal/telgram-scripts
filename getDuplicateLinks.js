const dataStr = require('./NewData/english');

const data2Str = require('./NewData/english1');

const getLinkObj = () => {
  var urlRegex = /(https?:\/\/[^ ]*)/g;
  var urls = dataStr.match(urlRegex);
  console.log('urls', urls.length);
  const obj = urls.reduce(
    (ac, cu) => ({
      ...ac,
      [cu]: (ac[cu] || 0) + (cu === ac.last ? 0 : 1),
      last: cu,
    }),
    {}
  );
  Object.keys(obj).forEach((e) => {
    if (obj[e] < 2) delete obj[e];
  });
  console.log('obj', obj);
  // let conut = 0;
  // urls.forEach((e) => {
  //   if (dataStr.includes(e)) {
  //     console.log(e);
  //     conut++;
  //     console.log('\n');
  //   }
  //   if (e === urls[urls.length - 1]) console.log('count', conut);
  // });
};
getLinkObj();
