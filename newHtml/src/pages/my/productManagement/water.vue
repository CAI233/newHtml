<template>
    <div id="container" class="water">
        <Tabs v-model="nowIndex" @on-click="selected" class="content">
            <TabPane label="全部" name="0">
                <ul class="allList">
                    <li v-for="(item,index) in allData" :key="index">
                        <p class="list-u" v-if="item.StoreInto>0">增加<span class="fl_r">+{{item.StoreInto}}</span></p>
                        <p class="list-u" v-if="item.StoreOut>0">减少<span class="fl_r">-{{item.StoreOut}}</span></p>
                        <p class="list-d"><span class="fl_t">{{item.JoinDate}}</span><span class="fl_r">{{item.CurrentStore}}</span></p>
                        <p class="list-d" >原因:{{item.Remark}}</p>
                        <p class="list-d" >来源:{{item.SourceNo}}</p>
                        <Divider />
                    </li>
                    <div class="list-foot">
                        <div v-if="allData.length>0">
                            <p v-if="pageNum <MaxNum">下拉加载更多</p>
                            <p v-else>没有更多了</p>
                        </div>
                        <div v-else class="notData">
                            没有数据
                        </div>
                    </div>
                </ul>
            </TabPane>
            <TabPane label="增加" name="1">
                <ul class="allList">
                    <li v-for="(item,index) in allData" :key="index">
                        <p class="list-u" v-if="item.StoreInto>0">增加<span class="fl_r">+{{item.StoreInto}}</span></p>
                        <p class="list-u" v-if="item.StoreOut>0">减少<span class="fl_r">-{{item.StoreOut}}</span></p>
                        <p class="list-d"><span class="fl_t">{{item.JoinDate}}</span><span class="fl_r">{{item.CurrentStore}}</span></p>
                        <p class="list-d" >原因:{{item.Remark}}</p>
                        <p class="list-d" >来源:{{item.SourceNo}}</p>
                        <Divider />
                    </li>
                    <div class="list-foot">
                        <div v-if="allData.length>0">
                            <p v-if="pageNum <MaxNum">下拉加载更多</p>
                            <p v-else>没有更多了</p>
                        </div>
                        <div v-else class="notData">
                            没有数据
                        </div>
                    </div>
                </ul>
            </TabPane>
            <TabPane label="减少" name="2">
                <ul class="allList">
                    <li v-for="(item,index) in allData" :key="index">
                        <p class="list-u" v-if="item.StoreInto>0">增加<span class="fl_r">+{{item.StoreInto}}</span></p>
                        <p class="list-u" v-if="item.StoreOut>0">减少<span class="fl_r">-{{item.StoreOut}}</span></p>
                        <p class="list-d"><span class="fl_t">{{item.JoinDate}}</span><span class="fl_r">{{item.CurrentStore}}</span></p>
                        <p class="list-d" >原因:{{item.Remark}}</p>
                        <p class="list-d" >来源:{{item.SourceNo}}</p>
                        <Divider />
                    </li>
                    <div class="list-foot">
                        <div v-if="allData.length>0">
                            <p v-if="pageNum <MaxNum">下拉加载更多</p>
                            <p v-else>没有更多了</p>
                        </div>
                        <div v-else class="notData">
                            没有数据
                        </div>
                    </div>
                </ul>
            </TabPane>
        </Tabs>
    </div>
    
</template>
<script>
    import {wxget} from '@/axios/ajax';
    import {isLoading} from '@/assets/js/load.js';
    export default {
        name: 'water',
        components: {
            
        },
        data() {
            return{
                nowIndex:0,
                pageNum:1,
                pageSize:10,
                MaxNum:0,
                isGoodsNo:'',
                allData:[]
            }
        },
        methods:{
            selected(name){
                let that = this;
                that.load(true);
            },
            load(bool){
                let that = this;
                if(bool){
                    that.pageNum = 1;
                    that.pageSize = 6;
                    that.MaxNum = 0;
                    that.allData = [];
                    isLoading(that,'数据加载中···')
                }else{
                    if(that.pageNum >= that.MaxNum){
                        return false;
                    }else{
                        that.pageNum++;
                    } 
                }
                wxget('User/GetAgentStoreSlipList/'+that.pageSize+'/'+that.pageNum+'/'+that.isGoodsNo+'/'+that.nowIndex).then(res =>{
                    that.$Spin.hide();
                    if(res.code == 200){
                        // that.allData = res.data;
                        that.allData.push(...res.data);
                        that.MaxNum = Math.ceil(res.total/that.pageSize);
                    }else{
                        that.$Message.error(res.messahe);
                    }
                })
            },
            handleScroll(){
                let that = this;
                let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
                let bodyHeight = document.documentElement.clientHeight;
                let scrollHeight = document.documentElement.scrollHeight;
                if(scrollTop + 5 > scrollHeight - bodyHeight){
                    // console.log(1);
                    that.load(false);
                }
            }
        },
        mounted(){
            let that = this;
            window.addEventListener('scroll', that.handleScroll)//添加滚动监听事件
            that.isGoodsNo = that.$route.params.id;
            console.log(that.isGoodsNo);
            that.load(true);
        }
    }
</script>
<style lang="scss" scoped>
    #container{
        padding-bottom: 1.333rem;
        .content{
            margin:0.5333rem 0.4rem 0;//20px 15px 0 
            .allList{
                li{
                    .list-u{
                        font-size:0.3733rem;//14px
                        color:#3E3A39;
                        .fl_r{
                            float:right;
                        }
                    }
                    .list-d{
                        font-size:0.32rem;//12px
                        color:#727171;
                        .fl_r{
                            float:right;
                            font-size:0.3733rem;//14px
                        }
                    }
                    .ivu-divider-horizontal{
                        margin:0.2667rem 0;
                    }
                }
                .list-foot{
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
    .water .ivu-tabs-nav{
        display: flex;
        width:100%;
    }
    .water .ivu-tabs-nav .ivu-tabs-tab{
        width:33.33%;
        text-align:center;
        font-size:0.32rem;
    }
    .water .ivu-tabs-nav .ivu-tabs-tab-active,.water .ivu-tabs-nav .ivu-tabs-tab-focused{
        color:#DF8D15;
    }
    .water .ivu-tabs-nav .ivu-tabs-ink-bar{
        background-color:#DF8D15;
    }
</style>
