module.exports = {
  path:'/order/tradeDetailUncheck.json',
  template:{
    data: {
      shopName: '测试门店（高新区）', // 门店名称
      shopLogo: null, // 门店LOGO地址
      serialNo: '001', // 订单流水号
      peopleCount: 5, // 就餐人数
      tableArea : '大厅区', // 桌台区域名
      tableNo: '001桌', // 桌台号名
      priviledge: false, // 是否使用了优惠
      hideCheckout : true, //  是否展示结算按钮
      orderMetas: [
        {
          name: '小红', // 下单人姓名
          sex : 0, //  性别。-1：没有性别。 0：女， 1：男
          headImage: null, // 微信头像地址。可能不存在这个字段。
          dateTime: 1472439316794, // 下单时间. 毫秒时间戳。
          memo: null, // 备注。 只有主单才会存在此字段。
          priviledgeAmount: 3.0, // 优惠总额。 只有主单才会存在此字段
          status: 1, //  只有主单才会存在此字段
          dishItems: [ // 菜品信息
            {
              dishId : 9,
              dishName : '红烧鸭', // 菜品名称
              num: 1, // 份数
              price: 119, // 菜品总价（变价已经计算在内）
              status: 2, // 菜品状态
              memo: null, //  菜品备注。如果是套餐主菜，不存在这个字段。
              propertyAmount: 2.0, // 变价金额。如果是套餐主菜，不存在这个字段。
              subDishItems: [ // 子菜信息，可能不存在这个字段
                {
                  dishId : 99,
                  dishName : '魔域',
                  num: 1, // 份数
                  memo: null, // 菜品备注
                  propertyAmount: 0.0, // 变价金额
                },
              ],
            },
          ],
        },
        {
          name: '小红', // 下单人姓名
          sex : 0, //  性别。-1：没有性别。 0：女， 1：男
          headImage: null, // 微信头像地址。可能不存在这个字段。
          dateTime: 1472439316794, // 下单时间. 毫秒时间戳。
          memo: null, // 备注。 只有主单才会存在此字段。
          priviledgeAmount: 3.0, // 优惠总额。 只有主单才会存在此字段
          status: 1, //  只有主单才会存在此字段
          dishItems: [ // 菜品信息
            {
              dishId : 9,
              dishName : '红烧鸡', // 菜品名称
              num: 1, // 份数
              price: 119, // 菜品总价（变价已经计算在内）
              status: 2, // 菜品状态
              memo: null, //  菜品备注。如果是套餐主菜，不存在这个字段。
              propertyAmount: 2.0, // 变价金额。如果是套餐主菜，不存在这个字段。
              subDishItems: [ // 子菜信息，可能不存在这个字段
                {
                  dishId : 99,
                  dishName : '魔域',
                  num: 1, // 份数
                  memo: null, // 菜品备注
                  propertyAmount: 0.1, // 变价金额
                },
              ],
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
