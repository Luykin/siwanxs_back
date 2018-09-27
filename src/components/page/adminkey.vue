<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-setting"></i> 客服管理 </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="header-box">
            <el-input placeholder="请填写客服账号" v-model="name" class="input-max-width">
            </el-input>
            <el-input placeholder="请填写客服密码" v-model="password" class="input-max-width">
            </el-input>
            <el-button type="success" round @click="_submit()" class="bottn-my">新建客服帐号</el-button>
        </div>
        <el-table :data="tableData" border style="width: 100%" v-loading="loading">
            <el-table-column label="头像" width="90">
                <template slot-scope="scope">
                    <img :src="scope.row.icon" @error="_imgerror($event)" class="user-icon">
                </template>
            </el-table-column>
            <el-table-column prop="name" label="姓名">
            </el-table-column>
            <el-table-column prop="power" label="权限">
            </el-table-column>
            <el-table-column prop="createdAt" label="创建时间">
            </el-table-column>
            <el-table-column fixed="right" label="操作">
                <template slot-scope="scope">
                    <el-button @click="handleClick(scope.row)" type="text" size="small">查看密码</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="bottom-pagination-box">
            <el-pagination layout="total, prev, pager, next" :total="totle" :page-size="pageSize" @current-change="handleCurrentChange">
            </el-pagination>
        </div>
        <el-dialog title="客服密码" :visible.sync="dialogTableVisible">
            <div>{{adminpass}}</div>
        </el-dialog>
    </div>
</template>
<script>
import { adminaccount, adminlist } from '../../api/index'
export default {
    data() {
        return {
            tableData: [],
            loading: null,
            totle: 0,
            pageSize: 10,
            page: 0,
            name: '',
            password: '',
            adminpass: '',
            dialogTableVisible: null
        }
    },
    created() {
        this._adminlist()
    },
    methods: {
        async _adminlist() {
            try {
                this.loading = true
                const ret = await adminlist(this.pageSize, this.pageSize * this.page)
                this.loading = null
                if (ret.data.state == 200) {
                    this.totle = ret.data.count
                    this.tableData = ret.data.rows
                }
            } catch (err) {
                console.log(err)
            }
        },
        async _adminaccount() {
            try {
                const ret = await adminaccount(this.name, this.password)
                if (ret.data.data[1]) {
                    this.$message({
                        showClose: true,
                        message: '创建成功',
                        type: 'success'
                    });
                    this.name = ''
                    this.password = ''
                } else {
                    this.$message({
                        showClose: true,
                        message: '请检查帐号是否已存在',
                        type: 'warning'
                    });
                }
                this._adminlist()
            } catch (err) {
                console.log(err)
            }
        },
        _submit() {
            if (this.name.length < 6 || this.password.length < 6) {
                this.$message({
                    showClose: true,
                    message: '请输入大于5位的帐号密码',
                    type: 'warning'
                });
            } else {
                this._adminaccount()
            }
        },
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
            this.page = val - 1
            this._adminlist()
        },
        handleClick(e) {
        	this.adminpass = e.password
        	this.dialogTableVisible = true
        }
    }

}

</script>
<style scoped>
.user-icon {
    display: block;
    width: 50px;
    height: 50px;
    border-radius: 100%;
}

.bottom-pagination-box {
    width: 100%;
    height: 40px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
}

.input-max-width {
    max-width: 200px;
    margin-right: 20px;
}

.header-box {
    display: flex;
    height: 60px;
    justify-content: flex-start;
}

.bottn-my {
    display: block;
    height: 35px;
}

</style>
