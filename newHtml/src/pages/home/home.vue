<template>
    <div>
        <keep-alive>
   			<router-view></router-view>	 
   		</keep-alive>
        <foot-nav></foot-nav>
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
          
        }
    },
}
</script>