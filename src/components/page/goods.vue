<template>
    <div>
        <el-alert :title="score" type="success" :closable="false">
        </el-alert>
        <div class="input-warp flex js">
            <span>余额充值:</span>
            <input v-model="money" placeholder="请输入充值金额" @keyup="_rectifyMoney">
            <el-button type="success" round @click="_sure">确定充值</el-button>
        </div>
        <el-dialog title="微信支付" :visible.sync="dialogTableVisible" :show-close="false">
            <img :src="payImg" class="pay-img">
            <div class="flex">请用微信扫码支付</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="_close">取 消</el-button>
                <el-button type="success" @click="_surePay">确定已完成支付</el-button>
            </span>
        </el-dialog>
        <div class="model-warp js flex">
            <el-select v-model="value" placeholder="筛选记录">
                <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
            <el-button type="primary" @click="_getDetail(true)" round>确定筛选</el-button>
        </div>
        <el-table
            :data="list"
            style="width: 100%"
            :row-class-name="tableRowClassName">
            <el-table-column
                prop="kameng_id"
                label="卡盟ID">
            </el-table-column>
            <el-table-column
                prop="title"
                label="类型">
            </el-table-column>
            <el-table-column
                prop="task_info"
                label="目标信息">
            </el-table-column>
            <el-table-column
                prop="score"
                label="金额">
            </el-table-column>
            <el-table-column
                prop="balance_score"
                label="剩余金额">
            </el-table-column>
            <el-table-column
                prop="create"
                label="时间">
            </el-table-column>
        </el-table>
        <el-pagination
            layout="prev, pager, next"
            :total="total" :page-size="num" :current-page="page" @current-change="_change">
        </el-pagination>
    </div>
</template>

<script>
    import {add_order, order_poll, ksDetail} from '../../api/index'
    import QRCode from 'qrcode'
    import {formatTime} from '../../api/util'

    export default {
        name: "goods",
        data() {
            return {
                options: [{
                    value: '',
                    label: '所有记录'
                },{
                    value: 1,
                    label: '消耗记录'
                }, {
                    value: 2,
                    label: '退款记录'
                }],
                value: '',
                score: `当前余额${this.$root.userInfo.score}元`,
                money: '',
                payInfo: {},
                payImg: null,
                dialogTableVisible: false,
                timer: null,
                timeCunt: 0,
                page: 1,
                num: 10,
                total: 0,
                list: []
            }
        },
        created() {
            this._getDetail()
        },
        methods: {
            _change(value) {
                this.page = value;
                this._getDetail()
            },
            async _getDetail(must) {
                if (must) {
                    this.page = 1
                }
                const loading = this.$loading(this.$root.loadConfig);
                const ret = await ksDetail(this.$root.userInfo.username, this.value, this.page - 1, this.num);
                loading.close();
                if (ret.status === 200 && ret.data.code === 200) {
                    this.list = this._format(ret.data.data.ret);
                    this.total = ret.data.data.count;
                }
            },
            _format(list) {
                if (!list || !list.length) {
                    return []
                }
                list.forEach((item) => {
                    try {
                        item.create = formatTime(new Date(item.create));
                    } catch (e) {
                        console.log(e)
                    }
                });
                return list
            },
            _close() {
                this.dialogTableVisible= false;
                this.payImg = null;
                this.timeCunt = 0;
                clearInterval(this.timer);
            },
            _surePay() {
                this._close();
                let timer = setTimeout(() => {
                    this.$root.eventHub.$emit('updateUserInfo');
                    clearTimeout(timer)
                }, 1000);
            },
            tableRowClassName({row, rowIndex}) {
                if (row.sr_type === 1) {
                    return 'success-row';
                } else {
                    return 'warning-row';
                }
            },
            async _sure() {
                if (this.money <= 0) {
                    this.$message({
                        message: '请输入正确的金额',
                        type: 'warning'
                    });
                    this.money = '';
                    return false
                }
                if (!this.$root.userInfo.username) {
                    this.$message({
                        message: '用户信息错误',
                        type: 'warning'
                    });
                    this.money = '';
                    return false
                }
                const loading = this.$loading(this.$root.loadConfig);
                const ret = await add_order(this.money, this.$root.userInfo.username);
                loading.close();
                if (ret.status === 200 && ret.data.code === 200) {
                    console.log(ret);
                    this.payInfo = ret.data.data;
                    this.changeUrlToQrcode(this.payInfo.pay_ret)
                    // order_code: "20190126134435223DGZ3814754521"
                    // pay_ret: "weixin://wxpay/bizpayurl?pr=4OEWzRB"
                    // success_url: "http://pay.claretangx.com"
                }
            },
            changeUrlToQrcode(pay_url) {
                const opts = {
                    type: 'image/jpeg'
                };
                QRCode.toDataURL(pay_url, opts, (err, url) => {
                    if (err) {
                        console.log(err, '二维码错误')
                    } else {
                        this.payImg = url;
                        this.dialogTableVisible = true;
                        this.timer = setInterval(() => {
                            this.timeCunt++;
                            this._paySuc();
                            if (this.timeCunt >= 50) {
                                this._close()
                            }
                        }, 3000)
                    }
                })
            },
            async _paySuc() {
                const ret = await order_poll(this.payInfo.order_code);
                if (ret.status === 200 && ret.data.code === 200) {
                    this._close();
                    let timer = setTimeout(() => {
                        this.$root.eventHub.$emit('updateUserInfo');
                        clearTimeout(timer)
                    }, 1000);
                }
            },
            _rectifyMoney() {
                if (isNaN(this.money) || this.money.indexOf('.') > -1 || this.money <= 0) {
                    this.money = ''
                }
            },
        }
    }
</script>

<style scoped>
    .el-input {
        width: 220px;
    }

    .input-warp {
        max-width: none;
        width: 100%;
        margin: 10px 0;
        padding: 10px 0;
        border-bottom: 2px solid rgba(0,0,0,.1);
        color: #666;
        font-size: 14px;
    }
    .model-warp{
        padding: 10px 0;
    }
    .input-warp input {
        background-color: rgb(255, 255, 255);
        box-sizing: border-box;
        color: rgb(96, 98, 102);
        display: inline-block;
        height: 40px;
        line-height: 40px;
        width: 200px;
        border-radius: 4px;
        border: 1px solid rgb(220, 223, 230);
        outline: none;
        padding: 0 15px;
        transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1) 0s;
        font-size: 14px;
        margin: 0 0 0 20px;
    }

    input:hover, input:focus {
        border: 1px solid #67c23a;
    }

    .el-button {
        margin-left: 20px;
    }
    .pay-img{
        display: block;
        margin: 0 auto 10px;
    }
</style>
