<template>
    <div id="container" class="changePassword">
        <div class="content">
            <div class="cont">
                <Form :model="formItem" :label-width="60" label-position="left">
                    <FormItem label="验证码" >
                        <Input v-model="formItem.code" placeholder="请输入验证码">
                            <i v-if="!formItem.isCode" slot="append" @click="getCode">{{formItem.codeText}}</i>
                            <i v-else slot="append" >{{formItem.codeText}}</i>
                        </Input>
                    </FormItem>
                    <FormItem label="新密码" >
                        <Input v-model="formItem.newPhone" placeholder="请输入新密码" type="password"></Input>
                    </FormItem>
                    <FormItem label="确认密码" >
                        <Input v-model="formItem.againPhone" placeholder="请再次输入密码" type="password"></Input>
                    </FormItem>
                </Form>
            </div>
            <div class="foot">
                <Button long @click.native="save" >保存</Button>
            </div>
        </div>
    </div>
</template>
<script>
import {post,wxpost} from '@/axios/ajax';
import {isLoading} from '@/assets/js/load.js';
import {removeLoginUser,deleteCookie} from '@/assets/js/assist.js';
export default {
    name: 'changePassword',
    data() {
        return{
            formItem:{
                code:'',
                isCode:false,//
                codeText:'点击获取验证码',
                newPhone:'',
                againPhone:''
            }
        }
    },
    components: {

    },
    methods:{
        getCode(){//获取校验码
            let that = this;
            if(that.formItem.isCode){
                that.$Message.warning('请稍后再获取');
                return false;
            }
            isLoading(that,'获取验证码中···');
            that.formItem.isCode = true;
            wxpost('User/SetSendSmsByModifyPwd').then(res =>{
                that.$Spin.hide();
                if(res.code == 200){
                    that.$Message.success(res.details);
                    let time = 59;//倒数时间
                    let text = '';
                    // that.formItem.code = reg.details;//校验码;
                    text = time+'s后重新获取';
                    that.formItem.codeText = text;
                    let setTime = setInterval(_=>{
                        time--;
                        text = time+'s后重新获取';
                        if(time == 0){
                            text = '重新获取';
                            that.formItem.isCode = false;
                            that.formItem.codeText = text;
                            clearInterval(setTime);
                        }
                        that.formItem.codeText = text;
                    },1000)  
                }else{
                    that.formItem.isCode = false;
                    that.$Message.error(res.details);
                }
            })
        },
        save(){//保存
            let that = this;
            if(!that.formItem.code || that.formItem.code == ''){
                that.$Message.warning('验证码不能为空');
                return false;
            }
            if(!that.formItem.newPhone || that.formItem.newPhone == ''){
                that.$Message.warning('新密码不能为空');
                return false;
            }
            if(that.formItem.newPhone.length <6){
                that.$Message.warning('密码长度不能小于6位');
                return false;
            }
            if(!that.formItem.againPhone || that.formItem.againPhone == ''){
                that.$Message.warning('确认密码不能为空');
                return false;
            }
            if(that.formItem.againPhone != that.formItem.newPhone){
                that.$Message.warning('两次密码不相同，请检查');
                return false;
            }
            isLoading(that,'密码修改中···');
            wxpost('API/PostEn',{Content:that.formItem.newPhone}).then(res =>{
                that.$Spin.hide();
                if(res.code == 200){
                    // that.$Message.success(res.details);
                    let nowEnPassword = res.details;//加密后的密码
                    wxpost('User/SetModifyPwd',{NewPwd:nowEnPassword,CheckCode:that.formItem.code}).then(reg =>{
                        if(reg.code == 200){
                            that.$Message.success({
                                content:res.message,
                                duration:1,
                                onClose(){
                                    removeLoginUser();
                                    deleteCookie('password');//清除密码缓存
                                    that.$router.push({path:'/'});
                                }
                            });
                        }else{
                            that.$Message.error(reg.message);
                        }
                    })
                }else{
                    that.$Message.error(res.message);
                }
            })

            // if(!/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/.test(that.formItem.newPhone)){
            //     that.$Message.warning('手机号格式不对');
            //     return false;
            // }
        }
    },
    mounted(){
        let that = this;
    }
}
</script>
<style lang="scss" scoped>
    #container{
        padding-bottom: 1.333rem;
        .content{
            // padding:0.5333rem 0.4rem 0;//20px 15px 0;
            display: flex;
            flex-direction: column;
            align-items: left;
            justify-content: center;
            width: 100%;
            height: 100%;
            position: absolute;
            padding: 0 0.4rem;
            .ivu-form{
                .ivu-form-item{
                    margin-bottom:0.1333rem;//5px
                    border-bottom:1px solid #BBBBBB;
                    input{
                        width: 100%;
                        border: none;
                    }
                }
            }
        }
        .foot{
            margin-top:0.4rem;//15px
            width:100%;
            button{
                height:1.0667rem;
                width:100%;
                font-size:0.3733rem;
                color:#fff;
                background:#009788;
                border:none;
                outline:0;
                box-shadow:none;
                border-radius: 4px;
            }
        }
    }
</style>
<style>
    .changePassword .ivu-input,.changePassword .ivu-input:hover,.changePassword .ivu-input:focus{
        border:none;
    }
    .changePassword .ivu-input-group{
        top:0
    }
    .changePassword .ivu-input-group-append{
        background: #fff;
        border: none;
        color: #DF8D15;
        font-size:0.32rem;
    }
</style>
