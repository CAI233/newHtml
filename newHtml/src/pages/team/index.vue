<template>
    <div id="container">
       <Row class="header">
            <Col span="24" class="header-t">
                <Row>
                    <p class="count-title" >团队人数(人)</p>
                    <p class="count-text" style="font-size:0.7467rem;">{{teamUserData.TotalCount}}</p>
                </Row>
            </Col>
            <Col span="24" class="header-c">
                <Row>
                    <Col >
                        <p class="count-title">总代(人)</p>
                        <p class="count-text">{{teamUserData.Level2Count}}</p>
                    </Col>
                    <Col >
                        <p class="count-title">一级(人)</p>
                        <p class="count-text">{{teamUserData.Level3Count}}</p>
                    </Col>
                    <Col >
                        <p class="count-title">二级(人)</p>
                        <p class="count-text">{{teamUserData.Level4Count}}</p>
                    </Col>
                    <Col >
                        <p class="count-title">三级(人)</p>
                        <p class="count-text">{{teamUserData.Level5Count}}</p>
                    </Col>
                    <!-- <Col >
                        <p class="count-title">店主（人）</p>
                        <p class="count-text">{{teamUserData.Level6Count}}</p>
                    </Col> -->
                </Row>
            </Col>
        </Row>
        <Row class="content">
            <p class="content-title">团队管理</p>
            <Row class="content-cont">
                <Col class="content_lf">
                    <router-link :to='{name:"inviteDealer"}' class="bottom-nav__li ">
                        <i class="iconfont icon--40"></i>
                        <span>邀请<br>经销商</span>
                    </router-link>
                </Col>
                <Col class="content_lf">
                    <Badge :count="teamManagementData.UserRefereeCount ? teamManagementData.UserRefereeCount : 0" type="warning" :offset="[0,5]">
                        <router-link :to='{name:"inviteReview"}' class="bottom-nav__li ">
                            <i class="iconfont icon--37"></i>
                            <span>邀请审核</span>
                            <!-- <em v-if="teamManagementData.UserRefereeCount>0">{{teamManagementData.UserRefereeCount}}</em> -->
                        </router-link>
                    </Badge>
                    
                </Col>
                <Col class="content_lf">
                    <router-link :to='{name:"teamDetails"}' class="bottom-nav__li ">
                        <i class="iconfont icon--22"></i>
                        <span>团队明细</span>
                    </router-link>
                </Col>
                <Col class="content_lf">
                    <Badge :count="teamManagementData.BalanceCount ? teamManagementData.BalanceCount : 0" type="warning" :offset="[0,5]">
                        <router-link :to='{name:"returnReview",params:{id:0}}' class="bottom-nav__li ">
                            <i class="iconfont icon--23"></i>
                            <span>回款审核</span>
                            <!-- <em v-if="teamManagementData.BalanceCount>0">{{teamManagementData.BalanceCount}}</em> -->
                        </router-link>
                    </Badge>
                    
                </Col>
            </Row>
            <Row class="content-cont">
                <Col class="content_lf">
                    <Badge :count="0" type="warning" :offset="[0,5]">
                        <router-link :to='{name:"returnReview",params:{id:1}}' class="bottom-nav__li ">
                            <i class="iconfont icon---1"></i>
                            <span>充值记录</span>
                        </router-link>
                    </Badge>
                    
                </Col>
                <Col class="content_lf">
                    <router-link :to='{name:"bill",params:{id:0}}' class="bottom-nav__li ">
                        <i class="iconfont icon--21"></i>
                        <span>账单</span>
                    </router-link>
                </Col>
            </Row>
        </Row>
    </div>
</template>

<script>
import {wxget,wxpost} from '@/axios/ajax';
export default {
    name: 'teamindex',
    components: {
        // blogPost
        // swiperComponent
    },
    methods:{
        
    },
    mounted(){
        wxget('User/GetMyTeamCountInfo').then(res =>{
            // console.log(res);
            if(res.code = 200){
                let that = this;
                that.teamUserData = res.data;
            }else{
                this.$Message.error(res.message);
            }
        }).catch(res =>{
            console.log(res);
        })
        wxget('User/GetPurchaseOrderNoOrderStatusCount').then(res =>{
            console.log(res);
            if(res.code = 200){
                let that = this;
                that.teamManagementData = res.data;
            }else{
                this.$Message.error(res.message);
            }
        }).catch(res =>{
            console.log(res);
        })
    },
    data() {
        return{
           teamUserData:{},
           teamManagementData:{}
        }
    }
}
</script>
<style lang="scss" scoped>
// @import '../../assets/css/base.scss';
    #container{
        padding-bottom: 1.333rem;
        .header{
            padding: 0 0.4rem;//0 15px
            // background: #009788;
            background:url('../../assets/images/bg2.png') no-repeat 0 0;
            background-size:contain;
            height: 5.3333rem;//200px
            p{
                text-align:center;
                color:#fff;
            }
            .count-title{
                font-size:0.3733rem;//14px
            }
            .count-text{
                font-size:0.5333rem;//20px
            }
            .header-t{
                margin-top: 1rem;
                margin-bottom: 0.5rem;
            }
            .header-c{
                .ivu-row{
                    .ivu-col{
                        width:25%;
                        float: left;
                    }
                }
            }
        }
        .content{
            background: #fff;
            padding: 0 0.4rem;
            .content-title{
                font-size:0.4267rem;//16px
                margin:0.4rem 0;//10px 0
            }
            .content-cont{
                margin:0.4rem 0;//0.4rem 0
                    .content_lf{
                        width:25%;
                        float:left;
                        text-align: center;
                        a{
                            text-decoration:none;
                            position: relative;
                            display: flex;
                            flex-direction:column;
                            justify-content:center;
                            align-items: center;
                            &:hover,&:focus{
                                text-decoration:none;
                            }
                            i{
                                color:#AAAAAA;
                                font-size:1rem;
                                line-height: 1;
                            }
                            span{
                                color:#727171;
                                font-size:0.32rem;//12px
                                text-align:center;
                            }
                            em{
                                position:absolute;
                                color:#fff;
                                background: #DF8D15;
                                width: 0.5333rem;//20px
                                height: 0.5333rem;
                                text-align: center;
                                border-radius: 50%;
                                font-size: 12px;
                                right: 0.5333rem;
                                top: 0;
                            }
                        }
                    }
            }
        }
    }
   
</style>

