export function debounce(func, delay) {
  let timeout
  return function () {
    const context = this,
      args = arguments
    clearTimeout(timeout)
    timeout = setTimeout(function () {
      func.apply(context, args)
    }, delay)
  }
}
