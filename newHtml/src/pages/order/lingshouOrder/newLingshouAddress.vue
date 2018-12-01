<template>
    <div id="container" class="newLingshouAddress">
        <div class="content">
            <ul class="cont_top">
                <li class="carfix">
                    <span>收货人</span>
                    <input type="text" placeholder="请输入收货人" v-model="selRow.ReceiveName"/>
                </li>
                <Divider />
                <li class="carfix">
                    <span>联系电话</span>
                    <input type="text" placeholder="请输入联系电话" v-model="selRow.Cellphone"/>
                </li>
                <Divider />
                <li class="carfix">
                    <span>所在地区</span>
                    <Cascader :data="areaData" placeholder="请选择地址" v-model="areaText" @on-change="chooseArea" change-on-select></Cascader>
                </li>
                <Divider />
                <li class="carfix">
                    <span>详细地址</span>
                    <input type="text" placeholder="请输入详细地址" v-model="selRow.StreetAddress"/>
                </li>
            </ul>
        </div>
        <foot-common :btnText="text" :icon="iconf" @click.native="saveLingshouAddress"></foot-common>
    </div>
</template>
<script>
import {wxget,wxpost} from '@/axios/ajax';
import {addCookie,getCookie,getCurrentDate,deleteCookie} from '@/assets/js/assist.js';
import footCommon from '@/components/foot-common.vue';
import areaList from '@/assets/js/area.js';//获取地址
import {isLoading} from '@/assets/js/load.js'
export default {
    name: 'newLingshouAddress',
    data() {
        return{
            text:'保存',
            iconf:'',
            isId:'',//是否是修改
            isTo:'',//是否是零售
            selRow:{

            },
            areaData:areaList,
            areaText:[],

        }
    },
    components: {
        footCommon
    },
    methods:{
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
        },
        saveLingshouAddress(){
            let that = this;
            if(!that.selRow.ReceiveName || that.selRow.ReceiveName == ''){
                that.$Message.warning('收货人不能为空！');
                return false;
            }
            if(!that.selRow.Cellphone || that.selRow.Cellphone == ''){
                that.$Message.warning('联系电话不能为空！');
                return false;
            }
            if (!/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/.test(that.selRow.Cellphone)) {
                that.$Message.warning('手机号格式有误！');
                return false;
            }
            if(that.areaText.length == 0){
                that.$Message.warning('所在地区不能为空！');
                return false;
            }
            if(!that.selRow.StreetAddress || that.selRow.StreetAddress == ''){
                that.$Message.warning('详细地址不能为空！');
                return false;
            }
            isLoading(that,'保存中···');
            if(that.isId != 0){
                that.selRow.Id = that.isId;
                that.saveLingshouAddress();
            }
        },
        saveLingshouAddress(){
            let that = this;
            wxpost('User/SetWxDeliveryInfoAddress',that.selRow).then(res =>{
            // wxpost('User/SetUserAddressEdit',that.selRow).then(res =>{
                that.$Spin.hide();
                if(res.code == 200){
                    that.init();
                    if(that.isTo){
                        that.$Message.success({
                            content:res.details,
                            duration:1,
                            onClose(){ 
                                that.$router.push({name:"lingshouAddress",query:{isTo:that.isTo}});
                            }
                        });
                        return false;
                    }
                    if(that.isId){
                        that.$Message.success({
                            content:res.details,
                            duration:1,
                            onClose(){ 
                                that.$router.push({name:"lingshouAddress"});
                            }
                        });
                        return false;
                    }
                   if(!that.isCar && !that.isId){
                       that.$Message.success(res.details);
                       return false;
                   }  
                }else{
                    that.$Message.error(res.details);
                }
            })
        },
        init(){//初始化
            let that = this;
            that.selRow = {};
            that.areaText = [];
        }
    },
    mounted(){
        let that = this;
        that.isId = that.$route.params.id;
        that.isTo = that.$route.query.isTo || '';
        if(that.isId == 0){
            window.document.title = '新增零售地址';
        }else{
            window.document.title = '修改零售地址';
            wxget('User/GetWxDeliveryInfoById/'+that.isId).then(res =>{
                if(res.code == 200){
                    that.selRow = res.data;
                    if(res.data.Province){//省
                        that.areaText.push(res.data.Province);
                    }
                    if(res.data.City){//市
                        that.areaText.push(res.data.City);
                    }
                    if(res.data.Area){//区
                        that.areaText.push(res.data.Area);
                    }
                    if(res.data.Phone){//电话
                        that.selRow.Cellphone = res.data.Phone;
                    }
                    if(res.data.Stree){//详细地址
                        that.selRow.StreetAddress = res.data.Stree;
                    }
                }else{
                    that.$Message.error(res.details);
                }
            })
        }
    }
}
</script>
<style lang="scss" scoped>
    #container{
        padding-bottom: 1.333rem;
        .content{
            padding:0.5333rem 0.4rem 0;//20px 15px 0;
            ul{
                .carfix{
                    display:flex;
                    position: relative;
                    font-size:0.3733rem;//14px
                    padding: 0.2667rem 0;//10px 0
                    &>span{
                        margin-right:0.2667rem;// 10px
                        color:#101010;
                    }
                    &>input{
                        flex: 1; 
                        border:none;
                        outline:0;
                        box-shadow:none;
                    }
                    &>.ivu-cascader{
                        flex: 1;
                    }
                    &>a{
                        flex:1;
                        color: #101010;
                        i{
                            float:right;
                        }
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
    .newLingshouAddress .ivu-cascader .ivu-select-dropdown{
        left:auto !important;
        right:0.34rem;
    }
    .newLingshouAddress input{
        border:none;
        color:#101010;
        height:0.5333rem;
        line-height:1;
    }
    .newLingshouAddress input::-webkit-input-placeholder{
    color:#101010;
    }

    .newLingshouAddress input:-moz-placeholder{
    color:#101010;
    }

    .newLingshouAddress input::-moz-placeholder{
    color:#101010;
    }
    .newLingshouAddress input:-ms-input-placeholder{
    color:#101010;
    }
    .newLingshouAddress textarea.ivu-input,.newLingshouAddress textarea.ivu-input:hover,.newLingshouAddress textarea.ivu-input:focus{
        border:none;
    }
</style>
