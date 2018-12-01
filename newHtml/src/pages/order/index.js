import order from './order.vue';
import index from './index.vue';
import orderDetail from './orderDetail/orderDetail.vue';
import topOrder from './topOrder/topOrder.vue';//公司订单-----------------
import topOrderDetails from './topOrder/topOrderDetails.vue';//公司订单详情
import topScan from './topOrder/topScan.vue';//公司扫码
import topScanRecord from './topOrder/topScanRecord.vue';//公司扫码记录
import topMyScan from './topOrder/topMyScan.vue';//公司自用扫码
import topMyScanRecord from './topOrder/topMyScanRecord.vue';//公司扫码记录
import caigouOrder from './caigouOrder/caigouOrder.vue';//采购订单-----------------
import caigouOrderDetails from './caigouOrder/caigouOrderDetails.vue';//采购订单详情
import caigouScan from './caigouOrder/caigouScan.vue';//采购扫码
import caigouScanRecord from './caigouOrder/caigouScanRecord.vue';//采购扫码记录
import myScan from './caigouOrder/myScan.vue';//自用扫码
import myScanRecord from './caigouOrder/myScanRecord.vue';//自用扫码记录
import fenxiaoOrder from './fenxiaoOrder/fenxiaoOrder.vue';//分销订单-------------------------------
import fenxiaoOrderDetails from './fenxiaoOrder/fenxiaoOrderDetails.vue';//分销订单详情
import fenxiaoSend from './fenxiaoOrder/fenxiaoSend.vue';//发货
import fenxiaoWaitSend from './fenxiaoOrder/fenxiaoWaitSend.vue';//分批发货 
import fenxiaoScan from './fenxiaoOrder/fenxiaoScan.vue';//分销扫码 
import mySeliveryRecord from './fenxiaoOrder/mySeliveryRecord.vue';//我的发货记录
import fenxiaoReturnScan from './fenxiaoOrder/fenxiaoReturnScan.vue';//分销退货扫码
import myReturnRecord from './fenxiaoOrder/myReturnRecord.vue';//我的退货记录
import lingshouOrder from './lingshouOrder/lingshouOrder.vue';//零售订单-------------------------------
import lingshouOrderDetails from './lingshouOrder/lingshouOrderDetails.vue';//零售订单详情
import lingshouSend from './lingshouOrder/lingshouSend.vue';//发货
import lingshouWaitSend from './lingshouOrder/lingshouWaitSend.vue';//分批发货
import lingshouOrderIndex from './lingshouOrder/lingshouOrderIndex.vue';//零售订单list页面
import lingshouOrderWait from './lingshouOrder/lingshouOrderWait.vue';//零售订单待支付页面
import lingshouAddress from './lingshouOrder/lingshouAddress.vue';//零售订单地址管理页面
import newLingshouAddress from './lingshouOrder/newLingshouAddress.vue';//新增或修改零售订单地址页面
import lingshouScan from './lingshouOrder/lingshouScan.vue';//零售扫码
import lingshouReturnScan from './lingshouOrder/lingshouReturnScan.vue';//零售退货扫码

import caigouWaitPay from './caigouWaitPay.vue';//转采购
order.index = index;
order.orderDetail = orderDetail;

order.topOrder = topOrder;
order.topOrderDetails = topOrderDetails;
order.topScan = topScan;
order.topScanRecord = topScanRecord;
order.topMyScan = topMyScan;
order.topMyScanRecord = topMyScanRecord;

order.caigouOrder = caigouOrder;
order.caigouOrderDetails = caigouOrderDetails;
order.caigouScan = caigouScan;
order.caigouScanRecord = caigouScanRecord;
order.myScan = myScan;
order.myScanRecord = myScanRecord;

order.fenxiaoOrder = fenxiaoOrder;
order.fenxiaoOrderDetails = fenxiaoOrderDetails;
order.fenxiaoSend = fenxiaoSend;
order.fenxiaoWaitSend = fenxiaoWaitSend;
order.caigouWaitPay = caigouWaitPay;
order.fenxiaoScan = fenxiaoScan;
order.mySeliveryRecord = mySeliveryRecord;
order.fenxiaoReturnScan = fenxiaoReturnScan;
order.myReturnRecord = myReturnRecord;

order.lingshouOrder = lingshouOrder;
order.lingshouOrderDetails = lingshouOrderDetails;
order.lingshouSend = lingshouSend;
order.lingshouWaitSend = lingshouWaitSend;
order.lingshouOrderIndex = lingshouOrderIndex;
order.lingshouOrderWait = lingshouOrderWait;
order.lingshouAddress = lingshouAddress;
order.newLingshouAddress = newLingshouAddress;
order.lingshouScan = lingshouScan;
order.lingshouReturnScan = lingshouReturnScan;
export default order;