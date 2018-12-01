<template>
    <div id="container" class="balanceDetails">
        <Row class="header" @click.native="goInfo">
            <Col span="6" class="header-l">
                    <img  v-lazy="userInfo.UserImg" :key="userInfo.UserImg" :alt="''" />
            </Col>
            <Col span="16" class="header-c">
                    <p class="header-c-name">{{userInfo.UserName}}</p>
                    <p class="header-c-tell">{{userInfo.UserPhone}}</p>
                    <p class="header-c-level">{{userInfo.SellerName}}&nbsp;·&nbsp;{{userInfo.AgentLevelName}}</p>
            </Col>
            <Col span="2" class="header-r">
                    <router-link to='' >
                        <i class="iconfont icon-check"></i>
                    </router-link>
            </Col>
        </Row>
        <Row class="header-foot">
            <Col span="24" class="header-foot-money">
                <router-link to='' >
                    <p v-if="ErpCount>0">三草总余额:¥{{ErpCount}}</p>
                    <p v-if="Balance>0">总余额:¥{{Balance}}</p>
                </router-link>
            </Col>
        </Row> 
        <Card class="content" >
            <CellGroup>
                <Cell v-if="balanceData.length>0 ">
                    <div class="car-cont">
                        <ul class="car-cont-cont">
                            <li class="cont-list" v-for="(item,index) in balanceData" :key="index">
                                <span>{{item.Title}}</span><i>：</i><span>¥{{item.Balance}}</span>
                            </li>
                        </ul>
                    </div>
                </cell>
                <Cell v-if="courierData.length>0 ">
                    <div class="car-cont">
                        <ul class="car-cont-cont">
                            <li class="cont-list" v-for="(item,index) in courierData" :key="index">
                                <span>{{item.Title}}</span><i>：</i><span>¥{{item.Balance}}</span>
                            </li>
                        </ul>
                    </div>
                </cell>
                <Cell v-if="policyData.length>0 ">
                    <div class="car-cont">
                        <p class="car-cont-top"><span>政策列表<em>（{{policyData.length}}）</em></span></p>
                        <ul class="car-cont-cont">
                            <li class="cont-list policy-list" v-for="(item,index) in policyData" :key="index">
                                <span>政策名称：{{item.Title}}</span><span >剩余金额：{{item.Balance}}</span>
                            </li>
                        </ul>
                    </div>
                </cell>
            </CellGroup>
        </Card>
    </div>
</template>
<script>
import {wxget,wxpost} from '@/axios/ajax';
// import {addCookie,getCookie,getCurrentDate,deleteCookie} from '@/assets/js/assist.js'
import {isLoading} from '@/assets/js/load.js'
export default {
    name: 'balanceDetails',
    data() {
        return{
            userInfo:{},
            ErpCount:0,
            Balance:0,
            balanceData:[],
            policyData:[],
            courierData:[]
        }
    },
    components: {

    },
    methods:{
        getUserInfo(){//个人信息
            let that = this;
            wxget('User/GetUserInfo').then(res =>{
                if(res.code = 200){  
                    that.userInfo = res.data;
                    if(that.userInfo.AgentLevel < 3){
                        that.ErpCount = res.map ? parseFloat(res.map).toFixed(2) : 0;
                    }else{
                        that.ErpCount = res.count ? parseFloat(res.count).toFixed(2) : 0;
                        that.Balance = res.map ? parseFloat(res.map).toFixed(2) : 0;
                    }
                }else{
                    this.$Message.error(res.details);
                }
            })
        },
        getBalanceList(){//余额详情
            let that = this;
            wxget('User/GetUserBalance').then(res =>{
                if(res.code = 200){  
                    console.log(res);
                    let data = res.data;
                    data.map((item) =>{
                        if(item.PriceType == 1){
                            that.balanceData.push(item)
                        }else if(item.PriceType == 2){
                            that.policyData.push(item);
                        }else{
                            that.courierData.push(item);
                        }
                    })
                }else{
                    this.$Message.error(res.details);
                }
            })
        },
        goInfo(){
            this.$router.push({name:'info'});
        }
    },
    mounted(){
        let that = this;
        that.getUserInfo();
        that.getBalanceList();
    }
}
</script>
<style lang="scss" scoped>
    #container{
        padding-bottom: 1.333rem;
        .header{
            padding: 0 0.4rem;//0 15px
            // background: #009788;
            background:url('../../assets/images/bg3.png') no-repeat 0 0;
            background-size:contain;
            height: 3.2rem;//120px
            .header-l{
                height: 100%;
                display:flex;
                flex-direction:column;
                align-items:center;
                justify-content:center;
                img{
                    width:100%;
                    border-radius:50%;
                    max-height: 2.3rem;
                }
            }
            .header-c{
                height: 100%;
                display:flex;
                flex-direction:column;
                align-items:left;
                justify-content:center;
                color:#fff;
                padding-left:0.6667rem;
                .header-c-name{
                    font-size:0.4267rem;//16px
                }
                .header-c-tell{
                    font-size:0.32rem;//12px
                }
                .header-c-level{
                    font-size:0.32rem;//12px
                }
            }
            .header-r{
                height: 100%;
                display:flex;
                flex-direction:column;
                align-items:center;
                justify-content:center;
                a{
                    color: #fff;
                    font-size: 0.5333rem;//20px;
                    &:hover{
                        color:#fff;
                        text-decoration:none;
                    }
                }
            }
        }
        .header-foot{
            height:1.7333rem;//65px
            display:flex;
            flex-direction:column;
            align-items:center;
            justify-content:center;
            border-bottom: 1px solid #E5E5E5;
            margin: 0 0.4rem;
            .header-foot-money{
                text-align:center;
                a{
                    color:#666666;
                    display: inherit;
                    &:hover{
                        color:#666666;
                        text-decoration:none;
                    }
                    p{
                        font-size:0.4267rem;//16px;
                    }
                }
            }
            .header-foot-person{
                text-align:center;
                a{
                    color:#666666;
                    &:hover{
                        color:#666666;
                        text-decoration:none;
                    }
                }
            }
        }
        .content{
            border:none;
            padding: 0 0.4rem;//0 15px
            .cont-list{
                color:#101010;
                font-size:0.3733rem;
                &.policy-list{
                    overflow: hidden;
                    span{
                        float:left;
                        width:50%;
                    }
                }
            }
        }
    }
</style>
<style>
    .balanceDetails .ivu-card-body{
        padding:0;
    }
    .balanceDetails .ivu-cell{
        padding-left:0;
        padding-right:0;
    }
    .balanceDetails .ivu-cell:not(:last-of-type){
        border-bottom:1px solid #ddd;
    }
    .balanceDetails .ivu-cell-main{
        width:100%;
    }
</style>
