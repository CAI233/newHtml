<template>
    <div id="container" class="printList">
        <div class="content">
            <ul>
                <li v-for="(item,index) in printList" :key="index">
                    <p>
                        <span class="sender">{{item.Sender}}</span><span class="contact">{{item.Contact}}</span>
                    </p>
                    <p class="address">{{item.Company}}</p>
                    <p class="foot">
                        <router-link to='' @click.native="selected(item,index)">
                            <i class="iconfont" :class="item.IsDefault ? 'icon-xuanzhong' : 'icon-weixuanzhong'"></i>
                            默认打印
                        </router-link>
                        <i-button type="primary"  @click="rev(item.F_Id)">编辑</i-button>
                        <i-button type="primary"  @click="del(item.F_Id,index)">删除</i-button>
                    </p>
                    <Divider />
                </li>
                <div class="li-foot">
                    <div v-if="printList.length>0">
                        <p v-if="pageNum <MaxNum" @click="load(false)">加载更多</p>
                        <p v-else>没有更多了</p>
                    </div>
                    <div v-else class="notData">
                        没有数据
                    </div>
                </div>
            </ul>
        </div>
        <foot-common :btnText="text" :icon="iconf" @click.native="addPrint"></foot-common>

        <Modal v-model="isDel" title="删除操作" class-name="vertical-center-modal" @on-cancel="cancel">
            <p slot="header" style="color:#f60;text-align:center">
                <!-- <Icon type="ios-information-circle"></Icon>
                <span>退出操作</span> -->
            </p>
            <div style="text-align:center">
                <p>确认删除吗？</p>
            </div>
            <div slot="footer" style="text-align:center;">
                <Button type="primary" @click.native="ok">确定</Button>
                <Button @click.native="cancel">取消</Button>
            </div>
        </Modal>
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
            text:'添加新打印配置',
            iconf:'icon-add',
            printList:[],
            isDel:false,//是否删除
            nowId:'',//当前选中id
            nowIndex:0,//当前选中下标
            pageNum:1,//初始页数
            pageSize:4,//默认每页显示个数

            MaxNum:0
        }
    },
    components: {
        footCommon
    },
    methods:{
        load(bool){
            let that = this;
            if(!bool){
                if(that.pageNum >= that.MaxNum){
                    return false;
                }else{
                    that.pageNum++;
                } 
            }else{
                 that.pageNum =1;//初始页数
                 that.pageSize =4;//默认每页显示个数
                 that.printList = [];//初始化
                 isLoading(that,'加载中···');
            }
            wxget('User/GetUserExpressConfig/'+that.pageSize+'/'+that.pageNum).then(res =>{
                that.$Spin.hide();
                if(res.code == 200){
                    // that.printList = res.data;
                    that.printList.push(...res.data);
                    that.MaxNum = Math.ceil(res.total/that.pageSize);
                }else{
                    that.$Message.error(res.message);
                }
            })
        },
        addPrint(){//新增操作
            let that = this;
            that.$router.push({name:'newPrintList',params: { id:0 }});
        },
        selected(obj,index){//设置默认
            let that = this;
            let id = obj.F_Id;
            if(obj.IsDefault){
                that.$Message.warning('已设置为默认，请勿重复操作');
                return false;
            }
            that.printList.map((item,key,arr) => {
                if(item.IsDefault){
                    item.IsDefault = false;
                }
                if(index == key){
                    item.IsDefault = true;
                }
            })
            isLoading(that,'更新中···');
            // console.log(that.printList);
            wxpost('User/SetUserExpressConfigByDefault',{Id:id}).then(res =>{
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
            that.$router.push({name:'newPrintList',params: { id:id }});
        },
        del(id,index){//删除
            let that = this;
            that.isDel = true;
            that.nowId = id;
            that.nowIndex = index;
        },
        ok(){
            let that = this;
            that.printList.map((item,key,arr) => {
                if(that.nowIndex == key){
                    that.printList.splice(key,1);
                }
            })
            // that.isLoading('加载中···');
            wxpost('User/SetUserExpressConfigByDelete',{Id:that.nowId}).then(res =>{
                // that.$Spin.hide();
                if(res.code == 200){
                    that.isDel = false;
                    // for(var i =0;i< that.pageNum;i++){//更新数据
                    //     if(i == 0){
                    //         that.load(true);
                    //     }else{
                    //         that.load(true);
                    //     }
                    // }
                    that.$Message.success(res.message);
                }else{
                    that.$Message.error(res.message);
                }
            }).catch(res =>{
                console.log(res);
            })
        },
        cancel(){//取消操作
            let that = this;
            that.isDel = false;
        },
    },
    mounted(){
        let that = this;
        that.load(true);//初始加载
    }
}
</script>
<style lang="scss" scoped>
    #container{
        padding-bottom: 1.0667rem;
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




