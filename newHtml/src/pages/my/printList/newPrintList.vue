<template>
    <div id="container" class="newPrintList">
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
                    <span>详细地址</span>
                    <input type="text" placeholder="请输入详细地址" v-model="selRow.Address"/>
                </li>
                <Divider />
                <li class="carfix">
                    <span>单位名称</span>
                    <input type="text" placeholder="请输入单位名称" v-model="selRow.Company"/>
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
            </ul>
        </div>
        <div class="foot">
            <p><em>*</em>请在连接打印机的电脑下载并安装打印控件C-lodop，并在上方填写安装打印机的电脑网络IP地址，即可在局域网下实现邮单打印。</p>
        </div>
        <foot-common :btnText="text" :icon="iconf" @click.native="savePrint"></foot-common>
    </div>
    
</template>

<script>
import footCommon from '@/components/foot-common.vue';//获取组件
import {wxget,wxpost} from '@/axios/ajax';
export default {
    name: 'orderindex',
    data() {
        return{
            text:'保存',
            iconf:'',
            isId:'',//是否新增操作
            nowId:'',//修改时id
            selRow:{},//信息保存对象
          
        }
    },
    components: {
        footCommon
    },
    methods:{
        savePrint(){
            let that = this;
            console.log(that.areaText);
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
            if(!that.selRow.Address || that.selRow.Address == ''){
                that.$Message.warning('详细地址不能为空！');
                return false;
            }  
            if(!that.selRow.Company || that.selRow.Company == ''){
                that.$Message.warning('单位名称不能为空！');
                return false;
            }
            if(!that.selRow.IP || that.selRow.IP == ''){
                that.$Message.warning('打印机IP不能为空！');
                return false;
            } 
            if(!that.selRow.PrinterTitle || that.selRow.PrinterTitle == ''){
                that.$Message.warning('打印机名称不能为空！');
                return false;
            } 
            if(that.isId != 0){//修改操作
                wxpost('User/SetUserExpressConfigEdit',that.selRow).then(res =>{
                    if(res.code == 200){
                        that.$Message.success(res.message);
                        // that.$router.go(0);
                        that.selRow = {};
                    }else{
                        that.$Message.error(res.message);
                    }
                }).catch(res =>{
                    console.log(res);
                })
            }else{//新增操作
                wxpost('User/SetUserExpressConfig',that.selRow).then(res =>{
                    if(res.code == 200){
                        that.$Message.success(res.message);
                        // that.$router.go(0);
                        that.selRow = {};
                    }else{
                        that.$Message.error(res.message);
                    }
                }).catch(res =>{
                    console.log(res);
                })
            }
        },
    },
    mounted(){
        let that = this;
        that.isId = that.$route.params.id;
        if(that.isId == 0){
            window.document.title = '新增打印操作';
        }else{
            window.document.title = '修改打印操作';
            wxget('User/GetUserExpressConfigById/'+that.isId).then(res =>{
                if(res.code == 200){
                    that.selRow = res.data;
                }else{
                    that.$Message.error(res.message);
                }
            }).catch(res =>{
                console.log(res);
            })
        }
        
    }
}
</script>
<style lang="scss" scoped>
// @import '../../assets/css/base.scss';
    #container{
        padding-bottom: 1.0667rem;
        .content{
            padding:0.5333rem 0.4rem 0.2667rem;// 20px 15px 10px;
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
                }
                .ivu-divider-horizontal{
                    margin:0;
                    color:#B5B5B6;
                }
            }
        }
        .foot{
            padding: 0 0.4rem;//0 15px
            p{
                em{
                    color:red;
                }
                color:#727171;
                font-size:0.32rem;//12rem
                line-height: 2;
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
</style>



