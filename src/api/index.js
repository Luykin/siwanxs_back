import axios from 'axios'
import qs from 'qs'
import { PREFIX_URL } from './config'
import { getSign } from './util'

export function login(name, password) {
  const url = `${PREFIX_URL}/back/login`
  let data = {
    name,
    password
  }
  return axios.post(url, qs.stringify(Object.assign(data, {'_sg': getSign(data)})))
  .then((res) => {
    return Promise.resolve(res)
  })
  .catch((error) => {
    return Promise.resolve({
      err_code: error.response.status,
      err_msg: error.response.status
    })
  })
}

export function getuserinfo(limit, offset) {
  const url = `${PREFIX_URL}/back/userinfo`
  let data = {
    limit,
    offset
  }
  return axios.post(url, qs.stringify(Object.assign(data, {'_sg': getSign(data)})))
  .then((res) => {
    return Promise.resolve(res)
  })
  .catch((error) => {
    return Promise.resolve({
      err_code: error.response.status,
      err_msg: error.response.status
    })
  })
}
