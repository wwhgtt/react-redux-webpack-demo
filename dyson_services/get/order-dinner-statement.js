module.exports = {
  path:'/orderall/tradeTsDetail.json',
  template:{
    data:{
      shopName: '小土豆石方菜菜软件园店',
      shopLogo: 'http://kry-test-2.qiniudn.com/980afeeec2004447a5e72d124ed2186a.jpg?imageView/2/w/512/h/512',
      serialNo:'013', // 流水号
      tradePeopleCount:4, // 人数
      tableArea:'大厅区', // 桌台区域
      tableName:'9号桌', // 桌台
      isMember:true, // 是否会员
      diningForm:0, // 0-正餐，1-快餐
      isInvoice:0, // 是否发票
      carryRuleVO:// 进位规则
      {
        scale:2, // 保留小数点位数
        transferType:1, // 进位规则
      },
      member://
      {
        loginType:0, // 0微信登录 1手机登录
        mobile:15183754822,
        name:'Alex',
        sex:0,
      },
      integral: {
        integral: 9999, // 客户积分账户积分数
        isExchangeCash: 0, // 所在等级是否可抵现 0:是，1:否
        exchangeIntegralValue: 1, // 抵现消耗积分数
        exchangeCashValue: 2, // 抵现金额数
        limitType: 1, // 抵现限制类型 1:无上限，2:积分个数限制 3:金额百分比限制
      },
      dishItems: [ // 菜品信息
        {
          name:'冰激淋',
          id:123456,
          num: 0, // 份数
          price: 20, // 单价
          status: '1', // 菜品状态
          memo: '配料:珠子，葱花|口味:超辣', // 菜品备注
          subDishItems: [ // 子菜信息，可能不存在这个字段
            {
              name:'火爆肥肠',
              id:213232,
              num: 0, // 份数
              price: 10, // 单价
              status: '2', // 菜品状态
              memo: '配料:珠子，葱花|口味:超辣', // 菜品备注
            },
          ],
        },
        {
          name:'冰激淋2',
          id:1234562,
          num: 0, // 份数
          price: 20, // 单价
          status: '1', // 菜品状态
          memo: '配料:珠子，葱花|口味:超辣', // 菜品备注
        },
      ],
    },
    time: 1474284552572,
    code: 200,
    msg: '',
  },
};
