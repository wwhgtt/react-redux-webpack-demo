module.exports = {
  path:'/order/orderallDetail.json',
  template:{
    data: {
      shopName: '小土豆石方菜菜(小土豆石方菜菜软件园店E区)',
      shopLogo: 'http://kry-test-2.qiniudn.com/2ee7d73b3d1641a48ec5f15ad2864a39.jpg?imageView/2/w/512/h/512',
      serialNo: '1654', // 订单流水号
      peopleCount: 76, // 人数
      dateTime: 1478691626409, // 下单时间
      tradeAmount: 97, // 订单应付金额
      tradePrivilegeAmount: -5,  // 订单总的优惠金额
      businessType:1, // 1: 快餐 3：正餐
      orderNumber: '302161109194026000001', // 订单编号
      memo:'xxoo', // 订单备注
      invoiceTitle: '', // 发票抬头
      tableArea: '大厅区', // 桌台区域
      tableNo: '23', // 桌台号
      payModId: -1, // （该字段可能不存在） 支付方式 -1: 会员卡, -3: 现金, -4: 银行卡, -5: 微信支付, -7: 百度钱包
      url: '', // 直发券地址
      tradePrivileges: [{
        privilegeType: 6,
        privilegeAmount: 5,
        privilegeName: '会员优惠',
      }],
      extraFee: [
        {
          privilegeType: 6,
          privilegeAmount: 5,
          privilegeName: '茶位费',
        },
        {
          privilegeType: 6,
          privilegeAmount: -5,
          privilegeName: '抽纸费',
        },
      ], // 附加费. 字段与tradePrivileges的一样
      dishItems: [{
        dishId: 0,
        dishName: '水煮牛肉和虾/份',
        num: 1,
        price: 102,
        subDishItems: [{
          dishId: 0,
          dishName: '套餐菜虾/份',
          num: 1,
          propertyAmount: 0,
        }],
      }],
      status: '待确认',
    },
    time: 1472436273622,
    code: '200',
    msg: '',
  },
};
