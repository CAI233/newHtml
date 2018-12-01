<template>
    <div id="container" class="waitSend">
        <div class="content">
            <ul class="cont">
                <li class="cont-list" v-for="(item,index) in goodsList" :key="index" :class="item.isCheck ? 'n-list': ''">
                    <p :class="index != 0 ? 'list-p' : ''"><span>商品编号:<em>{{item.GoodsNo}}</em></span></p>
                    <Divider />
                    <Row class="r_fix">
                        <Col span="2">
                            <i class="iconfont" v-if="item.isCheck" :class="item.IsDeliver ? 'icon-xuanzhong' : 'icon-weixuanzhong'"></i>
                            <i class="iconfont" v-else :class="item.IsDeliver ? 'icon-xuanzhong' : 'icon-weixuanzhong'" @click="getCheck(index)"></i>
                        </Col>
                        <Col span="22">
                            <Row>
                                <Col span="6">
                                    <img v-lazy="item.Imgurl" :key="item.Imgurl" alt="" />
                                </Col>
                                <Col span="18">
                                    <p>{{item.Title}}</p>
                                    <p><span>规格:<em>{{item.SepcName}}</em></span><span>箱规:<em>{{item.UnitNumber}}/{{item.Unit}}</em></span></p>
                                    <p class="price"><em >￥{{item.Price}}</em>×{{item.Number}}<span>合计:<em>¥{{item.Price*item.Number}}</em></span><span>数量:<em>{{item.Number}}</em></span></p>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Divider class="line" v-if="index != goodsList.length -1"/>
                </li>
            </ul>
        </div>
        <foot-common :btnText="text" :icon="iconf" @click.native="sendTo"></foot-common>
    </div>
</template>
<script>
import {wxget,wxpost} from '@/axios/ajax';
import {addCookie,getCookie,getCurrentDate,deleteCookie} from '@/assets/js/assist.js'
import {isLoading} from '@/assets/js/load.js';
import footCommon from '@/components/foot-common.vue';
export default {
    name: 'waitSend',
    data() {
        return{
            text:'发货',
            iconf:'',
            orderNo:'',
            goodsList:[]
        }
    },
    components: {
        footCommon
    },
    methods:{
        load(id){//加载订单
            let that = this;
            wxget('User/GetOrderDetailByOrderNo/'+id).then(res =>{
                if(res.code == 200){
                    console.log(res);
                    that.goodsList = res.data;
                    that.goodsList.map((item) =>{
                        item.isCheck = item.IsDeliver;
                    })
                }else{
                    that.$Message.error(res.details);
                }
            })
        },
        getCheck(index){//选择待发货商品
            console.log(index);
            let that = this;
            let nowObj = that.goodsList[index];
            nowObj.IsDeliver = !nowObj.IsDeliver;
            that.$set(that.goodsList,index,nowObj);
        },
        sendTo(){//发货
            let that = this;
            let num = 0;
            let goodsIds = [];
            for(let j of that.goodsList){
                if(!j.isCheck){
                    if(j.IsDeliver){
                        num++;
                        goodsIds.push(j.GoodsNo)
                    }
                }
            }
            console.log(num);
            if(num == 0){
                that.$Message.warning('请最少选择一个商品');
                return false;
            }
            that.$router.push({name:'fenxiaoSend',params: {OrderNo:that.orderNo},query:{ids:goodsIds.join(",")}});//跳转
        }
    },
    mounted(){
        let that = this;
        that.orderNo = that.$route.params.OrderNo;
        console.log(that.orderNo);
        that.load(that.orderNo);
    }
}
</script>
<style lang="scss" scoped>
    #container{
        padding-bottom: 1.333rem;
        .content{
            padding:0.5333rem 0.4rem 0;//20px 15px 0;
            .cont{
                .cont-list{
                    &.n-list{
                        background: #ccc;
                        margin-left: -0.4rem;
                        margin-right: -0.4rem;
                        padding: 0 0.4rem;
                    }
                    &>p{
                        font-size:0.3733rem;
                        color:#101010;
                        span{
                            em{
                                color:#727171;
                                margin-left:0.1333rem;
                            }
                        }
                        &.list-p{
                            padding-top:0.1333rem;
                        }
                    }
                    &>.r_fix{
                        display:flex;
                        .ivu-col-span-2{
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            i{
                                font-size:0.5333rem;//20px
                                color:#009788;
                            }
                        }
                        &>.ivu-col-span-22{
                            padding:0.2667rem 0; 
                        }
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
                                            margin-left:0.1333rem;
                                        }
                                        em{
                                            color:#ad7a2b;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    &>.ivu-divider-horizontal{
                        margin:0.1333rem 0 0.2667rem;
                        &.line{
                            margin:0;
                            height:0.2667rem;
                            margin-left: -0.4rem;
                            width: 10rem;
                        }
                    }
                }
            }
        }
    }
</style>