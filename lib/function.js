/*
 * @Date: 2019-07-15 13:47:27
 * @Last Modified time: 2019-07-15 13:47:27
 * 函数相关
 */

export const isFunction = (func) => typeof func === 'function'

export const isPlainObject = (value) => {
  if (!value || typeof value !== 'object' || {}.toString.call(value) !== '[object Object]') {
    return false
  }
  const proto = Object.getPrototypeOf(value)
  if (proto === null) {
    return true
  }
  const Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor
  return (
    typeof Ctor === 'function' &&
    Ctor instanceof Ctor &&
    Function.prototype.toString.call(Ctor) === Function.prototype.toString.call(Object)
  )
}

export const isString = (o) =>
  typeof o === 'string' || (typeof o === 'object' && o.valueOf && typeof o.valueOf() === 'string')

export const isNumber = (o) => !Number.isNaN(o)

export const isUndefined = (o) => typeof o === 'undefined'

export const isNull = (o) => o === null

export const isNullOrUndefined = (o) => isUndefined(o) || isNull(o)

export const isNotEmpty = (o) => {
  try {
    if (isFunction(o)) return true

    if (isUndefined(o)) return false

    if (typeof o !== 'object') return !!o

    if (Array.isArray(o)) return !!o.length

    if (o instanceof Object) return !!Object.keys(o).length

    return !!o
  } catch (e) {
    throw e
  }
}

export const isEmpty = (o) => {
  return !isNotEmpty(o)
}

export const noop = () => {
  // 空函数
}

/** 函数组合
 *
 * 从右往左
 */

export const compose = (...funcs) => {
  if (funcs.length === 0) {
    return (arg) => arg
  }
  return funcs.reduce((f, g) => (...args) => f(g(...args)))
}

/** 函数组合
 *
 * 从左往右
 */
export const composeRight = (...funcs) => {
  if (funcs.length === 0) {
    return (arg) => arg
  }
  return funcs.reduce((f, g) => (...args) => f(g(...args)))
}

export const delay = (timeout) => new Promise((resolve) => setTimeout(resolve, timeout))
