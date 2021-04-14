/*
 * @Date: 2019-07-02 13:38:51
 * @Last Modified time: 2019-07-02 13:38:51
 * 字符串相关工具操作
 */

import invariant from 'invariant'
import { noop } from './function'

export const createPrefixClass = (styles, prefix) => (name) => styles[`${prefix}${name ? '-' + name : ''}`]

/**
 * 注入查询参数
 * @param {string|undefined} field
 * @param {string} url
 */
export const injectQuery = (field, url = window.location.href) => (_, name, descriptor) => {
  if (!descriptor.writable) return descriptor
  descriptor.value = getUrlQuery(field || name, url)
  return descriptor
}

/**
 * 获取URL参数值
 * @param {String} name 参数名
 * @returns {String}
 */
export function getUrlQuery(name, url = '') {
  if (!url && typeof window !== 'undefined') url = window.location.href

  const reg = new RegExp('([?|&])' + name + '=([^&]*)(&|$)', 'i')
  const fragram = url.split('#')
  // eslint-disable-next-line
  for (const str of fragram) {
    const r = str.match(reg)
    // null 或者 undefined 情况直接返回null
    if (r !== null && r[2] !== 'undefined' && r[2] !== 'null') {
      return unescape(r[2])
    }
  }
  return null
}

export const deleteUrlQuery = function(name) {
  const searchStr = window.location.search.substring(1)
  const searchArr = searchStr.split('&')
  const arr = searchArr.filter(query => !query.includes(`${name}=`))
  const filteredSearchStr = arr.join('&')
  return window.location.origin + window.location.pathname + `?${filteredSearchStr}`
}
/**
 * 获取所有URL参数值
 * @param {String} url url
 * @returns {String}
 */
export const getUrlAllQuery = function(url) {
  if (!url && typeof window !== 'undefined') url = window.location.href

  const queryObj = {}
  const reg = /[?&]([^=&#]+)=([^&#]*)/g
  const query = url.match(reg)
  if (query) {
    // eslint-disable-next-line
    for (const i in query) {
      const params = query[i].split('=')
      const key = params[0].substr(1)
      const value = params[1]

      if (value === 'null' || value === 'undefined') continue
      // 需要判断当前内容是否相等，相等情况，覆盖内容
      if (queryObj[key] && queryObj[key] !== value) {
        // 这里需要过滤掉重复内容
        if (!Array.isArray(queryObj[key])) {
          // 添加到数组中
          queryObj[key] = [].concat(queryObj[key], value)
        } else if (queryObj[key].indexOf(value) === -1) {
          // 过滤掉重复的
          queryObj[key] = queryObj[key].concat(value)
        }
      } else {
        queryObj[key] = value
      }
    }
  }
  return queryObj
}

export const escapeStringRegex = (str) => {
  str = String(str)
  return str.replace(/[|\\{}()[\]^$+*?.-]/g, '\\$&')
}

/**
 * 替换模板 #{xxx}
 * @param {*} replacements
 * @param {*} tpl
 */
export const createReplaceTpl = (callbackRegexConstructor = noop) => (replacements = {}, tpl = '') => {
  Object.keys(replacements).forEach((key) => {
    tpl = tpl.replace(new RegExp(callbackRegexConstructor(escapeStringRegex(key)), 'g'), replacements[key])
  })
  return tpl
}

/**
 * 获取文字长度
 * @param {String} text
 */
export const getStringSize = (text = '') => {
  let total = 0
  let i
  for (i = 0; i < text.length; i++) {
    if (text.charCodeAt(i) > 128) {
      total += 2
    } else {
      total += 1
    }
  }
  return total
}

/**
 * 获取字符串的长度
 * @param {String} text
 */
export const getCharSize = (text) => {
  let total = 0
  let i
  for (i = 0; i < text.length; i++) {
    if (text.charCodeAt(i) > 128) {
      total += 2
    } else {
      total += 1
    }
  }
  return total
}

/**
 * 获取缩略文字，超出半角尺寸显示省略号
 * @param {String} text 文字
 * @param {Number} maxSize 最大字数
 * @returns {String} 缩略后的文字
 */
export const getEllipsisText = (text, maxSize) => {
  // // 获取文字长度
  const getMaxSizeChar = () => {
    let total = 0
    let i
    for (i = 0; i < text.length; i++) {
      if (text.charCodeAt(i) > 128) {
        total += 2
      } else {
        total += 1
      }
      if (total >= maxSize) {
        break
      }
    }
    return text.substr(0, i)
  }

  // 获取字符的半角尺寸
  const getCharSize = () => {
    // eslint-disable-next-line no-control-regex
    const match = text.match(/[^\u0000-\u00ff]/g)
    if (match) {
      return text.length + match.length
    }
    return text.length
  }

  if (!text) {
    return ''
  }
  const num = getCharSize(text)
  if (num > maxSize) {
    return getMaxSizeChar(text, maxSize) + '...'
  }
  return text
}

export const randomString = () => {
  return Math.random()
    .toString(0x10)
    .slice(2)
}

const letterBytes = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
export const randomBytes = (len) => {
  return [...Array(len).keys()].map((index) => letterBytes[Math.floor(Math.random() * len)]).join('')
}

/**
 * 对象转url参数
 *
 * @param {*} param  需要转换为url的对象
 * @param {*} encode 是否进行编码，默认为true
 * @param {*} key    前缀
 * @example
 * urlEncode({a: 1, b:2}) => a=1&b=2
 */
export const urlEncode = function(_param, _encode = true, _key) {
  function _urlEncode(param, encode, key) {
    if (param == null) return ''
    let paramStr = ''
    const t = typeof param
    if (t === 'string' || t === 'number' || t === 'boolean') {
      paramStr += '&' + key + '=' + (encode ? encodeURIComponent(param) : param)
    } else {
      // eslint-disable-next-line
      for (const i in param) {
        const k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i)
        paramStr += _urlEncode(param[i], encode, k)
      }
    }
    return paramStr
  }

  return _urlEncode(_param, _encode, _key).slice(1)
}

/**
 * url参数转对象
 *
 * @param {*} url 需要转换为对象的url参数
 */
export const urlDecode = function(url) {
  const urlObject = {}
  const urlArray = url.split('&')
  for (let i = 0, len = urlArray.length; i < len; i++) {
    const urlItem = urlArray[i]
    const item = urlItem.split('=')
    urlObject[item[0]] = decodeURIComponent(item[1])
  }
  return urlObject
}

/**
 * first letter toUpper
 * @param {string} str
 */
export const firstLetterUpper = (str) => {
  invariant(typeof str === 'string', 'str is string')

  return str.slice(0, 1).toUpperCase() + str.slice(1)
}

/**
 * 将params参数object格式转换成url的query参数
 * @param {Object} params params参数
 * @return {String} query参数
 */
export const pageParamsToQuery = (params) => {
  const queryParams = Object.entries(params).map(([key, value]) => {
    return `${key}=${value}`
  }).join('&')

  return '?' + queryParams
}

/**
 * 格式化输入内容的表情字符
 * @param {String} str 输入内容
 * @param {Number} limit 长度限制
 * @return {String} 格式化后的字符串
 */
export const formatInputEmoji = (str = '', limit = str.length) => {
  const array = Array.from(str)

  let lastEmojiIndex = null

  for (let i = 0, len = array.length; i < len; i++) {
    // 如果内容是表情
    if (array[i].length >= 2) {
      lastEmojiIndex = i
    }
  }

  if (lastEmojiIndex) {
    const emoji = array[lastEmojiIndex]
    const emojiIndex = str.indexOf(emoji)

    // 最后一个表情索引存在 && 字符串超出长度限制
    if (emojiIndex !== -1 && str.length > limit) {
      if (emojiIndex > limit - 1) {
        return str.slice(0, limit - 1)
      } else {
        return str.slice(0, emojiIndex)
      }
    }
  }

  return str.slice(0, limit)
}


/**
 * 千分位分割数字
 * @param {number} number 
 * @param {number} len 
 * @returns {string} 千分位分割数字
 */
export const thousandSeparator = (number, len) => {
  let strNum = "";
  let decLen = 0;

  if (typeof (len) === "number" && len > 0) {
    decLen = len;
  }

  if (typeof (number) === "number") {
    strNum = number.toFixed(decLen);
  }
  else if (typeof (number) !== "undefined") {
    strNum = number.toString();
  }

  if (strNum) {
    let match = strNum.match(/^(-)?(\d+)(\.\d+)?$/);
    if (match) {
      let symbol = match[1] ? match[1] : '';
      let integer = match[2] ? match[2] : '';
      let fraction = match[3] ? match[3] : '.';

      if (integer.length > 3) {
        let source = integer.split('');
        let target = [];

        for (let i = 0; i < source.length; i++) {
          let index = (source.length - 1) - i;
          let item = source[index];

          target.push(item);
          if (((i + 1) % 3) === 0 && i !== (source.length - 1)) {
            target.push(',');
          }
        }

        integer = target.reverse().join('');
      }

      for (let i = 0; i < decLen; i++) {
        fraction = fraction + "0";
      }
      fraction = fraction.substring(0, (decLen === 0 ? decLen : (decLen + 1)));

      return symbol + integer + fraction;
    }
  }

  return number;
};