module.exports = {
  path:'/orderall/dishMarketInfos.json',
  template:{
    data: {
      discountInfo: {
        isDiscount: false,
        type: 2,
        levelId:9992836,
        levelName:'黄金会员',
        isMember:false,
        dishList: [
          {
            dishId: 57472,
            value: 10,
          },
        ],
      },
      marketing:[// 优惠规则信息
        {
          dishId : 23,
          rules : [{
            dishId : 23,
            planId : 11,
            ruleId : 1,
            ruleName : '立减3元',
            type : 1,
            dishNum : 2,
            reduce : 3,
            discount : null,
            periodStart : '07:00:00',
            periodEnd : '23:58:59',
            weekdays : '1110011',
            customerType : 5,
            updateTime: '2016-12-01',
            isAble:false,
          }, {
            dishId : 23,
            planId : 22,
            ruleId : 222,
            ruleName : '享受8.5折',
            type : 2,
            dishNum : 2,
            reduce : null,
            discount : 8.5,
            periodStart : '07:00:00',
            periodEnd : '23:59:59',
            weekdays : '1111110',
            customerType : 2,
            updateTime: '2016-12-01',
            isAble:true,
          },
              ],
        },
        {
          dishId : 107275,
          rules : [{
            dishId : 1,
            planId : 11,
            ruleId : 1,
            ruleName : '小波打5折',
            type : 1,
            dishNum : 2,
            reduce : 3,
            discount : null,
            periodStart : '00:00:00',
            periodEnd : '23:58:59',
            weekdays : '1111111',
            customerType : 3,
            updateTime: '2016-12-01',
            isAble:false,
          }, {
            dishId : 2,
            planId : 22,
            ruleId : 222,
            ruleName : '享受8.5折',
            type : 2,
            dishNum : 2,
            reduce : null,
            discount : 8.5,
            periodStart : '07:00:00',
            periodEnd : '23:59:59',
            weekdays : '1001111',
            customerType : 2,
            updateTime: '2016-12-01',
            isAble:true,
          },
              ],
        },
      ],
      multiMarketing:[// 多商品优惠信息
        {
          planId : 11,
          ruleId : 1,
          ruleName : '立减3元',
          type : 1,
          dishNum : 2,
          reduce : 3,
          discount : null,
          periodStart : '07:00:00',
          periodEnd : '23:59:59',
          weekdays : '1111111',
          updateTime: '2016-12-01',
          customerType : 1,
        }, {
          planId : 22,
          ruleId : 222,
          ruleName : '享受8.5折',
          type : 2,
          dishNum : 2,
          reduce : null,
          discount : 8.5,
          periodStart : '07:00:00',
          periodEnd : '23:59:59',
          weekdays : '1111111',
          updateTime: '2016-12-01',
          customerType : 1,
        },
      ],
      notice:'我是公告啦啦啦',
    },
    time: 1472458598918,
    code: '200',
    msg: '',
  },
};
