const Immutable = require('seamless-immutable');
const helper = require('../../helper/order-helper');
module.exports = function (
  state = Immutable.from({
    areaList:[],
    tableList:[],
    timeTable:{},
    customerProps:{},
    commercialProps:{},
    serviceProps:{
      isPickupFromFrontDesk:'',
      tableProps:{
        tableArea:'',
        tableId:'',
      },
      payMethods:[],
      integralsInfo:'',
      couponsProps:{
        couponsList:[],
        inUseCoupon:'',
      },
      discountProps:{
        discountInfo:'',
        discountList:[],
      },
    },
  }),
  action
) {
  const { type, payload } = action;
  switch (type) {
    case 'SET_ORDER': {
      return state.set('areaList', payload.areaList)
                  .set('tableList', payload.tableList)
                  .set('timeTable', payload.timeJson)
                  .set(
                    'customerProps',
                    Immutable.from({
                      name:payload.member.name, mobile:payload.member.mobile,
                      sex:payload.member.sex, isMember:payload.isMember, customerCount:1,
                    })
                  )
                  .set(
                    'commercialProps',
                    Immutable.from({
                      name:payload.commercialName, integral:payload.integral, commercialLogo:payload.commercialLogo,
                      pickupPayType:payload.pickupPayType, totablePayType:payload.totablePayType,
                      diningForm: payload.diningForm,
                    })
                  )
                  .setIn(
                    ['serviceProps', 'payMethods'],
                    Immutable.from([
                      {
                        name:'在线支付',
                        isAvaliable:helper.isPaymentAvaliable('online', payload.diningForm, false, payload.pickupPayType, payload.totablePayType),
                        isChecked:payload.diningForm === 1,
                        id:'online-payment',
                      },
                      {
                        name:'货到付款',
                        isAvaliable:helper.isPaymentAvaliable('offline', payload.diningForm, false, payload.pickupPayType, payload.totablePayType),
                        isChecked:payload.diningForm === 0,
                        id:'offline-payment',
                      },
                    ])
                  )
                  .setIn(
                    ['serviceProps', 'isPickupFromFrontDesk'],
                    payload.serviceApproach.indexOf('pickup') !== -1 ?
                        Immutable.from({ name:'前台取餐', isChecked:false, id:'way-of-get-diner' })
                        :
                        false
                   )
                   .setIn(
                     ['serviceProps', 'integralsInfo'],
                     payload.isMember && payload.integral.isExchangeCash === 0 && payload.integral.integral !== 0 ?
                         Immutable.from({ name:'使用会员积分', isChecked:true, id:'integrals', subname:`我的积分${payload.integral.integral}` })
                         :
                         false
                    );
    }
    case 'SET_ORDER_PROPS':
      if (payload.id === 'way-of-get-diner') {
        return state.setIn(
          ['serviceProps', 'isPickupFromFrontDesk', 'isChecked'],
          !state.serviceProps.isPickupFromFrontDesk.isChecked
        )
        .updateIn(
          ['serviceProps', 'payMethods'],
          payMethods => payMethods.flatMap(
            payMethod => payMethod.set(
              'isAvaliable',
              helper.isPaymentAvaliable(
                payMethod.id.split('-')[0],
                state.commercialProps.diningForm,
                !state.serviceProps.isPickupFromFrontDesk.isChecked,
                state.commercialProps.pickupPayType,
                state.commercialProps.totablePayType
              ),
            )
          )
        );
      } else if (payload.id === 'discount') {
        //  表示使用折扣 那会员券就应该隐藏掉
        return state.setIn(
          ['serviceProps', 'discountProps', 'discountInfo', 'isChecked'],
           !state.serviceProps.discountProps.discountInfo.isChecked
         );
      } else if (payload.id === 'customerInfoEditor') {
        return state.set(
          'customerProps', payload
        );
      }
      break;
    case 'MERGE_COUPONS_TO_ORDER':
      return state.setIn(['serviceProps', 'couponsProps', 'couponsList'], payload.coupList);
    case 'MERGE_DISCOUNT_TO_ORDER':
      if (payload.isDiscount) {
        return state.setIn(
          ['serviceProps', 'discountProps', 'discountInfo'],
          Immutable.from({ name:'享受会员价', isChecked:false, id:'discount' })
         )
         .setIn(['serviceProps', 'discountProps', 'discountList'], payload.dishList);
      }
      break;
    default:
  }
  return state;
};
