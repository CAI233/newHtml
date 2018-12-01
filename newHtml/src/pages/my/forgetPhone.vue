<template>
    <div id="container" class="forgetPhone">
        <div class="content">
            <div class="cont">
                <Form :model="formItem" :label-width="60" label-position="left">
                    <FormItem label="旧手机号" >
                        <Input v-model="oldPhone" placeholder="旧手机号" readonly></Input>
                    </FormItem>
                    <FormItem label="验证码" >
                        <Input v-model="formItem.oldCode" placeholder="请输入验证码">
                            <i v-if="!formItem.isOldCode" slot="append" @click="getOldCode">{{formItem.oldText}}</i>
                            <i v-else slot="append" >{{formItem.oldText}}</i>
                        </Input>
                    </FormItem>
                </Form>
            </div>
            <div class="foot">
                <Button long @click.native="next" >下一步</Button>
            </div>
        </div>
    </div>
</template>
<script>
import {post,wxpost} from '@/axios/ajax';
import {getLoginUser} from '@/assets/js/assist.js';
import {isLoading} from '@/assets/js/load.js';
export default {
    name: 'forgetPhone',
    data() {
        return{
            infoData:getLoginUser() ? getLoginUser() : '',
            oldPhone:'',
            formItem:{
                oldCode:'',//旧手机验证码
                oldText:'点击获取验证码',
                isOldCode:false
            }
        }
    },
    components: {

    },
    methods:{
        getCode(phone){//获取校验码
            let that = this;
            isLoading(that,'获取验证码中···');
            let type = 'old';
           
            that.formItem.isOldCode = true;
           
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
                         
                            that.formItem.oldText = text;
                            
                          
                            let setTime = setInterval(_=>{
                                time--;
                                text = time+'s后重新获取';
                              
                                that.formItem.oldText = text;
                                
                                if(time == 0){
                                    text = '重新获取';
                                
                                    that.formItem.oldText = text;
                                    that.formItem.isOldCode = false;
                                   
                                    clearInterval(setTime);
                                }
                            },1000)

                        }else{
                            that.$Message.error(reg.details);
                     
                            that.formItem.isOldCode = false;
                            
                        }
                    })
                }else{
                    that.$Message.error(res.details);
                }
            })
        },
        getOldCode(){//获取旧手机号校验码
            let that = this ;
            if(that.formItem.isOldCode){
                that.$Message.warning('请稍后再获取');
                return false;
            }
            that.getCode(that.infoData.UserPhone);
            
        },
        next(){//下一步
            let that = this;
            if(!that.formItem.oldCode || that.formItem.oldCode == ''){
                that.$Message.warning('请输入检验码');
                return false;
            }
            wxpost('API/SetByForgotPhoneVerify',{Phone:that.infoData.UserPhone,CheckCode:that.formItem.oldCode}).then(res =>{
                if(res.code == 200){
                    that.$Message.success({
                        content:res.details,
                        duration:1,
                        onClose(){
                            that.$router.push({name:'forgetPhoneSave'});//跳转
                        }
                    });
                }else{
                    that.$Message.error(res.details);
                }
            })
        },
    },
    mounted(){
        let that = this;
        console.log(that.infoData);
        if(that.infoData.UserPhone){
            that.oldPhone = that.infoData.UserPhone.substr(0,3)+"****"+that.infoData.UserPhone.substr(7);
        }
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
    .forgetPhone .ivu-input,.forgetPhone .ivu-input:hover,.forgetPhone .ivu-input:focus{
        border:none;
    }
    .forgetPhone .ivu-input-group{
        top:0
    }
    .forgetPhone .ivu-input-group-append{
        background: #fff;
        border: none;
        color: #DF8D15;
        font-size:0.32rem;
    }
</style>
