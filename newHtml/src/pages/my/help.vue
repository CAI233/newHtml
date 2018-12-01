<template>
    <div id="container" class="help">
        <div class="title">
            <Button type="primary" long>新手帮助</Button>
        </div>
        <div class="content">
            <Collapse v-model="num" accordion>
                <Panel v-for="(item,index) in listData" :key="index">
                    {{item.title}}
                    <p slot="content">{{item.text}}</p>
                </Panel>
            </Collapse>
        </div>
    </div>
</template>
<script>
import textList from './helpText.js';//获取组件
export default {
    name: 'help',
    data() {
        return{
             num:'0',
             listData:[]
        }
    },
    components: {
        
    },
    methods:{
        
    },
    mounted(){
        let that = this;
        that.listData = textList;
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
            padding:0 0.4rem 0;//0 15px 0;
            .ivu-collapse{
                background:#fff;
                border:none;
           }
        }
    }
</style>
<style>
    .help .ivu-collapse>.ivu-collapse-item.ivu-collapse-item-active>.ivu-collapse-header{
        border-bottom:none;
    }
    .help .ivu-collapse>.ivu-collapse-item .ivu-collapse-header{
        font-size:0.3733rem;
        color:#727171;
    }
    .help .ivu-collapse>.ivu-collapse-item .ivu-collapse-content>.ivu-collapse-content-box{
        color:#727171;
    }
    .help .ivu-collapse>.ivu-collapse-item{
        border: 1px solid #DCDDDD;
        margin:0.4rem 0;
        border-radius:0.1333rem;
    }
    .help .ivu-collapse>.ivu-collapse-item.ivu-collapse-item-active{
        border:  1px solid #009788;
    }
    .help .ivu-collapse>.ivu-collapse-item.ivu-collapse-item-active .ivu-collapse-header{
        color:#009788;
    }
    .help .ivu-collapse>.ivu-collapse-item.ivu-collapse-item-active .ivu-collapse-content>.ivu-collapse-content-box{
        color:#009788;
    }
</style>



