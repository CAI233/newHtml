<template>
    <div id="container" class="inviteReview">
        <div class="content">
            <div class="title">
                <span>全部邀请（0）</span>
                <Dropdown trigger="click" @on-click="chooseLevel">
                    <a href="javascript:void(0)">
                        {{selRow.levelName}}
                        <Icon type="ios-arrow-down"></Icon>
                    </a>
                    <DropdownMenu slot="list" >
                        <DropdownItem :name="item.id" v-if="levelData.length>0" v-for="item in levelData" :key="item.id" :selected="item.id == selRow.levelId ? true : false">{{item.text}}</DropdownItem>
                        <DropdownItem v-else>暂无对应品牌</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
                <Divider />
            </div>
            <div class="cont">
                <ul>
                    <li class="list" v-for="(item,index) in listData" :key="index">
                        <div class="list_l">
                            <p><span v-if="item.RealName">{{item.RealName}}</span><span v-else>{{item.UserName}}</span><em>{{item.UserPhone}}</em></p>
                            <p><span>{{item.AgentLevelName}}</span></p>
                            <p><span>{{item.Remark}}</span></p>
                        </div>
                        <div class="list_r">
                            <Button v-if="item.CheckStatus==1 &&  item.CheckType==1 && item.IsInvite !=1" @click.native="addInviter(item.F_Id)">邀请推荐人</Button>
                            <Button class="boderBtn" v-if="item.CheckStatus==0 &&  item.CheckType==0" @click.native="passCheck(item.F_Id)">确认授权</Button>
                            <Button class="boderBtn" v-if="item.CheckStatus==1 &&  item.IsInvite==1" @click.native="yespass(item.F_Id)">确认</Button>
                            <Button v-if="item.CheckStatus ==0" @click.native="nopass(item.F_Id)">取消</Button>
                            <Button v-if="item.CheckStatus==2 &&  item.CheckType==0">等待后台审核</Button>
                        </div>
                        <Divider class="list_line" v-if="index != listData.length -1"/>
                    </li>
                    <div class="list-foot" :class="listData.length == 0 ? 'no' : ''">
                        <div v-if="listData.length>0">
                            <p v-if="selRow.CurPage < Math.ceil(selRow.allTotal/selRow.PageSize)">下拉加载更多</p>
                            <p v-else>没有更多了</p>
                        </div>
                        <div v-else class="notData">
                            <p><img src="../../assets/images/noInvite.png" alt="" style="width:3rem;vertical-center:bottom;"></p>
                            <p>当前没有邀请</p>
                        </div>
                    </div>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
import {get,wxget,wxpost} from '@/axios/ajax';
import {getLoginUser} from '@/assets/js/assist.js'
import {isLoading} from '@/assets/js/load.js'
export default {
    name: 'inviteReview',
    data() {
        return{
            levelData:[],
            infoData:getLoginUser() ? getLoginUser() : '',
            selRow:{
                levelName:'筛选',
                levelId:null,
                pageSize:6,
                curPage:1,
                isVerify:0,
                keyword:0,
                allTotal:0
            },
            listData:[],
            searchData:{
                F_Id:'',
                phone:'',
                weChat:'',
                nickName:'',
                UserId:''
            }
        }
    },
    components: {

    },
    methods:{
        handleScroll(){//页面滚动监听
            let that = this;
            let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
            let bodyHeight = document.documentElement.clientHeight;
            let scrollHeight = document.documentElement.scrollHeight;
            if(scrollTop + 5 > scrollHeight - bodyHeight){
                that.load(false);
            }
        },
        load(bool){//加载数据
            let that = this;
            if(bool){
                that.listData = [];
                that.selRow.PageSize = 6;
                that.selRow.CurPage = 1;
                isLoading(that,'加载中···');
            }else{
                if(that.selRow.CurPage >= Math.ceil(that.selRow.allTotal/that.selRow.PageSize)){
                    return false;
                }else{
                    that.selRow.CurPage++;
                } 
            }
            let keyId = that.selRow.levelId ? that.selRow.levelId : '0';
            wxget('User/GetUserReferee/'+that.selRow.PageSize+'/'+that.selRow.CurPage+'/'+that.selRow.isVerify+'/'+keyId+'/'+that.selRow.keyword).then(res =>{
                that.$Spin.hide();
                if(res.code == 200){
                    that.listData.push(...res.data);
                    that.selRow.allTotal = res.total;
                    //listData
                }else{
                    that.$Message.error(res.message);
                }
            })
        },
        // reload(){//更新数据
        //     let that = this;
        //     let keyId = that.selRow.levelId ? that.selRow.levelId : '0';
        //     wxget('User/GetUserReferee/'+that.selRow.PageSize+'/'+that.selRow.CurPage+'/'+that.selRow.isVerify+'/'+keyId+'/'+that.selRow.keyword).then(res =>{
        //         that.$Spin.hide();
        //         if(res.code == 200){
                    
        //             let nowData = that.listData.concat(res.data);
        //             let obj = {};
        //             let newData =  nowData.reduce((cur,next) => {
        //                 console.log(obj);
        //                 obj[next.F_Id] ? "" : obj[next.F_Id] = true && cur.push(next);
        //                 return cur;
        //             },[]); //设置cur默认类型为数组，并且初始值为空的数组
        //             that.listData = newData;
        //             that.selRow.allTotal = res.total;
        //         }else{
        //             that.$Message.error(res.message);
        //         }
        //     })
        // },
        chooseLevel(name){//选择级别筛选
            let that = this;
            that.selRow.levelId = name;
            that.levelData.map((item) =>{
                if(item.id == name){
                    that.selRow.levelName = item.text;
                }
            })
            that.load(true);
        },
        addInviter(id){//填写推荐人
            let that = this;
            let searchText = '';
            that.searchData.UserId = id;
            that.$Modal.confirm({
                scrollable:false,
                render: (h) => {
                    return h('div',{class:'model-cont'},[
                        h('div',{class:'model-title','style':{textAlign:'right',marginBottom:'0.2667rem'}},[
                            h('i',{class:'iconfont icon-close-btn',on: {click: () => {that.$Modal.remove();}}
                            })
                        ]),
                        h('div',{class:'model-content'},[
                            h('Form',{props:{labelWidth:60,labelPosition:'left'}},[
                                h('FormItem',{props:{label:'查询信息'},style:'marginBottom:0;borderBottom:1px solid #ddd;'},[
                                    h('Input',{props:{placeholder:'输入查询信息'},on:{
                                        input: (val) => {
                                            searchText = val;
                                        }
                                    }},[
                                        h('Icon',{slot:'suffix',props:{type:"ios-search"},on:{
                                            click:()=>{
                                                if(!searchText || searchText == ''){
                                                    that.$Message.warning('查询信息不能为空！');
                                                    return false;
                                                }
                                                isLoading(that,'查询中···');
                                                wxget('User/GetUserInfo_TopIdAndRefereeId/'+searchText).then(res =>{
                                                    that.$Spin.hide();
                                                    if(res.code == 200){
                                                        // console.log(res);//默认取第一条
                                                        that.searchData.F_Id = res.data[0].F_Id;
                                                        that.searchData.phone = res.data[0].UserPhone;
                                                        that.searchData.weChat = res.data[0].WeChat;
                                                        that.searchData.nickName = res.data[0].UserName;
                                                    }else{
                                                        for(let key in that.searchData){
                                                            that.searchData[key] = '';
                                                        }
                                                        that.$Message.error(res.message);
                                                    }
                                                })
                                            }
                                        }})
                                    ])
                                ]),
                                h('FormItem',{props:{label:'手机号'},style:'marginBottom:0;borderBottom:1px solid #ddd;'},[
                                    h('Input',{props:{placeholder:'手机号',readonly:'readonly',value:that.searchData.phone}})
                                ]),
                                h('FormItem',{props:{label:'微信号'},style:'marginBottom:0;borderBottom:1px solid #ddd;'},[
                                    h('Input',{props:{placeholder:'微信号',readonly:'readonly',value:that.searchData.weChat}})
                                ]),
                                h('FormItem',{props:{label:'昵称'},style:'marginBottom:0'},[
                                    h('Input',{props:{placeholder:'昵称',readonly:'readonly',value:that.searchData.nickName}})
                                ])
                            ])
                        ]),
                        h('div',{class:'model-foot','style':{textAlign:'right',marginTop:'0.2667rem'}},[
                            h('Button', {'style':{boxShadow:'none',borderColor:'#dcdee2',marginRight:'0.1333rem'},on: {click:()=>{that.$Modal.remove();}}},'取消'),
                            h('Button', {'style':{boxShadow:'none',background: '#009788',borderColor:'#009788'},props: {type: 'primary'},on: {click:()=>{
                                if(!that.searchData.F_Id || that.searchData.F_Id == ''){
                                    that.$Message.warning('请查询推荐人');
                                    return false;
                                }
                                if(that.infoData.UserPhone == that.searchData.phone){
                                    that.$Message.warning('不能填写自己为推荐人！');
                                    return false;
                                }
                                isLoading(that,'更新中···')
                                wxpost('User/Recommend_SubmitForm/',that.searchData).then(res =>{
                                    that.$Spin.hide();
                                    if(res.code == 200){
                                        that.$Message.success(res.message);
                                        that.$Modal.remove();
                                        for(let key in that.searchData){
                                            that.searchData[key] = '';
                                        }
                                        // that.reload();
                                        that.load(true);
                                    }else{
                                        that.$Message.error(res.message);
                                    }
                                })
                            } }},'确定')
                        ])
                    ]

                    )
                } 
            })
        },
        pass(id,num){//授权与取消授权
            let that = this;  
            wxpost('User/SetValidUserReferee',{Id:id,IsValid:num}).then(res =>{
                that.$Spin.hide();
                that.$Modal.remove();
                if(res.code == 200){
                    that.$Message.success(res.details);
                    // that.reload();
                    that.load(true);
                }else{
                    that.$Message.error(res.details);
                }
            })
        },
        passCheck(id){//确认授权
            let that = this;
            that.$Modal.confirm({
                scrollable:false,
                render: (h) => {
                    return h('div',{class:'model-cont'},[
                        h('div',{class:'model-title','style':{textAlign:'right',marginBottom:'0.2667rem'}},[
                            h('span',
                                {style:{color:'#DF8D15',fontSize:'0.3733rem',float:'left'}}, '提醒！'),
                            h('i',{class:'iconfont icon-close-btn',on: {click: () => {that.$Modal.remove();}}
                            })
                        ]),
                        h('div',{class:'model-content'},[
                            h('p', {'style':{fontSize:'0.3733rem'}},'确定授权吗？')
                        ]),
                        h('div',{class:'model-foot','style':{textAlign:'right',marginTop:'0.2667rem'}},[
                            h('Button', {'style':{boxShadow:'none',borderColor:'#dcdee2',marginRight:'0.1333rem'},on: {click:()=>{that.$Modal.remove();}}},'取消'),
                            h('Button', {'style':{boxShadow:'none',background: '#009788',borderColor:'#009788'},props: {type: 'primary'},on: {click:()=>{
                                isLoading(that,'授权中···')
                                wxget('User/CheckUserReferee',{Id:id}).then(res =>{
                                    that.$Spin.hide();
                                    that.$Modal.remove();
                                    if(res.code ==200){
                                        that.$Message.success(res.details);
                                        // that.reload();
                                        that.load(true);
                                    }else{
                                        that.$Message.error(res.details);
                                    }
                                })
                            } }},'确定')
                        ])
                    ]

                    )
                } 
            })
        },
        yespass(id){//确认申请
            let that = this;
            that.$Modal.confirm({
                scrollable:false,
                render: (h) => {
                    return h('div',{class:'model-cont'},[
                        h('div',{class:'model-title','style':{textAlign:'right',marginBottom:'0.2667rem'}},[
                            h('span',
                                {style:{color:'#DF8D15',fontSize:'0.3733rem',float:'left'}}, '提醒！'),
                            h('i',{class:'iconfont icon-close-btn',on: {click: () => {that.$Modal.remove();}}
                            })
                        ]),
                        h('div',{class:'model-content'},[
                            h('p', {'style':{fontSize:'0.3733rem'}},'确定同意该用户的申请？')
                        ]),
                        h('div',{class:'model-foot','style':{textAlign:'right',marginTop:'0.2667rem'}},[
                            h('Button', {'style':{boxShadow:'none',borderColor:'#dcdee2',marginRight:'0.1333rem'},on: {click:()=>{that.$Modal.remove();}}},'取消'),
                            h('Button', {'style':{boxShadow:'none',background: '#009788',borderColor:'#009788'},props: {type: 'primary'},on: {click:()=>{
                                isLoading(that,'更新···');
                                that.pass(id,1);
                            } }},'确定')
                        ])
                    ]

                    )
                } 
            })
        },
        nopass(id){//取消申请
            let that = this;
            that.$Modal.confirm({
                scrollable:false,
                render: (h) => {
                    return h('div',{class:'model-cont'},[
                        h('div',{class:'model-title','style':{textAlign:'right',marginBottom:'0.2667rem'}},[
                            h('span',
                                {style:{color:'#DF8D15',fontSize:'0.3733rem',float:'left'}}, '提醒！'),
                            h('i',{class:'iconfont icon-close-btn',on: {click: () => {that.$Modal.remove();}}
                            })
                        ]),
                        h('div',{class:'model-content'},[
                            h('p', {'style':{fontSize:'0.3733rem'}},'确定取消该用户的申请吗？')
                        ]),
                        h('div',{class:'model-foot','style':{textAlign:'right',marginTop:'0.2667rem'}},[
                            h('Button', {'style':{boxShadow:'none',borderColor:'#dcdee2',marginRight:'0.1333rem'},on: {click:()=>{that.$Modal.remove();}}},'取消'),
                            h('Button', {'style':{boxShadow:'none',background: '#009788',borderColor:'#009788'},props: {type: 'primary'},on: {click:()=>{
                                isLoading(that,'取消中···');
                                that.pass(id,0);
                            } }},'确定')
                        ])
                    ]

                    )
                } 
            })
        }
    },
    mounted(){
        let that = this;
        that.levelData = [{id:0,text:'全部'},{id:2,text:'总代'},{id:3,text:'一级'},{id:4,text:'二级'},{id:5,text:'三级'},{id:6,text:'店主'}];
        window.addEventListener('scroll', that.handleScroll);//添加滚动监听事件
        that.load(true);
    }
}
</script>
<style lang="scss" scoped>
    #container{
        padding-bottom: 1.333rem;
        .content{
            padding:0.5333rem 0.4rem 0;//20px 15px 0;
            .title{
                font-size:0.3733rem;
                color:#727171;
                .ivu-dropdown{
                    
                    float:right;
                    a{
                        font-size:0.3733rem;//14px
                        color:#727171;
                    }
                }
            }
            .cont{
                &>ul{
                    position: relative;
                    .list{
                        overflow: hidden;
                        position: relative;
                        padding:0.4rem 0;// 15px 0;
                        .list_l{
                            float: left;
                            padding-right:0.4rem;// 15px;
                            p{
                                font-size:0.3733rem;//14px
                                color:#3E3A39;
                                text-align:left;
                                em{
                                    float:right;
                                }
                                &:nth-child(2){
                                    span{
                                        color:#727171;
                                        font-size:0.32rem;//12px
                                    }
                                }
                                &:nth-child(3){
                                    span{
                                        color:#727171;
                                        font-size:0.32rem;//12px
                                    }
                                }
                            }
                        }
                        .list_r{
                            float: right;
                            button{
                                height:0.9333rem;//35rem
                                margin-left:0.1333rem;
                            }
                        }
                        .list_line{
                            margin:0;
                            position: absolute;
                            top:auto !important;
                            bottom:0;
                        }
                    }
                    &>.list-foot{
                        &.no{
                            position: absolute;
                            height: 14rem;
                        }
                        p{
                            text-align:center;
                            margin-bottom:0.2667rem;//10px;
                        }
                        .notData{
                            text-align: center;
                            margin-top:0.2667rem;//10px;
                        }
                    }
                }
            }
            .ivu-divider-horizontal{
                margin:0.2667rem 0 0 0;//10px 0 0 0
            }
        }
    }
</style>
<style>
    .inviteReview .ivu-dropdown .ivu-select-dropdown{
        left:auto !important;
        right:0.4rem;
        top:1.2267rem !important;
    }
    .inviteReview .ivu-dropdown .ivu-select-dropdown .ivu-dropdown-menu{
        min-width:2rem !important;
    }
    .inviteReview .ivu-dropdown .ivu-select-dropdown ul li{
        text-align:center;
    }
    .inviteReview .ivu-btn{
        border-color:#727171;
    }
    .inviteReview .ivu-btn.boderBtn{
        border-color:#009788;
    }
    .inviteReview .ivu-btn:hover,.inviteReview .ivu-btn:focus{
        color:#727171;
        border-color:#727171;
    }
    .inviteReview .ivu-btn.boderBtn:hover,.inviteReview .ivu-btn.boderBtn:focus{
        border-color:#009788;
    }
    .model-cont .model-content .ivu-input,.model-cont .model-content .ivu-input:hover,.model-cont .model-content .ivu-input:focus{
        border:none;
    }
</style>
