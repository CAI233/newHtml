<template>
    <div id="container">
        <Row class="header">
            <Col span="24" class="header-t">
                <Row>
                    <p class="count-text">{{TeamAllCount}}</p>
                    <p class="count-title">总销售额(元)</p>
                </Row>
            </Col>
            <Col span="24" class="header-c">
                <Row>
                    <Col span="12">
                        <p class="count-text">{{TeamMonthCount}}</p>
                        <p class="count-title">团队月销售额(元)</p>
                    </Col>
                    <Col span="12">
                        <p class="count-text">{{TeamMyCount}}</p>
                        <p class="count-title">我的月销售额(元)</p>
                    </Col>
                </Row>
            </Col>
        </Row>
        <Row class="content">
            <Col span="24" class="content-cg" v-if="infoData.AgentLevel < 3">
                <p class="content-title">公司订单</p>
                <Row>
                    <Col class="content_lf">
                        <Badge :count="CaigouData.NoPayCount ? CaigouData.NoPayCount : 0" type="warning" :offset="[0,5]">
                            <router-link :to='{ name:"topOrder",params: {status:1}}' class="bottom-nav__li ">
                                <i class="iconfont icon--4"></i>
                                <span>待付款</span>
                            </router-link>
                        </Badge>
                    </Col>
                    <Col class="content_lf">
                        <Badge :count="CaigouData.PayCount ? CaigouData.PayCount : 0" type="warning" :offset="[0,5]">
                            <router-link :to='{ name:"topOrder",params: {status:2}}' class="bottom-nav__li ">
                                <i class="iconfont icon--16"></i>
                                <span>待发货</span>
                            </router-link>
                        </Badge>
                    </Col>
                    <Col class="content_lf">
                        <Badge :count="CaigouData.DeliverCount ? CaigouData.DeliverCount : 0" type="warning" :offset="[0,5]">
                            <router-link :to='{ name:"topOrder",params: {status:3}}' class="bottom-nav__li ">
                                <i class="iconfont icon--17"></i>
                                <span>待收货</span>
                            </router-link>
                        </Badge>
                    </Col>
                    <Col class="content_lf">
                        <Badge :count="CaigouData.TakeDeliverCount ? CaigouData.TakeDeliverCount : 0" type="warning" :offset="[0,5]">
                            <router-link :to='{ name:"topOrder",params: {status:4}}' class="bottom-nav__li ">
                                <i class="iconfont icon--6"></i>
                                <span>已收货</span>
                                <!-- <em v-if="FenxiaoData.TakeDeliverCount>0">{{FenxiaoData.TakeDeliverCount}}</em> -->
                            </router-link>
                        </Badge>
                        
                    </Col>
                </Row>
                <Row>
                    <Col class="content_lf">
                        <router-link :to='{ name:"topOrder",params: {status:-1}}' class="bottom-nav__li ">
                            <i class="iconfont icon--20"></i>
                            <span>全部订单</span>
                        </router-link>
                    </Col>
                    <Col class="content_lf">
                        <router-link :to='{ name:"topOrder",params: {status:5}}' class="bottom-nav__li ">
                            <i class="iconfont icon--18"></i>
                            <span>已关闭</span>
                        </router-link>
                    </Col>
                </Row>
                <Row>
                    <Col class="content_lf">
                        <router-link :to='{ name:"topScan"}' class="bottom-nav__li ">
                            <i class="iconfont icon--7"></i>
                            <span>采购扫码</span>
                        </router-link>
                    </Col>
                    <Col class="content_lf">
                        <router-link :to='{ name:"topScanRecord"}' class="bottom-nav__li ">
                            <i class="iconfont icon--12"></i>
                            <span>采购扫码<br>记录</span>
                        </router-link>
                    </Col>
                    <Col class="content_lf">
                        <router-link :to='{ name:"topMyScan"}' class="bottom-nav__li ">
                            <i class="iconfont icon--7"></i>
                            <span>自用扫码</span>
                        </router-link>
                    </Col>
                    <Col class="content_lf">
                        <router-link :to='{ name:"topMyScanRecord"}' class="bottom-nav__li ">
                            <i class="iconfont icon--12"></i>
                            <span>自用扫码<br>记录</span>
                        </router-link>
                    </Col>
                </Row>
            </Col>
            <Col span="24" class="content-cg" v-if="infoData.AgentLevel >2">
                <p class="content-title">采购订单</p>
                <Row>
                    <Col class="content_lf">
                        <Badge :count="CaigouData.NoPayCount ? CaigouData.NoPayCount : 0" type="warning" :offset="[0,5]">
                            <router-link :to='{ name:"caigouOrder",params: {status:1}}' class="bottom-nav__li ">
                                <i class="iconfont icon--4"></i>
                                <span>待付款</span>
                            </router-link>
                        </Badge>
                    </Col>
                    <Col class="content_lf">
                        <Badge :count="CaigouData.PayCount ? CaigouData.PayCount : 0" type="warning" :offset="[0,5]">
                            <router-link :to='{ name:"caigouOrder",params: {status:2}}' class="bottom-nav__li ">
                                <i class="iconfont icon--16"></i>
                                <span>待发货</span>
                            </router-link>
                        </Badge>
                    </Col>
                    <Col class="content_lf">
                        <Badge :count="CaigouData.DeliverCount ? CaigouData.DeliverCount : 0" type="warning" :offset="[0,5]">
                            <router-link :to='{ name:"caigouOrder",params: {status:3}}' class="bottom-nav__li ">
                                <i class="iconfont icon--17"></i>
                                <span>待收货</span>
                            </router-link>
                        </Badge>
                    </Col>
                    <Col class="content_lf">
                        <Badge :count="CaigouData.TakeDeliverCount ? CaigouData.TakeDeliverCount : 0" type="warning" :offset="[0,5]">
                            <router-link :to='{ name:"caigouOrder",params: {status:4}}' class="bottom-nav__li ">
                                <i class="iconfont icon--6"></i>
                                <span>已收货</span>
                                <!-- <em v-if="FenxiaoData.TakeDeliverCount>0">{{FenxiaoData.TakeDeliverCount}}</em> -->
                            </router-link>
                        </Badge>
                        
                    </Col>
                </Row>
                <Row>
                    <Col class="content_lf">
                        <router-link :to='{ name:"caigouOrder",params: {status:-1}}' class="bottom-nav__li ">
                            <i class="iconfont icon--20"></i>
                            <span>全部订单</span>
                        </router-link>
                    </Col>
                    <Col class="content_lf">
                        <router-link :to='{ name:"caigouOrder",params: {status:5}}' class="bottom-nav__li ">
                            <i class="iconfont icon--18"></i>
                            <span>已关闭</span>
                        </router-link>
                    </Col>
                </Row>
                <Row>
                    <Col class="content_lf">
                        <router-link :to='{ name:"caigouScan"}' class="bottom-nav__li ">
                            <i class="iconfont icon--7"></i>
                            <span>采购扫码</span>
                        </router-link>
                    </Col>
                    <Col class="content_lf">
                        <router-link :to='{ name:"caigouScanRecord"}' class="bottom-nav__li ">
                            <i class="iconfont icon--12"></i>
                            <span>采购扫码<br>记录</span>
                        </router-link>
                    </Col>
                    <Col class="content_lf">
                        <router-link :to='{ name:"myScan"}' class="bottom-nav__li ">
                            <i class="iconfont icon--7"></i>
                            <span>自用扫码</span>
                        </router-link>
                    </Col>
                    <Col class="content_lf">
                        <router-link :to='{ name:"myScanRecord"}' class="bottom-nav__li ">
                            <i class="iconfont icon--12"></i>
                            <span>自用扫码<br>记录</span>
                        </router-link>
                    </Col>
                </Row>
            </Col>
            <Col span="24" class="content-fx">
                <p class="content-title">分销订单</p>
                <Row>
                    <Col class="content_lf">
                        <Badge :count="FenxiaoData.NoPayCount ? FenxiaoData.NoPayCount : 0" type="warning" :offset="[0,5]">
                            <router-link :to='{ name:"fenxiaoOrder",params: {status:1}}' class="bottom-nav__li ">
                                <i class="iconfont icon--4"></i>
                                <span>待收款</span>
                                <!-- <em v-if="FenxiaoData.NoPayCount>0">{{FenxiaoData.NoPayCount}}</em> -->
                            </router-link>
                        </Badge>
                    </Col>
                    <Col class="content_lf">
                        <Badge :count="FenxiaoData.PayCount ? FenxiaoData.PayCount : 0" type="warning" :offset="[0,5]">
                            <router-link :to='{ name:"fenxiaoOrder",params: {status:2}}' class="bottom-nav__li ">
                                <i class="iconfont icon--16"></i>
                                <span>待发货</span>
                                <!-- <em v-if="FenxiaoData.PayCount>0">{{FenxiaoData.PayCount}}</em> -->
                            </router-link>
                        </Badge>
                    </Col>
                    <Col class="content_lf">
                        <Badge :count="FenxiaoData.DeliverCount ? FenxiaoData.DeliverCount : 0" type="warning" :offset="[0,5]">
                            <router-link :to='{ name:"fenxiaoOrder",params: {status:3}}' class="bottom-nav__li ">
                                <i class="iconfont icon--17"></i>
                                <span>待收货</span>
                                <!-- <em v-if="FenxiaoData.DeliverCount>0">{{FenxiaoData.DeliverCount}}</em> -->
                            </router-link>
                        </Badge>
                    </Col>
                    <Col class="content_lf">
                        <Badge :count="FenxiaoData.TakeDeliverCount ? FenxiaoData.TakeDeliverCount : 0" type="warning" :offset="[0,5]">
                            <router-link :to='{ name:"fenxiaoOrder",params: {status:4}}' class="bottom-nav__li ">
                                <i class="iconfont icon--6"></i>
                                <span>已收货</span>
                                <!-- <em v-if="FenxiaoData.TakeDeliverCount>0">{{FenxiaoData.TakeDeliverCount}}</em> -->
                            </router-link>
                        </Badge>
                    </Col>
                </Row>
                <Row>
                    <Col class="content_lf">
                        <router-link :to='{ name:"fenxiaoOrder",params: {status:-1}}' class="bottom-nav__li ">
                            <i class="iconfont icon--20"></i>
                            <span>全部订单</span>
                        </router-link>
                    </Col>
                    <Col class="content_lf">
                        <router-link :to='{ name:"fenxiaoOrder",params: {status:5}}' class="bottom-nav__li ">
                            <i class="iconfont icon--18"></i>
                            <span>已关闭</span>
                        </router-link>
                    </Col>
                    <Col class="content_lf">
                        <Badge :count="FenxiaoData.NoVerifyCount ? FenxiaoData.NoVerifyCount : 0" type="warning" :offset="[0,5]">
                            <router-link :to='{ name:"fenxiaoOrder",params: {status:6}}' class="bottom-nav__li ">
                                <i class="iconfont icon--25"></i>
                                <span>已退款</span>
                                <!-- <em v-if="FenxiaoData.TakeDeliverCount>0">{{FenxiaoData.TakeDeliverCount}}</em> -->
                            </router-link>
                        </Badge>
                    </Col>
                </Row>
                <Row>
                    <Col class="content_lf">
                        <router-link :to='{ name:"fenxiaoScan"}' class="bottom-nav__li ">
                            <i class="iconfont icon--7"></i>
                            <span>分销扫码</span>
                        </router-link>
                    </Col>
                    <Col class="content_lf">
                        <router-link :to='{ name:"mySeliveryRecord"}' class="bottom-nav__li ">
                            <i class="iconfont icon--12"></i>
                            <span>我的发货<br>记录</span>
                        </router-link>
                    </Col>
                    <Col class="content_lf">
                        <router-link :to='{ name:"fenxiaoReturnScan"}' class="bottom-nav__li ">
                            <i class="iconfont icon--7"></i>
                            <span>分销退货<br>扫码</span>
                        </router-link>
                    </Col>
                    <Col class="content_lf">
                        <router-link :to='{name:"myReturnRecord"}' class="bottom-nav__li ">
                            <i class="iconfont icon--12"></i>
                            <span>我的退货<br>记录</span>
                        </router-link>
                    </Col>
                </Row>
            </Col>
            <Col span="24" class="content-ls">
                <p class="content-title">零售订单 <span @click="goList">添加零售订单</span></p>
                <Row>
                    <Col class="content_lf">
                        <Badge :count="LingshouData.NoPayCount ? LingshouData.NoPayCount : 0" type="warning" :offset="[0,5]">
                            <router-link :to='{name:"lingshouOrder",params:{status:1}}' class="bottom-nav__li ">
                                <i class="iconfont icon--4"></i>
                                <span>待收款</span>
                                <!-- <em v-if="LingshouData.NoPayCount>0">{{LingshouData.NoPayCount}}</em> -->
                            </router-link>
                        </Badge>
                    </Col>
                    <Col class="content_lf">
                        <Badge :count="LingshouData.DeliverCount ? LingshouData.DeliverCount : 0" type="warning" :offset="[0,5]">
                            <router-link :to='{name:"lingshouOrder",params:{status:3}}' class="bottom-nav__li ">
                                <i class="iconfont icon--17"></i>
                                <span>待收货</span>
                                <!-- <em v-if="LingshouData.DeliverCount>0">{{LingshouData.DeliverCount}}</em> -->
                            </router-link>
                        </Badge>
                    </Col>
                    <Col class="content_lf">
                        <Badge :count="LingshouData.PayCount ? LingshouData.PayCount : 0" type="warning" :offset="[0,5]">
                            <router-link :to='{name:"lingshouOrder",params:{status:2}}' class="bottom-nav__li ">
                                <i class="iconfont icon--27"></i>
                                <span>已收款</span>
                                <!-- <em v-if="LingshouData.PayCount>0">{{LingshouData.PayCount}}</em> -->
                            </router-link>
                        </Badge>
                    </Col>
                    <Col class="content_lf">
                        <router-link :to='{name:"lingshouOrder",params:{status:4}}' class="bottom-nav__li ">
                            <i class="iconfont icon---"></i>
                            <span>代发付款</span>
                        </router-link>
                    </Col>
                </Row>
                <Row>
                    <Col class="content_lf">
                        <router-link :to='{name:"lingshouOrder",params:{status:-1}}' class="bottom-nav__li ">
                            <i class="iconfont icon--20"></i>
                            <span>全部订单</span>
                        </router-link>
                    </Col>
                    <Col class="content_lf">
                        <router-link :to='{name:"lingshouOrder",params:{status:5}}' class="bottom-nav__li ">
                            <i class="iconfont icon--18"></i>
                            <span>已关闭</span>
                        </router-link>
                    </Col>
                    <Col class="content_lf">
                        <router-link :to='{name:"lingshouAddress"}' class="bottom-nav__li ">
                            <i class="iconfont icon--26"></i>
                            <span>零售收货<br>地址</span>
                        </router-link>
                    </Col>
                </Row>
                <Row>
                    <Col class="content_lf">
                        <router-link :to='{name:"lingshouScan"}' class="bottom-nav__li ">
                            <i class="iconfont icon--7"></i>
                            <span>零售扫码</span>
                        </router-link>
                    </Col>
                    <Col class="content_lf">
                        <router-link :to='{name:"lingshouReturnScan"}' class="bottom-nav__li ">
                            <i class="iconfont icon--7"></i>
                            <span>零售退货<br>扫码</span>
                        </router-link>
                    </Col>
                </Row>
            </Col>
        </Row>
    </div>
</template>

<script>
import {getLoginUser} from '@/assets/js/assist.js';
import {wxget} from '@/axios/ajax';
export default {
    name: 'orderindex',
    components: {
        // blogPost
        // swiperComponent
    },
    data() {
        return{
            infoData:getLoginUser() ? getLoginUser() : '',
            TeamAllCount:0,
            TeamMonthCount:0,
            TeamMyCount:0,
            topData:{},//公司
            FenxiaoData:{},//分销
            CaigouData:{},//采购
            LingshouData:{}//零售
        }
    },
    methods:{
        getAmount(){//获取团队销售数量
            let that = this;
            wxget('User/GetMyTeamSaleAmount').then(res =>{
                if(res.code == 200){
                    that.TeamAllCount = res.data.Amount;
                    that.TeamMonthCount = res.data.MonthAmount;
                    that.TeamMyCount = res.data.TeamCount;
                }else{
                    this.$Message.error(res.message);
                }
            })
        },
        getTop(){//获取公司订单
            let that = this;
            wxget('User/GetToPurchaseOrderNoOrderStatusCount').then(res =>{
                if(res.code == 200){
                    that.topData = res.data;
                    console.log(that.topData);
                }else{
                    this.$Message.error(res.message);
                }
            })
        },
        getCaigou(){//获取采购
            let that = this;
            wxget('User/GetPurchaseOrderNoOrderStatusCount').then(res =>{
                if(res.code == 200){
                    that.CaigouData = res.data;
                }else{
                    this.$Message.error(res.message);
                }
            })
        },
        getFenxiao(){//获取分销
            let that = this;
            wxget('User/GetSaleOrderNoOrderStatusCount').then(res =>{
                if(res.code == 200){
                    that.FenxiaoData = res.data;
                }else{
                    this.$Message.error(res.message);
                }
            })
        },
        getLingshou(){
            let that = this;
            wxget('User/GetSellOrderNoOrderStatusCount').then(res =>{//获取零售
                if(res.code == 200){
                    that.LingshouData = res.data;
                }else{
                    this.$Message.error(res.message);
                }
            })
        },
        goList(){//添加零售订单
            this.$router.push({name:'lingshouOrderIndex'});
        }
    },
    mounted(){
        let that = this;
        that.getAmount();

        if(that.infoData.AgentLevel <3){
            that.getTop();
        }else{
            that.getCaigou();
        }
        that.getFenxiao();
        that.getLingshou();
    }
}
</script>
<style lang="scss" scoped>
    #container{
        padding-bottom: 1.333rem;
        .header{
            padding: 0 0.4rem;//0 15px
            // background: #009788;
            background:url('../../assets/images/bg1.png') no-repeat 0 0;
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
                font-size:0.7467rem;//28px
            }
            .header-t{
                margin-top: 1rem;
                margin-bottom: 0.5rem;
            }
        }
        .content{
            background:#F8F8F8;
            &>.ivu-col{
                background:#fff;
                padding:0 0.4rem;//0 15px
                &:not(:last-child){
                    margin-bottom:10px;
                }
                .content-title{
                    font-size:0.4267rem;//16px
                    margin:0.4rem 0;//10px 0
                    overflow: hidden;
                    span{
                        float: right;
                        padding:0 0.2667rem;// 0 10px;
                        border-radius: 0.1333rem;//5px;
                        font-size:0.32rem;// 12px;
                        height:0.64rem;// 24px;
                        line-height:0.64rem;// 24px;
                        display: inline-table;
                    }
                }
                .content-cg{
                    margin-top:0.32rem;//12px
                }
                &>.ivu-row{
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
                            // em{
                            //     position:absolute;
                            //     color:#fff;
                            //     background: #DF8D15;
                            //     width: 0.5333rem;//20px
                            //     height: 0.5333rem;
                            //     text-align: center;
                            //     border-radius: 50%;
                            //     font-size: 12px;
                            //     right: 0.5333rem;
                            //     top: 0;
                            // }
                        }
                    }
                }
            }
        }
    }
</style>
<style>
    #container .content .content-fx{
        color:#009788;
    }
    #container .content .content-fx .content_lf a span{
        color:#009788 !important;
    }
    #container .content .content-ls{
        color:#DF8D15;
    }
    #container .content .content-ls .content-title span{
        border:1px solid #DF8D15;
        color:#727171;
    }
    #container .content .content-ls .content_lf a span{
        color:#DF8D15 !important;
    }
    /* DF8D15 */
</style>


