<template>
    <div id="container" class="caigouScanRecord">
        <div class="content">

        </div>
    </div>
</template>
<script>
import {post,wxpost} from '@/axios/ajax';
import {addCookie,getCookie,getCurrentDate,deleteCookie} from '@/assets/js/assist.js'
import {isLoading} from '@/assets/js/load.js'
export default {
    name: 'caigouScanRecord',
    data() {
        return{
            
        }
    },
    components: {

    },
    methods:{

    },
    mounted(){

    }
}
</script>
<style lang="scss" scoped>
    #container{
        padding-bottom: 1.333rem;
        .content{
            padding:0.5333rem 0.4rem 0;//20px 15px 0;
        }
    }
</style>