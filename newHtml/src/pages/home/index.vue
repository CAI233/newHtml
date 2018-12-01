<template>
    <div id="container" class="homeindex">
        <i-form class="header_nav">
            <Form-item>
                <Row class="row">
                    <Col span="3">
                        <!-- <router-link to="/miniCard/statement/horizon"><i class="iconfont icon-scan"></i></router-link> -->
                        <router-link to="/miniCard/statement/horizon"><i class="iconfont icon-scan"></i></router-link>
                    </Col>
                    <Col span="18">
                        <i-input type="text"  placeholder="输入搜索产品">
                            <i class="iconfont icon-seach" slot="prefix"  @click="goSearch()"></i>
                        </i-input>
                    </Col>
                    <Col span="3">
                        <!-- <router-link to="/miniCard/statement/horizon"><i class="iconfont icon-shopping"></i></router-link> -->
                        <router-link to="/miniCard/statement/horizon"><i class="iconfont icon-shopping"></i></router-link>
                    </Col>
                </Row>
            </Form-item>
        </i-form>
        <swiper :options="swiperOption" ref="swiperOption" class="swiper-box" v-if="swiperImg.length>0">
            <swiper-slide class="swiper-item" v-for="(item,index) in swiperImg" :key="index">
                <router-link to="/miniCard/statement/horizon">
                    <img v-if="index == 0 || index == swiperImg.length-1" :src="url+item.FlashSrc">
                    <img v-else v-lazy="url+item.FlashSrc" :alt="item.FlashName">
                </router-link>
                <!-- 懒加载与swiper兼容 首尾图片不采用懒加载 -->
            </swiper-slide>
            <div class="swiper-pagination" slot="pagination"></div>
        </swiper>
        <Row class="row_line">
            <Col span="5">
                <i class="iconfont icon-news" ></i>
            </Col>
            <Col span="17">
                <swiper :options="swiperOptionLine" ref="swiperOptionLine" class="swiper-line swiper-no-swiping" v-if="swiperLine.length>0">
                    <swiper-slide class="swiper-item" v-for="(item,index) in swiperLine" :key="index" >
                        <router-link to="/miniCard/statement/horizon">{{item.Title}}</router-link>
                        </swiper-slide>
                    <div class="swiper-pagination" slot="pagination"></div>
                </swiper>
            </Col> 
            <Col span="2">
                <router-link to="/miniCard/statement/horizon">更多</router-link>
            </Col> 
        </Row>
        <Row class="row_line">
            <Col span="24">
                <h3>产品专区
                    <router-link to="/miniCard/statement/horizon">更多</router-link>
                </h3>
            </Col>
            <Col span="24" v-for="(v,i) in linkImg" :key="i" v-if="linkImg.length>0" style="margin-top:0.4rem;">
                <router-link to="/miniCard/statement/horizon"><img :src="v.linkUrl" alt=""></router-link>
            </Col>
            
        </Row>
    </div>
</template>

<script>
import {get} from '@/axios/ajax';
export default {
    name: 'homeindex',
    components: {
       
    },
    methods:{
        jump:function(){
           
        }
    },
    data() {
        return{
            swiperImg:[],
            swiperLine:[],
            linkImg:[],
            url:'',
            swiperOption:{
                direction: 'horizontal', 
                loop: true,
                autoplay: {
                    delay: 3000,
                    disableOnInteraction: false
                },
            },
            swiperOptionLine:{
                direction: 'vertical',
                loop: true,
                autoplay: {
                    delay: 1500,
                    disableOnInteraction: false
                },
            }
        }
    },
    computed:{
        swiper() {
                return this.$refs.swiperOption.swiper,this.$refs.swiperOptionLine.swiper;
        }
    },
    mounted:function() {
        get('API/GetBanner/6').then(res =>{
            if(res.code == 200){
                console.log(res.data);
                this.swiperImg = res.data;
            }else{
                this.$Message.error(res.message);
            }
        });
        get('API/GetNoticeIndex/6').then(res =>{
            if(res.code == 200){
                this.swiperLine = res.data;
            }else{
                this.$Message.error(res.message);
            }
        });
        this.linkImg = [
            {linkUrl:require('@/assets/images/index1.jpg')},
            {linkUrl:require('@/assets/images/index2.jpg')}
        ];
        this.url = this.imgUrl;
    }
}
</script>
<style lang="scss" scoped>
// @import '../../assets/css/base.scss';
    .homeindex{
        padding-bottom: 1.333rem;
        .header_nav{
            .ivu-form-item{margin-bottom:0;}
            .row{padding:0.1333rem 0.4rem;background:#009788;}
            .row:after{display:block;content:'';clear:both;}
            .ivu-col-span-3{
                height:32px;
                line-height:32px;
                text-align: center;
                i{
                    font-size: 0.64rem;
                    vertical-align: middle;
                }
            }
            .ivu-col-span-20 .ivu-input-wrapper{
                vertical-align:bottom; 
            }
        }
        .swiper-box {
            width: 100%;
            height: 100%;
            margin: 0 auto;
            .swiper-item {
                height: 5rem;
                img{width:100%;height:100%;vertical-align:bottom;}
            }	   
        }
        .row_line{
            padding:0.1333rem 0.4rem;
            .ivu-col-span-5{text-align:center;height:0.8rem;line-height: 0.8rem;}
            .ivu-col-span-2{
                text-align:right;
                height:0.8rem;
                line-height: 0.8rem;
                a{color: #B5B5B6;}
            }
            .ivu-col-span-24{
                &:nth-of-type(0){
                    height:5rem;
                }
                img{
                    width:100%;
                    height:100%;
                    vertical-align:bottom;
                }
            }
            .swiper-line{
                height:0.8rem;
                .swiper-slide{
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    line-height: 0.8rem;
                    a{color: #727171;}
                }
            }
            h3{
                text-align: center;
                font-size: 14px;
                a{
                    font-size:12px;
                    color: #B5B5B6;
                    float:right;
                }
            }
        }
    }
</style>
<style>
    .homeindex .ivu-input-wrapper{
        display: inherit;
    }
</style>




