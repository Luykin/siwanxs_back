<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="8">
                <el-card shadow="hover" style="height:290px;">
                    <div class="user-info">
                        <img :src="$root.userInfo.avatar" class="user-avator" alt="">
                        <!--{"username":"3814754521","nickname":"17323869299","avatar":"https://cdn.xingkwh.com/DGZavatar.png","score":"0.00","phone":"17323869299"}-->
                        <div class="user-info-cont">
                            <div class="user-info-name">{{$root.userInfo.nickname}}</div>
                            <div>管理员</div>
                        </div>
                    </div>
                    <div class="user-info-list">后台人员ID: {{$root.userInfo.username}}</div>
                    <div class="user-info-list">余额:{{$root.userInfo.score}}</div>
                </el-card>
            </el-col>
            <el-col :span="12">
                <el-card shadow="hover" style="height:290px;">
                    <div v-html="appInfo" class="notice"></div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import Schart from 'vue-schart';
    import {getAppInfo} from '../../api/index';

    export default {
        name: 'dashboard',
        data() {
            return {
                // name: localStorage.getItem('ms_username'),
                // userInfo: JSON.parse(localStorage.getItem('ms_userinfo'))
                appInfo: ''
            }
        },
        components: {
            Schart
        },
        created() {
            this._getAppInfo()
        },
        computed: {},
        activated() {
            // this.handleListener();
        },
        deactivated() {
            // window.removeEventListener('resize', this.renderChart);
            // bus.$off('collapse', this.handleBus);
        },
        methods: {
            async _getAppInfo() {
                const loading = this.$loading(this.$root.loadConfig);
                const ret = await getAppInfo();
                loading.close();
                if (ret.status === 200 && ret.data.code === 200) {
                    this.appInfo = ret.data.data.ks_notice
                }
            },
            // changeDate(){
            //     const now = new Date().getTime();
            //     this.data.forEach((item, index) => {
            //         const date = new Date(now - (6 - index) * 86400000);
            //         item.name = `${date.getFullYear()}/${date.getMonth()+1}/${date.getDate()}`
            //     })
            // },
            // handleListener(){
            //     bus.$on('collapse', this.handleBus);
            //     // 调用renderChart方法对图表进行重新渲染
            //     window.addEventListener('resize', this.renderChart)
            // },
            // handleBus(msg){
            //     setTimeout(() => {
            //         this.renderChart()
            //     }, 300);
            // },
            // renderChart(){
            //     this.$refs.bar.renderChart();
            //     this.$refs.line.renderChart();
            // }
        }
    }

</script>


<style scoped>
    .el-row {
        margin-bottom: 20px;
    }

    .grid-content {
        display: flex;
        align-items: center;
        height: 100px;
    }

    .grid-cont-right {
        flex: 1;
        text-align: center;
        font-size: 14px;
        color: #999;
    }

    .grid-num {
        font-size: 30px;
        font-weight: bold;
    }

    .grid-con-icon {
        font-size: 50px;
        width: 100px;
        height: 100px;
        text-align: center;
        line-height: 100px;
        color: #fff;
    }

    .grid-con-1 .grid-con-icon {
        background: rgb(45, 140, 240);
    }

    .grid-con-1 .grid-num {
        color: rgb(45, 140, 240);
    }

    .grid-con-2 .grid-con-icon {
        background: rgb(100, 213, 114);
    }

    .grid-con-2 .grid-num {
        color: rgb(45, 140, 240);
    }

    .grid-con-3 .grid-con-icon {
        background: rgb(242, 94, 67);
    }

    .grid-con-3 .grid-num {
        color: rgb(242, 94, 67);
    }

    .user-info {
        display: flex;
        align-items: center;
        padding-bottom: 20px;
        border-bottom: 2px solid #ccc;
        margin-bottom: 20px;
    }

    .user-avator {
        width: 90px;
        height: 90px;
        border-radius: 50%;
    }

    .user-info-cont {
        padding-left: 50px;
        flex: 1;
        font-size: 14px;
        color: #999;
    }

    .user-info-cont div:first-child {
        font-size: 30px;
        color: #222;
    }

    .user-info-list {
        font-size: 14px;
        color: #999;
        line-height: 25px;
    }

    .user-info-list span {
        margin-left: 70px;
    }

    .mgb20 {
        margin-bottom: 20px;
    }

    .todo-item {
        font-size: 14px;
    }

    .todo-item-del {
        text-decoration: line-through;
        color: #999;
    }

    .schart {
        width: 100%;
        height: 300px;
    }

    .notice {
        overflow: hidden;
        padding: 10px;
        line-height: 25px;
    }

</style>
