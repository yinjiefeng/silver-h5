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
    init: function () {
        this.productId = Common.getUrlParam('pid');

        if (!this.productId) {
            Common.showErrorPage("未找到商品信息, 请退出重试");
            return;
        }
    }
}

Product.init();