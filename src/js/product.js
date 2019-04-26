/*
* 分享出的商品详情页面
* */

var Product = {
    isCopied: false,
    shareCommand: null,
    init: function () {
        this.shareCommand = Common.getUrlParam('tcode');

        if (!this.shareCommand) {
            Common.showErrorPage("未找到商品ID, 请退出重试");
            return;
        }

        this.shareCommand = decodeURI(this.shareCommand);

        this.getProductInfo();
    },
    //获取商品信息
    getProductInfo: function() {
        var context = this,
            data = {
                tbkPwd: this.shareCommand
            };

        $.ajax({
            type: 'GET',
            url: "/service/taobao-link/getItemByTbkPwd",
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
        var productImgList = productInfo.smallImages,
            productTitle = productInfo.title,
            discount = productInfo.zkFinalPrice || 0,
            ticketValue = "￥" + discount,
            oldPrice = productInfo.reservePrice,
            newPrice = oldPrice - discount,
            shareCommission = productInfo.commissionRateFee;

        //下载佣金
        $('#shareCommissionValue').html(shareCommission);
        if(shareCommission * 1 > 0) {
            $('.share-commission').removeClass('hide');
        }
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
    initProductSlider: function (productImgListStr) {
        if(!productImgListStr) {
            return this;
        }

        var productImgList = productImgListStr.split(",");

        if(productImgList.length <= 0) {
            return this;
        }

        //初始化幻灯片所需元素
        var html = '';

        for (var i = 0; i < productImgList.length; i++) {
            html += '<div class="swiper-slide">' +
                '       <img src="'+ productImgList[i] +'">' +
                '    </div>';
        }

        $('.swiper-wrapper').html(html);

        //初始化幻灯片控件
        setTimeout(function () {
            new Swiper('.swiper-container', {
                pagination: {
                    el: '.swiper-pagination',
                }
            });
        }, 200);

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