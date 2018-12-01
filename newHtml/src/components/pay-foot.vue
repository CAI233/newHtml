<template>
    <div class="foot-nav-containner">
        <ul class="bottom-nav">
            <li class="bottom-nav__li ">
                    <router-link :to='{path:"/"}' class="bottom-nav__li ">
                        <i class="iconfont icon-shopping"></i>
                        <span>{{count}}</span>
                    </router-link>
            </li>
            <li class="bottom-nav__li ">
                <span>合计:<i>¥{{price}}</i></span>
                <button type="button" @click="goCar">立即购买</button>
            </li> 
        </ul>
    </div>
</template>
<script>
export default {
    name: 'pay-foot',
    data () {
        return {
            // goodsCount:0,
            // payTotal:0,
        }
    },
    methods:{
        goCar(){
            let that = this;
            that.$router.push({name:'car'});
        }
    },
    props: {
        count:Number,
        price:Number,
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
    }
    .foot-nav-containner{
        position: fixed;
        bottom:0;
        width: 100%;
        z-index: 1001;
        border-top: 1px solid #ddd;
        background: #fff;
        .bottom-nav{
            display: flex;
            .bottom-nav__li{
                height: 1.0667rem;
                position: relative; 
                &:nth-child(1){
                    flex:1;
                    a{
                        height: 1.0667rem;
                        line-height: 1.0667rem;
                        display: inline-block;
                        padding: 0 0.5rem;
                        position:relative;
                        i{
                            font-size:0.5333rem;
                            color:#727171;
                        }
                        span{
                            position: absolute;
                            right: 0.15rem;
                            top: 0rem;
                            background: #000;
                            border-radius: 50%;
                            font-size: 12px;
                            width: 0.5rem;
                            height: 0.5rem;
                            background: #ff9b00;
                            color: #fff;
                            line-height: 0.5rem;
                            text-align: center
                        }
                    }
                }
                &:nth-child(2){
                    flex:3;
                    // align-items:center;
                    // justify-content:center;
                    text-align: right;
                    span{
                        color: #DF8D15;
                        margin-right: 0.2667rem;//10px 
                        i{
                            margin-left: 0.2667rem;//10px 
                        }
                    }
                    button{
                        background:#009788;
                        height: 1.0667rem;
                        line-height: 1.0667rem;
                        color:#fff;
                            width: 2.4rem;
                            outline: 0;
                            border: none;
                            box-shadow:none;
                    }
                     
                }
            }
        }
    }

</style>
