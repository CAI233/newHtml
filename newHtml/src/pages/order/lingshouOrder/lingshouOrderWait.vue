<template>
    <div id="container" class="lingshouOrderWait">
        <div class="content">
            <ul class="cont_top">
                <Collapse simple @on-change="sldeDown">
                    <Panel name="1" :hide-arrow="true">
                        输入收货地址 <i class="iconfont icon-check"></i>
                        <div slot="content">
                            <ul class="down_fix">
                                <li class="carfix">
                                    <span>收货人</span>
                                    <input type="text" placeholder="请输入收货人" v-model="nowSelRow.ReceiveName"/>
                                </li>
                                <Divider />
                                <li class="carfix">
                                    <span>联系电话</span>
                                    <input type="text" placeholder="请输入联系电话" v-model="nowSelRow.Cellphone"/>
                                </li>
                                <Divider />
                                <li class="carfix">
                                    <span>所在地区</span>
                                    <Cascader :data="areaData" placeholder="请选择地址" v-model="areaText" @on-change="chooseArea" change-on-select></Cascader>
                                </li>
                                <Divider />
                                <li class="carfix">
                                    <span>详细地址</span>
                                    <input type="text" placeholder="请输入详细地址" v-model="nowSelRow.StreetAddress"/>
                                </li>
                            </ul>
                        </div>
                    </Panel>
                </Collapse>
                <li class="carfix">
                    <router-link :to='{name:"lingshouAddress",query:{isTo:"ok"}}'>
                        <span>选择收货地址</span>
                        <i class="iconfont icon-check"></i>
                    </router-link>
                    <Divider class="carfix_line" />
                </li>
                <li class="fix" v-if="selRow.F_Id" v-show="!isSlide">
                    <p><span>收货人:<em>{{selRow.ReceiveName}}</em></span><span>联系电话:<em>{{selRow.Cellphone}}</em></span></p>
                    <p><i class="iconfont icon-address"></i>{{selRow.Province+selRow.City+selRow.County+selRow.StreetAddress}}</p>
                </li>
            </ul>
            <Divider class="line" />
            <div class="cont">
                <ul>
                    <li class="list" v-for="(item,index) in productObj" :key="index">
                        <div class="list_l">
                            <img v-lazy="item.GoodsImageUrl" :key="item.GoodsImageUrl" alt="">
                        </div>
                        <div class="list_r">
                            <p>{{item.GoodsTitle}}</p>
                            <p><i>￥{{ item.Price}}</i>*{{item.ShopCartCount}}</p>
                            <p>合计:{{parseFloat((item.Price*item.ShopCartCount).toFixed(2))}}</p>
                        </div>
                        <Divider class="list_line" />
                    </li>
                </ul>
            </div>
            <Divider class="line" />
            <div class="remark">
                    <span>买家备注</span>
                    <Input v-model="selRow.BuyCaption" type="textarea" :autosize="{minRows: 3,maxRows: 5}" placeholder="请输入备注信息"></Input>
            </div>
        </div>
        <div class="foot">
            <div class="foot_l">
                <span>实付款</span><em>¥{{goodsPrice}}</em>
            </div>
            <div class="foot_r">
                <button long @click="submitOrder">提交订单</button>
            </div>
        </div>
    </div>
</template>
<script>
import {wxget,wxpost} from '@/axios/ajax';
import {addCookie,getCookie,deleteCookie} from '@/assets/js/assist.js'
import {isLoading} from '@/assets/js/load.js'
import areaList from '@/assets/js/area.js';//获取地址
export default {
    name: 'lingshouOrderWait',
    data() {
        return{
            selRow:{
                ReceiveName:'',
                Cellphone:'',
                Province:'',
                City:'',
                County:'',
                StreetAddress:'',
                remark:'',
                F_Id:'',
                BuyCaption:''
            },
            nowSelRow:{
                ReceiveName:'',
                Cellphone:'',
                Province:'',
                City:'',
                County:'',
                StreetAddress:'',
            },
            nowAddressData:{},
            productObj:[],
            goodsPrice:0,
            areaData:areaList,
            areaText:[],
            isId:'',
            isSlide:false
            
        }
    },
    components: {

    },
    methods:{
        load(){
            let that = this;
            for(let i in that.productObj){
                that.goodsPrice += that.productObj[i].ShopCartCount*that.productObj[i].Price;
            }
        },
        chooseArea(value,selectData){//选择地区
            let that = this;
            for(let i in value){
                if(i == 0){
                    that.nowSelRow.Province = value[i];
                }else if(i == 1){
                    that.nowSelRow.City = value[i];
                }else{
                    that.nowSelRow.County = value[i];
                }
            }
        },
        sldeDown(key){//下拉展示
           let that = this;
           that.isSlide = !that.isSlide;
        },
        submitOrder(){//提交订单
            console.log(1);
            let that = this;
            if(that.isSlide){
                if(!that.nowSelRow.ReceiveName || that.nowSelRow.ReceiveName){
                    that.$Message.warning('收货人不能为空！');
                    return false;
                }
                if(!that.nowSelRow.Cellphone || that.nowSelRow.Cellphone){
                    that.$Message.warning('联系电话不能为空！');
                    return false;
                }
                if (!/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/.test(that.nowSelRow.Cellphone)) {
                    that.$Message.warning('手机号格式有误！');
                    return false;
                }
                if(that.nowSelRow.areaText.length == 0){
                    that.$Message.warning('省份地区不能为空！');
                    return false;
                }
                if(!that.nowSelRow.StreetAddress || that.nowSelRow.StreetAddress){
                    that.$Message.warning('详细地址不能为空！');
                    return false;
                }
                that.selRow.ReceiveName = that.nowSelRow.ReceiveName;
                that.selRow.Cellphone = that.nowSelRow.Cellphone;
                that.selRow.Province = that.nowSelRow.Province;
                that.selRow.City = that.nowSelRow.City;
                that.selRow.County = that.nowSelRow.County;
                that.selRow.StreetAddress = that.nowSelRow.StreetAddress;
            }else{
                that.selRow.ReceiveName = that.nowAddressData.ReceiveName;
                that.selRow.Cellphone = that.nowAddressData.Phone;
                if(that.nowAddressData.Province){//省
                    that.selRow.Province = that.nowAddressData.Province;
                }
                if(that.nowAddressData.City){//市
                    that.selRow.City = that.nowAddressData.City;
                }
                if(that.nowAddressData.Area){//区
                    that.selRow.County = that.nowAddressData.Area;
                }
                if(that.nowAddressData.Stree){//详细地址
                    that.selRow.StreetAddress = that.nowAddressData.Stree;
                }
            }
            that.selRow.GoodsNoAndCounts = getCookie('productObj') ? getCookie('productObj') : '';
            if(!that.selRow.GoodsNoAndCounts || that.selRow.GoodsNoAndCounts == ''){
                that.$Message.warning('没有选中商品！');
                return false;
            }
            wxpost('User/SetAddShopCartSellOrderByLs',that.selRow).then(res =>{
                if(res.code == 200){
                    deleteCookie('productObj');
                    that.$Message.success({
                        content:res.details,
                        duration:0.5,
                        onClose(){ 
                            that.$router.push({name: 'lingshouOrder',params:{status:'-1'}});
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
        that.productObj = getCookie('productObj') ? JSON.parse(getCookie('productObj')) : [];
        if(that.productObj.length >0){
            that.load();
        }else{
            that.$Message.warning('没有选中商品');
        }
        that.isId = that.$route.query.id ? that.$route.query.id : '';
        console.log(that.isId);
        if(that.isId){
            wxget('User/GetWxDeliveryInfoById/'+that.isId).then(res =>{
                if(res.code == 200){
                    that.nowAddressData =  res.data;
                    that.selRow.ReceiveName = that.nowAddressData.ReceiveName;
                    that.selRow.F_Id = that.nowAddressData.F_Id;
                    that.selRow.Cellphone = that.nowAddressData.Phone;
                    if(that.nowAddressData.Province){//省
                        that.selRow.Province = that.nowAddressData.Province;
                    }
                    if(that.nowAddressData.City){//市
                        that.selRow.City = that.nowAddressData.City;
                    }
                    if(that.nowAddressData.Area){//区
                        that.selRow.County = that.nowAddressData.Area;
                    }
                    if(that.nowAddressData.Stree){//详细地址
                        that.selRow.StreetAddress = that.nowAddressData.Stree;
                    }
                }else{
                    that.$Message.error(res.message)
                }
            })
        }else{
            wxget('User/GetWxDeliveryInfoById/'+100+'/'+1).then(res =>{
                if(res.code == 200){
                    if(res.data.length > 0){
                        that.nowAddressData = res.data[0];
                        that.selRow.ReceiveName = that.nowAddressData.ReceiveName;
                        that.selRow.F_Id = that.nowAddressData.F_Id;
                        that.selRow.Cellphone = that.nowAddressData.Phone;
                        if(that.nowAddressData.Province){//省
                            that.selRow.Province = that.nowAddressData.Province;
                        }
                        if(that.nowAddressData.City){//市
                            that.selRow.City = that.nowAddressData.City;
                        }
                        if(that.nowAddressData.Area){//区
                            that.selRow.County = that.nowAddressData.Area;
                        }
                        if(that.nowAddressData.Stree){//详细地址
                            that.selRow.StreetAddress = that.nowAddressData.Stree;
                        }
                    }
                }else{
                    that.$Message.error(res.message)
                }
            })
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
                                &:nth-child(2){
                                    float:right;
                                }
                                em{
                                    color:#101010;
                                }
                            }
                        }
                    }
                }
                .ivu-divider-horizontal{
                    margin:0;
                    color:#B5B5B6;
                }
                .down_fix{
                    .carfix{
                        display:flex;
                        position: relative;
                        font-size:0.3733rem;//14px
                        padding: 0.2667rem 0;//10px 0
                        &>span{
                            margin-right:0.2667rem;// 10px
                            color:#101010;
                        }
                        &>input{
                            flex: 1; 
                            border:none;
                        }
                        &>.ivu-cascader{
                            flex: 1;
                        }
                        &>a{
                            flex:1;
                            color: #101010;
                            i{
                                float:right;
                            }
                        }
                    }
                }
            }
            .line{
                margin: 0;
                height:0.2667rem;//10px;
                /* margin: 0 -0.4rem; */
                width: 10rem;
                margin-left: -0.4rem;
            }
            .cont{
                ul{
                    .list{
                        overflow: hidden;
                        padding:0.1333rem 0;//5px 0
                        position: relative;
                        .list_l{
                            width:1.8667rem;//70px
                            float:left;
                            img{
                                width:100%;
                                vertical-align:bottom;
                            }
                        }
                        .list_r{
                            float:left;
                            width:100%;
                            margin-left:-1.8667rem;
                            padding-left:2.1333rem;//80px
                            display:flex;
                            flex-direction: column;
                            align-items: left;
                            justify-content: center;
                            p{
                                &:nth-child(1){
                                    font-size:0.3733rem;
                                    color:#101010;
                                    overflow: hidden;
                                    -webkit-line-clamp: 2;
                                    text-overflow: ellipsis;
                                    display: -webkit-box;
                                    -webkit-box-orient: vertical;
                                    color:#101010;
                                }
                                &:nth-child(2){
                                    font-size:0.3733rem;
                                    color:#101010;
                                    i{
                                        color:#DF8D15;
                                    }
                                }
                                &:nth-child(3){
                                    font-size:0.32rem;
                                    color:#AAA9A9;
                                }

                            }
                        }
                        .list_line{
                            margin:0;
                            position: absolute;
                            bottom:0;
                            top:auto !important;
                        }
                    }
                }
            }
            .remark{
                display:flex;
                padding:0.2667rem 0 0;//10px 0
                &>span{
                    font-size:0.3733rem;//14px
                    color:#101010;
                    padding-top:0.1333rem;//5px
                }
                &>.ivu-input-wrapper{
                    flex:1
                }
            }
        }
        .foot{
            position: fixed;
            bottom:0;
            width: 100%;
            z-index: 1001;
            border-top: 1px solid #ddd;
            background: #fff;
            display:flex;
            height: 1.0667rem;
            line-height: 1.0667rem;
            font-size:0.3733rem;
            &>.foot_l{
                flex:2;
                padding:0 0.4rem;
                span{
                    margin-right:0.1333rem;
                }
                em{
                    color:#DF8D15;
                }
            }
            &>.foot_r{
                flex:1;
                button{
                    height: 1.0667rem;
                    line-height: 1.0667rem;
                    background:#009788;
                    color:#fff;
                    width:100%;
                    border:none;
                }
            }
        }
    }
</style>
<style>
    .lingshouOrderWait .ivu-cascader .ivu-select-dropdown{
        left:auto !important;
        right:0.34rem;
    }
    .lingshouOrderWait input{
        border:none;
        color:#101010;
        height:0.5333rem;
        line-height:1;
    }
    .lingshouOrderWait input::-webkit-input-placeholder{
    color:#101010;
    }

    .lingshouOrderWait input:-moz-placeholder{
    color:#101010;
    }

    .lingshouOrderWait input::-moz-placeholder{
    color:#101010;
    }
    .lingshouOrderWait input:-ms-input-placeholder{
    color:#101010;
    }
    .lingshouOrderWait textarea.ivu-input,.lingshouOrderWait textarea.ivu-input:hover,.lingshouOrderWait textarea.ivu-input:focus{
        border:none;
    }
    .lingshouOrderWait .ivu-collapse-simple{
        border-top:none;
    }
    .lingshouOrderWait .ivu-collapse>.ivu-collapse-item>.ivu-collapse-header{
        padding-left:0;
        font-size:0.3733rem;
        color:#101010;
    }
    .lingshouOrderWait .ivu-collapse>.ivu-collapse-item>.ivu-collapse-header i{
        float: right;
        margin-right: 0;
    }
    .lingshouOrderWait .ivu-collapse>.ivu-collapse-item>.ivu-collapse-content{
        padding:0;
    }
    .lingshouOrderWait .ivu-collapse-simple>.ivu-collapse-item>.ivu-collapse-content>.ivu-collapse-content-box{
        padding-bottom:0;
    }
</style>
