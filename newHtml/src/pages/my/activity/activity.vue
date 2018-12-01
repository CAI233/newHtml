<template>
    <div id="container" class="activity">
        <div class="title">
            <Button type="primary" long>关注三草两木商城小程序</Button>
        </div>
        <div class="content">
            <ul>
                <li v-for="(item,index) in activityList" :key="index">
                     <router-link :to='{ name:"activityDetail",params: { id: item.F_Id }}' >
                         <Row>
                            <Col span="6">
                                <img v-lazy="item.Imgurl" :key="item.Imgurl" alt="" />
                            </Col>
                            <Col span="16">
                                <p>标题:{{item.Title}}</p>
                                <p>摘要:{{item.Summary}}</p>
                                <p>时间:{{item.CreateDate}}</p>
                            </Col>
                            <Col span="2">
                                <i class="iconfont icon-check"></i>
                            </Col>
                        </Row>
                     </router-link>
                    
                    <Divider />
                </li>
                <div class="list-foot" :class="activityList.length == 0 ? 'no' :''">
                    <div v-if="activityList.length>0">
                        <p v-if="pageNum <MaxNum">下拉加载更多</p>
                        <p v-else>没有更多了</p>
                    </div>
                    <div v-else class="notData">
                        <p><img src="../../../assets/images/noActivity.png" alt="" style="width:3rem;vertical-center:bottom;"></p>
                        <p>当前没有活动</p>
                    </div>
                </div>
            </ul>
        </div>
        <foot-common :btnText="text" :icon="iconf" @click.native="addActivity"></foot-common>
    </div>
</template>

<script>
import footCommon from '@/components/foot-common.vue';
import {isLoading} from '@/assets/js/load.js';
import {wxget,wxpost} from '@/axios/ajax';
export default {
    name: 'activity',
    data() {
        return{
            text:'发布新活动方案',
            iconf:'',
            activityList:[],
            pageNum:1,//初始页数
            pageSize:5,//默认每页显示个数
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
                 that.pageSize =5;//默认每页显示个数
                 that.activityList = [];//初始化
                 isLoading(that,'加载中···');
            }
            wxget('API/GetProgramList/'+that.pageSize+'/'+that.pageNum).then(res =>{
                that.$Spin.hide();
                if(res.code == 200){
                    // that.printList = res.data;
                    console.log(res)
                    that.activityList.push(...res.data);
                    that.MaxNum = Math.ceil(res.total/that.pageSize);
                }else{
                    that.$Message.error(res.message);
                }
            }).catch(res =>{
                console.log(res);
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
        },
        addActivity(){
            let that = this;
            that.$router.push({name:'newActivity',params: { id:0 }});
        }
    },
    mounted(){
        let that = this;
        window.addEventListener('scroll', that.handleScroll);//添加滚动监听事件
        that.load(true);//初始加载
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
            }
        } 
        .content{
            padding:0.5333rem 0.4rem 0;// 20px 15px 0;
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





