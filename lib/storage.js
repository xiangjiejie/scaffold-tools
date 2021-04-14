/*
 * @Date: 2019-09-29 14:33:03
 * @Last Modified time: 2019-09-29 14:33:03
 * storage增强
 */
import dayjs from 'dayjs'
import invariant from 'invariant'
import { isPlainObject, isString, isNumber, isUndefined, isNull } from './function'

/**
 * @param {Storage | Record<string, any>} storage
 */
function Storage (storage) {
  if (typeof localStorage !== 'undefined' && !storage) storage = localStorage
  this.storage = storage || {}
}

/**
 * @param {Storage | Record<string, any>} storage
 */
Storage.prototype.setStorage = function (storage = localStorage) {
  this.storage = storage
  return this
}

/**
 * @param {string} key
 * @param {any} value
 */
Storage.prototype.setItem = function (key, value) {
  // todo: 使用JSON.stringify 待修复
  this.storage[key] = JSON.stringify({ data: value })
  return this
}

/**
 * @param {string} key
 */
Storage.prototype.removeItem = function (key) {
  delete this.storage[key]
  return this
}

/**
 * @param {string} key
 */
Storage.prototype.getItem = function (key) {
  const item = this.storage[key]
  if (!item) return item
  const { data } = JSON.parse(item)
  return data
}

/**
 * @param {{key: string, data: any} | string} options
 * @param {any} value
 * @param {number} expr
 */
Storage.prototype.set = function (options, value = null, expr = -1) {
  let k = options
  let v = value
  let e = expr
  if (isPlainObject(options)) {
    invariant(options.key, '缺少key')
    invariant(options.data, '缺少value')
    k = options.key
    v = options.data
    if (value && isNumber(value)) e = value * 1
  }

  invariant(!isUndefined(v) || !isNull(v), '缺少value')
  invariant(isString(k), 'key必须是字符串')
  return this.setExpired(k, v, e)
}

/**
 * @param {string} key
 * @param {any} value
 * @param {number} expired
 */
Storage.prototype.setExpired = function (key, value, expired = -1) {
  let params = value
  if (expired > 0) {
    invariant(isNumber(expired), '过期时间必须是数字')
    params = { value, expired }
  }
  return this.setItem(key, params)
}

/**
 * @param {string} key
 */
Storage.prototype.get = function (key) {
  const item = this.getItem(key)
  if (item && !item.expired) return item

  if (item && item.expired * 1 > Date.now()) return item.value
  // 过期后删除
  this.removeItem(key)
  return null
}

/**
 * @param {string} key
 */
Storage.prototype.remove = function (key) {
  return this.removeItem(key)
}

/**
 * @param {string} key
 * @param {any} value
 * @param {dayjs.OpUnitType} unit
 */
Storage.prototype.setExpiredUnit = function (key, value, unit = 'day') {
  return this.setExpired(key, value, dayjs().endOf(unit).valueOf())
}

const storage = new Storage()

export default storage
