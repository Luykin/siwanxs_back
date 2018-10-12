<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 用户信息</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="table-select-box">
                <el-select placeholder="请选择" v-model="querymethod">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
                <el-input v-model="queryString" placeholder="请输入内容" class="search-input"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="_query()">查询</el-button>
            </div>
            <el-table :data="tableData" border style="width: 100%" v-loading="loading">
                <el-table-column prop="id" label="订单ID" width="120">
                </el-table-column>
                <el-table-column prop="title" label="订单">
                </el-table-column>
                <el-table-column prop="order" label="微信订单号">
                </el-table-column>
                <el-table-column prop="total_fee" label="订单金额">
                </el-table-column>
                <el-table-column prop="user.name" label="用户">
                </el-table-column>
                <el-table-column prop="user.phone" label="用户电话">
                </el-table-column>
                <el-table-column prop="createdAt" label="创建时间">
                </el-table-column>
                <el-table-column prop="updatedAt" label="更新时间">
                </el-table-column>
                <el-table-column label="支付状态" width="100">
                    <template slot-scope="scope">
                        {{scope.row.status == 1 ? '已支付' : '未支付'}}
                    </template>
                </el-table-column>

            </el-table>
            <div class="bottom-pagination-box">
                <el-pagination layout="total, prev, pager, next" :total="totle" :page-size="pageSize" @current-change="handleCurrentChange">
                </el-pagination>
            </div>
            <el-dialog title="用户详细信息" :visible.sync="dialogTableVisible">
                <!-- {{userInfo[0].id}} -->
                <div>该用户成功邀请的付费用户</div>
                <el-table :data="invited_user">
                    <el-table-column prop="name" label="姓名"></el-table-column>
                    <el-table-column prop="phone" label="联系电话"></el-table-column>
                </el-table>
            </el-dialog>
        </div>
    </div>
</template>
<script>
import { orderlist } from '../../api/index'
import { formatTime } from '../../api/util'
export default {
    name: 'basetable',
    data() {
        return {
            invited_user: [],
            tableData: [],
            pageSize: 10,
            page: 0,
            totle: 0,
            loading: null,
            loadinguser: null,
            queryString: null,
            dialogTableVisible: null,
            options: [{
                value: 'all',
                label: '全部订单'
            }, {
                value: 'completed',
                label: '已支付订单'
            }],
            querymethod: 'all'
        }
    },
    created() {
        this._orderlist()
    },
    methods: {
        _query() {
            this.page = 0
            this._orderlist()
        },
        async _orderlist() {
            try {
                this.loading = true
                const ret = await orderlist(this.pageSize, this.pageSize * this.page, this.querymethod , this.queryString)
                this.loading = null
                if (ret.data.state == 200) {
                    this.totle = ret.data.count
                    this.tableData = ret.data.rows
                }
            } catch (err) {
                console.log(err)
            }
        },
        // _formatret(list) {
        //     list.map((item) => {
        //         const itemcopy = item
        //         itemcopy.createdAt = formatTime(new Date(item.createdAt))
        //         itemcopy.updatedAt = formatTime(new Date(item.updatedAt))
        //         itemcopy.teame_dition_time = item.teame_dition_time ? formatTime(new Date(parseInt(item.teame_dition_time))) : '未购买'
        //         return itemcopy
        //     })
        //     return list
        // },
        // handleClick(e) {
        //     // console.log(e.myic.invited_user)
        //     this.dialogTableVisible = true
        //     this.invited_user = e.myic ? e.myic.invited_user : []
        //     // console.log(this.invited_user)
        // },
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
            this.page = val - 1
            this._getuserinfo()
        }
    },
    computed: {

    }
}

</script>
<style scoped>
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 300px;
    display: inline-block;
}

.del-dialog-cnt {
    font-size: 16px;
    text-align: center
}

.table {
    width: 100%;
    font-size: 14px;
}

.red {
    color: #ff0000;
}

.user-icon {
    display: block;
    width: 50px;
    height: 50px;
    border-radius: 100%;
}

.table-select-box {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    height: 60px;
    margin: 0px auto 10px;
}

.search-input {
    max-width: 180px;
    margin: 0 20px;
}

.bottom-pagination-box {
    width: 100%;
    height: 40px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
}

</style>
