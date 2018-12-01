<template>
    <div id="container" class="lingshouAddress">
        <div class="content">
            <ul v-if="isTo">
                <li class="list" v-for="(item,index) in addressList" :key="index" @click="Check(item.F_Id)">
                    <p><span>收货人:<em>{{item.ReceiveName}}</em></span><span>联系电话:<em>{{item.Phone}}</em></span></p>
                    <p><i class="iconfont icon-address"></i>{{item.Province+item.City+item.Area+item.Stree}}</p>
                    <p>
                        <i-button type="primary"  @click.stop="rev(item.F_Id)">编辑</i-button>
                        <i-button type="primary"  @click.stop="del(item.F_Id,index)">删除</i-button>
                    </p>
                    <Divider />
                </li>
                <div class="list-foot">
                    <div v-if="addressList.length>0">
                        <p v-if="selRow.pageNum < Math.ceil(selRow.allTotal/selRow.pageSize)">下拉加载更多</p>
                        <p v-else>没有更多了</p>
                    </div>
                    <div v-else class="notData">
                        没有数据
                    </div>
                </div>
            </ul>
            <ul v-else>
                <li class="list" v-for="(item,index) in addressList" :key="index" >
                    <p><span>收货人:<em>{{item.ReceiveName}}</em></span><span>联系电话:<em>{{item.Phone}}</em></span></p>
                    <p><i class="iconfont icon-address"></i>{{item.Province+item.City+item.Area+item.Stree}}</p>
                    <p>
                        <!-- <router-link to='' @click.native="selected(item,index)">
                            <i class="iconfont" :class="item.IsDefault ? 'icon-xuanzhong' : 'icon-weixuanzhong'"></i>
                            默认地址
                        </router-link> -->
                        <i-button type="primary"  @click.stop="rev(item.F_Id)">编辑</i-button>
                        <i-button type="primary"  @click.stop="del(item.F_Id,index)">删除</i-button>
                    </p>
                    <Divider />
                </li>
                <div class="list-foot">
                    <div v-if="addressList.length>0">
                        <p v-if="selRow.pageNum < Math.ceil(selRow.allTotal/selRow.pageSize)">下拉加载更多</p>
                        <p v-else>没有更多了</p>
                    </div>
                    <div v-else class="notData">
                        没有数据
                    </div>
                </div>
            </ul>
        </div>
        <foot-common :btnText="text" :icon="iconf" @click.native="addLingshouAddress"></foot-common>
    </div>
</template>
<script>
import {post,wxpost,wxget} from '@/axios/ajax';
import {addCookie,getCookie,getCurrentDate,deleteCookie} from '@/assets/js/assist.js'
import footCommon from '@/components/foot-common.vue';
import {isLoading} from '@/assets/js/load.js'
export default {
    name: 'lingshouAddress',
    data() {
        return{
            text:'添加新地址',
            iconf:'icon-add',
            isTo:'',//是否是零售订单过来
            selRow:{
                pageSize:6,
                pageNum:1,
                allTotal:0
            },
            addressList:[]
        }
    },
    components: {
        footCommon
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
                 that.selRow.pageNum =1;//初始页数
                 that.selRow.pageSize = 6;//默认每页显示个数
                 that.addressList = [];//初始化
                 isLoading(that,'加载中···');
            }else{
                if(that.selRow.pageNum >= Math.ceil(that.selRow.allTotal/that.selRow.pageSize)){
                    return false;
                }else{
                    that.selRow.pageNum++;
                } 
            }
            wxget('User/GetWxDeliveryInfoById/'+that.selRow.pageSize+'/'+that.selRow.pageNum).then(res =>{
                that.$Spin.hide();
                if(res.code == 200){
                    console.log(res.data)
                    // that.printList = res.data;
                    that.addressList.push(...res.data);
                    that.selRow.allTotal = res.total;
                }else{
                    that.$Message.error(res.message);
                }
            })
        },
        reload(){//更新数据
            let that = this;
            wxget('User/GetWxDeliveryInfoById/'+that.selRow.pageSize+'/'+that.selRow.pageNum).then(res =>{
                that.$Spin.hide();
                if(res.code == 200){
                    
                    let nowData = that.addressList.concat(res.data);
                    let obj = {};
                    let newData =  nowData.reduce((cur,next) => {
                        console.log(obj);
                        obj[next.F_Id] ? "" : obj[next.F_Id] = true && cur.push(next);
                        return cur;
                    },[]); //设置cur默认类型为数组，并且初始值为空的数组
                    that.addressList = newData;
                    that.selRow.allTotal = res.total;
                }else{
                    that.$Message.error(res.message);
                }
            })
        },
        addLingshouAddress(){//新增操作
            let that = this;
            if(that.isTo){
                that.$router.push({name:'newLingshouAddress',params: { id:0 },query:{isTo:that.isTo}});//新增
            }else{
                that.$router.push({name:'newLingshouAddress',params: { id:0 }});//新增
            }
            
        },
        Check(id){//设置零售订单地址
            console.log(1);
            let that = this;
            that.$router.push({path:'/order/lingshouOrderWait',query: { id:id }});
        },
        // selected(obj,index){
        //     let that = this;
        //     let id = obj.F_Id;
        //     if(obj.IsDefault){
        //         that.$Message.warning('已设置为默认，请勿重复操作');
        //         return false;
        //     }
        //     that.addressList.map((item,key,arr) => {
        //         if(item.IsDefault){
        //             item.IsDefault = false;
        //         }
        //         if(index == key){
        //             item.IsDefault = true;
        //         }
        //     })
        //     that.isLoading('更新中···');
        //     wxpost('User/SetUserExpressConfigByDefault',{Id:id}).then(res =>{
        //         that.$Spin.hide();
        //         if(res.code == 200){
        //             that.$Message.success(res.message);
        //         }else{
        //             that.$Message.error(res.message);
        //         }
        //     }).catch(res =>{
        //         console.log(res);
        //     })
        // }
        rev(id){//修改
            let that = this;
            if(that.isTo){
                that.$router.push({name:'newLingshouAddress',params: { id:id },query:{isTo:that.isTo}});
            }else{
                that.$router.push({name:'newLingshouAddress',params: { id:id }});
            }
        },
        del(id,num){//删除
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
                            h('p', {'style':{fontSize:'0.3733rem'}},'确认删除地址吗？')
                        ]),
                        h('div',{class:'model-foot','style':{textAlign:'right',marginTop:'0.2667rem'}},[
                            h('Button', {'style':{boxShadow:'none',borderColor:'#dcdee2',marginRight:'0.1333rem'},on: {click:()=>{that.$Modal.remove();}}},'取消'),
                            h('Button', {'style':{boxShadow:'none',background: '#009788',borderColor:'#009788'},props: {type: 'primary'},on: {click:()=>{
                                isLoading(that,'更新中···');
                                wxpost('User/SetWxDeliveryInfoByDelete',{Id:id}).then(res =>{
                                    that.$Spin.hide();
                                    if(res.code == 200){
                                        that.$Message.success(res.message);
                                        that.$Modal.remove();
                                        
                                        that.addressList.map((item,key,arr) => {
                                            if(num == key){
                                                that.addressList.splice(key,1);
                                                that.selRow.allTotal -= 1;
                                            }
                                        })
                                        that.reload();     
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
        }
    },
    mounted(){
        let that = this;
        that.isTo = that.$route.query.isTo || '';
        window.addEventListener('scroll', that.handleScroll);//添加滚动监听事件
        that.load(true);//加载地址
    }
}
</script>
<style lang="scss" scoped>
    #container{
        padding-bottom: 1.333rem;
        .content{
            padding:0.5333rem 0.4rem 0;//20px 15px 0;
            ul{
                &>.list{
                    p{
                        &:nth-child(1){
                            font-size:0.3733rem;//14px;
                            color:#101010;
                            overflow: hidden;
                            span{
                                float: left;
                                width:50%;
                            }
                        }
                        &:nth-child(2){
                            color:#666;
                            font-size:0.32rem;
                            i{
                                font-size:0.32rem;//12px
                                margin-right:0.1333rem;//5px
                            }
                        }
                        &:nth-child(3){
                            text-align:right;
                            // a{
                            //     float:left;
                            //     color:#666;
                            //     font-size:0.3733rem;//14px;
                            //     height:0.9333rem;//35px
                            //     line-height: 0.9333rem;
                            //     i{
                            //         color: #009788;
                            //         margin-right:0.1333rem;//5px
                            //         font-size:0.3733rem;//14px
                            //     }
                            // }
                            button{
                                background:#fff;
                                color:#727171;
                                font-size:0.3733rem;//14px;
                                height:0.9333rem;//35px
                                &:nth-child(1){
                                    border-color:#009788;
                                }
                                &:nth-child(2){
                                    border-color:#727171;
                                }
                            }
                        }
                    }
                    .ivu-divider-horizontal{
                        margin:0.2667rem 0;
                    }
                }
                &>.list-foot{
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
    }
</style>

