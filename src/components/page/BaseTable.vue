<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 用户信息</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
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
                <el-table-column prop="createdAt" label="注册时间">
                </el-table-column>
                <el-table-column prop="teame_dition_time" label="购买团队版时间">
                </el-table-column>
                <el-table-column prop="openid" label="用户唯一标识">
                </el-table-column>
                <el-table-column fixed="right" label="操作">
                    <template slot-scope="scope">
                        <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
                        <!--                         <el-button type="text" size="small">编辑</el-button> -->
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination layout="total, prev, pager, next" :total="totle" :page-size="pageSize" @current-change="handleCurrentChange">
            </el-pagination>
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
            tableData: [],
            pageSize: 10,
            page: 0,
            totle: 0,
            loading: null
        }
    },
    created() {
        this._getuserinfo()
    },
    methods: {
        async _getuserinfo() {
            try {
                this.loading = true
                const ret = await getuserinfo(this.pageSize, this.pageSize * this.page)
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
        handleClick(e) {
            console.log(e)
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

</style>
