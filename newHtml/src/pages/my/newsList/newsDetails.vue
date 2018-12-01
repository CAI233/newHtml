<template>
    <div id="container" class="newsDetails">
        <div class="content">
            <dl>
                <dd >
                    <p>{{detailsData.Title}}</p>
                    <p>{{detailsData.ModifyDate}}<span>{{detailsData.SellerName}}</span></p>
                </dd>
                <dt>
                    <div class="dt_img">
                        <img v-lazy="detailsData.Imgurl" :key="detailsData.Imgurl" alt="" />
                    </div>
                    <div class="dt_text" v-html="contentText"></div>
                </dt>
            </dl>
        </div>
    </div>
</template>
<script>
import {wxget,post} from '@/axios/ajax';
export default {
    name: 'newsDetails',
    data() {
        return{
             goodsId:'',
             detailsData:{},
             contentText:''
        }
    },
    components: {
        
    },
    methods:{
        load(){
            let that = this;
            wxget('API/GetArticle/'+that.goodsId).then(res =>{
                if(res.code == 200){
                    that.detailsData = res.data;
                    console.log(res.data);
                    that.getDe(that.detailsData.Content);
                }else{
                    that.$Message.error(res.message);
                }
            })
        },
        getDe(text){
            let that = this;
            post('API/GetDe',{Content:text}).then(res =>{
                if(res.code == 200){
                    that.contentText = res.details  
                }else{
                    that.$Message.error(res.message);
                }
                         
            })
        }
    },
    mounted(){
        let that = this;
        that.goodsId = that.$route.params.id;
        that.load();
    }
}
</script>
<style lang="scss" scoped>
    #container{
        padding-bottom: 1.0667rem;
        .content{
            padding:0.5333rem 0.4rem 0;//20px 15px 0;
            dl{
                dd{
                    p{
                        &:nth-child(1){
                            color:#3E3A39;
                            font-size:0.3733rem;//14px;
                        }
                        &:nth-child(2){
                            color:#727171;
                            font-size:0.32rem;//12px
                            span{
                                margin-left:0.5333rem; //20px
                            }
                        }
                    }
                }
                dt{
                    .dt_img{
                        height:5.3333rem;//200px;
                        img{
                            width:100%;
                            height:100%;;
                            vertical-align: bottom;
                        }
                    }
                    .dt_text{
                        margin-top:0.2667rem;//10px;
                        color:#727171;
                        font-size:0.32rem;
                    }
                }
            }
        }
    }
</style>


