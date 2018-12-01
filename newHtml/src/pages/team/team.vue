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
    beforeCreate(){
        console.log('beforeCreate');
    },
    created(){
        console.log('created');
        // this.nowPath = this.$router.options.routes.filter(res => res.path == this.$route.path);
    },
    beforeMount(){
        console.log('beforeMount');
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
    beforeUpdate(){
        console.log('beforeUpdate');
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
    beforeDestroy(){
        console.log('beforeDestroy');
    },
    destroyed(){
        console.log('destroyed');
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