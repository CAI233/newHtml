<template>
    <div id="container" class="caigouOrder">
        <div class="content">
            <div class="title">
                <div class="title_a">
                    <Dropdown trigger="click" @on-click="choosePolicy" >
                        <a href="javascript:void(0)">
                            <span>{{selRow.ActivityText}}</span>    
                            <Icon type="ios-arrow-down"></Icon>
                        </a>
                        <DropdownMenu slot="list">
                            <DropdownItem :name="item.F_Id" v-if="policyData.length>0" v-for="(item,index) in policyData" :key="index" :selected="item.F_Id == selRow.ActivityId ? true : false">{{item.Title}}</DropdownItem>
                            <DropdownItem v-else>暂无政策</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>
                <div class="title_t">
                    <i class="clear iconfont icon-close-btn" v-show="date"  @click="clear"></i>
                    <input v-model="date" placeholder="请选择时间"  readonly />
                    <router-link to='' @click.native="beginCheck">
                        <template >开始时间</template>
                    </router-link>
                    <router-link to='' @click.native="endCheck">
                        <template >结束时间</template>
                    </router-link>
                </div>
            </div>
            <div class="cont">
                <ul>
                    <li class="Tablis" :class="selRow.OrderStatus == item.status ? 'active' : ''" v-for="(item,index) in tabText" :key="index" @click="Status(item.status)">
                        <router-link to='' >
                            <span>{{item.text}}</span>
                            <em v-if="item.count>0 && index != 0 ">
                                {{item.count}}
                            </em>
                        </router-link>
                        <Divider :style="selRow.OrderStatus == item.status ? 'background:#009788;height:2px;' :'background: #B5B5B6;'" />
                    </li>
                </ul>
                <div class="cont_c">
                    <ul class="cont_c_cont">
                        <li class="cont_list" v-for="(item,index) in orderData" :key="index">
                            <p class="cont_list_t">
                                <span>{{item.OrderNo}}</span>
                                <span>{{['待确认','待付款','待发货','待收货','已收货','已关闭'][item.OrderStatus]}}</span>
                                <span v-if="item.IsTransfer">转代发</span>
                                <span v-if="item.IsSplitOrder">拆单发货</span>
                            </p>
                            <div class="cont_list_u" v-if="item.OrderDetailList.length>0" v-for="(it,num) in item.OrderDetailList" :key="num" @click="goDetails(item.OrderNo)">
                                <div class="list_u_l">
                                    <img v-lazy="imgUrl+it.ImageUrl" :key="it.ImageUrl" alt="">
                                </div>
                                <div class="list_u_c">
                                    <p>{{it.Title}}</p>
                                    <p>规格:{{it.SepcName}}&nbsp;&nbsp;&nbsp;&nbsp;箱规:{{it.UnitNumber}}/{{it.Unit}}</p>
                                    <p><span>¥{{it.Price}}*{{it.Number}}</span>&nbsp;&nbsp;<i>{{it.SendNo && (item.OrderStatus==33||item.OrderStatus==3)?'(已发货)':''}}</i>&nbsp;&nbsp;<em>小计:{{it.Amount}}</em></p>
                                </div>
                            </div>
                            <Divider />
                            <div class="cont_list_d">
                                <!-- <div class="list_d_l">
                                    <img v-lazy="item.BuyUserImg" :key="item.BuyUserImg" alt="">
                                </div> -->
                                <div class="list_d_c">
                                    <p><span>下单时间{{item.OrderDate}}</span></p>
                                    <p><span>下单人:{{item.BuyUserName}}</span><span>电话:{{item.BuyUserPhone}}</span></p>
                                    <p><span>收货人:{{item.Sendee}}</span><span>电话:{{item.Contact}}</span></p>
                                    <p><span>收货地址:{{item.Address}}</span></p>
                                </div>
                            </div>
                            <div class="cont_list_f">
                                <p>共{{item.sumproduct}}件商品&nbsp;&nbsp;邮费:￥<span>{{item.FarePrice}}</span>&nbsp;<span>合计:￥{{item.PayPrice+item.FarePrice}}</span></p>
                                <p>
                                    <Button class="nopay" v-if="item.OrderStatus==1 && item.ActivityType!=3" @click.native="Pay(item.OrderNo,item.PayPrice)">去付款</Button>
                                    <Button v-if="item.OrderStatus==0 ||item.OrderStatus==1" @click.native="Cancel(item.OrderNo,index)">取消订单</Button>
                                    <Button v-if="item.ActivityType==3 && item.OrderStatus==1">预支付</Button>
                                    <Button v-if="item.ActivityType==3 && item.OrderStatus==22">付尾款</Button>
                                    <Button v-if="item.OrderStatus==3 && item.IsFromERP==true" @click.native="confirmErp(item.OrderNo,index)">确认收货</Button>
                                    <Button class="nopay" v-if="item.OrderStatus==3 && item.IsSplitOrder==false && item.IsTransfer==false && item.OriginalOrderNo==''" @click.native="confirm(item.OrderNo,index,true)">确认收货</Button>
                                    <Button class="nopay" v-if="item.OrderStatus==3 && item.IsSplitOrder==false && item.IsTransfer==true && item.OrderNo==item.OriginalOrderNo" @click.native="confirm(item.OrderNo,index,true)">确认收货</Button>
                                    <Button v-if="(item.OrderStatus==33 || item.OrderStatus==3) && item.IsSplitOrder==true && item.SendOrderStatus==1 && item.IsTransfer==false && item.OriginalOrderNo==''" @click.native="confirm(item.SendNo,index,false)">确认收货</Button>
                                    <Button v-if="(item.OrderStatus==33 || item.OrderStatus==3) && item.IsSplitOrder==true && item.SendOrderStatus==1 && item.IsTransfer==true && item.OrderNo==item.OriginalOrderNo" @click.native="confirm(item.SendNo,index,false)">确认收货</Button>
                                    <Button v-if="(item.OrderStatus==3 || item.OrderStatus==33 || item.OrderStatus==4) && !item.IsSplitOrder && paramsoff" @click.native="express(item.OrderNo,true)">查看物流</Button>
                                    <Button v-if="(item.OrderStatus==3 || item.OrderStatus==33 || item.OrderStatus==4) && item.IsSplitOrder && paramsoff" @click.native="express(item.SendNo,false)">查看物流</Button>
                                    <Button class="notime" v-if="item.OrderStatus==2 && item.isReminder" @click.native="Reminder(item.OrderNo,index)">催单</Button>
                                </p>
                            </div>
                            <Divider v-if="index != orderData.length-1" class="bg_line"/>
                        </li>
                        <div class="list-foot" :class="orderData.length == 0 ? 'no' : ''">
                            <div v-if="orderData.length>0">
                                <p v-if="selRow.CurPage < Math.ceil(selRow.allTotal/selRow.PageSize)">下拉加载更多</p>
                                <p v-else>没有更多了</p>
                            </div>
                            <div v-else class="notData">
                                <p><img src="../../../assets/images/noOrder.png" alt="" style="width:3rem;vertical-center:bottom;"></p>
                                <p>当前没有订单</p>
                            </div>
                        </div>
                    </ul>
                </div>
            </div>
        </div>
        <Modal v-model="isLogistical" @on-cancel="logisticalCancel" class="logistical-list" :closable="false">
            <p slot="header" style="text-align:right">
                <span style="float:left;font-weight:normal">物流信息</span>
                <i class="iconfont icon-close-btn" @click="logisticalCancel"></i>
            </p>
            <div class="content-list">
                <p style="font-size:0.3733rem;display:block;">
                    <span>快递单号:<em>{{logisticalStampNumber}}</em></span>
                    <span style="float:right;color:##3b77fd;" v-if="logisticalStatus == 0">暂无快递信息</span>
                    <span style="float:right;color:##3b77fd;" v-else-if="logisticalStatus == 1">已揽收</span>
                    <span style="float:right;color:##3b77fd;" v-else-if="logisticalStatus == 2">正在途中</span>
                    <span style="float:right;color:#73f533;" v-else-if="logisticalStatus == 3">已签收</span>
                    <span style="float:right;color:#e6311d;" v-else-if="logisticalStatus == 4">出现错误</span>
                    <span style="float:right;color:#3b77fd;" v-else >暂无物流信息</span>
                </p>
                <p>
                    <Steps direction="vertical">
                        <Step :title="item.AcceptTime" :content="item.AcceptStation" v-for="(item,index) in logisticalList" :key="index"></Step>
                    </Steps>
                </p>
            </div>
            <div slot="footer" style="text-align:center;">
                <Button type="primary" @click.native="logisticalCancel" style="background:#009788;border-color:#009788;">关闭</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
import {wxget,wxpost,outget} from '@/axios/ajax';
import {isLoading} from '@/assets/js/load.js'
export default {
    name: 'caigouOrder',
    data() {
        return{
            selRow:{
                PageSize:6,//每页个数
                CurPage:1,//默认第一页
                OrderStatus:'',//订单状态
                StartDate:'',//开始时间
                EndDate:'',//结束时间
                ActivityId:null,//政策id
                ActivityText:'-选择政策筛选-',//政策名称
                allTotal:0,
            },
            paramsoff:true,
            orderData:[],
            policyData:[],
            date:'',
            tabText:[],
            reminder:0,//催单时间
            courierData:[],//快递列表
            courierList:[],//订单所含快递list
            isShowCourier:false,//修改快递弹窗

            isLogistical:false,//查看物流弹窗
            logisticalList:[],//物流信息列表
            logisticalStatus:0,//物流状态
            logisticalStampNumber:'',//物流单号
            logisticalDeliverName:''//物流名称
        }
    },
    components: {

    },
    methods:{
        handleScroll(){//页面滚动监听
            let that = this;
            let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
            let bodyHeight = document.documentElement.clientHeight;
            let scrollHeight = document.documentElement.scrollHeight;
            if(scrollTop + 5 > scrollHeight - bodyHeight){
                that.load(false);
            }
        },
        load(bool){//加载数据
            let that = this;
            console.log('加载数据···');
            if(bool){
                that.orderData = [];
                that.selRow.PageSize = 6;
                that.selRow.CurPage = 1;
                isLoading(that,'订单加载中···');
            }else{
                if(that.selRow.CurPage == Math.ceil(that.selRow.allTotal/that.selRow.PageSize)){
                    return false;
                }else{
                    that.selRow.CurPage++;
                } 
            }
            if(that.selRow.OrderStatus == 2){
                that.paramsoff = false;
            }else{
                that.paramsoff = true;
            }
            wxpost('User/GetPurchaseOrder',that.selRow).then(res =>{
                that.$Spin.hide();
                if(res.code == 200){
                    console.log(res);
                    let nowDate = Date.parse(new Date());
                    res.data.map((item)=>{
                        if(nowDate - Date.parse(new Date(item.PayDate)) >= that.reminder*24*60*60*1000 ){
                            item['isReminder'] = true;
                        }else{
                            item['isReminder'] = false;
                        }  
                    })
                    that.orderData.push(...res.data);
                    that.selRow.allTotal = res.total;
                }else{
                    that.$Message.error(res.message);
                }
            })
            that.getCount();
        },
        reload(){//页面更新数据
            let that = this;
            wxpost('User/GetPurchaseOrder',that.selRow).then(res =>{
                that.$Spin.hide();
                if(res.code == 200){
                    
                    let nowData = that.orderData.concat(res.data);
                    let obj = {};
                    let newData =  nowData.reduce((cur,next) => {
                        console.log(obj);
                        obj[next.OrderNo] ? "" : obj[next.OrderNo] = true && cur.push(next);
                        return cur;
                    },[]); //设置cur默认类型为数组，并且初始值为空的数组
                    that.orderData = newData;
                    let nowDate = Date.parse(new Date());
                    that.orderData.map((item)=>{
                        if(nowDate - Date.parse(new Date(item.PayDate)) >= that.reminder*24*60*60*1000 ){
                            item['isReminder'] = true;
                        }else{
                            item['isReminder'] = false;
                        }  
                    })
                    that.selRow.allTotal = res.total;
                }else{
                    that.$Message.error(res.message);
                }
            })
            that.getCount();
        },
        getCount(){//获取各种订单数量
            let that = this;
            let statusCount = {
                activityId:that.selRow.ActivityId,
                orderType:0,
                startDate:that.selRow.StartDate,
                endDate:that.selRow.EndDate
            }
            wxpost('User/GetOrdStaCount',statusCount).then(res =>{
                if(res.code == 200){
                    let countAll = res.data;
                    that.tabText.map((item,key,arr) =>{
                        if(item.status == 1){
                           item['count'] = countAll.NoPayCount > 0 ?  countAll.NoPayCount : 0;
                           let obj = item;
                           that.$set(that.tabText,key,obj);
                        }
                        if(item.status == 2){
                           item['count'] = countAll.PayCount > 0 ?  countAll.PayCount : 0;
                           let obj = item;
                           that.$set(that.tabText,key,obj);
                        }
                        if(item.status == 3){
                           item['count'] = countAll.DeliverCount > 0 ?  countAll.DeliverCount : 0;
                           let obj = item;
                           that.$set(that.tabText,key,obj);
                        }
                        if(item.status == 4){
                           item['count'] = countAll.TakeDeliverCount > 0 ?  countAll.TakeDeliverCount : 0;
                           let obj = item;
                           that.$set(that.tabText,key,obj);
                        }
                        if(item.status == 5){
                           item['count'] = 0;
                           let obj = item;
                           that.$set(that.tabText,key,obj);
                        }
                    })
                }else{
                    that.$Message.error(res.message);
                }
            })
        },
        getReminder(){//获取催单时间
            let that = this;
            wxpost('User/GetOrderReminder').then(res =>{
                if(res.code == 200){
                    that.reminder = res.data ? parseInt(res.data) : 0;
                }else{
                    that.$Message.error(res.message);
                }
            })
        },
        getPolicy(){//获取政策
            let that = this;
            wxget('User/GetActivityListByTarget').then(res =>{
                if(res.code == 200){
                    console.log(res.data);
                    that.policyData = res.data;
                    that.policyData.unshift({
                        F_Id:null,
                        Title:'-选择政策筛选-'
                    })
                }else{
                    that.$Message.error(res.message);
                }
            })
        },
        choosePolicy(name){//政策切换
            let that = this;
            that.selRow.ActivityId = name;
            that.policyData.map((item,key,arr) => {
                if(item.F_Id == name){
                    that.selRow.ActivityText = item.Title;
                }
            })
            that.load(true);
        },
        Status(status){//切换订单状态
            let that = this;
            that.selRow.OrderStatus = status;
            that.load(true);
        },
        beginCheck(){//选择开始时间
            let that = this;
            that.$picker.show({
                type:'datePicker',
                onOk: (date) =>{
                    that.selRow.StartDate = date;
                    if(that.selRow.EndDate){
                        if(Date.parse(that.selRow.StartDate) > Date.parse(that.selRow.EndDate)){
                            that.$Message.warning('开始时间不能大于结束时间');
                            return false;
                        }
                        that.date = that.selRow.StartDate+'至'+that.selRow.EndDate;
                        that.load(true);
                    }else{
                        that.date = that.selRow.StartDate;
                        that.load(true);
                    }
                    
                }
            });
        },
        endCheck(){//选择结束时间
            let that = this;
            that.$picker.show({
                type:'datePicker',
                startTime:that.selRow.StartDate,  //开始时间
                onOk:(e)=>{
                    that.selRow.EndDate = e;
                    if(that.selRow.StartDate){
                        that.date = that.selRow.StartDate+'至'+that.selRow.EndDate;
                        that.load(true);
                    }else{
                        that.date = that.selRow.EndDate;
                        that.load(true);
                    }
                },

            })
        },
        clear(){//清除操作
            let that = this;
            that.selRow.StartDate = '';
            that.selRow.EndDate = '';
            that.date = '';
            that.load(true);
        },
        goDetails(no){//订单详情
            let that = this;
            that.$router.push({name:'caigouOrderDetails',params:{OrderNo:no}});
        },
        Pay(no,price){//去付款
            let that = this;
            let payWord = '';
            that.$Modal.confirm({
                    scrollable:false,
                    render: (h) => {
                        return h('div',{class:'model-cont'},[
                            h('div',{class:'model-title','style':{textAlign:'right',marginBottom:'0.2667rem'}},[
                                h('span',
                                    {style:{color:'#666666',fontSize:'0.3733rem',background:'#F8F8F8',float:'left'}}, '请输入密码，并且确认支付。'),
                                h('i',{class:'iconfont icon-close-btn',on: {click: () => {
                                    that.$Modal.remove();
                                    payWord = '';
                                    }}})
                            ]),
                            h('div',{class:'model-content'},[
                                h('Input', {'style':{outline:0,boxShadow:'none',borderColor:'#dcdee2'},
                                    props: {autofocus: true,placeholder: '请输入密码',type:'password'},
                                    on: {input: (val) => {
                                        payWord = val;
                                        }}
                                })
                            ]),
                            h('div',{class:'model-foot','style':{textAlign:'right',marginTop:'0.2667rem'}},[
                                h('Button', {'style':{boxShadow:'none',borderColor:'#dcdee2',marginRight:'0.1333rem'},on: {click:()=>{
                                    that.$Modal.remove();
                                    payWord = '';
                                    }}},'取消'),
                                h('Button', {'style':{boxShadow:'none',background: '#009788',borderColor:'#009788'},props: {type: 'primary'},on: {click:()=>{
                                    if(!payWord || payWord == ''){
                                        that.$Message.warning('请输入密码！');
                                        return false;
                                    }
                                    isLoading(that,'支付中···');
                                    wxpost('API/PostEn',{Content:payWord}).then(res =>{//支付密码加密
                                        if(res.code == 200){
                                            let payParam = {
                                                OrderNo:no,
                                                PayPrice:price,
                                                PayPassWord:res.details
                                            }
                                            wxpost('User/SetPurchaseOrderPay',payParam).then(re =>{//支付接口
                                                that.$Spin.hide();
                                                if(re.code == 200){
                                                    that.$Modal.remove();
                                                    that.$Message.success(re.details);
                                                    that.load(true);
                                                }else if(re.code == 202){
                                                    payWord = '';
                                                    that.$Modal.remove();
                                                    setTimeout(()=>{
                                                        that.$Modal.confirm({
                                                            scrollable:false,
                                                            render: (h) => {
                                                                return h('div',{class:'model-cont'},[
                                                                    h('div',{class:'model-title','style':{textAlign:'right',marginBottom:'0.2667rem'}},[
                                                                        h('span',
                                                                            {style:{color:'#DF8D15',fontSize:'0.3733rem',float:'left'}}, '警告！'),
                                                                        h('i',{class:'iconfont icon-close-btn',on: {click: () => {that.$Modal.remove();}}
                                                                        })
                                                                    ]),
                                                                    h('div',{class:'model-content'},[
                                                                        h('p', {'style':{fontSize:'0.3733rem'}},'余额不足，请前往充值')
                                                                    ]),
                                                                    h('div',{class:'model-foot','style':{textAlign:'right',marginTop:'0.2667rem'}},[
                                                                        h('Button', {'style':{boxShadow:'none',borderColor:'#dcdee2',marginRight:'0.1333rem'},on: {click:()=>{that.$Modal.remove();}}},'取消'),
                                                                        h('Button', {'style':{boxShadow:'none',background: '#009788',borderColor:'#009788'},props: {type: 'primary'},on: {click:()=>{
                                                                            that.$router.push({name:'recharge'});//跳转余额充值
                                                                            } }},'确定')
                                                                    ])
                                                                ]

                                                                )
                                                            } 
                                                        })
                                                    },500)
                                                    
                                                }else{
                                                    that.$Modal.remove();
                                                    that.$Message.error(re.details);
                                                }
                                            })
                                        }else{
                                            that.$Message.error(res.message);
                                        }
                                    })
                                } }},'确定')
                            ])
                        ]

                        )
                    } 
                }, 
            )
        },
        Reminder(no,num){//催单
            let that = this;
            wxpost('User/SendOrderReminder',{orderNo:no}).then(res =>{
                if(res.code == 200){
                    that.$Message.success('催单成功');
                    // that.$Message.success({
                    //     content:'催单成功',
                    //     duration:0.5,
                    //     onClose(){ 
                    //         that.$router.replace({path:'/home'});
                    //     }
                    // })
                }else{
                    that.$Message.error(res.details);
                }
            })
        },
        Cancel(no,num){//取消订单
            let that = this;
            that.$Modal.confirm({
                scrollable:false,
                render: (h) => {
                    return h('div',{class:'model-cont'},[
                        h('div',{class:'model-title','style':{textAlign:'right',marginBottom:'0.2667rem'}},[
                            h('span',
                                {style:{color:'#DF8D15',fontSize:'0.3733rem',float:'left'}}, '提醒！'),
                            h('i',{class:'iconfont icon-close-btn',on: {click: () => {that.$Modal.remove();}}
                            })
                        ]),
                        h('div',{class:'model-content'},[
                            h('p', {'style':{fontSize:'0.3733rem'}},'确认取消订单吗？')
                        ]),
                        h('div',{class:'model-foot','style':{textAlign:'right',marginTop:'0.2667rem'}},[
                            h('Button', {'style':{boxShadow:'none',borderColor:'#dcdee2',marginRight:'0.1333rem'},on: {click:()=>{that.$Modal.remove();}}},'取消'),
                            h('Button', {'style':{boxShadow:'none',background: '#009788',borderColor:'#009788'},props: {type: 'primary'},on: {click:()=>{
                                isLoading(that,'取消中···')
                                wxpost('User/SetPurchaseOrderCancel',{OrderNo:no}).then(res =>{
                                    that.$Spin.hide();
                                    if(res.code == 200){
                                        that.$Message.success(res.message);
                                        that.$Modal.remove();
                                        if(that.selRow.OrderStatus == -1){
                                            that.orderData.map((item,key,arr) => {
                                                if(num == key){
                                                    item.OrderStatus = 5
                                                }
                                            })
                                            let nowObj =  that.orderData[num];
                                            that.$set(that.orderData,num,nowObj);
                                        }else{
                                            that.orderData.map((item,key,arr) => {
                                                if(num == key){
                                                    that.orderData.splice(key,1);
                                                    that.selRow.allTotal -= 1;
                                                }
                                            })
                                            that.reload();
                                        }
                                        // that.load(true);
                                        
                                        that.getCount();//重新获取各种订单数量
                                        
                                    }else{
                                        that.$Message.error(res.message);
                                    }
                                })
                            } }},'确定')
                        ])
                    ]

                    )
                } 
            })
        },
        confirm(no,num,bool){//确认订单
            let that = this;
            let url = '';
            let data = {};
            if(bool){
                url = 'User/SetPurchaseOrderOver';
                data ={OrderNo:no};
            }else{
                url = 'User/SetPurchaseSendOrderOver';
                data ={sendNo:no};
            }
            
            that.$Modal.confirm({
                scrollable:false,
                render: (h) => {
                    return h('div',{class:'model-cont'},[
                        h('div',{class:'model-title','style':{textAlign:'right',marginBottom:'0.2667rem'}},[
                            h('span',
                                {style:{color:'#DF8D15',fontSize:'0.3733rem',float:'left'}}, '提醒！'),
                            h('i',{class:'iconfont icon-close-btn',on: {click: () => {that.$Modal.remove();}}
                            })
                        ]),
                        h('div',{class:'model-content'},[
                            h('p', {'style':{fontSize:'0.3733rem'}},'您确定收货吗？')
                        ]),
                        h('div',{class:'model-foot','style':{textAlign:'right',marginTop:'0.2667rem'}},[
                            h('Button', {'style':{boxShadow:'none',borderColor:'#dcdee2',marginRight:'0.1333rem'},on: {click:()=>{that.$Modal.remove();}}},'取消'),
                            h('Button', {'style':{boxShadow:'none',background: '#009788',borderColor:'#009788'},props: {type: 'primary'},on: {click:()=>{
                                isLoading(that,'确认中···')
                                wxpost(url,data).then(res =>{
                                    that.$Spin.hide();
                                    if(res.code == 200){
                                        that.$Message.success(res.message);
                                        that.$Modal.remove();
                                        if(that.selRow.OrderStatus == -1){
                                            that.orderData.map((item,key,arr) => {
                                                if(num == key){
                                                    item.OrderStatus = 4;
                                                }
                                            })
                                            let nowObj =  that.orderData[num];
                                            that.$set(that.orderData,num,nowObj);
                                        }else{
                                            that.orderData.map((item,key,arr) => {
                                                if(num == key){
                                                    that.orderData.splice(key,1);
                                                    that.selRow.allTotal -= 1;
                                                }
                                            })
                                            that.reload();
                                        }
                                        // that.load(true);
                                        that.getCount();//重新获取各种订单数量
                                        
                                    }else{
                                        that.$Message.error(res.message);
                                    }
                                })
                            } }},'确定')
                        ])
                    ]

                    )
                } 
            })

        },
        confirmErp(no,num){//erp确认订单
            let that = this;
            that.$Modal.confirm({
                scrollable:false,
                render: (h) => {
                    return h('div',{class:'model-cont'},[
                        h('div',{class:'model-title','style':{textAlign:'right',marginBottom:'0.2667rem'}},[
                            h('span',
                                {style:{color:'#DF8D15',fontSize:'0.3733rem',float:'left'}}, '提醒！'),
                            h('i',{class:'iconfont icon-close-btn',on: {click: () => {that.$Modal.remove();}}
                            })
                        ]),
                        h('div',{class:'model-content'},[
                            h('p', {'style':{fontSize:'0.3733rem'}},'您确定收货吗？')
                        ]),
                        h('div',{class:'model-foot','style':{textAlign:'right',marginTop:'0.2667rem'}},[
                            h('Button', {'style':{boxShadow:'none',borderColor:'#dcdee2',marginRight:'0.1333rem'},on: {click:()=>{that.$Modal.remove();}}},'取消'),
                            h('Button', {'style':{boxShadow:'none',background: '#009788',borderColor:'#009788'},props: {type: 'primary'},on: {click:()=>{
                                isLoading(that,'确认中···')
                                wxpost('User/SetPurchaseOrderOver',{OrderNo:no}).then(res =>{
                                    that.$Spin.hide();
                                    if(res.code == 200){
                                        that.$Message.success(res.message);
                                        that.$Modal.remove();
                                        if(that.selRow.OrderStatus == -1){
                                            that.orderData.map((item,key,arr) => {
                                                if(num == key){
                                                    item.OrderStatus = 4;
                                                }
                                            })
                                            let nowObj =  that.orderData[num];
                                            that.$set(that.orderData,num,nowObj);
                                        }else{
                                            that.orderData.map((item,key,arr) => {
                                                if(num == key){
                                                    that.orderData.splice(key,1);
                                                    that.selRow.allTotal -= 1;
                                                }
                                            })
                                            that.reload();
                                        }
                                        // that.load(true);
                                        that.getCount();//重新获取各种订单数量
                                        
                                    }else{
                                        that.$Message.error(res.message);
                                    }
                                })
                            } }},'确定')
                        ])
                    ]
                    )
                } 
            })
        },
        express(no,bool){//查看物流
            let that = this;
            let url = '';
            if(bool){
                url = 'User/GetOrderDeliverByOrderNo/';
                // data ={OrderNo:no};
            }else{
                url = 'User/GetOrderDeliverBySendNo/';
                // data ={sendNo:no};
            }
            wxget(url+no).then(res =>{
                if(res.code == 200){
                    console.log(res);
                    that.courierList = res.data;
                    if(that.courierList.length>0){
                        that.$Modal.confirm({
                            scrollable:false,
                            render: (h) => {
                                return h('div',{class:'model-cont'},[
                                    h('div',{class:'model-title','style':{textAlign:'right',marginBottom:'0.2667rem'}},[
                                        h('span',
                                            {style:{color:'#DF8D15',fontSize:'0.3733rem',float:'left'}}, '快递列表'),
                                        h('i',{class:'iconfont icon-close-btn',on: {click: () => {
                                            that.$Modal.remove();}}
                                        })
                                    ]),
                                    h('div',{class:'model-content'},[
                                        that.courierList.map((ite,inde) =>{
                                        return h('div',{class:'content-list  contentsee-list',on:{'click':() =>{
                                                    if(!ite.StampNumber || ite.StampNumber == ''){
                                                        that.$Message.warning('当前没有物流信息');
                                                        return false;
                                                    }
                                                    that.getPress(ite.Abbreviation,ite.StampNumber,ite.DeliverName);
                                                }}},[
                                                h('p',{style:{fontSize:'0.3733rem',display:'flex'}},[
                                                    h('span','快递名称:'),
                                                    h('Input',{style:{flex:'1'},props: {autofocus: true,placeholder: '快递名称',type:'text',value:ite.DeliverName,readonly:true}
                                                    })
                                                ]),
                                                h('p',{style:{fontSize:'0.3733rem',display:'flex'}},[
                                                    h('span','快递单号:'),
                                                    h('Input',{style:{flex:'1'},props: {autofocus: true,placeholder: '快递单号',type:'text',value:ite.StampNumber,readonly:true}})
                                                ])
                                            ])
                                        })    
                                    ]),
                                    h('div',{class:'model-foot','style':{textAlign:'right',marginTop:'0.2667rem'}},[
                                        h('Button', {'style':{boxShadow:'none',background: '#009788',borderColor:'#009788'},props: {type: 'primary'},on: {click:()=>{that.$Modal.remove();}}},'关闭')
                                    ])
                                ]
                                )
                            } 
                        })
                    }else{
                        that.$Message.warning('当前没有快递信息');
                    }
                    
                }else{
                    that.$Message.error(res.details);
                }
            })
        },
        getPress(Abbreviation,StampNumber,DeliverName){//获取对应快递物流信息
            let that = this;
            console.log(Abbreviation+'====='+StampNumber+'====='+DeliverName);
            window.removeEventListener('scroll', that.handleScroll);//移除全局滚动
            wxpost('API/SetKdSearch',{ShipperCode:Abbreviation,LogisticCode:StampNumber}).then(res =>{
                if(res.code == 200){
                    console.log(res);
                    that.logisticalList = res.data.ExpressSlipList;
                    that.logisticalStatus = res.data.status;
                    that.logisticalStampNumber = StampNumber;
                    that.logisticalDeliverName = DeliverName;
                    if(that.logisticalList.length>0){
                       that.isLogistical = true;
                       
                    }else{
                        that.$Message.warning('当前没有快递信息');
                    }
                }else{
                    that.$Message.error(res.details);
                }
            })
        },
        logisticalCancel(){//关闭物流列表
            let that = this;
            window.addEventListener('scroll', that.handleScroll);//添加滚动监听事件
            that.isLogistical = false;
        },
    },
    mounted(){//页面开始加载
        let that = this;
        that.selRow.OrderStatus = that.$route.params.status;
        window.addEventListener('scroll', that.handleScroll);//添加滚动监听事件
        that.load(true);//加载订单
        that.tabText = [
            {status:-1,text:'全部'},
            {status:1,text:'待付款'},
            {status:2,text:'待发货'},
            {status:3,text:'待收货'},
            {status:4,text:'已收货'},
            {status:5,text:'已关闭'},
        ]
        that.getPolicy();//获取政策
        that.getReminder();//获取催单时间
    }
}
</script>
<style lang="scss" scoped>
    #container{
        padding-bottom: 1.333rem;
        .content{
            padding:0.5333rem 0.4rem 0;//20px 15px 0;
            .title{
                .title_a{
                    .ivu-dropdown{
                        width:100%;
                        .ivu-dropdown-rel{
                            &>a{
                                display: inherit;
                                text-align: right;
                                color:#101010;
                                span{
                                    float:left;
                                }
                            }
                        }
                    }
                }
                .title_t{
                    overflow: hidden;
                    margin-top:0.2667rem;
                    position: relative;
                    .clear{
                        position: absolute;
                        width: 0.5rem;
                        height: 0.5rem;
                        line-height: 0.5rem;
                        font-size: 0.32rem;
                        text-align: center;
                        color: #808695;
                        background: #fff;
                        border-radius: 50%;
                        top: 0.15rem;
                        left: -moz-calc(100% - 4.76rem);
                        left: -webkit-calc(100% - 4.76rem);
                        left:calc(100% - 4.76rem);
                    }
                    input{
                        height:0.8533rem;
                        line-height:0.8533rem;
                        padding: 0 0.1rem;
                        float: left;
                        border: none;
                        background: #DCDDDD;
                        box-shadow: none;
                        border-radius:0;
                        outline: 0;
                        width: -moz-calc(100% - 4.16rem);
                        width: -webkit-calc(100% - 4.16rem);
                        width: calc(100% - 4.16rem);
                    }
                    a{
                        float:left;
                        width:2.08rem;
                        background:#009788;
                        color:#fff;
                        height:0.8533rem;
                        line-height:0.8533rem;
                        box-sizing: border-box;
                        text-align:center;
                        display: inherit;
                    }
                    a:nth-child(3){
                        background:none;
                        color:#727171;
                        border:1px solid #009788;
                    }
                }
            }
            .cont{
                &>ul{
                    display:flex;
                    .Tablis{
                        flex:1;
                        text-align:center;
                        padding:0.2667rem 0;
                        margin:0.2667rem 0 0;
                        position: relative;
                        &>.ivu-divider-horizontal{
                            margin:0;
                            position: absolute;
                            bottom: 0;
                            top: auto !important
                        }
                        &>a{
                            color:#3E3A39;
                            font-size:0.32rem;//12px
                            position: relative;
                            &>span{
                                font-size:0.32rem;// 12px;
                            }
                            &>em{
                                position:absolute;
                                width:0.5333rem;
                                height:0.5333rem;
                                background:#fff;
                                right:0;
                                box-sizing: border-box;
                                border-radius: 50%;
                                color: orange;
                                border: 1px solid orange;
                                line-height: 0.5333rem;
                                top: -0.25rem;
                                right: -0.2667rem;
                            }
                        }
                    }
                }
                &>.cont_c{
                    .cont_c_cont{
                        position: relative;
                        &>.cont_list{
                            &>.cont_list_t{
                                font-size:0.32rem;//12px
                                margin-top:0.2667rem;// 10px;
                                color:#888888;
                                span{
                                    &:nth-child(1){
                                        font-size:0.32rem;//12px
                                    }
                                    &:nth-child(2){
                                        color:#DF8D15;
                                        float:right;
                                    }
                                    &:nth-child(3){
                                        color:#DF8D15;
                                        float:right;
                                        margin-right:0.1333rem;
                                    }
                                }
                            }
                            &>.cont_list_u{
                                overflow: hidden;
                                margin: 0.2667rem 0;
                                .list_u_l{
                                    float:left;
                                    width:1.8667rem;//70px
                                    padding:0.2667rem 0;
                                    img{
                                        width:100%;
                                        vertical-align:bottom;
                                    }
                                }
                                .list_u_c{
                                    float:left;
                                    width:100%;
                                    padding-left:2.1333rem;//80px
                                    padding-top:0.1333rem;
                                    margin-left:-1.8667rem;//70px
                                    height:2.4rem;
                                    display:flex;
                                    flex-direction:column;
                                    align-items:left;
                                    justify-content:center;
                                    &>p{
                                        &:nth-child(1){
                                            color:#101010;
                                            overflow: hidden;
                                            text-overflow: ellipsis;
                                            display: -webkit-box;
                                            -webkit-line-clamp: 2;
                                            -webkit-box-orient: vertical;
                                            font-size: 0.32rem;//12px
                                        }
                                        &:nth-child(2){
                                            color:#727171;
                                            font-size:0.32rem;
                                            margin:0 0 0.1333rem 0;
                                        }
                                        &:nth-child(3){
                                            color:#B5B5B6;
                                            font-size:0.3733rem;//14px
                                            &>span{
                                                color:#DF8D15;
                                            }
                                            &>i{
                                                color:#5eb95e;
                                                font-size:0.32rem;//12px
                                            }
                                            &>em{
                                                font-size:0.32rem;//12px
                                            }
                                        }
                                    }
                                }
                            }
                            &>.ivu-divider-horizontal{
                                margin:0 0 0.2667rem 0;
                                &.bg_line{
                                    height:0.2667rem;
                                    width: 10rem;
                                    margin-left: -0.4rem;
                                    margin-bottom:0;
                                }
                            }
                            &>.cont_list_d{
                                overflow: hidden;
                                // .list_d_l{
                                //     float:left;
                                //     width:0.9333rem;
                                //     padding-top:0.2667rem;
                                //     img{
                                //         width:100%;
                                //         border-radius:50%;
                                //         vertical-align:bottom;
                                //     }
                                // }
                                .list_d_c{
                                    float:left;
                                    width:100%;
                                    // padding-left:1.2rem;//45px
                                    // margin-left:-0.9333rem;
                                    color:#888888;
                                    &>p{
                                        margin-bottom:0.1333rem;
                                        &:nth-child(2){
                                            overflow: hidden;
                                            span{
                                                float:left;
                                                width:50%;
                                            }
                                        }
                                        &:nth-child(3){
                                            overflow: hidden;
                                            span{
                                                float:left;
                                                width:50%;
                                            }
                                        }
                                    }
                                }
                            }
                            &>.cont_list_f{
                                &>p{
                                    text-align:right;
                                    &:nth-child(1){
                                        margin:0.4rem 0;// 15px 0;
                                        span{
                                            color:#DF8D15;
                                        }
                                    }
                                     &:nth-child(2){
                                         margin-bottom:0.2667rem; //10px
                                     }
                                }
                            }
                        }
                        &>.list-foot{
                            &.no{
                                position: absolute;
                                height: 12rem;
                            }
                            p{
                                text-align:center;
                                margin-bottom:0.2667rem;//10px;
                            }
                            .notData{
                                text-align: center;
                                margin-top:0.2667rem;//10px;
                            }
                        }
                    }
                }
            }
        }
    }
</style>
<style>
    .caigouOrder .content .title .title_a .ivu-dropdown .ivu-dropdown-rel{
        padding:0.1333rem 0.2667rem;
        background:#DCDDDD;
    }
    .caigouOrder .content .title .title_a .ivu-dropdown .ivu-select-dropdown{
        left:0.4rem;
        width:-moz-calc(100% - 0.8rem);
        width:-webkit-calc(100% - 0.8rem);
        width:calc(100% - 0.8rem);
    }
    .caigouOrder .ivu-dropdown-item-selected,.caigouOrder .ivu-dropdown-item-selected:hover{
        background:none;
        color:#009788;
    }
    .caigouOrder .content .cont>ul>.active a{
        color:#009788 !important;
    }
    .caigouOrder .ivu-btn,.caigouOrder .ivu-btn:hover{
        border-color:#727171;
        color:#727171;
    }
    .caigouOrder .ivu-btn.nopay,.caigouOrder .ivu-btn.nopay:hover{
        border-color:#009788;
        /* color:#009788; */
    }
    .model-foot .ivu-input:hover,.model-foot .ivu-input:focus{
        border-color:#dcdee2;
    }
    .caigouOrder .ivu-btn.notime,.caigouOrder .ivu-btn.notime:hover{
        border-color:#DF8D15;
        color:#DF8D15;
    }
</style>






