// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from './axios'
/**
 * 引入懒加载
 */
import VueLazyload from 'vue-lazyload';

/**
 * 引入vue-scroller
 */
// import VueScroller from 'vue-scroller';目前没使用

/**
 * 引入 vue-quill-editor  富文本编译器
 */
// import  VueQuillEditor from 'vue-quill-editor'
// // require styles 引入样式
// import 'quill/dist/quill.core.css'
// import 'quill/dist/quill.snow.css'
// import 'quill/dist/quill.bubble.css'

/**
 * 引入时间插件 github地址 
 * https://github.com/jamielhf/vue/tree/master/calendar
 */
import Calendar from 'vue2-datepick';

/**
 * 引入swiper
 */
import 'swiper/dist/css/swiper.css'
/* 轮播图 */
import VueAwesomeSwiper from 'vue-awesome-swiper';

/**
 * 引入iview
 */
import iview from 'iview';
import  'iview/dist/styles/iview.css';

/**
 * 引入字体图标库
 */
import './assets/iconfont/iconfont.css'
// 引入 页面设置em方法
import './assets/js/resize';
// 引入微信js
import './assets/js/jweixin-1.2.0';

let nowPath = null;//获取当前路由信息
router.afterEach(function(to,from,next){
  // console.log(to);
  nowPath = to.path;
  // next();
})

/**
 * 加载插件
 */
Vue.use(VueAwesomeSwiper, /* { default global options } */)//加载轮播
Vue.use(VueLazyload,//加载懒加载
  {
    preLoad: 1.3,//预加载高度比例
    error:  require('@/assets/images/goods.png'),//在static里面直接引，在assets里面必须用require
    loading: require('@/assets/images/load.gif'),
    attempt: 1,//默认加载图片数量
    filter:{
      // 通过这个方法可以对我们的图片资源路径进行修改
      webp(listener,options){
        let revArr = ['/my/index','/my/info','/my/mybalanceDetails'];
        if(revArr.indexOf(nowPath) != -1 && listener.src == ''){//当前我的页面修改默认error图片
            listener.src = require('@/assets/images/user.png');
        }
        let indexArr = ['home/index'];
        if(indexArr.indexOf(nowPath) != -1 && listener.src == ''){//当前我的页面修改默认error图片
            listener.src = require('@/assets/images/banner.png');
        }
        // listener.src = require('@/assets/images/errorImg.png');
      }
    },
    adapter: {
      loaded ({ bindType, el, naturalHeight, naturalWidth, $parent, src, loading, error, Init }) {
          // do something here
          // example for call LoadedHandler
          // console.log('loaded');
          // LoadedHandler(el)
      },
      loading (listender, Init) {
          // console.log('loading')
      },
      error (listender, Init) {
          // console.log('error')
      }
    }
    
  }
);
// Vue.use(VueScroller);目前没使用
Vue.use(iview);
// Vue.use(VueQuillEditor);
Vue.use(Calendar);
// Vue.filter('rep', function (value) {   //全局方法 Vue.filter() 注册一个自定义过滤器,必须放在Vue实例化前面
//   return value.replace(/\D/g,'');
// });

Vue.prototype.imgUrl = 'https://img.saselomo.com/';
Vue.prototype.shareImgUrl = 'https://smallapi.saselomo.com/';
Vue.prototype.scanImgUrl = 'https://drptest.saselomo.com/';
// Vue.prototype.HOST  = '/api';
// Vue.prototype.baseURL = process.env.API_ROOT;
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',

})
