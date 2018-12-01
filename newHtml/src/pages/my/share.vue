<template>
    <div id="container" class="share">
        <div class="title">
            <Button type="primary" long>关注三草两木商城小程序</Button>
        </div>
        <div class="content">
            <div class="cont_img">
                <img v-lazy="shareUrl" :key="shareUrl" alt="" />
            </div>
            <div class="cont_foot">
                <p>长按可保持到手机</p>
                <p>三草两木商城</p>
            </div>
        </div>
    </div>
</template>
<script>
import {getLoginUser} from '@/assets/js/assist.js';
export default {
    name: 'share',
    data() {
        return{
           userData:getLoginUser() ? getLoginUser() : '',
           shareUrl:''
        }
    },
    components: {
        
    },
    methods:{
        
    },
    mounted(){
        let that = this;
        console.log(that.imgUrl);
        that.shareUrl = that.shareImgUrl+'QRCode/MakeCode?sellerId='+that.userData.F_Id;
    }
}
</script>
<style lang="scss" scoped>
    #container{
        padding-bottom: 1.0667rem;
        .title{
            display: flex;
            button{
                height:1.2rem;//45px
                background:#009788;
                color:#fff;
                border-color:#009788;
                font-size:0.4267rem;//16px
            }
        }
        .content{
            padding:0.5333rem 0.4rem 0;//20px 15px 0;
            .cont_img{
                padding-top: 1.2rem;
                img{
                    width: 100%;
                    vertical-align: bottom;
                } 
            }
            .cont_foot{
                margin-top:0.4rem;
                color:#009788;
                text-align: center;
                font-size:0.3733rem;
            }
        }
    }
</style>
<style>
    .help .ivu-collapse>.ivu-collapse-item.ivu-collapse-item-active>.ivu-collapse-header{
        border-bottom:none;
    }
    .help .ivu-collapse>.ivu-collapse-item .ivu-collapse-header{
        font-size:0.3733rem;
        color:#727171;
    }
    .help .ivu-collapse>.ivu-collapse-item .ivu-collapse-content>.ivu-collapse-content-box{
        color:#727171;
    }
    .help .ivu-collapse>.ivu-collapse-item{
        border: 1px solid #DCDDDD;
        margin:0.4rem 0;
        border-radius:0.1333rem;
    }
    .help .ivu-collapse>.ivu-collapse-item.ivu-collapse-item-active{
        border:  1px solid #009788;
    }
    .help .ivu-collapse>.ivu-collapse-item.ivu-collapse-item-active .ivu-collapse-header{
        color:#009788;
    }
    .help .ivu-collapse>.ivu-collapse-item.ivu-collapse-item-active .ivu-collapse-content>.ivu-collapse-content-box{
        color:#009788;
    }
</style>



