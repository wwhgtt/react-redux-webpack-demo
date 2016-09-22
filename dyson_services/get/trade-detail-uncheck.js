module.exports = {
  path:'/order/tradeDetailUncheck.json',
  template:{
    data: {
      shopName: '测试门店（软件园）', // 门店名称
      shopLogo: '', // 门店LOGO地址
      serialNo: '012', // 订单流水号
      peopleCount: 5, // 就餐人数
      tableNo: '123', // 桌台号
      priviledge: false, // 是否使用了优惠
      checkout : false, //  能否结算
      orderMetas: [
        {
          name: '小红', // 下单人姓名
          headImage: null, // 微信头像地址。可能不存在这个字段。
          dateTime: '13:54', // 下单时间。
          memo: null, // 备注
          dishItems: [ // 菜品信息
            {
              dishId : 9,
              dishName : '红烧鸭', // 菜品名称
              num: 1, // 份数
              price: 159.99, // 单价
              status: 1, // 菜品状态
              memo: '红烧鸭的备注', // 菜品备注
              subDishItems: [ // 子菜信息，可能不存在这个字段
                {
                  dishId : 9,
                  dishName : '红糖糍粑',
                  num: 1, // 份数
                  price: 12, // 单价
                  status: null, // 菜品状态
                  memo: '备注：好吃哟', // 菜品备注
                },
                {
                  dishId : 99,
                  dishName : '南瓜饼',
                  num: 1, // 份数
                  price: 15, // 单价
                  status: null, // 菜品状态
                  memo: null, // 菜品备注
                },
              ],
            },
            {
              dishId : 91,
              dishName : '干煸茄子', // 菜品名称
              num: 2, // 份数
              price: 10, // 单价
              status: 2, // 菜品状态
              memo: '干煸茄子的备注', // 菜品备注
            },
            {
              dishId : 101,
              dishName : '清蒸鲤鱼', // 菜品名称
              num: 1, // 份数
              price: 139, // 单价
              status: 3, // 菜品状态
              memo: '', // 菜品备注
            },
          ],
        },
        {
          status: 2,
          discount: 12.2,
          priviledgeAmount: 11,
          memo: '备注哈dfasdfadf',
          chekcout: false,
          dishItems: [ // 菜品信息
            {
              dishId : 9,
              dishName : '红烧鸭', // 菜品名称
              num: 1, // 份数
              price: 159.99, // 单价
              memo: '红烧鸭的备注', // 菜品备注
              subDishItems: [ // 子菜信息，可能不存在这个字段
                {
                  dishId : 9,
                  dishName : '红糖糍粑',
                  num: 1, // 份数
                  price: 12, // 单价
                  memo: '备注：好吃哟', // 菜品备注
                },
                {
                  dishId : 99,
                  dishName : '南瓜饼',
                  num: 1, // 份数
                  price: 15, // 单价
                  memo: null, // 菜品备注
                },
              ],
            },
            {
              dishId : 91,
              dishName : '干煸茄子', // 菜品名称
              num: 2, // 份数
              price: 10, // 单价
              memo: '干煸茄子的备注', // 菜品备注
            },
          ],
        },
      ],
    },
    time: 1472439316794,
    code: '200',
    msg: '',
  },
};
