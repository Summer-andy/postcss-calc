const postcssCalc = require('.');
const postcss = require('postcss');
const fs = require('fs');

// 输入的css文件地址
const from = 'test.css';

fs.readFile(from, (err, css) => {
  postcss(postcssCalc).process(css, { from }).then(result => {
    console.log(result.css)
  })  
})
