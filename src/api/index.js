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

// 更新用户信息
export function update(username) {
    const url = `${PREFIX_URL}/ks/update`;
    let data = {
        username,
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

// 批量提交
export function batch_task(username) {
    const url = `${PREFIX_URL}/ks/batch/task`;
    let data = {
        username,
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

// 充值状态查询
export function order_poll(code) {
    const url = `${PREFIX_URL}/ks/poll`;
    let data = {
        code,
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

// 卡商后台充值
export function add_order(score, username) {
    const url = `${PREFIX_URL}/ks/add/order`;
    let data = {
        score,
        uaid: UAID,
        username,
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
// https://dev.btc.melonblock.com/fabulous/ks/task_order
export function task_order(username, page, num) {
    const url = `${PREFIX_URL}/ks/task_order`;
    let data = {
        username,
        page,
        num,
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
