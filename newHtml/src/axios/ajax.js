import axios from 'axios'
import qs from 'qs'
import {getLoginUser,getTokenCookie} from '../assets/js/assist.js'
const rootUrl = process.env.API_ROOT;
export const get = (url, params) => { return axios.get(rootUrl+url, params).then(res => res).catch(res => res) };
export const post = (url, params) => { return axios.post(rootUrl+url, qs.stringify(params)).then(res => res).catch(res => res) };
//  isHeadr  声明该get方法需要调用cookie
// export const wxget = (url, params) => { return axios.get(rootUrl+url,{params:params,headers:headersArry}).then(res => res).catch(res => res) }
export const wxget = (url, params) => { return axios.get(rootUrl+url,{params:params,isHeadr:true}).then(res => res).catch(res => res) };
export const wxpost = (url, params) => { return axios.post(rootUrl+url,qs.stringify(params),{isHeadr:true}).then(res => res).catch(res => res) };

// 调用外部链接
export const outget = (url, params) => { return axios.get(url, {params:params,outHeadr:true}).then(res => res).catch(res => res) };
