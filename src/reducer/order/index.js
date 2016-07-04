const Immutable = require('seamless-immutable');
// const _find = require('lodash.find');
const helper = require('../../helper/order-helper');
module.exports = function (
  state = Immutable.from({
    areaList:[],
    tableList:[],
    timeTable:{},
    customerProps:{},
    orderedDishesProps:{},
    commercialProps:{},
    serviceProps:{
      isPickupFromFrontDesk:'',
      payMethods:[],
      integralsInfo:'',
      couponsProps:{
        couponsList:[],
        inUseCoupon:false,
      },
      discountProps:{
        discountInfo:'',
        discountList:[],
      },
    },
    tableProps:{
      areas:[],
      tables:[],
    },
    childView:null,
  }),
  action
) {
  const { type, payload } = action;
  switch (type) {
    case 'SET_ORDER': {
      return state.setIn(['tableProps', 'areas'], Immutable.from(payload.areaList))
                  .setIn(['tableProps', 'tables'], Immutable.from(payload.tableList).flatMap(table => table.set('id', table.tableID)))
                  .set('timeProps', Immutable.from({ selectedDateTime:[], timeTable:payload.timeJson }))
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
                        isChecked:helper.shouldPaymentAutoChecked('online', false, payload.pickupPayType, payload.totablePayType),
                        id:'online-payment',
                        type: 'tickbox',
                      },
                      {
                        name:'货到付款',
                        isAvaliable:helper.isPaymentAvaliable('offline', payload.diningForm, false, payload.pickupPayType, payload.totablePayType),
                        isChecked:helper.shouldPaymentAutoChecked('offline', false, payload.pickupPayType, payload.totablePayType),
                        id:'offline-payment',
                        type: 'tickbox',
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
        )
        .updateIn(
          ['serviceProps', 'payMethods'],
          payMethods => payMethods.flatMap(
            payMethod => payMethod.set(
              'isChecked',
              helper.shouldPaymentAutoChecked(
                payMethod.id.split('-')[0],
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
      } else if (payload.id === 'customer-info') {
        return state.set(
          'customerProps', payload
        );
      } else if (payload.id.indexOf('payment') !== -1) {
        return state.updateIn(
          ['serviceProps', 'payMethods'],
          payMethods => payMethods.flatMap(
            payMethod => payMethod.id === payload.id ? payMethod.set('isChecked', true)
            : payMethod.set('isChecked', false)
          )
        );
      } else if (payload.id === 'coupon') {
        // 使用优惠券以后需要把会员价关闭  利用返回的id找到对应的优惠券获取优惠信息
        // const selectedCoupon = _find(state.serviceProps.couponsProps.couponsList, coupon => coupon.id.toString() === payload.selectedCouponId);
        return state.setIn(
          ['serviceProps', 'couponsProps', 'inUseCoupon'], true
        );
      } else if (payload.id === 'integrals') {
        return state.setIn(
          ['serviceProps', 'integralsInfo', 'isChecked'],
           !state.serviceProps.integralsInfo.isChecked
         );
      }
      break;
    case 'SET_COUPONS_TO_ORDER':
      return state.setIn(['serviceProps', 'couponsProps', 'couponsList'], payload.coupList);
    case 'SET_DISCOUNT_TO_ORDER':
      if (payload.isDiscount) {
        return state.setIn(
          ['serviceProps', 'discountProps', 'discountInfo'],
          Immutable.from({ name:'享受会员价', isChecked:false, id:'discount' })
         )
         .setIn(['serviceProps', 'discountProps', 'discountList'], payload.dishList);
      }
      break;
    case 'SET_CHILDVIEW':
      if (payload === '#customer-info') {
        return state.set('childView', 'customer-info');
      } else if (payload === '#table-select') {
        return state.set('childView', 'table-select');
      } else if (payload === '#coupon-select') {
        return state.set('childView', 'coupon-select');
      }
      return state.set('childView', '');
    case 'GET_LAST_ORDERED_DISHES':
      console.log(payload.dishes);
      return state.set('orderedDishesProps', Immutable.from(payload));
    default:
  }
  return state;
};
