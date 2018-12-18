/*
* 注册页面
* */
var CLS_DISABLED = 'disabled';
var MAX_COUNT_DOWN = 10;

var Register = {
    inviteCode: null,
    init: function () {
        this.inviteCode = Common.getUrlParam('invitecode');

        if (!this.inviteCode) {
            Common.showErrorPage("未找到邀请码, 请退出重试或联系客服");
            return;
        }

        this.setInviteCode(this.inviteCode);

        //调用监听
        this.monitor();
    },
    //设置邀请码
    setInviteCode: function(inviteCode) {
        $('#inviteCode').html(inviteCode);
    },
    //防止页面刷新倒计时失效
    /**
     * 获取验证码按钮
     */
    monitor: function() {
        var LocalDelay = this.getLocalDelay();
        if(LocalDelay.time!=null){
            var timeLine = parseInt((new Date().getTime() - LocalDelay.time) / 1000);
            if (timeLine > LocalDelay.delay) {
                console.log("过期");
                $('#send').html("获取验证码");
                $('#send').removeClass(CLS_DISABLED);
            } else {
                var _delay = LocalDelay.delay - timeLine;
                $('#send').html("重新发送("+_delay+")");
                $('#send').addClass(CLS_DISABLED);
                var timer = setInterval(function() {
                    if (_delay > 1) {
                        _delay--;
                        $('#send').html("重新发送("+_delay+")");
                        Register.setLocalDelay(_delay);
                    } else {
                        clearInterval(timer);
                        $('#send').html("获取验证码");
                        $('#send').removeClass(CLS_DISABLED);
                    }
                }, 1000);
            }
        } else {
            $('#send').html("获取验证码");
            $('#send').removeClass(CLS_DISABLED);
        }
    },
    /**
     * 验证码倒计时
     */
    countDown: function(callback) {
        if ($('#send').html() == "获取验证码") {
            var _delay = MAX_COUNT_DOWN;
            var delay = _delay;
            $('#send').html("重新发送("+_delay+")");

            $('#send').addClass(CLS_DISABLED);

            var timer = setInterval(function() {
                if (delay > 1) {
                    delay--;
                    $('#send').html("重新发送("+delay+")");
                    Register.setLocalDelay(delay);
                } else {
                    clearInterval(timer);
                    $('#send').html("获取验证码");
                    $('#send').removeClass(CLS_DISABLED);
                }
            }, 1000);

            callback && callback();
        } else {
            return false;
        }
    },
    //设置setLocalDelay
    setLocalDelay: function(delay) {
        //location.href作为页面的唯一标识，可能一个项目中会有很多页面需要获取验证码。
        sessionStorage.setItem("delay_" + location.href, delay);
        sessionStorage.setItem("time_" + location.href, new Date().getTime());
    },
    getLocalDelay: function() {
        var LocalDelay = {};
        LocalDelay.delay = sessionStorage.getItem("delay_" + location.href);
        LocalDelay.time = sessionStorage.getItem("time_" + location.href);
        return LocalDelay;
    },
    //发送验证码
    sendVerifyCode: function () {
        this.countDown(function () {
            Common.toast("验证码发送成功");
        });
    },
    //提交注册
    onSubmit: function () {
        if(!this.isPhoneNumValid()) {
            return;
        }

        $("#registerForm").submit(function(e){
            $.ajax({
                url:"/WebTest/test/testJson.do",
                data:$('#registerForm').serialize(),
                dataType:"json",
                error:function(data){
                    alert(data);
                },
                success:function(data){
                    alert(data);
                }
            });
        });
    },
    //校验手机号是否合法
    isPhoneNumValid: function() {
        var phonenum = $("#phone").val();
        var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;

        if(!myreg.test(phonenum)){
            Common.toast('请输入有效的手机号码！');
            return false;
        }

        return true;
    }
}

Register.init();