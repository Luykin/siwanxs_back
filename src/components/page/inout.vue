<template>
  <div v-loading="loading">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-setting"></i> 数据导出 </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-dialog title="数据库备份" :visible.sync="dialogVisible" width="30%">
      <span>是否对线上数据库数据进行备份</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="_sqlexcel">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="数据库备份" :visible.sync="dialogVisible1" width="30%">
      <span>是否导出可提现用户信息</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible1 = false">取 消</el-button>
        <el-button type="primary" @click="_userexcel">确 定</el-button>
      </span>
    </el-dialog>
    <el-button type="warning" plain @click="dialogVisible = true">数据库备份</el-button>
    <el-button type="primary" plain @click="dialogVisible1 = true">导出可提现用户信息(excel)</el-button>
  </div>
</template>
<script>
  import { excel } from '../../api/index'
  export default {
    data() {
      return {
        dialogVisible: null,
        dialogVisible1: null,
        loading: null
      }
    },
    methods: {
      async _sqlexcel() {
        this.dialogVisible = false
        this.loading = true
        const ret = await excel(10, 1)
        let blob = ret.data
        let reader = new FileReader()
        reader.readAsDataURL(blob)
        reader.onload = (e) => {
          let a = document.createElement('a')
          a.download = `${new Date().valueOf()}node.sql`
          a.href = e.target.result
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
        }
        this.loading = null
      },
      async _userexcel() {
        this.dialogVisible1 = false
        this.loading = true
        try {
          const ret = await excel(500, 0)
          let blob = ret.data
          let reader = new FileReader()
          reader.readAsDataURL(blob)
          reader.onload = (e) => {
            let a = document.createElement('a')
            a.download = `${new Date().valueOf()}node.xlsx`
            a.href = e.target.result
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
          }
        } catch(err) {
          console.log(err)
        }
        this.loading = null
      }
    }
  }

</script>
<style scoped>


</style>
