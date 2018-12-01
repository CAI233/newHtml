<template>
    <div id="container" class="newSurfaceSingle">
        <!-- <swiperComponent :swiperOption="swiperOption"></swiperComponent> -->
        <div class="content">
            <ul>
                <li class="carfix">
                    <span>寄件人</span>
                    <input type="text" placeholder="请输入寄件人" v-model="selRow.Sender"/>
                </li>
                <Divider />
                <li class="carfix">
                    <span>联系电话</span>
                    <input type="text" placeholder="请输入联系电话" v-model="selRow.Contact"/>
                </li>
                <Divider />
                <li class="carfix">
                    <span>单位名称</span>
                    <input type="text" placeholder="请输入单位名称" v-model="selRow.Company"/>
                </li>
                <Divider />
                <li class="carfix">
                    <span>选择快递</span>
                    <Dropdown trigger="click" @on-click="chooseCourier" >
                        <a href="javascript:void(0)">
                            <span>{{courierText}}</span>    
                            <Icon type="ios-arrow-down"></Icon>
                        </a>
                        <DropdownMenu slot="list">
                            <DropdownItem :name="item.F_Id" v-if="courierData.length>0" v-for="(item,index) in courierData" :key="index" :selected="item.Abbreviation == courierLess ? true : false">{{item.Title}}</DropdownItem>
                            <DropdownItem v-else>暂无快递</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                    <!-- <input type="text" placeholder="请输入寄件人" /> -->
                </li>
                <Divider />
                <li class="carfix">
                    <span>选择付款方式</span>
                    <Dropdown trigger="click" @on-click="choosePayWay" >
                        <a href="javascript:void(0)">
                            <span>{{payWayText}}</span>    
                            <Icon type="ios-arrow-down"></Icon>
                        </a>
                        <DropdownMenu slot="list">
                            <DropdownItem :name="item.id" v-if="payWayData.length>0" v-for="(item,index) in payWayData" :key="index" :selected="item.id == payWayId ? true : false">{{item.text}}</DropdownItem>
                            <DropdownItem v-else>暂无付款方式</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                    <!-- <input type="text" placeholder="请输入寄件人" /> -->
                </li>
                <Divider />
                <li class="carfix">
                    <span>打印机IP地址</span>
                    <input type="text" placeholder="列如192.168.1.1" v-model="selRow.IP"/>
                </li>
                <Divider />
                <li class="carfix">
                    <span>打印机名称</span>
                    <input type="text" placeholder="请输入打印机名称" v-model="selRow.PrinterTitle"/>
                </li>
                <Divider />
                <li class="carfix">
                    <span>客户号</span>
                    <input type="text" placeholder="请输入客户号" v-model="selRow.CustomerName"/>
                </li>
                <Divider />
                <li class="carfix">
                    <span>客户密码</span>
                    <input type="text" placeholder="请输入客户密码" v-model="selRow.CustomerPwd"/>
                </li>
                <Divider />
                <li class="carfix">
                    <span>月结标识</span>
                    <input type="text" placeholder="请输入月结标识" v-model="selRow.MonthCode"/>
                </li>
                <Divider />
                <li class="carfix">
                    <span>网点名称</span>
                    <input type="text" placeholder="请输入网点名称" v-model="selRow.SendSite"/>
                </li>
                <Divider />
                <li class="carfix">
                    <span>会员名称</span>
                    <input type="text" placeholder="请输入会员名称" v-model="selRow.MemberID"/>
                </li>
                <Divider />
                <li class="carfix">
                    <span>省份</span>
                    <Cascader :data="areaData" placeholder="请选择省份" v-model="areaText" @on-change="chooseArea" change-on-select></Cascader>
                    <!-- <input type="text" placeholder="请选择省份" /> -->
                </li>
                <Divider />
                <li class="carfix">
                    <span>详细地址</span>
                    <input type="text" placeholder="请输入详细地址" v-model="selRow.StreetAddress"/>
                </li>
                <!-- <Divider /> -->
            </ul>
        </div>
        <foot-common :btnText="text" :icon="iconf" @click.native="saveSurfaceSingle"></foot-common>
    </div>
    
</template>

<script>
import footCommon from '@/components/foot-common.vue';//获取组件
import {wxget,wxpost} from '@/axios/ajax';
import areaList from '@/assets/js/area.js';//获取组件
import {isLoading} from '@/assets/js/load.js'
export default {
    name: 'orderindex',
    data() {
        return{
            text:'保存',
            iconf:'',
            isId:'',//是否新增操作
            nowId:'',//修改时id
            selRow:{},//信息保存对象
            courierData:[],//快递
            courierText:'-选择快递-',
            courierId:'',//快递ID
            courierLess:'',//快递简称
            payWayText:'-选择付款方式-',
            payWayId:'',
            payWayData:[],//付款方式
            areaData:areaList,
            areaText:[]
        }
    },
    components: {
        footCommon
    },
    methods:{
        chooseCourier(name){// 选择快递
            let that = this;
            that.courierId = name;
            let nowCourierObj = that.courierData.filter(res => res.F_Id == name );
            that.courierText = nowCourierObj[0].Title;
            that.courierLess = nowCourierObj[0].Abbreviation
            that.selRow.Title = that.courierText;//快递名称
            that.selRow.Abbreviation = that.courierLess;//快递简称
        },
        choosePayWay(name){//选择付款方式
            let that = this;
            that.payWayId = name;
            let nowpayWayObj = that.payWayData.filter(res => res.id == name );
            that.payWayText = nowpayWayObj[0].text;
            that.selRow.PayMode = that.payWayId;//付款编码
        //     var u = navigator.userAgent, app = navigator.appVersion;
        //     var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
        //     var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
        //     if (isAndroid) {
        //     //这个是安卓操作系统
        //         // _self.trigger.clik();
        //     }
        //     if (isIOS) {
        //         _self.trigger.blur();
        // 　　　　//这个是ios操作系统
        //     }
        },
        chooseArea(value,selectData){
            let that = this;
            for(let i in value){
                if(i == 0){
                    that.selRow.Province = value[i];
                }else if(i == 1){
                    that.selRow.City = value[i];
                }else{
                    that.selRow.County = value[i];
                }
            }
            // console.log(selectedData);
        },
        saveSurfaceSingle(){
            let that = this;
            if(!that.selRow.Sender || that.selRow.Sender == ''){
                that.$Message.warning('寄件人不能为空！');
                return false;
            }
            if(!that.selRow.Contact || that.selRow.Contact == ''){
                that.$Message.warning('联系电话不能为空！');
                return false;
            }
            if (!/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/.test(that.selRow.Contact)) {
                that.$Message.warning('手机号格式有误！');
                return false;
            }
            if(!that.selRow.Company || that.selRow.Company == ''){
                that.$Message.warning('单位名称不能为空！');
                return false;
            }
            if(that.courierText == '-选择快递-'){
                that.$Message.warning('快递不能为空！');
                return false;
            }
            if(that.payWayText == '-选择付款方式-'){
                that.$Message.warning('付款方式不能为空！');
                return false;
            }
            if(that.areaText.length == 0){
                that.$Message.warning('省份地区不能为空！');
                return false;
            }
            if(!that.selRow.StreetAddress || that.selRow.StreetAddress == ''){
                that.$Message.warning('详细地址不能为空！');
                return false;
            }
            let url = '';
            if(that.isId){
                that.selRow.Id = that.isId;
                url = 'User/SetUserInterExpressConfigEdit';
            }else{
                url = 'User/SetUserInterExpressConfig';
            }
            isLoading(that,'保存中···');
            wxpost(url,that.selRow).then(res =>{
                that.$Spin.hide();
                if(res.code == 200){
                    that.$Message.success(res.message);
                    that.init();
                }else{
                    that.$Message.error(res.message);
                }
            })
        },
        init(){
            let that = this;
            that.selRow = {};
            that.courierText = '-选择快递-';
            that.courierLess = '';
            that.payWayId = '';
            that.payWayText = '-选择付款方式-';
            that.areaText = [];
        }
    },
    mounted(){
        let that = this;
        that.isId = that.$route.params.id;
        if(that.isId == 0){
            window.document.title = '新增电子面单';
        }else{
            window.document.title = '修改电子面单';
            wxget('User/GetUserInterExpressConfigById/'+that.isId).then(res =>{
                console.log(res);
                that.selRow = res.data;
                that.courierText = res.data.Title;
                that.courierLess = res.data.Abbreviation;
                that.payWayId = res.data.PayMode;
                that.payWayText = (that.payWayData.filter(res => res.id == that.payWayId ))[0].text;
                if(res.data.Province){
                    that.areaText.push(res.data.Province);
                }
                if(res.data.City){
                    that.areaText.push(res.data.City);
                }
                if(res.data.County){
                    that.areaText.push(res.data.County);
                }
            })
        }
        wxget('User/GetExpressList').then(res =>{
            if(res.code == 200){
                that.courierData = res.data;
            }else{
                that.$Message.error(res.message);
            }
        })
        that.payWayData = [{id:1,text:'现付'},{id:2,text:'到付'},{id:3,text:'月付'}];
    }
}
</script>
<style lang="scss" scoped>
    #container{
        padding-bottom: 1.0667rem;
        .content{
            padding:0.5333rem 0.4rem 0;// 20px 15px 0;
            ul{
                .carfix{
                    display:box;
                    display:-webkit-box;
                    display:-webkit-flex; 
                    display:-moz-box; 
                    display:-ms-flexbox; 
                    display:flex;
                    font-size:0.3733rem;//14px
                    padding: 0.2667rem 0;//10px 0
                    &>span{
                        margin-right:0.2667rem;// 10px
                        color:#101010;
                    }
                    &>input{
                        -prefix-box-flex: 1; 
                        -webkit-box-flex: 1; 
                        -webkit-flex: 1; 
                        -moz-box-flex: 1; 
                        -ms-flex: 1; 
                        flex: 1; 
                        // color:#DCDDDD;
                        border:none;
                        outline:0;
                        box-shadow:none;
                    }
                    &>.ivu-dropdown{
                        -prefix-box-flex: 1; 
                        -webkit-box-flex: 1; 
                        -webkit-flex: 1; 
                        -moz-box-flex: 1; 
                        -ms-flex: 1; 
                        flex: 1;
                        text-align:center;
                        .ivu-dropdown-rel{
                            &>a{
                                display:inherit;
                                text-align:right;
                                color:#727171;
                                span{
                                    float:left;
                                }
                            }
                        }
                    }
                    &>.ivu-cascader{
                         -prefix-box-flex: 1; 
                        -webkit-box-flex: 1; 
                        -webkit-flex: 1; 
                        -moz-box-flex: 1; 
                        -ms-flex: 1; 
                        flex: 1;
                    }
                }
                .ivu-divider-horizontal{
                    margin:0;
                    color:#B5B5B6;
                }
            }
        }
    }
</style>
<style>
    input::-webkit-input-placeholder{
        color:#DCDDDD;
    }
    input::-moz-placeholder{   /* Mozilla Firefox 19+ */
        color:#DCDDDD;
    }
    input:-moz-placeholder{    /* Mozilla Firefox 4 to 18 */
        color:#DCDDDD;
    }
    input:-ms-input-placeholder{  /* Internet Explorer 10-11 */ 
        color:#DCDDDD;
    }
    .newSurfaceSingle .ivu-dropdown .ivu-select-dropdown{
        left:auto !important;
        right:0.34rem;
        max-height: 4rem;
        overflow-y: scroll
        /* right:15px */
    }
    .newSurfaceSingle .ivu-cascader .ivu-select-dropdown{
        left:auto !important;
        right:0.34rem;
        /* max-height: 4rem;
        overflow-y: scroll */
    }
    .newSurfaceSingle .ivu-cascader .ivu-input,.newSurfaceSingle .ivu-cascader .ivu-input:hover,.newSurfaceSingle .ivu-cascader .ivu-input:focus{
        border:none;
        outline:0;
        box-shadow:none;
        height:0.5333rem;
        line-height:1;
        color:#727171;
    }
</style>



