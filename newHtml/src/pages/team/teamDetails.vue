<template>
    <div id="container" class="teamDetails">
        <div class="content">
            <div class="title">
                <Row class="title_u">
                    <Col span="12">
                        <p>¥222222</p>
                        <span style="visibility:hidden">经销商总余额</span>
                        <Button @click="seeBalance()" >查看经销商总余额</Button>
                    </Col>
                    <Col span="12">
                        <p>{{selRow.allTotal}}</p>
                        <span>全部经销商</span>
                        <Button :class="isShow ? 'allShow' : ''" @click.native="isAll(isShow)">显示团队所有成员</Button>
                    </Col>
                </Row>
                <div class="title_d">
                    <Input v-model="selRow.keyword" placeholder="微信昵称/手机号码">
                        <i class="iconfont icon-seach" slot="prepend" @click="search()"></i>
                        <Select v-model="selRow.agentLevel" slot="append" style="width: 70px" @on-change="choose">
                            <Option value="0">全部</Option>
                            <Option value="2">总代</Option>
                            <Option value="3">一级</Option>
                            <Option value="4">二级</Option>
                            <Option value="5">三级</Option>
                            <Option value="6">店主</Option>
                        </Select>
                    </Input>
                </div>
            </div>
            <Divider class="line" />
            <div class="cont">
                <ul>
                    <li class="list" v-for="(item,index) in listData" :key="index">
                        <div class="list_l">
                            <p><span>{{item.RealName}}</span><span>{{item.UserPhone}}</span></p>
                            <p><span>{{item.AgentLevelName}}</span></p>
                            <p>微信昵称:<span>{{item.UserName}}</span></p>
                            <p>代理等级:<span>{{item.AgentLevelName}}</span></p>
                            <p>月结方式: <span>{{['日结','月结'][item.Stype]}}</span></p>
                        </div>
                        <div class="list_r" v-if="!isShow">
                            <button class="list_btn" @click="seeWater(item.F_Id)">流水</button>
                            <button class="list_btn" @click="recharge(item.F_Id,item.AgentLevel)">充值</button>
                            <button class="list_btn" @click="addOrder(item.F_Id,item.UserPhone,item.UserName)">添加销售订单</button>
                            <button class="list_btn" @click="setPostage(item.F_Id,index)">邮费月结方式</button>
                            <button class="list_btn" @click="seeBalance(item.F_Id)" >余额查询</button>
                        </div>
                        <Divider class="line" v-if="index != listData.length -1"/>
                    </li>
                    <div class="list-foot">
                        <div v-if="listData.length>0">
                            <p v-if="selRow.CurPage < Math.ceil(selRow.allTotal/selRow.PageSize)">下拉加载更多</p>
                            <p v-else>没有更多了</p>
                        </div>
                        <div v-else class="notData">
                            没有数据
                        </div>
                    </div>
                </ul>
            </div>
        </div>
        <Modal class="teamDetails_recharge" v-model="isRecharge" :footer-hide="true" @on-cancel="cancel">
            <p class="recharge_title">充值金额</p>
            <InputNumber :min="0" v-model="rechargeParam.ReChargePrice"></InputNumber>
            <p class="recharge_title">选择政策类型</p>
            <ul class="recharge_policy">
                <li>
                    <Dropdown trigger="click" @on-click="choosePlocy">
                        <a href="javascript:void(0)">
                            <span>{{rechargeParam.ActivityText}}</span>    
                            <Icon type="ios-arrow-down"></Icon>
                        </a>
                        <DropdownMenu slot="list">
                            <DropdownItem :name="item.F_Id" v-for="(item,index) in nowPlocyData" :key="index" v-if="nowPlocyData.length>0"  :selected="item.F_Id == rechargeParam.ActivityId ? true : false">{{item.Title}}</DropdownItem>
                            <DropdownItem v-else>暂无对应政策</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </li>
                <li><p @click="choosePlocy(0)" :style="rechargeParam.PriceType == 3 ? 'color:#009788;' : ''">邮费</p></li>
            </ul>
            <div class="recharge_foot">
                <Button class="foot_n" @click.native="cancel">取消</Button><Button class="foot_y" @click.native="rechargeOk">确认</Button>
            </div>
        </Modal>
        <Modal class="teamDetails_recharge" v-model="isAddOrder" :footer-hide="true" @on-cancel="orderCancel">
            <p class="recharge_title">选择政策类型</p>
            <ul class="recharge_policy">
                <li>
                    <Dropdown trigger="click" @on-click="chooseOrderPlocy">
                        <a href="javascript:void(0)">
                            <span>{{addOrderParam.ActivityText}}</span>    
                            <Icon type="ios-arrow-down"></Icon>
                        </a>
                        <DropdownMenu slot="list">
                            <DropdownItem :name="item.F_Id" v-for="(item,index) in nowPlocyData" :key="index" v-if="nowPlocyData.length>0"  :selected="item.F_Id == addOrderParam.ActivityId ? true : false">{{item.Title}}</DropdownItem>
                            <DropdownItem v-else>暂无对应政策</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </li>
            </ul>
            <div class="recharge_foot">
                <Button class="foot_n" @click.native="orderCancel">取消</Button><Button class="foot_y" @click.native="addOrderOk">确认</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
import {wxget,wxpost} from '@/axios/ajax';
import {addCookie,getCookie,getCurrentDate,deleteCookie} from '@/assets/js/assist.js'
import {isLoading} from '@/assets/js/load.js'
export default {
    name: 'teamDetails',
    data() {
        return{
            isShow:false,
            selRow:{
                PageSize:6,//每页个数
                CurPage:1,//默认第一页
                isVerify:1,
                agentLevel:0,//级别
                keyword:'',//搜索词
                allFalse:0,
                allTotal:0,
                allMoney:0
            },
            listData:[],
            isRecharge:false,//是否显示当前充值弹窗
            nowPlocyData:[],//当前政策
            rechargeParam:{
                UserId:'',
                ReChargePrice:0,
                PriceType:0,//是邮费或政策 3 2
                ActivityId:null,//政策id
                ActivityText:'-请选择政策类型-'
            },
            isAddOrder:false,//是否显示当前销售订单弹窗
            addOrderParam:{
                activityId:null,
                ActivityText:'-请选择政策类型-',
                ActivityType:'',
                userPhone:'',
                userName:'',
                userId:''
            }
        }
    },
    components: {

    },
    methods:{
        isAll(bool){//是否显示全部经销商
            let that = this;
            that.isShow = !bool;
            if(that.isShow){
                that.selRow.allFalse = 1
            }else{
                that.selRow.allFalse = 0;
            }
            that.load(true);
        },
        search(){//搜索
            let that = this;
            that.load(true);
        },
        choose(val){//切换级别
            let that = this;
            that.selRow.agentLevel = val;
            that.load(true);
        },
        handleScroll(){//页面滚动监听
            let that = this;
            let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
            let bodyHeight = document.documentElement.clientHeight;
            let scrollHeight = document.documentElement.scrollHeight;
            if(scrollTop + 5 > scrollHeight - bodyHeight){
                that.load(false);
            }
        },
        load(bool){//加载经销商
            let that = this;
            if(bool){
                that.listData = [];
                that.selRow.PageSize = 6;
                that.selRow.CurPage = 1;
                isLoading(that,'订单加载中···');
            }else{
                if(that.selRow.CurPage >= Math.ceil(that.selRow.allTotal/that.selRow.PageSize)){
                    return false;
                }else{
                    that.selRow.CurPage++;
                } 
            }
            let keyText = that.selRow.keyword ? that.selRow.keyword : '0';
            wxget('User/GetUserTeam/'+that.selRow.PageSize+'/'+that.selRow.CurPage+'/'+that.selRow.isVerify+'/'+that.selRow.agentLevel+'/'+keyText+'/'+that.selRow.allFalse).then(res =>{
                that.$Spin.hide();
                if(res.code == 200){
                    that.listData.push(...res.data);
                    console.log(that.listData);
                    that.selRow.allTotal = res.total;
                    //listData
                }else{
                    that.$Message.error(res.message);
                }
            })
        },
        getAll(){//加载总金额
            let that = this;
            wxget('User/GetAgentBalanceAmount').then(res =>{
                if(res.code == 200){
                    that.selRow.allMoney = res.details
                }else{
                    that.$Message.error(res.details);
                }
            })
        },
        getPlocy(id){//获取活动政策列表
            let that = this;
            wxget('User/GetActivityListByUserId/'+id).then(res =>{//拉取政策
                if(res.code == 200){
                    that.nowPlocyData = res.data;
                    that.nowPlocyData.unshift({
                        F_Id:null,
                        Title:'-请选择政策类型-'
                    })
                }else{
                    that.$Message.error(res.message);
                }
            })
        },
        seeWater(id){//查看流水
            let that = this;
            that.$router.push({name:'bill',params: { id:id }});
        },
        recharge(id,level){//充值
            let that = this;
            that.rechargeParam.UserId = id;
            if(level == 2){
                that.$Message.warning('官方不能给总代充值');
                return false;
            }  
            that.getPlocy(id);
            that.isRecharge = true; 
        },
        choosePlocy(F_Id){//选择政策----充值
            let that = this;
            if(F_Id == 0){
                that.rechargeParam.PriceType = 3;
                that.rechargeParam.ActivityId = null;
                that.rechargeParam.ActivityText = '-请选择政策类型-';
            }else{
                that.rechargeParam.PriceType = 2;
                that.rechargeParam.ActivityId = F_Id;
                that.nowPlocyData.map((item) =>{
                    if(item.F_Id == F_Id){
                        that.rechargeParam.ActivityText = item.Title;
                    }
                })
            }
        },
        addOrder(id,phone,name){//添加销售订单
            let that = this;
            that.getPlocy(id);
            that.addOrderParam.userId = id;
            that.addOrderParam.userPhone = phone;
            that.addOrderParam.userName = name;
            that.isAddOrder = true;
        },
        chooseOrderPlocy(F_Id){//选择政策---添加销售订单
            let that = this;
            that.addOrderParam.activityId = F_Id;
            that.nowPlocyData.map((item) =>{
                if(item.F_Id == F_Id){
                    that.addOrderParam.ActivityText = item.Title;
                    that.addOrderParam.ActivityType = item.ActivityType;
                }
            })
        },
        setPostage(id,num){//设置邮费月结方式
            let that = this;
            that.$Modal.confirm({
                scrollable:false,
                render: (h) => {
                    return h('div',{class:'model-cont'},[
                        h('div',{class:'model-title','style':{textAlign:'right',marginBottom:'0.2667rem'}},[
                            h('span',
                                {style:{color:'#DF8D15',fontSize:'0.3733rem',float:'left'}}, '提醒！'),
                            h('i',{class:'iconfont icon-close-btn',on: {click: () => {that.$Modal.remove();}}
                            })
                        ]),
                        h('div',{class:'model-content'},[
                            h('p', {'style':{fontSize:'0.3733rem'}},'确认设置邮费为月结吗？')
                        ]),
                        h('div',{class:'model-foot','style':{textAlign:'right',marginTop:'0.2667rem'}},[
                            h('Button', {'style':{boxShadow:'none',borderColor:'#dcdee2',marginRight:'0.1333rem'},on: {click:()=>{that.$Modal.remove();}}},'取消'),
                            h('Button', {'style':{boxShadow:'none',background: '#009788',borderColor:'#009788'},props: {type: 'primary'},on: {click:()=>{
                                isLoading(that,'设置中···')
                                wxget('User/GetSettlingAccount/'+id).then(res =>{
                                    that.$Spin.hide();
                                    that.$Modal.remove();
                                    if(res.code == 200){
                                        that.$Message.success(res.details);
                                    //     that.listData.map((item,key,arr) => {
                                    //         if(num == key){
                                    //             item.OrderStatus = 5
                                    //         }
                                    //     })
                                    //     let nowObj =  that.listData[num];
                                    //     that.$set(that.listData,num,nowObj);
                                    }else{
                                        that.$Message.error(res.details);
                                    }
                                })
                            } }},'确定')
                        ])
                    ]

                    )
                } 
            })
        },
        seeBalance(id){//余额查询
            let that = this;
            that.$router.push({path:'/team/balanceDetails',query: { id:id }});
        },
        cancel(){//充值取消
            let that = this;
            that.$Modal.remove();
            that.isRecharge = false;
            that.rechargeParam ={
                UserId:'',
                ReChargePrice:0,
                PriceType:0,//是邮费或政策 3 2
                ActivityId:null,//政策id
                ActivityText:'-请选择政策类型-'
            }
        },
        rechargeOk(){//充值确定
            let that = this;
            if(!that.rechargeParam.ReChargePrice || that.rechargeParam.ReChargePrice == 0){
                that.$Message.warning('请输入充值金额');
                return false;
            }
            if(that.rechargeParam.PriceType == 0){
                that.$Message.warning('请选择充值类型');
                return false;
            }
            if(that.rechargeParam.PriceType == 2 && that.rechargeParam.ActivityId == null){
                that.$Message.warning('请选择政策类型');
                return false;
            }
            that.rechargeParam.ReChargeType = '手动充值';
            isLoading(that,'充值中···')
            wxpost('User/SetChargeBalance',that.rechargeParam).then(res =>{
                that.$Spin.hide();
                if(res.code == 200){
                    that.$Message.success(res.message);
                    that.cancel();
                }else{
                    that.$Message.error(res.message);
                }
            })

        },
        orderCancel(){//添加销售订单取消
            let that = this;
            that.$Modal.remove();
            that.isAddOrder = false;
            that.addOrderParam ={
                activityId:null,
                ActivityText:'-请选择政策类型-',
                ActivityType:'',
                userPhone:'',
                userName:'',
                userId:''
            }
        },
        addOrderOk(){//销售订单确定
            let that = this;
            if(that.addOrderParam.activityId == null){
                that.$Message.warning('请选择政策类型');
                return false;
            }
        }
        
    },
    mounted(){
        let that = this;
        window.addEventListener('scroll', that.handleScroll);//添加滚动监听事件
        that.load(true);//加载经销商
        that.getAll();//加载总金额
    }
}
</script>
<style lang="scss" scoped>
    #container{
        padding-bottom: 1.333rem;
        .content{
            padding:0.5333rem 0.4rem 0;//20px 15px 0;
            .title{
                .title_u{
                    .ivu-col{
                        text-align:center;
                        p{
                            font-size:0.5333rem;//20px
                        }
                        button{
                            margin-top:0.1333rem;// 5px;
                        }
                        &:nth-child(1){
                            p{
                                color:#DF8D15;
                            }
                            button{
                                border-color:#DF8D15;
                            }
                        }
                        &:nth-child(2){
                            p{
                                color:#727171;
                            }
                            button{
                                border-color:#727171;
                                &.allShow{
                                    background:#009788;
                                    border-color:#009788;
                                    color:#fff;
                                }
                            }
                        }
                    }
                }
                .title_d{
                    margin-top:0.4rem;//15px
                }
            }
            &>.line{
                margin:0.5333rem 0;
            }
            .cont{
                &>ul{
                    .list{
                        overflow: hidden;
                        &>.line{
                            margin:0.2667rem 0;
                        }
                        .list_l{
                            float: left;
                            width: 100%;
                            margin-right: -4rem;
                            padding-right: 4rem;
                            p{
                                margin-bottom: 0.2667rem;
                                &:nth-child(1){
                                    font-size:0.4267rem;
                                    color:#3E3A39;
                                    span{
                                        &:nth-child(2){
                                            float:right;
                                        }
                                    }
                                }
                                &:nth-child(2){
                                    font-size:0.32rem;
                                    color:#fff;
                                    span{
                                        transform: scale(0.8333);
                                        background:#DF8D15;
                                        padding:0.08rem 0.2667rem;
                                    }
                                }
                                &:nth-child(3){
                                    font-size:0.32rem;
                                    color:#888888;
                                }
                                &:nth-child(4){
                                    font-size:0.32rem;
                                    color:#888888;
                                }
                            }
                        }
                        .list_r{
                            float: left;
                            width: 4rem;
                            padding: 0 0 0 0.2667rem;//0 10px
                            overflow: hidden;
                            .list_btn{
                                background: #fff;
                                outline: none;
                                border: 1px solid #009788;
                                padding:0.1333rem 0.2667rem;// 5px 10px;
                                font-size:0.3733rem;// 14px;
                                color: #666666;
                                border-radius:4px;
                                float: right;
                                margin-bottom:0.2667rem;// 10px
                                width: 100%;
                                &:nth-child(1){
                                    width:1.6rem;
                                    margin-left:0.2667rem;
                                }
                                &:nth-child(2){
                                    width:1.6rem;
                                    
                                    margin-right:0.2667rem;
                                }
                                &:last-child{
                                    width:2.1333rem;
                                    
                                }
                            }
                        }
                    }
                    &>.list-foot{
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
    .teamDetails .ivu-btn:hover{
        color:#727171;
    }
    .teamDetails .ivu-input-group-prepend{
        background:#DCDDDD;
    }
    .teamDetails .ivu-input-group-append{
        background:#009788;
        color:#fff;
    }
    .teamDetails .ivu-select-single .ivu-select-selection .ivu-select-placeholder,.teamDetails .ivu-select-single .ivu-select-selection .ivu-select-selected-value{
        color:#fff;
    }
    .teamDetails .ivu-select-arrow,.teamDetails .ivu-select-selection-focused .ivu-select-arrow,.teamDetails .ivu-select-selection:hover .ivu-select-arrow{
        color:#fff;
    }
    .teamDetails .title_d input,.teamDetails .title_d input:hover,.teamDetails .title_d input:focus{
        border:none;
        background:#DCDDDD;
    }
    .teamDetails .ivu-input::-webkit-input-placeholder{
        color:#797979;
    }

    .teamDetails .ivu-input:-moz-placeholder{
        color:#797979;
    }

    .teamDetails .ivu-input::-moz-placeholder{
        color:#797979;
    }
    .teamDetails .ivu-input:-ms-input-placeholder{
        color:#797979;
    }
    .teamDetails .ivu-select-item-selected,.teamDetails .ivu-select-item-selected:hover{
        background:none;
        color:#009788;
    }
    .ivu-input-number{
        width:100%;
        border:1px solid #B5B5B6;
    }
    .ivu-input-number:hover,.ivu-input-number:focus{
        border:1px solid #B5B5B6;
    }
    .ivu-input-number .ivu-input-number-handler-wrap{
        display:none;
    }
    .teamDetails_recharge .recharge_title{
        font-size:0.3733rem;
        color:#666666;
        text-align:center;
        margin:0.2667rem 0;
    }
    .teamDetails_recharge .recharge_policy li p{
        color: #797979;
        font-size:0.3733rem;
        text-align: center;
        border: 1px solid #727171;
        border-radius:4px;
        padding:0.0533rem 0;
        /* 2px 0 */
    }
    .teamDetails_recharge .ivu-dropdown{
        width:100%;
        margin-bottom:0.4rem;
    }
    .teamDetails_recharge .ivu-dropdown-rel a{
        font-size: 0.3733rem;
        display: inherit;
        text-align: right;
        color: #797979;
        background: #DCDDDD;
        padding:0.08rem 0.1333rem;
        /* 3px 5px */
    }
    .teamDetails_recharge .ivu-dropdown-rel a span{
        float:left;
    }
    .teamDetails_recharge .recharge_foot{
        margin-top: 0.4rem;
        text-align: right;
    }
    .teamDetails_recharge .recharge_foot button{
        margin-left:0.2667rem;
        font-size:0.3733rem;
        border-color:#727171;
    }
    .teamDetails_recharge .recharge_foot .foot_y{
        border-color:#009788;
    }
    .teamDetails_recharge .recharge_foot .foot_n:hover{
        color:#101010;
        border-color:#727171;
    }
    .teamDetails_recharge .recharge_foot .foot_y:hover{
        color:#101010;
    }
    
</style>
