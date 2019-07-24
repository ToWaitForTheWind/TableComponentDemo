const debounce = function (func, wait) {
  let timeout
  return function () {
    let context = this
    let args = arguments

    if (timeout) clearTimeout(timeout)

    let callNow = !timeout
    timeout = setTimeout(() => {
      timeout = null
    }, wait)

    if (callNow) func.apply(context, args)
  }
}
export { debounce }