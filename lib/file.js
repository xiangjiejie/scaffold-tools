/** 将 blob url 转化为文件
 * @param {string} url 要转换的 blob url
 * @returns {Promise<File>}
 */
export const blobUrl2Blob = function (url) {
  /* eslint-disable prefer-promise-reject-errors */
  return window.fetch(url).then((res) => res.blob())
}

/** blobUrl/url 二维码解析
 * @param {string} url
 * @returns {Promise<Object>}
 */
export const urlQrCodeParse = function (url) {
  return new Promise((resolve, reject) => {
    import('jimp').then(jimp => {
      import('jsqr').then(jsqr => {
        jimp.read(url, (err, image) => {
          if (err) {
            return reject({ errMsg: err, desc: '二维码读取错误' })
          }
          const { data, width, height } = image.bitmap
          const code = jsqr.default(data, width, height)
          if (code) {
            return resolve({
              ...code
            })
          } else {
            reject({ errMsg: err, desc: '没有找到二维码' })
          }
        })
      })
    })
  })
}

/** 从url获取base64 并判断是否真实 不是的话返回空串
 * 可以使用代理
 * @param {String} url
 * @param {Object} params
 */
export const url2Base64 = async function (url) {
  if (!url) {
    return Promise.resolve('')
  }
  // 这里是为了检测当前微信头像是否为微信默认头像，因为即使用户没有头像，微信依然会返回一个默认头像
  const proxy = /\/\/thirdwx\.qlogo\.cn/.test(url)
  if (proxy) {
    const proxyUrl = '/kjy/mp/upload/proxy?url='
    const _url = proxy ? proxyUrl + url : url
    const response = await window.fetch(_url)
    const { headers } = response
    if (proxy && headers.get('x-info') !== 'real data') {
      // 如果是微信默认头像，则直接返回空
      return Promise.resolve('')
    }
  }
  return new Promise((resolve, reject) => {
    import('jimp').then(jimp => {
      // 这里避免有http的链接造成读取失败
      const rightUrl = url.replace(/http:\/\//, '//')
      jimp.read(rightUrl, async (err, image) => {
        if (err) {
          return reject({ errMsg: err, desc: '图片读取错误' })
        }
        const imageBase64 = await image.getBase64Async(image._originalMime)
        resolve(imageBase64)
      })
    })
  })
}

/** 通过blob/file获得base64
 * 只适用于WEB
 * @param {File|Blob} blob
 * @returns {Promise<Base64>}
 */
export const blob2Base64 = function (blob) {
  return new Promise((resolve, reject) => {
    const fileReader = new window.FileReader()
    fileReader.onload = (e) => {
      resolve(e.target.result)
    }
    // readAsDataURL
    fileReader.readAsDataURL(blob)
    fileReader.onerror = (err) => {
      reject(err)
    }
  })
}

/** 通过base64获得blob
 * @param {Base64} base64
 * @returns {Blob}
 */
export const base642Blob = function (base64) {
  const arr = base64.split(',')
  const mime = arr[0].match(/:(.*?);/)[1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new Blob([u8arr], { type: mime })
}
