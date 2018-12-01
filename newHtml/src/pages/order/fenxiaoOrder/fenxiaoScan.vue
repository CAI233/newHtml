<template>
    <div id="container" class="fenxiaoScan">
        <div class="content">
            <div class="cont_title">
                <p @click="sureScan"><span>点击扫码</span></p>
            </div>
            <div class="cont_cont">
                <ul class="cont_u">
                    <li>
                        <span>总行数:</span><input type="text" :value="formItem.num" readonly/>
                    </li>
                    <li>
                        <span>输入条码:</span><input type="text" v-model="formItem.scan" /><button type="button" @click="sureClick">输入</button>  
                    </li>
                    <li>
                        <span>输入名字:</span><input type="text" v-model="formItem.searchText" placeholder="输入名字/微信号快速检索"/><button type="button" @click="sureSearch">快速检索</button>  
                    </li>
                    <li>
                        <span>选择经销商:</span>
                        <Dropdown trigger="click" @on-click="chooseDealer" >
                            <a href="javascript:void(0)">
                                <span>{{formItem.dealerText}}</span>    
                                <Icon type="ios-arrow-down"></Icon>
                            </a>
                            <DropdownMenu slot="list">
                                <DropdownItem :name="item.F_Id" v-if="dealerData.length>0" v-for="(item,index) in dealerData" :key="index" :selected="item.F_Id == formItem.dealerId ? true : false">{{item.RealName+(item.WeChat ? '('+item.WeChat+')' :'')}}</DropdownItem>
                                <DropdownItem v-else>暂无经销商</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </li>
                </ul>
                <div class="cont_d">
                    <Table :height="scanData.length>4 ? '200' :''" :columns="tData" :data="scanData" :disabled-hover="true"></Table>
                </div>
            </div>
            <div class="cont_foot">
                <p><Button @click.native="sureSubmit">提交</Button></p>
                <p><Button @click.native="sureCancel">清除</Button></p>
            </div>
        </div>
    </div>
</template>
<script>
import {post,wxget,wxpost} from '@/axios/ajax';
import {addCookie,getCookie,getCurrentDate,deleteCookie} from '@/assets/js/assist.js'
import {isLoading} from '@/assets/js/load.js'
export default {
    name: 'fenxiaoScan',
    data() {
        return{
            dealerData:[],//当前下级经销商
            formItem:{
                num:0,
                scan:'',
                searchText:'',
                dealerText:'-请选择经销商-',
                dealerId:null
            },
            tData: [
                {title: '条码',key:'GoodsCode'},
                {title: '扫码时间',key:'scan_time'},
                {title: '操作',width: 50,render: (h, params) => {
                            return h('div', [
                                h('i', {style:{padding:'0.1333rem'},
                                    on: {
                                        click: () => {
                                            let that = this;
                                            that.scanData.splice(params.index,1);
                                            that.formItem.num = that.scanData.length;
                                            addCookie('fenxiaoScanData',JSON.stringify(that.scanData),1);
                                        }
                                    }
                                }, '删除')
                            ]);
                        }}],
            scanData:[],
        }
    },
    components: {

    },
    methods:{
        getDealer(){//加载经销商
            let that = this;
            wxget('User/GetAllUserRefereeById').then(res =>{
                if(res.code == 200){
                    console.log(res.data);
                    that.dealerData = res.data;
                    if(that.dealerData.length>0){//默认第一个
                        that.formItem.dealerText = that.dealerData[0].RealName+ (that.dealerData[0].WeChat ? '('+that.dealerData[0].WeChat+')' :'');
                        that.formItem.dealerId = that.dealerData[0].F_Id;
                    }else{
                        that.formItem.dealerText = '-请选择经销商-';
                        that.formItem.dealerId = null;
                    }
                }else{
                    that.$Message.warning(res.message);
                }
            })
        },
        sureClick(){//条码输入
            let that = this;
            if(!that.formItem.scan || that.formItem.scan == ''){
                that.$Message.warning('条码不能为空！');
                return false;
            }
            if(that.scanData.length>0){
                for(let i in that.scanData){
                    if(that.scanData[i].GoodsCode == that.formItem.scan){
                        that.$Message.warning('该条码已被扫码！');
                        return false;
                    }
                }
            }
            isLoading(that,'条码确认中···');
            wxpost('User/CheckScanCodeForUndertakes',{ScanCode:that.formItem.scan}).then(res =>{
                that.$Spin.hide();
                if(res.code == 200){
                    console.log(res);
                    that.scanData.unshift({
                        GoodsCode:res.data,
                        scan_time:getCurrentDate(2)
                    })
                    that.formItem.num = that.scanData.length;
                    that.formItem.scan = '';
                    addCookie('fenxiaoScanData',JSON.stringify(that.scanData),1);
                    // that.load();
                }else{
                    that.$Message.error(res.details);
                }
            })
        },
        sureSearch(){//快速检索
            let that = this;
            if(that.formItem.searchText){
                wxget('User/GetAllUserRefereeByIdAndKeyWord/'+that.formItem.searchText).then(res =>{
                    if(res.code == 200){
                        console.log(res.data);
                        that.dealerData = res.data;
                        if(that.dealerData.length>0){//默认第一个
                            that.formItem.dealerText = that.dealerData[0].RealName+ (that.dealerData[0].WeChat ? '('+that.dealerData[0].WeChat+')' :'');
                            that.formItem.dealerId = that.dealerData[0].F_Id;
                        }else{
                            that.formItem.dealerText = '-请选择经销商-';
                            that.formItem.dealerId = null;
                        }
                    }else{
                        that.$Message.error(res.message);
                    }
                })
            }else{
                that.getDealer();
            }
            
        },
        chooseDealer(name){//选择经销商
            let that = this;
            that.formItem.dealerId = name;
            that.dealerData.map((item,key,arr) =>{
                if(item.F_Id == name){
                    that.formItem.dealerText = item.RealName+ (item.WeChat ? '('+item.WeChat+')' :'');
                }
            })
        },
        sureSubmit(){//确认提交
            let that = this;
            if(that.scanData.length == 0){
                that.$Message.warning('条码不能为空！');
                return false;
            }
            if(!that.formItem.dealerId || that.formItem.dealerId == ''){
                that.$Message.warning('请选择经销商！');
                return false;
            }
            isLoading(that,'条码提交中···');
            wxpost('User/InsertGoodsByScanCodeByUndertakes',{scanCodeJson:JSON.stringify(that.scanData)}).then(res =>{
                that.$Spin.hide();
                if(res.code == 200){
                    that.$Message.success(res.message);
                    that.sureCancel();
                }else{
                    that.$Message.error(res.message);
                }
            })
        },
        sureCancel(){//清除
            let that = this;
            that.scanData = [];
            that.formItem.num = 0;
            that.formItem.scan = '';
            that.formItem.dealerId = null;
            that.formItem.searchText = '';
            that.formItem.dealerText = '-请选择经销商-';
            deleteCookie('fenxiaoScanData');
        },
        sureScan(){//扫码
            console.log(111);
            // alert(1111111);
            let that = this;
            wx.ready(function(){
                wx.scanQRCode({
                    needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
                    scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
                    success: function (res) {
                        alert(JSON.stringify(res));
                        let result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果

                        if (result.indexOf('EAN_') > -1) {
                            that.$Message.warning('二维码无效，请确认后重新扫描:'+ result);
                            return false;
                        }
                        if (result.indexOf('=') == -1 && result.indexOf('CODE') == -1) {
                            that.$Message.warning('二维码无效，请确认后重新扫描:' + result);
                            return false;
                        }
                        let patrn = /^(http|https)/;
                        if (patrn.exec(result)) result = result.slice(result.lastIndexOf('=') + 1);
                        let results = result.split(',');
                        if (results.length > 1) result = results[1];

                        if(that.scanData.length>0){
                            for(let i in that.scanData){
                                if(that.scanData[i].GoodsCode == result){
                                    that.$Message.warning('该条码已被扫码！');
                                    return false;
                                }
                            }
                        }

                        that.scanData.unshift({
                            GoodsCode:result,
                            scan_time:getCurrentDate(2)
                        })
                        that.formItem.num = that.scanData.length;
                        addCookie('fenxiaoScanData',JSON.stringify(that.scanData),1);
                        // checkcode(result);
                    }
                });
                wx.error(function (res) {
                    alert("出错了：" + res.errMsg);//这个地方的好处就是wx.config配置错误，会弹出窗口哪里错误，然后根据微信文档查询即可。
                });
            })
            
        }  
    },
    mounted(){
        let that = this;
        that.scanData = getCookie('fenxiaoScanData') ? JSON.parse(getCookie('fenxiaoScanData')) : [];
        that.formItem.num = that.scanData.length;
        that.getDealer();
        // let nowUrl = window.location.href.split('#')[0].replace('http://','');
        // alert(nowUrl);
        // post('API/SetWXParam/',{Url:nowUrl}).then(res =>{
        post('API/SetWXParam/',{Url:window.location.href}).then(res =>{
            if(res.code == 200){
                let nowConfig = res.data;
                // alert(JSON.stringify(nowConfig));
                wx.config({
                    // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                    debug: false,
                    // 必填，公众号的唯一标识
                    appId: nowConfig.appId,
                    // 必填，生成签名的时间戳
                    timestamp: nowConfig.timestamp,
                    // 必填，生成签名的随机串
                    nonceStr: nowConfig.nonceStr,
                    // 必填，签名，见附录1
                    signature: nowConfig.signature,
                    // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                    jsApiList: ['checkJsApi', 'scanQRCode']
                });
            }else{
                that.$Message.error(res.message);                   
            }
        })
    }

}
</script>
<style lang="scss" scoped>
    #container{
        padding-bottom: 1.333rem;
        .content{
            padding:0.5333rem 0.4rem 0.2667rem;//20px 15px 10px;
            .cont_title{
                padding-top:1.3333rem;//50px
                p{  
                    position: relative;
                    margin:0 auto;
                    box-sizing: border-box;
                    width:4rem;//150px
                    height:4rem;//150px
                    line-height:4rem;
                    border:0.1333rem solid #DF8D15;//5px
                    text-align:center;
                    color:#DF8D15;
                    font-size:0.5333rem;//20px
                    span{
                        position: relative;
                        z-index: 999;
                    }
                    &::before{
                        content:'';
                        display:block;
                        position: absolute;
                        width:4rem;
                        height:1.3333rem;
                        background:#fff;
                        left: -0.1333rem;
                        top: 1.2rem;
                    }
                    &::after{
                        content:'';
                        display:block;
                        position: absolute;
                        height:4rem;
                        width:1.3333rem;
                        background:#fff;
                        top: -0.1333rem;
                        left: 1.2rem;
                    }
                }
            }
            .cont_cont{
                .cont_u{
                    margin-top:0.4rem;// 15px;
                    li{
                        display:flex;
                        margin:0.2667rem 0;// 10px 0;
                        span{
                            line-height:0.8rem;// 30px;
                            font-size:0.3733rem;//14px;
                        }
                        input{
                            height:0.8rem;// 30px;
                            flex: 1;
                            outline: 0;
                            border: none;
                            box-shadow: none;
                            padding-left:0.1333rem;// 5px;
                        }
                        .ivu-dropdown{
                            flex:1;
                            background:#DCDDDD;
                            .ivu-dropdown-rel{
                                margin:0.16rem 0;// 6px 0
                            }
                            a{
                                width:100%;
                                display: inherit;
                                text-align:right;
                                margin-top:0.16rem;//6px
                                color:#797979;
                                padding:0 0.2667rem;
                                span{
                                    float:left;
                                    line-height:inherit;
                                    font-size:0.3733rem;//14px
                                }
                            }
                        }
                        button{
                            width:2.1333rem;// 80px;
                            height: 0.8rem;// 30px;
                            background: #B5B5B6;
                            color:#fff;
                            box-shadow: none;
                            outline: none;
                            border: none;
                            border-radius:0.1333rem;// 5px;
                        }
                    }
                }
                .cont_d{
                    margin-top:0.4rem;// 15px;
                }
            }
            .cont_foot{
                &>p{
                    text-align:center;
                    margin-top:0.4rem;//15px
                    &:nth-child(1){
                        button{
                            width: 5.3333rem;//200px;
                            height:1.0667rem;// 40px;
                            box-sizing: border-box;
                            background:#009788;
                            color:#fff;
                            border:1px solid #009788;
                        }
                    }
                    &:nth-child(2){
                        button{
                            width: 5.3333rem;//200px;
                            height:1.0667rem;// 40px;
                            box-sizing: border-box;
                            color:#797979;
                            border:1px solid #009788;
                        }
                    }
                    
                }
            }
        }
    }
</style>
<style>
    .fenxiaoScan .content .cont_cont .cont_d .ivu-table-wrapper .ivu-table{
        background:none;
    }
    .fenxiaoScan .content .cont_cont .cont_d .ivu-table-wrapper .ivu-table th{
        text-align:center;
        color:#727171;
        background:#fff;
        height:1rem;
    }
    .fenxiaoScan .content .cont_cont .cont_d .ivu-table-wrapper .ivu-table td{
        height:1rem;
    }
    .fenxiaoScan .content .cont_cont .cont_d .ivu-table-wrapper .ivu-table .ivu-table-cell{
        padding-left:0;
        padding-right:0;
        text-align:center;
        font-size:0.32rem;
    }
    .fenxiaoScan .content .cont_cont .cont_u li .ivu-dropdown .ivu-select-dropdown{
        left: auto !important;
        right: 0.4rem;
        max-height: 4rem;
        overflow-y: scroll /* right:15px */
    }
</style>

