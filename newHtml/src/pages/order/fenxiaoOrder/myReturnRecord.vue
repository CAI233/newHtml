<template>
    <div id="container" class="myReturnRecord">
        <div class="content">
            <div class="title">
                <i class="clear iconfont icon-close-btn" v-show="date" @click="clear"></i>
                <input v-model="date" placeholder="请选择时间"  readonly />
                <router-link to='' @click.native="beginCheck">
                    <template >开始时间</template>
                </router-link>
                <router-link to='' @click.native="endCheck">
                    <template >结束时间</template>
                </router-link>
            </div>
            <div class="cont">
                <ul>
                    <li class="list" v-for="(item,index) in recordData" :key="index">
                        <div class="list-cont">
                            <p><span>条码:</span>{{item.ScanCode}}</p>
                            <p><span>退货类型:</span>{{item.RerurnSource}}</p>
                            <p><span >退货人:{{item.TargetUserName}}</span></p>
                            <p><span>退货时间:</span>{{item.CreatedTime}}</p>
                        </div>
                        <Divider v-if="index != recordData.length-1" class="down-line"/>
                    </li>
                    <div class="list-foot" :class="recordData.length == 0 ? 'no' :''">
                        <div v-if="recordData.length>0">
                            <p v-if="selRow.CurPage < Math.ceil(selRow.allTotal/selRow.PageSize)">下拉加载更多</p>
                            <p v-else>没有更多了</p>
                        </div>
                        <div v-else class="notData">
                            <p><img src="../../../assets/images/noRecord.png" alt="" style="width:3rem;vertical-center:bottom;"></p>
                            <p>当前没有记录</p>
                        </div>
                    </div>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
import {post,wxpost} from '@/axios/ajax';
import {isLoading} from '@/assets/js/load.js'
export default {
    name: 'myReturnRecord',
    data() {
        return{
            selRow:{
                PageSize:6,
                CurPage:1,
                StartDate:'',
                EndDate:'',
                allTotal:0,
            },
            recordData:[],
            date:'',
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
        load(bool){
            let that = this;
            if(bool){
                that.recordData = [];
                that.selRow.PageSize = 6;
                that.selRow.CurPage = 1;
                isLoading(that,'发货记录加载中···');
            }else{
                if(that.selRow.CurPage >= Math.ceil(that.selRow.allTotal/that.selRow.PageSize)){
                    return false;
                }else{
                    that.selRow.CurPage++;
                } 
            }
            wxpost('User/GetMyReturnScanCode',that.selRow).then(res =>{
                that.$Spin.hide();
                if(res.code == 200){
                    console.log(res);
                    that.recordData.push(...res.data);
                    that.selRow.allTotal = res.total;
                }else{
                    that.$Message.error(res.message);
                }
            })
        },
        beginCheck(){//选择开始时间
            let that = this;
            that.$picker.show({
                type:'datePicker',
                onOk: (date) =>{
                    that.selRow.StartDate = date;
                    if(that.selRow.EndDate){
                        if(Date.parse(that.selRow.StartDate) > Date.parse(that.selRow.EndDate)){
                            that.$Message.warning('开始时间不能大于结束时间');
                            return false;
                        }
                        that.date = that.selRow.StartDate+'至'+that.selRow.EndDate;
                        that.load(true);
                    }else{
                        that.date = that.selRow.StartDate;
                        that.load(true);
                    }
                    
                }
            });
        },
        endCheck(){//选择结束时间
            let that = this;
            that.$picker.show({
                type:'datePicker',
                startTime:that.selRow.StartDate,  //开始时间
                onOk:(e)=>{
                    that.selRow.EndDate = e;
                    if(that.selRow.StartDate){
                        that.date = that.selRow.StartDate+'至'+that.selRow.EndDate;
                        that.load(true);
                    }else{
                        that.date = that.selRow.EndDate;
                        that.load(true);
                    }
                },

            })
        },
        clear(){//清除操作
            let that = this;
            that.selRow.StartDate = '';
            that.selRow.EndDate = '';
            that.date = '';
            that.load(true);
        }
    },
    mounted(){
        let that = this;
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
                overflow: hidden;
                margin-top:0.2667rem;
                position: relative;
                .clear{
                    position: absolute;
                    width: 0.5rem;
                    height: 0.5rem;
                    line-height: 0.5rem;
                    font-size: 0.32rem;
                    text-align: center;
                    color: #808695;
                    background: #fff;
                    border-radius: 50%;
                    top: 0.15rem;
                    left: -moz-calc(100% - 4.76rem);
                    left: -webkit-calc(100% - 4.76rem);
                    left:calc(100% - 4.76rem);
                }
                input{
                    height:0.8533rem;
                    line-height:0.8533rem;
                    padding: 0 0.1rem;
                    float: left;
                    border: none;
                    background: #DCDDDD;
                    box-shadow: none;
                    border-radius:0;
                    outline: 0;
                    width: -moz-calc(100% - 4.16rem);
                    width: -webkit-calc(100% - 4.16rem);
                    width: calc(100% - 4.16rem);
                }
                a{
                    float:left;
                    width:2.08rem;
                    background:#009788;
                    color:#fff;
                    height:0.8533rem;
                    line-height:0.8533rem;
                    box-sizing: border-box;
                    text-align:center;
                    display: inherit;
                }
                a:nth-child(3){
                    background:none;
                    color:#727171;
                    border:1px solid #009788;
                }
            }
            .cont{
                margin-top:0.4rem;//15px
                &>ul{
                    position: relative;
                    &>.list{
                        &>.list-cont{
                            &>p{
                                font-size:0.3733rem;//14px
                                color:#888;
                                span{
                                    font-weight:bold;
                                }
                            }
                        }
                        &>.down-line{
                            margin:0.2667rem 0;
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
        
        }
    }
</style>