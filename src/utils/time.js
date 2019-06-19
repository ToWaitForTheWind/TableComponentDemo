// unix时间戳转时间
export const unixToTime = unix => {
  let runix = Object.prototype.toString.call(unix) === '[object Array]' ? unix : [unix]
  let arr = []
  let i = 0
  do {
    const time = new Date(runix[i] * 1)
    let month = time.getMonth() + 1 < 10 ? '0' + (time.getMonth() + 1) : time.getMonth() + 1
    let day = time.getDate() < 10 ? '0' + time.getDate() : time.getDate()
    let hours = time.getHours() < 10 ? '0' + time.getHours() : time.getHours()
    let minutes = time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes()
    let seconds = time.getSeconds() < 10 ? '0' + time.getSeconds() : time.getSeconds()
    arr.push(time.getFullYear() + '/' + month + '/' + day + ' ' + hours + ':' + minutes + ':' + seconds)
    i++
  } while (i < runix.length)
  return arr
}

// unix时间戳转日期
export const unixToDay = unix => {
  let runix = Object.prototype.toString.call(unix) === '[object Array]' ? unix : [unix]
  let arr = []
  let i = 0
  do {
    const time = new Date(runix[i] * 1)
    let day = time.getDate() < 10 ? '0' + time.getDate() : time.getDate()
    let month = time.getMonth() + 1 < 10 ? '0' + (time.getMonth() + 1) : time.getMonth() + 1
    arr.push(time.getFullYear() + '/' + month + '/' + day)
    i++
  } while (i < runix.length)
  return arr
}

// unix时间戳转日期
export const unixToYMD = unix => {
  let runix = Object.prototype.toString.call(unix) === '[object Array]' ? unix : [unix]
  let arr = []
  let i = 0
  do {
    const time = new Date(runix[i] * 1)
    let day = time.getDate()
    arr.push(time.getFullYear() + '年' + (time.getMonth() + 1) + '月' + day + '日')
    i++
  } while (i < runix.length)
  return arr
}

// unix时间戳转小时
export const unixToHours = unix => {
  let runix = Object.prototype.toString.call(unix) === '[object Array]' ? unix : [unix]
  let arr = []
  let i = 0
  do {
    const time = new Date(runix[i] * 1)
    let day = time.getDate() < 10 ? '0' + time.getDate() : time.getDate()
    let hours = time.getHours() < 10 ? '0' + time.getHours() : time.getHours()
    let minutes = time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes()
    arr.push(time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + day + ' ' + hours + ':' + minutes)
    i++
  } while (i < runix.length)
  return arr
}

// 时间转unix时间戳
export const timeToUnix = time => {
  const unix = Object.prototype.toString.call(time) === '[object Array]' ? time : [time]
  let results = unix.map(element => {
    return new Date(element).getTime()
  })
  // 初始值为1990/01/01 00:00:00
  // if (!time) results = '631123200000'
  return results
}
