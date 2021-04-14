function EventEmit() {
  this.server = []
  this.wait = []
}

EventEmit.prototype.on = function(key, fn) {
  for (let i = 0; i < this.wait.length; i++) {
    this.wait[i].key === key && fn.apply(this, this.wait[i].arr)
  }

  const existItem = this.server.find((el) => el.key === key)
  if (existItem) {
    existItem.fns.push(fn)
  } else {
    this.server.push({
      key,
      fns: [fn]
    })
  }
}

EventEmit.prototype.off = function(key) {
  this.server = this.server.filter((el) => {
    return key !== el.key
  })

  this.wait = this.wait.filter((el) => {
    return key !== el.key
  })
}

EventEmit.prototype.emit = function(key) {
  const { fns } = this.server.find((el) => el.key === key) || {}
  if (!fns || fns.length === 0) {
    const arr = Array.prototype.slice.call(arguments, 1)
    const waitEvent = { key, arr }
    this.wait.push(waitEvent)
    return false
  }

  const arr = Array.prototype.slice.call(arguments, 1)

  for (let i = 0, fn; i < fns.length; i++) {
    fn = fns[i]
    fn.apply(this, arr)
  }
}

export default EventEmit

export const eventEmit = new EventEmit()
