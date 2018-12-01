import Vue from 'vue'
import Router from 'vue-router'
import {getTokenCookie} from '../assets/js/assist';
// import HelloWorld from '@/components/HelloWorld'

import login from '@/pages/login/login'//登录页面
import loading from '@/pages/login/loading'//授权页面
import home from '@/pages/home'//首页
import goods from '@/pages/goods'//商品
import order from '@/pages/order'//订单
import team from '@/pages/team'//团队
import my from '@/pages/my'//我的

Vue.use(Router)

let router = new Router({
  mode: 'history',
  base:'htm2',
  routes: [
    {
      path: '',
      redirect: '/login',
    },
    {
      path: '/login',
      component: login,
      meta: {title: '登录',resquire:false}
    },
    {
      path: '/loading',
      component: loading,
      meta: {title: '微信授权',resquire:false}
    },
    {
      path: '/home',
      component: home,
      meta: {title: '首页', resquire:true},
      children: [
        {path: '',redirect: 'index'},
        {name: 'index',path: 'index',component: home.index,meta: {title: '首页',resquire:true,isFoot:true}},
      ]
    },
    {
      path: '/goods',
      component: goods,
      meta: {title: '商品',resquire:true},
      children: [
        {path: '',redirect: 'index'},
        {name: 'index',path: 'index',component: goods.index,meta: {title: '商品',resquire:true,isFoot:true}},
        {name: 'details',path: 'details/:id',component: goods.details,meta: {title: '商品详情',resquire:true,isFoot:false}},
        {name: 'car',path: 'car',component: goods.car,meta: {title: '购物车',resquire:true,isFoot:true}},
        {name: 'waitOrder',path: 'waitOrder/:ids',component: goods.waitOrder,meta: {title: '待提交订单',resquire:true,isFoot:false}}
      ]
    },
    {
      path: '/order',
      component: order,
      meta: {title: '订单',resquire:true},
      children: [
        {path: '',redirect: 'index'},
        {name: 'index',path: 'index',component: order.index,meta: {title: '订单',resquire:true,isFoot:true}},
        // {name: 'orderDetail',path: 'orderDetail/:type/:status',component: order.orderDetail,meta: {title: '订单列表',resquire:true,isFoot:false}},
        {name: 'topOrder',path: 'topOrder/:status',component: order.topOrder,meta: {title: '公司订单列表',resquire:true,isFoot:true}},
        {name: 'topOrderDetails',path: 'topOrderDetails/:OrderNo',component: order.topOrderDetails,meta: {title: '公司订单详情',resquire:true,isFoot:false}},
        {name: 'topScan',path: 'topScan',component: order.topScan,meta: {title: '公司采购扫码',resquire:true,isFoot:false}},
        {name: 'topScanRecord',path: 'topScanRecord',component: order.topScanRecord,meta: {title: '公司采购扫码记录',resquire:true,isFoot:false}},
        {name: 'topMyScan',path: 'topMyScan',component: order.topMyScan,meta: {title: '公司自用扫码',resquire:true,isFoot:false}},
        {name: 'topMyScanRecord',path: 'topMyScanRecord',component: order.topMyScanRecord,meta: {title: '公司自用扫码记录',resquire:true,isFoot:false}},
        {name: 'caigouOrder',path: 'caigouOrder/:status',component: order.caigouOrder,meta: {title: '采购订单列表',resquire:true,isFoot:true}},
        {name: 'caigouOrderDetails',path: 'caigouOrderDetails/:OrderNo',component: order.caigouOrderDetails,meta: {title: '订单详情',resquire:true,isFoot:false}},
        {name: 'caigouScan',path: 'caigouScan',component: order.caigouScan,meta: {title: '采购扫码',resquire:true,isFoot:false}},
        {name: 'caigouScanRecord',path: 'caigouScanRecord',component: order.caigouScanRecord,meta: {title: '采购扫码记录',resquire:true,isFoot:false}},
        {name: 'myScan',path: 'myScan',component: order.myScan,meta: {title: '自用扫码',resquire:true,isFoot:false}},
        {name: 'myScanRecord',path: 'myScanRecord',component: order.myScanRecord,meta: {title: '自用扫码记录',resquire:true,isFoot:false}},
        {name: 'fenxiaoOrder',path: 'fenxiaoOrder/:status',component: order.fenxiaoOrder,meta: {title: '分销订单列表',resquire:true,isFoot:true}},
        {name: 'fenxiaoOrderDetails',path: 'fenxiaoOrderDetails/:OrderNo',component: order.fenxiaoOrderDetails,meta: {title: '订单详情',resquire:true,isFoot:false}},
        {name: 'fenxiaoSend',path: 'fenxiaoSend/:OrderNo',component: order.fenxiaoSend,meta: {title: '分销发货',resquire:true,isFoot:false}},
        {name: 'fenxiaoWaitSend',path: 'fenxiaoWaitSend/:OrderNo',component: order.fenxiaoWaitSend,meta: {title: '分销分批发货',resquire:true,isFoot:false}},
        {name: 'caigouWaitPay',path: 'caigouWaitPay/:OrderNo',component: order.caigouWaitPay,meta: {title: '转采购待付款',resquire:true,isFoot:false}},
        {name: 'fenxiaoScan',path: 'fenxiaoScan',component: order.fenxiaoScan,meta: {title: '分销扫码',resquire:true,isFoot:false}},
        {name: 'mySeliveryRecord',path: 'mySeliveryRecord',component: order.mySeliveryRecord,meta: {title: '我的发货记录',resquire:true,isFoot:false}},
        {name: 'fenxiaoReturnScan',path: 'fenxiaoReturnScan',component: order.fenxiaoReturnScan,meta: {title: '分销退货扫码',resquire:true,isFoot:false}},
        {name: 'myReturnRecord',path: 'myReturnRecord',component: order.myReturnRecord,meta: {title: '我的退货记录',resquire:true,isFoot:false}},
        {name: 'lingshouOrder',path: 'lingshouOrder/:status',component: order.lingshouOrder,meta: {title: '零售订单列表',resquire:true,isFoot:true}},
        {name: 'lingshouOrderDetails',path: 'lingshouOrderDetails/:OrderNo',component: order.lingshouOrderDetails,meta: {title: '订单详情',resquire:true,isFoot:false}},
        {name: 'lingshouSend',path: 'lingshouSend/:OrderNo',component: order.lingshouSend,meta: {title: '零售发货',resquire:true,isFoot:false}},
        {name: 'lingshouWaitSend',path: 'lingshouWaitSend/:OrderNo',component: order.lingshouWaitSend,meta: {title: '零售分批发货',resquire:true,isFoot:false}},
        {name: 'lingshouOrderIndex',path: 'lingshouOrderIndex',component: order.lingshouOrderIndex,meta: {title: '零售下单',resquire:true,isFoot:false}},
        {name: 'lingshouOrderWait',path: 'lingshouOrderWait',component: order.lingshouOrderWait,meta: {title: '零售订单明细',resquire:true,isFoot:false}},
        {name: 'lingshouAddress',path: 'lingshouAddress',component: order.lingshouAddress,meta: {title: '零售地址管理',resquire:true,isFoot:false}},
        {name: 'newLingshouAddress',path: 'newLingshouAddress/:id',component: order.newLingshouAddress,meta: {title: '新增零售地址',resquire:true,isFoot:false}},
        {name: 'lingshouScan',path: 'lingshouScan',component: order.lingshouScan,meta: {title: '零售扫码',resquire:true,isFoot:false}},
        {name: 'lingshouReturnScan',path: 'lingshouReturnScan',component: order.lingshouReturnScan,meta: {title: '零售退货扫码',resquire:true,isFoot:false}},
      ]
    },
    {
      path: '/team',
      component: team,
      meta: {title: '团队',resquire:true},
      children: [
        {path: '',redirect: 'index'},
        {name: 'index',path: 'index',component: team.index,meta: {title: '团队',resquire:true,isFoot:true}},
        {name: 'teamDetails',path: 'teamDetails',component: team.teamDetails,meta: {title: '我的经销商',resquire:true,isFoot:false}},
        {name: 'balanceDetails',path: 'balanceDetails',component: team.balanceDetails,meta: {title: '经销商余额',resquire:true,isFoot:false}},
        {name: 'inviteDealer',path: 'inviteDealer',component: team.inviteDealer,meta: {title: '邀请经销商',resquire:true,isFoot:false}},
        {name: 'inviteReview',path: 'inviteReview',component: team.inviteReview,meta: {title: '邀请审核',resquire:true,isFoot:false}},
        {name: 'returnReview',path: 'returnReview/:id',component: team.returnReview,meta: {title: '回款审核',resquire:true,isFoot:false}},
        {name: 'reviewAudite',path: 'reviewAudite',component: team.reviewAudite,meta: {title: '审核详情',resquire:true,isFoot:false}},
        {name: 'bill',path: 'bill/:id',component: team.bill,meta: {title: '余额流水',resquire:true,isFoot:false}}
      ]
    },
    {
      path: '/my',
      // name:'my',
      component: my,
      meta: {title: '我的',resquire:true},
      children: [
        {path: '',redirect: 'index'},
        {name: 'index',path: 'index',component: my.index,meta: {title: '我的',resquire:true,isFoot:true,isFoot:true}},
        {name: 'info',path: 'info',component: my.info,meta: {title: '个人资料',resquire:true,isFoot:true,isFoot:true}},
        {name: 'superiorMessage',path: 'superiorMessage',component: my.superiorMessage,meta: {title: '上级资料',resquire:true,isFoot:true,isFoot:false}},
        {name: 'referenceMessage',path: 'referenceMessage',component: my.referenceMessage,meta: {title: '推荐人资料',resquire:true,isFoot:true,isFoot:false}},
        {name: 'mybalanceDetails',path: 'mybalanceDetails',component: my.mybalanceDetails,meta: {title: '个人余额明细',resquire:true,isFoot:true,isFoot:false}},
        {name: 'productManagement',path: 'productManagement',component: my.productManagement,meta: {title: '产品管理',resquire:true,isFoot:true}},
        {name: 'water',path: 'water/:id',component: my.water,meta: {title: '产品流水',resquire:true,isFoot:true}},
        {name: 'adjustment',path: 'adjustment/:id',component: my.adjustment,meta: {title: '库存管理',resquire:true,isFoot:true}},
        {name: 'recharge',path: 'recharge',component: my.recharge,meta: {title: '余额充值',resquire:true,isFoot:true}},
        {name: 'surfaceSingle',path: 'surfaceSingle',component: my.surfaceSingle,meta: {title: '电子面单管理',resquire:true,isFoot:false}},
        {name: 'newSurfaceSingle',path: 'newSurfaceSingle/:id',component: my.newSurfaceSingle,meta: {title: '电子面单操作',resquire:true,isFoot:false}},
        {name: 'printList',path: 'printList',component: my.printList,meta: {title: '打印管理',resquire:true,isFoot:false}},
        {name: 'newPrintList',path: 'newPrintList/:id',component: my.newPrintList,meta: {title: '打印操作',resquire:true,isFoot:false}},
        {name: 'newsList',path: 'newsList',component: my.newsList,meta: {title: '公告列表',resquire:true,isFoot:false}},
        {name: 'newsDetails',path: 'newsDetails/:id',component: my.newsDetails,meta: {title: '公告详情',resquire:true,isFoot:false}},
        {name: 'help',path: 'help',component: my.help,meta: {title: '使用手册',resquire:true,isFoot:false}},
        {name: 'share',path: 'share',component: my.share,meta: {title: '分享小程序',resquire:true,isFoot:false}},
        {name: 'activity',path: 'activity',component: my.activity,meta: {title: '活动方案列表',resquire:true,isFoot:false}},
        {name: 'newActivity',path: 'newActivity/:id',component: my.newActivity,meta: {title: '新活动方案',resquire:true,isFoot:false}},
        {name: 'activityDetail',path: 'activityDetail/:id',component: my.activityDetail,meta: {title: '活动方案详情',resquire:true,isFoot:false}},
        {name: 'forgetPhone',path: 'forgetPhone',component: my.forgetPhone,meta: {title: '更换手机号',resquire:true,isFoot:false}},
        {name: 'forgetPhoneSave',path: 'forgetPhoneSave',component: my.forgetPhoneSave,meta: {title: '保存新手机号',resquire:true,isFoot:false}},
        {name: 'changePassword',path: 'changePassword',component: my.changePassword,meta: {title: '修改密码',resquire:true,isFoot:false}},
        {name: 'forgetPassword',path: 'forgetPassword',component: my.forgetPassword,meta: {title: '忘记密码',resquire:false,isFoot:false}},
        {name: 'addressList',path: 'addressList',component: my.addressList,meta: {title: '地址管理',resquire:true,isFoot:false}},
        {name: 'newAddress',path: 'newAddress/:id',component: my.newAddress,meta: {title: '新增地址',resquire:true,isFoot:false}},
      ]
    },
    {
      path: '*',
      name: '404',
      component: Error,
      hidden: true
    }
  ]
})


router.beforeEach(function(to,from,next){
  // 可以注册多个before,多个before之间是异步的，但是导航必须等到这些钩子执行完成，才开始
  // to 目标路由对象
  // from 当前路由对象
  // next 有如下几种用法
  // next() 执行下一个钩子函数，没有钩子，则to到目标路由
  // next(false) 不to了，直接留在from这个路由
  // next('/') 不管这个to了，另找了一个to
  // next方法必须调用，不调用就是死循环，小心你电脑内存爆了
  // console.log(router.options.routes);
  if(to.meta.resquire){//校验是否需要进行登录检验
    if(getTokenCookie()){//校验是否登录
      let _route = {};
        router.options.routes.forEach(r => {
          // console.log(r.path);
          if(r.path == to.path) _route = r;
        })

        // console.log(to);
        if(_route === {} || _route.children === undefined || _route.children.length == 0){
          window.document.title = to.meta.title;
          next();
        }else{
          let _firstR = _route.children[0];
          window.document.title = _firstR.meta.title;
          next(to.path + '/' + _firstR.path);
        }
    }else{
      next('/')
    }
  }else{
    next();
  }
  // let _route = {};
  // router.options.routes.forEach(r => {
  //   if(r.path == to.path) _route = r;
  // })

  // console.log(to);
  // if(_route === {} || _route.children === undefined || _route.children.length == 0){
  //   window.document.title = to.meta.title;
  //   next();
  // }else{
  //   let _firstR = _route.children[0];
  //   window.document.title = _firstR.meta.title;
  //   next(to.path + '/' + _firstR.path);
  // }
  // next();
})

export default router;