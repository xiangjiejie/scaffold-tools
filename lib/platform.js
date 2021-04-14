
const ua = navigator.userAgent.toLowerCase()

const isWx = () => ua.indexOf('micromessenger') !== -1

const isMini = () => {
  return window.__wxjs_environment === 'miniprogram' || ua.indexOf('miniprogram') !== -1
}

const isIOS = () => {
  if (typeof navigator !== 'undefined') {
    return /(iPhone|iPad|iPod|iOS)/i.test(ua)
  }
}
const isAndroid = () => {
  if (typeof navigator !== 'undefined') {
    return /(Android)/i.test(ua)
  }
}

const isIphoneX = () => {
  const term = (window.screen.height === 896 && window.screen.width === 414)
  const termOther = (window.screen.height === 812 && window.screen.width === 375)
  return isIOS() && (term || termOther)
}

const isPc = () => {
  if (typeof navigator !== 'undefined') {
    return /(windows|macintosh)/i.test(ua) && !/(mobile)/i.test(ua)
  }
}

export const isWxDevTool = function() {
  return ua.indexOf('wechatdevtools') !== -1
}



export default {
  /** 小程序端 */
  isMini,
  /** 微信端 */
  isWx,
  /** 安卓 */
  isAndroid,
  /** iOS */
  isIOS,
  /** iPhoneX */
  isIphoneX,
  /** 微信调试工具 */
  isWxDevTool,
  /** pc */
  isPc
}
