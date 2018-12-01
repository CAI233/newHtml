<template>
    <div id="container" class="lingshouOrder">
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
                    <i class="clear iconfont icon-close-btn" v-show="date" @click="clear"></i>
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
                                <span v-if="item.OrderStatus">{{['待确认','待收款','待发货','待收货','已收货','已关闭','已退款'][item.OrderStatus]}}</span>
                                <span v-if="item.IsTransfer">转采购</span>
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
                                <div class="list_d_l">
                                    <img v-lazy="item.BuyUserImg" :key="item.BuyUserImg" alt="">
                                </div>
                                <div class="list_d_c">
                                    <p><span>下单时间{{item.OrderDate}}</span></p>
                                    <p><span>下单人:{{item.BuyUserName}}</span><span>电话:{{item.BuyUserPhone}}</span></p>
                                    <p><span>收货人:{{item.Sendee}}</span><span>电话:{{item.Contact}}</span></p>
                                    <p><span>收货地址:{{item.Address}}</span></p>
                                    <!-- <p><span>下单人:{{item.BuyUserName}}</span>&nbsp;&nbsp;<span>电话:{{item.BuyUserPhone}}</span>&nbsp;&nbsp;<span>下单时间{{item.OrderDate}}</span></p>
                                    <p><span>收货人:{{item.Sendee}}</span>&nbsp;&nbsp;<span>电话:{{item.Contact}}</span></p>
                                    <p><span>收货地址:{{item.Address}}</span></p> -->
                                </div>
                            </div>
                            <div class="cont_list_f">
                                <p>共{{item.sumproduct}}件商品&nbsp;&nbsp;<span>邮费:<i>￥{{item.FarePrice}}</i></span>&nbsp;&nbsp;<span>合计:<i>￥{{item.AmountPrice}}</i></span>&nbsp;&nbsp;<span>实付金额:<i>￥{{item.PayPrice}}</i></span></p>
                                <p>
                                    <Button v-if="item.OrderStatus==0||item.OrderStatus==1|| item.OrderStatus==2" @click.native="Cancel(item.OrderNo,index)">取消订单</Button>
                                    <Button v-if="item.OrderStatus==0">确认订单</Button>
                                    <Button v-if="item.OrderStatus==2 && item.IsTransfer==false" @click.native="toCaigou(item.OrderNo,index)">转采购</Button>
                                    <Button class="nopay" v-if="item.OrderStatus==1 && item.IsTransfer==false" @click.native="Pay(item.OrderNo,item.IsTransfer,index)">确认收款</Button>
                                    <Button v-if="item.OrderStatus==1 && item.IsTransfer==true && item.OrderNo==item.OriginalOrderNo" @click.native="Pay(item.OrderNo,false,index)">确认收款</Button>
                                    <Button class="nopay" v-if="item.OrderStatus==1 && item.BuyUserId=='' && item.IsTransfer==false" @click.native="updateFare(item.OrderNo,item.BuyUserId,index)">修改邮费</Button>
                                    <Button class="nopay" v-if="item.OrderStatus==1 && item.BuyUserId=='' && item.IsTransfer==true && item.OrderNo==item.OriginalOrderNo" @click.native="updateFare(item.OrderNo,item.BuyUserId,index)">修改邮费</Button>
                                    <Button v-if="(item.OrderStatus==33 || item.OrderStatus==2) && shipment && item.IsTransfer==false" @click.native="waitSend(item.OrderNo)">分批发货</Button>
                                    <Button class="nopay" v-if="item.OrderStatus==2 && item.IsTransfer==false" @click.native="send(item.OrderNo)">发货</Button>
                                    <Button v-if="item.OrderStatus==3 && item.IsSplitOrder==false && item.IsTransfer==false && item.OriginalOrderNo==''"  @click.native="confirm(item.OrderNo,index,true)">确认收货</Button>
                                    <Button v-if="item.OrderStatus==3 && item.IsSplitOrder==false && item.IsTransfer==true && item.OrderNo==item.OriginalOrderNo" @click.native="confirm(item.OrderNo,index,true)">确认收货</Button>
                                    <Button v-if="(item.OrderStatus==33 || item.OrderStatus==3) && item.IsSplitOrder==true && item.SendOrderStatus==1 && item.IsTransfer==false && item.OriginalOrderNo==''" @click.native="confirm(item.SendNo,index,false)">确认收货</Button>
                                    <Button v-if="(item.OrderStatus==33 || item.OrderStatus==3) && item.IsSplitOrder==true && item.SendOrderStatus==1 && item.IsTransfer==true && item.OrderNo==item.OriginalOrderNo" @click.native="confirm(item.SendNo,index,false)">确认收货</Button>
                                    <Button v-if="(item.OrderStatus==3 || item.OrderStatus==33 || item.OrderStatus==4) && !item.IsSplitOrder && paramsoff" @click.native="express(item.OrderNo,true)">查看物流</Button>
                                    <Button v-if="(item.OrderStatus==3 || item.OrderStatus==33 || item.OrderStatus==4) && item.IsSplitOrder && paramsoff" @click.native="express(item.SendNo,false)">查看物流</Button>
                                    <Button v-if="item.IsTransfer">已转采购</Button>
                                    <Button v-if="(item.OrderStatus==3 || item.OrderStatus==4) && expressage==true" @click.native="updateCourier(item.OrderNo,index,true)">修改快递</Button>
                                    <Button v-if="item.OrderStatus==33 && expressage==true" @click.native="updateCourier(item.SendNo,index,false)">修改快递</Button>
                                </p>
                            </div>
                            <Divider v-if="index != orderData.length-1" class="bg_line"/>
                        </li>
                        <div class="list-foot" :class="orderData.length == 0 ? 'no' :''">
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
        <Modal v-model="isCourier" title="修改快递" @on-cancel="courierCancel" class="courier-list">
            <div class="content-list">
                <p>
                    <span>快递名称</span>
                    <Dropdown trigger="click" @on-click="chooseCourier" >
                        <a href="javascript:void(0)">
                            <span>{{courierDeliverName}}</span>    
                            <Icon type="ios-arrow-down"></Icon>
                        </a>
                        <DropdownMenu slot="list">
                            <DropdownItem :name="item.Abbreviation" v-if="courierData.length>0" v-for="(item,index) in courierData" :key="index" :selected="item.Abbreviation == courierAbbreviation ? true : false">{{item.Title}}</DropdownItem>
                            <DropdownItem v-else>暂无政策</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </p>
                <p>
                    <span>快递单号</span>
                    <Input v-model="courierStampNumber" placeholder="请输入快递单号"/>
                </p>
            </div>
            <div slot="footer" style="text-align:center;">
                <Button type="primary" @click.native="courierOk" style="background:#009788;border-color:#009788;">确定</Button>
                <Button @click.native="courierCancel" style="border-color:#dcdee2;">取消</Button>
            </div>
        </Modal>
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
import {wxget,wxpost} from '@/axios/ajax';
import {isLoading} from '@/assets/js/load.js'
export default {
    name: 'lingshouOrder',
    data() {
        return{
            shipment: true,
            expressage: false,
            paramsoff: true,
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
            orderData:[],
            policyData:[],
            date:'',
            tabText:[],
            orderPolicyData:[],  //当前订单可转采购政策 
            orderOrderNo:'',//当前订单可转采购 当前订单id
            orderPolicyActivityId:'',//当前订单可转采购 政策id
            orderPolicyActivityTitle:'-请选择政策-',//当前订单可转采购 政策名称

            courierData:[],//快递列表
            courierList:[],//订单所含快递list
            isCourier:false,//修改快递弹窗
            courierId:'',//当前修改的快递信息id
            courierIndex:0,//当前修改的快递信息下标
            courierDeliverName:'',//当前快递名称
            courierAbbreviation:'',//当前快递缩写
            courierStampNumber:'',//当前快递单号

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
            if(that.selRow.OrderStatus==4 || that.selRow.OrderStatus==3){
                that.shipment = false;
            }else{
                that.shipment = true;
            }
            if(that.selRow.OrderStatus==3){
                that.expressage = true;
            }else{
                that.expressage = false;
            }
            if(that.selRow.OrderStatus==2){
                that.paramsoff = false
            }else{
                that.paramsoff = true 
            }
            wxpost('User/GetSellOrder',that.selRow).then(res =>{
                that.$Spin.hide();
                if(res.code == 200){
                    console.log(res);
                    that.orderData.push(...res.data);
                    that.selRow.allTotal = res.total;
                }else{
                    that.$Message.error(res.message);
                }
            })
            that.getCount();
        },
        reload(){//更新数据
            let that = this;
            wxpost('User/GetSellOrder',that.selRow).then(res =>{
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
                orderType:2,
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
                        if(item.status == 6){
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
        getPolicy(){//获取政策
            let that = this;
            wxget('User/GetActivityListByTarget').then(res =>{
                if(res.code == 200){
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
        getCourier(){//获取快递list
            let that = this;
            wxget('User/GetExpressList').then(res =>{
                if(res.code == 200){
                    that.courierData = res.data;
                }else{
                    that.$Message.error(res.details);
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
            that.$router.push({name:'lingshouOrderDetails',params:{OrderNo:no}});
        },
        confirm(no,num,bool){//确认订单
            let that = this;

            let url = '';
            let data = {};
            if(bool){
                url = 'User/SetSellOrderOver';
                data = {OrderNo:no};
            }else{
                url = 'User/SetSellSendOrderOver';
                data = {SendNo:no};
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
                                                    item.OrderStatus = 2;
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
            }else{
                url = 'User/GetOrderDeliverBySendNo/';
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
                                            that.$Modal.remove();
                                            that.courierCancel();
                                            }}
                                        })
                                    ]),
                                    h('div',{class:'model-content'},[
                                        that.courierList.map((ite,inde) =>{
                                        return h('div',{class:'content-list contentsee-list',on:{'click':() =>{
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
                                        h('Button', {'style':{boxShadow:'none',background: '#009788',borderColor:'#009788'},props: {type: 'primary'},on: {click:()=>{
                                            that.$Modal.remove();
                                            that.courierCancel();
                                            }}},'关闭')
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
            // outget(that.HOST+'?type='+'yuantong' +'&postid='+'802533775881852646').then(res =>{
            //     if(res.code == 200){

            //     }else{

            //     }
            // })
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
        updateCourier(no,num,bool){//修改快递
            let that = this;
            let url = '';
            if(bool){
                url ='User/GetOrderDeliverByOrderNo/';
            }else{
                url ='User/GetOrderDeliverBySendNo/';
            }
            // console.log(that.courierData);
            wxget(url+no).then(res =>{
                if(res.code == 200){
                    // console.log(res);
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
                                        return h('div',{class:'content-list'},[
                                                h('p',{style:{fontSize:'0.3733rem',display:'flex'},on:{'click':() =>{
                                                        // that.$Modal.remove();
                                                            that.isCourier = true;
                                                            that.courierId = ite.F_Id;
                                                            that.courierIndex = inde;
                                                            that.courierDeliverName = ite.DeliverName;
                                                            that.courierAbbreviation = ite.Abbreviation;
                                                            that.courierStampNumber = ite.StampNumber;
                                                        }}},[
                                                    h('span','快递名称:'),
                                                    h('Input',{style:{outline:0,boxShadow:'none',borderColor:'#dcdee2',flex:'1'},props: {autofocus: true,placeholder: '请输入快递单号',type:'text',value:ite.DeliverName,readonly:true}
                                                        // ,nativeOn:{'click':() =>{
                                                        // // that.$Modal.remove();
                                                        //     that.isCourier = true;
                                                        //     that.courierId = ite.F_Id;
                                                        //     that.courierIndex = inde;
                                                        //     that.courierDeliverName = ite.DeliverName;
                                                        //     that.courierAbbreviation = ite.Abbreviation;
                                                        //     that.courierStampNumber = ite.StampNumber;
                                                        // }}
                                                    })
                                                ]),
                                                h('p',{style:{fontSize:'0.3733rem',display:'flex'}},[
                                                    h('span','快递单号:'),
                                                    h('Input',{style:{outline:0,boxShadow:'none',borderColor:'#dcdee2',flex:'1'},props: {autofocus: true,placeholder: '请输入快递单号',type:'text',value:ite.StampNumber,readonly:true}})
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
        chooseCourier(name){//修改快递-选择快递
            let that = this;
            that.courierAbbreviation = name;
            that.courierData.map((item)=>{
                if(item.Abbreviation == name){
                    that.courierDeliverName = item.Title;
                }
            })
        },
        courierOk(){//弹窗-确认
            let that = this;

            if(!that.courierStampNumber || that.courierStampNumber == ''){
                that.$Message.warning('请填写快递单号')
            }
            let courierParam = {
                Id:that.courierId,
                StampNumber:that.courierStampNumber,
                DeliverName:that.courierDeliverName,
                Abbreviation:that.courierAbbreviation
            }

            let nowObj = that.courierList[that.courierIndex];
                nowObj.F_Id = that.courierId;
                nowObj.StampNumber = that.courierStampNumber;
                nowObj.DeliverName = that.courierDeliverName;
                nowObj.Abbreviation = that.courierAbbreviation;

            console.log(that.courierList)
            isLoading('快递信息修改中···');
            wxpost('User/SetOrderDeliver',courierParam).then(res =>{
                that.$Spin.hide();
                if(res.code == 200){
                    that.$Message.success({
                        content:'快递修改成功',
                        duration:0.5,
                        onClose(){ 
                            that.courierCancel()//关闭二级弹窗
                        }
                    })
                }else{
                    that.$Message.error(res.details);
                }
            })
        },
        courierCancel(){//取消弹窗
            let that = this;
            that.isCourier = false;                                      
            that.courierDeliverName = '';
            that.courierAbbreviation = '';
            that.courierStampNumber = '';
        },
        toCaigou(no,num){//转采购
            let that = this;
            wxget('User/GetOrderActivity?OrderNo='+no).then(res =>{
                if(res.code == 200){
                    that.orderPolicyData = res.data;
                    that.orderPolicyData.unshift({
                        F_Id:'',
                        ActivityTitle:'-请选择政策-'
                    })
                    that.orderOrderNo = no;
                    that.$Modal.confirm({
                        scrollable:false,
                        render: (h) => {
                            return h('div',{class:'model-cont'},[
                                h('div',{class:'model-title','style':{textAlign:'right',marginBottom:'0.2667rem'}},[
                                    h('span',
                                        {style:{color:'#f90',fontSize:'0.3733rem',background:'#F8F8F8',float:'left'}}, '确认该订单转为采购订单吗？'),
                                    h('i',{class:'iconfont icon-close-btn',on: {click: () => {
                                        that.$Modal.remove();}}
                                    })
                                ]),
                                h('div',{class:'model-content content-list'},[
                                    h('p',{style:{fontSize:'0.3733rem',display:'flex'}},[
                                        h('span','选择政策:'),
                                        h('Dropdown',{style:{flex:'1'},props:{trigger:'click'},on:{
                                            click:($event)=>{
                                                console.log($event);
                                            }
                                        }},[
                                            h('a',{attrs:{href:'javascript:void(0)'},style:{display:'inherit',textAlign:'right',color:'#009788'}},[
                                                h('span',{style:{float:'left'}},that.orderPolicyActivityTitle),
                                                h('Icon',{props:{type: 'ios-arrow-down'}})
                                            ]),
                                            h('DropdownMenu',{slot:'list'},that.orderPolicyData.map((item,index) =>{
                                                return h('DropdownItem',{props:{name:item.F_Id,key:index,selected:item.F_Id == that.orderPolicyActivityId ? true : false},nativeOn:{'click':() =>{//大坑 //https://www.jianshu.com/p/034afd50ac21 
                                                    that.orderPolicyActivityId = item.F_Id;
                                                    that.orderPolicyActivityTitle = item.ActivityTitle;
                                                    
                                                }}},item.ActivityTitle)
                                            }))
                                        ])
                                    ])
                                ]),
                                h('div',{class:'model-foot','style':{textAlign:'right',marginTop:'0.2667rem'}},[
                                    h('Button', {'style':{boxShadow:'none',borderColor:'#dcdee2',marginRight:'0.1333rem'},on: {click:()=>{that.$Modal.remove();}}},'取消'),
                                    h('Button', {'style':{boxShadow:'none',background: '#009788',borderColor:'#009788'},props: {type: 'primary'},on: {click:()=>{
                                        if(!that.orderPolicyActivityId || that.orderPolicyActivityId == ''){
                                            that.$Message.warning('请选择政策');
                                            return false;
                                        }
                                        isLoading(that,'订单更新中···');
                                        let toCaigouParam = {
                                            OrderNo:that.orderOrderNo,
                                            ActivityId:that.orderPolicyActivityId,
                                            ActivityTitle:that.orderPolicyActivityTitle
                                        }
                                        wxpost('User/SetTransferOrder',toCaigouParam).then(res =>{
                                            that.$Spin.hide();
                                            that.$Modal.remove();
                                            if(res.code == 200){
                                                // 更改当前状态 已转采购 IsTransfer
                                                that.orderData.map((item,key,arr) => {
                                                    if(num == key){
                                                        item.IsTransfer = true
                                                    }
                                                })
                                                let nowObj =  that.orderData[num];
                                                that.$set(that.orderData,num,nowObj);
                                                
                                                that.getCount();//重新获取各种订单数量

                                                that.$Message.success({
                                                    content:res.details,
                                                    duration:1,
                                                    onClose(){ 
                                                        that.$router.push({name:'caigouWaitPay',params: {OrderNo:res.data}});//跳转 转采购
                                                    }
                                                });  
                                                
                                            }else{
                                                that.$Message.error(res.details);
                                            }
                                        })
                                    } }},'确定')
                                ])
                            ]

                            )
                        } 
                    })
                }else{
                    that.$Message.error(res.details)
                }
            })
        },
        Pay(no,bool,num){//支付订单
            let that = this;
            let payWord = '';
            let payPrice = that.orderData[num].AmountPrice;
            if(bool){// 为代发订单
                that.$Modal.confirm({
                    scrollable:false,
                    render: (h) => {
                        return h('div',{class:'model-cont'},[
                            h('div',{class:'model-title','style':{textAlign:'right',marginBottom:'0.2667rem'}},[
                                h('span',
                                    {style:{color:'#666666',fontSize:'0.3733rem',background:'#F8F8F8',float:'left'}}, '请输入支付密码，并且确认支付。'),
                                h('i',{class:'iconfont icon-close-btn',on: {click: () => {
                                    that.$Modal.remove();
                                    payWord = '';
                                    }}})
                            ]),
                            h('div',{class:'model-content'},[
                                h('p',{style:{marginBottom:'0.2667rem'}},[
                                    h('span',{style:{marginRight:'0.2667rem'}},'支付金额:'),
                                    h('em',{style:{color:'#DF8D15'}},'¥'+payPrice)
                                ]),
                                h('Input', {'style':{outline:0,boxShadow:'none',borderColor:'#dcdee2'},
                                    props: {autofocus: true,placeholder: '请输入支付密码',type:'password'},
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
                                        that.$Message.warning('请输入支付密码！');
                                        return false;
                                    }
                                    isLoading(that,'支付中···');
                                    wxpost('User/SetSellTransferOrderPay',{OrderNo:no,PayPrice:payPrice,PayPassWord:payWord}).then(res =>{
                                        that.$Spin.hide();
                                        if(res.code == 200){
                                            that.$Modal.remove();
                                            if(that.selRow.OrderStatus == -1){
                                                that.orderData.map((item,key,arr) => {
                                                    if(num == key){
                                                        item.OrderStatus = 2
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
                                            that.getCount();//重新获取各种订单数量
                                            
                                        }else{
                                            that.$Message.error(res.details);
                                        }
                                    })
                                } }},'确定')
                            ])
                        ]

                        )
                    } 
                }, 
            )
            }else{//
                that.$Modal.confirm({
                    scrollable:false,
                    render: (h) => {
                        return h('div',{class:'model-cont'},[
                            h('div',{class:'model-title','style':{textAlign:'right',marginBottom:'0.2667rem'}},[
                                h('span',
                                    {style:{color:'#009788',fontSize:'0.3733rem',background:'#F8F8F8',float:'left'}}, '系统提醒！'),
                                h('i',{class:'iconfont icon-close-btn',on: {click: () => {that.$Modal.remove();}}
                                })
                            ]),
                            h('div',{class:'model-content'},[
                                h('p', {'style':{fontSize:'0.3733rem'}},'您确认此订单已支付？')
                            ]),
                            h('div',{class:'model-foot','style':{textAlign:'right',marginTop:'0.2667rem'}},[
                                h('Button', {'style':{boxShadow:'none',borderColor:'#dcdee2',marginRight:'0.1333rem'},on: {click:()=>{that.$Modal.remove();}}},'取消'),
                                h('Button', {'style':{boxShadow:'none',background: '#009788',borderColor:'#009788'},props: {type: 'primary'},on: {click:()=>{
                                    isLoading(that,'更新订单中···')
                                    wxpost('User/SetSellOrderPay',{OrderNo:no}).then(res =>{
                                        that.$Spin.hide();
                                        if(res.code == 200){
                                            that.$Message.success(res.message);
                                            that.$Modal.remove();
                                            if(that.selRow.OrderStatus == -1){
                                                that.orderData.map((item,key,arr) => {
                                                    if(num == key){
                                                        item.OrderStatus = 2
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
            }
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
                                wxpost('User/SetSellOrderCancel',{OrderNo:no}).then(res =>{
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
        updateFare(no,id,num){//修改邮费
            let that = this;
            let Price = that.orderData[num].FarePrice ? that.orderData[num].FarePrice : 0;
            that.$Modal.confirm({
                scrollable:false,
                render: (h) => {
                    return h('div',{class:'model-cont'},[
                        h('div',{class:'model-title','style':{textAlign:'right',marginBottom:'0.2667rem'}},[
                            h('span',
                                {style:{color:'#DF8D15',fontSize:'0.3733rem',float:'left'}}, '修改邮费！'),
                            h('i',{class:'iconfont icon-close-btn',on: {click: () => {that.$Modal.remove();}}
                            })
                        ]),
                        h('InputNumber',{class:'model-content',
                            props: {min:0,placeholder:'请输入金额',value:Price},
                            on:{
                                input: (val) => {
                                    Price = val;
                                }
                            }}),
                        h('div',{class:'model-foot','style':{textAlign:'right',marginTop:'0.2667rem'}},[
                            h('Button', {'style':{boxShadow:'none',borderColor:'#dcdee2',marginRight:'0.1333rem'},on: {click:()=>{that.$Modal.remove();}}},'取消'),
                            h('Button', {'style':{boxShadow:'none',background: '#009788',borderColor:'#009788'},props: {type: 'primary'},on: {click:()=>{
                                if(!Price || Price == ''){
                                    that.$Message.warning('请输入金额');
                                    return false;
                                }
                                isLoading(that,'更新邮费中···')
                                wxpost('User/SetSellOrderUpdateFare',{OrderNo:no,BuyUserId:id,FarePrice:Price}).then(res =>{
                                    that.$Spin.hide();
                                    if(res.code == 200){
                                        that.$Message.success(res.message);
                                        that.$Modal.remove();
                                        that.orderData.map((item,key,arr) => {
                                            if(num == key){
                                                item.FarePrice = Price;
                                            }
                                        })
                                        let nowObj =  that.orderData[num];
                                        that.$set(that.orderData,num,nowObj);
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
        waitSend(no){//分批发货
            let that = this;
            that.$router.push({name:'lingshouWaitSend',params: {OrderNo:no}});//跳转
        },
        send(no){//发货
            let that = this;
            that.$router.push({name:'lingshouSend',params: {OrderNo:no}});//跳转
        }
    },
    mounted(){//页面开始加载
        let that = this;
        that.selRow.OrderStatus = that.$route.params.status;
        window.addEventListener('scroll', that.handleScroll);//添加滚动监听事件
        that.load(true);//加载订单
        that.tabText = [
            {status:-1,text:'全部'},
            {status:1,text:'待收款'},
            {status:2,text:'待发货'},
            {status:3,text:'待收货'},
            {status:4,text:'已收货'},
            {status:5,text:'已关闭'},
            {status:6,text:'已退款'},
        ]
        that.getPolicy();//获取政策
        that.getCourier();//获取快递list
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
                                .list_d_l{
                                    float:left;
                                    width:0.9333rem;
                                    padding-top:0.2667rem;
                                    img{
                                        width:100%;
                                        max-height:0.9333rem;
                                        border-radius:50%;
                                        vertical-align:bottom;
                                    }
                                }
                                .list_d_c{
                                    float:left;
                                    width:100%;
                                    padding-left:1.2rem;//45px
                                    margin-left:-0.9333rem;
                                    color:#888888;
                                    &>p{
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
                                            i{
                                                color:#DF8D15;
                                            }
                                        }
                                    }
                                     &:nth-child(2){
                                         margin-bottom:0.2667rem; //10px
                                         overflow: hidden;
                                         button{
                                            float:right;
                                            margin-left:0.1333rem;// 5px
                                         }
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
    .lingshouOrder .content .title .title_a .ivu-dropdown .ivu-dropdown-rel{
        padding:0.1333rem 0.2667rem;
        background:#DCDDDD;
    }
    .lingshouOrder .content .title .title_a .ivu-dropdown .ivu-select-dropdown{
        left:0.4rem;
        width:-moz-calc(100% - 0.8rem);
        width:-webkit-calc(100% - 0.8rem);
        width:calc(100% - 0.8rem);
    }
    .lingshouOrder .ivu-dropdown-item-selected,.lingshouOrder .ivu-dropdown-item-selected:hover{
        background:none;
        color:#009788;
    }
    .lingshouOrder .content .cont>ul>.active a{
        color:#009788 !important;
    }
    .lingshouOrder .ivu-btn,.lingshouOrder .ivu-btn:hover{
        border-color:#727171;
        color:#727171;
    }
    .lingshouOrder .ivu-btn.nopay,.lingshouOrder .ivu-btn.nopay:hover{
        border-color:#009788;
        color:#009788;
    }
    .model-foot .ivu-input:hover,.model-foot .ivu-input:focus{
        border-color:#dcdee2;
    }
    .ivu-input-number{
        width:100%;
        outline:0;
        box-shadow:none;
        border:1px solid #B5B5B6;
    }
    .ivu-input-number:hover,.ivu-input-number:focus{
        outline:0;
        box-shadow:none;
        border:1px solid #B5B5B6;
    }
    .ivu-input-number .ivu-input-number-handler-wrap{
        display:none;
    }
    .vertical-center-modal .ivu-modal-content{
        padding:16px;
    }
    .vertical-center-modal .ivu-modal-content .ivu-modal-close{
        top:0.2667rem;
    }
    .vertical-center-modal .ivu-modal-content .ivu-modal-header{
        padding:0 4px;
        margin-bottom:0.2667rem;
    }
    .vertical-center-modal .ivu-modal-content .ivu-modal-body{
        padding:0 4px;  
    }
    .vertical-center-modal .ivu-modal-content .ivu-modal-footer{
        margin-top:0.26667rem;
        padding:0 4px;
    }
</style>






