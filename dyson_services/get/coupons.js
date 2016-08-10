module.exports = {
  path:'/coupon/getCanUseCoupons.json',
  template:{
    code: 200,
    msg:'',
    data: [
      {
        id: 1184442, // 用户券id
        codeNumber: 247902630063502, // 优惠券编码
        couponId: 1718, // 券执行id
        brandId: 2479, // 品牌id
        couponStatus: 3, // 使用状态(1:未使用, 2:已验证, 3:已过期, 4: 已作废)
        planId: 10909, // 方案id
        validStartDate: 2015 - 11 - 17, // 有效期开始时间
        validEndDate: 2015 - 11 - 21, // 有效期结束时间
        customerId: 2103896256, // 客户id
        couponName: 'mjquana', // 优惠券模板名称
        ruleDesc: '满10减5', // 优惠券使用规则描述
        couponType: 4, // 优惠券模板类别(1:满减券, 2:折扣券, 3:礼品券, 4:现金券)
        fullValue: 1000, // 满额可用
        updateTime: 1448592159000, // 修改时间
        updaterId: 88888930398, // 修改人
        createTime: 1447729629000, // 创建人
        creatorId: 88888930398, // 创建时间
        isDelete: 0, // 是否删除(0 否; -1 是)
        instructions: '', // 用法说明
        coupRuleBeanList: [// 优惠券使用规则列表
          {
            id: 6208, // 规则ID
            couponId: 1738, // 优惠券模板ID
            ruleName: 'asValue', // 优惠券规则名称
            ruleValue: 22, // 优惠券规则值
            brandId: 2479, // 品牌ID
          },
          {
            id: 6298, // 规则ID
            couponId: 1718, // 优惠券模板ID
            ruleName: 'faceValue', // 优惠券规则名称
            ruleValue: 1000, // 优惠券规则值
            brandId: 2479, // 品牌ID
          },
        ],
        coupDishBeanList: [],
        periodStart: '00:00:00', // 使用时段开始时间
        periodEnd: '23:00:00',  // 使用时段结束时间
      },
      {
        id: 1056016,
        codeNumber: 247901260070243,
        couponId: 1157,
        brandId: 2479,
        couponStatus: 3,
        planId: 1237,
        validStartDate: '2015-09-25',
        validEndDate: '2015-09-30',
        customerId: '2103896256',
        couponName: '礼品券测试',
        ruleDesc: '满0元可用',
        couponType: 3,
        fullValue: 0,
        updateTime: 1443632413000,
        updaterId: 99999999,
        createTime: 1443117693000,
        creatorId: 99999999,
        isDelete: 0,
        instructions: '<p>这是礼品券使用说明：拿到国家动物园找原主自动兑换<br /></p>',
        coupRuleBeanList: [
          {
            id: 924,
            couponId: 1157,
            ruleName: 'giftName',
            ruleValue: '天堂伞',
            brandId: 2192,
          },
          {
            id: 925,
            couponId: 1157,
            ruleName: 'giftNumber',
            ruleValue: '2',
            brandId: 2192,
          },
        ],
        coupDishBeanList: [],
      },
      {
        id: 1056987,
        codeNumber: 247901260070345,
        couponId: 1168,
        brandId: 2479,
        couponStatus: 3,
        planId: 1237,
        validStartDate: '2015-09-25',
        validEndDate: '2015-09-30',
        customerId: '2103896256',
        couponName: '礼品券测试',
        ruleDesc: '满99元可用',
        couponType: 3,
        fullValue: 40,
        updateTime: 1443632413000,
        updaterId: 99999999,
        createTime: 1443117693000,
        creatorId: 99999999,
        isDelete: 0,
        instructions: '<p>这是礼品券使用说明：拿到国家动物园找原主自动兑换<br /></p>',
        coupRuleBeanList: [],
        coupDishBeanList: [
          {
            id: 924,
            couponId: 1150,
            dishId: 474003,
            num:9,
            ruleValue: '2',
            brandId: 2192,
          },
        ],
      },
    ],
  },
};
