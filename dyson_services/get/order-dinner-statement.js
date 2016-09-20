module.exports = {
  path:'/order/tradeDetail.json',
  template:{
    data:{
      orderSerialNo:'013', // 流水号
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
    },
    time: 1474284552572,
    code: 200,
    msg: '',
  },
};
