<template>
    <div id="container" class="balanceDetails">
        <div class="header">
            <p class="count-title">总金额<span>{{allCount}}</span></p>
            <p class="count-text">经销商余额汇总</p>
        </div>
        <div class="content">
            <ul class="cont">
                <li class="list" v-for="(item,index) in detailsData" :key="index" v-if="item.Title != '余额'">
                    <span>{{item.Title}}</span><em>￥{{item.Amount}}</em>
                    <Divider v-if="index != detailsData.length-1" class="bg_line"/>
                </li>
            </ul>
            <div class="foot">
                <Button long @click="back">返回</Button>
            </div>
        </div>
    </div>
</template>
<script>
import {wxget,wxpost} from '@/axios/ajax';
export default {
    name: 'balanceDetails',
    data() {
        return{
            isId:'',
            allCount:0,
            detailsData:[]
        }
    },
    components: {

    },
    methods:{
        load(bool){//加载余额明细
            let inText = bool ? '?userId='+bool : '';
            let that = this;
            wxget('User/GetAgentBalanceAmountList'+inText).then(res =>{
                if(res.code == 200){
                    that.detailsData = res.data;
                }else{
                    that.$Message.error(res.details)
                }
            })
        },
        getCount(bool){//加载余额数量
            let inText = bool ? '?userId='+bool : '';
            let that = this;
            wxget('User/GetAgentBalanceAmount'+inText).then(res =>{
                if(res.code == 200){
                    that.allCount = res.details
                }else{
                    that.$Message.error(res.details)
                }
            })
        },
        back(){//返回
            let that = this;
            that.$router.go(-1);
        }
    },
    mounted(){
        let that = this;
        that.isId = that.$route.query.id;
        that.getCount(that.isId);
        that.load(that.isId);
    }
}
</script>
<style lang="scss" scoped>
    #container{
        padding-bottom: 1.333rem;
        .header{
            // background: #009788;
            background:url('../../assets/images/bg2.png') no-repeat 0 0;
            background-size:contain;
            height: 5.3333rem;//200px
            display:flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            p{
                text-align:center;
                color:#fff;
            }
            .count-title{
                font-size:0.5333rem;//20px
            }
            .count-text{
                font-size:0.3733rem;//20px
            }
        }
        .content{
            padding:0.5333rem 0.4rem 0;//20px 15px 0;
            .cont{
                .list{
                    font-size:0.3733rem;// 14px;
                    padding:0.4rem 0;// 15px 0
                    position: relative;
                    em{
                        float:right;
                    }
                    .bg_line{
                        margin:0;
                        position:absolute;
                        top:auto!important;
                        bottom:0;
                    }
                }
            }
            .foot{
                margin-top:0.4rem;//15px
                button{
                    background: #009788;
                    border-color:#009788;
                    color: #fff;
                    font-size:0.3733rem;// 14px;
                    &:hover,&:focus{
                        color: #fff;
                        border-color:#009788;
                    }
                }
            }
        }
    }
</style>