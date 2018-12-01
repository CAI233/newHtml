<template>
    <div id="container" class="inviteDealer">
        <div class="content">
            <Collapse v-model="num" accordion simple>
                <Panel :name='index.toString()' v-for="(item,index) in levelData" v-if="item.SpreadType < 6" :key="index" :hide-arrow="true">
                    {{item.WebUserPhoto}}<i class="iconfont icon-check"></i>
                    <div slot="content" class="cont_scan">
                       <!-- <div> -->
                            <p>申请{{item.SellerName}}-{{item.WebUserPhoto}}</p>
                            <p><span>{{infoData.RealName}}</span><span>{{infoData.UserPhone}}</span></p>
                            <p>{{item.SellerName+'-'+infoData.AgentLevelName}}</p>
                            <p><img v-lazy="scanImgUrl+item.WebImg" :key="scanImgUrl+item.WebImg" alt="" ></p>
                            <div class="text">
                                <p>第一步:长按二维码图片扫码</p>
                                <p>第二步:输入申请信息提交审核</p>
                                <p>第三步:等待审核成功进入公众号登录</p>
                            </div>
                       <!-- </div> -->
                    </div>
                </Panel>
            </Collapse>
        </div>
    </div>
</template>
<script>
import {wxget,wxpost} from '@/axios/ajax';
import {getLoginUser} from '@/assets/js/assist.js';
export default {
    name: 'inviteDealer',
    data() {
        return{
            num:'0',
            levelData:[],
            infoData:getLoginUser() ? getLoginUser() : ''
        }
    },
    components: {

    },
    methods:{
        load(){//加载级别数据
            let that = this;
            wxget('User/GetReferee').then(res =>{
                if(res.code == 200){
                    that.levelData = res.data;
                }else{
                    that.$Message.error(res.details)
                }
            })
        }
    },
    mounted(){
        let that = this;
        that.load();
    }
}
</script>
<style lang="scss" scoped>
    #container{
        padding-bottom: 1.333rem;
        .content{
            padding:0.5333rem 0.4rem 0;//20px 15px 0;
            .ivu-collapse{
                background: #fff;
                border-top:none;
                border-bottom:none;
                .ivu-collapse-item{
                    .ivu-collapse-header{
                        background: #fff;
                        i{
                            float:right;
                        }
                    }
                    .ivu-collapse-content{
                        .cont_scan{
                            p{
                                text-align:center;
                                margin:0.1333rem 0;
                                &:nth-child(1){
                                    font-size: 0.3733rem;//14px
                                }
                                img{
                                    vertical-align: bottom;
                                    width:5.333rem;
                                    height:5.333rem;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
</style>
<style>
    .inviteDealer .ivu-collapse>.ivu-collapse-item>.ivu-collapse-header{
        padding-left:0;
    }
    .inviteDealer .ivu-collapse>.ivu-collapse-item>.ivu-collapse-header i{
        margin-right:0;
    }
    .inviteDealer .ivu-collapse-simple>.ivu-collapse-item.ivu-collapse-item-active>.ivu-collapse-header{
        border-bottom: 1px solid #dcdee2;
    }
</style>
