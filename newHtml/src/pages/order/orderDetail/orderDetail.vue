<template>
    <div id="container" class="orderDetail">
        <div class="content">
            <div class="title">
                <div class="title_a">
                    <Dropdown trigger="click" @on-click="choosePolicy" >
                        <a href="javascript:void(0)">
                            <span>{{policyText}}</span>    
                            <Icon type="ios-arrow-down"></Icon>
                        </a>
                        <DropdownMenu slot="list">
                            <DropdownItem :name="item.F_Id" v-if="policyData.length>0" v-for="(item,index) in policyData" :key="index" :selected="item.F_Id == policyId ? true : false">{{item.Title}}</DropdownItem>
                            <DropdownItem v-else>暂无快递</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>
                <div class="title_t">
                    <input v-model="date" placeholder="请选择时间"  readonly />
                    <DatePicker :open="Bopen" :value="beginDate" type="date" @on-open-change="openChange" @on-change="handleChange" @on-ok="handleOk(true)">
                        <router-link to='' @click.native="handleClick(true)">
                            <template >开始时间</template>
                        </router-link>
                    </DatePicker>
                    <DatePicker :open="Eopen" :value="endDate" type="date" @on-open-change="openChange" @on-change="handleChange" @on-ok="handleOk(false)">
                        <router-link to='' @click.native="handleClick(false)">
                            <template >结束时间</template>
                        </router-link>
                    </DatePicker>
                </div>
            </div>
            <div class="cont">
                <ul>
                    <li class="Tablis" :class="orderStatus == item.status ? 'active' : ''" v-for="(item,index) in tabText" :key="index" @click="Status(orderType,item.status)">
                        <router-link to='' >
                            <span>{{item.text}}</span>
                            <em v-if="index != 0">0</em>
                        </router-link>
                        <Divider :style="orderStatus == item.status ? 'background:#009788;height:2px;' :'background: #B5B5B6;'" />
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>

import {wxget,wxpost} from '@/axios/ajax';
// import {parseStrToDate} from '@/assets/js/assist.js'
export default {
    name: 'orderDetail',
    data() {
        return{
            orderType:'',
            orderStatus:'',
            policyData:[],
            policyId:'',
            policyText:'-选择政策筛选-',
            date:'',
            beginDate:'',
            endDate:'',
            Bopen: false,
            Eopen:false,
            tabText:[],
        }
    },
    components: {

    },
    methods:{
        load(bool,status){//加载数据
            let that = this;
            console.log('加载数据···')
            if(bool){

            }else{

            }
        },
        getPolicy(){
            let that = this;
            wxget('User/GetActivityListByTarget').then(res =>{
                console.log(res);
                if(res.code == 200){
                    that.policyData = res.data;
                }else{
                    that.$Message.error(res.message);
                }
            })
        },
        choosePolicy(name){
            let that = this;
            that.policyId = name;
            that.policyData.map((item,key,arr) => {
                if(item.F_Id == name){
                    that.policyText = item.Title;
                }
            })
            that.load(false,that.orderStatus);
        },
        handleClick (bool) {
            let that = this;
            if(bool){
                that.Bopen = !that.Bopen;
                that.Eopen = false;
            }else{
                that.Eopen = !that.Eopen;
                that.Bopen = false;
            }
        },
        handleChange (date) {
            let that = this;
            if(that.Bopen) that.beginDate = date,that.date = that.beginDate;
            if(that.beginDate && that.Eopen){
               let nowBegin = Date.parse(that.beginDate);
               let nowEnd = Date.parse(date);
               if(nowBegin > nowEnd){
                   that.$Message.warning('结束时间不能小于开始时间');
                   that.endDate = '';
                   return false;
               }else{
                   that.endDate = date;
                   that.date = that.beginDate+'-'+that.endDate;
               }
            }
            that.handleOk();
        },
        handleOk () {
            let that = this;
            that.Bopen = false;
            that.Eopen = false; 
            that.load(false,that.orderStatus);
        },  
        openChange(bool){
            console.log(bool);
            let that = this;
            // if(that.Bopen) that.Bopen = false;
            // if(that.Eopen) that.Eopen = false;
            // if(!bool){
            //     this.Bopen = false;
            //     this.Eopen = false;
            // }
        },
        Status(type,status){//切换订单状态
            console.log(type+'++++++++'+status);
            let that = this;
            that.orderStatus = status;
            that.load(false,that.orderStatus);
        }
    },
    mounted(){
        let that = this;
        that.orderType = that.$route.params.type;
        that.orderStatus = that.$route.params.status;
        that.load(true,that.orderStatus);//加载
        that.tabText = [
            {status:0,text:'全部'},
            {status:1,text:'待付款'},
            {status:2,text:'代发货'},
            {status:3,text:'待收货'},
            {status:4,text:'已收货'},
            {status:5,text:'已关闭'},
        ]
        that.getPolicy();//获取政策
    }
}
</script>
<style lang="scss" scoped>
    #container{
        padding-bottom: 1.0667rem;
        .content{
            padding:0.5333rem 0.4rem 0;//20px 15px 0;
            .title{
                .title_a{
                    .ivu-dropdown{
                        width:100%;
                        .ivu-dropdown-rel{
                            &>a{
                                display: inherit;
                                text-align: right;
                                color:#101010;
                                span{
                                    float:left;
                                }
                            }
                        }
                    }
                }
                .title_t{
                    overflow: hidden;
                    margin-top:0.2667rem;
                }
            }
            .cont{
                &>ul{
                    display:flex;
                    .Tablis{
                        flex:1;
                        text-align:center;
                        padding:0.2667rem 0;
                        margin:0.2667rem 0 0;
                        position: relative;
                        &>.ivu-divider-horizontal{
                            margin:0;
                            position: absolute;
                            bottom: 0;
                            top: auto !important
                        }
                        &>a{
                            color:#3E3A39;
                            font-size:0.32rem;//12px
                            position: relative;
                            &>span{
                                font-size:0.3733rem;// 14px;
                            }
                            &>em{
                                position:absolute;
                                width:0.5333rem;
                                height:0.5333rem;
                                background:#fff;
                                right:0;
                                box-sizing: border-box;
                                border-radius: 50%;
                                color: orange;
                                border: 1px solid orange;
                                line-height: 0.5333rem;
                                top: -0.25rem;
                                right: -0.2667rem;
                            }
                        }
                    }
                }
            }
        }
    }
</style>
<style>
    .orderDetail .content .title .title_a .ivu-dropdown .ivu-dropdown-rel{
        padding:0.1333rem 0.2667rem;
        background:#DCDDDD;
    }
    .orderDetail .content .title .title_a .ivu-dropdown .ivu-select-dropdown{
        left:0.4rem;
        width:-moz-calc(100% - 0.8rem);
        width:-webkit-calc(100% - 0.8rem);
        width:calc(100% - 0.8rem);
    }
    .orderDetail .ivu-dropdown-item-selected,.orderDetail .ivu-dropdown-item-selected:hover{
        background:none;
        color:#009788;
    }
    .orderDetail .content .title .title_t input{
        height:0.8rem;
        line-height:0.8rem;
        padding-left: 0.4rem;
        float: left;
        border: none;
        background: #DCDDDD;
        box-shadow: none;
        outline: 0;
        width: -moz-calc(100% - 4.16rem);
        width: -webkit-calc(100% - 4.16rem);
        width: calc(100% - 4.16rem);
    }
    .orderDetail .content .title .title_t .ivu-date-picker{
        float:left;
    }
    .orderDetail .content .title .title_t .ivu-date-picker .ivu-date-picker-rel a{
        width:2.08rem;
        background:#009788;
        color:#fff;
        height:0.8rem;
        line-height:0.8rem;
        box-sizing: border-box;
        text-align:center;
        display: inherit;
    }
    .orderDetail .content .title .title_t .ivu-date-picker:nth-child(3) .ivu-date-picker-rel a{
        background:none;
        color:#727171;
        border:1px solid #009788;
        
    }
    .orderDetail .content .title .title_t .ivu-date-picker .ivu-select-dropdown{
        left:auto !important;
        right:0.4rem;
    }
    .orderDetail .content .cont>ul>.active a{
        color:#009788 !important;
    }
</style>






