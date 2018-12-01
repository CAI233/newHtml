<template>
    <div id="container" class="forgetPhoneSave">
        <div class="content">
            <div class="cont">
                <Form :model="formItem" :label-width="60" label-position="left">
                    <FormItem label="新手机号" >
                        <input type="text" v-model="formItem.newPhone" placeholder="请输入新手机号" onkeyup="this.value=this.value.replace(/\D/g,'')" onafterpaste="this.value=this.value.replace(/\D/g,'')"/>
                    </FormItem>
                    <FormItem label="验证码" >
                        <Input v-model="formItem.newCode" placeholder="请输入验证码">
                            <i v-if="!formItem.isNewCode" slot="append" @click="getNewCode">{{formItem.newText}}</i>
                            <i v-else slot="append" >{{formItem.newText}}</i>
                        </Input>
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
export default {
    name: 'forgetPhoneSave',
    data() {
        return{
            formItem:{
                newPhone:'',
                newCode:'',//新手机验证码
                newText:'点击获取验证码',
                isNewCode:false
            }
        }
    },
    components: {

    },
    methods:{
        getCode(phone){//获取校验码
            let that = this;
            isLoading(that,'获取验证码中···');
            let type = '';
           
            that.formItem.isNewCode = true;
                
            wxpost('API/PostEn',{Content:phone}).then(res =>{//加密
                if(res.code == 200){
                    let nowEnPhone = res.details;//加密后的手机号
                    wxpost('API/SetSendSmsByForgotPhone',{PhoneNum:nowEnPhone,type:type}).then(reg =>{
                        that.$Spin.hide();
                        if(reg.code == 200){
                            that.$Message.success(reg.details);
                            let time = 59;//倒数时间
                            let text = '';
                            text = time+'s后重新获取';
                            if(bool){
                                that.formItem.oldText = text;
                            }else{
                                that.formItem.newText = text;
                            }
                          
                            let setTime = setInterval(_=>{
                                time--;
                                text = time+'s后重新获取';
                               
                                that.formItem.newText = text;
                                
                                if(time == 0){
                                    text = '重新获取';
                                    
                                    that.formItem.newText = text;
                                    that.formItem.isNewCode = false;
                                    clearInterval(setTime);
                                }
                            },1000)

                        }else{
                            that.$Message.error(reg.details);
                            that.formItem.isNewCode = false;
                            
                        }
                    })
                }else{
                    that.$Message.error(res.details);
                }
            })
        },
        getNewCode(){//获取新手机号校验码
            let that = this ;
            if(that.formItem.isNewCode){
                that.$Message.warning('请稍后再获取');
                return false;
            }
            if(!that.formItem.newPhone || that.formItem.newPhone == ''){
                that.$Message.warning('新手机号不能为空');
                return false;
            }
            if(!/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/.test(that.formItem.newPhone)){
                that.$Message.warning('手机号格式不对');
                return false;
            }
            that.getCode(that.formItem.newPhone);
            
        },
        
        save(){//保存
            let that = this;
            if(!that.formItem.newPhone || that.formItem.newPhone == ''){
                that.$Message.warning('请输入手机号');
                return false;
            }
            if(!/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/.test(that.formItem.newPhone)){
                that.$Message.warning('手机号格式不对');
                return false;
            }
            if(!that.formItem.newCode || that.formItem.newCode == ''){
                that.$Message.warning('请输入检验码');
                return false;
            }
            wxpost('API/SetByForgotPhoneModify',that.formItem).then(res =>{
                if(res.code == 200){
                    that.$Message.success({
                        content:res.details,
                        duration:1,
                        onClose(){
                            that.$router.push({path:'/my'});//跳转
                        }
                    });
                }else{
                    that.$Message.error(res.details);
                }
            })
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
            .cont{width:100%}
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
    .forgetPhoneSave .ivu-input,.forgetPhoneSave .ivu-input:hover,.forgetPhoneSave .ivu-input:focus{
        border:none;
    }
    .forgetPhoneSave .ivu-input-group{
        top:0
    }
    .forgetPhoneSave .ivu-input-group-append{
        background: #fff;
        border: none;
        color: #DF8D15;
        font-size:0.32rem;
    }
</style>
