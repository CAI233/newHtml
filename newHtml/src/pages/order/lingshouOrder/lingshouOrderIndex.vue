<template>
    <div id="container" class="lingshouOrderIndex">
        <i-form class="header_nav">
            <Form-item>
                <Row class="row">
                    <Col span="24">
                        <i-input type="text"  placeholder="搜索" v-model.trim()="searchText">
                            <i class="iconfont icon-seach" slot="prefix"  @click="Search()"></i>
                        </i-input>
                    </Col>
                </Row>
            </Form-item>
        </i-form>
        <Row class="content" ref="clientContent">
            <Col class="content_l">
                <Card  :padding="0" shadow >
                    <CellGroup>
                        <Cell :title="item.ClassName" v-for="item in classList" :key="item.F_Id" :selected="item.F_Id == classId ? true : false" @click.native="LoadProduct(item.F_Id)" />
                    </CellGroup>
                </Card>
            </Col>
            <Col class="content_r" span="18">
                <Row >
                    <div  class="inScroller">
                        <div class="noDataText" v-if="productList.length==0" >当前分类没有数据</div>
                        <Col  v-for="(item, index) in productList" :key="index" style="color:#000;margin-bottom:0.6rem;" span="12" :style="index%2 == 0 ? 'padding-right:0.1rem' : 'padding-left:0.1rem'">
                            
                            <Card class="cont_card">
                                <div>
                                    <router-link :to="{ name:'details', params: { id: item.GoodsNo }}">
                                        <img v-lazy="item.GoodsImageUrl" style="width:100%;border-radius:5px;vertical-align:bottom;" :alt="item.GoodsTitle">
                                    </router-link>
                                </div>
                                <ul>
                                    <li class="li_goodstitle">
                                        <span>{{item.GoodsTitle}}</span>
                                    </li>
                                    <li class="li_gauge">
                                        <span>箱规:</span>
                                        <span>{{item.UnitNumber+'/'+item.Unit}}</span>
                                    </li>
                                    <li class="li_stock">
                                        <span>库存:</span>
                                        <span>{{item.AgentStore}} (<i class="f-brown">{{item.MyStore}}</i>)</span>
                                    </li>
                                    <li class="li_money">
                                        <span>￥{{item.Price}}</span>
                                    </li>
                                    <li class="li_count">
                                        <i class="count_cut iconfont icon-minus" @click="handCount(item.GoodsNo,false,index)"></i>
                                        <InputNumber class="count_num" :min="0" v-model="item.ShopCartCount" size="small" v-on:input="newCount(item.GoodsNo,index)"></InputNumber>
                                        <i class="count_add iconfont icon-add" @click="handCount(item.GoodsNo,true,index)"></i>
                                    </li>
                                </ul>
                            </Card>
                        </Col>
                        <div class="noDataText" v-if="isMaxdown" >没有更多了了</div>
                    </div>
                </Row>
            </Col>
        </Row>
        <div class="foot-nav-containner">
            <ul class="bottom-nav">
                <li class="bottom-nav__li ">
                        <router-link to='' class="bottom-nav__li ">
                            <i class="iconfont icon-shopping"></i>
                            <span>{{goodsCount}}</span>
                        </router-link>
                </li>
                <li class="bottom-nav__li ">
                    <span>合计:<i>¥{{goodsPrice}}</i></span>
                    <button type="button"  @click="goPay">立即购买</button>
                </li> 
            </ul>
        </div>
    </div>
</template>

<script>
import {post,wxget,wxpost} from '@/axios/ajax';
import {addCookie,getCookie} from '@/assets/js/assist.js';
import {isLoading} from '@/assets/js/load.js'
export default {
    name: 'lingshouOrderIndex',
    components: {

    },
    data() {
        return{
            searchText:'',//搜索字段
            classList:[],//分类data数据
            classId:0,//当前分类id,默认为全部
            productList:[],//当前商品list
            nowScrollerData:[],//当前存在于scroller里的数据
            isMaxdown:false,//是否到底部了
            goodsCount:0,//购物车数量
            goodsPrice:0,
            productObj:[],//订单数组
        }
    },
    mounted(){ 
        let that = this;
        wxget('User/GetClassList').then(res => {//拉取分类
            if(res.code == 200){
                that.classList = res.data;
                that.classList.unshift({
                    ClassName:'全部',
                    F_Id:0
                })
                that.PostProduct(true);//默认全部
            }
        })

        that.productObj = getCookie('productObj') ? JSON.parse(getCookie('productObj')) : [];
        
        window.addEventListener('scroll', this.handleScroll)//添加滚动监听事件
        that.pageNum = 1;//初始页数
        that.pageSize = 6;//默认每页显示个数
    },
    methods:{
        Search(){//搜索
            let that = this;
            that.PostProduct(false);
        },
        LoadProduct(id){//切换分类
            let that = this;
            that.classId = id;
            that.PostProduct(false);
        },
        PostProduct(bool){//当默认政策或切换政策时，重新拉取商品信息
            let that = this;
            if(bool){
                that.classId = 0;
            }
            let params = {
                SearchKey:that.searchText,
                classId:that.classId,
                activityId:''
            }
            that.productList = [];//初始化
            that.isMaxdown = false;//初始化
            that.pageNum = 1;//初始化
            isLoading(that,'数据加载中···');
            wxpost('User/SetMyGoodsListByClassId',params).then(res =>{
                that.$Spin.hide();
                if(res.code == 200){
                    console.log(res.data);
                    that.nowScrollerData = res.data;
                    console.log(that.productObj);
                    that.nowScrollerData.map((item,key,arr) =>{
                        item['ShopCartCount'] = item['ShopCartCount'] ? item['ShopCartCount'] : 0;
                    })

                    if(that.productObj.length > 0){
                        for(let j in that.nowScrollerData){
                            for(let k in that.productObj){
                                if(that.nowScrollerData[j].GoodsNo == that.productObj[k].GoodsNo){
                                    that.nowScrollerData[j].ShopCartCount = that.productObj[k].ShopCartCount;
                                    that.goodsCount += that.productObj[k].ShopCartCount;
                                    that.goodsPrice += that.productObj[k].Price*that.productObj[k].ShopCartCount;
                                }
                            }
                        }
                    }

                    if(that.nowScrollerData.length>that.pageSize){
                        that.productList = that.nowScrollerData.splice(0,that.pageSize);//默认显示第一页
                    }else{
                        that.productList = that.nowScrollerData;
                    }
                }else{
                    this.$Message.error(res.message);
                }
            })  
        },
        handCount(num,bool,index){
            let that = this;
            let count = that.productList[index].ShopCartCount;
            let nowStock = that.productList[index].MyStore;
            if(bool){
                if(count == nowStock){
                    that.$Message.warning('数量不能大于库存');
                    return false;
                }
                count++;
            }else{
                if(!bool && count == 0){
                    that.$Message.warning('数量不能小于0');
                    return false;
                }
                count--;
            }
            let nowObj = {...that.productList[index]};

            nowObj.ShopCartCount = count;
            nowObj.BuyCount = count;
            that.$set(that.productList,index,nowObj);
            that.newCount(num,index);//更新购物车
        },
        newCount(num,index){//更新当前待购买商品
            let that = this;
            let nowObj = {...that.productList[index]};
            if(that.productList[index].ShopCartCount == null || that.productList[index].ShopCartCount == ''){
                nowObj.ShopCartCount = 0;
                nowObj.BuyCount = 0;
                that.$set(that.productList,index,nowObj);
            }
            // },[]); //设置cur默认类型为数组，并且初始值为空的数组
            if(that.productObj.length == 0){
                nowObj.BuyCount = nowObj.ShopCartCount;
                that.goodsCount = nowObj.ShopCartCount;
                that.goodsPrice = nowObj.Price*nowObj.ShopCartCount;
                that.productObj.push(nowObj);
            }else{
                let arr = [];//声明个转换数组，存储当前GoodsNo
                that.productObj.map((item) =>{
                    arr.push(item.GoodsNo);
                })
                if(arr.indexOf(nowObj.GoodsNo) != -1){
                    nowObj.BuyCount = nowObj.ShopCartCount;
                    that.productObj.splice(arr.indexOf(nowObj.GoodsNo),1,nowObj);
                    that.goodsCount = 0;
                    that.goodsPrice = 0;
                    that.productObj.map((item) =>{
                        item.BuyCount = item.ShopCartCount;
                        that.goodsCount += item.ShopCartCount;
                        that.goodsPrice += item.Price*item.ShopCartCount;
                    })
                }else{
                    nowObj.BuyCount = nowObj.ShopCartCount;
                    that.goodsCount += nowObj.ShopCartCount;
                    that.goodsPrice += nowObj.Price*nowObj.ShopCartCount;
                    that.productObj.push(nowObj);
                }  
            }
            console.log(that.productObj)
            addCookie('productObj',JSON.stringify(that.productObj),1);//添加缓存;
        },
        handleScroll(){
            let that = this;
            let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
            let bodyHeight = document.documentElement.clientHeight;
            let scrollHeight = document.documentElement.scrollHeight;
            let maxPgae = Math.ceil(that.nowScrollerData.length/that.pageSize);
            // 让侧边栏悬浮
            if(scrollTop + 5 > scrollHeight - bodyHeight){
                let nowArry;
                if(maxPgae ==0){
                    that.isMaxdown = true;
                }else if(maxPgae == 1){
                    nowArry = that.nowScrollerData.splice(0,that.nowScrollerData.length);
                    that.productList.push.apply(that.productList,nowArry);
                    that.isMaxdown = false;
                }else{
                    nowArry = that.nowScrollerData.splice(0,that.pageSize);
                    that.productList.push.apply(that.productList,nowArry);
                    that.isMaxdown = false;
                }
            }
        },
        goPay(){//提交零售订单
            let that = this;
            if(that.productObj.length == 0){
                that.$Message.warning('请添加商品');
                return false;
            }
            
            that.$router.push({name:'lingshouOrderWait'});
        }
    }
}
</script>
<style lang="scss" scoped>
    .lingshouOrderIndex{
        padding-bottom: 1.333rem;
        // height: 100%;
        .header_nav{
            .ivu-form-item{margin-bottom:0;}
            .row{padding:0.1333rem 0.4rem;background:#009788;}
            .row:after{display:block;content:'';clear:both;}
            .ivu-col-span-3{
                height:32px;
                line-height:32px;
                text-align: center;
            }
            .ivu-col-span-20 .ivu-input-wrapper{
                vertical-align:bottom; 
            }
        }
        .content{
            margin:0 0.4rem;
            &>.content_l{
                width:20%;
                float:left;
                margin-top: 0.4rem;
            }
            &>.content_r{
                width:80%;
                float:left;
                margin-top: 0.4rem;
                padding-left:0.1333rem;//5px
                // padding-bottom:0.4rem;//20px
                &>.ivu-row{
                    border-left:1px solid #DCDDDD;
                }
            }
            .ivu-card{
                // margin-top:0.4rem;
                box-shadow:none;
                .ivu-cell{
                    padding: 3px 5px;
                    text-align:center;
                    &:hover{
                        background:none;
                    }
                }
                .ivu-cell-selected, .ivu-cell-selected:hover{
                    color:#009788;
                    background:none;
                }
            }
            .inScroller{
                position:relative;
                overflow: hidden;
                margin-left:0.2667rem;// 10px;
                .ivu-scroll-container{
                    height:auto;
                }
                .noDataText{
                    text-align:center;
                    float: left;
                    width: 100%; 
                }
                .cont_card{
                    border: none;
                    .li_goodstitle{
                        span{
                            font-size:0.3467rem;
                            overflow: hidden;
                            -webkit-line-clamp: 2;
                            text-overflow: ellipsis;
                            display: -webkit-box;
                            -webkit-box-orient: vertical;
                            height: 1rem;  
                        }
                    }
                    .li_gauge{
                        font-size:0.32rem;
                        color:#B5B5B6;
                        span{
                            &:nth-last-child(1){
                                float:right;
                            }
                        }
                    }
                    .li_stock{
                        font-size:0.32rem;
                        color:#B5B5B6;
                        span{
                            &:nth-last-child(1){
                                float:right;
                            }
                        }
                    }
                    .li_count{
                       overflow: hidden;
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
                    }
                    .li_money{
                        font-size: 0.3733rem;//14px
                        color: #DF8D15;
                        padding: 5px 0;
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
                        flex:1;
                        a{
                            height: 1.0667rem;
                            line-height: 1.0667rem;
                            display: inline-block;
                            padding: 0 0.4rem;
                            position:relative;
                            i{
                                font-size:0.5333rem;
                                color:#727171;
                            }
                            span{
                                position: absolute;
                                right: 0.15rem;
                                top: 0rem;
                                background: #000;
                                border-radius: 50%;
                                font-size: 0.32rem;//12px;
                                width: 0.5rem;
                                height: 0.5rem;
                                background: #ff9b00;
                                color: #fff;
                                line-height: 0.5rem;
                                text-align: center
                            }
                        }
                    }
                    &:nth-child(2){
                        flex:3;
                        text-align: right;
                        span{
                            color: #DF8D15;
                            margin-right: 0.2667rem;//10px 
                            i{
                                margin-left: 0.2667rem;//10px 
                            }
                        }
                        button{
                            background:#009788;
                            height: 1.0667rem;
                            line-height: 1.0667rem;
                            color:#fff;
                            width: 2.4rem;
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
    .lingshouOrderIndex .content .cont_card .ivu-card-body{
        padding:0;
    }
    .lingshouOrderIndex .content .inScroller .ivu-scroll-container{
        height:auto !important;
    }
    .lingshouOrderIndex .content .inScroller .ivu-scroll-container .ivu-scroll-content{
        overflow: hidden;
    }
    .lingshouOrderIndex .content .cont_card .li_count .count_cut,.lingshouOrderIndex .content .cont_card .li_count .count_add{
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
        line-height: 1;
        box-sizing: border-box;
        font-size:0.3733rem;
    }
    .lingshouOrderIndex .content .cont_card .li_count .count_cut{
        color:#009788;
    }
    .lingshouOrderIndex .content .cont_card .li_count .count_add{
        background:#009788;
        color:#fff;
    }
    .lingshouOrderIndex .content .cont_card .li_count .count_num{
        height:0.533rem;
    }
    .lingshouOrderIndex .content .cont_card .li_count .count_num input{
        height:0.533rem;
        padding:0;
        border-radius:0;
        border-left:none;
        border-right:none;
        text-align: center;
    }
    .lingshouOrderIndex .content .cont_card .li_count .count_num .ivu-input-number-handler-wrap{
        display:none;
    }

</style>
 


