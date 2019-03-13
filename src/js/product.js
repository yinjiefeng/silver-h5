/*
* 分享出的商品详情页面
* */

//dev
// var ServerAddress = "http://192.168.0.103:19080";
//prod
var ServerAddress = "";

var Product = {
    productId: null,
    isCopied: false,
    shareCommand: null,
    init: function () {
        this.productId = Common.getUrlParam('pid');

        if (!this.productId) {
            Common.showErrorPage("未找到商品ID, 请退出重试");
            return;
        }

        this.initProductInfo();
    },
    //获取商品信息
    getProductInfo: function() {
        var context = this,
            data = {
                pid: this.productId
            };

        $.ajax({
            type: 'POST',
            url: ServerAddress + "/service/user/qrcodeRegister",
            data: data,
            dataType:"json",
            success:function(res){
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
    },
    //初始化商品信息
    initProductInfo: function(productInfo) {
        var productImgList = [{
                url: "https://www.swiper.com.cn/demo/img/sport1.jpg"
            },{
                url: "https://www.swiper.com.cn/demo/img/sport2.jpg"
            },{
                url: "https://www.swiper.com.cn/demo/img/sport3.jpg"
            }],
            productTitle = "无限运动无限运动无限运动无限运动无限运动无限运动无限运动无限运动无限运动无限运动无限运动无限运动无限运动无限运动",
            discount = 10,
            ticketValue = "￥" + discount,
            oldPrice = 89,
            newPrice = oldPrice - discount;

        this.shareCommand = "Abcd90132SADSsad";

        //标题
        $('.sp-title').html(productTitle);
        //折扣
        $('.ticket-value').html(ticketValue);
        //原价
        $('.old-price').html("原价" + oldPrice);
        //折后价
        $('.new-price').html(newPrice);
        //商品口令
        $('.sp-code').html(this.shareCommand);

        this.initProductSlider(productImgList).bindEvents();
        //初始化结束，显示内容
        $('.silver-product').removeClass('hide');
    },
    //初始化商品幻灯片
    initProductSlider: function (productImgList) {
        if(!productImgList || productImgList.length <= 0) {
            return this;
        }
        //初始化幻灯片所需元素
        var html = '';

        for (var i = 0; i < productImgList.length; i++) {
            html += '<div class="swiper-slide">' +
                '       <img src="'+ productImgList[i].url +'">' +
                '    </div>';
        }

        $('.swiper-wrapper').html(html);

        //初始化幻灯片控件
        new Swiper('.swiper-container', {
            pagination: {
                el: '.swiper-pagination',
            }
        });

        return this;
    },
    //初始化事件
    bindEvents: function () {
        var context = this;
        //复制按钮事件
        $('.silver-product').delegate('.sp-copy', 'click', function () {
            if(!Product.isCopied) {
                $(this).html("复制成功，打开「淘宝」购买");
                context.copyText();
                Product.isCopied = true;
            }
        });
    },
    copyText: function(){
        var save = function(e){
            e.clipboardData.setData('text/plain', Product.shareCommand);
            e.preventDefault();
        }
        document.addEventListener('copy', save);
        document.execCommand('copy');
        document.removeEventListener('copy',save);
        // alert('复制成功！');
    }
}

Product.init();