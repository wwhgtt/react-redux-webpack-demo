module.exports = {
  path: '/order/takeOutDetail.json',
  template: {
    data: {
      shopName: '小土豆石方菜菜(小土豆石方菜菜软件园店E区)',
      shopLogo: 'http://kry-test-2.qiniudn.com/2ee7d73b3d1641a48ec5f15ad2864a39.jpg?imageView/2/w/512/h/512',
      serialNo: '1654', // 订单流水号
      peopleCount: 76, // 人数
      carryRuleAmount: 4,
      dateTime: 1478932971075, // 下单时间
      tradeAmount: 97, // 订单应付金额
      tradePrivilegeAmount: -5,  // 订单总的优惠金额
      businessType:1, // 1: 快餐 3：正餐
      orderNumber: '302161109194026000001', // 订单编号
      address: '天府大道法师打发斯蒂芬阿斯顿发生大幅度发', // 配送地址 （前端直接展示）
      expectTime: '2015-3-3 10:01:01', // 期望时间 （前端直接展示）
      deliveryFee: 5.0, // 配送费
      mobile: '15578787788', // 手机
      name: 'Alex', // 姓名
      tradeFailReason: '理由哟',
      memo:'大方的说法是对方付阿萨德发送到发送到发送到分阿萨德法师打发', // 订单备注
      invoiceTitle: '', // 发票抬头
      tableArea: '大厅区', // 桌台区域
      tradePayForm: 1, // 1: 线下支付，3：在线支付
      tableNo: '23', // 桌台号
      sex: 0,
      payModId: -1, // （该字段可能不存在） 支付方式 -1: 会员卡, -3: 现金, -4: 银行卡, -5: 微信支付, -7: 百度钱包
      url: '', // 直发券地址
      tradePrivileges: [{
        privilegeType: 6, // 4: 优惠券及活动 5：积分优惠 6：会员优惠 -100： 其它优惠 -101：礼品券
        privilegeAmount: 5, // 金额
        privilegeName: '会员优惠',
      },
      {
        privilegeType: 5,
        privilegeAmount: 5,
        privilegeValue: 100, // 积分数
        privilegeName: '积分抵扣',
      },
      {
        privilegeType: 4,
        privilegeAmount: 5,
        privilegeName: '优惠券及活动',
      },
      {
        privilegeType: -100,
        privilegeAmount: 5,
        privilegeName: '其他优惠',
      },
      {
        privilegeType: -101,
        privilegeAmount: 5,
        privilegeValue: 101, // 积分数
        privilegeName: '布娃娃',
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
      status: '订单支付失败',
    },
    time: 1472436273622,
    code: '200',
    msg: '',
  },
};
