module.exports = {
  path:'/queue/info.json',
  template:{
    code: 200,
    msg:'',
    data: {
      shopId:247900001, // 门店ID
      shopName:'南粉北面南粉北面高攀路店面', // 门店名称
      shopLogo:'http://img.keruyun.net/791e5ca029eb15f34ad7aa80e1111fae.png', // 门店logo
      openStatus:'营业中', // 营业状态
      orderId:null, // 订单ID
      queueTip:false, // 是否已排队
      name:'啦啦啦', // 姓名
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
          maxPersonCount:4, // 队列最大就餐人数, 为0表示无上限
        },
        {
          queueName:'队列B',
          count:0,
          maxNum:null,
          queueLineId:10888,
          minPersonCount:5,
          maxPersonCount:10,
        },
      ],
      maxPersonNum:12, // 最大人数限制
      hasQLine:true, // 是否配置队列
      shopOpenStatus:true, //是否营业状态
    },
  },
};
