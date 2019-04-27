/*
* 授权回调页面
* */
var AuthCallback = {
    uid: null, //uid
    extTime: null, //用户session过期时间
    session: null, //用户session
    state: null, //标志位（实际是细银用户id）
    userId: null, //淘宝id
    userNick: null, //淘宝昵称
    init: function () {
        this.uid = Common.getUrlParamBySharp('taobao_open_uid');
        this.extTime = Common.getUrlParamBySharp('re_expires_in');
        this.session = Common.getUrlParamBySharp('access_token');
        this.state = Common.getUrlParamBySharp('state');
        this.userId = Common.getUrlParamBySharp('taobao_user_id');
        this.userNick = Common.getUrlParamBySharp('taobao_user_nick');
        // alert("uid: " + this.uid);

        if (!this.uid || !this.session || !this.extTime) {
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
                uid: this.uid,
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
                alert(JSON.stringify(res));
                if(res.status != 0) {
                    Common.showErrorPage(res.msg);
                } else {
                    if(res.data && res.data.links && res.data.links.couponShortUrl) {
                        var linkUrl = res.data.links.couponShortUrl;
                        window.location.href = linkUrl;
                    } else {
                        Common.showErrorPage("未找到优惠券信息，请退出重试");
                    }
                }
            },
            error:function(err){
                // alert(JSON.stringify(err));
                Common.showErrorPage("授权失败，请退出重试");
            }
        });
    }
}

AuthCallback.init();