<template>
    <div id="container" class="activityDetail">
        <div class="content">
            <ul>
                <li class="carfix">
                    <span>标题</span>
                    <p  v-html="detailData.Title"></p>
                </li>
                <Divider />
                <li class="carfix">
                    <span>时间</span>
                    <p  v-html="detailData.CreateDate" ></p>
                </li>
                <Divider />
                <li class="carfix">
                    <span>商户名称</span>
                    <p  v-html="detailData.SellerName"></p>
                </li>
                <Divider />
                <li class="carfix">
                    <span>摘要</span>
                    <p  v-html="detailData.Summary"></p>
                </li>
                <Divider />
                <li class="carfix">
                    <span>内容</span>
                    <p  v-html="newContent"></p>
                </li>
                <Divider />
                <li class="carfix">
                    <span>回复</span>
                    <p  v-html="detailData.Reply"></p>
                </li>
                <Divider />
            </ul>
        </div>
    </div>
</template>
<script>

import {wxget,wxpost} from '@/axios/ajax';

export default {
    name: 'activityDetail',
    data() {
        return{
            activityId:'',
            detailData:{},
            newContent:'',
        }
    },
    components: {

    },
    methods:{
        load(){
            let that = this;
            wxget('API/GetProgram/'+that.activityId).then(res =>{
                console.log(res);
                if(res.code == 200){
                    that.detailData = res.data;

                    wxpost('API/GetDe',{Content:that.detailData.Content}).then(res =>{
                        if(res.code == 200){
                            console.log(res);
                            that.newContent = res.details;
                        }else{
                            that.$Message.error(res.details);
                        }
                    })
                }else{
                    that.$Message.success(res.message);
                }
            })
        }
        
    },
    mounted(){
        let that = this;
        that.activityId = that.$route.params.id;
        that.load();
    }
}
</script>
<style lang="scss" scoped>
    #container{
        padding-bottom: 1.0667rem;
        .content{
            padding:0.5333rem 0.4rem 0;//20px 15px 0;
            ul{
                .carfix{
                    display:box;
                    display:-webkit-box;
                    display:-webkit-flex; 
                    display:-moz-box; 
                    display:-ms-flexbox; 
                    display:flex;
                    font-size:0.3733rem;//14px
                    padding: 0.2667rem 0;//10px 0
                    &>span{
                        margin-right:0.2667rem;// 10px
                        color:#101010;
                    }
                    &>p{
                        -prefix-box-flex: 1; 
                        -webkit-box-flex: 1; 
                        -webkit-flex: 1; 
                        -moz-box-flex: 1; 
                        -ms-flex: 1; 
                        flex: 1; 
                        // color:#DCDDDD;
                        word-wrap: break-word;
                        word-break: normal;
                        white-space: normal;
                        word-break: break-all;
                    }
                }
                .ivu-divider-horizontal{
                    margin:0;
                    color:#B5B5B6;
                }
            }
        }
    }
</style>
<style>
    .activityDetail .content .ivu-form .ivu-form-item-label{
        color:#101010;
        font-size:0.3733rem;
    }
    
</style>




