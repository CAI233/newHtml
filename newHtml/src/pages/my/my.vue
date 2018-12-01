<template>
    <div class="cont-body">
        <keep-alive>
   			<router-view :key="key"></router-view>	 
   		</keep-alive>
        <foot-nav :natoolp="natoolp"></foot-nav>
    </div>
</template>
<script>
import footNav from '@/components/foot-nav.vue';
export default {
        components:{
            footNav
    },
    data(){
        return {
            natoolp:true,
            key:'',
        }
    },
    mounted(){
        console.log('mounted');
        let that = this;
        if(that.$route.meta.isFoot){
            that.natoolp = true;
        }else{
            that.natoolp = false;
        }
    },
    updated(){
        console.log('updated');
        let that = this;
        if(that.$route.meta.isFoot){
            that.natoolp = true;
        }else{
            that.natoolp = false;
        }
    },
    watch:{
        '$route' (to, from) {
            let that = this;
            that.key = Math.random()*1000;
        }
    }
}
</script>
<style lang="scss" scoped>
    .cont-body{
        height:100%;
    }
</style>