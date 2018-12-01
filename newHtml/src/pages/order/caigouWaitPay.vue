<template>
    <div id="container" class="caigouWaitPay">
        <div class="content">
            <ul class="cont_c">
                <li class="cont_list">
                    <p class="cont_list_t"><span>{{orderData.OrderNo}}</span><span>{{['待确认','待付款','待发货','待收货','已收货','已关闭','转代发','拆单发货'][orderData.OrderStatus]}}</span></p>
                    <div class="cont_list_u" v-if="noOrderList.length>0" v-for="(it,num) in noOrderList" :key="num" @click="goDetails(orderData.OrderNo)">
                        <div class="list_u_l">
                            <!-- <img v-lazy="imgUrl+it.ImageUrl" :key="it.ImageUrl" alt=""> -->
                            <img v-lazy="it.ImageUrl" :key="it.ImageUrl" alt="">
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
            <div class="cont_t">
                <p><span>收货人<em>{{orderData.Sendee}}</em></span><span>联系方式<em>{{orderData.Contact}}</em></span></p>
                <p><i class="iconfont icon-address"></i>{{orderData.Province + orderData.City + orderData.County + orderData.StreetAddress}}</p>
            </div>
            <Divider class="line"/>
            <div class="cont_u">
                <p><span>货运方式</span><span v-if="!isMonth"><i class="iconfont icon-xuanzhong"></i><em>日结</em></span><span v-else><i class="iconfont icon-xuanzhong"></i><em>月结</em></span></p>
            </div>
            <Divider class="line"/>
            <Form :label-width="60" class="cont_f">
                <FormItem label="买家备注">
                    <Input v-model="orderData.BuyCaption" type="textarea" autofocus :autosize="{minRows: 2,maxRows: 5}" placeholder="买家备注"></Input>
                </FormItem>
            </Form>
        </div>
        <div class="foot-nav-containner">
            <ul class="bottom-nav">
                <li class="bottom-nav__li ">
                    <span>实付款:<i>¥{{orderData.PayPrice}}</i></span>
                </li>
                <li class="bottom-nav__li ">
                    <button type="button" @click="toPay">支付订单</button>
                </li> 
            </ul>
        </div>
    </div>
</template>
<script>
import {post,wxpost} from '@/axios/ajax';
// import {addCookie,getCookie,getCurrentDate,deleteCookie} from '@/assets/js/assist.js'
import {isLoading} from '@/assets/js/load.js'
export default {
    name: 'caigouWaitPay',
    data() {
        return{
            OrderNo:'',
            orderData:{},
            noOrderList:[],
            isMonth:false,
            monthType:0
        }
    },
    components: {

    },
    methods:{
        load(no){//获取该订单基本信息
            let that = this;
            wxpost('User/SetTransferOrderInfo/',{OrderNo:no}).then(res =>{
                if(res.code == 200){
                    // console.log(res);
                    that.orderData = res.data;
                    that.getLoad(that.orderData.OrderNo,that.orderData.OriginalOrderNo);
                    that.getMonth();
                }else{
                    that.$message.error(res.details);
                }
            })
        },
        getLoad(a,b){//获取商品信息
            let that = this;
            wxpost('User/SetTransferOrderGoodsInfo/',{OrderNo:a,OriginalOrderNo:b}).then(res =>{
                if(res.code == 200){
                    console.log(res);
                    that.noOrderList = res.data;
                }else{
                    that.$message.error(res.details);
                }
            })
        },
        getMonth(){//是否月结
            let that = this;
            wxpost('User/GetSettlingAccount').then(res =>{
                if(res.code == 200){
                    if(res.data){
                        that.isMonth = true;
                        that.monthType = 1;
                    }else{
                        that.isMonth = false;
                        that.monthType = 0;
                    }
                }else{
                    that.$Message.error(res.details);
                }
            })
        },
        toPay(){//去支付
            let that = this;
            let payWord = '';
            that.$Modal.confirm({
                    scrollable:false,
                    render: (h) => {
                        return h('div',{class:'model-cont'},[
                            h('div',{class:'model-title','style':{textAlign:'right',marginBottom:'0.2667rem'}},[
                                h('span',
                                    {style:{color:'#666666',fontSize:'0.3733rem',background:'#F8F8F8',float:'left'}}, '请输入密码，并且确认支付'),
                                h('i',{class:'iconfont icon-close-btn',on: {click: () => {
                                    that.$Modal.remove();
                                    payWord = '';
                                    }}})
                            ]),
                            h('div',{class:'model-content'},[
                                h('Input', {'style':{outline:0,boxShadow:'none',borderColor:'#dcdee2'},
                                    props: {autofocus: true,placeholder: '请输入密码',type:'password'},
                                    on: {input: (val) => {
                                        payWord = val;
                                        }}
                                })
                            ]),
                            h('div',{class:'model-foot','style':{textAlign:'right',marginTop:'0.2667rem'}},[
                                h('Button', {'style':{boxShadow:'none',borderColor:'#dcdee2',marginRight:'0.1333rem'},on: {click:()=>{
                                    that.$Modal.remove();
                                    payWord = '';
                                    }}},'取消'),
                                h('Button', {'style':{boxShadow:'none',background: '#009788',borderColor:'#009788'},props: {type: 'primary'},on: {click:()=>{
                                    if(!payWord || payWord == ''){
                                        that.$Message.warning('请输入密码！');
                                        return false;
                                    }
                                    isLoading(that,'支付中···');
                                    wxpost('API/PostEn',{Content:payWord}).then(res =>{//支付密码加密
                                        if(res.code == 200){
                                            let payParam = {
                                                OrderNo:that.orderData.OrderNo,
                                                PayPrice:that.orderData.PayPrice,
                                                PayPassWord:res.details,
                                                BuyCaption:that.orderData.BuyCaption
                                            }
                                            wxpost('User/SetPurchaseOrderPay',payParam).then(re =>{//支付接口
                                                that.$Spin.hide();
                                                that.$Modal.remove();
                                                if(re.code == 200){
                                                    that.$Message.success({
                                                        content:res.details,
                                                        duration:0.5,
                                                        onClose(){ 
                                                            that.$router.push({name:'caigouOrder',params: {status:2}});//跳转 采购订单
                                                        }
                                                    });  
                                                }else if(re.code == 202){
                                                    payWord = '';
                                                    setTimeout(()=>{
                                                        that.$Modal.confirm({
                                                            scrollable:false,
                                                            render: (h) => {
                                                                return h('div',{class:'model-cont'},[
                                                                    h('div',{class:'model-title','style':{textAlign:'right',marginBottom:'0.2667rem'}},[
                                                                        h('span',
                                                                            {style:{color:'#DF8D15',fontSize:'0.3733rem',float:'left'}}, '警告！'),
                                                                        h('i',{class:'iconfont icon-close-btn',on: {click: () => {that.$Modal.remove();}}
                                                                        })
                                                                    ]),
                                                                    h('div',{class:'model-content'},[
                                                                        h('p', {'style':{fontSize:'0.3733rem'}},'余额不足，请前往充值')
                                                                    ]),
                                                                    h('div',{class:'model-foot','style':{textAlign:'right',marginTop:'0.2667rem'}},[
                                                                        h('Button', {'style':{boxShadow:'none',borderColor:'#dcdee2',marginRight:'0.1333rem'},on: {click:()=>{that.$Modal.remove();}}},'取消'),
                                                                        h('Button', {'style':{boxShadow:'none',background: '#009788',borderColor:'#009788'},props: {type: 'primary'},on: {click:()=>{
                                                                            that.$router.push({name:'recharge'});//跳转 充值
                                                                            } 
                                                                        }},'确定')
                                                                    ])
                                                                ]
                                                                )
                                                            } 
                                                        })
                                                    },500)
                                                    
                                                }else{
                                                    that.$Modal.remove();
                                                    that.$Message.error(re.details);
                                                }
                                            })
                                        }else{
                                            that.$Message.error(res.message);
                                        }
                                    })
                                } }},'确定')
                            ])
                        ]

                        )
                    } 
                }, 
            )
        }
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
            .cont_t{
                margin:0.4rem 0;
                p{
                    font-size:0.3733rem;
                    color:#727171;
                    span{
                        margin-right:0.4rem;
                        em{
                            margin-left:0.1333rem;
                        }
                    }
                    
                }
            }
            .cont_u{
                &>p{
                    span{
                        font-size:0.3733rem;
                        color:#727171;
                        &:nth-child(1){
                            margin-right:0.2667rem;
                        }
                        i{
                            color:#009788;
                            margin: 0 0.1333rem;
                        }
                    }
                }  
            }
        }
        .foot-nav-containner{
        position: fixed;
        bottom:0;
        width: 100%;
        z-index: 1001;
        border-top: 1px solid #ddd;
        background: #fff;
        .bottom-nav{
            display: flex;
            .bottom-nav__li{
                height: 1.0667rem;
                position: relative; 
                &:nth-child(1){
                    flex:3;
                    padding: 0 0.4rem;
                    span{
                        height: 1.0667rem;
                        line-height: 1.0667rem;
                        font-size:0.3733rem;
                        i{
                            color:#DF8D15;
                            font-size:0.4267rem;
                        }
                    }
                    
                }
                &:nth-child(2){
                    flex:1;
                    button{
                        background:#009788;
                        height: 1.0667rem;
                        line-height: 1.0667rem;
                        color:#fff;
                            width:100%;
                            outline: 0;
                            border: none;
                            box-shadow:none;
                    }
                     
                }
            }
        }
    }
    }
</style>
<style>
    .caigouWaitPay .ivu-form .ivu-form-item-label{
        padding-right: 0;
        text-align: left;
        font-size:0.3733rem;
        color:#727171;
    }
    .caigouWaitPay .ivu-input,.caigouWaitPay .ivu-input:hover,.caigouWaitPay .ivu-input:focus{
        border:none;
        padding-top:0.16rem;
    }
    .ivu-input, .ivu-input:hover, .ivu-input:focus{
        border-color:#dcdee2;
    }
</style>
