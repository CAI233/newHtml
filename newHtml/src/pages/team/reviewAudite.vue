<template>
    <div id="container" class="reviewAudite">
        <div class="content">
            <div class="cont-top">
                <span>{{AuditeData.UserName}}</span>
                <em>+{{AuditeData.ReChargePrice}}</em>
                <span v-if="AuditeData.VerifyStatus == 1">待审核</span>
                <span v-if="AuditeData.VerifyStatus == 2">已审核</span>
                <span v-if="AuditeData.VerifyStatus == 3" >已驳回</span>
            </div>
            <Card class="cont-cont">
                <CellGroup>
                    <Cell title="充值渠道" :extra="AuditeData.ReChargeType"/>
                    <Cell title="充值账户" :extra="AuditeData.UserName+'    '+AuditeData.UserPhone" />
                    <Cell title="支付时间" :extra="AuditeData.PayDate" />
                </CellGroup>
            </Card>
            <Collapse simple class="cont-img" v-model="imgNum">
                <Panel :hide-arrow="true" name="1">
                    充值凭证<i class="iconfont icon-check"></i>
                    <p slot="content" style="text-align:center;">
                        <img v-lazy="AuditeData.ReChargeProof" @click="seeImg(AuditeData.ReChargeProof)" :key="AuditeData.ReChargeProof" alt="" >
                    </p>
                </Panel>
            </Collapse>
            <Form :label-width="60" class="cont-remark">
                <FormItem label="充值备注">
                    <Input v-model="AuditeData.ReChargeRemark" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="备注" readonly></Input>
                </FormItem>
                <FormItem label="审核备注">
                    <Input v-model="AuditeData.VerifyRemark" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="备注" :readonly="UserId && AuditeData.VerifyStatus == 1 ? false : true"></Input>
                </FormItem>
            </Form>
            <div class="cont-foot" v-if="UserId && AuditeData.VerifyStatus == 1">
                <Button long @click.native="submit(true)">确认</Button>
                <Button long @click.native="submit(false)">驳回</Button>
            </div>
        </div>
        
    </div>
</template>
<script>
import {post,wxpost} from '@/axios/ajax';
import {addCookie,getCookie,getCurrentDate,deleteCookie} from '@/assets/js/assist.js'
import {isLoading} from '@/assets/js/load.js'
import { wxget } from '../../axios/ajax';
export default {
    name: 'reviewAudite',
    data() {
        return{
            imgNum:'1',
            AuditeData:{},
            BankNo:'',
            UserId:'',
        }
    },
    components: {

    },
    methods:{
        load(){//加载记录
            let that = this;
            let url = '';
            if(!that.UserId || that.UserId == ''){
                url = 'User/GetBalanceByUserId/'+that.BankNo;
            }else{
                url = 'User/GetBalanceByRefereeId/'+that.BankNo+'/'+that.UserId;
            }
            wxget(url).then(res =>{
                if(res.code == 200){
                    console.log(res.data);
                    that.AuditeData = res.data;
                }else{
                    that.$Message.error(res.details);
                }
            })
        },
        submit(bool){//提交审核
            let that = this;
            let msg = '';
            let IsValid = 0;
            if(bool){
                msg = '您确认通过该用户的充值申请？';
                IsValid = 1;
            }else{
                msg = '您确认驳回该用户的充值申请？';
                IsValid = 0;
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
                            h('p', {'style':{fontSize:'0.3733rem'}},msg)
                        ]),
                        h('div',{class:'model-foot','style':{textAlign:'right',marginTop:'0.2667rem'}},[
                            h('Button', {'style':{boxShadow:'none',borderColor:'#dcdee2',marginRight:'0.1333rem'},on: {click:()=>{that.$Modal.remove();}}},'取消'),
                            h('Button', {'style':{boxShadow:'none',background: '#009788',borderColor:'#009788'},props: {type: 'primary'},on: {click:()=>{
                                isLoading(that,'审核中···')
                                wxpost('User/SetVerifyBalance',{BankNo:that.BankNo,IsValid:IsValid,VerifyRemark:that.AuditeData.VerifyRemark}).then(res =>{
                                    that.$Spin.hide();
                                    if(res.code == 200){
                                        that.$Message.success({
                                            content:res.details,
                                            duration:1,
                                            onClose(){ 
                                                that.$router.push({name:'returnReview',params:{id:0}});
                                            }
                                        });
                                        that.$Modal.remove();
                                        
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
        },
        seeImg(url){//预览图片
            let that = this;
            console.log(url);
            if(!url || url == ''){
                that.$Message.warning('当前没有图片');
                return false;
            }
            wx.previewImage({
                current: url, // 当前显示图片的http链接
                urls: [url] // 需要预览的图片http链接列表
            });
        }
    },
    mounted(){
        let that = this;
        that.BankNo = that.$route.query.BankNo;
        that.UserId = that.$route.query.UserId;
        that.load();
        
        post('API/SetWXParam/',{Url:window.location.href}).then(res =>{
            if(res.code == 200){
                let nowConfig = res.data;
                // alert(JSON.stringify(nowConfig));
                wx.config({
                    // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                    debug: false,
                    // 必填，公众号的唯一标识
                    appId: nowConfig.appId,
                    // 必填，生成签名的时间戳
                    timestamp: nowConfig.timestamp,
                    // 必填，生成签名的随机串
                    nonceStr: nowConfig.nonceStr,
                    // 必填，签名，见附录1
                    signature: nowConfig.signature,
                    // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                    jsApiList: ['previewImage']
                });
            }else{
                that.$Message.error(res.message);                   
            }
        })
    }
}
</script>
<style lang="scss" scoped>
    #container{
        padding-bottom: 1.333rem;
        .content{
            padding:0.5333rem 0.4rem 0;//20px 15px 0;
            .cont-top{
                display: flex;
                font-size:0.3733rem;
                justify-content: space-between;
                align-items: center;
                em{
                    font-size:0.48rem;
                }
            }
            .cont-cont{
                box-shadow: none;
                border:none;
                padding:0;
                .ivu-card-body{
                    .ivu-cell-group{
                        background:#fff;
                        .ivu-cell{
                            border-top:1px solid #ddd;
                            padding-left:0;
                            padding-right:0;
                            .cont_r{
                                input{
                                    border:none;
                                }
                                button{
                                    background: #fff;
                                    border: 1px solid #ccc;
                                    padding:0.1333rem 0.2667rem;// 5px 10px;
                                    margin-left:0.1333rem;
                                    &:nth-child(2){
                                        border-color:#009788;
                                    }
                                }
                                .r_fix{
                                    display:flex;
                                    input{
                                        flex:1;
                                    }
                                    .ivu-dropdown{
                                        flex:1;
                                    }
                                }
                                .ivu-divider-horizontal{
                                    margin:0.1333rem 0;
                                }
                                .r_foot{
                                    text-align:right;
                                    button{
                                        padding: 0 0.1333rem;
                                        &:nth-child(1){
                                            border-color:#009788;
                                        }
                                        &:nth-child(2){
                                            border-color:#fff;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            .cont-img{
                .ivu-collapse-header{
                    i{
                        float:right;
                        margin-right:0;
                    }
                }
            }
            .cont-remark{
                .ivu-form-item{
                    margin-bottom:0.2667rem;
                }
            }
            .cont-foot{
                button{
                    height:1.0667rem;
                    width:100%;
                    font-size:0.3733rem;
                    color:#fff;
                    background:#ed4014;
                    border:none;
                    outline:0;
                    box-shadow:none;
                    border-radius: 4px;
                    &:nth-child(1){
                        margin-bottom:0.2667rem;
                        background:#009788;
                    }
                }
            }
        }
        
    }
</style>
<style>
    .reviewAudite .ivu-form .ivu-form-item-label{
        padding-right: 0;
        text-align: left;
        font-size:0.3733rem;
        color:#727171;
    }
    .reviewAudite .cont .userImg>.ivu-cell-link{
        height:1.3333rem;
        line-height:1.3333rem;
        display: inherit;
    }
    .reviewAudite .ivu-card .ivu-card-body{
        padding:0;
    }
    .reviewAudite .ivu-card .ivu-cell-footer{
        right:0;
    }
    .reviewAudite .ivu-collapse-simple{
        border-bottom:0;
    }
    .reviewAudite .ivu-collapse>.ivu-collapse-item>.ivu-collapse-header{
        padding-left:0;
        font-size:0.3733rem;
    }
    .reviewAudite .ivu-collapse .ivu-collapse-item .ivu-collapse-content img{
        vertical-align: bottom;
        width: 5.333rem;
        height: 5.333rem;
    }
    .reviewAudite .ivu-input,.reviewAudite .ivu-input:hover,.reviewAudite .ivu-input:focus{
        border-color:#dcdee2;
    }
</style>
