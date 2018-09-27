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
                <el-table-column label="头像" width="90">
                    <template slot-scope="scope">
                        <img :src="scope.row.icon" @error="_imgerror($event)" class="user-icon">
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="姓名" width="120">
                </el-table-column>
                <el-table-column prop="phone" label="手机">
                </el-table-column>
                <el-table-column prop="consumption" label="消费金额">
                </el-table-column>
                <el-table-column prop="balance" label="可提现余额">
                </el-table-column>
                <el-table-column label="已成功邀请人数">
                    <template slot-scope="scope">
                        {{scope.row.myic ? scope.row.myic.invited_user.length : 0}}
                    </template>
                </el-table-column>
                <el-table-column prop="createdAt" label="注册时间">
                </el-table-column>
                <el-table-column prop="teame_dition_time" label="购买团队版时间">
                </el-table-column>
                <el-table-column prop="openid" label="用户唯一标识">
                </el-table-column>
                <el-table-column fixed="right" label="操作">
                    <template slot-scope="scope">
                        <el-button @click="handleClick(scope.row)" type="text" size="small">查看邀请记录</el-button>
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
import { getuserinfo } from '../../api/index'
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
            options: [{
                value: 'all',
                label: '全部用户'
            }, {
                value: 'presented',
                label: '可提现用户'
            }],
            querymethod: 'all',
            queryString: null,
            dialogTableVisible: null
        }
    },
    created() {
        this._getuserinfo()
    },
    methods: {
        _query() {
            this.page = 0
            this._getuserinfo()
        },
        async _getuserinfo() {
            try {
                this.loading = true
                const ret = await getuserinfo(this.pageSize, this.pageSize * this.page, this.querymethod, this.queryString)
                this.loading = null
                if (ret.data.state == 200) {
                    this.totle = ret.data.count
                    this.tableData = this._formatret(ret.data.rows)
                }
            } catch (err) {
                console.log(err)
            }
        },
        _formatret(list) {
            list.map((item) => {
                const itemcopy = item
                itemcopy.createdAt = formatTime(new Date(item.createdAt))
                itemcopy.updatedAt = formatTime(new Date(item.updatedAt))
                itemcopy.teame_dition_time = item.teame_dition_time ? formatTime(new Date(parseInt(item.teame_dition_time))) : '未购买'
                return itemcopy
            })
            return list
        },
        // async _getmoreuserinfo(id) {
        //     try {
        //         this.loadinguser = true
        //         const ret = await getmoreuserinfo(id)
        //         this.loadinguser = null
        //         return ret.data.userinfo.myic && ret.data.userinfo.myic.invited_user ? ret.data.userinfo.myic.invited_user : null
        //         // if (userinfo.data.state ==  200) {
        //         //     this.userinfo = userinfo.data.userinfo.myic.invited_user
        //         //     console.log(userinfo.data.userinfo.myic.invited_user)
        //         //     console.log(this.userinfo)
        //         //     // console.log(userinfo.data.userinfo.myic.invited_user)
        //         // }
        //     } catch (err) {
        //         console.log(err)
        //     }
        // },
        handleClick(e) {
            // console.log(e.myic.invited_user)
            this.dialogTableVisible = true
            this.invited_user = e.myic ? e.myic.invited_user : []
            // console.log(this.invited_user)
        },
        _imgerror(e) {
            if (e.target.src != 'http://pfnzvmvon.bkt.clouddn.com/nim.jpeg') {
                e.target.src = 'http://pfnzvmvon.bkt.clouddn.com/nim.jpeg'
            }
        },
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
