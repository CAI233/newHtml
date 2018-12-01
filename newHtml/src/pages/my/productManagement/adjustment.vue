<template>
    <div id="container" class="adjustment">
        <div class="row_title">
            <Row >
                <Col span="6">
                    <img v-lazy="imgUrl+goodsData.GoodsImageUrl" :key="goodsData.GoodsImageUrl" />
                </Col>
                <Col span="18">
                    <p class="goods_title">{{goodsData.GoodsTitle}}</p>
                    <p class="goods_gauge">箱规:<span>{{goodsData.UnitNumber+'/'+goodsData.Unit}}</span></p>
                    <p class="goods_inventory">库存:<span>{{goodsData.MyStore}}</span></p>
                </Col>
            </Row>
            <Divider />
        </div>
        <div class="row_cont">
            <p>说明:实物库存=可卖库存+预留库存/销售库存</p>
            <Row class="cont_cont">
                <Col span="12">可卖库存:<span>{{InvenToryData.FreezeStore ? InvenToryData.FreezeStore : 0}}</span></Col>
                <Col span="12">销售库存:<span>{{InvenToryData.SaleStore ? InvenToryData.SaleStore : 0}}</span></Col>
                <Col span="12">预留库存:<span>{{InvenToryData.ReservedStore ? InvenToryData.ReservedStore : 0}}</span></Col>
                <Col span="12">实际库存:<span>{{InvenToryData.RealityStore ? InvenToryData.RealityStore : 0}}</span></Col>
            </Row>
            <Divider />
            <div class="cont-foot">
                <ul>
                    <li class="carfix">
                        <span>库存数量</span>    
                        <p class="operation">
                            <!-- <button @click="handMin">-</button><InputNumber class="fix_n" :min="0" v-model="InventoryNum" @on-change="handModel"></InputNumber><button @click="handMax">+</button> -->
                            <!-- <button @click="handMin">-</button><Input  class="fix_n" v-model="InventoryNum" @on-change="handModel" /><button @click="handMax">+</button> -->
                            <button @click="handMin" class="iconfont icon-minus"></button>
                            <input onkeyup="this.value=this.value.replace(/\D/g,'')" onafterpaste="this.value=this.value.replace(/\D/g,'')"  class="fix_n" v-model="InventoryNum" v-on:input="handModel(InventoryNum)" />
                            <button @click="handMax" class="iconfont icon-add"></button>
                        </p>
                    </li>
                    <li class="carfix">
                        <span>调整原因</span>
                        <Dropdown trigger="click" @on-click="choose" >
                            <a href="javascript:void(0)">
                                <span>{{AdjustText}}</span>    
                                <Icon type="ios-arrow-down"></Icon>
                            </a>
                            <DropdownMenu slot="list">
                                <DropdownItem :name="item.id" v-if="Adjust.length>0" v-for="(item,index) in Adjust" :key="index" :selected="item.id == AdjustId ? true : false">{{item.text}}</DropdownItem>
                                <DropdownItem v-else>暂无付款方式</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </li>
                </ul>
            </div>
        </div>
        <div class="row_foot">
            <ul>
                <li>
                    <Button @click.native="invenTory(true)"><i class="iconfont icon-add"></i>增加库存</Button>
                </li>
                <li>
                    <Button @click.native="invenTory(false)"><i class="iconfont icon-minus"></i>减少库存</Button>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
import {wxget,wxpost} from '@/axios/ajax';
import {isLoading} from '@/assets/js/load.js';
import {getCookie} from '../../../assets/js/assist.js'
export default {
     name: 'adjustment',
        components: {
            
        },
        data() {
            return{
                goodsData:{},//商品对象
                nowActivityId:getCookie('ActivityId') ? getCookie('ActivityId') : null,//政策id
                goodsNo:'',//当前商品id
                InventoryNum:0,//库存数量
                InvenToryData:{},//当前库存对象
                Adjust:'',
                AdjustText:'--请选择--',
                AdjustId:''
            }
        },
        methods:{
            load(bool){//加载商品
                let that = this;
                wxget('User/GetGoodsByActivityGoodsNo_Union/'+that.nowActivityId+'/'+that.goodsNo).then(res =>{
                    if(res.code == 200){
                        console.log(res);
                        that.goodsData = res.data;
                    }else{
                        that.$Message.error(res.messahe);
                    }
                }).catch(res =>{
                    console.log(res);
                })
                
            },
            loadInvenTory(goodsNo){
                let that = this;
                wxget('User/GetAgentStoreByGoodsNo/'+goodsNo).then(res =>{
                    console.log(res);
                    if(res.code == 200){
                        that.InvenToryData = res.data;
                    }else{
                        that.$Message.error(res.messahe);
                    }
                }).catch(res =>{
                    console.log(res);
                })
            },
            handMin(){
                let that = this;
                if(that.InventoryNum == 0){
                    that.$Message.warning('库存不能小于0');
                    return false;
                }
                that.InventoryNum--;
            },    
            handMax(){
                let that = this;
                that.InventoryNum++;
            }, 
            handModel(num){
                let that = this;
                console.log(num);
                if(num == ''){
                    that.InventoryNum = 0
                }else if(num.indexOf('0') == 0){
                    that.InventoryNum = num.slice(1,num.length);
                }
            },       
            choose(name){//选择入库操作
                // console.log(name);
                let that = this;
                that.AdjustId = name;
                that.Adjust.map((item,key,arr) => {
                    if(item.id == name){
                        that.AdjustText = item.text;
                    }
                })
            },
            invenTory(bool){
                console.log(bool);
                let that = this;
                let rexg = /^[0-9]*[1-9][0-9]*$/;
                if(!that.InventoryNum){
                    that.$Message.warning('库存不能为空');
                    return false;
                }
                if(!rexg.test(that.InventoryNum)){
                    that.$Message.warning('库存只能填写数字');
                    return false;
                }
                if(that.AdjustText == '--请选择--'){
                    that.$Message.warning('请填写调整原因');
                    return false;
                }
                let param = {
                    GoodsNo:that.goodsNo,
                    Count:that.InventoryNum,
                    Remark:that.AdjustText
                }
                if(bool){
                    param.EditType = 1;
                }else{
                    param.EditType = 2;
                }
                isLoading(that,'数据更新中···');
                wxpost('User/SetAgentStore',param).then(res =>{
                    that.$Spin.hide();
                    if(res.code == 200){
                        that.$Message.success(res.message);
                        // 初始化
                        that.InventoryNum = 0;
                        that.AdjustText = '--请选择--';
                        that.AdjustId = '';
                        that.loadInvenTory(that.goodsNo);//刷新
                    }else{
                        that.$Message.error(res.message);
                    }
                }).catch(res =>{
                    console.log(res);
                })
            }
        },
        mounted(){
            let that = this;
            that.goodsNo = that.$route.params.id;
            that.Adjust = [
                {id:1,text:'初始化入库'},
                {id:2,text:'采购入库'},
                {id:3,text:'退货入库'},
                {id:4,text:'报损出库'},
                {id:5,text:'出库'},
                {id:6,text:'盘点'}
            ]
            that.load(true);//加载商品信息
            that.loadInvenTory(that.goodsNo);//加载库存
        }
}
</script>
<style lang="scss" scoped>
    #container{
        padding-bottom: 1.333rem;
        .row_title{
            padding:0.5333rem 0.4rem 0;//20px 15px;
            .ivu-row{
                .ivu-col-span-6{
                    img{
                        width:100%;
                        vertical-align:bottom;
                    }
                }
                .ivu-col-span-18{
                    padding:0.1333rem 0.2667rem;// 5px 10px;
                    .goods_title{
                        font-size:0.3733rem;//14px;
                        overflow: hidden;
                        -webkit-line-clamp: 2;
                        text-overflow: ellipsis;
                        display: -webkit-box;
                        -webkit-box-orient: vertical;
                        height: 1rem;  
                        color:#101010;
                    }
                    .goods_gauge{
                        font-size:0.32rem;//12px;
                        color:#727171;
                        span{
                            font-size:0.3733rem;//14px;
                            margin-left:0.1333rem;
                        }
                    }
                    .goods_inventory{
                        font-size:0.32rem;//12px;
                        color:#727171;
                        span{
                            color:#DF8D15;
                            margin-left:0.1333rem;
                        }
                    }
                }
            }
            .ivu-divider-horizontal{
                margin:0.4rem 0;//10px 0;
            }
        }
        .row_cont{
            padding:0 0.4rem;//0 15px;
            &>p{
                font-size:0.32rem;//12px;
                color:#727171;
                text-align:center;
            }
            &>.ivu-row{
                .ivu-col{
                    // text-align: center;
                    font-size: 0.4267rem;//16px;
                    margin:0.5333rem 0;// 20px 0;
                    color:#3E3A39;
                    span{
                        color:#DF8D15;
                        margin-left:0.1333rem;
                    }
                }
            }
            .ivu-divider-horizontal{
                margin:0.4rem 0;//15px 0;
            }
            &>.cont-foot{
                ul{
                    .carfix{
                        display: flex;
                        margin:0.4rem 0;// 15px 0;
                        &>span{
                            height: 0.6667rem;
                            line-height: 0.6667rem;
                            margin-right:0.2667rem;
                            font-size:0.3733rem;//14px;
                            color:#727171;
                        }
                        .operation{
                            flex:1;
                            button{
                                height: 0.6667rem;
                                width:0.6667rem;
                                line-height: 0.6667rem;
                                background:#fff;
                                outline: 0;
                                box-shadow: none;
                                border: 1px solid #009788;
                                box-sizing: border-box;
                                float:left;
                                color:#009788;
                            }
                            .fix_n{
                                float:left;
                                width:1.6rem;
                                height: 0.6667rem;
                                border-left: none; 
                                border-right: none; 
                                border-top: 1px solid #727171;
                                border-bottom:1px solid #727171;
                            }
                        }
                        .ivu-dropdown{
                            flex: 1;
                            height: 0.6667rem;
                            line-height: 0.6667rem;
                            .ivu-dropdown-rel{
                                a{
                                    width: 100%;
                                    display: inherit;
                                    color:#101010;
                                    font-size:0.3733rem;//14px
                                    text-align:right;
                                    background: #DCDDDD;
                                    padding:0 0.2667rem;// 0 10px;
                                    span{
                                        float:left;
                                    }
                                }
                            }
                            .ivu-dropdown-item-selected,.ivu-dropdown-item-selected:hover{
                                background:none;
                                color:#009788;
                            }
                        }
                    }
                }
            }
        }
        .row_foot{
            padding:0.5333rem 0.4rem 0;//20px 15px;
            ul{
                li{
                    margin:0.4rem 0;//15px 0
                    text-align:center;
                    &:nth-child(1){
                        button{
                            background:#009788;
                            border-color:#009788;
                            box-shadow:none;
                            outline:0;
                            color:#fff;
                            width:5.4667rem;//205px;
                            i{
                                margin-right:0.2667rem;//10px;
                            }
                        }
                    }
                    &:nth-child(2){
                        button{
                            // background:#009788;
                            border-color:#727171;
                            box-shadow:none;
                            outline:0;
                            color:#797979;
                            width:5.4667rem;//205px;
                            i{
                                margin-right:0.2667rem;//10px;
                            }
                        }
                    }
                }
            }
        }
    }
</style>
<style>
    .adjustment .ivu-input{
        height: 0.6667rem;
        line-height: 0.6667rem;
        border-radius:0;
        border-radius: 0;
        outline: 0;
        box-shadow: none;
        border:none;
        border-top:1px solid #727171;
        border-bottom:1px solid #727171;
        vertical-align: bottom;
    } 
    .adjustment .ivu-dropdown .ivu-select-dropdown {
        left: auto !important;
        right: 0.4rem;
        max-height: 4rem;
        overflow-y: scroll /* right:15px */;
    }
</style>

