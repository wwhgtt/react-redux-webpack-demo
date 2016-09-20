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
    orderedDishesProps:[],
    commercialProps:{
      shopLogo:null,
      shopName:null,
      isSupportReceipt:true,
      carryRuleVO:null,
    },
    serviceProps:{
      integralsInfo:null,
      integralsDetail:null,
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
    childView:null,
    errorMessage:null,
  }),
  action
) {
  const { type, payload } = action;
  switch (type) {
    case 'SET_ORDER': {
      return state.setIn(['customerProps', 'dineCount'], payload.tradePeopleCount)
      .setIn(['customerProps', 'dineSerialNumber'], payload.orderSerialNo)
      .setIn(['customerProps', 'dineTableProp'], { area:payload.tableArea, table: payload.tableName })
      .setIn(['commercialProps', 'shopLogo'], payload.commercialLogo)
      .setIn(['commercialProps', 'shopName'], payload.commercialName)
      .setIn(['commercialProps', 'isSupportReceipt'], payload.isInvoice)
      .setIn(['commercialProps', 'carryRuleVO'], payload.carryRuleVO && payload.carryRuleVO.transferType ?
        payload.carryRuleVO : { transferType: 1, scale: 2 })
      .setIn(
       ['serviceProps', 'integralsInfo'],
       payload.isMember && payload.integral && payload.integral.isExchangeCash === 0 && payload.integral.integral !== 0 ?
           Immutable.from({
             name:'使用会员积分',
             isChecked:false,
             id:'integrals',
             subname:`我的积分${payload.integral.integral}`,
           })
           :
           false
       )
       .setIn(['serviceProps', 'integralsDetail'], payload.integral)
       .set('orderedDishesProps', payload.dishList);
    }
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
            helper.countMemberPrice(true, state.orderedDishesProps.dishes, payload.dishList, payload.type)
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
    case 'SET_CHILDVIEW':
      if (payload === '#coupon-select') {
        return state.set('childView', 'coupon-select');
      } else if (payload === '#selectCoupon') {
        return state.setIn(
            ['serviceProps', 'discountProps', 'inUseDiscount'],
            helper.countMemberPrice(
              true, state.orderedDishesProps.dishes, state.serviceProps.discountProps.discountList, state.serviceProps.discountProps.discountType
            )
          )
          .set('childView', '');
      }
      return state.set('childView', '');
    case 'SET_ORDER_PROPS':
      if (payload.id === 'coupon') {
        const selectedCoupon = _find(
          state.serviceProps.couponsProps.couponsList,
          coupon => coupon.id.toString() === payload.selectedCouponId
        );
        if (selectedCoupon && selectedCoupon.isChecked) {
          if (selectedCoupon.coupRuleBeanList.length && !selectedCoupon.coupDishBeanList.length) {
            return state.setIn(
            ['serviceProps', 'couponsProps', 'inUseCoupon'], true
          )
            .setIn(
              ['serviceProps', 'couponsProps', 'inUseCouponDetail'],
              selectedCoupon
            );
          }
          return state.setIn(
            ['serviceProps', 'couponsProps', 'inUseCoupon'], true
          )
          .setIn(
            ['serviceProps', 'couponsProps', 'inUseCouponDetail'],
            selectedCoupon
          )
          .updateIn(
            ['orderedDishesProps', 'dishes'],
            dishes => dishes.flatMap(
              dish => dish.brandDishId === selectedCoupon.coupDishBeanList[0].dishId ?
              dish.set('isRelatedToCoupon', true).set('relatedCouponCount', selectedCoupon.coupDishBeanList[0].num)
              :
              dish.set('isRelatedToCoupon', false)
            )
          );
        }
        return state.setIn(
            ['serviceProps', 'couponsProps', 'inUseCoupon'], false
          )
          .updateIn(
            ['orderedDishesProps', 'dishes'],
            dishes => dishes.flatMap(
              dish => dish.set('isRelatedToCoupon', false)
            )
          );
      } else if (payload.id === 'integrals') {
        return state.setIn(
          ['serviceProps', 'integralsInfo', 'isChecked'],
           !state.serviceProps.integralsInfo.isChecked
         );
      } else if (payload.id === 'coupon-prop') {
        const selectedCoupon = _find(
          state.serviceProps.couponsProps.couponsList,
          coupon => coupon.id.toString() === payload.changedCouponId
        );
        if (payload.isChecked) {
          return state.updateIn(
            ['serviceProps', 'couponsProps', 'couponsList'],
            couponList => couponList.flatMap(
              coupon => coupon.id === selectedCoupon.id ? coupon.set('isChecked', false)
              : coupon.set('isChecked', false)
            )
          );
        }
        return state.updateIn(
          ['serviceProps', 'couponsProps', 'couponsList'],
          couponList => couponList.flatMap(
            coupon => coupon.id === selectedCoupon.id ? coupon.set('isChecked', true)
            : coupon.set('isChecked', false)
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
