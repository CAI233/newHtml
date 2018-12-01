<template>
     <div class="loading">

     </div>
</template>
<script>
import {wxget,post,wxpost} from '@/axios/ajax';
import {isLoading} from '@/assets/js/load.js';
import {addCookie,getCookie,removeLoginUser,setLoginUser} from '@/assets/js/assist.js'
export default {
    name: 'loading',
    data() {
        return{
             Code:''
        }
    },
    components: {
        
    },
    methods:{
        getUrlParam(name){
            let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
            let r = window.location.search.substr(1).match(reg); //匹配目标参数
            if(r != null) return unescape(getCharFromUtf8(r[2])); //增加UTF-8解码处理。
            return null; //返回参数值
        },
        getWxOpenId(){//无code 去获取微信回调
            wxpost('API/SetWXCodeNo',{Url:window.location.href}).then(res =>{
                if(res.code == 200){
                    // encodeURIComponent
                    location.href = res.details;
                }else{
                    that.$Message.error(res.message);
                }
            })
        },
        setWxOpenId(){//有code 去进行判断是否有登录信息
            let that = this;
            wxpost('API/SetWXOpenId',{Code:that.Code}).then(res =>{
                if(res.code == 200){
                    addCookie('openid',res.details);//缓存openid
                    that.LoginByOpenId(res.details);//
                }else{
                    that.$Message.error(res.message);
                }
            })
        },
        LoginByOpenId(openid){
            let that = this;
            if(openid){
                wxpost('API/PostEn',{Content:openid}).then(res =>{//加密
                    if(res.code == 200){

                        that.loginBack(res.details);
                    }else{
                        that.$Message.error(res.message);
                    }
                })
            }else{
                that.loginBack();
            }
        },
        loginBack(openid){
            wxpost('API/SetLoginByOpenId',{OpenId:openid}).then(res =>{
                if(res.code == 200){
                    removeLoginUser();//清除个人信息缓存
                    alert('进去首页++++++++++++'+JSON.stringify(res));

                    that.$router.push({path:'/home'});//去首页

                }
            })
        }
    },
    mounted(){
        let that = this;
        let ua = navigator.userAgent.toLowerCase();
        alert('开始判断');
        if (ua.match(/MicroMessenger/i) == "micromessenger") {
            if (getCookie('openid') == null || getCookie('openid') == '' || getCookie('openid') == undefined) {
                let code = that.getUrlParam('code') ? that.getUrlParam('code') :'';
                if (code) {
                    that.Code = code;
                    that.setWxOpenId();
                }
                else {
                    that.getWxOpenId();
                }
            }
            else {
                var openid = getCookie('openid') ? getCookie('openid') : '';
                that.LoginByOpenId(openid);
            }
        }
        else {
            // that.$router.push({path:''});
            window.location.href = '/';
        }
    }
}
</script>
<style>

</style>


