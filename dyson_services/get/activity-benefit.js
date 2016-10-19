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
            },
            {
              priId: 2581,
              priName: '满100送鸡蛋汤',
              priType: 1,
            },
          ],
        },
        {
          dishId: 601453,
          dishPriInfo: [
            {
              priId: 2584,
              priName: '满2件减5元',
              priType: 2,
            },
            {
              priId: 2582,
              priName: '满100送鸡蛋汤',
              priType: 1,
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
