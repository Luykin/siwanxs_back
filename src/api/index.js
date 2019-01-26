import axios from 'axios'
import qs from 'qs'
import { PREFIX_URL, UAID } from './config'
import { getSign, getTime } from './util'
// 卡商登录
export function ks_login(phone, code) {
    const url = `${PREFIX_URL}/ks/login`;
    let data = {
        phone,
        code,
        uaid: UAID,
        timestamp: getTime(),
    };
    return axios.post(url, qs.stringify(Object.assign({
        sign: getSign(data)
    }, data))).then(function (res) {
        return Promise.resolve(res)
    }).catch(res => {
        return Promise.resolve(res.response.status)
    })
}

// 发生验证码
export function send_verify(phone) {
    const url = `${PREFIX_URL}/send_verify`
    let data = {
        phone,
        uaid: UAID,
        timestamp: getTime(),
    }
    return axios.post(url, qs.stringify(Object.assign({
        sign: getSign(data)
    }, data))).then(function (res) {
        return Promise.resolve(res)
    }).catch(res => {
        return Promise.resolve(res.response.status)
    })
}
