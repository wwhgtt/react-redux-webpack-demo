module.exports = {
  path: '/queue/success.json',
  template: {
    code: '200',
    msg: '',
    data: {
      queue: {
        queueID: 1002040711, // 排队Id
        commercialID: 247900002, // 门店Id
        queueStatus: 0,          // 排队状态0:排队中;1:入场;-1作废;-2取消
        mobile: 15928868725,  // 电话号码
        isZeroOped: 0, // 是否清零 和queueStatus一起判断是否取消 -1表示清零
        repastPersonCount:3, //就餐人数
      },
      count: 1,         // 等位数
      queueNumber: 'N006', // 排队编号
      hasOrder: 0, // 是否有预点菜
      openType : 'SM', // 排队方式
      ql: {
        id: 3716,
        brandId: 2479, // 品牌id
        commercialId: 247900002, // 门店id
        queueChar: 'A', // 排队代号
        queueName: 'A', // 队列名称
        minPersonCount: 1, // 队列包含最小人数
        maxPersonCount: 4, // 队列包含最大人数
      },
      shopId: 247900002,
      weixinConfigUrl: '', // 进入公众号地址
      orderDish: 0, // 是否开通预点菜 0开通
    },
  },
};
