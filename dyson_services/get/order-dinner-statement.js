module.exports = {
  path:'/orderall/tradeTsDetail.json',
  template:{
    data:{
      shopName: '小土豆石方菜菜软件园店',
      shopLogo: 'http://kry-test-2.qiniudn.com/980afeeec2004447a5e72d124ed2186a.jpg?imageView/2/w/512/h/512',
      serialNo:'013', // 流水号
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
      dishItems:[
        {
          id: 599385,  // 菜品id
          brandDishId:87687887,
          unitName:'碗',
          name: '宫保鸡丁', // 菜品名称
          marketPrice: 35.02, // 金额
          num: 2, // 份量
          type: 0, // 菜品类型 1 套餐 0单菜
          propertyTypeList:[],
          dishIngredientInfos:[],
        },
        {
          id: 61,  // 菜品id
          name: '火爆肥肠', // 菜品名称
          brandDishId:876878827,
          marketPrice: 30.02, // 金额
          num: 2, // 份量
          unitName:'碗',
          type: 0, // 菜品类型 1 套餐 0单菜
          propertyTypeList: [
            {
              name: '容量', // 口味做法名称
              type: 4,
              properties: [
                {
                  id: 1, // 属性id
                  name: '中杯', // 属性名称
                  reprice: 1.5,  // 变价
                },
                {
                  id: 2,
                  name: '中杯',
                  reprice: 1.5,
                },
              ],
            },
            {
              name: '做法', // 口味做法名称
              type: 1,
              properties: [
                {
                  id: 3, // 属性id
                  name: '狂暴', // 属性名称
                  reprice: 1.5,  // 变价
                },
                {
                  id: 4,
                  name: '腊肉',
                  reprice: 1.5,
                },
              ],
            },
          ],
          dishIngredientInfos: [
            {
              id: 1, // 配料id
              name: '豆沙', // 配料名称
              reprice: 1.5, // 变价
            },
            {
              id: 3, // 配料id
              name: '豆沙包', // 配料名称
              reprice: 1.5, // 变价
            },
          ],
        },
        {
          id: 5747203,  // 菜品id
          name: '套餐', // 菜品名称
          marketPrice: 30.02, // 金额
          brandDishId:876878870,
          num: 2, // 份量
          type: 1, // 菜品类型 1 套餐 0单菜
          unitName:'份',
          subDishItems: [
            {
              groupId:123, // 分组id
              itemId: 574470,
              name: '宫保鸡丁1',
              marketPrice: 23.02,
              num: 10,
              propertyTypeList: [
                {
                  name: '容量', // 口味做法名称
                  type: 4,
                  properties: [
                    {
                      id: 1, // 属性id
                      name: '中杯', // 属性名称
                      reprice: 1.5,  // 变价
                    },
                    {
                      id: 2,
                      name: '中杯',
                      reprice: 1.5,
                    },
                  ],
                },
                {
                  name: '做法', // 口味做法名称
                  type: 1,
                  properties: [
                    {
                      id: 3, // 属性id
                      name: '狂暴', // 属性名称
                      reprice: 1.5,  // 变价
                    },
                    {
                      id: 4,
                      name: '腊肉',
                      reprice: 1.5,
                    },
                  ],
                },
              ],
              dishIngredientInfos: [
                {
                  id: 1, // 配料id
                  name: '豆沙', // 配料名称
                  reprice: 1.5, // 变价
                },
                {
                  id: 3, // 配料id
                  name: '豆沙包', // 配料名称
                  reprice: 1.5, // 变价
                },
              ],
            },
            {
              groupId:1232, // 分组id
              itemId: 5744270,
              name: '宫保鸡丁2',
              marketPrice: 23.02,
              num: 10,
              propertyTypeList: [
                {
                  name: '容量', // 口味做法名称
                  type: 4,
                  properties: [
                    {
                      id: 1, // 属性id
                      name: '中杯', // 属性名称
                      reprice: 1.5,  // 变价
                    },
                    {
                      id: 2,
                      name: '中杯',
                      reprice: 1.5,
                    },
                  ],
                },
                {
                  name: '做法', // 口味做法名称
                  type: 1,
                  properties: [
                    {
                      id: 3, // 属性id
                      name: '狂暴', // 属性名称
                      reprice: 1.5,  // 变价
                    },
                    {
                      id: 4,
                      name: '腊肉',
                      reprice: 1.5,
                    },
                  ],
                },
              ],
              dishIngredientInfos: [
                {
                  id: 1, // 配料id
                  name: '豆沙', // 配料名称
                  reprice: 1.5, // 变价
                },
                {
                  id: 3, // 配料id
                  name: '豆沙包', // 配料名称
                  reprice: 1.5, // 变价
                },
              ],
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
