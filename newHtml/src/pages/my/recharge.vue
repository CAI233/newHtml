<template>
    <div id="container" class="recharge">
        <div class="row row_z" v-if="infoData.AgentLevel<3">
            <p>请输入充值金额并选择支付方式</p>
            <Divider />
            <ul>
                <li class="carfix">
                    <span>选择政策</span>
                    <Dropdown trigger="click" @on-click="choosePolicy" >
                        <a href="javascript:void(0)">
                            <span>{{policyText}}</span>    
                            <Icon type="ios-arrow-down"></Icon>
                        </a>
                        <DropdownMenu slot="list">
                            <DropdownItem :name="item.F_Id" v-if="policyData.length>0" v-for="(item,index) in policyData" :key="index" :selected="item.F_Id == policyId ? true : false">{{item.Title}}</DropdownItem>
                            <DropdownItem v-else>暂无政策</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </li>
                <Divider />
                <li class="carfix">
                    <span>充值金额</span>
                    <input type="text" onkeyup="this.value=this.value.replace(/\D/g,'')" onafterpaste="this.value=this.value.replace(/\D/g,'')" v-model="rechargeNum" v-on:input="hand(rechargeNum)" placeholder="请输入充值金额"/>
                    元
                </li>
                <Divider />
                <li class="carfix">
                    <span>支付方式</span>
                    <Row>
                        <Col offset="2" span="10" @click.native="choose(1)">
                            <i class="iconfont " :class="!isTrue ? 'icon-xuanzhong' : 'icon-weixuanzhong'"></i><i class="iconfont icon-big-WeChat"></i>微信
                        </Col>
                        <Col offset="2" span="10" @click.native="choose(2)">
                            <i class="iconfont " :class="isTrue ? 'icon-xuanzhong' : 'icon-weixuanzhong'"></i><i class="iconfont icon-big-WeChat"></i>支付宝
                        </Col>
                    </Row>
                </li>
                <Divider />
            </ul>
            <div class="foot">
                <Button type="primary" long @click="submit(true)">充值</Button>
            </div>
        </div>
        <div class="row row_l" v-else>
            <p>请输入充值金额并选择支付方式</p>
            <Divider />
            <ul>
                <li class="carfix">
                    <span>充值渠道</span>
                    <Dropdown trigger="click" @on-click="chooseChannel" >
                        <a href="javascript:void(0)">
                            <span>{{channelText}}</span>    
                            <Icon type="ios-arrow-down"></Icon>
                        </a>
                        <DropdownMenu slot="list">
                            <DropdownItem :name="item.id" v-if="channelData.length>0" v-for="(item,index) in channelData" :key="index" :selected="item.id == channelId ? true : false">{{item.text}}</DropdownItem>
                            <DropdownItem v-else>暂无渠道</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </li>
                <Divider />
                <li class="carfix">
                    <span>充值类型</span>
                    <Dropdown trigger="click" @on-click="chooseRecharge" >
                        <a href="javascript:void(0)">
                            <span>{{rechargeText}}</span>    
                            <Icon type="ios-arrow-down"></Icon>
                        </a>
                        <DropdownMenu slot="list">
                            <DropdownItem :name="item.id" v-if="rechargeData.length>0" v-for="(item,index) in rechargeData" :key="index" :selected="item.id == rechargeId ? true : false">{{item.text}}</DropdownItem>
                            <DropdownItem v-else>暂无充值类型</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </li>
                <Divider />
                <li v-if="isPolicy" class="carfix">
                    <span>选择政策</span>
                    <Dropdown trigger="click" @on-click="choosePolicy" >
                        <a href="javascript:void(0)">
                            <span>{{policyText}}</span>    
                            <Icon type="ios-arrow-down"></Icon>
                        </a>
                        <DropdownMenu slot="list">
                            <DropdownItem :name="item.F_Id" v-if="policyData.length>0" v-for="(item,index) in policyData" :key="index" :selected="item.F_Id == policyId ? true : false">{{item.Title}}</DropdownItem>
                            <DropdownItem v-else>暂无政策</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </li>
                <Divider v-if="isPolicy" />
                <li class="carfix">
                    <span>充值金额</span>
                    <input type="text" onkeyup="this.value=this.value.replace(/\D/g,'')" onafterpaste="this.value=this.value.replace(/\D/g,'')" v-model="rechargeNum" v-on:input="hand(rechargeNum)" placeholder="请输入充值金额"/>
                    元
                </li>
                <Divider />
                <li class="carfif">
                    <span>充值凭证</span>
                    <router-link to='' @click.native="voucherImg">
                        <i class="iconfont icon-shangchuan1"></i>选择要上传的凭证图片
                    </router-link>
                </li>
                <Divider />
                <li class="carfix">
                    <span>充值时间</span>
                    <!-- <DatePicker type="date" v-model="rechargeDate" :editable="false" placeholder="请选择时间" format="yyyy-MM-dd" @on-change="chooseDate"></DatePicker> -->
                    <Input placeholder="请选择时间" v-model="rechargeDate" readonly clearable>
                        <i class="iconfont icon-status-dd" slot="suffix" @click.stop="chooseDate"></i>
                    </Input>
                </li>
                <Divider />
                <li class="carfix">
                    <span>充值备注</span>
                    <input type="text"  v-model="rechargeRemark" placeholder="填写备注信息（选填）"/>
                </li>
                <Divider />
                <li class="carfix">
                    <img v-if="rechargeImg" v-lazy="rechargeImg" :key="rechargeImg" alt="" slot="extra">
                </li>
            </ul>
            <div class="foot">
                <Button type="primary" long @click="submit(false)">充值</Button>
            </div>
        </div>
    </div>
</template>
<script>
import {getLoginUser} from '@/assets/js/assist.js';
import {wxget,wxpost,post} from '@/axios/ajax';
import {isLoading} from '@/assets/js/load.js';
export default {
    name: 'myInfo',
    components: {
        
    },
    methods:{
       choosePolicy(name){//选择政策
            let that = this;
            that.policyId = name;
            that.policyData.map((item,key,arr) => {
                if(item.F_Id == name){
                    that.policyText = item.Title;
                }  
            })
       },
       load(){//加载政策
           let that = this;
           wxget('User/GetActivityListByTarget_HK').then(res =>{
               if(res.code == 200){
                   that.policyData = res.data;
               }else{
                   that.$Message.error(res.message);
               }
           }).catch(res =>{
               console.log(res);
           })
       },
       hand(num){
           let that = this;
           if(num == ''){
                that.rechargeNum = 0
            }else if(num.indexOf('0') == 0){
                that.rechargeNum = num.slice(1,num.length);
            }
       },
       choose(num){//选择支付类型
           let that = this;
           console.log(num)
           that.isTrue = !that.isTrue;
           that.ReChargeType = num;
       },
       submit(bool){//提交
           let that = this;
           if(bool){
                if(that.policyText == '--请选择政策--'){
                    that.$Message.warning('请选择政策');
                    return false;
                }
                if(!that.rechargeNum || that.rechargeNum == '' || that.rechargeNum == 0){
                    that.$Message.warning('充值金额不能为空或0');
                    return false;
                }
                let param = {
                        ActivityId:that.policyId,
                        ReChargePrice:that.rechargeNum,
                        ReChargeType:that.ReChargeType,
                }
                if(param.ReChargeType == 1){
                    wxpost('/User/ApplyRecharge',param).then(res =>{
                        console.log(res);
                        if(res.code == 200){
                            if (typeof WeixinJSBridge == "undefined"){
                                console.log(111111);
                            if( document.addEventListener ){
                                document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
                            }else if (document.attachEvent){
                                document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
                                document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
                            }
                            }else{
                                that.onBridgeReady(res.data);
                            }
                        }else{
                            that.$Message.error(res.message);
                        }
                    }).catch(res =>{
                        console.log(res);
                    })
                }else{
                    that.$Message.warning('支付宝支付');
                }
                
           }else{
               if(that.channelText == '--请选择充值渠道--'){
                   that.$Message.warning('请选择充值渠道');
                   return false;
               }
               if(that.rechargeText == '--请选择充值类型--'){
                   that.$Message.warning('请选择充值类型');
                   return false;
               }
               if(that.rechargeId == 2 && that.policyText == '--请选择政策--'){
                   that.$Message.warning('请选择政策');
                   return false;
               }
               if(!that.rechargeNum || that.rechargeNum == '' || that.rechargeNum == 0 ){
                   that.$Message.warning('充值金额不能为空或0');
                   return false;
               }
               if(!that.rechargeImg || that.rechargeImg == ''){
                   that.$Message.warning('请上传充值凭证');
                   return false;
               }
               if(!that.rechargeDate || that.rechargeDate == ''){
                   that.$Message.warning('请选择充值时间');
                   return false;
               }
               let param ={
                   ReChargeType:that.channelText,//充值渠道
                   PriceType:that.rechargeId,//充值类型
                   ActivityId:that.policyId,//政策
                   ReChargePrice:that.rechargeNum,//充值金额
                   ReChargeProof:that.rechargeImg,//充值凭证
                   PayDate:that.rechargeDate//充值时间
               }
               console.log(that.rechargeDate);

                isLoading(that,'充值中···');
                wxpost('User/SetApplyBalance',param).then(res =>{
                    if(res.code == 200){
                        that.$Spin.hide();
                        that.initFalse();
                        that.$Message.success({
                          content:'充值成功',
                          duration:1,
                          onClose(){ 
                            that.$router.push({name:'my'});
                          }
                        });   
                    }else{
                        that.$Message.error(res.message);
                    }
                })
           }
       },
       onBridgeReady(payparam){//总代官方充值
           WeixinJSBridge.invoke('getBrandWCPayRequest', payParam,
            function (res) {
                console.info(res);
                layer.alert('充值成功！', function (index) {
                    location.href = "my.html";
                });
                //alert(res.err_msg);
                //if(res.err_msg == "get_brand_wcpay_request：ok" ) {

                //}   // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回  ok，但并不保证它绝对可靠。
            }
            );
       },
       chooseChannel(name){//选择充值渠道
           let that = this;
           that.channelId = name;
           that.channelData.map((item,key,arr) => {
                if(item.id == name){
                    that.channelText = item.text;
                }  
            })
       },
       chooseRecharge(name){//选择充值类型
            let that = this;
            that.rechargeId = name;
            if(name == 2){//显示政策选择
                that.isPolicy = true;
                that.load();
            }else{
                that.isPolicy = false;
                that.policyId = '';
                that.policyText = '--请选择政策--';
            }
            that.rechargeData.map((item,key,arr) => {
                if(item.id == name){
                    that.rechargeText = item.text;
                }
            })
       },
       voucherImg(){//上传支付凭证
            let that = this;   
            wx.chooseImage({
                count: 1,
                needResult: 1,
                sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有  
                sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
                success: function (data) {
                    let localIds = data.localIds[0].toString(); // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片  
                    //wxuploadImage(localIds);//调用上传图片方法
                    let UserId = that.infoData.F_Id;
                    isLoading(that,'上传图片中···')
                    wx.getLocalImgData({
                        localId: localIds, // 图片的localID
                        success: function (res) {
                            let localData = res.localData; // localData是图片的base64数据，可以用img标签显示
                            post('Ajax/ImageUploadHandler.ashx',{method: "Image64Upload", Image: localData, UserId: userId}).then(res =>{
                                that.$Spin.hide();
                                that.rechargeImg = res;
                                // if(res.code == 200){
                                //     that.rechargeImg = res.
                                // }else{
                                //     that.$Message.error(res.message);
                                // }
                            })
                        }
                    });
                },
                fail: function (res) {
                    console.log(res)
                    alterShowMessage("操作提示", JSON.stringify(res), "1", "确定", "", "", "");
                }

            });
       },
       chooseDate(){//选择上传时间
           let that = this;
           that.$picker.show({
                type:'datePicker',
                onOk: (date) =>{
                    that.rechargeDate = date; 
                }
            });
       },
       initFalse(){//初始化
           let that = this;
           that.channelText = '--请选择充值渠道--';
           that.channelId = '';
           that.rechargeText = '--请选择充值类型--';
           that.rechargeId = '';
           that.isPolicy = false;
           that.policyText = '--请选择政策--';
           that.policyId = '';
           that.rechargeNum = 0;
           that.rechargeImg = '';
           that.rechargeDate = '';
           that.rechargeRemark = '';
       }
    },
    mounted(){
        let that = this;
        console.log(that.infoData);
        if(that.infoData.AgentLevel<3){
            that.load();
        }else{
            that.channelData = [
                {id:1,text:'微信'},
                {id:2,text:'支付宝'},
                {id:3,text:'银行'},
            ];
            that.rechargeData = [
                {id:2,text:'政策'},
                {id:3,text:'邮费'}
            ];
            // 加载上传图片配置
            // post('API/SetWXParam/',{Url: window.location.href}).then(res =>{
            //     if(res.code == 200){
            //         let nowCallback = res.data;
            //         wx.config({
            //             // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            //             debug: false,
            //             // 必填，公众号的唯一标识
            //             appId: nowCallback.appId,
            //             // 必填，生成签名的时间戳
            //             timestamp: nowCallback.timestamp,
            //             // 必填，生成签名的随机串
            //             nonceStr: nowCallback.nonceStr,
            //             // 必填，签名，见附录1
            //             signature: nowCallback.signature,
            //             // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            //             jsApiList: ['checkJsApi', 'chooseImage', 'uploadImage', 'downloadImage','previewImage']
            //         });
            //     }else{
            //         that.$Message.error(res.message);
            //     }
            // })
        }
        
    },
    data() {
        return{
            infoData:getLoginUser() ? getLoginUser() : '',
            policyData:[],
            policyText:'--请选择政策--',
            policyId:'',
            rechargeNum:0,//充值金额
            rechargeDate:'',//充值时间
            rechargeRemark:'',//充值备注
            rechargeImg:'',//充值凭证
            isTrue:false,//支付类型切换
            ReChargeType:1,
            channelData:[],//渠道数组
            channelId:'',//渠道id
            channelText:'--请选择充值渠道--',
            rechargeData:[],//充值类型
            rechargeId:'',
            rechargeText:'--请选择充值类型--',
            isPolicy:false,//是否显示政策
        }
    }
}
</script>
<style lang="scss" scoped>
    #container{
        padding-bottom: 1.3333rem;
        .row{
            padding: 0.5333rem 0.4rem 0; //20px 15px 0
            &>p{
                font-size:0.3733rem;// 14px;
                text-align: center;
                margin-bottom:0.26667rem;
            }
            .ivu-divider-horizontal{
                margin:0;
                color:#B5B5B6;
            }
            ul{
                .carfix{
                    display: box;
                    display: -webkit-box;
                    display: -ms-flexbox;
                    display: flex;
                    font-size: 0.3733rem;
                    padding: 0.2667rem 0;
                    align-items: center;
                    &>span{
                        margin-right:0.1333rem;//5px
                    }
                    &>.ivu-dropdown{
                        -prefix-box-flex: 1;
                        -webkit-box-flex: 1;
                        -ms-flex: 1;
                        flex: 1;
                        text-align: center;
                        .ivu-dropdown-rel {
                            a{
                                display: inherit;
                                text-align: left;
                                color: #727171;
                                text-align:right;
                                span{
                                    float:left;
                                }
                            }
                        }
                    }
                    &>.ivu-input-wrapper{
                        -prefix-box-flex: 1;
                        -webkit-box-flex: 1;
                        -ms-flex: 1;
                        flex: 1;
                    }
                    &>input{
                        -prefix-box-flex: 1;
                        -webkit-box-flex: 1;
                        -ms-flex: 1;
                        flex: 1;
                        line-height: inherit;
                        height:0.5333rem;// 20px;
                        padding:0 0.1333rem 0 0;// 0 5px;
                        outline: 0;
                        border: none;
                        box-shadow: none;
                    }
                    &>.ivu-row{
                        -prefix-box-flex: 1;
                        -webkit-box-flex: 1;
                        -ms-flex: 1;
                        flex: 1;
                        .ivu-col{
                            text-align:center;
                            i{
                                font-size:0.5333rem;
                                vertical-align:middle;
                                &:nth-child(1){
                                    margin-right:0.2667rem;//10px
                                    color:#009788;
                                }
                                &:nth-child(2){
                                    margin-right:0.1333rem;//5px
                                }
                            }
                            &:nth-child(1){
                                i{
                                    &:nth-child(2){
                                        color:#2aa146;
                                    }
                                }
                            }
                            &:nth-child(2){
                                i{
                                    &:nth-child(2){
                                        color:#00a1ea;
                                    }
                                }
                            }
                        }
                    }
                }
                .carfif{
                    overflow: hidden;
                    &>span{
                        line-height:1.0667rem;// 40px;
                        font-size:0.3733rem;//14px
                    }
                    &>a{
                        color: #fff;
                        background: #009788;
                        float: right;
                        height:1.0667rem;// 40px;
                        line-height: 1.0667rem;// 40px;
                        padding: 0 0.4rem;//0 15px;
                        font-size: 0.3733rem;// 14px;
                    }
                }
            }
            &>.foot{
                margin-top: 1rem;
                button{
                    height:1.0667rem;
                    width:100%;
                    font-size:0.3733rem;
                    color:#fff;
                    background:#009788;
                    border:none;
                    outline:0;
                    box-shadow:none;
                    border-radius: 4px;
                }
            }
        }
    }
   
</style>
<style>
   .recharge .ivu-dropdown .ivu-select-dropdown {
        left: auto !important;
        right: 0.4rem;
        max-height: 4rem;
        overflow-y: scroll /* right:15px */;
    }
    .recharge .ivu-input,.recharge .ivu-input:hover,.recharge .ivu-input:focus{
        border:none;
    }
</style>


