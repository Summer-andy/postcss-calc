const parse = require('postcss-values-parser');
const keywords = ['-', '*', '/', 'calc'];
const IndexKeyWords = ['*']


/**
* 判断当前的css的值是否包含特殊字符
* @params {string} value - css的值
*/

function mapKeyWords(value) {
  return keywords.every(item => !!value.includes(item));
}

/**
* 获取所有需要空格的前一位数组下标
* @params {string} value - css的值
*/

function getArrIndex(value) {
  let arr = []
  for (let i = 0; i < value.length; i++) {
    if(IndexKeyWords.includes(value[i])) {
      arr.push(i);
    }
  }
  return arr;
}

/**
* 检查当前css值中特殊字符后是否有空格
* @params {string} value - css的值
*/

function checkSpace(value) {
  let arr = getArrIndex(value);
  for (let i = 0; i < arr.length; i++) {
    if(value[arr[i] + 1] !== ' ')  return false
    if(i === arr.length - 1) return true
  }
}

/**
* 往特殊字符后添加空格
* @params {string} value - css的值
*/

function transformDeclaration(value) {
  let result = value;
  let arr = getArrIndex(value);
  for (let i = 0; i < arr.length; i++) {
    if(value[arr[i] + 1] !== ' ') {
      let idx = arr[i];
      let pre = value.slice(0, idx+1);
      let str = value.slice(idx + 1);
      result = pre + ' ' + str;
    }
  }
  return result;
}

module.exports = () => {
  return {
    postcssPlugin: 'postcss-calc',
    Declaration(declaration) {
      let value = declaration.value.toString();
      // 首先先判断当前值是否是css表达式
      if(parse.parse(declaration.value).first.type !== 'func') return;

      // 其次判断当前值是否包含关键字
      if(!mapKeyWords(declaration.value)) return;

      // 通过while循环添加空格, 直到检测不出空格为止
      while (!checkSpace(value)) {
        value = transformDeclaration(value);
      }
     
      declaration.value = value;
    }
  }
}
module.exports.postcss = true