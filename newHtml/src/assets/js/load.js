function isLoading(window,text){
    let that = window;
    that.$Spin.show({
        render: (h) => {
            return h('div', [
                // h('Icon', {
                //     'class': 'demo-spin-icon',
                //     props: {
                //         type: 'ios-loading',
                //         size: 24,
                //         color:'#666666'
                //     }
                // }),
                h('img',{style:{width:'1.5rem',height:'1.5rem','verticalCenter':'bottom'},class:'loading',domProps:{
                    src:require('@/assets/images/loading1.gif')
                }}),
                h('div',{style:{color:'#009788',fontSize:'14px'}}, text)
            ])
        }
    });   
}

export {isLoading};