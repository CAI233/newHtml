import team from './team.vue';
import index from './index.vue';
import teamDetails from './teamDetails.vue';//我的经销商
import balanceDetails from './balanceDetails.vue';//经销商余额查询
import inviteDealer from './inviteDealer.vue';//邀请经销商
import inviteReview from './inviteReview.vue';//邀请审核
import returnReview from './returnReview.vue';//回款审核
import reviewAudite from './reviewAudite.vue';//回款审核
import bill from './bill.vue';//回款审核
team.index = index;
team.teamDetails = teamDetails;
team.balanceDetails = balanceDetails;
team.inviteDealer = inviteDealer;
team.inviteReview = inviteReview;
team.returnReview = returnReview;
team.reviewAudite = reviewAudite;
team.bill = bill;
export default team;