<template>
    <div id="container">
        <i-form class="header_nav">
            <Form-item>
                <Row class="row">
                    <Col span="2">
                        <router-link to='' @click.native="back" style="vertical-align:middle;">
                            <i class="iconfont icon-iconback"></i>
                        </router-link>
                    </Col>
                    <Col span="22">
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
            <Col class="content_r">
                <Row >
                    <div  class="inScroller">
                        <div class="noDataText" v-if="productList.length==0" >当前分类没有数据</div>
                       <!-- :style="index%2 == 0 ? 'padding-right:0.1rem' : 'padding-left:0.1rem'" -->
                        <Card class="cont_card" v-for="(item, index) in productList" :key="index" style="color:#000;">
                            <ul>
                                <li>
                                    <Row class="cont_card-row">
                                        <Col span="7">
                                            <img v-lazy="imgUrl+item.GoodsImageUrl" style="width:100%;border-radius:5px;vertical-align:bottom;" :alt="item.GoodsTitle">
                                        </Col>
                                        <Col span="17">
                                            <p>{{item.GoodsTitle}}</p>
                                            <p>箱规:{{item.UnitNumber+'/'+item.Unit}}</p>
                                            <p>
                                                <span>可卖库存:<i>{{item.MyStore}}</i></span>
                                                <span>实物库存:<i>{{item.MyRealityStore}}</i></span>
                                            </p>
                                        </Col>
                                    </Row>
                                </li>
                                <li>
                                    <router-link :to='{ name:"water",params: { id: item.GoodsNo }}' >
                                        <i-button type="primary" >产品流水</i-button>
                                    </router-link>
                                    <router-link :to='{ name:"adjustment",params: { id: item.GoodsNo }}' >
                                        <i-button type="primary" >库存调整</i-button>
                                    </router-link>
                                    
                                    <!-- <i-button type="primary"  @click="Adjustment()">库存调整</i-button> -->
                                </li>
                            </ul>
                        </Card>
                        <div class="noDataText" v-if="isMaxdown" >没有更多了了</div>
                    </div>
                </Row>
            </Col>
        </Row>
    </div>
</template>

<script>
import Vue from 'vue';
import {wxget,wxpost} from '@/axios/ajax';
import {isLoading} from '@/assets/js/load.js';
import {addCookie,getCookie} from '@/assets/js/assist.js'
export default {
    name: 'productManagement',
    components: {
        
    },
    data() {
        return{
            searchText:'',//搜索字段
            classList:[],//分类data数据
            classId:0,//当前分类id,默认为全部
            productList:[],//当前商品list
            nowScrollerData:[],//当前存在于scroller里的数据
            isMaxdown:false,//是否到底了
        }
    },
    mounted(){
        wxget('User/GetClassList').then(res => {//拉取分类
            let that = this;
            if(res.code == 200){
                that.classList = res.data;
                that.classList.unshift({
                    ClassName:'全部',
                    F_Id:0
                })
                that.PostProduct(true);//默认选择全部
            }
        }).catch(res => {
            console.log(res);
        })
       
        window.addEventListener('scroll', this.handleScroll)//添加滚动监听事件
        this.pageNum = 1;//初始页数
        this.pageSize = 6;//默认每页显示个数
 
    },
    methods:{
        Search(){//搜索
            let that = this;
            that.PostProduct(false);
        },
        back(){
            let that = this;
            that.$router.go(-1);
        },
        LoadProduct(id){//切换分类
            let that = this;
            that.classId = id;
            that.PostProduct(false);
        },
        PostProduct(bool){//当切换分类，重新拉取商品信息
            let that = this;
            if(bool){
                that.classId = 0;
            }
            let params = {
                SearchKey:that.searchText,
                classId:that.classId,
                activityId:0//默认0 不需要传政策
            }
            that.productList = [];//初始化
            that.isMaxdown = false;//初始化
            that.pageNum = 1;//初始化
            isLoading(that,'数据加载中···');
            wxpost('User/GetGoodsList',params).then(res =>{
                that.$Spin.hide();
                if(res.code == 200){
                    that.nowScrollerData = res.data;
                    if(that.nowScrollerData.length>that.pageSize){
                        that.productList = that.nowScrollerData.splice(0,that.pageSize);//默认显示第一页
                    }else{
                        that.productList = that.nowScrollerData;
                        // that.isMaxdown = true;
                    }
                }else{
                    this.$Message.error(res.message);
                }
            }).catch(res => {
                console.log(res);
            })   
        },
        handleScroll(){
            let that = this;
            let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
            let bodyHeight = document.documentElement.clientHeight;
            let scrollHeight = document.documentElement.scrollHeight;
            let maxPgae = Math.ceil(that.nowScrollerData.length/that.pageSize);
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
    #container{
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
            &>.ivu-col{
                margin-top:0.4rem;
            }
            &>.content_l{
                width:20%;
                float:left;
            }
            &>.content_r{
                width:80%;
                float:left;
                padding-left:0.1333rem;//5px
                padding-bottom:0.4rem;//20px
                &>.ivu-row{
                    border-left:1px solid #DCDDDD;
                }
            }
            .ivu-card{
                // margin-top:0.4rem;
                margin-bottom:0.4rem;
                box-shadow:none;
                .ivu-cell{
                    padding: 3px 5px;
                    text-align:center;
                    background:none;
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
                }
                .cont_card{
                    border: none;
                    ul{
                        li{
                            &:nth-child(2){
                                text-align:right;
                                a{
                                    &:nth-child(1){
                                        button{
                                            background:#fff;
                                            color:#666666;
                                            border:1px solid #009788;
                                        }
                                    } 
                                    &:nth-child(2){
                                        button{
                                            background:#fff;
                                            color:#666666;
                                            border:1px solid #727171;
                                        }    
                                    }
                                }
                            }
                            .cont_card-row{
                                .ivu-col{
                                    &:nth-child(2){
                                        padding:0.1333rem 0 0.1333rem 0.2667rem;// 5px 0 5px 10px;
                                    }
                                    p{
                                        &:nth-child(1){
                                            color:#666666;
                                            overflow : hidden;
                                            text-overflow: ellipsis;
                                            display: -webkit-box;
                                            -webkit-line-clamp: 2;
                                            -webkit-box-orient: vertical;
                                            font-size: 0.32rem;//12px
                                            height: 1rem;
                                        }
                                        &:nth-child(2){
                                            font-size: 0.32rem;//12px
                                            color:#B5B5B6;
                                        }
                                        &:nth-child(3){
                                            font-size: 0.32rem;//12px
                                            color:#B5B5B6;
                                            span{
                                                width:50%;
                                                float:left;
                                                overflow: hidden;
                                                text-overflow: ellipsis;
                                                white-space: nowrap;
                                                &:nth-child(1){
                                                    padding-right:0.1333rem;
                                                }
                                                &:nth-child(2){
                                                    float:right;
                                                    padding-left:0.1333rem;
                                                }
                                            }
                                            i{
                                                color:#DF8D15;
                                            }  
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            
        }
    }
</style>    
<style>
    #container .content .cont_card .ivu-card-body{
        padding:0;
    }
    #container .content .inScroller .ivu-scroll-container{
        height:auto !important;
    }
    #container .content .inScroller .ivu-scroll-container .ivu-scroll-content{
        overflow: hidden;
    }


</style>
 


