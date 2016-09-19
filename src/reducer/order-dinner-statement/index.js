const Immutable = require('seamless-immutable');
const _find = require('lodash.find');
const helper = require('../../helper/order-helper');
module.exports = function (
  state = Immutable.from({
    customerProps:{
      dineCount:1,
      dineTableProp:{
        area:null,
        table:null,
      },
      dineSerialNumber:null,
    },
    orderedDishesProps:{},
    commercialProps:{
      shopLogo:null,
      shopName:null,
      isSupportReceipt:true,
    },
    serviceProps:{
      integralsInfo:null,
      couponsProps:{
        couponsList:[],
        inUseCoupon:false,
        inUseCouponDetail:{},
      },
      discountProps:{
        discountInfo:'',
        discountList:[],
        discountType:'',
        inUseDiscount:null,
      },
    },
    errorMessage:null,
  }),
  action
) {
  const { type, payload } = action;
  switch (type) {
    case 'SET_ORDER': {
      return state.setIn(['customerProps', 'dineCount'], payload.dineCount)
      .setIn(['customerProps', 'dineSerialNumber'], payload.dineSerialNumber)
      .setIn(['commercialProps', 'shopLogo'], payload.commercialLogo)
      .setIn(['commercialProps', 'shopName'], payload.commercialName)
      .setIn(['commercialProps', 'isSupportReceipt'], payload.isInvoice)
      .setIn(
       ['serviceProps', 'integralsInfo'],
       payload.isMember && payload.integral && payload.integral.isExchangeCash === 0 && payload.integral.integral !== 0 ?
           Immutable.from({
             name:'使用会员积分',
             isChecked:false,
             id:'integrals',
             subname:`我的积分${payload.integral.integral}`,
             integralsDetail:payload.integral,
           })
           :
           false
       );
    }
    case 'SET_ORDERED_DISHES_TO_ORDER':
      return state.set(
        'orderedDishesProps', Immutable.from(payload)
      );
    case 'SET_COUPONS_TO_ORDER':
      return state.setIn(['serviceProps', 'couponsProps', 'couponsList'], payload);
    case 'SET_DISCOUNT_TO_ORDER':
      if (payload.isDiscount && payload.isMember) {
        return state.setIn(
          ['serviceProps', 'discountProps', 'discountInfo'],
          Immutable.from({ name:'享受会员价', isChecked:true, id:'discount' })
         )
         .setIn(['serviceProps', 'discountProps', 'discountList'], payload.dishList)
         .setIn(['serviceProps', 'discountProps', 'discountType'], payload.type)
         .setIn(
           ['serviceProps', 'discountProps', 'inUseDiscount'],
            helper.countMemberPrice(state.customerProps.loginType === 0, state.orderedDishesProps.dishes, payload.dishList, payload.type)
         )
         .updateIn(
           ['orderedDishesProps', 'dishes'],
           dishes => dishes.flatMap(
             dish => dish.set(
                 'isMember', _find(payload.dishList, { dishId:dish.id }) !== undefined
               )
           )
        );
      }
      break;
    case 'SET_ERROR_MSG':
      return state.set(
          'errorMessage', payload
        );
    default:
  }
  return state;
};
