// 精确到指定位数的小数
const zround = (n, decimals = 0) => Number(`${Math.round(`${n}e${decimals}`)}e-${decimals}`)

const sleep = seconds => new Promise((resolve) => { setTimeout(resolve, seconds) })

const formatNumber = (n) => {
  n = n.toString()  // eslint-disable-line
  return n[1] ? n : '0' + n // eslint-disable-line
}

// 日期相关
const formatDateTime = (date) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  const dateStr = [year, month, day].map(formatNumber).join('-')
  const timeStr = [hour, minute, second].map(formatNumber).join(':')
  return `${dateStr} ${timeStr}`
}

const formatDate = (date) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const dateStr = [year, month, day].map(formatNumber).join('-')
  return dateStr
}

const formatTime = (date) => {
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  const timeStr = [hour, minute, second].map(formatNumber).join(':')
  return timeStr
}

export {
  zround,
  sleep,
  formatDateTime,
  formatDate,
  formatTime,
}
