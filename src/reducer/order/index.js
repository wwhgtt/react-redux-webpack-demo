const Immutable = require('seamless-immutable');
const _find = require('lodash.find');
const helper = require('../../helper/order-helper');
module.exports = function (
  state = Immutable.from({
    customerProps:{},
    orderedDishesProps:{},
    commercialProps:{},
    serviceProps:{
      isPickupFromFrontDesk:'',
      payMethods:[],
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
    tableProps:{
      areas:[],
      tables:[],
    },
    timeProps:{
      selectedDateTime:{ date:'', time:'' },
      timeTable:undefined,
    },
    childView:null,
  }),
  action
) {
  const { type, payload } = action;
  switch (type) {
    case 'SET_ORDER': {
      return state.setIn(['tableProps', 'areas'], !payload.areaList ? null : Immutable.from(payload.areaList))
                  .setIn(
                    ['tableProps', 'tables'],
                    !payload.tableList ?
                      null
                      :
                      Immutable.from(payload.tableList).flatMap(table => table.set('id', parseInt(table.tableID, 10)))
                    )
                  .setIn(['timeProps', 'timeTable'], Immutable.from(payload.timeJson))
                  .set(
                    'customerProps',
                    Immutable.from({
                      name:payload.member.name, mobile:payload.member.mobile,
                      sex:payload.member.sex, isMember:payload.isMember, customerCount:1,
                      addresses:payload.ma ? [{ id:payload.ma.id, address:payload.ma.address, isChecked:true }] : null,
                    })
                  )
                  .set(
                    'commercialProps',
                    Immutable.from({
                      name:payload.commercialName, integral:payload.integral, commercialLogo:payload.commercialLogo,
                      pickupPayType:payload.pickupPayType, totablePayType:payload.totablePayType,
                      diningForm: payload.diningForm, carryRuleVO:payload.carryRuleVO,
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
                         Immutable.from({
                           name:'使用会员积分',
                           isChecked:true,
                           id:'integrals',
                           subname:`我的积分${payload.integral.integral}`,
                           integralsDetail:payload.integral,
                         })
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
        return state.setIn(
          ['serviceProps', 'discountProps', 'discountInfo', 'isChecked'],
           !state.serviceProps.discountProps.discountInfo.isChecked
         ).setIn(
           ['serviceProps', 'discountProps', 'inUseDiscount'],
           helper.countMemberPrice(payload.isChecked, state.orderedDishesProps.dishes, state.serviceProps.discountProps)
         ).setIn(
           ['serviceProps', 'couponsProps', 'inUseCoupon'], false
         );
      } else if (payload.id === 'customer-info') {
        return state.set(
          'customerProps', payload
        );
      } else if (payload.id === 'customer-info-with-address') {
        return state.set(
          'customerProps', payload
        ).updateIn(
          ['customerProps', 'addresses'],
          addresses => addresses.flatMap(
            address => address.id === payload.address.id ? address.set('isChecked', true) : address.set('isChecked', false)
          )
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
        const selectedCoupon = _find(
          state.serviceProps.couponsProps.couponsList,
          coupon => coupon.id.toString() === payload.selectedCouponId
        );
        if (selectedCoupon.isChecked) {
          return state.setIn(
            ['serviceProps', 'couponsProps', 'inUseCoupon'], true
          )
          .setIn(
            ['serviceProps', 'couponsProps', 'inUseCouponDetail'],
            selectedCoupon
          )
          .setIn(['serviceProps', 'discountProps', 'inUseDiscount'], null);
        }
        return state.setIn(
            ['serviceProps', 'couponsProps', 'inUseCoupon'], false
          )
          .setIn(
            ['serviceProps', 'couponsProps', 'inUseCoupon'], false
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
      } else if (payload.id === 'table') {
        return state.updateIn(
          ['tableProps', 'areas'],
          areas => areas.flatMap(
            area => area.id === payload.area.id ? area.set('isChecked', true) : area.set('isChecked', false)
          )
        ).updateIn(
          ['tableProps', 'tables'],
          tables => tables.flatMap(
            table => table.id === payload.table.id ? table.set('isChecked', true) : table.set('isChecked', false)
          )
        );
      } else if (payload.id === 'takeaway-time') {
        return state.setIn(['timeProps', 'selectedDateTime', 'date'], payload.dateTime.id).setIn(
          ['timeProps', 'selectedDateTime', 'time'],
          _find(payload.dateTime.times, { isChecked:true }).id
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
         .setIn(['serviceProps', 'discountProps', 'discountList'], payload.dishList)
         .setIn(['serviceProps', 'discountProps', 'discountType'], payload.type);
      }
      break;
    case 'SET_ADDRESS_INFO_TO_ORDER':
      return state.setIn(
        ['customerProps', 'addresses'],
        Immutable.from(payload)
      );
    case 'SET_CHILDVIEW':
      if (payload === '#customer-info') {
        return state.set('childView', 'customer-info');
      } else if (payload === '#table-select') {
        return state.set('childView', 'table-select');
      } else if (payload === '#coupon-select') {
        return state.set('childView', 'coupon-select');
      } else if (payload === '#time-select') {
        return state.set('childView', 'time-select');
      }
      return state.set('childView', '');
    case 'SET_ORDERED_DISHES_TO_ORDER':
      return state.set(
        'orderedDishesProps', Immutable.from(payload)
      );
    default:
  }
  return state;
};
