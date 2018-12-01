import Vue from 'vue';
import axios from 'axios';
import { getTokenCookie,getLoginUser, removeTokenCookie } from '../assets/js/assist.js';

// Add a request interceptor
axios.defaults.baseURL = ''
// axios.defaults.withCredentials = true; //让ajax携带cookie
if (process.env.NODE_ENV === 'development') {
}

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.interceptors.request.use(function (config) {
  let token = getTokenCookie();
  if (token) {
    if (config.isHeadr) {
      config.headers['access_token'] = getTokenCookie() || '';
      config.headers['mobile_key'] = getLoginUser() ? getLoginUser().UserPhone : '';
      config.headers['sellerNo_key'] = getLoginUser() ? getLoginUser().SellerNo : '';
      // config.data.token = token
    }
    if(config.outHeadr){
      config.headers['Access-Control-Allow-Origin'] = '*';
      config.headers['Access-Control-Allow-Methods'] = '*';
      config.headers['Access-Control-Allow-Headers'] = 'x-requested-with,content-type';
      // header('Access-Control-Allow-Origin:*');  
      // // 响应类型  
      // header('Access-Control-Allow-Methods:*');  
      // // 响应头设置  
      // header('Access-Control-Allow-Headers:x-requested-with,content-type')

    }
  }
  return config
}, function (error) {
  return Promise.reject(error)
});

// Add a response interceptor
axios.interceptors.response.use(function (response) {
  if (response.data ) {
    let res = typeof(response.data) != 'object' ? JSON.parse(response.data) : response.data;
    // const res = typeof(response.data) != 'object' ? eval(response.data) : response.data;
    // eval("("+data+")")
    if (res.code === 200) {//正确返回的code==200
      return res
    } 
    else {
      if(res.code == 201){//不存在防伪码，也要返回到前台展示
        return res
      }else if(res.code == 202){//支付余额不足，也要返回到前台展示
        return res
      }else if (res.code == 203){//支付密码不对，也要返回到前台展示
        return res
      }else if (res.code == 204){//操作异常，也要返回到前台展示
        return res
      }else if (res.code == 208 || res.code == 209) { // token失效
        removeTokenCookie()
        window.location.href = '/'
      }else if(res.code == 210){//校验码 操作过于频繁
        return res
      } else if(res.code == 299) { // 失败
        removeTokenCookie()
        window.location.href = '/'
      } else{
        // notifyError(response.data.msg)
        return Promise.reject(res.msg)
      }
    }
  } else {
    Vue.$notify.error({
      title: '错误提示',
      message: 'response error'
    })
    return Promise.reject(new Error('response error'))
  }
}, function (error) {
  return Promise.reject(error)
});

export default axios
