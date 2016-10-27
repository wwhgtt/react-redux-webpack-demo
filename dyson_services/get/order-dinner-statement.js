module.exports = {
  path:'/orderall/settlement4Dinner.json',
  template:{
    data:{
      shopName: '小土豆石方菜菜软件园店',
      shopLogo: 'http://kry-test-2.qiniudn.com/980afeeec2004447a5e72d124ed2186a.jpg?imageView/2/w/512/h/512',
      serialNo:'013', // 流水号
      peopleCount:4, // 人数
      tableArea:'大厅区', // 桌台区域
      tableName:'9号桌', // 桌台
      isMember:true, // 是否会员
      hasPriviledge:true,
      priviledgeAmount:4604.29,
      diningForm:0, // 0-正餐，1-快餐
      isInvoice:1, // 是否发票
      carryRuleVO:// 进位规则
      {
        scale:2, // 保留小数点位数
        transferType:1, // 进位规则
      },
      addPrivilege:[
        {
          privilegeType: 12, // 类型
          privilegeName: '茶水费', // 附加费名称
          privilegeAmount: 2.5,  // 附加费金额
        },
        {
          privilegeType: 12,
          privilegeName: '服务费',
          privilegeAmount: 5,
        },
      ],
      privileges: [
        {
          id: 1962424,
          tradeId: 3508495,
          tradeUuid: '318a691d84ca4ef9811d28361f110754',
          privilegeType: 6, // 优惠类型：1:DISCOUNT:手动折扣
          privilegeValue: 2, // 优惠值
          privilegeAmount:12, // 优惠金额，销售时为负数，退货时为正数
          promoId: 16859, // 优惠活动或者优惠券id,如果没有优惠活动，会为空
          deviceIdenty: 'e0:76:d0:28:36:21',
          uuid: '5ebfb858628b41b4a60518cc373514ed',
          statusFlag: 1, // 是否有效，1 有效，2 无效
          privilegeName: '米饭每碗2元参与折扣', // 优惠类型名称
        },
        {
          id: 1962424,
          tradeId: 3508495,
          tradeUuid: '318a691d84ca4ef9811d28361f110754',
          privilegeType: 4, // 优惠类型：1:DISCOUNT:手动折扣
          privilegeValue: 2, // 优惠值
          privilegeAmount: 32, // 优惠金额，销售时为负数，退货时为正数
          promoId: 16859, // 优惠活动或者优惠券id,如果没有优惠活动，会为空
          deviceIdenty: 'e0:76:d0:28:36:21',
          uuid: '5ebfb858628b41b4a60518cc373514ed',
          statusFlag: 1, // 是否有效，1 有效，2 无效
          privilegeName: '米饭每碗2元参与折扣', // 优惠类型名称
        },
        {
          id: 1962424,
          tradeId: 3508495,
          tradeUuid: '318a691d84ca4ef9811d28361f110754',
          privilegeType: 5, // 优惠类型：1:DISCOUNT:手动折扣
          privilegeValue: 2, // 优惠值
          privilegeAmount: 22, // 优惠金额，销售时为负数，退货时为正数
          promoId: 16859, // 优惠活动或者优惠券id,如果没有优惠活动，会为空
          deviceIdenty: 'e0:76:d0:28:36:21',
          uuid: '5ebfb858628b41b4a60518cc373514ed',
          statusFlag: 1, // 是否有效，1 有效，2 无效
          privilegeName: '米饭每碗2元参与折扣', // 优惠类型名称
        },
        {
          id: 1962424,
          tradeId: 3508495,
          tradeUuid: '318a691d84ca4ef9811d28361f110754',
          privilegeType: -100, // 优惠类型：1:DISCOUNT:手动折扣
          privilegeValue: 2, // 优惠值
          privilegeAmount: 22, // 优惠金额，销售时为负数，退货时为正数
          promoId: 16859, // 优惠活动或者优惠券id,如果没有优惠活动，会为空
          deviceIdenty: 'e0:76:d0:28:36:21',
          uuid: '5ebfb858628b41b4a60518cc373514ed',
          statusFlag: 1, // 是否有效，1 有效，2 无效
          privilegeName: '米饭每碗2元参与折扣', // 优惠类型名称
        },
      ],
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
          id: 56,
          name: '火爆肥肠1',
          brandDishId: 25,
          type: 0,
          marketPrice: 25,
          num: 1,
          unitName: '份',
          propertyTypeList: [
            {
              name: '做法类别1',
              type: 1,
              properties: [
                {
                  id: 126203,
                  name: '做法类别1做法名称6',
                  reprice: -0.01,
                },
              ],
            },
          ],
          dishIngredientInfos: [],
        },
        {
          id: 56,
          name: '火爆肥肠1',
          brandDishId: 25,
          type: 0,
          marketPrice: 25,
          num: 1,
          unitName: '份',
          propertyTypeList: [
            {
              name: '做法类别1',
              type: 1,
              properties: [
                {
                  id: 126203,
                  name: '做法类别1做法名称62222',
                  reprice: -0.01,
                },
              ],
            },
          ],
          dishIngredientInfos: [],
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
                  name: '中杯22', // 属性名称
                  reprice: 1.5,  // 变价
                },
                {
                  id: 2,
                  name: '中杯22',
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
                  name: '狂暴22', // 属性名称
                  reprice: 1.5,  // 变价
                },
                {
                  id: 4,
                  name: '腊肉22',
                  reprice: 1.5,
                },
              ],
            },
          ],
          dishIngredientInfos: [
            {
              id: 1, // 配料id
              name: '豆沙22', // 配料名称
              reprice: 1.5, // 变价
            },
            {
              id: 3, // 配料id
              name: '豆沙包222', // 配料名称
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
        {
          id: 5747203,  // 菜品id
          name: '套餐', // 菜品名称
          marketPrice: 30.02, // 金额
          brandDishId:876878870,
          num: 3, // 份量
          type: 1, // 菜品类型 1 套餐 0单菜
          unitName:'份',
          subDishItems: [
            {
              groupId:123, // 分组id
              itemId: 574470,
              name: '宫保鸡丁3',
              marketPrice: 23.02,
              num: 12,
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
              name: '宫保鸡丁4',
              marketPrice: 23.02,
              num: 100,
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
    code: '200',
    msg: '',
  },
};
