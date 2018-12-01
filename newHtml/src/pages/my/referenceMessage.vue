<template>
    <div id="container" class="referenceMessage">
        <div class="content">
            <!-- <Input v-if="isReference" class="cont-no-top" autofocus placeholder="输入手机号/微信号" v-model.trim()="searchText">
                <i class="iconfont icon-seach" slot="prefix"  @click="Search()"></i>
            </Input> -->
           
            <Select v-if="isReference" v-model.trim()="searchText" clearable placeholder="输入手机号/微信号" filterable remote :remote-method="Search"   @on-change="select" @on-clear="sClear">
                <Option v-for="item in referenceList" :value="item.F_Id" :key="item.F_Id" :label="item.UserPhone">
                    <p><span>昵称:<em>{{item.UserName}}</em></span><span>微信号<em>{{item.WeChat}}</em></span></p>
                </Option>
            </Select>
            
            <Card class="cont-cont">
                <CellGroup>
                    <Cell title="头像" class="userImg">
                        <img v-if="referenceData.UserImg" v-lazy="referenceData.UserImg" :key="referenceData.UserImg" alt="" slot="extra" />
                        <img v-else src="../../assets/images/user.png" slot="extra" />
                    </Cell>
                    <Cell title="昵称" :extra="referenceData.RecommendName"/>
                    <Cell title="微信号" :extra="referenceData.RecommendWeChat" />
                    <Cell title="真实姓名" :extra="referenceData.RealName" />
                    <Cell title="联系电话" :extra="referenceData.RecommendPhone" />
                </CellGroup>
            </Card>
        </div>

        <foot-common v-if="!isReference" :btnText="text" :icon="iconf" @click.native="back"></foot-common>
        <foot-common v-else :btnText="text" :icon="iconf" @click.native="save"></foot-common>
    </div>
</template>
<script>
import {wxget,wxpost} from '@/axios/ajax';
import {isLoading} from '@/assets/js/load.js';
import footCommon from '@/components/foot-common.vue';
export default {
    name: 'referenceMessage',
    data() {
        return{
            selRow:{},
            referenceData:{},
            isReference:false,//是否存在推荐人
            searchText:'',
            referenceList:[],
            text:'返回',
            iconf:'',
        }
    },
    components: {
        footCommon
    },
    methods:{
        getTop(){//获取推荐人资料
            let that = this;
            wxget('User/GetUserRecommendInfo').then(res =>{
                if(res.code == 200){
                    console.log(res);
                
                    that.referenceData = res.data;

                    if(that.referenceData.F_Id && that.referenceData.F_Id != ''){
                        that.isReference = false;
                    }else{
                        that.isReference = true;
                        that.text = '保存';  
                    }
                }else{
                    that.$Message.console.error(res.details);   
                }
            })
        },
        Search(val){//获取推荐人list
            let that = this;
            // that.searchText = val;
            if(!val || val == ''){
                that.$Message.warning('请输入搜索内容');
                return false;
            }
            
            wxget('User/GetUserInfo_TopUserId/'+val).then(res =>{
                if(res.code == 200){
                    that.referenceList = res.data;
                    that.isTrue = true;
                }else{
                    that.$Message.error(res.details);
                }
            })   
        },
        select(val){//选中
            let that = this;
            for(let j of that.referenceList){
                if(j.F_Id == val){
                    that.referenceData.F_Id = j.F_Id;
                    that.referenceData.UserImg = j.UserImg;
                    that.referenceData.RecommendName = j.UserName;
                    that.referenceData.RecommendWeChat = j.WeChat;
                    that.referenceData.RealName = j.RealName;
                    that.referenceData.RecommendPhone = j.UserPhone;
                    break;
                }
            }
        },
        sClear(){//清除
            let that = this;
            that.referenceData = {};
            that.referenceList = [];
        },
        save(){//保存推荐人信息
            let that = this;
            if(!that.referenceData.F_Id || that.referenceData.F_Id){
                that.$Message.warning('当前没有推荐人信息！请重新查询');
                return false;
            }
            let referenceParam = {
                F_Id:that.referenceData.F_Id,
                phone:that.referenceData.RecommendPhone,
                weChat:that.referenceData.RecommendWeChat,
                nickName:that.referenceData.RecommendName
            }
            isLoading(that,'绑定信息中···')
            wxpost('User/Recommend_SubmitForm/',referenceParam).then(res =>{
                that.$Spin.hide();
                if(res.code == 200){
                    that.$Message.success({
                        content:res.details,
                        duration:0.5,
                        onClose(){ 
                        that.$router.push({name:'referenceMessage'});
                        }
                    });  
                }else{
                    that.$Message.error(res.details);
                }
            })
        },
        back(){//返回上一页面
            let that = this;
            that.$router.go(-1);
        },
    },
    mounted(){
        let that = this;
        that.getTop();
    }
}
</script>
<style lang="scss" scoped>
    #container{
        padding-bottom: 1.333rem;
        .content{
            padding:0.5333rem 0.4rem 0;//20px 15px 0;
            .cont-no-top{
                border-bottom:1px solid #ddd;
            }
            .cont-cont{
                box-shadow: none;
                border:none;
                padding:0;
                .ivu-card-body{
                    .ivu-cell-group{
                        background:#fff;
                        .ivu-cell{
                            &:not(:first-of-type){
                                border-top:1px solid #ddd;
                                padding-left:0;
                                padding-right:0;
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
                        margin:0.2rem 0 0.2rem;
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
        }
    }
</style>
<style>
    .referenceMessage .userImg>.ivu-cell-link{
        height:1.3333rem;
        line-height:1.3333rem;
        display: inherit;
    }
    .referenceMessage .ivu-card .ivu-card-body{
        padding:0;
    }
    .referenceMessage .ivu-card .ivu-cell-footer{
        right:0;
    }
    .referenceMessage .ivu-input,.referenceMessage .ivu-input:hover,.referenceMessage .ivu-input:focus{
        border:none;
    }
    .referenceMessage .ivu-select-dropdown-list .ivu-select-item p{
        font-size:0.3733rem;
        color:#888888;
        overflow: hidden;
    }
    .referenceMessage .ivu-select-dropdown-list .ivu-select-item p span{
        float:left;
        width:50%;
    }
    .referenceMessage .ivu-select-dropdown-list .ivu-select-item p span em{
        color:#101010;
        margin-left:0.1333rem;
    }
    .referenceMessage .ivu-select-dropdown-list .ivu-select-item-selected p span em{
        color:#009788;
    }
    .referenceMessage .ivu-select-single .ivu-select-selection,.referenceMessage .ivu-select-selection-focused,.referenceMessage .ivu-select-selection:hover{
        border:none;
        box-shadow: none;
        outline:0;
    }
    .referenceMessage .content input,.referenceMessage .content input:hover,.referenceMessage .content input:focus{
        border:1px solid #ddd;
        border-radius: 4px;
    }
</style>
