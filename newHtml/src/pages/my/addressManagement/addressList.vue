<template>
    <div id="container" class="addressList">
        <i-form class="header_nav">
            <Form-item>
                <Row class="row">
                    <Col span="2">
                        <router-link to='' @click.native="back">
                            <i class="iconfont icon-iconback"></i>
                        </router-link>
                    </Col>
                    <Col span="22">
                        <i-input type="text"  placeholder="搜索" v-model.trim()="searchText">
                            <i class="iconfont icon-seach" slot="prefix"  @click="Search()"></i>
                        </i-input>
                    </Col>
                </Row>
            </Form-item>
        </i-form>
        <div class="content">
            <ul v-if="isCar">
                <li v-for="(item,index) in addressList" :key="index"  @click="chooseAddress(item.F_Id)">
                    <p>
                        <span class="sender">{{item.ReceiveName}}</span><span class="contact">{{item.Cellphone}}</span>
                    </p>
                    <p class="address"><i class="iconfont icon-address"></i>{{item.Province+item.City+item.County+item.StreetAddress}}</p>
                    <p class="foot">
                        <router-link to='' @click.stop="selected(item,index)">
                            <i class="iconfont" :class="item.IsDefault ? 'icon-xuanzhong' : 'icon-weixuanzhong'"></i>
                            默认地址
                        </router-link>
                        <i-button type="primary"  @click.stop="rev(item.F_Id)">编辑</i-button>
                        <i-button type="primary"  @click.stop="del(item.F_Id,index)">删除</i-button>
                    </p>
                    <Divider />
                </li>
                <div class="li-foot">
                    <div v-if="addressList.length>0">
                        <p v-if="pageNum < Math.ceil(allTotal/pageSize)" @click="load(false)">加载更多</p>
                        <p v-else>没有更多了</p>
                    </div>
                    <div v-else class="notData">
                        没有数据
                    </div>
                </div>
            </ul>
            <ul v-else>
                <li v-for="(item,index) in addressList" :key="index" >
                    <p>
                        <span class="sender">{{item.ReceiveName}}</span><span class="contact">{{item.Cellphone}}</span>
                    </p>
                    <p class="address"><i class="iconfont icon-address"></i>{{item.Province+item.City+item.County+item.StreetAddress}}</p>
                    <p class="foot">
                        <router-link to='' @click.native="selected(item,index)">
                            <i class="iconfont" :class="item.IsDefault ? 'icon-xuanzhong' : 'icon-weixuanzhong'"></i>
                            默认地址
                        </router-link>
                        <i-button type="primary"  @click="rev(item.F_Id)">编辑</i-button>
                        <i-button type="primary"  @click="del(item.F_Id,index)">删除</i-button>
                    </p>
                    <Divider />
                </li>
                <div class="li-foot">
                    <div v-if="addressList.length>0">
                        <p v-if="pageNum < Math.ceil(allTotal/pageSize)" @click="load(false)">加载更多</p>
                        <p v-else>没有更多了</p>
                    </div>
                    <div v-else class="notData">
                        没有数据
                    </div>
                </div>
            </ul>
        </div>
        <foot-common :btnText="text" :icon="iconf" @click.native="addAddress"></foot-common>
    </div>
    
</template>
<script>
import footCommon from '@/components/foot-common.vue';
import {wxget,wxpost} from '@/axios/ajax';
import {isLoading} from '@/assets/js/load.js'
export default {
    name: 'addressList',
    data() {
        return{
            text:'添加新地址',
            iconf:'icon-add',
            addressList:[],
            isCar:'',//是否是订单过来
            pageNum:1,//初始页数
            pageSize:4,//默认每页显示个数
            searchText:'',//搜索条件

            allTotal:0
        }
    },
    components: {
        footCommon
    },
    methods:{
        Search(){//搜索
            let that = this;
            that.load(true);
        },
        back(){//返回上一页面
            let that = this;
            that.$router.go(-1);
        },
        load(bool){//加载地址信息
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
                 that.addressList = [];//初始化
                 isLoading(that,'加载中···');
            }
            wxget('User/GetUserAddress/'+that.pageSize+'/'+that.pageNum+'/'+that.searchText).then(res =>{
                that.$Spin.hide();
                if(res.code == 200){
                    // that.addressList = res.data;
                    that.addressList.push(...res.data);
                    that.allTotal = res.total;
                }else{
                    that.$Message.error(res.message);
                }
            })
        },
        chooseAddress(id){//选择地址后
            let that = this;
            that.$Message.success({
                content:'选择地址成功',
                duration:1,
                onClose(){
                    that.$router.push({name:'waitOrder',query: {addressId:id},params:{ids:that.isCar}});//跳转
                }
            });  
        },
        reload(){//删除后刷新
            let that = this;
            wxget('User/GetUserAddress/'+that.pageSize+'/'+that.pageNum+'/'+that.searchText).then(res =>{
                if(res.code == 200){
                    let nowData = that.addressList.concat(res.data);
                    let obj = {};
                    let newData =  nowData.reduce((cur,next) => {
                        obj[next.F_Id] ? "" : obj[next.F_Id] = true && cur.push(next);
                        return cur;
                    },[]); //设置cur默认类型为数组，并且初始值为空的数组
                    that.addressList = newData;
                    that.allTotal = res.total;
                }else{
                    that.$Message.error(res.message);
                }
            })
        },
        addAddress(){//新增操作
            let that = this;
            if(that.isCar){
                that.$router.push({name:'newAddress',params: { id:0 },query:{ids:that.isCar}});
            }else{
                that.$router.push({name:'newAddress',params: { id:0 }});
            }
            
        },
        selected(obj,index){//设置默认
            let that = this;
            let id = obj.F_Id;
            if(obj.IsDefault){
                that.$Message.warning('已设置为默认，请勿重复操作');
                return false;
            }
            that.addressList.map((item,key,arr) => {
                if(item.IsDefault){
                    item.IsDefault = false;
                }
                if(index == key){
                    item.IsDefault = true;
                }
            })
            isLoading(that,'更新中···');

            wxpost('User/SetUserAddressByDefault',{Id:id}).then(res =>{
                that.$Spin.hide();
                if(res.code == 200){
                    that.$Message.success(res.message);
                }else{
                    that.$Message.error(res.message);
                }
            })
        },
        rev(id){//编辑
            let that = this;
            if(that.isCar){
                that.$router.push({name:'newAddress',params: { id:id },query:{ids:that.isCar}});
            }else{
                that.$router.push({name:'newAddress',params: { id:id }});
            }
            // that.$router.push({name:'newAddress',params: { id:id }});
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
                                isLoading(that,'删除中···')
                                wxpost('User/SetUserAddressByDelete',{Id:id}).then(res =>{
                                    that.$Spin.hide();
                                    if(res.code == 200){
                                        that.$Message.success(res.message);
                                        that.$Modal.remove();

                                        that.addressList.map((item,key,arr) => {
                                            if(num == key){
                                                that.addressList.splice(key,1);
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
        let carIds = that.$route.query.ids || '';
        if(carIds){
            that.isCar = carIds;
        }else{
            that.isCar = '';
        }
        that.load(true);//初始加载
    }
}
</script>
<style lang="scss" scoped>
    #container{
        padding-bottom: 1.0667rem;
        .header_nav{
            .ivu-form-item{margin-bottom:0;}
            .row{padding:0.1333rem 0.4rem;background:#009788;}
            .row:after{display:block;content:'';clear:both;}
            .ivu-col-span-3{
                height:32px;
                line-height:32px;
                text-align: center;
            }
            .ivu-col-span-20 .ivu-input-wrapper{
                vertical-align:bottom; 
            }
        }
        .content{
            padding:0.5333rem 0.4rem 0;// 20px 15px 0;
            ul{
                li{
                    p{
                        margin:0.1333rem 0;//5px 0
                        &:nth-child(1){
                            span{
                                font-size:0.3733rem;//14px;
                                &:nth-child(1){
                                    color:#3E3A39;
                                }
                                &:nth-child(2){
                                    color:#333333;
                                    float:right;
                                }
                            }
                        }
                        &:nth-child(2){
                            font-size:0.3733rem;//14px;
                            color:#797979;
                        }
                       
                        &:nth-child(3){
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




