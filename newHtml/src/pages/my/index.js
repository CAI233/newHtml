import my from './my.vue';
import index from './index.vue';
import info from './info.vue';
import mybalanceDetails from './mybalanceDetails.vue';//余额明细
import productManagement from './productManagement/productManagement.vue';//产品管理页面
import water from './productManagement/water.vue';//产品流水页面
import adjustment from './productManagement/adjustment.vue';//库存管理页面
import recharge from './recharge.vue';
import surfaceSingle from './surfaceSingle/surfaceSingle.vue';//电子面单页面
import newSurfaceSingle from './surfaceSingle/newSurfaceSingle.vue';//添加新的电子面单页面
import printList from './printList/printList.vue';//纸质打印页面
import newPrintList from './printList/newPrintList.vue';//添加新的纸质打印页面
import newsList from './newsList/newsList.vue';//公告列表
import newsDetails from './newsList/newsDetails.vue';//公告详情
import help from './help.vue';//使用帮助
import share from './share.vue';//分享小程序
import activity from './activity/activity.vue';//活动列表
import newActivity from './activity/newActivity.vue';//新增活动
import activityDetail from './activity/activityDetail.vue';//活动详情
import forgetPhone from './forgetPhone.vue';//更换手机号
import forgetPhoneSave from './forgetPhoneSave.vue';//保存新手机号
import changePassword from './changePassword.vue';//修改密码
import forgetPassword from './forgetPassword.vue';//忘记密码

import addressList from './addressManagement/addressList.vue';//地址管理
import newAddress from './addressManagement/newAddress.vue';//新增或修改地址
import superiorMessage from './superiorMessage.vue';//上级资料
import referenceMessage from './referenceMessage.vue';//推荐人资料

my.index = index;
my.info = info;
my.mybalanceDetails = mybalanceDetails;
my.superiorMessage = superiorMessage;
my.referenceMessage = referenceMessage;
my.productManagement = productManagement;
my.water = water;
my.adjustment = adjustment;
my.recharge = recharge;
my.surfaceSingle = surfaceSingle;
my.newSurfaceSingle = newSurfaceSingle;
my.printList = printList;
my.newPrintList = newPrintList;
my.newsList = newsList;
my.newsDetails = newsDetails;
my.help = help;
my.share = share;
my.activity = activity;
my.newActivity = newActivity;
my.activityDetail = activityDetail;
my.forgetPhone = forgetPhone;
my.forgetPhoneSave = forgetPhoneSave;
my.changePassword = changePassword;
my.forgetPassword = forgetPassword;

my.addressList = addressList;
my.newAddress = newAddress;

export default my;