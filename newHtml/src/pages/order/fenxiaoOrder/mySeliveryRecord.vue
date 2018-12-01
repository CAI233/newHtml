<template>
    <div id="container" class="mySeliveryRecord">
        <div class="content">
            <div class="title">
                <div class="t_search">
                    <i-input type="text" v-model="selRow.searchText" placeholder="输入收货人">
                        <i class="iconfont icon-seach" slot="prefix"  @click="search()"></i>
                    </i-input>
                </div>
                <div class="t_select">
                    <Dropdown trigger="click" @on-click="chooseDealer" >
                        <a href="javascript:void(0)">
                            <span>{{selRow.ReciverUserText}}</span>    
                            <Icon type="ios-arrow-down"></Icon>
                        </a>
                        <DropdownMenu slot="list">
                            <DropdownItem :name="item.F_Id" v-if="dealerData.length>0" v-for="(item,index) in dealerData" :key="index" :selected="item.F_Id == selRow.ReciverUserId ? true : false">{{item.RealName+(item.WeChat ? '('+item.WeChat+')' :'')}}</DropdownItem>
                            <DropdownItem v-else>暂无经销商</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>
                <div class="t_choose">
                    <i class="clear iconfont icon-close-btn" v-show="date" @click="clear"></i>
                    <input v-model="date" placeholder="请选择查询时间"  readonly />
                    <router-link to='' @click.native="beginCheck">
                        <template >开始时间</template>
                    </router-link>
                    <router-link to='' @click.native="endCheck">
                        <template >结束时间</template>
                    </router-link>
                </div>
            </div>
            <div class="cont">
                <ul>
                    <li class="list" v-for="(item,index) in recordData" :key="index">
                        <div class="list-cont">
                            <p><span>收货人:</span>{{item.TargetUserName}}<span class="lis-error" v-if="item.IsPass7Day == 1">超7天未收货</span><span class="lis-success" v-if="item.IsReceived == 1">已收货</span></p>
                            <p><span>收货人手机:</span>{{item.TargetUserMobile}}</p>
                            <p><span v-if="item.GoodsCode">商品码:<i>{{item.GoodsCode}}</i></span><span v-if="item.MidBoxCode">中箱码:<i>{{item.MidBoxCode}}</i></span><span v-if="item.BigBoxCode">大箱码:<i>{{item.BigBoxCode}}</i></span></p>
                            <p><span>扫码时间:</span>{{item.ScanTime}}</p>
                        </div>
                        <Divider v-if="index != recordData.length-1" class="down-line"/>
                    </li>
                    <div class="list-foot" :class="recordData.length == 0 ? 'no' :''">
                        <div v-if="recordData.length>0">
                            <p v-if="selRow.CurPage < Math.ceil(selRow.allTotal/selRow.PageSize)">下拉加载更多</p>
                            <p v-else>没有更多了</p>
                        </div>
                        <div v-else class="notData">
                            <p><img src="../../../assets/images/noRecord.png" alt="" style="width:3rem;vertical-center:bottom;"></p>
                            <p>当前没有记录</p>
                        </div>
                    </div>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
import {post,wxpost,wxget} from '@/axios/ajax';
// import {addCookie,getCookie,getCurrentDate,deleteCookie} from '@/assets/js/assist.js'
import {isLoading} from '@/assets/js/load.js'
export default {
    name: 'mySeliveryRecord',
    data() {
        return{
            selRow:{
                searchText:'',
                ReciverUserText:'请选择经销商',
                ReciverUserId:null,
                PageSize:6,
                CurPage:1,
                StartDate:'',
                EndDate:'',
                allTotal:0,
            },
            dealerData:[],
            date:'',
            recordData:[]
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
                that.load(false);
            }
        },
        getDealer(){//加载经销商
            let that = this;
            wxget('User/GetAllUserRefereeById').then(res =>{
                if(res.code == 200){
                    that.dealerData = res.data;
                    that.dealerData.unshift({
                        F_Id:null,
                        RealName:'请选择经销商',
                        WeChat:''
                    })
                }else{
                    that.$Message.warning(res.message);
                }
            })
        },
        load(bool){
            let that = this;
            if(bool){
                that.recordData = [];
                that.selRow.PageSize = 6;
                that.selRow.CurPage = 1;
                isLoading(that,'发货记录加载中···');
            }else{
                if(that.selRow.CurPage >= Math.ceil(that.selRow.allTotal/that.selRow.PageSize)){
                    return false;
                }else{
                    that.selRow.CurPage++;
                } 
            }
            wxpost('Sale/GetMyTeamReceiverScanCode',that.selRow).then(res =>{
                that.$Spin.hide();
                if(res.code == 200){
                    // console.log(res);
                    that.recordData.push(...res.data);
                    that.selRow.allTotal = res.total;
                }else{
                    that.$Message.error(res.message);
                }
            })
        },
        search(){//查询收货人
            let that = this;
            if(!that.selRow.searchText || that.selRow.searchText){
                that.$Message.warning('请输入收货人信息！');
                return false;
            }
            wxget('User/GetAllUserRefereeByIdAndKeyWord/'+that.selRow.searchText).then(res =>{
                if(res.code == 200){

                }else{
                    that.$Message.error(res.message);
                }
            })
        },
        chooseDealer(name){//选择经销商
            let that = this;
            that.selRow.ReciverUserId = name;
            that.dealerData.map((item,key,arr) =>{
                if(item.F_Id == name){
                    that.selRow.ReciverUserText = item.RealName+ (item.WeChat ? '('+item.WeChat+')' :'');
                }
            })
            that.load(true);
        },
        beginCheck(){//选择开始时间
            let that = this;
            that.$picker.show({
                type:'datePicker',
                onOk: (date) =>{
                    that.selRow.StartDate = date;
                    if(that.selRow.EndDate){
                        if(Date.parse(that.selRow.StartDate) > Date.parse(that.selRow.EndDate)){
                            that.$Message.warning('开始时间不能大于结束时间');
                            return false;
                        }
                        that.date = that.selRow.StartDate+'至'+that.selRow.EndDate;
                        that.load(true);
                    }else{
                        that.date = that.selRow.StartDate;
                        that.load(true);
                    }
                    
                }
            });
        },
        endCheck(){//选择结束时间
            let that = this;
            that.$picker.show({
                type:'datePicker',
                startTime:that.selRow.StartDate,  //开始时间
                onOk:(e)=>{
                    that.selRow.EndDate = e;
                    if(that.selRow.StartDate){
                        that.date = that.selRow.StartDate+'至'+that.selRow.EndDate;
                        that.load(true);
                    }else{
                        that.date = that.selRow.EndDate;
                        that.load(true);
                    }
                },

            })
        },
        clear(){//清除操作
            let that = this;
            that.selRow.StartDate = '';
            that.selRow.EndDate = '';
            that.date = '';
            that.load(true);
        }
    },
    mounted(){
        let that = this;
        window.addEventListener('scroll', that.handleScroll);//添加滚动监听事件
        that.getDealer();
        that.load(true);
    }
}
</script>
<style lang="scss" scoped>
    #container{
        padding-bottom: 1.333rem;
        .content{
            padding:0.5333rem 0.4rem 0;//20px 15px 0;
            .title{
                .t_select{
                    margin:0.2667rem 0;//15px 0
                    .ivu-dropdown{
                        width:100%;
                        height:0.8533rem;
                        line-height:0.8533rem;
                        background:#DCDDDD;
                        position: relative;
                        .ivu-dropdown-rel{
                            a{
                                display: inherit;
                                text-align:right;
                                color:#101010;
                                padding:0 0.2667rem;
                                span{
                                    float:left;
                                    font-size:0.3733rem;
                                }
                            }
                        }
                    }
                }
                .t_choose{
                    overflow: hidden;
                    margin-top:0.2667rem;
                    position: relative;
                    .clear{
                        position: absolute;
                        width: 0.5rem;
                        height: 0.5rem;
                        line-height: 0.5rem;
                        font-size: 0.32rem;
                        text-align: center;
                        color: #808695;
                        background: #fff;
                        border-radius: 50%;
                        top: 0.15rem;
                        left: -moz-calc(100% - 4.76rem);
                        left: -webkit-calc(100% - 4.76rem);
                        left:calc(100% - 4.76rem);
                    }
                    input{
                        height:0.8533rem;
                        line-height:0.8533rem;
                        padding: 0 0.1rem;
                        float: left;
                        border: none;
                        background: #DCDDDD;
                        box-shadow: none;
                        border-radius:0;
                        outline: 0;
                        width: -moz-calc(100% - 4.16rem);
                        width: -webkit-calc(100% - 4.16rem);
                        width: calc(100% - 4.16rem);
                    }
                    a{
                        float:left;
                        width:2.08rem;
                        background:#009788;
                        color:#fff;
                        height:0.8533rem;
                        line-height:0.8533rem;
                        box-sizing: border-box;
                        text-align:center;
                        display: inherit;
                    }
                    a:nth-child(3){
                        background:none;
                        color:#727171;
                        border:1px solid #009788;
                    }
                }
            }
            .cont{
                margin-top:0.4rem;//15px
                &>ul{
                    position: relative;
                    &>.list{
                        &>.list-cont{
                            &>p{
                                font-size:0.3733rem;//14px
                                &:nth-child(1){
                                    span{
                                        &:nth-child(1){
                                            font-weight:bold;
                                        }
                                        &.lis-error{
                                            background:#ff9900;
                                            color:#fff;
                                            padding:0 0.1333rem;
                                            float:right;
                                        }
                                        &.lis-success{
                                            background:#009788;
                                            color:#fff;
                                            padding:0 0.1333rem;
                                            float:right;
                                        }
                                    }
                                }
                                &:nth-child(2){
                                    span{
                                        font-weight:bold;
                                    }
                                }
                                &:nth-child(3){
                                    span{
                                        font-weight:bold;
                                        margin-right:0.2667rem;
                                        i{
                                            font-weight: normal;
                                        }
                                    }
                                }
                                &:nth-child(4){
                                    span{
                                        font-weight:bold;
                                    }
                                }
                            }
                        }
                        &>.down-line{
                            margin:0.2667rem 0;
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
</style>
<style>
    .mySeliveryRecord .ivu-input{
        background:#DCDDDD;
        outline:0;
        color:#101010;
        box-shadow:none;
        border:none;
    }
    .mySeliveryRecord .ivu-input:hover,.ivu-input:focus{
        outline:0;
        box-shadow:none;
        border:none;
    }
    .mySeliveryRecord input::-webkit-input-placeholder{
        color:#101010;
    }

    .mySeliveryRecord input:-moz-placeholder{
        color:#101010;
    }

    .mySeliveryRecord input::-moz-placeholder{
        color:#101010;
    }
    .mySeliveryRecord input:-ms-input-placeholder{
        color:#101010;
    }
    .mySeliveryRecord .ivu-dropdown-item-selected,.mySeliveryRecord .ivu-dropdown-item-selected:hover{
        color:#009788;
        background:none;
    }
</style>
