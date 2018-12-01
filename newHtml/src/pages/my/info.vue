<template>
    <div id="container" class="info">
        <Card class="content-up">
            <CellGroup>
                <Cell title="头像" class="userImg">
                    <img v-lazy="selRow.UserImg" :key="selRow.UserImg" alt="" slot="extra" @click="slide(0)" />
                </Cell>
                <Cell title="昵称" :extra="selRow.UserName" @click.native="slide(1)"/>
                <Cell title="昵称" v-show="isShow && num == 1">
                    <div slot="extra" class="cont_r">
                        <input type="text" v-model="selRow.UserName" autofocus="autofocus" /><button @click.stop="save(1)">保存</button><button @click.stop="slide(1,true)">取消</button>
                    </div>
                </Cell>
                <Cell title="真实姓名" :extra="selRow.RealName" @click.native="slide(2)"/>
                <Cell title="真实姓名" v-show="isShow && num == 2">
                    <div slot="extra" class="cont_r">
                        <input type="text" v-model="selRow.RealName" autofocus="autofocus" /><button @click.stop="save(2)">保存</button><button @click.stop="slide(2,true)">取消</button>
                    </div>
                </Cell>
                <Cell title="手机号" :extra="infoData.UserPhone" />
                <Cell title="支付宝账号" :extra="selRow.AliPay" @click.native="slide(3)"/>
                <Cell title="支付宝账号" v-show="isShow && num == 3">
                    <div slot="extra" class="cont_r">
                        <input type="text" v-model="selRow.AliPay" autofocus="autofocus" /><button @click.stop="save(3)">保存</button><button @click.stop="slide(3,true)">取消</button>
                    </div>
                </Cell>
                <Cell title="开户银行" :extra="selRow.BankName" @click.native="slide(4)" />
                <Cell title="银行卡号" :extra="selRow.BankNumber" @click.native="slide(4)"/>
                <Cell  v-show="isShow && num == 4" style="overflow:unset !important;">
                    <div class="cont_r">
                        <div class="r_fix">
                            <span>开户银行:</span>
                            <Dropdown trigger="click" @on-click="chooseBank" >
                                <a href="javascript:void(0)">
                                    <span>{{selRow.BankName}}</span>    
                                    <Icon type="ios-arrow-down"></Icon>
                                </a>
                                <DropdownMenu slot="list">
                                    <DropdownItem :name="item.value" v-if="bankData.length>0" v-for="(item,index) in bankData" :key="index" :selected="item.text == selRow.BankName ? true : false">{{item.text}}</DropdownItem>
                                    <DropdownItem v-else>暂无其他银行</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </div>
                        <div class="r_fix">
                            <span>银行卡号:</span><input type="text" v-model="selRow.BankNumber" autofocus="autofocus" style="padding-left:0.1333rem;" />
                        </div>
                        <Divider />
                        <div class="r_foot">
                            <button @click.stop="save(4)">保存</button><button @click.stop="slide(4,true)">取消</button>
                        </div>
                    </div>
                </Cell>

                <Cell title="经销级别" :extra="infoData.AgentLevelName"/>
            </CellGroup>
        </Card>
        <Card class="content-down">
            <CellGroup>
                <Cell title="地址管理" :to='{name:"addressList"}' >
                    <i class="iconfont icon--313" slot="icon"></i>
                </Cell>
                <Cell title="更换手机" :to='{name:"forgetPhone"}'>
                    <i class="iconfont icon--213" slot="icon"></i>
                </Cell>
                <Cell title="登录密码" :to='{name:"changePassword"}'>
                    <i class="iconfont icon--113" slot="icon"></i>
                </Cell>
                <!-- <Cell title="支付密码" to="''">
                    <i class="iconfont icon-zhangdan" slot="icon"></i>
                </Cell> -->
                <Cell title="我的二维码" to="''">
                    <i class="iconfont icon--93" slot="icon"></i>
                </Cell>
                <Cell title="上级资料" :to='{name:"superiorMessage"}'>
                    <i class="iconfont icon--47" slot="icon"></i>
                </Cell>
                <Cell title="推荐人资料" :to='{name:"referenceMessage"}'>
                    <i class="iconfont icon--63" slot="icon"></i>
                </Cell>
                <Cell title="授权证书" to="''">
                    <i class="iconfont icon--47" slot="icon"></i>
                </Cell>
                <Cell title="电子面单" :to='{name:"surfaceSingle"}'>
                    <i class="iconfont icon--63" slot="icon"></i>
                </Cell>
                <Cell title="添加打印" :to='{name:"printList"}'>
                    <i class="iconfont icon--46" slot="icon"></i>
                </Cell>
                <Cell title="更多公告" :to='{name:"newsList"}'>
                    <i class="iconfont icon--53" slot="icon"></i>
                </Cell>
                <Cell title="关于我们" to="''">
                    <i class="iconfont icon--83" slot="icon"></i>
                </Cell>
                <Cell title="帮助" :to='{name:"help"}' >
                    <i class="iconfont icon--73" slot="icon"></i>
                </Cell>
            </CellGroup>
        </Card>
    </div>
</template>
<script>
import {getLoginUser} from '@/assets/js/assist.js';
import bankList from '@/assets/js/bank.js';//获取组件
import {wxget,wxpost,post} from '@/axios/ajax';
export default {
    name: 'info',
    components: {
    },
    data() {
        return{
            infoData:getLoginUser() ? getLoginUser() : '',
            selRow:{
                UserImg:'',
                UserName:'',
                RealName:'',
                AliPay:'',
                BankName:'',
                BankNumber:'' 
            },
            bankData:bankList,
            num:0,
            isShow:false
        }
    },
    methods:{
       slide(num,bool){//切换筛选
            let that = this;

            if(num == 0){
                that.chooseImg();
                return false
            }
            if(that.num != num){
                that.isShow = true;
                that.num = num;
                if(num == 4){
                    that.selRow.BankName = that.selRow.BankName ? that.selRow.BankName : '请选择开户银行';
                }
                return false;
            }
            that.num = num;
            if(typeof(bool) == 'undefined'){
                that.isShow = !that.isShow;
                if(!that.isShow){
                    that.selRow.BankName = that.selRow.BankName != '请选择开户银行' ? that.selRow.BankName : '';
                }else{
                    that.selRow.BankName = that.selRow.BankName ? that.selRow.BankName : '请选择开户银行';
                }
            }else{
                that.isShow = false;
                if(!that.isShow){
                    that.selRow.UserImg = that.infoData.UserImg;
                    that.selRow.UserName = that.infoData.UserName;
                    that.selRow.RealName = that.infoData.RealName;
                    that.selRow.AliPay = that.infoData.AliPay;
                    that.selRow.BankName = that.infoData.BankName;
                    that.selRow.BankNumber = that.infoData.BankNumber;     
                }
            }
       },
       chooseBank(name){
           console.log(name);
           let that = this;
           that.selRow.BankName = name;
       },
       chooseImg(){//切换图片
            wx.ready(function(){
                wx.chooseImage({
                    count: 1,
                    needResult: 1,
                    sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有  
                    sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
                    success: function (data) {
                        let localIds = data.localIds[0].toString(); // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片  
                       
                        wx.getLocalImgData({
                            localId: localIds, // 图片的localID
                            success: function (res) {
                                let localData = res.localData; // localData是图片的base64数据，可以用img标签显示
                                post('API/SetWXParam/',{method: "Image64Upload", Image: localData, UserId: that.infoData.F_Id}).then(reg =>{
                                    console.log(reg);
                                    // if(reg.code == 200){

                                    // }else{
                                    //     that.$Message.error(reg.details);
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
            })
            wx.error(function (res) {
                alert("出错了：" + res.errMsg);//这个地方的好处就是wx.config配置错误，会弹出窗口哪里错误，然后根据微信文档查询即可。
            });    
       },
       save(num){//保存修改
            let that = this;
            if(num == 1 && (!that.selRow.UserName || that.selRow.UserName == '')){
                that.$Message.warning('用户昵称不能为空！');
                return false;
            }
            if(num == 2 && (!that.selRow.RealName || that.selRow.RealName == '')){
                that.$Message.warning('用户真实姓名不能为空！');
                return false;
            }
            if(num == 3 && (!that.selRow.AliPay || that.selRow.AliPay == '')){
                that.$Message.warning('用户支付宝账号不能为空！');
                return false;
            }
            let reg = /(^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$)|(^[\w.\-]+@(?:[a-z0-9]+(?:-[a-z0-9]+)*\.)+[a-z]{2,3}$)/;
            if(num == 3 && !reg.test(that.selRow.AliPay)){
                that.$Message.warning('支付宝账号只能输入手机号或邮箱号');
                return false;
            }
            if(num == 4 && that.selRow.BankName == '请选择开户银行'){
                that.$Message.warning('请选择银行！');
                return false;
            }
            if(num == 4 && (that.selRow.BankNumber == '' || !that.selRow.BankNumber)){
                that.$Message.warning('银行卡号不能为空！');
                return false;
            }
            that.infoData.UserName = that.selRow.UserName;
            that.infoData.RealName = that.selRow.RealName;
            that.infoData.AliPay = that.selRow.AliPay;
            that.infoData.BankName = that.selRow.BankName;
            that.infoData.BankNumber = that.selRow.BankNumber;   

            wxpost('User/SetUserInfo',that.selRow).then(res =>{
                if(res.code == 200){
                    that.$Message.success(res.details);
                    localStorage.setItem('userInfo', JSON.stringify(that.infoData));//缓存个人信息
                }else{
                    that.$Message.error(res.details);
                }
            })

            
       }
    },
    mounted(){
        console.log(this.infoData);
        let that = this;
        that.selRow.UserName = that.infoData.UserName;
        that.selRow.RealName = that.infoData.RealName;
        that.selRow.AliPay = that.infoData.AliPay;
        that.selRow.BankName = that.infoData.BankName;
        that.selRow.BankNumber = that.infoData.BankNumber;       

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
                    jsApiList: ['checkJsApi', 'chooseImage', 'uploadImage', 'downloadImage','previewImage']
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
        padding-bottom: 1.3333rem;
        .content-up{
            box-shadow: none;
            border:none;
            .ivu-card-body{
                .ivu-cell-group{
                    background:#fff;
                    .ivu-cell{
                        &:not(:first-of-type){
                            border-top:1px solid #ddd;
                        }
                        .cont_r{
                            input{
                                border:none;
                            }
                            button{
                                background: #fff;
                                border: 1px solid #ccc;
                                padding:0.1333rem 0.2667rem;// 5px 10px;
                                margin-left:0.1333rem;
                                &:nth-child(2){
                                    border-color:#009788;
                                }
                            }
                            .r_fix{
                                display:flex;
                                input{
                                    flex:1;
                                }
                                .ivu-dropdown{
                                    flex:1;
                                }
                            }
                            .ivu-divider-horizontal{
                                margin:0.1333rem 0;
                            }
                            .r_foot{
                                text-align:right;
                                button{
                                    padding: 0 0.1333rem;
                                    &:nth-child(1){
                                        border-color:#009788;
                                    }
                                    &:nth-child(2){
                                        border-color:#fff;
                                    }
                                }
                            }
                        }
                    }
                }
                .userImg{
                    margin:0.2rem 0 0.2rem 0.4rem;
                    padding:0;
                    .ivu-cell-item{
                        img{
                            vertical-align:bottom;
                            width:1.3333rem;
                            height:1.3333rem;
                            border-radius:50%;
                        }
                    } 
                }
            }
        }
        .content-down{
            box-shadow: none;
            border:none;
            .ivu-card-body{
                .ivu-cell-group{
                    background:#fff;
                    .ivu-cell{
                        &:not(:first-of-type){
                            border-top:1px solid #ddd;
                        }
                    }
                }
            }
        }
    }
   
</style>
<style>
    .info .content-up .userImg>.ivu-cell-link{
        height:1.3333rem;
        line-height:1.3333rem;
        display: inherit;
    }
    .info .ivu-card .ivu-card-body{
        background: #F8F8F8;
        padding:0 0 0.268rem;
    }
    .info .ivu-cell-icon i{
        font-size:0.5333rem; 
        color:#009788;
    }
    .info .ivu-cell-main{
        width:100%;
    }
    .info .ivu-dropdown .ivu-select-dropdown{
        max-height:4rem;
        left:auto !important;
        right:0.4rem;
        overflow-y: scroll;
    }
    .info .ivu-dropdown .ivu-dropdown-rel a{
        display: inherit;
        text-align: right;
        color:#101010;
        padding: 0 0 0 0.1333rem;
    }
    .info .ivu-dropdown .ivu-dropdown-rel a span{
        float:left;
    }
</style>


