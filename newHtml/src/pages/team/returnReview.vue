<template>
    <div id="container" class="returnReview">
        <div class="content">
            <div class="title">
                <Dropdown placement="bottom" trigger="click" @on-click="chooseType">
                    <a href="javascript:void(0)">
                        <span>{{selRow.typeText}}</span>
                        <Icon type="ios-arrow-down"></Icon>
                    </a>
                    <DropdownMenu slot="list">
                        <DropdownItem :name="item.id" v-for="(item,index) in typeData" :key="index" :selected="item.id == selRow.typeId ? true : false">{{item.text}}</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
                <Dropdown placement="bottom" trigger="click" @on-click="choosePlocy" v-if="selRow.typeId == 2">
                    <a href="javascript:void(0)">
                        <span>{{selRow.plocyText}}</span>
                        <Icon type="ios-arrow-down"></Icon>
                    </a>
                    <DropdownMenu slot="list">
                        <DropdownItem :name="item.F_Id" v-for="(item,index) in plocyData" :key="index" :selected="item.F_Id == selRow.plocyId ? true : false">{{item.Title}}</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>
            <div class="cont">
                <ul class="cont-title"> 
                    <li v-for="(item,index) in statusData" :key="index" :class="selRow.loadId == item.status ? 'active' : ''" @click="load(item.status,true)">{{item.text}}<Divider  v-if="selRow.loadId == item.status"/></li>
                    <Divider />
                </ul>
                <div class="cont-content">
                    <ul >
                        <li class="list" v-for="(item,index) in listData" :key="index" @click="goAudite(item.BankNo,item.UserId)">
                            <p><span>{{item.UserName}}</span><span>{{item.UserPhone}}</span><em>+{{item.ReChargePrice}}</em></p>
                            <p><span>{{['全部','待审核','已审核','已驳回'][item.VerifyStatus]}}</span></p>
                            <p><span>{{item.PayDate}}</span></p>
                            <p>来源:<span>{{item.ReChargeType}}</span></p>
                            <p>余额类型:{{['全部','余额','政策','邮费'][item.PriceType]}}</p>
                            <p v-if="item.PriceType == 2">政策名称:{{item.Title}}</p>
                            <Divider v-if="index != listData.length -1" />
                        </li>
                        <div class="list-foot" :class="listData.length == 0 ? 'no' : ''">
                            <div v-if="listData.length>0">
                                <p v-if="selRow.CurPage < Math.ceil(selRow.allTotal/selRow.PageSize)">下拉加载更多</p>
                                <p v-else>没有更多了</p>
                            </div>
                            <div v-else class="notData">
                                <p><img src="../../assets/images/noRecord.png" alt="" style="width:3rem;vertical-center:bottom;"></p>
                                <p>当前没有记录</p>
                            </div>
                        </div>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {wxget,wxpost} from '@/axios/ajax';
import {addCookie,getCookie,getCurrentDate,deleteCookie} from '@/assets/js/assist.js'
import {isLoading} from '@/assets/js/load.js'
export default {
    name: 'returnReview',
    data() {
        return{
            isSelf:'',
            typeData:[],
            
            plocyData:[],
    
            statusData:[],
            
            selRow:{
                typeText:'--请选择余额类型--',
                typeId:0,
                plocyText:'--请选择政策--',
                plocyId:0,
                PageSize:6,
                CurPage:1,
                allTotal:0,
                loadId:0
            },
            listData:[]
        }
    },
    components: {

    },
    methods:{
        handleScroll(){//页面滚动监听
            let that = this;
            let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
            let bodyHeight = document.documentElement.clientHeight;
            let scrollHeight = document.documentElement.scrollHeight;
            if(scrollTop + 5 > scrollHeight - bodyHeight){
                that.load(that.selRow.loadId,false);
            }
        },
        chooseType(name){//选择类型
            let that = this;
            that.selRow.typeId = name;
            that.typeData.map((item)=>{
                if(item.id == name){
                    that.selRow.typeText = item.text;
                }
            })
            if(that.selRow.typeId == 0){
                that.selRow.plocyText = '--请选择政策--';
                that.selRow.plocyId = 0;
                that.load(that.selRow.loadId,true);
            }else if(that.selRow.typeId == 2){
                that.plocyData = [];
                that.getPlocy();
            }else{
                that.load(that.selRow.loadId,true);
            }
        },
        getPlocy(){//拉取政策
            let that = this;
            wxget('User/GetActivityList_CZ').then(res =>{
                if(res.code == 200){
                    that.plocyData = res.data;
                    that.plocyData.unshift({
                        F_Id:0,
                        Title:'--请选择政策--'
                    });
                }else{
                    that.$Message.error(res.message);
                }
            })
        },
        choosePlocy(name){//选择政策
            let that = this;
            that.selRow.plocyId = name;
            that.plocyData.map((item)=>{
                if(item.F_Id == name){
                    that.selRow.plocyText = item.Title;
                }
            })
            that.load(that.selRow.loadId,true);
        },
        load(id,bool){//加载数据
            let that = this;
            that.selRow.loadId = id;
            if(bool){
                that.listData = [];
                that.selRow.PageSize = 6;
                that.selRow.CurPage = 1;
                isLoading(that,'加载中···');
            }else{
                if(that.selRow.CurPage >= Math.ceil(that.selRow.allTotal/that.selRow.PageSize)){
                    return false;
                }else{
                    that.selRow.CurPage++;
                } 
            }
            let url = '';

            if(that.isSelf == 1){
                url = 'User/GetApplyBalance/';
            }else{
                url = 'User/GetRefereeApplyBalance/'; 
            }
            wxget(url+that.selRow.PageSize+'/'+that.selRow.CurPage+'/'+that.selRow.typeId+'/'+that.selRow.plocyId+'/'+that.selRow.loadId).then(res =>{
                that.$Spin.hide();
                if(res.code == 200){
                    that.listData.push(...res.data);
                    that.selRow.allTotal = res.total;
                }else{
                    that.$Message.error(res.message);
                }
            })
            
        },
        goAudite(BankNo,UserId){//跳转到审核
            let that = this;
            if(that.isSelf == 0){
                that.$router.push({name:'reviewAudite',query: {BankNo:BankNo,UserId:UserId}});//跳转
            }else{
                that.$router.push({name:'reviewAudite',query: {BankNo:BankNo,UserId:''}});//跳转
            }
            
        }
    },
    mounted(){
        let that = this;
        that.isSelf = that.$route.params.id;
        if(that.isSelf == 0){
            window.document.title = '回款审核';
        }else{
            window.document.title = '充值记录';
        }
        that.typeData = [{id:0,text:'--请选择余额类型--'},{id:2,text:'政策'},{id:3,text:'邮费'}];
        that.statusData = [{status:0,text:'全部'},{status:1,text:'待审核'},{status:2,text:'已审核'},{status:3,text:'已驳回'}];
        window.addEventListener('scroll', that.handleScroll);//添加滚动监听事件
        that.load(that.selRow.loadId,true);
    }
}
</script>
<style lang="scss" scoped>
    #container{
        padding-bottom: 1.333rem;
        .content{
            padding:0.5333rem 0.4rem 0;//20px 15px 0;
            .title{
                .ivu-dropdown{
                    width:100%;
                    position: relative;
                    margin-bottom:0.1333rem;//5px
                    .ivu-dropdown-rel{
                        a{
                            color: #101010;
                            text-align: right;
                            display: inherit;
                            font-size:0.3733rem;//14px
                            padding:0.1333rem 0.2667rem;//5px 10px
                            background: #ECEAEA;
                            span{
                                float:left;
                            }
                        }
                    }
                }
            }
            .cont{
                .cont-title{
                    display:flex;
                    justify-content:space-between;
                    position: relative;
                    li{
                        font-size:0.3733rem;//14px
                        padding:0.1333rem 0.2667rem;// 5px 10px;
                        position: relative;
                        &.active{
                            color:#DF8D15;
                        }
                        .ivu-divider-horizontal{
                            position: absolute;
                            bottom:0;
                            top:auto !important;
                            left: 0;
                            margin:0;
                            z-index: 999;
                            height: 2px;
                            background:#DF8D15;
                        }
                    }
                    &>.ivu-divider-horizontal{
                        position: absolute;
                        bottom:0;
                        top:auto !important;
                        margin:0;
                    }
                }
                .cont-content{
                    &>ul{
                        position: relative;
                        &>li{
                            padding:0.2667rem 0;// 10px 0;
                            position: relative;
                            p{
                                color:#B5B5B6;
                                font-size:0.32rem;//12px
                                &:nth-child(1){
                                    font-size:0.3733rem;//14px
                                    color:#3E3A39;
                                    span{
                                        margin-right:0.1333rem;
                                    }
                                    em{
                                        float:right;
                                        color:#009788;
                                    }
                                }
                                &:nth-child(2){
                                    color:#DF8D15;
                                    text-align:right;
                                }
                                &:nth-child(3){
                                    color:#727171;
                                }
                                
                            }
                            &>.ivu-divider-horizontal{
                                position: absolute;
                                bottom:0;
                                top:auto !important;
                                left: 0;
                                margin:0;
                                z-index: 999;
                                background:#BBBBBB;
                            }
                        }
                        &>.list-foot{
                            &.no{
                                position: absolute;
                                height: 14rem;
                            }
                            p{
                                text-align:center;
                                margin-bottom:0.2667rem;//10px;
                            }
                            .notData{
                                text-align: center;
                                margin-top:0.2667rem;//10px;
                            }
                        }
                    }
                }
            }
        }
    }
</style>