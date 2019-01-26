<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">抖个赞后台管理系统</div>
            <el-form ref="ruleForm" label-width="0px" class="ms-content">
                <el-form-item prop="username">
                    <el-input v-model="phone" placeholder="请输入手机号">
                        <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
                    </el-input>
                </el-form-item>
                <div class="flex code-box-warp">
                    <el-input placeholder="请输入验证码" v-model="code">
                        <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                    </el-input>
                    <el-button type="primary" class="code-btn" @click="_getCode()">{{time ? `${time}s` : '验证码'}}</el-button>
                </div>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm()">登录</el-button>
                </div>
                <!--  <p class="login-tips">Tips : 用户名和密码随便填。</p> -->
            </el-form>
        </div>
    </div>
</template>
<script>
    import {ks_login, send_verify} from '../../api/index'

    export default {
        data: function () {
            return {
                phone: '',
                code: '',
                time: 0,
                timer: null
            }
        },
        created() {
        },
        methods: {
            async submitForm() {
                if (!this.phone) {
                    this.$message({
                        message: '请输入手机号',
                        type: 'warning'
                    });
                    return false
                }
                let myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(16[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}|(19[0-9]{1})))+\d{8})$/
                if (!myreg.test(this.phone)) {
                    this.$message({
                        message: '请正确填写手机号',
                        type: 'warning'
                    });
                    return false
                }
                if (!this.code) {
                    this.$message({
                        message: '请输入验证码',
                        type: 'warning'
                    });
                    return false
                }
                const loading = this.$loading(this.$root.loadConfig);
                const ret = await ks_login(this.phone, this.code);
                loading.close();
                if (ret.status === 200 && ret.data.code === 200) {
                    // console.log(ret.data.data)
                    localStorage.setItem('ms_userinfo', JSON.stringify(ret.data.data));
                    this.$router.replace({
                        path: '/'
                    });
                    return false
                }
                if(ret === 431) {
                    this.$message({
                        message: '验证码错误',
                        type: 'warning'
                    });
                }
            },
            async _getCode() {
                if (this.time) {
                    return false
                }
                if (!this.phone) {
                    this.$message({
                        message: '请输入手机号',
                        type: 'warning'
                    });
                    return false
                }
                let myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(16[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}|(19[0-9]{1})))+\d{8})$/
                if (!myreg.test(this.phone)) {
                    this.$message({
                        message: '请正确填写手机号',
                        type: 'warning'
                    });
                    return false
                }
                const loading = this.$loading(this.$root.loadConfig);
                const ret = await send_verify(this.phone);
                loading.close();
                if (ret.status === 200 && ret.data.code === 200) {
                    clearInterval(this.timer)
                    this.$message({
                        message: '验证码发送成功',
                        type: 'success'
                    });
                    this.time = 60
                    this.timer = setInterval(() => {
                        this.time -= 1
                        if (this.time <= 0) {
                            this.time = 0
                            clearInterval(this.timer)
                            this.timer = null
                        }
                    }, 1000)
                } else {
                    this.$message({
                        message: '发送失败,请稍后重试',
                        type: 'warning'
                    });
                }
            },
        }
    }

</script>
<style scoped>
    .login-wrap {
        position: relative;
        width: 100%;
        height: 100%;
        background: linear-gradient(to top, rgb(51, 62, 78) 0%, rgb(44, 104, 193) 100%);
        /*background-image: url(../../assets/login-bg.jpg);*/
        background-size: 100%;
    }

    .ms-title {
        width: 100%;
        line-height: 50px;
        text-align: center;
        font-size: 20px;
        color: #fff;
        border-bottom: 1px solid #ddd;
    }

    .ms-login {
        position: absolute;
        left: 50%;
        top: 50%;
        width: 350px;
        margin: -190px 0 0 -175px;
        border-radius: 5px;
        background: rgba(255, 255, 255, 0.3);
        overflow: hidden;
    }

    .ms-content {
        padding: 30px 30px;
    }

    .login-btn {
        text-align: center;
    }

    .login-btn button {
        width: 100%;
        height: 36px;
        margin-bottom: 10px;
    }

    .login-tips {
        font-size: 12px;
        line-height: 30px;
        color: #fff;
    }

    .code-box-warp {
        margin-bottom: 20px;
    }

    .code-box-warp .code-btn {
        margin-left: 10px;
    }
</style>
