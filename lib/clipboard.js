/*
 * @Date: 2019-07-04 10:55:17
 * @Last Modified time: 2019-07-04 10:55:17
 * 粘贴板相关方法
 */
import platform from './platform'
import storage from './storage'

const CLIPBOARD_CONFIG = {
  KEY: 'clipboard',
  DURATION: 24 * 60 * 60 * 1000
}

/**
 * 判断是否支持某命令
 * @param {string} cmd
 * @returns {boolean}
 */
export function isSupportedCommand (cmd) {
  return document.queryCommandSupported(cmd)
}

/**
 * 复制clipboard
 * @param {string} data
 * @return {Promise<void>}
 */
export async function setClipboardData (data) {
  data = String(data)
  return new Promise((resolve, reject) => {
    const input = document.createElement('input')
    try {
      // 兼容方式
      document.body.appendChild(input)
      input.setAttribute('value', data)
      input.setAttribute('readonly', 'readonly')
      // ios 兼容
      if (platform.isAndroid()) input.select()
      else input.setSelectionRange(0, data.length)

      // ios10 以上兼容
      if (document.queryCommandSupported('Copy')) {
        document.execCommand('Copy')
        storage.set(CLIPBOARD_CONFIG.KEY, data, Date.now() + CLIPBOARD_CONFIG.DURATION)
        resolve()
      } else throw new Error(`can't execCommand of copy.`)
    } catch (error) {
      reject(error)
    } finally {
      document.body.removeChild(input)
    }
  })
}

/**
 * 返回粘贴板信息
 */
export function getClipboardData () {
  return storage.get(CLIPBOARD_CONFIG.KEY) || ''
}
