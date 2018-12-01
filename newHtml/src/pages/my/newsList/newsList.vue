<template>
    <div id="container" class="newsList">
        <div class="title">
            <Button type="primary" long>公告列表</Button>
        </div>
        <div class="content">
            <ul>
                <li v-for="(item,index) in newsList" :key="index">
                     <router-link :to='{ name:"newsDetails",params: { id: item.F_Id }}' >
                         <Row>
                            <Col span="6">
                                <img v-lazy="imgUrl+item.Imgurl" :key="item.Imgurl" alt="" />
                            </Col>
                            <Col span="16">
                                <p>{{item.SellerName}}</p>
                                <p>{{item.Title}}</p>
                                <p>{{item.ModifyDate}}</p>
                            </Col>
                            <Col span="2">
                                <i class="iconfont icon-check"></i>
                            </Col>
                        </Row>
                     </router-link>
                    
                    <Divider />
                </li>
                <div class="list-foot" :class="newsList.length == 0 ? 'no' :''">
                    <div v-if="newsList.length>0">
                        <p v-if="pageNum <MaxNum">下拉加载更多</p>
                        <p v-else>没有更多了</p>
                    </div>
                    <div v-else class="notData">
                        <p><img src="../../../assets/images/noNews.png" alt="" style="width:3rem;vertical-center:bottom;"></p>
                        <p>当前没有公告</p>
                    </div>
                </div>
            </ul>
        </div>
    </div>
</template>
<script>
import {wxget,wxpost} from '@/axios/ajax';
import {isLoading} from '@/assets/js/load.js'
export default {
    name: 'newsList',
    data() {
        return{
            pageNum:1,//初始页数
            pageSize:4,//默认每页显示个数
            MaxNum:0  ,//最大页数
            newsList:[]//公告数组 
        }
    },
    components: {
        
    },
    methods:{
        load(bool){
            let that = this;
            if(bool){
                that.pageNum = 1;
                that.pageSize = 4;
                that.MaxNum = 0;
                that.newsList = [];
                isLoading(that,'数据加载中···');
            }else{
                if(that.pageNum >= that.MaxNum){
                    return false;
                }else{
                    that.pageNum++;
                } 
            }
            wxget('API/GetArticleList/6394c9c8-10d5-4595-99c5-48381ead32e3/'+that.pageSize+'/'+that.pageNum).then(res =>{
                that.$Spin.hide();
                if(res.code == 200){
                    that.newsList.push(...res.data);
                    console.log(that.newsList);
                    that.MaxNum = Math.ceil(res.total/that.pageSize);
                }else{
                    that.$Message.error(res.message);
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
        window.addEventListener('scroll', that.handleScroll);//添加滚动监听事件
        that.load(true);
    }
}
</script>
<style lang="scss" scoped>
    #container{
        padding-bottom: 1.0667rem;
        .title{
            display: flex;
            button{
                height:1.2rem;//45px
                background:#009788;
                color:#fff;
                border-color:#009788;
                font-size:0.4267rem;//16px
                // margin: 0 0.4rem;//0 15px
            }
        }
        .content{
            padding:0.5333rem 0.4rem 0;//20px 15px 0;
            ul{
                position: relative;
                li{
                    .ivu-row{
                        .ivu-col{
                            &:nth-child(2){
                                padding:0 0.2667rem;// 5px 10px
                            }
                            &:nth-child(3){
                                margin-top: 0.8rem;
                                i{
                                    color:#727171;
                                }
                            }
                            img{
                                width:100%;
                                vertical-align:bottom;
                            }
                            p{
                                &:nth-child(1){
                                    font-size:0.3733rem;//14px;
                                    color:#101010;
                                    height:1.0667rem;
                                    overflow: hidden;
                                    -webkit-line-clamp: 2;
                                    text-overflow: ellipsis;
                                    display: -webkit-box;
                                    -webkit-box-orient: vertical
                                }
                                &:nth-child(2){
                                    color:#9C9C9C;
                                    font-size:0.32rem;
                                    margin-bottom:0.1333rem;//5px
                                    overflow: hidden;
                                    text-overflow:ellipsis;//文本溢出显示省略号
                                    white-space:nowrap;//文本不会换行（单行文本溢出）
                                }
                                &:nth-child(3){
                                    color:#9C9C9C;
                                    font-size:0.32rem;
                                }
                            }
                        }
                    }
                    .ivu-divider-horizontal{
                        margin:0.2667rem 0;
                    }
                }
                .list-foot{
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
                    }
                }
            }
        }
    }
</style>


