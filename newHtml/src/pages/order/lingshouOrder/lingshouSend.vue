<template>
    <div id="container" class="send">
        <div class="content">
            <ul class="cont_top">
                <li class="title"><p>收货信息</p></li>
                <Divider />
                <li class="fix" >
                    <p><span><em>{{orderData.Sendee}}</em></span><span><em>{{orderData.Contact}}</em></span></p>
                    <p><i class="iconfont icon-address"></i>{{orderData.Address}}</p>
                </li>
            </ul>
            <Divider class="line" />
            <div class="cont_cont">
                <ul class="cont">
                    <li v-for="(item,index) in goodsList" :key="index" class="list">
                        <Row>
                            <Col span="6">
                                <img v-lazy="imgUrl+item.ImageUrl" :key="item.ImageUrl" alt="" />
                            </Col>
                            <Col span="18">
                                <p>{{item.Title}}</p>
                                <p><span>规格:<em>{{item.SepcName}}</em></span><span>箱规:<em>{{item.UnitNumber}}/{{item.Unit}}</em></span></p>
                                <p class="price"><em >￥{{item.Price}}</em>×{{item.Number}}<span>合计:<em>¥{{item.Price*item.Number}}</em></span></p>
                            </Col>
                        </Row>
                        <Divider class="carfix_line" />
                    </li>
                </ul>
            </div>
            <Divider class="line" />
            <div class="cont_down">
                <p class="down_t"><span>总码数</span><em>{{formItem.num}}</em><span class="down_scan" @click="sureScan"><i class="iconfont icon-scan"></i></span></p>
                <p class="down_d"><span>输入条码</span><input type="text" v-model="formItem.scan" placeholder="请输入条码"><button @click="sureClick">确认</button></p>
                <Table :height="scanData.length>4 ? '200' :''" :columns="tData" :data="scanData" :disabled-hover="true"></Table>
                <p class="down_t"><span>运费总价</span><em>{{orderData.FarePrice}}</em></p>
                <p class="down_t"><span>政策名称</span><em>{{orderData.ActivityTitle}}</em></p>
                <div class="down_m">
                    <p><span>邮单数量</span><span>
                            <i class="count_cut" @click="handCount(false)">-</i>
                            <input type="text" onkeyup="this.value=this.value.replace(/\D/g,'')" onafterpaste="this.value=this.value.replace(/\D/g,'')" v-model="mailsNum" v-on:input="hand()">
                            <i class="count_add" @click="handCount(true)">+</i>
                        </span>
                    </p>
                </div>
                <div class="mails-list" v-for="(item,index) in mailsList" :key="index">
                    <p class="down_d"><span>输入条码</span><input type="text" v-model="item.StampNumber" placeholder="请输入邮单号"><span class="down_scan" @click="mailsScan(index)"><i class="iconfont icon-scan"></i></span></p>
                    <p class="down_d">
                        <span style="padding-top:0;margin-right:0.1333rem;">货运方式</span>
                        <Dropdown trigger="click" @on-click="chooseMails" >
                            <a href="javascript:void(0)">
                                <span>{{item.DeliverName}}</span>    
                                <Icon type="ios-arrow-down"></Icon>
                            </a>
                            <DropdownMenu slot="list">
                                <DropdownItem :name="ite.Abbreviation+'&'+index" v-if="mailsData.length>0" v-for="(ite,ind) in mailsData" :key="ind" :selected="ite.Abbreviation == item.Abbreviation ? true : false">{{ite.Title}}</DropdownItem>
                                <DropdownItem v-else>暂无快递</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </p>
                    <div class="down_f">
                        <p><span>电子打印</span><span>纸质打印</span></p>
                    </div>
                </div>
                
            </div>
            <Divider class="line" />
            <div class="cont_down">
                <p class="down_d">
                    <span>买家备注</span>
                    <Input v-model="orderData.BuyCaption" type="textarea" :autosize="{minRows: 2,maxRows: 5}" readonly></Input>
                </p>
                <p class="down_d">
                    <span>卖家备注</span>
                    <Input v-model="orderData.SellCaption" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="卖家备注"></Input>
                </p>
            </div>
            <div class="foot-nav-containner">
                <ul class="bottom-nav">
                    <li class="bottom-nav__li ">
                        <span>实付款:<em>¥{{orderData.PayPrice}}</em></span>
                    </li>
                    <li class="bottom-nav__li ">
                        <button type="button" @click="deliveryOrder">确认发货</button>
                    </li> 
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
import {wxget,wxpost,post} from '@/axios/ajax';
import {addCookie,getCookie,getCurrentDate,deleteCookie} from '@/assets/js/assist.js'
import {isLoading} from '@/assets/js/load.js'
export default {
    name: 'send',
    data() {
        return{
            orderNo:'',//订单id
            goodsIds:'',
            orderData:{},//当前订单详情
            goodsList:[],
            formItem:{
                scan:'',
                num:0
            },
            tData: [//表格格式
                {title: '条码',key:'Code'},
                {title: '扫码时间',key:'nowTime'},
                {title: '数量',width: 40,key:'UnitNumber'},
                {title: '类型',width: 40,key:'CodeType',render: (h, params) => {
                            console.log(params);
                            return h('span',['瓶码','箱码'][parseInt(params.row.CodeType)-1]);
                        }},
                {title: '操作',width: 40,render: (h, params) => {
                            return h('div', [
                                h('i', {style:{padding:'0.1333rem'},
                                    on: {
                                        click: () => {
                                            let that = this;
                                            that.scanData.splice(params.index,1);
                                            that.formItem.num = that.scanData.length;
                                        }
                                    }
                                }, '删除')
                            ]);
                        }
                    }
                ],
            scanData:[],
            mailsNum:1,//邮单数量
            mailsData:[],//快递列表
            mailsList:[{
                    Abbreviation:'',
                    DeliverName:'--请选择快递--',
                    PrintNo:'',
                    StampNumber:''
            }],
            remark:''
        }
    },
    components: {

    },
    methods:{
        load(id){//加载订单
            let that = this;
            wxget('User/GetSellOrderByOrderNo2/'+id).then(res =>{
                if(res.code == 200){
                    console.log(res);
                    that.orderData = res.data;
                    that.goodsList = that.orderData.OrderDetailList_Dic;

                    if(that.goodsIds){//分批发货时
                        let nowGoodsIds = that.goodsIds.indexOf(",") != -1 ? that.goodsIds.split(",") : [that.goodsIds];
                        let newGoodList = [];
                        for(let k of that.goodsList){
                            let no = Array.indexOf(nowGoodsIds,k.GoodsNo);
                            if(no > -1){
                                newGoodList.push(k);
                            }
                        }
                        that.goodsList = newGoodList;
                    }
                    console.log(that.orderData);
                }else{
                    that.$Message.error(res.details);
                }
            })
        },
        getMails(){//拉取快递
            let that = this;
            wxget('User/GetExpressList').then(res =>{
                if(res.code == 200){
                    that.mailsData = res.data;
                }else{
                    that.$Message.error(res.details);
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
                    if(that.scanData[i].Code == that.formItem.scan){
                        that.$Message.warning('该条码已被扫码！');
                        return false;
                    }
                }
            }
            isLoading(that,'条码确认中···');
            wxpost('User/CheckScanCodeForDelivery',{ScanCode:that.formItem.scan}).then(res =>{
                that.$Spin.hide();
                if(res.code == 200){
                    console.log(res);
                    res.data['nowTime'] = getCurrentDate(3);
                    res.data['UnitNumber'] = parseInt(res.data.Count);
                    res.data['Code'] = res.data.ScanCode;
                    that.formItem.num += parseInt(res.data.Count);
                    that.scanData.unshift(res.data);
                    
                    that.formItem.num = that.scanData.length;
                    that.formItem.scan = '';
                }else{
                    that.$Message.error(res.details);
                }
            })
        },
        handCount(bool){//点击加减操作
            let that = this;
            if(bool){
                that.mailsNum++;
            }else{
                if(!bool && that.mailsNum == 1){
                    this.$Message.error('数量不能小于1');
                    return false;
                }
                that.mailsNum--;
            }
            that.hand();//更新购物车
        },
        sureScan(){//扫码
            wx.scanQRCode({
                needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
                scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
                success: function (res) {
                    var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
                    var patrn = /^(http|https)/;
                    if (patrn.exec(result))
                        result = result.slice(result.lastIndexOf('=') + 1);
                    var results = result.split(',');
                    if (results.length > 1) {
                        result = results[1];
                    }
                    that.formItem.scan = result;
                    that.sureClick();
                }
            });
        },
        hand(){//输入操作
            let that = this;
            if(!that.mailsNum){
                that.mailsNum = 1;
            }

            // 默认邮单对象
            let mailsObj = {
                Abbreviation:'',
                DeliverName:'--请选择快递--',
                PrintNo:'',
                StampNumber:''
            }
            that.mailsNum = Math.abs(that.mailsNum);
            
            let num = Math.abs(num = that.mailsNum - that.mailsList.length);

            if(that.mailsNum > that.mailsList.length){
                for(let i=0;i<num;i++){
                    let k = (that.mailsNum-i)-1;
                    that.$set(that.mailsList,k,JSON.parse(JSON.stringify(mailsObj)));
                    // that.$set(that.mailsList,k,mailsObj);
                }
            }else{
                that.mailsList.splice(that.mailsNum,num);
            }
        },
        chooseMails(name){//选择快递
            console.log(name);
            let that = this;
            let mails = name.split("&");
            let nowIndex = mails[1];
            that.mailsList[nowIndex].Abbreviation = mails[0];
            for(let j of that.mailsData){
                if(j.Abbreviation == that.mailsList[nowIndex].Abbreviation){
                    that.mailsList[nowIndex].DeliverName = j.Title;
                    let nowObj = {...that.mailsList[nowIndex]};
                    that.$set(that.mailsList,nowIndex,nowObj);
                    break;
                }
            }
        },
        deliveryOrder(){//确认发货
            let that = this;
            if(that.scanData.length == 0){
                that.$Message.warning('请输入条码');
                return false;
            }

            let isMailsS = false;//校验邮单号
            let isMailsA = false;//校验货运方式
            for(let j of that.mailsList){
                if(!j.StampNumber){
                    isMailsS = true;
                    break;
                }
                if(!j.Abbreviation){
                    isMailsA = true;
                    break;
                }
            }
            if(isMailsS){
                that.$Message.warning('请输入邮单号或扫码');
                return false;
            }
            if(isMailsA){
                that.$Message.warning('选择货运方式');
                return false;
            }

            let isNumG = 0;//当前商品数量
            let isNumS = 0;//当前条码数量

            for(let i of that.goodsList){
                isNumG += parseInt(i.Number);
            }
            for(let j of that.scanData){
                isNumS += parseInt(j.Count);
            }

            if(isNumG != isNumS){
                that.$Message.warning('发货数量与扫码数量不同');
                return false;
            }

            let sendParam = {
                OrderNo:that.orderNo,
                GoodsCodeJson:JSON.stringify(that.scanData),
                StampNumberJson:JSON.stringify(that.mailsList)
            }
            let url = '';
            if(that.goodsIds){//分批发货
                url = 'User/SetSellSendOrderDeliver';
                let postGoods = []
                for(let j of that.goodsList){
                    postGoods.push({
                        GoodsNo:j.GoodsNo,
                        UnitNumber:j.UnitNumber,
                        Number:j.Number
                    })
                }
                // sendParam.GoodsDetailJson = JSON.stringify(postGoods);
                wxpost('API/PostEn',{Content:JSON.stringify(postGoods)}).then(res =>{
                    if(res.code == 200){
                        sendParam.GoodsDetailJson = res.details;
                        that.submitOrder(url,sendParam);
                    }else{
                        that.$Message.error(res.details);
                    }
                })
            }else{//常规发货
                url = 'User/SetSellOrderDeliver';
                sendParam.FarePrice = that.orderData.FarePrice;
                that.submitOrder(url,sendParam);
            }
            console.log(sendParam);
            
        },
        submitOrder(url,param){//发货
            let that = this;
            wxpost(url,param).then(res =>{
                if(res.code == 200){
                    let nowScanData = {
                        BuyName:that.orderData.BuyUserName,
                        scanCodeJson:[]
                    };
                    for(let k of that.scanData){
                        nowScanData.scanCodeJson.push({
                            GoodsCode: k.ScanCode,
                            scan_time: k.nowTime
                        })
                    }
                    
                    nowScanData.scanCodeJson = JSON.stringify(nowScanData.scanCodeJson);
                    
                    wxpost('User/InsertGoodsByScanCodeByRetail',nowScanData).then(res =>{
                        if(res.code == 200){
                             that.$Message.success({
                                content:'订单提交成功',
                                duration:1,
                                onClose(){
                                    that.$router.push({name:'fenxiaoOrder',params: {status:-1}});//跳转
                                }
                            }); 
                        }else{
                            that.$Message.error(res.details);
                        }
                    })
                }else{
                    that.$Message.error(res.details);
                }
            })
        },
        mailsScan(index){//扫描邮单号
            wx.scanQRCode({
                needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
                scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
                success: function (res) {
                    var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
                    var patrn = /^(http|https)/;
                    if (patrn.exec(result))
                        result = result.slice(result.lastIndexOf('=') + 1);
                    var results = result.split(',');
                    if (results.length > 1) {
                        result = results[1];
                    }

                    let nowObj = that.mailsList[index];
                    nowObj.StampNumber = result;
                    that.$set(that.mailsList,index,nowObj);//扫邮单号后更新
                }
            });
        }
    },
    mounted(){
        let that = this;
        that.orderNo = that.$route.params.OrderNo;
        that.goodsIds = that.$route.query.ids;
        console.log(that.goodsIds);
        that.load(that.orderNo);
        that.getMails();

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
            padding:0.5333rem 0.4rem 0;//20px 15px 0;
            .cont_top{
                &>.title{
                    padding: 0 0 0.2667rem 0;
                    font-size: 0.4266rem;
                }
                &>.fix{
                    margin-bottom:0.2667rem;
                    padding:0.1333rem 0;
                    p{
                        white-space: normal;
                        overflow-wrap: break-word;
                        word-break: break-all;
                        &:nth-child(1){
                            font-size:0.3733rem;
                            span{
                                margin-right:0.2667rem;
                                em{
                                    color:#101010;
                                }
                            }
                        }
                    }
                }
                .ivu-divider-horizontal{
                    margin:0;
                    color:#B5B5B6;
                }
            }
            .line{
                margin:0;
                height:0.2667rem;
                margin-left: -0.4rem;
                width: 10rem;
            }
            .cont_cont{
                .cont{
                    .list{
                        padding:0.2667rem 0;
                        position: relative;
                        .ivu-row{
                            .ivu-col{
                                &:nth-child(2){
                                    padding:0 0 0 0.2667rem;// 5px 10px
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
                                        span{
                                            float:right;
                                        }
                                        em{
                                            color:#ad7a2b;
                                        }
                                    }
                                }
                            }
                        }
                        .carfix_line{
                            position:absolute;
                            top:auto !important;
                            bottom:0;
                            margin: 0;
                        }
                    }
                }
            }
            .cont_down{
                p{
                    font-size:0.3733rem;// 14px;
                    padding: 0.1333rem 0;
                    &.down_t{
                        padding:0.2667rem 0 0.1333rem;
                        span{
                            &:nth-child(1){
                                margin-right:0.2667rem;
                            }
                            &.down_scan{
                                float:right;
                            }
                            i{
                                font-size:0.5333rem;
                                vertical-align: bottom;
                                line-height: 1;
                            }
                        }
                    }
                    &.down_d{
                        display:flex;
                        span{
                            padding-top:0.1333rem;
                        }
                        input{
                            flex:1;
                            border:none;
                            padding:0 0.2667rem;
                        }
                        button{
                            background:#fff;
                            color:#727171;
                            border:1px solid #727171;
                            padding: 0.1333rem 0.2667rem;
                            border-radius: 4px;
                        }
                    }
                }
                div.down_m{
                    p{
                        overflow: hidden;
                        background: #009788;
                        color: #fff;
                        span{
                            margin-right:0.1333rem;
                            overflow: hidden;
                            float: left;
                            i{
                                width:0.533rem;
                                height:0.533rem;
                                padding:0;
                                display: flex;
                                flex-direction: column;
                                align-items: center;
                                justify-content: center;
                                border-radius:0;
                                color:#fff;
                                border:1px solid #fff;
                                float: left;
                            }
                            input{
                                float: left;
                                width:1rem;
                                height: 0.533rem;
                                padding: 0;
                                border-radius: 0;
                                border:1px solid #fff;
                                background:#009788;
                                color:#fff;
                                border-left: none;
                                border-right: none;
                                text-align: center;
                            }
                        }
                    }  
                }
                .down_f{
                    text-align: right;
                    font-size:0.3733rem;
                    span{
                        color:#009788;
                        margin-left:0.1333rem;
                    }
                }
            }
            .foot-nav-containner{
                position: fixed;
                bottom:0;
                width: 100%;
                z-index: 1001;
                border-top: 1px solid #ddd;
                background: #fff;
                .bottom-nav{
                    display: flex;
                    .bottom-nav__li{
                        height: 1.0667rem;
                        position: relative; 
                        &:nth-child(1){
                            flex:3;
                            display: flex;
                            justify-content: flex-start;
                            align-items: center;
                            span{
                                font-size:0.3733rem;
                                color:#727171;
                                margin-right:0.1333rem;
                                em{
                                    color:#ad7a2b;
                                }
                            }
                        }
                        &:nth-child(2){
                            flex:1;
                            button{
                                background:#009788;
                                height: 1.0667rem;
                                line-height: 1.0667rem;
                                color:#fff;
                                width: 2.4rem;
                                outline: 0;
                                border: none;
                                box-shadow:none;
                                padding-right:0.2667rem;
                            }
                            
                        }
                    }
                }
            }
        }
    }
</style>
<style>
    .send .ivu-table td,.send .ivu-table th{
        text-align: center;
    }
    .send .ivu-table-cell{
        padding-left:0;
        padding-right:0;
        text-align:center;
    }
    .send .ivu-dropdown{
        flex:1;
    }
    .send .ivu-dropdown .ivu-dropdown-rel a{
        display: inherit;
        text-align: right;
        color:#727171;
    }
    .send .ivu-dropdown .ivu-dropdown-rel a span{
        float:left;
        padding-top:0 !important;
    }
    .send .ivu-dropdown .ivu-select-dropdown{
        left:auto !important;
        right:0.4rem;
        max-height:4rem;
        overflow-y: scroll;
    }
    .send .down_d .ivu-input-wrapper{
        flex:1;
        padding-left:0.2667rem;
    }
    .send .ivu-input,.send .ivu-input:hover,.send .ivu-input:focus{
        border:none;
    }
</style>
