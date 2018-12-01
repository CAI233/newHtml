<template>
    <div id="container" class="surfaceSingle">
        <!-- <swiperComponent :swiperOption="swiperOption"></swiperComponent> -->
        <div class="content">
            <ul>
                <li v-for="(item,index) in surfaceSingleData" :key="index">
                    <p class="courier">快递名称:<span>{{item.Title}}</span></p>
                    <p>
                        <span class="sender">{{item.Sender}}</span>
                        <span class="contact">{{item.Contact}}</span>
                    </p>
                    <p class="address"><i class="iconfont icon-address"></i>{{item.Province+item.City+item.County+item.StreetAddress}}</p>
                    <p class="foot">
                        <router-link to='' @click.native="selected(item,index)">
                            <i class="iconfont" :class="item.IsDefault ? 'icon-xuanzhong' : 'icon-weixuanzhong'"></i>
                            默认电子面单
                        </router-link>
                        <i-button type="primary"  @click="rev(item.F_Id)">编辑</i-button>
                        <i-button type="primary"  @click="del(item.F_Id,index)">删除</i-button>
                    </p>
                    <Divider />
                </li>
                <div class="li-foot">
                    <div v-if="surfaceSingleData.length>0">
                        <p v-if="pageNum < Math.ceil(allTotal/pageSize)" @click="load(false)">加载更多</p>
                        <p v-else>没有更多了</p>
                    </div>
                    <div v-else class="notData">
                        没有数据
                    </div>
                </div>
            </ul>
        </div>
        <foot-common :btnText="text" :icon="iconf" @click.native="addSurfaceSingle"></foot-common>
    </div>
    
</template>

<script>
import footCommon from '@/components/foot-common.vue';
import {wxget,wxpost} from '@/axios/ajax';
import {isLoading} from '@/assets/js/load.js'
export default {
    name: 'orderindex',
    data() {
        return{
            text:'添加新的电子面单',
            iconf:'icon-add',
            surfaceSingleData:[],
            pageNum:1,//初始页数
            pageSize:4,//默认每页显示个数

            allTotal:0
        }
    },
    components: {
        footCommon
    },
    methods:{
        load(bool){
            let that = this;
            if(!bool){
                if(that.pageNum >= Math.ceil(that.allTotal/that.pageSize)){
                    return false;
                }else{
                    that.pageNum++;
                } 
            }else{
                 that.pageNum =1;//初始页数
                 that.pageSize =4;//默认每页显示个数
                 that.surfaceSingleData = [];//初始化
            }
            wxget('User/GetUserInterExpressConfig/'+that.pageSize+'/'+that.pageNum).then(res =>{
                if(res.code == 200){
                    // that.surfaceSingleData = res.data;
                    that.surfaceSingleData.push(...res.data);
                    that.allTotal = res.total;
                }else{
                    that.$Message.error(res.message);
                }
            }).catch(res =>{
                console.log(res);
            })
        },
        reload(){
            let that = this;
            wxget('User/GetUserInterExpressConfig/'+that.pageSize+'/'+that.pageNum).then(res =>{
                if(res.code == 200){
                    
                    let nowData = that.surfaceSingleData.concat(res.data);
                    let obj = {};
                    let newData =  nowData.reduce((cur,next) => {
                        obj[next.F_Id] ? "" : obj[next.F_Id] = true && cur.push(next);
                        return cur;
                    },[]); //设置cur默认类型为数组，并且初始值为空的数组
                    that.surfaceSingleData = newData;
                    that.allTotal = res.total;
                }else{
                    that.$Message.error(res.message);
                }
            })
        },
        addSurfaceSingle(){//新增操作
            let that = this;
            that.$router.push({name:'newSurfaceSingle',params: { id:0 }});
        },
        selected(obj,index){//设置默认
            let that = this;
            let id = obj.F_Id;
            if(obj.IsDefault){
                that.$Message.warning('已设置为默认，请勿重复操作');
                return false;
            }
            that.surfaceSingleData.map((item,key,arr) => {
                if(item.IsDefault){
                    item.IsDefault = false;
                }
                if(index == key){
                    item.IsDefault = true;
                }
            })
            that.isLoading('更新中···');
            // console.log(that.surfaceSingleData);
            wxpost('User/SetUserInterExpressConfigByDefault',{Id:id}).then(res =>{
                that.$Spin.hide();
                if(res.code == 200){
                    that.$Message.success(res.message);
                }else{
                    that.$Message.error(res.message);
                }
            }).catch(res =>{
                console.log(res);
            })
        },
        rev(id){//编辑
            let that = this;
            that.$router.push({name:'newSurfaceSingle',params: { id:id }});
        },
        del(id,index){//删除
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
                            h('p', {'style':{fontSize:'0.3733rem'}},'确认删除电子面单吗？')
                        ]),
                        h('div',{class:'model-foot','style':{textAlign:'right',marginTop:'0.2667rem'}},[
                            h('Button', {'style':{boxShadow:'none',borderColor:'#dcdee2',marginRight:'0.1333rem'},on: {click:()=>{that.$Modal.remove();}}},'取消'),
                            h('Button', {'style':{boxShadow:'none',background: '#009788',borderColor:'#009788'},props: {type: 'primary'},on: {click:()=>{
                                isLoading(that,'更新中···');
                                wxpost('User/SetUserInterExpressConfigByDelete',{Id:id}).then(res =>{
                                    that.$Spin.hide();
                                    if(res.code == 200){
                                        that.$Message.success(res.message);
                                        that.$Modal.remove();
                                        
                                        that.surfaceSingleData.map((item,key,arr) => {
                                            if(index == key){
                                                that.surfaceSingleData.splice(key,1);
                                                that.allTotal -= 1;
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
        // window.addEventListener('scroll', that.handleScroll)//添加滚动监听事件
        that.load(true);//初始加载
    }
}
</script>
<style lang="scss" scoped>
// @import '../../assets/css/base.scss';
    #container{
        padding-bottom: 1.0667rem;
        .content{
            padding:0.5333rem 0.4rem 0;// 20px 15px 0;
            ul{
                li{
                    p{
                        margin:0.1333rem 0;//5px 0
                        &:nth-child(1){
                            font-size:0.32rem;//12px;
                            span{
                                font-size:0.3733rem;//14px;
                                color:#DF8D15
                            }
                        }
                        &:nth-child(2){
                            font-size:0.3733rem;//14px;
                            color:#3E3A39;
                        }
                        &:nth-child(3){
                            font-size:0.32rem;//12px;
                            color:#666666;
                        }
                        &:nth-child(4){
                            text-align:right;
                            a{
                                float:left;
                                color:#666666;
                                font-size:0.3733rem;//14px;
                                height:0.9333rem;//35px
                                line-height: 0.9333rem;
                                i{
                                    color: #009788;
                                    margin-right:0.1333rem;//5px
                                }
                            }
                            button{
                                background:#fff;
                                color:#727171;
                                font-size:0.3733rem;//14px;
                                height:0.9333rem;//35px
                                &:nth-child(2){
                                    border-color:#009788;
                                }
                                &:nth-child(3){
                                    border-color:#727171;
                                }
                            }
                        }
                    }
                    .ivu-divider-horizontal{
                        margin:0.2667rem 0;
                    }
                }
                .li-foot{
                    p{
                        text-align:center;
                        margin-bottom:0.2667rem;//10px;
                    }
                    .notData{
                        text-align: center;
                    }
                }
            }
            
        }
    }
    
</style>
<style>
    .surfaceSingle .content ul li p .contact{
        float:right;
    }
</style>




