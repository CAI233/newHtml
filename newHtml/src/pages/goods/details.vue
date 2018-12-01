<template>
    <div id="container">
        <!-- <swiperComponent :swiperOption="swiperOption"></swiperComponent> -->
        <div class="content">
            <Card :padding="0" shadow >
                <ul v-for="(good,i) in goodsDetails" :key="i" v-if="goodsDetails.length>0">
                    <li>
                        <swiper :options="swiperOption" ref="swiperOption" class="swiper-box" v-if="imgUrls.length>0">
                            <swiper-slide class="swiper-item" v-for="(item,index) in imgUrls" :key="index" >
                                <router-link to="">
                                    <img v-if="index == 0 || index == imgUrls.length-1" :src="item.ImgUrl" :alt="good.goodsTitle" >
                                    <img v-else v-lazy="item.ImgUrl" :alt="good.goodsTitle">
                                </router-link>
                            </swiper-slide>
                            <div class="swiper-pagination" slot="pagination"></div>
                        </swiper>
                        <swiper :options="swiperOption" ref="swiperOption" class="swiper-box" v-else>
                            <swiper-slide class="swiper-item">
                                <router-link to="" style="display:inherit">
                                    <img src="../../assets/images/goods.png">
                                </router-link>
                            </swiper-slide>
                            <div class="swiper-pagination" slot="pagination"></div>
                        </swiper>
                    </li>
                    <li>{{good.GoodsTitle}}</li>
                    <li class="money">¥{{good.Price}}</li>
                    <li class="count">
                        <i class="count_cut" @click="handCount(good.GoodsNo,false,i)">-</i>
                        <InputNumber class="count_num" :min="0" v-model="good.ShopCartCount" size="small" v-on:input="newCount(good.GoodsNo,i)"></InputNumber>
                        <i class="count_add" @click="handCount(good.GoodsNo,true,i)">+</i>
                        <span>库存:&nbsp;{{good.AgentStore}} (<i >{{good.MyStore}}</i>)</span>
                    </li>
                    <li class="li_r"><span>品牌</span>{{good.BrandName}}</li>
                    <li class="li_r"><span>规格</span>{{good.SepcName}}</li>
                    <li class="li_r li_dr"><span>箱规</span>{{good.UnitNumber+'/'+good.Unit}}</li>
                    <li style="text-align:center;">产品详情</li>
                    <li class="li_l"><span v-html="good.GoodsDescription"></span></li>
                </ul>
            </Card>
        </div>
        <pay-foot :count="goodsCount" :price="goodsPrice" ></pay-foot>
    </div>
    
</template>

<script>
import payFoot from '@/components/pay-foot.vue';
// import {GetProductDetails,CartCount,Cart} from './api.js';
import {getCookie} from '@/assets/js/assist.js';
import {wxget,wxpost} from '@/axios/ajax';
export default {
    name: 'orderindex',
    data() {
        return{
            goodsDetails:[],
            nowGoodsNo:'',
            ActivityId:getCookie('ActivityId') ? getCookie('ActivityId') : '',
            ActivityTitle:getCookie('ActivityTitle') ? getCookie('ActivityTitle') : '',
            goodsCount:0,
            goodsPrice:0,
            imgUrls:[],
            swiperOption:{
                direction: 'horizontal', 
                // loop: true,
                // autoplay: {
                //     delay: 3000,
                //     disableOnInteraction: false
                // },
            },
        }
    },
    components: {
        payFoot
    },
    methods:{
        handCount(num,bool,index){
            let that = this;
            let count = that.goodsDetails[index].ShopCartCount;
            
            if(bool){
                count++;
            }else{
                if(!bool && count == 0){
                    this.$Message.error('数量不能小于0');
                    return false;
                }
                count--;
            }
            let nowObj = {...that.goodsDetails[index]};
            
            nowObj.ShopCartCount = count;
            that.$set(that.goodsDetails,index,nowObj);
            that.newCount(num,index);//更新购物车
        },
        newCount(num,index){//更新购物车
            let that = this;
            let param = {
                ActivityTitle:that.ActivityTitle,
                ActivityId:that.ActivityId,
                GoodsNo:num,
            };
            let nowObj = {...that.goodsDetails[index]};
            if(that.goodsDetails[index].ShopCartCount == null || that.goodsDetails[index].ShopCartCount == ''){
                nowObj.ShopCartCount = 0;
                that.$set(that.goodsDetails,index,nowObj);
            }
            param.BuyCount = nowObj.ShopCartCount;
            wxpost('User/SetAddShopCart',param).then(res =>{//调用加减商品操作接口
                if(res.code == 200){
                    //及时更新购物车数量
                    that.loadCount(param.ActivityId);
                }else{
                    that.$Message.error(res.message);
                }
            }).catch(res => {
                console.log(res);
            })    
        },
        load(){// 获取详情
            let that = this;
            wxget('User/GetGoodsByActivityGoodsNo_Union/'+that.ActivityId+'/'+that.nowGoodsNo).then(res =>{
                if(res.code == 200){
                    that.goodsDetails.push(res.data);
                    that.imgUrls = res.data.GoodsImageList;
                    // console.log(that.goodsDetails);
                }else{
                    that.$Message.error(res.message);
                }
            })
        },
        loadCount(id){//更新购物车数量
            let that = this;
            wxget('User/GetShopCartCount/'+id).then(res =>{
                if(res.code == 200){
                    console.log(res);
                    that.goodsCount = res.data;
                    that.goodsPrice = res.map;
                }else{
                    that.$Message.error(res.message);
                }
            })
        }
    },
    mounted(){
        let that = this;
        that.nowGoodsNo = this.$route.params.id;
        that.goodsDetails = [];//初始化
        that.load();
        that.loadCount(that.ActivityId);
        
        
    }
}
</script>
<style lang="scss" scoped>
// @import '../../assets/css/base.scss';
    #container{
        padding-bottom: 1.0667rem;
        .content{
            .ivu-card{
                box-shadow:none;
            }
            .ivu-card-body{
                
                ul{
                    li{
                        &:nth-child(1){
                            margin-top:0.5333rem;//20px;
                        }
                        &:not(:first-of-type){
                            margin: 0.1333rem 0.4rem;//5px 15px
                        }
                        .swiper-box{
                            width: 100%;
                            height: 100%;
                            margin: 0 auto;
                            .swiper-item {
                                height: 7.3333rem;//275px
                                text-align:center;
                                img{height:100%;vertical-align:bottom;}
                            }	   
                        }
                    }
                    .money{
                        color:#DF8D15;
                    }
                    .count{
                        overflow: hidden;
                        border-bottom: 1px solid #B5B5B6;
                        padding-bottom: 10px;
                        .count_cut{
                            float:left;
                        }
                        .count_num{
                            width:1rem;
                            float:left;
                            .ivu-input-number-handler-wrap{
                                display:none;
                            }
                        }
                        .count_add{
                            float:left;
                        }
                        span{
                            font-size:0.32rem;//12px
                            margin-left: 0.4rem;//15px
                        }
                    }
                    .li_r{
                        font-size:0.32rem;//12px
                        span{
                            color: #B5B5B6;
                            margin-right: 0.4rem;//15px
                            
                        }
                    } 
                    .li_dr{
                        border-bottom: 1px solid #B5B5B6;
                        padding-bottom: 10px;
                    }
                    .li_l{
                        font-size:0.32rem;//12px
                        color:#727171;  
                    }   
                }
                
            }
        }
    }
    

</style>
<style>
    #container .content .count .count_cut,#container .content .count .count_add{
        width:0.533rem;
        height:0.533rem;
        padding:0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border-radius:0;
        color:#009788;
        border:1px solid #009788;
    }
    #container .content .count .count_cut{
        color:#666;
    }
    #container .content .count .count_add{
        background:#009788;
        color:#fff;
    }
    #container .content .count .count_num{
        height:0.533rem;
    }
    #container .content .count .count_num input{
        height:0.533rem;
        padding:0;
        border-radius:0;
        border-left:none;
        border-right:none;
        text-align:center;
    }
    #container .content .count .count_num .ivu-input-number-handler-wrap{
        display:none;
    }
    #container .ivu-input-number-small .ivu-input-number-input-wrap{
        height:0.533rem;
        box-shadow:none;
    }
    #container .content .ivu-card-body ul .li_l img{
        width:100%;
    } 
</style>


