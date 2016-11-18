module.exports = {
  path:'/queue/info.json',
  template:{
    code: 200,
    msg:'',
    data: {
      shopId:247900001, // 门店ID
      shopName:'南粉北面南粉北面高攀路店面', // 门店名称
      shopLogo:'http://kry-test-2.qiniudn.com/5e9008fc4e9143e1b0e28fe60ec87470.png?imageView/2/w/512/h/512', // 门店logo
      openStatus:'营业中', // 营业状态
      orderId:null, // 订单ID
      queueTip:false, // 是否已排队
      name:'啦啦啦并发布大风', // 姓名
      sex:0, // 性别
      mobile:13980691506, // 手机
      queRecord:0, // 排队数
      queList:
      [
        {
          queueName:'队列A', // 队列名称
          count:0, // 等位数
          maxNum:null, // 当前排队号
          queueLineId:10887, // 门店排队ID
          minPersonCount:1, // 队列最小就餐人数
          maxPersonCount:1, // 队列最大就餐人数, 为0表示无上限
        },
        {
          queueName:'队列B',
          count:0,
          maxNum:null,
          queueLineId:10888,
          minPersonCount:5,
          maxPersonCount:10,
        },
        {
          queueName:'队列A', // 队列名称
          count:0, // 等位数
          maxNum:null, // 当前排队号
          queueLineId:10322387, // 门店排队ID
          minPersonCount:1, // 队列最小就餐人数
          maxPersonCount:1, // 队列最大就餐人数, 为0表示无上限
        },
        {
          queueName:'队列B',
          count:0,
          maxNum:null,
          queueLineId:102328,
          minPersonCount:5,
          maxPersonCount:10,
        },
        {
          queueName:'队列A', // 队列名称
          count:0, // 等位数
          maxNum:null, // 当前排队号
          queueLineId:1232332387, // 门店排队ID
          minPersonCount:1, // 队列最小就餐人数
          maxPersonCount:1, // 队列最大就餐人数, 为0表示无上限
        },
        {
          queueName:'队列B',
          count:0,
          maxNum:null,
          queueLineId:10234248,
          minPersonCount:5,
          maxPersonCount:10,
        },
      ],
      maxPersonNum:1, // 最大人数限制
      hasQLine:true, // 是否配置队列
      shopOpenStatus:true, //是否营业状态
    },
  },
};
