<template>
    <div id="container" class="car">
        <div class="content">
            <ul>
                <li v-for="(item,index) in carList" :key="index">
                    <Row class="r_fix">
                        <Col span="2">
                            <i class="iconfont" :class="item.isCheck ? 'icon-xuanzhong' : 'icon-weixuanzhong'" @click="getCheck(index)"></i>
                        </Col>
                        <Col span="22">
                            <Row @click.native="goDetails(item.GoodsNo)">
                                <Col span="6">
                                    <img v-lazy="imgUrl+item.GoodsPicUrl" :key="item.GoodsPicUrl" alt="" />
                                </Col>
                                <Col span="18">
                                    <p>{{item.GoodsTitle}}</p>
                                    <p><span>规格:<em>{{item.SepcName}}</em></span><span style="margin-left:0.2667rem;">箱规:<em>{{item.UnitNumber}}/{{item.Unit}}</em></span></p>
                                    <p class="price"><em >￥{{item.Price}}</em>×{{item.BuyCount}}</p>
                                </Col>
                                <!-- <p class="num">小计:{{item.Price*item.BuyCount}}</p> -->
                            </Row>
                            <p class="num">
                                <span>
                                    <!-- <em class="iconfont icon-add"></em><input type="text" onkeyup="this.value=this.value.replace(/\D/g,'')" onafterpaste="this.value=this.value.replace(/\D/g,'')" v-model="item.BuyCount" v-on:input="hand(index)"><em class="iconfont icon-minus"></em>        -->
                                    <i class="count_cut iconfont icon-minus" @click="handCount(item.GoodsNo,false,index)"></i>
                                    <input type="text" onkeyup="this.value=this.value.replace(/\D/g,'')" onafterpaste="this.value=this.value.replace(/\D/g,'')" v-model="item.BuyCount" v-on:input="hand(item.GoodsNo,index)">
                                    <i class="count_add iconfont icon-add" @click="handCount(item.GoodsNo,true,index)"></i>
                                </span>
                                <button @click="delItem(item.GoodsNo,index)" v-if="item.isCheck">删除</button>
                            </p>
                        </Col>
                    </Row>
                    
                    <Divider />
                </li>
                <div class="list-foot" :class="carList.length == 0 ? 'no' :''">
                    <div v-if="carList.length>0">
                        <p >没有更多了</p>
                    </div>
                    <div v-else class="notData">
                        <p><img src="../../assets/images/noCar.png" alt="" style="width:3rem;vertical-center:bottom;"></p>
                        <p>当前没有商品</p>
                    </div>
                </div>
            </ul>
        </div>
        <div class="foot-nav-containner" v-if="!isFoot">
            <ul class="bottom-nav">
                <li class="bottom-nav__li ">
                        <router-link to='' class="bottom-nav__li" @click.native="getAll">
                            <i class="iconfont" :class="isCheck ? 'icon-xuanzhong' : 'icon-weixuanzhong'"></i>
                            <span>全选</span>
                        </router-link>
                </li>
                <li class="bottom-nav__li ">
                    <span>数量：<i>{{allNum}}件</i></span>
                    <span>金额：<i>¥{{allPrice}}</i></span>
                    <button type="button" :style="isSet ? 'visibility:visible' : 'visibility:hidden'" @click="setOrder">下单</button>
                    <button :style="isCheck ? 'visibility:visible' : 'visibility:hidden'" type="button"  @click="delOrder">删除</button>
                </li> 
            </ul>
        </div>
    </div>
</template>
<script>
import {post,wxpost,wxget} from '@/axios/ajax';
import {getCookie,} from '@/assets/js/assist.js'
import {isLoading} from '@/assets/js/load.js'
export default {
    name: 'car',
    data() {
        return{
            carList:[],//购物车列表
            activeId:getCookie('ActivityId') ? getCookie('ActivityId') : '',//政策id
            activeTitle:getCookie('ActivityTitle') ? getCookie('ActivityTitle') : '',//政策id
            isCheck:false,//是否全选
            isSet:false,//是否显示单选
            isFoot:false,//是否显示底部
            allNum:0,
            allPrice:0,
            allIds:[]
        }
    },
    components: {

    },
    methods:{   
        load(){//加载购物车里商品
            let that = this;
            wxget('User/GetShopCartList/'+that.activeId).then(res =>{
                if(res.code == 200){
                    console.log(res);
                    that.carList = res.data;

                    //默认全部未选择
                    that.carList.map((item)=>{
                        item['isCheck'] = false;
                    })
                    that.isCheck = false;
                    that.isSet = false;
                    that.allNum = 0;
                    that.allPrice = 0;
                }else{
                    that.$Message.error(res.details);
                }
            })
        },
        updateCount(no,num,index){//更新购物车数量
            let that = this;
            let carParam = {
                GoodsNo:no,
                BuyCount:num,
                ActivityId:that.activeId,
                ActivityTitle:that.activeTitle
            }
            wxpost('User/SetAddShopCart',carParam).then(res =>{
                that.$Spin.hide();
                if(res.code == 200){
                    console.log('购物车数量更新了···');
                    if(num == 0){
                        that.carList.splice(index,1);
                        that.$Modal.remove();
                    }
                    that.sumCount(false);
                }else{
                    that.$Message.error(res.details);
                }
            })
        },
        goDetails(no){
            let that = this;
            that.$router.push({name:'details', params: { id: no }})//跳转
        },
        setOrder(){//下单
            let that = this;
            let ids = that.allIds.join(",");//获取所有商品id
            that.$router.push({name:'waitOrder',params: { ids:ids }});
        },
        delOrder(){//删除所有
            let that = this;
            that.$Modal.confirm({
                scrollable:false,
                render: (h) => {
                    return h('div',{class:'model-cont'},[
                        h('div',{class:'model-title','style':{textAlign:'right',marginBottom:'0.2667rem'}},[
                            h('span',
                                {style:{color:'#DF8D15',fontSize:'0.3733rem',background:'#F8F8F8',float:'left'}}, '系统提醒！'),
                            h('i',{class:'iconfont icon-close-btn',on: {click: () => {that.$Modal.remove();}}
                            })
                        ]),
                        h('div',{class:'model-content'},[
                            h('p', {'style':{fontSize:'0.3733rem'}},'您确定删除此所有商品吗？')
                        ]),
                        h('div',{class:'model-foot','style':{textAlign:'right',marginTop:'0.2667rem'}},[
                            h('Button', {'style':{boxShadow:'none',borderColor:'#dcdee2',marginRight:'0.1333rem'},on: {click:()=>{that.$Modal.remove();}}},'取消'),
                            h('Button', {'style':{boxShadow:'none',background: '#009788',borderColor:'#009788'},props: {type: 'primary'},on: {click:()=>{
                                // isLoading(that,'删除中···');
                                let ids = that.allIds.join(",");//获取所有商品id
                                console.log(ids);
                                let delParam = {
                                    Ids:ids,
                                    BuyCount:0,
                                    ActivityId:that.activeId,
                                }
                                wxpost('User/SetDeleteShopCart',delParam).then(res =>{
                                    if(res.code == 200){
                                        that.$Message.success(res.details);
                                        that.carList = [];
                                        that.sumCount(true);
                                    }else{
                                        that.$Message.error(res.details);
                                    }
                                })
                                that.$Modal.remove();
                            } }},'确定')
                        ])
                    ]
                    )
                } 
            })

        },
        delItem(no,index){//删除单个
            let that = this;
            that.$Modal.confirm({
                scrollable:false,
                render: (h) => {
                    return h('div',{class:'model-cont'},[
                        h('div',{class:'model-title','style':{textAlign:'right',marginBottom:'0.2667rem'}},[
                            h('span',
                                {style:{color:'#DF8D15',fontSize:'0.3733rem',background:'#F8F8F8',float:'left'}}, '系统提醒！'),
                            h('i',{class:'iconfont icon-close-btn',on: {click: () => {that.$Modal.remove();}}
                            })
                        ]),
                        h('div',{class:'model-content'},[
                            h('p', {'style':{fontSize:'0.3733rem'}},'您确定删除此商品吗？')
                        ]),
                        h('div',{class:'model-foot','style':{textAlign:'right',marginTop:'0.2667rem'}},[
                            h('Button', {'style':{boxShadow:'none',borderColor:'#dcdee2',marginRight:'0.1333rem'},on: {click:()=>{that.$Modal.remove();}}},'取消'),
                            h('Button', {'style':{boxShadow:'none',background: '#009788',borderColor:'#009788'},props: {type: 'primary'},on: {click:()=>{
                                isLoading(that,'删除商品中···')
                                that.updateCount(no,0,index);
                            } }},'确定')
                        ])
                    ]

                    )
                } 
            })
        },
        handCount(num,bool,index){//加减数量
            let that = this;
            let count = that.carList[index].BuyCount;
            if(bool){
                count++;
            }else{
                if(!bool && count == 1){
                    this.$Message.error('数量不能小于1');
                    return false;
                }
                count--;
            }
            let nowObj = {};
            for(let i in that.carList[index]){
                nowObj[i] = that.carList[index][i];
            }
            nowObj.BuyCount = count;
            that.$set(that.carList,index,nowObj);
           that.hand(num,index);//更新购物车
            // 更新购物车数量
        },
        hand(num,index){
            let that = this;
            let param = {
                ActivityTitle:that.nowBrand,
                ActivityId:that.nowBrandId,
                GoodsNo:num,
            };
            let nowObj = {...that.carList[index]};
            if(that.carList[index].BuyCount == null || that.carList[index].BuyCount == ''){
                nowObj.BuyCount = 1;
                that.$set(that.carList,index,nowObj);
            }

            that.updateCount(num,nowObj.BuyCount,index);
        },
        sumCount(bool){//计算数量
            let that = this;
            that.allNum = 0;
            that.allPrice = 0;
            that.allIds = [];

            let maxNum = 0;

            if(bool){//当点击全选按钮时
                that.isCheck = !that.isCheck;
            }

            if(that.carList.length == 0){
                that.isFoot = true;
                return false;
            }

            that.carList.map((item,index,arr) =>{
                if(bool){//当点击全选按钮时
                    item.isCheck = that.isCheck;
                }
                if(item.isCheck){
                    that.allNum += parseInt(item.BuyCount);
                    that.allPrice += item.BuyCount*item.Price;
                    that.allIds.push(item.Id);
                    maxNum += 1;
                }
            })
            if(maxNum > 0){//是否显示下单---
                that.isSet = true;
            }else{
                that.isSet = false;
            }
            if(maxNum == that.carList.length){//是否显示删除--全部删除
                that.isCheck = true;
            }else{
                that.isCheck = false;
            }
        },
        getCheck(num){//选择商品
            let that = this;
            let nowObj = that.carList[num];
            nowObj.isCheck = !nowObj.isCheck;
            that.$set(that.carList,num,nowObj);
            that.sumCount(false);
        },
        getAll(){//全选
            let that = this;
            that.sumCount(true);
        }
    },
    mounted(){
        let that = this;
        that.load();
    }
}
</script>
<style lang="scss" scoped>
    #container{
        padding-bottom: 2.4rem;
        .content{
            padding:0.5333rem 0.4rem 0;//20px 15px 0;
            ul{
                li{
                    .r_fix{
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
                        .ivu-row{
                            .ivu-col{
                                &:nth-child(2){
                                    padding:0 0 0 0.2667rem;// 5px 10px
                                    // display:flex;
                                    // flex-direction:column;
                                    // align-items:left;
                                    // justify-content:center;
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
                                        em{
                                            color:#ad7a2b;
                                        }
                                    }
                                }
                            }
                        }
                        &>.ivu-col-span-22{
                            &>p{
                                span{
                                    overflow: hidden;
                                    float:right;
                                    i{
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
                                        float: left;
                                        line-height: 1;
                                        box-sizing: border-box;
                                        font-size:0.3733rem;
                                    }
                                    input{
                                        float: left;
                                        width:1rem;
                                        height: 0.533rem;
                                        padding: 0;
                                        border-radius: 0;
                                        border:1px solid #9C9C9C;
                                        border-left: none;
                                        border-right: none;
                                        text-align: center;
                                    }
                                }
                                button{
                                    background: #fff;
                                    border: none;
                                    float: left;
                                }
                            }
                        }
                    }

                    .ivu-divider-horizontal{
                        margin:0.2667rem 0;
                    }
                }
                .list-foot{
                    p{
                        text-align:center;
                        margin-bottom:0.2667rem;//10px;
                    }
                    .notData{
                        text-align: center;
                    }
                }
            }
        }
        .foot-nav-containner{
            position: fixed;
            bottom:1.3333rem;
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
                        flex:1;
                        a{
                            height: 1.0667rem;
                            line-height: 1.0667rem;
                            display: inline-block;
                            padding: 0 0.4rem;
                            position:relative;
                            i{
                                font-size:0.5333rem;
                                color:#009788;
                            }
                            span{
                                vertical-align: top;
                                font-size:0.3733rem;// 14px;
                                color: #ad7a2b;
                            }
                        }
                    }
                    &:nth-child(2){
                        flex:3;
                        text-align: right;
                        white-space: nowrap;
                        span{
                            color: #101010;
                            // float:right;
                            margin-right: 0.2667rem;//10px 
                            i{
                                // margin-left: 0.2667rem;//10px 
                                color: #DF8D15;
                            }
                        }
                        button{
                            background:#009788;
                            height: 1.0667rem;
                            line-height: 1.0667rem;
                            color:#fff;
                            width: 1.5rem;
                            outline: 0;
                            border: none;
                            box-shadow:none;
                            // float:right;
                            &:nth-child(4){
                                background: #fff;
                                color: #9C9C9C;
                                border: none;
                            }
                        }
                        
                    }
                }
            }
        }
    }
</style>