module.exports = {
  path:'/marketplan/dishPrivilegeList.json',
  template:{
    data: {
      dishPriList: [
        {
          dishId: 599384, // 菜品ID
          dishPriInfo: [
            {
              priId: 2583, // 优惠ID
              priName: '满2件减5元', // 优惠名称
              priType: 2, // 优惠类型（1单商品营销方案2礼品券）
              priAmount: 5.0, // 优惠后金额
            },
            {
              priId: 2581,
              priName: '满100送鸡蛋汤',
              priType: 1,
              priAmount: 0,
            },
          ],
        },
        {
          dishId: 601453,
          dishPriInfo: [
            {
              priId: 2583,
              priName: '满2件减5元',
              priType: 2,
              priAmount: 5.0,
            },
            {
              priId: 2581,
              priName: '满100送鸡蛋汤',
              priType: 1,
              priAmount: 0,
            },
          ],
        },
      ],
    },
    time: 1474284552572,
    code: 200,
    msg: '',
  },
};
