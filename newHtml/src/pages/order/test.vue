

<template>
  <div class="hello">
    <Button @click="handleRender">实例化使用方法</Button>
  </div></template>
  <script>

                                                            that.$Modal.confirm({
                                                                scrollable:false,
                                                                render: (h) => {
                                                                    return h('div',{class:'model-cont'},[
                                                                        h('div',{class:'model-title','style':{textAlign:'right',marginBottom:'0.2667rem'}},[
                                                                            h('span',
                                                                                {style:{color:'#DF8D15',fontSize:'0.3733rem',float:'left'}}, '修改快递'),
                                                                            h('i',{class:'iconfont icon-close-btn',on: {click: () => {
                                                                                that.$Modal.remove();}}
                                                                            })
                                                                        ]),
                                                                        h('div',{class:'model-content'},[
                                                                            that.courierList.map((ite,inde) =>{
                                                                            return h('div',{class:'content-list'},[
                                                                                   h('p',{style:{fontSize:'0.3733rem',display:'flex'}},[
                                                                                        h('span','快递名称:'),
                                                                                        h('Dropdown',{style:{flex:'1'},props:{trigger:'click'}},[//trigger="custom" :visible="visible"
                                                                                            h('a',{style:{borderBottom:'1px solid #dcdee2'},props:{},attrs:{href:'javascript:void(0)'}},[
                                                                                                h('span',ite.DeliverName),
                                                                                                h('Icon',{props:{type: 'ios-arrow-down'}})
                                                                                            ]),
                                                                                            h('DropdownMenu',{slot:'list'},that.courierData.map((item,index) =>{
                                                                                                return h('DropdownItem',{props:{name:item.Abbreviation,key:index,selected:item.Abbreviation == ite.Abbreviation ? true : false},nativeOn:{'click':() =>{//大坑 //https://www.jianshu.com/p/034afd50ac21 
                                                                                                    ite.Abbreviation = item.Abbreviation;
                                                                                                    ite.DeliverName = item.Title;
                                                                                                }}},item.Title)
                                                                                            }))
                                                                                        ])
                                                                                    ]),
                                                                                    h('p',{style:{fontSize:'0.3733rem',display:'flex'}},[
                                                                                        h('span','快递单号:'),
                                                                                        h('Input',{style:{outline:0,boxShadow:'none',borderColor:'#dcdee2',flex:'1'},props: {autofocus: true,placeholder: '请输入快递单号',type:'text',value:ite.StampNumber},on: {input: (val) => {
                                                                                                ite.StampNumber = val;
                                                                                            }
                                                                                        }})
                                                                                    ])
                                                                                ])
                                                                            })    
                                                                        ]),
                                                                        h('div',{class:'model-foot','style':{textAlign:'right',marginTop:'0.2667rem'}},[
                                                                            h('Button', {'style':{boxShadow:'none',background: '#009788',borderColor:'#009788'},props: {type: 'primary'},on: {click:()=>{that.$Modal.remove();}}},'关闭')
                                                                            // h('Button', {'style':{boxShadow:'none',borderColor:'#dcdee2',marginRight:'0.1333rem'},on: {click:()=>{that.$Modal.remove();}}},'取消'),
                                                                            // h('Button', {'style':{boxShadow:'none',background: '#009788',borderColor:'#009788'},props: {type: 'primary'},on: {click:()=>{
                                                                            //     isLoading(that,'快递更新中···')
                                                                                
                                                                            // } }},'确定')
                                                                        ])
                                                                    ]

                                                                    )
                                                                } 
                                                            })

  </script>
  <style scoped></style>
