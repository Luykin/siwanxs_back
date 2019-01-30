<template>
    <div>
        <div class="flex js btn-all-warp">
            <el-input v-model="query" placeholder="卡盟ID查询" class="query-input"></el-input>
            <el-button type="primary" @click="_getOrder">查询</el-button>
            <div class="flex"></div>
            <el-button type="success" @click="_batchTask">批量提交未成功订单</el-button>
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
                prop="create"
                label="创建时间">
            </el-table-column>
            <el-table-column
                prop="aa"
                label="任务目标">
            </el-table-column>
            <el-table-column
                prop="need_num_0"
                label="下单数量">
            </el-table-column>
            <el-table-column
                prop="use_money"
                label="消耗金额">
            </el-table-column>
            <el-table-column
                prop="user_id"
                label="下单用户ID">
            </el-table-column>
            <el-table-column
                prop="successTime"
                label="完成时间">
            </el-table-column>
            <el-table-column
                prop="CN_status"
                label="状态">
            </el-table-column>
            <!--use_money-->
        </el-table>
        <el-pagination
            layout="prev, pager, next"
            :total="total" :page-size="num" :current-page="page" @current-change="_change">
        </el-pagination>
    </div>
</template>

<script>
    import {task_order, batch_task} from '../../api/index'
    import {formatTime} from '../../api/util'
    export default {
        name: "consume",
        data() {
            return {
                list: [],
                page: 1,
                num: 10,
                total: 0,
                query: ''
            }
        },
        created() {
            this._getOrder()
        },
        methods: {
            _change(value) {
                this.page = value;
                this._getOrder()
            },
            tableRowClassName({row, rowIndex}) {
                if (row.status === 2) {
                    return 'success-row';
                } else if (row.status === 0) {
                    return 'warning-row';
                }
                return '';
            },
            async _getOrder() {
                const loading = this.$loading(this.$root.loadConfig);
                const ret = await task_order(this.$root.userInfo.username, this.query, this.page - 1, this.num);
                loading.close();
                if (ret.status === 200 && ret.data.code === 200) {
                    this.list = this._format(ret.data.data.ret);
                    this.total = ret.data.data.count;
                }
            },
            //433 余额不足
            async _batchTask() {
                const loading = this.$loading(this.$root.loadConfig);
                const ret = await batch_task(this.$root.userInfo.username);
                loading.close();
                if (ret.status === 200 && ret.data.code === 200) {
                    this.$message({
                        message: '提交成功',
                        type: 'success'
                    });
                    this.$root.eventHub.$emit('updateUserInfo');
                    this.page = 1;
                    this._getOrder()
                }
                if (ret === 433) {
                    this.$message({
                        message: '余额不足',
                        type: 'warning'
                    });
                }
            },
            _format(list) {
                if (!list || !list.length) {
                    return []
                }
                list.forEach((item) => {
                    try {
                        item.CN_status = item.status === 0 ? '未提交' : item.status === 1 ? '进行中' : '已完成';
                        item.create = formatTime(new Date(item.create));
                        item.successTime = item.update ? formatTime(new Date(item.update)) : '-';
                    } catch (e) {
                        console.log(e)
                    }
                });
                return list
            }
        },
    }
</script>

<style scoped>
    /*.el-button{*/
        /*margin-bottom: 15px;*/
    /*}*/
    .btn-all-warp{
        margin-bottom: 15px;
    }
    .query-input{
        width: 250px;
        margin-right: 20px;
    }
</style>
