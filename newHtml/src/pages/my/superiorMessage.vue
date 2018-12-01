<template>
    <div id="container" class="superiorMessage">
        <div class="content">
            <div class="cont">
                <Input v-if="isReference" class="cont-no-top" autofocus placeholder="输入手机号/微信号" v-model.trim()="searchText">
                    <i class="iconfont icon-seach" slot="prefix"  @click="Search()"></i>
                </Input>
                <Card class="cont-cont">
                    <CellGroup>
                        <Cell title="头像" class="userImg">
                            <img v-if="superiorData.UserImg" v-lazy="superiorData.UserImg" :key="superiorData.UserImg" alt="" slot="extra" />
                            <img v-else src="../../assets/images/user.png" slot="extra" />
                        </Cell>
                        <Cell title="昵称" :extra="superiorData.UserName"/>
                        <Cell title="微信号" :extra="superiorData.WeChat" />
                        <Cell title="真实姓名" :extra="superiorData.RealName" />
                        <Cell title="联系电话" :extra="superiorData.UserPhone" />
                        <Cell title="经销等级" :extra="superiorData.AgentLevelName" />
                    </CellGroup>
                </Card>
                <Collapse v-if="!isReference" simple class="cont-ewm" v-model="code">
                    <Panel :hide-arrow="true" name="1">
                        二维码<i class="iconfont icon-check"></i>
                        <p slot="content" style="text-align:center;">
                            <img v-lazy="topCode" :key="topCode" alt="" >
                        </p>
                    </Panel>
                </Collapse>
            </div>
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
    name: 'superiorMessage',
    data() {
        return{
            selRow:{},
            superiorData:{},
            topCode:'',
            code:'1',
            text:'返回',
            iconf:'',
            isReference:false,//是否存在上级
            searchText:''
        }
    },
    components: {
        footCommon
    },
    methods:{
        getTop(){//获取上级资料
            let that = this;
            wxget('User/GetRefereeUserInfo').then(res =>{
                if(res.code == 200){
                    console.log(res);
                    that.superiorData = res.data;
                    that.getTopCode();
                    that.isReference = false;
                }else{
                    that.$Message.console.error(res.details);
                    that.isReference = true;
                    that.text = '保存'
                }
            })
        },
        getTopCode(){//获取上级二维码
            let that = this;
            wxget('User/GetRefereeQrCode').then(res =>{
                if(res.code == 200){
                    console.log(res);
                    that.topCode = res.details;
                }else{
                    that.$Message.error(res.details);
                }
            })
        },
        Search(){//获取推荐人list
            let that = this;
            console.log(that.searchText);
            if(!that.searchText || that.searchText == ''){
                that.$Message.warning('请输入搜索内容');
                return false;
            }
            wxpost('API/GetRefereeInfo/',{refereePhone:that.searchText}).then(res =>{
                if(res.code == 200){
                    that.superiorData = res.data;
                    console.log(that.superiorData)
                }else{
                    that.$Message.error(res.details);
                }
            })   
        },
        save(){//保存推荐人信息
            let that = this;
            if(!that.superiorData.F_Id || that.superiorData.F_Id){
                that.$Message.warning('当前没有上级信息！请重新查询');
                return false;
            }
            isLoading(that,'绑定信息中···');
            wxpost('API/SetReferee/',{refereeId:that.superiorData.F_Id}).then(res =>{
                that.$Spin.hide();
                if(res.code == 200){
                    that.$Message.success({
                        content:res.details,
                        duration:0.5,
                        onClose(){ 
                        that.$router.push({path:'/'});
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
            .cont-ewm{
                .ivu-collapse-header{
                    i{
                        float:right;
                        margin-right:0;
                    }
                }
            }
        }
    }
</style>
<style>
    .superiorMessage .cont .userImg>.ivu-cell-link{
        height:1.3333rem;
        line-height:1.3333rem;
        display: inherit;
    }
    .superiorMessage .ivu-card .ivu-card-body{
        padding:0;
    }
    .superiorMessage .ivu-card .ivu-cell-footer{
        right:0;
    }
    .superiorMessage .ivu-collapse-simple{
        border-bottom:0;
    }
    .superiorMessage .ivu-collapse>.ivu-collapse-item>.ivu-collapse-header{
        padding-left:0;
        font-size:0.3733rem;
    }
    .superiorMessage .ivu-collapse .ivu-collapse-item .ivu-collapse-content img{
        vertical-align: bottom;
        width: 5.333rem;
        height: 5.333rem;
    }
</style>
