const CryptoJS = require('./CryptoJS.js')
const PRIVATE_KEY = '2018ybyscde2383f6839ee8a99d1d8e6ba8a7e'
export const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const getKey = () => {
  const timestamp = parseInt(Date.parse(new Date()) / 10000) + ''
  const key = CryptoJS.MD5(signStr).toString().toUpperCase()
  return key
}
export function getSign(data) {
    let sortedKeys = Object.keys(data).sort()
    let signStr = ''
    for (let item in sortedKeys) {
        const key = sortedKeys[item]
        signStr += key + '=' + data[key]
    }
    signStr += 'key=' + PRIVATE_KEY
    return CryptoJS.MD5(signStr).toString()
}

export function getTime() {
    return parseInt(Date.parse(new Date()) / 1000)
}

const verifyPhone=(phone)=> {
  if (!phone) {
    return false
  }
  let myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}|(19[0-9]{1})))+\d{8})$/
  if (!myreg.test(phone)) {
    return false
  }
  return true
}
// module.exports = {
//   formatTime: formatTime,
//   verifyPhone: verifyPhone,
//   getKey: getKey,
//   getSign:getSign
// }
