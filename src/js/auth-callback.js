/*
* 授权回调页面
* */
var AuthCallback = {
    extTime: null, //用户session过期时间
    session: null, //用户session
    state: null, //标志位（实际是细银用户id）
    userId: null, //淘宝id
    userNick: null, //淘宝昵称
    init: function () {
        this.extTime = Common.getUrlParam('ext_time');
        this.session = Common.getUrlParam('session');
        this.state = Common.getUrlParam('state');
        this.userId = Common.getUrlParam('user_id');
        this.userNick = Common.getUrlParam('user_nick');

        if (!this.session || !this.extTime) {
            Common.showErrorPage("授权失败，请退出重试");
            return;
        }
        //注册渠道
        this.registryTaobao();
    },
    //注册渠道, 成功直接跳转到优惠券领取页面
    registryTaobao: function() {
        var context = this,
            data = {
                extTime: this.extTime,
                session: this.session,
                state: this.state,
                userId: this.userId,
                userNick: this.userNick
            };

        $.ajax({
            type: 'GET',
            url: "/service/taobao-relation/registry",
            data: data,
            dataType:"json",
            success: function(res){
                console.log(res);
                if(res.status != 0) {
                    Common.showErrorPage(res.msg);
                } else {
                    context.initProductInfo(res.data);
                }
            },
            error:function(){
                Common.showErrorPage("未找到商品信息, 请退出重试");
            }
        });
    }
}

AuthCallback.init();