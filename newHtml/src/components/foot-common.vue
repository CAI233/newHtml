<template>
    <div class="foot-nav-containner">
        <div class="bottom-nav">
            <Button type="primary" long><i :class="iconText" ></i>{{btnText}}</Button>
        </div>
    </div>
</template>
<script>
export default {
    name: 'foot-common',
    data () {
        return {
            iconText:'iconfont '+this.icon
        }
    },
    props: {
        count:Number,
        price:Number,
        btnText:String,
        icon:String    
    },
    computed:{
        
    },
    methods:{
        // addSurfaceSingle(){
        //     console.log(1111);
        // }
    }
}
</script>
<style scoped lang="scss">
    .foot-nav-containner{
        position: fixed;
        bottom:0;
        width: 100%;
        z-index: 1001;
        background: #fff;
        .bottom-nav{
            display: flex;
            button{
                height:1.0667rem;//40px
                background:#009788;
                color:#fff;
                border-color:#009788;
                margin: 0 0.4rem;//0 15px
                i{
                    margin-right:0.4rem;//15px
                }
            }
        }
    }

</style>
