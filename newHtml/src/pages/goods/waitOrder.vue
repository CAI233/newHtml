<template>
    <div id="container" class="waitOrder">
        <div class="content">
            <ul class="cont_top">
                <li class="carfix">
                    <router-link :to='{name:"addressList",query:{ids:isCar}}'>
                        <span>选择收货地址</span>
                        <i class="iconfont icon-check"></i>
                    </router-link>
                    <Divider class="carfix_line" />
                </li>
                <li class="fix" v-if="orderAddress.F_Id" >
                    <p><span><em>{{orderAddress.ReceiveName}}</em></span><span><em>{{orderAddress.Cellphone}}</em></span><i v-if="orderAddress.IsDefault">默认</i></p>
                    <p><i class="iconfont icon-address"></i>{{orderAddress.Province+orderAddress.City+orderAddress.County+orderAddress.StreetAddress}}</p>
                </li>
            </ul>
            <Divider class="line" />
            <div class="cont_cont">
                <ul class="cont">
                    <li v-for="(item,index) in orderData" :key="index" class="list">
                        <Row>
                            <Col span="6">
                                <img v-lazy="item.Imgurl" :key="item.Imgurl" alt="" />
                            </Col>
                            <Col span="18">
                                <p>{{item.GoodsTitle}}</p>
                                <p><span>规格:<em>{{item.SepcName}}</em></span><span style="margin-left:0.2667rem;">箱规:<em>{{item.UnitNumber}}/{{item.Unit}}</em></span></p>
                                <p class="price"><em >￥{{item.Price}}</em>×{{item.BuyCount}}<span>合计:<em>¥{{item.Price*item.BuyCount}}</em></span></p>
                            </Col>
                        </Row>
                        <Divider class="carfix_line" />
                    </li>
                </ul>
            </div>
            <Divider class="line" />
            <div class="cont_down">
                <p class="cont_way">
                    <span>货运方式:</span><span v-if="!isMonth"><i class="iconfont icon-xuanzhong"></i><em>日结</em></span><span v-else><i class="iconfont icon-xuanzhong"></i><em>月结</em></span>
                </p>
                <p class="cont_remark">
                    <Input v-model="remark" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="买家备注（选填）"></Input>
                </p>
            </div>
            <div class="foot-nav-containner">
                <ul class="bottom-nav">
                    <li class="bottom-nav__li ">
                        <span>邮费:<em>¥{{postagePrice}}</em></span>
                        <span>实付款:<em>¥{{orderPrice}}</em></span>
                        <span>余额:<em>¥{{blancePrice}}</em></span>
                    </li>
                    <li class="bottom-nav__li ">
                        <button type="button" @click="submitOrder">提交订单</button>
                    </li> 
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
import {wxget,wxpost} from '@/axios/ajax';
import {isLoading} from '@/assets/js/load.js';
import {addCookie,getCookie,getLoginUser} from '@/assets/js/assist.js';
// let waitOrder =
export default {
    name: 'waitOrder',
    data() {
        return{
            infoData:getLoginUser() ? getLoginUser() : '',
            isCar:'',//订单的商品id
            addressId:'',//是否存在选择的地址
            ActivityId: getCookie('ActivityId') ? getCookie('ActivityId') : '',//政策id
            orderData:[],//当前订单
            orderAddress:{},//当前地址
            remark:'',//买家备注
            isMonth:false,//是否月结
            monthType:0,
            orderWeight:0,//订单重量
            orderPrice:0,//订单金额
            isGetWeight:[],//判断是否订单和地址都加载完成
            postagePrice:0,//邮费
            blancePrice:0//余额
        }
    },
    components: {

    },
    methods:{
        load(){//获取购物车商品
            let that = this;
            wxget('User/GetShopCartList/'+that.ActivityId).then(res =>{
                if(res.code == 200){
                    that.orderData = res.data;
                    that.orderWeight = 0;
                    that.orderPrice = 0;
                    that.orderData.map((item) =>{
                        that.orderWeight += item.GoodsWeight*item.BuyCount;
                        that.orderPrice += item.Price*item.BuyCount;
                    }) 
                    that.orderPrice = parseFloat(that.orderPrice).toFixed(2);
                    that.isGetWeight.push({
                        sumWeight:that.orderWeight
                    })   
                }else{
                    that.$Message.error(res.details);
                }
            })

        },
        loadAddress(){//获取地址
            let that = this;
            if(that.addressId){//有地址id
                wxget('User/GetUserAddressById/'+that.addressId).then(res =>{
                    if(res.code == 200){
                        console.log(res);
                        that.orderAddress = res.data;
                    }else{
                        that.$Message.error(res.details);
                    }
                })
            }else{//没有地址id选择默认地址
                wxget('User/GetUserAddress/1000/1').then(res =>{
                    if(res.code == 200){
                        let addressList = res.data;
                        if(addressList.length > 0){//存在地址
                            for(let i of addressList){
                                if(i.IsDefault){//有默认
                                    that.orderAddress = i;
                                    break;
                                }else{//没默认，选择第一个
                                    that.orderAddress = addressList[0];
                                }
                            }
                            // that.isGetWeight['areaCity'] = that.orderAddress.City;
                            that.isGetWeight.push({
                                areaCity:that.orderAddress.City
                            })
                        }else{
                            that.$Message.warning('当前没有地址，请去添加地址');
                        }

                    }else{
                        that.$Message.error(res.details);
                    }
                })
            }
        },
        getPostage(){//获取邮费
            let that = this;
            wxpost('User/GetPostage',that.isGetWeight).then(res =>{
                if(res.code == 200){
                    that.postagePrice = res.data ? parseFloat(res.data).toFixed(2) : 0;
                }else{
                    that.$Message.error(res.details);
                }
            })
        },
        getBlance(){//获取余额
            let that = this;
            let agentlevel = that.infoData.AgentLevel;
            let url = '';
            if(agentlevel < 3){
                url = 'User/GetTopActivityByActivityId/';
            }else{
                url = 'User/GetActivityByActivityId/';
            }
            wxget(url+that.ActivityId).then(res =>{
                if(res.code == 200){
                    that.blancePrice = res.data.Balance ? parseFloat(res.data.Balance).toFixed(2) : 0;
                }else{
                    that.$Message.error(res.details);
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
        submitOrder(){//提交订单
            let that = this;
            let orderParam = {
                ActivityId : that.ActivityId,//政策id
                AddressId : that.orderAddress.F_Id,//收货编号id
                BuyCaption : that.remark,//买家附加说明书
                ShopCartIds : that.isCar,//购物车id
                SumPostage : that.postagePrice,//邮费
                FareType : that.monthType,//邮费结算方式
            }
            if(!orderParam.AddressId || orderParam.AddressId == ''){
                that.$Message.warning('请选择地址');
                return false;
            }
            let url = '';
            if(that.infoData.AgentLevel < 3){
                url = 'User/SetAddShopCartTopPurchaseOrder'
            }else{
                url = 'User/SetAddShopCartPurchaseOrder'
            }
            wxpost(url,orderParam).then(res =>{
                if(res.code == 200){
                    that.$Message.success({
                        content:'订单提交成功',
                        duration:1,
                        onClose(){
                            if(that.infoData.AgentLevel < 3){
                                that.$router.push({name:'topOrder',params: {status:1}});//跳转
                            }else{
                                that.$router.push({name:'caigouOrder',params: {status:1}});//跳转
                            }
                            
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
        that.isCar = that.$route.params.ids;
        let address = that.$route.query.addressId || '';
        if(address){
            that.addressId = address;
        }else{
            that.addressId = '';
        }
        that.load();
        that.loadAddress();
        that.getMonth();
        that.getBlance();
    },
    watch:{
        isGetWeight(no,ol){
            let that = this;
            if(that.isGetWeight.length == 2){
                that.getPostage();
            }
        }
    }
}

</script>
<style lang="scss" scoped>
    #container{
        padding-bottom: 1.333rem;
        .content{
            padding:0.5333rem 0.4rem 0;//20px 15px 0;
            .cont_top{
                &>.carfix{
                    display:flex;
                    position: relative;
                    font-size:0.3733rem;//14px
                    padding: 0.2667rem 0;//10px 0
                    &>a{
                        flex:1;
                        color: #101010;
                        i{
                            float:right;
                        }
                    }
                    .carfix_line{
                        position:absolute;
                        top:auto !important;
                        bottom:0.1333rem;
                    }
                }
                &>.fix{
                    margin-bottom:0.2667rem;
                    p{
                        &:nth-child(1){
                            font-size:0.3733rem;
                            span{
                                margin-right:0.2667rem;
                                em{
                                    color:#101010;
                                }
                            }
                            i{
                                float:right;
                                border:1px solid #009788;
                                color:#009788;
                                padding: 0 0.1333rem;
                            }
                        }
                    }
                }
                .ivu-divider-horizontal{
                    margin:0;
                    color:#B5B5B6;
                }
            }
            .line{
                margin:0;
                height:0.2667rem;
                margin-left: -0.4rem;
                width: 10rem;
            }
            .cont_cont{
                .cont{
                    .list{
                        padding:0.2667rem 0;
                        position: relative;
                        .ivu-row{
                            .ivu-col{
                                &:nth-child(2){
                                    padding:0 0 0 0.2667rem;// 5px 10px
                                }
                                &:nth-child(3){
                                    margin-top: 0.8rem;
                                    i{
                                        color:#727171;
                                    }
                                }
                                img{
                                    width:100%;
                                    vertical-align:bottom;
                                }
                                p{
                                    &:nth-child(1){
                                        font-size:0.3733rem;//14px;
                                        color:#101010;
                                        height:1.0667rem;
                                        overflow: hidden;
                                        -webkit-line-clamp: 2;
                                        text-overflow: ellipsis;
                                        display: -webkit-box;
                                        -webkit-box-orient: vertical
                                    }
                                    &:nth-child(2){
                                        color:#9C9C9C;
                                        font-size:0.32rem;
                                        margin-bottom:0.1333rem;//5px
                                        overflow: hidden;
                                        text-overflow:ellipsis;//文本溢出显示省略号
                                        white-space:nowrap;//文本不会换行（单行文本溢出）
                                    }
                                    &:nth-child(3){
                                        color:#9C9C9C;
                                        font-size:0.32rem;
                                        span{
                                            float:right;
                                        }
                                        em{
                                            color:#ad7a2b;
                                        }
                                    }
                                }
                            }
                        }
                        .carfix_line{
                            position:absolute;
                            top:auto !important;
                            bottom:0;
                            margin: 0;
                        }
                    }
                }
            }
            .cont_down{
                .cont_way{
                    padding:0.2667rem 0;
                    span{
                        font-size:0.4533rem;
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
                .cont_remark{
                    padding:0.1333rem 0;
                    border-top:1px solid #c7cad2;
                }
            }
            .foot-nav-containner{
                position: fixed;
                bottom:0;
                width: 100%;
                z-index: 1001;
                border-top: 1px solid #ddd;
                background: #fff;
                box-sizing: border-box;
                .bottom-nav{
                    display: flex;
                    .bottom-nav__li{
                        height: 1.0667rem;
                        position: relative; 
                        &:nth-child(1){
                            flex:3;
                            display: flex;
                            justify-content: flex-start;
                            align-items: center;
                            span{
                                font-size:0.3733rem;
                                color:#727171;
                                margin-right:0.1333rem;
                                em{
                                    color:#ad7a2b;
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
                                padding-right:0.2667rem;
                            }
                            
                        }
                    }
                }
            }
        }
    }
</style>
<style>
    .waitOrder .ivu-input,.ivu-input:hover,.ivu-input:focus{
        border:none;
    }
</style>
