<template>
    <div id="container" class="newActivity">
        <div class="content">
            <Form ref="formItem" :model="formItem" :label-width="40">
                <FormItem label="标题">
                    <Input v-model="formItem.Title" placeholder="请输入标题"></Input>
                </FormItem>
                <FormItem label="摘要">
                    <Input v-model="formItem.Summary" type="textarea" :autosize="{minRows: 8,maxRows: 10}" placeholder="请输入摘要"></Input>
                </FormItem>
                <FormItem label="内容">
                    <Input v-model="formItem.Content" type="textarea" :autosize="{minRows: 8,maxRows: 10}" placeholder="请输入类容"></Input>
                </FormItem>
            </Form>
            <!-- <quill-editor style="display:none;" v-model="content" ref="myQuillEditor" :options="editorOption"  @blur="onEditorBlur($event)" @focus="onEditorFocus($event)" @change="onEditorChange($event)"></quill-editor> -->
        </div>
        <foot-common :btnText="text" :icon="iconf" @click.native="saveActivity"></foot-common>
    </div>
</template>
<script>
// import { quillEditor } from 'vue-quill-editor';//富文本编译器
import {wxget,wxpost} from '@/axios/ajax';
import {isLoading} from '@/assets/js/load.js';
import footCommon from '@/components/foot-common.vue';
export default {
    name: 'newActivity',
    data() {
        return{
            text:'保存',
            iconf:'',
            activityId:'',
            isAdd:false,
            content:null,
            serverUrl: '/manager/common/imgUpload',  // 这里写你要上传的图片服务器地址
            editorOption:{
                placeholder: '请输入',
                
                modules:{
                    
                    // theme: 'snow',  // or 'bubble'
                    toolbar:{
                        container:[
                            { 'align': [] },//文本居中
                            // { 'size': ['12px', '14px', '16px', '18px'] },//字体大小
                            { 'color': [] },//字体颜色
                            { 'background': [] },//背景色
                            'bold',//字体加粗
                            'italic',//字体倾斜
                            'underline',//下划线
                            'image',//图片上传
                        ],
                        handlers: {
                            'image': function (value) {
                            if (value) {
                                // 触发input框选择图片文件
                                console.log(value);
                            } else {
                                this.quill.format('image', false);
                            }
                            }
                        }
                    }
                }
            },
            formItem:{

            }
        }
    },
    components: {
        footCommon
    },
    methods:{
        saveActivity(){
            let that = this;
            if(!that.formItem.Title || that.formItem.Title == ''){
                that.$Message.warning('请输入标题');
                return false;
            }
            if(!that.formItem.Title || that.formItem.Title == ''){
                that.$Message.warning('请输入摘要');
                return false;
            }
            if(!that.formItem.Title || that.formItem.Title == ''){
                that.$Message.warning('请输入类容');
                return false;
            }
            isLoading(that,'保存中···');
            if(that.isAdd){
                wxpost('API/EditProgramInfo',that.formItem).then(res =>{
                    that.$Spin.hide();
                    if(res.code == 200){
                        that.$Message.success(res.message);
                        that.formItem = {};
                    }else{
                        that.$Message.error(res.message);
                    }
                })
            }else{
                wxpost('API/AddProgramInfo',that.formItem).then(res =>{
                    that.$Spin.hide();
                    if(res.code == 200){
                        that.$Message.success(res.message);
                        that.formItem = {};
                    }else{
                        that.$Message.error(res.message);
                    }
                })
            }

        },
        onEditorBlur(){//失去焦点事件
        },
        onEditorFocus(){//获得焦点事件
        },
        onEditorChange(){//内容改变事件
        }
    },
    mounted(){
        let that = this;
        that.activityId = that.$route.params.id;
        if(that.activityId == 0){
            that.isAdd = false;
        }else{
            that.isAdd = true;
        }
    }
}
</script>
<style lang="scss" scoped>
    #container{
        padding-bottom: 1.0667rem;
        .content{
            padding:0.5333rem 0.4rem 0;//20px 15px 0;
            .ivu-form{
                .ivu-form-item{
                    margin-bottom:0.1333rem;
                    border-bottom:1px solid #B5B5B6;
                }
            }
        }
    }
</style>
<style>
    .newActivity .content .ivu-form .ivu-form-item-label{
        color:#101010;
       font-size:0.3733rem;
    }
    .newActivity .content .ivu-form .ivu-input{
        border:none;
        outline:0;
        box-shadow:none;
    }
    .ql-editor.ql-blank, .ql-editor {
        height:4.6667rem;
        /* 175px */
    }
</style>




