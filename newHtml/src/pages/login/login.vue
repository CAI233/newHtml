<template>
  <div class="login">
    <div class="lg_title">
      <img src="../../assets/images/login.jpg" alt="">
    </div>
    <div class="lg_conternt">
      <i-form ref="formCustom" :model="formCustom" :rules="ruleCustom">
        <Form-item label="选择品牌"  class="drop_item" prop="SellerNo">
            <i-select v-model="formCustom.SellerNo" @on-change="getSellerName(formCustom.SellerNo)" placeholder="请选择" >
                <i-option v-for="item in todos" :key="item.SellerName" :value="item.SellerNo" >{{item.SellerName}}</i-option>
            </i-select>
        </Form-item>
        <Form-item class="line_item" prop="UserPhone">
            <i-input type="text" v-model.trim()="formCustom.UserPhone" placeholder="请输入手机号/微信号" clearable></i-input>
        </Form-item>
        <Form-item class="line_item" prop="PassWordNoEn">
            <i-input type="password" v-model.trim()="formCustom.PassWordNoEn" placeholder="请输入密码">
              <router-link :to="{name:'forgetPassword'}" slot="append">忘记密码</router-link>
            </i-input>
        </Form-item>
        <Form-item>
            <i-button type="primary"  @click.enter="goLogin('formCustom')">登录</i-button>
        </Form-item>
        <Form-item>
            <!-- <router-link to="/forgetPass" class="gore">注册</router-link> -->
            <div style="clear:both;"></div>
        </Form-item>
      </i-form>
    </div>
  </div>
</template>

<script>
import {setLoginUser,getLoginUser,addCookie,getCookie} from '@/assets/js/assist.js'
import {get,wxget,wxpost,post} from '@/axios/ajax';
import {isLoading} from '@/assets/js/load.js';
export default {
  name: 'login',
  data () {
    const validateSellerName = (rule, value, callback) => {
      // console.log(vueGlobal.messageWarn('请选择品牌'))
        if (!value || value === '') {
          this.$Message.warning('请选择品牌');
          callback(new Error('请选择品牌'));
        }else{
          callback();
        } 
    };
    const validatePhone = (rule, value, callback) => {
        if (!value || value === '') {
          this.$Message.warning('账号不能为空');
          callback(new Error('账号不能为空'));
        }else{
          callback();
        }
    };
    const validatePass = (rule, value, callback) => {
        if (!value) {
          this.$Message.warning('密码不能为空');
          callback(new Error('密码不能为空'));
        }else if(value.length<6){
          this.$Message.warning('密码长度不能小于6位');
          callback(new Error('密码长度不能小于6位'));
        }else if(value.indexOf(".") != -1){
          this.$Message.warning('密码不能包含小数点');
          callback(new Error('密码不能包含小数点'));
        }else{
          callback();
        }
    };
    return {
      infoData: getLoginUser() ? getLoginUser() : '',
      formCustom: {
        SellerNo: '',
        SellerName:'',
        SellerF_Id:'',
        UserPhone: '',
        PassWord: '',
        PassWordNoEn:'',
        OpenId:''
      },
      todos:[],
      ruleCustom: {
          SellerNo: [
              {validator: validateSellerName, trigger: 'blur' }
          ],
          UserPhone: [
              {validator: validatePhone, trigger: 'blur' }
          ],
          PassWordNoEn: [
              {validator: validatePass, trigger: 'blur' }
          ]
      }
    }
  },
  methods: {
    getSellrer(){
      let that = this;
      get('API/GetSellerList').then(res =>{//加载品牌
        if(res.code == 200){
          that.todos = res.data;
          if(that.todos.length == 1){
            that.formCustom.SellerNo = that.todos[0].SellerNo;
            that.formCustom.SellerName = that.todos[0].SellerName;
            that.formCustom.SellerF_Id = that.todos[0].F_Id;
          }
        }else{
          that.$Message.error(res.message);
        }
     })
    },
    getSellerName(SellerNo){
      let that = this;
      that.todos.map((item) =>{
        if(item.SellerNo == SellerNo){
          that.formCustom.SellerName = item.SellerName;
          that.formCustom.SellerF_Id = item.F_Id;
        }
      })
    },
    goLogin (name) {
        let that = this;
        that.$refs[name].validate((valid) => {
            if (valid) {
                // this.$Message.success('提交成功!');
                isLoading(that,'登录中···');
                wxpost('API/PostEn',{Content:that.formCustom.PassWordNoEn}).then(res => {
                  if(res.code == 200){
                    that.formCustom.PassWord = res.details;
                    wxpost('API/SetLogin',that.formCustom).then(resd => {//登录
                      that.$Spin.hide();
                      if(resd.code == 200){
                        setLoginUser(resd.data.userInfo,resd.details);//缓存个人登录信息
                        addCookie('password',that.formCustom.PassWordNoEn,1);  //缓存密码
                        addCookie('SellerF_Id',that.formCustom.SellerF_Id,1);//缓存品牌id    
                        that.$Message.success({
                          content:'登录成功',
                          duration:0.5,
                          onClose(){ 
                            that.$router.replace({path:'/home'});
                          }
                        });   
                        
                      }else{
                        that.$Message.error(resd.details);
                      }
                    })
                  }else{
                    that.$Message.error(res.message);
                  }
                })
            } else {
                that.$Message.warning('请输入相关信息!');
            }
        })
    }
  },
  mounted(){
    let that = this;
    if(that.infoData){//获取个人信息
      that.formCustom.SellerNo = that.infoData.SellerNo || '';
      that.formCustom.SellerName = that.infoData.SellerName || '';
      that.formCustom.UserPhone = that.infoData.UserPhone || '';
      that.formCustom.PassWordNoEn = getCookie('password') || '';
    }

    that.getSellrer();
    console.log(getCookie('password'))

    
      
   }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.login{
  .lg_title{
    width: 2.66rem;
    height: 2.66rem;
    margin: 2rem auto 1.5rem;
    img{
      vertical-align:bottom;
      width:100%;
      height:100%;
    }
  }
  .lg_conternt{
    padding:0 0.266rem;
    .ivu-form{
      .ivu-form-item:nth-last-child(2){
        margin-top: 1.466rem;
      }
      .ivu-form-item{
        margin-bottom:0.266rem;
        
      }
      .ivu-form-item-content{
        button{
          width:100%;
          background:#009788;
          border-color:#009788;
          color:#fff;
          height:1.06rem;
        }
        .gore{
          padding: 4px 7px;
          font-size: inherit;
          font-weight: 400;
          line-height: 1;
          color: #515a6e;
          float:right;
        }
      }
    }  
  }
}
</style>
<style>
  .login .ivu-form-item-error .ivu-select-arrow{
    color:#727171;
  }
  .login .drop_item>label,.drop_item>div{
    float:left;
  }
  .login .drop_item>label{
    text-align:center !important;
    padding:0.2667rem 0.2667rem 0.2667rem 0.1333rem !important;
  }
  .login .drop_item>div{
    min-width:100px;
  }
  .login .drop_item .ivu-select-selection{
    border:none;
    outline:0;
    border-bottom:1px solid #dcdee2;
    box-shadow:none;
    border-radius:0;
  }
  .login .drop_item .ivu-select-visible .ivu-select-selection{
    border-color: #dcdee2;
    outline: 0;
    box-shadow:none;
  }
  .login .drop_item .ivu-select-item-selected,.drop_item .ivu-select-item-selected:hover{
    color:#009788;
  }
  .login .line_item input{
    border:none;
    border-bottom: 1px solid #dcdee2;
    box-shadow:none;
    border-radius: 0;
    padding: 0.2667rem 0.2667rem 0.2667rem 0.1333rem;
  }
  .login .line_item a{color:#727171;}
  .line_item input:hover,.line_item input:focus,.line_item input:active{
    border-color: #dcdee2;
  }
  .line_item .ivu-input-group-append{
    background: #fff;
    border:none;
    border-bottom: 1px solid #dcdee2;
    border-radius: 0;
  }
  .drop_item .ivu-form-item-error .ivu-select-arrow{
    color:#808695;
  }
  .line_item.ivu-form-item-error .ivu-input{
    border-bottom: 1px solid #dcdee2;
  }
  .line_item .ivu-form-item-error-tip,.drop_item .ivu-form-item-error-tip{
    display:none;
  }
</style>

