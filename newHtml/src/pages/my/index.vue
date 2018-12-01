<template>
    <div id="container" class="my">
       <Row class="header" @click.native="goInfo">
           <Col span="6" class="header-l">
                <img  v-lazy="userInfo.UserImg" :key="userInfo.UserImg" :alt="''" />
           </Col>
           <Col span="16" class="header-c">
                <p class="header-c-name">{{userInfo.UserName}}</p>
                <p class="header-c-tell">{{userInfo.UserPhone}}</p>
                <p class="header-c-level">{{userInfo.SellerName}}&nbsp;·&nbsp;{{userInfo.AgentLevelName}}</p>
           </Col>
           <Col span="2" class="header-r">
                <router-link to='' >
                    <i class="iconfont icon-check"></i>
                </router-link>
           </Col>
        </Row>
        <Row class="header-foot">
            <Col span="24" class="header-foot-money">
                <router-link :to='{name:"mybalanceDetails"}' >
                    <p v-if="ErpCount>0" ><em>{{ErpCount}}</em><br><span>三草总余额(元)</span></p>
                    <p v-if="Balance>0"><em>{{Balance}}</em><br><span>总余额(元)</span></p>
                </router-link>
            </Col>
            <Col span="24" class="header-foot-person" style="display:none;">
                <router-link to='' >
                    <p>团队人数:{{teamUserData.TeamCount}}（人）</p>
                </router-link>
            </Col>
        </Row> 
        <Row class="content">
            <p class="content-title">我的管理</p>
            <Row class="content-cont">
                <Col class="content_lf">
                    <router-link :to='{name:"productManagement"}'>
                        <i class="iconfont icon--1"></i>
                        <span>产品管理</span>
                    </router-link>
                </Col>
                <Col class="content_lf">
                    <router-link :to='{name:"recharge"}' >
                        <i class="iconfont icon--24"></i>
                        <span>充值</span>
                    </router-link>
                </Col>
                <Col class="content_lf">
                    <router-link :to='{name:"surfaceSingle"}' >
                        <i class="iconfont icon--2"></i>
                        <span>电子面单</span>
                    </router-link>
                </Col>
            </Row>
            <Row class="content-cont">
                <Col class="content_lf">
                    <router-link :to='{name:"printList"}' >
                        <i class="iconfont icon--10"></i>
                        <span>纸质打印</span>
                    </router-link>
                </Col>
                <Col class="content_lf">
                    <router-link :to='{name:"newsList"}' >
                        <i class="iconfont icon--8"></i>
                        <span>更多公告</span>
                    </router-link>
                </Col>
                <Col class="content_lf">
                    <router-link :to='{name:"help"}' >
                        <i class="iconfont icon--11"></i>
                        <span>帮助说明</span>
                    </router-link>
                </Col>
                <Col class="content_lf">
                    <router-link :to='{name:"share"}' >
                        <i class="iconfont icon--9"></i>
                        <span>分享小程序</span>
                    </router-link>
                </Col>
            </Row>
            <Row class="content-cont">
                <Col class="content_lf">
                    <router-link :to='{name:"activity"}' >
                        <i class="iconfont icon--"></i>
                        <span>活动申请</span>
                    </router-link>
                </Col>
                <Col class="content_lf">
                    <router-link :to='{name:"forgetPhone"}'>
                        <i class="iconfont icon--14"></i>
                        <span>更换手机</span>
                    </router-link>
                </Col>
                <Col class="content_lf">
                    <router-link :to='{name:"changePassword"}'>
                        <i class="iconfont icon--19"></i>
                        <span>修改密码</span>
                    </router-link>
                </Col>
                <Col class="content_lf">
                    <router-link to='' >
                        <i class="iconfont icon--3"></i>
                        <span>产品价格图</span>
                    </router-link>
                </Col>
            </Row>
        </Row>
        <Row class="foot">
            <Col span="24">
                <button @click.enter="layout">退出</button>
            </Col>
            
        </Row>
    </div>
</template>

<script>
import {removeLoginUser,deleteCookie} from '../../assets/js/assist.js'
import {wxget} from '@/axios/ajax';
export default {
    name: 'teamindex',
    components: {
        
    },
    methods:{
        layout(){//退出
            let that = this;
            that.$Modal.confirm({
                scrollable:false,
                render: (h) => {
                    return h('div',{class:'model-cont'},[
                        h('div',{class:'model-title','style':{textAlign:'right',marginBottom:'0.2667rem'}},[
                            h('span',
                                {style:{color:'#f90',fontSize:'0.3733rem',float:'left'}}, '提醒！'),
                            h('i',{class:'iconfont icon-close-btn',on: {click: () => {that.$Modal.remove();}}
                            })
                        ]),
                        h('div',{class:'model-content'},[
                            h('p', {'style':{fontSize:'0.3733rem'}},'确认退出吗？')
                        ]),
                        h('div',{class:'model-foot','style':{textAlign:'right',marginTop:'0.2667rem'}},[
                            h('Button', {'style':{boxShadow:'none',borderColor:'#dcdee2',marginRight:'0.1333rem'},on: {click:()=>{that.$Modal.remove();}}},'取消'),
                            h('Button', {'style':{boxShadow:'none',background: '#009788',borderColor:'#009788'},props: {type: 'primary'},on: {click:()=>{
                                removeLoginUser();//清除cookie
                                deleteCookie('SellerF_Id');
                                deleteCookie('password');
                                that.$Modal.remove();
                                that.$router.push({path: '/'});
                            } }},'确定')
                        ])
                    ]

                    )
                } 
            })
        },
        goInfo(){
            this.$router.push({name:'info'});
        }
    },
    mounted(){
        wxget('User/GetMyTeamSaleAmount').then(res =>{
            if(res.code = 200){
                let that = this;
                that.teamUserData = res.data;
            }else{
                this.$Message.error(res.details);
            }
        })
        wxget('User/GetUserInfo').then(res =>{
            if(res.code = 200){
                let that = this;
                that.userInfo = res.data;
                console.log(res);
                if(that.userInfo.AgentLevel < 3){
                    that.ErpCount = res.map ? parseFloat(res.map).toFixed(2) : 0;
                }else{
                    that.ErpCount = res.count ? parseFloat(res.count).toFixed(2) : 0;
                    that.Balance = res.map ? parseFloat(res.map).toFixed(2) : 0;
                }
            }else{
                this.$Message.error(res.details);
            }
        })
    },
    data() {
        return{
           teamUserData:{},
           userInfo:{},
           ErpCount:0,
           Balance:0,
        }
    }
}
</script>
<style lang="scss" scoped>
    #container{
        padding-bottom: 1.333rem;
        .header{
            padding: 0 0.4rem;//0 15px
            // background: #009788;
            background:url('../../assets/images/bg3.png') no-repeat 0 0;
            background-size:contain;
            height: 3.2rem;//120px
            .header-l{
                height: 100%;
                display:flex;
                flex-direction:column;
                align-items:center;
                justify-content:center;
                img{
                    width:100%;
                    border-radius:50%;
                    max-height: 2.3rem;
                }
            }
            .header-c{
                height: 100%;
                display:flex;
                flex-direction:column;
                align-items:left;
                justify-content:center;
                color:#fff;
                padding-left:0.6667rem;
                .header-c-name{
                    font-size:0.4267rem;//16px
                }
                .header-c-tell{
                    font-size:0.32rem;//12px
                }
                .header-c-level{
                    font-size:0.32rem;//12px
                }
            }
            .header-r{
                height: 100%;
                display:flex;
                flex-direction:column;
                align-items:center;
                justify-content:center;
                a{
                    color: #fff;
                    font-size: 0.5333rem;//20px;
                    &:hover{
                        color:#fff;
                        text-decoration:none;
                    }
                }
            }
        }
        .header-foot{
            height:1.7333rem;//65px
            display:flex;
            flex-direction:column;
            align-items:center;
            justify-content:center;
            border-bottom: 1px solid #E5E5E5;
            margin: 0 0.4rem;
            .header-foot-money{
                text-align:center;
                a{
                    color:#666666;
                    display: inherit;
                    // text-decoration: underline;
                    &:hover{
                        color:#666666;
                        text-decoration:none;
                    }
                    p{
                        font-size:0.4267rem;//16px;
                        em{
                            color: #009788;
                        }
                    }
                }
            }
            .header-foot-person{
                text-align:center;
                a{
                    color:#666666;
                    &:hover{
                        color:#666666;
                        text-decoration:none;
                    }
                }
            }
        }
        .content{
            background: #fff;
            padding: 0 0.4rem;
            .content-title{
                font-size:0.4267rem;//16px
                margin:0.4rem 0;//10px 0
            }
            .content-cont{
                margin:0.4rem 0;//0.4rem 0
                    .content_lf{
                        width:25%;
                        float:left;
                        a{
                            text-decoration:none;
                            position: relative;
                            display: flex;
                            flex-direction:column;
                            justify-content:center;
                            align-items: center;
                            &:hover,&:focus{
                                text-decoration:none;
                            }
                            i{
                                // color:#E5E5E5;
                                // font-size:0.6933rem;
                                color:#AAAAAA;
                                font-size:1rem;
                                line-height: 1;
                            }
                            span{
                                color:#727171;
                                font-size:0.32rem;//12px
                                text-align:center;
                            }
                            em{
                                position:absolute;
                                color:#fff;
                                background: #DF8D15;
                                width: 0.5333rem;//20px
                                height: 0.5333rem;
                                text-align: center;
                                border-radius: 50%;
                                font-size: 12px;
                                right: 0.5333rem;
                                top: 0;
                            }
                        }
                    }
            }
        }
        .foot{
            padding:0 0.4rem;
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
    
</style>
<style>
    .vertical-center-modal{
        display: flex;
        align-items: center;
        justify-content: center;
        -ms-flex-direction: column;
    }
    .ivu-modal-footer button:nth-child(2){
        border:1px solid #009788;
    }
    .ivu-modal-footer button:nth-child(1){
        background:#009788;
        border:1px solid #009788;
    }
</style>




