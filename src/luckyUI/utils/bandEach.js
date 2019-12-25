function observe(obj) {
  if (!obj || typeof obj !== 'object') return
  let objKeys = Object.keys(obj)
  objKeys.forEach(key => defineReactive(obj, key, obj[key]))
}

function defineReactive(obj, key, val) {
  var subscriber = new Subscriber()
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get() {
      console.log(`读取${val}`)
      if (Subscriber.target) {
        subscriber.addDep(Subscriber.target)
      }
      return val
    },
    set(newVal) {
      console.log(`${val}被修改为${newVal}`)
      if (newVal === val) return
      val = newVal
      subscriber.notify()
    }
  })
}

class Subscriber {
  constructor() {
    this.deps = [];
  }
}
Subscriber.prototype = {
  addDep: function (dep) {
    this.deps.push(dep)
  },
  notify: function () {
    this.deps.forEach(dep => dep.update())
  }
}
Subscriber.target = null

function Watcher(vm, exp, cb) {
  this.vm = vm
  this.exp = exp
  this.cb = cb
  this.value = this.get()
}
Watcher.prototype = {
  update: function () {
    this.run()
  },
  run: function () {
    let val = this.vm.data[this.exp]
    let oldVal = this.value
    if (val !== oldVal) {
      this.value = val
      this.cb.call(this.vm, val, oldVal)
    }
  },
  get: function () {
    Subscriber.target = this
    let val = this.vm.data[this.exp]
    Subscriber.target = null
    return val
  }
}