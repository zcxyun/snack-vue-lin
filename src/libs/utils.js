// 精确到指定位数的小数
const zround = (n, decimals = 0) => Number(`${Math.round(`${n}e${decimals}`)}e-${decimals}`)

const sleep = seconds => new Promise((resolve) => { setTimeout(resolve, seconds) })

export {
  zround,
  sleep,
}
