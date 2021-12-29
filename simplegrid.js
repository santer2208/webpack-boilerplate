//const smartgrid = require('smart-grid');

const settings = {
  filename: '_simple-grid',
  outputStyle: 'scss',
  columns: 24,
  offset: '16px',
  baseFields: "16px",
  mobileFirst: true,
  container: {
    // maxWidth: "1120px",
    maxWidth: '1152px',
    fields: '16px',
  },
  breakPoints: {
    lg: {
      // width: "1121px",
      width: '1152px',
    },
    md: {
      // width: "981px",
      width: '981px',
    },
    sm: {
      width: '768px',
    },
    xs: {
      width: '576px',
    },
    xxs: {
      width: '480px',
      /*
            offset: "10px",
            fields: "5px"
            */
    },
  },
  //detailedCalc: true
};
var root = __dirname;
var simplegrid = require(root + '/src/simple-grid/index.js');
simplegrid('src/styles/utilites', settings);
