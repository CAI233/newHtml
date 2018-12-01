<template>
    <div id="container" class="goodsindex">
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
        <Row class="content_title">
            <Col span="12">
                <Row class="cont_row">
                    <Col span="18" offset="4" style="text-align:right;">
                        <Dropdown trigger="click">
                            <a href="javascript:void(0)">
                                {{nowPolicy}}
                                <Icon type="ios-arrow-down" v-if="policyLlist.length>1"></Icon>
                            </a>
                            <!-- <DropdownMenu slot="list" >
                                <DropdownItem :name="item.F_Id" v-if="policyLlist.length>0" v-for="item in policyLlist" :key="item.F_Id" :selected="item.F_Id == nowPolicyId ? true : false">{{item.BrandName}}</DropdownItem>
                                <DropdownItem v-else>暂无对应品牌</DropdownItem>
                            </DropdownMenu> -->
                        </Dropdown>
                    </Col>
                </Row>
                
            </Col>
            <Col span="12">
                <Row class="cont_row">
                    <Col span="18" offset="2">
                        <Dropdown trigger="click" @on-click="BrandClick">
                            <a href="javascript:void(0)">
                                {{nowBrand}}
                                <Icon type="ios-arrow-down" v-if="brandList.length>1"></Icon>
                            </a>
                            <DropdownMenu slot="list" style="text-align:left;" >
                                <DropdownItem :name="item.F_Id" v-if="brandList.length>0" v-for="item in brandList" :key="item.F_Id" :selected="item.F_Id == nowBrandId ? true : false">{{item.Title}}</DropdownItem>
                                <DropdownItem v-else>暂无对应品牌</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </Col>
                </Row>
                
            </Col>
        </Row>
        <Row class="content" ref="clientContent">
            <Col class="content_l">
                <Card  :padding="0" shadow >
                    <CellGroup>
                        <Cell :title="item.ClassName" v-for="item in classList" :key="item.ClassId" :selected="item.ClassId == classId ? true : false" @click.native="LoadProduct(item.ClassId)" />
                    </CellGroup>
                </Card>
            </Col>
            <Col class="content_r" span="18">
                <Row >
                    <div  class="inScroller">
                        <div class="noDataText" v-if="productList.length==0" :class="productList.length==0 ? 'no' : ''">
                            <p><img src="../../assets/images/nodata.png" alt="" style="width:3rem;vertical-center:bottom;"></p>
                            <p>当前分类没有商品</p>
                        </div>
                       <Col  v-for="(item, index) in productList" :key="index" style="color:#000;margin-bottom:0.6rem;" span="12" :style="index%2 == 0 ? 'padding-right:0.1rem' : 'padding-left:0.1rem'">
                            
                            <Card class="cont_card">
                                <div>
                                    <router-link :to="{ name:'details', params: { id: item.GoodsNo }}">
                                        <img v-lazy="imgUrl+item.GoodsImageUrl" style="width:100%;border-radius:5px;vertical-align:bottom;" :alt="item.GoodsTitle">
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
                                        <!-- <i class="count_cut iconfont icon-minus" @click="handCount(item.GoodsNo,false,index)">-</i> -->
                                        <InputNumber class="count_num" :min="0" v-model="item.ShopCartCount" size="small" v-on:input="newCount(item.GoodsNo,index)"></InputNumber>
                                        <i class="count_add iconfont icon-add" @click="handCount(item.GoodsNo,true,index)"></i>
                                        <!-- <i class="count_add iconfont icon-add" @click="handCount(item.GoodsNo,true,index)">+</i> -->
                                    </li>
                                </ul>
                            </Card>
                        </Col>
                        <div class="noDataText" v-if="isMaxdown" >没有更多了</div>
                    </div>
                </Row>
            </Col>
            <div class="boxfix" v-if="goodsCount>0">
                <router-link :to='{name:"car"}'>
                    <i class="iconfont icon-shopping"></i>
                    <span>{{goodsCount}}</span>
                </router-link>
            </div>
        </Row>
    </div>
</template>

<script>
import {addCookie,getCookie,getLoginUser} from '@/assets/js/assist.js';
import {wxget,wxpost} from '@/axios/ajax';
import {isLoading} from '@/assets/js/load.js'
export default {
    name: 'goodsindex',
    components: {
        
    },
    data() {
        return{
            infoData:getLoginUser() ? getLoginUser() : '',
            SellerF_Id:getCookie('SellerF_Id') ? getCookie('SellerF_Id') : 0,
            searchText:'',//搜索字段
            brandList:[],//政策data数据
            nowBrand:'',//政策名称
            nowBrandId:'',//政策id
            nowPolicy:'',//品牌名称
            nowPolicyId:'',//品牌id
            policyLlist:[],//品牌data数据
            classList:[],//分类data数据
            classId:0,//当前分类id,默认为全部
            productList:[],//当前商品list
            nowScrollerData:[],//当前存在于scroller里的数据
            isMaxdown:false,//是否到底部了
            goodsCount:0,//购物车数量
        }
    },
    mounted(){
        let that = this;
        let url = 'User/GetActivityListByBrand/';//User/GetActivityListByTarget

        wxget(url+that.SellerF_Id).then(res => {//拉取政策
            // console.log(res);
            if(res.code == 200){
                let that = this;
                console.log(res.data);
                that.brandList = res.data;
                //判断是否有缓存 ActivityId
                if(getCookie('ActivityId') && getCookie('ActivityTitle') && getCookie('ActivityDescribe')){
                    that.BrandClick(getCookie('ActivityId'));
                }else{
                    //默认选择第一个政策
                    if(that.brandList.length>0){
                        that.BrandClick(that.brandList[0].F_Id);
                    }
                }
            }else{
                this.$Message.error(res.message);
            }
        })

        // wxget('User/GetClassList').then(res => {//拉取分类
        //     let that = this;
        //     if(res.code == 200){
        //         that.classList = res.data;
        //         that.classList.unshift({
        //             ClassName:'全部',
        //             F_Id:0
        //         })
        //     }
        // })
        // 从登录时信息里拿到品牌信息
        this.nowPolicy = this.infoData.SellerName || '';
        this.nowPolicyId = this.infoData.SellerNo || '';   

        window.addEventListener('scroll', this.handleScroll)//添加滚动监听事件
        this.pageNum = 1;//初始页数
        this.pageSize = 6;//默认每页显示个数
 
    },
    methods:{
        Search(){//搜索
            let that = this;
            that.PostProduct(false);
        },
        BrandClick(name){//切换政策
            let that = this;
            that.nowBrandId = name;
            that.brandList.map((item,key,arr) => {
                if(item.F_Id == name){
                    let brand = item.Title;
                    if(brand.indexOf("(") > -1){
                        that.nowBrand = brand.slice(0,brand.indexOf("("));

                    }else{
                        that.nowBrand = brand;
                    }
                    addCookie('ActivityId',that.nowBrandId,1);
                    addCookie('ActivityTitle',that.nowBrand,1);
                    addCookie('ActivityDescribe',item.Describe,1);
                }
            })
            that.PostProduct(true);
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
                activityId:that.nowBrandId
            }
            that.productList = [];//初始化
            that.isMaxdown = false;//初始化
            that.pageNum = 1;//初始化
            isLoading(that,'数据加载中···');
            wxpost('User/GetGoodsListByActivityId',params).then(res =>{
                that.$Spin.hide();
                if(res.code == 200){
                    that.nowScrollerData = res.data;

                    // 获取当前所有商品的分类
                    if(params.classId == 0 && res.data.length >0 ){
                        let obj = {};
                        let newData =  res.data.reduce((cur,next) => {
                            obj[next.ClassId] ? "" : obj[next.ClassId] = true && cur.push(next);
                            return cur;
                        },[]); //设置cur默认类型为数组，并且初始值为空的数组
                        that.classList = newData;
                        that.classList.unshift({
                            ClassName:'全部',
                            ClassId:0
                        });
                    }
                    
                   

                    if(that.nowScrollerData.length>that.pageSize){
                        that.productList = that.nowScrollerData.splice(0,that.pageSize);//默认显示第一页
                    }else{
                        that.productList = that.nowScrollerData;
                        // that.isMaxdown = true;
                    }
                    that.loadCount(params.activityId);//更新购物车数量
                }else{
                    this.$Message.error(res.message);
                }
            })  
        },
        loadCount(id){//更新购物车数量
            let that = this;
            wxget('User/GetShopCartCount/'+id).then(res =>{
                if(res.code == 200){
                    that.goodsCount = res.data;
                }else{
                    that.$Message.error(res.message);
                }
            })
        },
        handCount(num,bool,index){//加减操作购物车
            let that = this;
            let count = that.productList[index].ShopCartCount;
            if(bool){
                count++;
            }else{
                if(!bool && count == 0){
                    this.$Message.error('数量不能小于0');
                    return false;
                }
                count--;
            }
            let nowObj = {};
            for(let i in that.productList[index]){
                nowObj[i] = that.productList[index][i];
            }
            nowObj.ShopCartCount = count;
            that.$set(that.productList,index,nowObj);
           that.newCount(num,index);//更新购物车
        },
        newCount(num,index){//更新购物车
            let that = this;
            let param = {
                ActivityTitle:that.nowBrand,
                ActivityId:that.nowBrandId,
                GoodsNo:num,
            };
            let nowObj = {...that.productList[index]};
            if(that.productList[index].ShopCartCount == null || that.productList[index].ShopCartCount == ''){
                nowObj.ShopCartCount = 0;
                that.$set(that.productList,index,nowObj);
            }
            param.BuyCount = nowObj.ShopCartCount;
            wxpost('User/SetAddShopCart',param).then(res =>{//调用加减商品操作接口
                if(res.code == 200){
                    //及时更新购物车数量
                    that.loadCount(param.ActivityId);//更新购物车数量
                }else{
                    that.$Message.error(res.message);
                }
            })
        },
        handleScroll(){//监听页面滚动
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
        }
    }
}
</script>
<style lang="scss" scoped>
    .goodsindex{
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
        .content_title{
            margin:0 0.4rem;
            border-bottom:1px solid #dcdee2;
            .cont_row{
                a{
                    height: 0.8rem;
                    line-height: 0.8rem;
                    padding: 0.14rem 0;
                    color:#009788;
                }
                .ivu-dropdown-item-selected, .ivu-dropdown-item.ivu-dropdown-item-selected:hover{
                    color:#009788;
                    background:none;
                }
            }
        }
        .content{
            margin:0 0.4rem;
            // position: relative;
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
                padding-bottom:0.4rem;//20px
                &>.ivu-row{
                    border-left:1px solid #DCDDDD;
                }
            }
            .boxfix{
                position: fixed;
                bottom: 1.75rem;
                right: 0.5rem;
                a{
                    position: relative;
                    display: flex;
                    width: 1rem;
                    height: 1rem;
                    border-radius: 50%;
                    border: 1px solid #e6e0e0;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    background: rgba(255,255,255,.2);
                    i{
                        font-size:0.48rem;
                        color:#888;
                    }
                    span{
                        position: absolute;
                        right: -0.15rem;
                        top: -0.15rem;
                        background: #000;
                        border-radius: 50%;
                        font-size: 12px;
                        width: 0.5rem;
                        height: 0.5rem;
                        background: #ff9b00;
                        color: #fff;
                        line-height: 0.5rem;
                        text-align: center
                    }
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
                // position:relative;
                overflow: hidden;
                margin-left:0.2667rem;// 10px;
                .ivu-scroll-container{
                    height:auto;
                }
                .noDataText{
                    text-align:center;
                    float:left;
                    width:100%;
                    &.no{
                        position: absolute;
                        height: 14rem;
                    }    
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
    }
</style>    
<style>
    .goodsindex .content .cont_card .ivu-card-body{
        padding:0;
    }
    .goodsindex .content .inScroller .ivu-scroll-container{
        height:auto !important;
    }
    .goodsindex .content .inScroller .ivu-scroll-container .ivu-scroll-content{
        overflow: hidden;
    }
    .goodsindex .content .cont_card .li_count .count_cut,.goodsindex .content .cont_card .li_count .count_add{
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
    .goodsindex .content .cont_card .li_count .count_cut{
        color:#009788;
    }
    .goodsindex .content .cont_card .li_count .count_add{
        background:#009788;
        color:#fff;
    }
    .goodsindex .content .cont_card .li_count .count_num{
        height:0.533rem;
    }
    .goodsindex .content .cont_card .li_count .count_num input{
        height:0.533rem;
        padding:0;
        border-radius:0;
        border-left:none;
        border-right:none;
        text-align: center;
    }
    .goodsindex .content .cont_card .li_count .count_num .ivu-input-number-handler-wrap{
        display:none;
    }
</style>
 


