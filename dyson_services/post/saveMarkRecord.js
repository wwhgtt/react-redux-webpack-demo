module.exports = {
  path: '/order/saveMarkRecord.json',
  template: {
    data: {
      id: 1, // 这次评分的ID
      sendCoupInfo: '券名称', // 如果送券开关是false，可以直接忽略这个字段.
      coupSendOver: false, // 标识是否券已经送完,  如果送券开关是false, 也可以直接忽略这个字段。
      markSendCoupFlag:false, // 评分送券开关是否打开
    },
    time: 1474284552572,
    code: '200', // code: 70600（这个错误的文案前端需要自己定，不能使用msg） -> 网络原因评分失败; 70601 -> 该订单已评分；706003 -> 当前订单不支持评分
    msg: '其他各种错误',
  },
};
