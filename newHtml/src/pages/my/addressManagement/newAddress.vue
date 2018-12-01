<template>
    <div id="container" class="newAddress">
        <div class="content">
            <ul>
                <li class="carfix">
                    <span>收货人</span>
                    <input type="text" placeholder="请输入收货人" v-model="selRow.ReceiveName"/>
                </li>
                <Divider />
                <li class="carfix">
                    <span>联系电话</span>
                    <input type="text" placeholder="请输入联系电话" v-model="selRow.Cellphone" onkeyup="this.value=this.value.replace(/\D/g,'')" onafterpaste="this.value=this.value.replace(/\D/g,'')" />
                </li>
                <Divider />
                <li class="carfix">
                    <span>所在地区</span>
                    <Cascader :data="areaData" placeholder="请选择地区" v-model="areaText" @on-change="chooseArea" change-on-select></Cascader>
                </li>
                 <Divider />
                <li class="carfix">
                    <span>详细地址</span>
                    <input type="text" placeholder="请输入详细地址" v-model="selRow.StreetAddress"/>
                </li>
            </ul>
        </div>
        <foot-common :btnText="text" :icon="iconf" @click.native="saveAddress"></foot-common>
    </div>
</template>
<script>
import footCommon from '@/components/foot-common.vue';//获取组件
import {wxget,wxpost} from '@/axios/ajax';
import areaList from '@/assets/js/area.js';//获取组件
import {isLoading} from '@/assets/js/load.js'
export default {
    name: 'newAddress',
    data() {
        return{
            text:'保存',
            iconf:'',
            isId:'',//是否新增操作
            isCar:'',
            areaData:areaList,
            areaText:[],
            selRow:{

            }
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
            // console.log(selectedData);
        },
        saveAddress(){
            let that = this;
            if(!that.selRow.ReceiveName || that.selRow.ReceiveName == ''){
                that.$Message.warning('寄件人不能为空！');
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
                that.$Message.warning('地区不能为空！');
                return false;
            }
            if(!that.selRow.StreetAddress || that.selRow.StreetAddress == ''){
                that.$Message.warning('单位名称不能为空！');
                return false;
            }
            let url = '';
            if(that.isId){
                that.selRow.Id = that.isId;
                url = 'User/SetUserAddressEdit';
            }else{
                url = 'User/SetUserAddress';
            }
            isLoading(that,'保存中···');
            wxpost(url,that.selRow).then(res =>{
                that.$Spin.hide();
                if(res.code == 200){
                    that.selRow = {};
                    that.areaText = [];
                    if(that.isCar){
                        that.$Message.success({
                            content:res.message,
                            duration:1,
                            onClose(){ 
                                that.$router.push({name:"addressList",query:{ids:that.isCar}});
                            }
                        });
                        return false;
                    }
                    if(that.isId){
                        that.$Message.success({
                            content:res.message,
                            duration:1,
                            onClose(){ 
                                that.$router.push({name:"addressList"});
                            }
                        });
                        return false;
                    }
                   if(!that.isCar && !that.isId){
                       that.$Message.success(res.message);
                       return false;
                   }  
                }else{
                    that.$Message.error(res.message);
                }
            })
        }
    },
    mounted(){
        let that = this;
        that.isId = that.$route.params.id;
        that.isCar = that.$route.query.ids || '';
        if(that.isId == 0){
            window.document.title = '新增地址';
        }else{
            window.document.title = '修改地址';
            wxget('User/GetUserAddressById/'+that.isId).then(res =>{
                console.log(res);
                if(res.code == 200){
                    that.selRow = res.data;
                    if(res.data.Province){
                        that.areaText.push(res.data.Province);
                    }
                    if(res.data.City){
                        that.areaText.push(res.data.City);
                    }
                    if(res.data.County){
                        that.areaText.push(res.data.County);
                    }
                    console.log(that.areaText);
                }else{
                    that.$Message.error(res.message);
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
    .newAddress .ivu-dropdown .ivu-select-dropdown{
        left:auto !important;
        right:0.34rem;
        max-height: 4rem;
        overflow-y: scroll
        /* right:15px */
    }
    .newAddress .ivu-cascader .ivu-select-dropdown{
        left:auto !important;
        right:0.34rem;
        /* max-height: 4rem;
        overflow-y: scroll */
    }
    .newAddress .ivu-cascader .ivu-input,.newAddress .ivu-cascader .ivu-input:hover,.newAddress .ivu-cascader .ivu-input:focus{
        border:none;
        outline:0;
        box-shadow:none;
        height:0.5333rem;
        line-height:1;
        color:#727171;
    }
</style>
