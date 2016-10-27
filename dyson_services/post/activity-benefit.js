module.exports = {
  path:'/marketplan/dishPrivilegeList.json',
  template:{
    data: {
      dishPriList: [
        {
          dishId: 474003, // 菜品brandID
          dishPriInfo: [
            {
              priId: 2583, // 优惠ID
              priName: '可享受8折', // 优惠名称
              priType: 1, // 优惠类型（1单商品营销方案2礼品券）
              type:1, // 规则类型 1立减 ，2折扣
              dishNum:2, // 满减份数
              reduce:null, // 减免金额
              discount: 8, // 折扣
            },
            {
              priId: 2581,
              priName: '满100赠送',
              priType: 2,
              fullValue:0, // 折扣
            },
          ],
        },
        {
          dishId: 25,
          dishPriInfo: [
            {
              priId: 2584, // 优惠ID
              priName: 'zhe', // 优惠名称
              priType: 1, // 优惠类型（1单商品营销方案2礼品券）
              type:2, // 规则类型 1立减 ，2折扣
              dishNum:1, // 满减份数
              reduce:null, // 减免金额
              discount: 5, // 折扣
            },
            {
              priId: 2585,
              priName: '满100赠送',
              priType: 2,
              fullValue:0,
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
