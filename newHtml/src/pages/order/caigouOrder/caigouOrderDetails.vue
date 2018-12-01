<template>
    <div id="container" class="caigouOrderDetails">
        <div class="content">
            <div class="cont_c">
                <ul class="cont_c_cont">
                    <li class="cont_list">
                        <p class="cont_list_t"><span>{{orderData.OrderNo}}</span><span>{{['待确认','待付款','待发货','待收货','已收货','已关闭','转代发','拆单发货'][orderData.OrderStatus]}}</span></p>
                        <div class="cont_list_u" v-if="orderData.OrderDetailList.length>0" v-for="(it,num) in orderData.OrderDetailList" :key="num" @click="goDetails(orderData.OrderNo)">
                            <div class="list_u_l">
                                <img v-lazy="imgUrl+it.ImageUrl" :key="it.ImageUrl" alt="">
                            </div>
                            <div class="list_u_c">
                                <p>{{it.Title}}</p>
                                <p>规格:{{it.SepcName}}&nbsp;&nbsp;&nbsp;&nbsp;箱规:{{it.UnitNumber}}/{{it.Unit}}</p>
                                <p><span>¥{{it.Price}}*{{it.Number}}</span>&nbsp;&nbsp;<i>{{it.SendNo && (orderData.OrderStatus==33||orderData.OrderStatus==3)?'(已发货)':''}}</i>&nbsp;&nbsp;<em>小计:{{it.Amount}}</em></p>
                            </div>
                        </div>
                    </li>
                </ul>
                <Divider class="line"/>
                <div class="cont_c_t">
                    <ul>
                        <li class="c_t_li f">
                            <span>收货人<em>{{orderData.Sendee}}</em></span><span>联系方式<em>{{orderData.Contact}}</em></span>
                        </li>
                        <li class="c_t_li ">
                            <span>收货地址<em>{{orderData.Address}}</em></span>
                        </li>
                    </ul>
                </div>
                <Divider class="line"/>
                <div class="cont_c_t">
                    <ul>
                        <li class="c_t_li f">
                            <span>买家姓名<em>{{orderData.BuyUserName}}</em></span><span>卖家姓名<em>{{orderData.SellUserName}}</em></span>
                        </li>
                        <li class="c_t_li f">
                            <span>运费方式<em>{{orderData.IsPayMonth?'月结':'日结'}}</em></span><span>运费总额<em>{{orderData.FarePrice}}</em></span>
                        </li>
                        <li class="c_t_li f">
                            <span>原价订单总额<em>¥{{orderData.ProductPrice}}</em></span><span>优惠总额<em>¥{{orderData.CouponPrice}}</em></span>
                        </li>
                        <li class="c_t_li f">
                            <span>现价订单总额<em>¥{{orderData.PayPrice}}</em></span><span>是否拆单<em>{{orderData.IsSplitOrder?'是':'否'}}</em></span>
                        </li>
                        <li class="c_t_li">
                            <span>政策名称<em>{{orderData.ActivityTitle}}</em></span>
                        </li>
                        <li class="c_t_li" v-if="orderData.OrderActivityList && orderData.OrderActivityList.length>0">
                            <p v-for="(item,index) in orderData.OrderActivityList" :key="index">
                                <span >满足<em>{{item.Title}}</em></span>
                                <span v-if="item.ReturnType == 1">优惠<em>{{item.PreferenceValue}}</em></span>
                                <span v-if="item.ReturnType == 2">送赠品<em>{{item.GiftGoodsTitle}}</em><i>（{{item.GiftCount}}）</i></span>
                            </p>    
                        </li>
                        <li class="c_t_li" v-else>
                            <span>政策<em>无满足优惠政策</em></span>
                        </li>
                    </ul>
                </div>
                <Divider class="line"/>
                <div class="cont_c_u"  v-if="orderData.orderDeliverList && orderData.orderDeliverList.length > 0">
                    <p><span>快递信息</span></p>
                    <ul>
                        <li class="c_u_li" v-for="(item,index) in orderData.orderDeliverList" :key="index" @click="express(item.DeliverName,item.StampNumber)">
                            <span>{{item.DeliverName}}</span><span>{{item.StampNumber}}</span>
                        </li>
                    </ul>
                </div>
                <Divider class="line" v-if="orderData.orderDeliverList && orderData.orderDeliverList.length > 0" />
                <ul class="cont_c_d">
                    <li class="c_d_li" v-if="orderData.OrderDate!='2000-01-01'">订单时间<span >{{orderData.OrderDate}}</span></li>
                    <li class="c_d_li" v-if="orderData.VerifyDate!='2000-01-01'">审核时间<span >{{orderData.VerifyDate}}</span></li>
                    <li class="c_d_li" v-if="orderData.PayDate!='2000-01-01'">支付时间<span >{{orderData.PayDate}}</span></li>
                    <li class="c_d_li" v-if="orderData.DeliverDate!='2000-01-01'">发货时间<span >{{orderData.DeliverDate}}</span></li>
                    <li class="c_d_li" v-if="orderData.OverDate!='2000-01-01'">确认发货时间<span >{{orderData.OverDate}}</span></li>
                    <li class="c_d_li" v-if="orderData.CancelDate!='2000-01-01'">取消订单时间<span >{{orderData.CancelDate}}</span></li>
                </ul>
                <Divider class="line"/>
                <Form :label-width="60" class="cont_c_f">
                    <FormItem label="买家备注">
                        <Input v-model="orderData.BuyCaption" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="买家备注" readonly></Input>
                    </FormItem>
                    <FormItem label="卖家备注">
                        <Input v-model="orderData.SellCaption" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="卖家备注" readonly></Input>
                    </FormItem>
                </Form>
            </div>
        </div>
        <foot-common :btnText="text" :icon="iconf" @click.native="back"></foot-common>
    </div>
</template>
<script>
import {wxget,wxpost} from '@/axios/ajax';
import {getLoginUser} from '@/assets/js/assist.js'
import footCommon from '@/components/foot-common.vue';//获取组件
export default {
    name: 'caigouOrderDetails',
    data() {
        return{
            infoData:getLoginUser() ? getLoginUser() : '',
            text:'返回',
            iconf:'',
            OrderNo:'',
            orderData:{}
        }
    },
    components: {
        footCommon
    },
    methods:{
        load(no){//加载订单信息
            let that = this;
            let agentlevel = that.infoData.AgentLevel;
            let url = '';
            if(agentlevel < 3){
                url = 'User/GetToPurchaseOrderByOrderNo/';
            }else{
                url = 'User/GetPurchaseOrderByOrderNo/';
            }
            wxget(url+no).then(res =>{
                if(res.code == 200){
                    console.log(res);
                    that.orderData = res.data;
                }else{
                    that.$Message.error(res.message)
                }
            })
        },
        express(name,number){//查看物流
            console.log(111);
        },
        back(){//返回上一页面
            let that = this;
            that.$router.go(-1);
        },
    },
    mounted(){
        let that = this;
        that.OrderNo = that.$route.params.OrderNo;
        that.load(that.OrderNo);
    }
}
</script>
<style lang="scss" scoped>
    #container{
        padding-bottom: 1.333rem;
        .content{
            padding:0.5333rem 0.4rem 0;//20px 15px 0;
            .cont_c{
                .cont_c_cont{
                    position: relative;
                    &>.cont_list{
                        &>.cont_list_t{
                            font-size:0.32rem;//12px
                            margin-top:0.2667rem;// 10px;
                            color:#888888;
                            span{
                                &:nth-child(1){
                                    font-size:0.32rem;//12px
                                }
                                &:nth-child(2){
                                    color:#DF8D15;
                                    float:right;
                                }
                            }
                        }
                        &>.cont_list_u{
                            overflow: hidden;
                            margin: 0.2667rem 0;
                            .list_u_l{
                                float:left;
                                width:1.8667rem;//70px
                                padding:0.2667rem 0;
                                img{
                                    width:100%;
                                    vertical-align:bottom;
                                }
                            }
                            .list_u_c{
                                float:left;
                                width:100%;
                                padding-left:2.1333rem;//80px
                                padding-top:0.1333rem;
                                margin-left:-1.8667rem;//70px
                                height:2.4rem;
                                display:flex;
                                flex-direction:column;
                                align-items:left;
                                justify-content:center;
                                &>p{
                                    &:nth-child(1){
                                        color:#101010;
                                        overflow: hidden;
                                        text-overflow: ellipsis;
                                        display: -webkit-box;
                                        -webkit-line-clamp: 2;
                                        -webkit-box-orient: vertical;
                                        font-size: 0.32rem;//12px
                                    }
                                    &:nth-child(2){
                                        color:#727171;
                                        font-size:0.32rem;
                                        margin:0 0 0.1333rem 0;
                                    }
                                    &:nth-child(3){
                                        color:#B5B5B6;
                                        font-size:0.3733rem;//14px
                                        &>span{
                                            color:#DF8D15;
                                        }
                                        &>i{
                                            color:#5eb95e;
                                            font-size:0.32rem;//12px
                                        }
                                        &>em{
                                            font-size:0.32rem;//12px
                                            float:right;
                                        }
                                    }
                                }
                            }
                        }
                        &>.ivu-divider-horizontal{
                            margin:0 0 0.2667rem 0;
                            &.bg_line{
                                height:0.2667rem;
                                width: 10rem;
                                margin-left: -0.4rem;
                                margin-bottom:0;
                            }
                        }
                    }
                }
                .line{
                    margin: 0;
                    height: 0.2667rem;
                    width: 10rem;
                    margin-left: -0.4rem;
                }
                .cont_c_t{
                    .c_t_li{
                        font-size: 14px;
                        margin: 0.1333rem 0;
                        color:#727171;
                        overflow: hidden;
                        em{
                            color:#101010;
                            margin-left:0.1333rem;
                        }
                        &.f{
                            span{
                                float:left;
                                width:50%;
                                white-space: nowrap;
                                overflow: hidden;
                                text-overflow: ellipsis;
                            }
                        }
                    }
                }
                .cont_c_u{
                    p{
                        font-size: 14px;
                        color:#727171;
                    }
                    .c_u_li{
                        font-size: 14px;
                        margin: 0.1333rem 0;
                        color:#727171;
                        overflow: hidden;
                        span{
                            float:left;
                            width:50%;
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                        }
                    }
                }
                .cont_c_d{
                     .c_d_li{
                        font-size: 14px;
                        margin: 0.1333rem 0;
                        color:#727171;
                        span{
                            color:#101010;
                            margin-left:0.1333rem;
                        }
                    }
                }
                .cont_c_f{
                    .ivu-form-item{
                        margin-bottom: 0.1333rem;
                    }
                }
            }
        }  
    }
</style>
<style>
    .ivu-form .ivu-form-item-label{
        padding-right: 0;
        text-align: left;
        font-size: 0.3733rem;
    }
    .caigouOrderDetails .ivu-input,.caigouOrderDetails .ivu-input:hover,.caigouOrderDetails .ivu-input:focus{
        border:none;
        padding-top: 8px;
    }
</style>
