<template>
    <div class="foot-nav-containner" v-if="natoolp">
        <ul class="bottom-nav">
            <router-link tag="li" :to='{path:"/home"}' class="bottom-nav__li ">
                <i class="iconfont icon--210"></i>
                <span>首页</span>
            </router-link>
            <router-link tag="li" :to='{path:"/goods"}' class="bottom-nav__li ">
                <i class="iconfont icon--401"></i>
                <span>商品</span>
            </router-link>
            <router-link tag="li" :to='{path:"/order"}' class="bottom-nav__li ">
                <i class="iconfont icon--421"></i>
                <span>订单</span>
            </router-link>
            <router-link tag="li" :to='{path:"/team"}' class="bottom-nav__li ">
                <i class="iconfont icon--110"></i>
                <span>团队</span>
            </router-link>
            <router-link tag="li" :to='{path:"/my"}' class="bottom-nav__li">
                <i class="iconfont icon--91"></i>
                <span>我的</span>
            </router-link>
            
        </ul>
     </div>
</template>

<script>
export default {
    name: 'foot-nav',
    props: {
        natoolp:{
            type: Boolean,
            default: true
        }
    },
    data () {
        return {
        //  goddsNumber:5
        }
    },
    computed:{
        // goddsNumber(){
        //     return this.$store.getters.goddsNumber
        // }
    }
}
</script>

<style scoped lang="scss">
    .router-link-active{
        color:#009788;
        i{
            color:#009788 !important;
        }
    }
    .foot-nav-containner{
        position: fixed;
        bottom:0;
        width: 100%;
        z-index: 1001;
        border-top: 1px solid #ddd;
        background: #fff;
        box-sizing: border-box;
        .bottom-nav{
            display: flex;
            .bottom-nav__li{
                flex:1;
                align-items:center;
                justify-content:center;
                text-align: center;
                height: 1.333rem;
                // line-height:1.5rem;
                display:flex;
                flex-direction:column;
                // @include fz(20px);
                position: relative;
                // span{@include fz(13px);}
                i{
                    color:#AAAAAA;
                    font-size:0.6rem;
                    line-height: 1;
                }
                
            }
        }
    }


    
    


</style>
