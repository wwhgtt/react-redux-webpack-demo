const Immutable = require('seamless-immutable');
const _find = require('lodash.find');
const helper = require('../../helper/order-helper');
const orderTypeOfUrl = require('../../helper/dish-hepler.js').getUrlParam('type');
module.exports = function (
  state = Immutable.from({
    customerProps:{},
    orderedDishesProps:{},
    commercialProps:{},
    serviceProps:{
      isPickupFromFrontDesk:'',
      payMethods:[],
      integralsInfo:null,
      sendAreaId:null,
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
    errorMessage:null,
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
                      selfPayType:orderTypeOfUrl === 'TS' ? payload.pickupPayType : payload.toShopPayType,
                      sendPayType:orderTypeOfUrl === 'TS' ? payload.totablePayType : payload.toHomePayType,
                      diningForm: payload.diningForm, carryRuleVO:payload.carryRuleVO,
                    })
                  )
                  .setIn(
                    ['serviceProps', 'payMethods'],
                    Immutable.from([
                      {
                        name:'在线支付',
                        isAvaliable:
                          helper.isPaymentAvaliable(
                            'online',
                            payload.diningForm,
                            false,
                            orderTypeOfUrl === 'TS' ? payload.pickupPayType : payload.toShopPayType,
                            orderTypeOfUrl === 'TS' ? payload.totablePayType : payload.toHomePayType
                          ),
                        isChecked:
                          helper.shouldPaymentAutoChecked(
                            'online',
                            false,
                            orderTypeOfUrl === 'TS' ? payload.pickupPayType : payload.toShopPayType,
                            orderTypeOfUrl === 'TS' ? payload.totablePayType : payload.toHomePayType
                          ),
                        id:'online-payment',
                        type: 'tickbox',
                      },
                      {
                        name:'货到付款',
                        isAvaliable:
                          helper.isPaymentAvaliable(
                            'offline',
                            payload.diningForm,
                            false,
                            orderTypeOfUrl === 'TS' ? payload.pickupPayType : payload.toShopPayType,
                            orderTypeOfUrl === 'TS' ? payload.totablePayType : payload.toHomePayType
                          ),
                        isChecked:
                          helper.shouldPaymentAutoChecked(
                            'offline',
                            false,
                            orderTypeOfUrl === 'TS' ? payload.pickupPayType : payload.toShopPayType,
                            orderTypeOfUrl === 'TS' ? payload.totablePayType : payload.toHomePayType
                          ),
                        id:'offline-payment',
                        type: 'tickbox',
                      },
                    ])
                  )
                  .setIn(
                    ['serviceProps', 'isPickupFromFrontDesk'],
                    payload.serviceApproach && payload.serviceApproach.indexOf('pickup') !== -1 ?
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
                state.commercialProps.selfPayType,
                state.commercialProps.sendPayType
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
                state.commercialProps.selfPayType,
                state.commercialProps.sendPayType
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
        return state.setIn(
          ['customerProps', 'name'], payload.name
        )
        .setIn(['customerProps', 'sex'], payload.sex)
        .setIn(['customerProps', 'mobile'], payload.mobile)
        .setIn(['customerProps', 'customerCount'], payload.customerCount)
        .setIn(['customerProps', 'isMember'], payload.isMember)
        .updateIn(
          ['customerProps', 'addresses'],
          state.serviceProps.sendAreaId !== 0 ?
            addresses => addresses.flatMap(
              address => address.id === payload.address.id ? address.set('isChecked', true) : address.set('isChecked', false)
            )
            :
            addresses => []
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
         .setIn(['serviceProps', 'discountProps', 'discountType'], payload.type)
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
    case 'SET_ADDRESS_INFO_TO_ORDER':
      return state.setIn(
        ['customerProps', 'addresses'],
        Immutable.from(payload)
      );
    case 'GET_ORDERED_DISH_WAY':
      if (!payload || payload === 0) {
        // 表示到店取餐的情况
        return state.setIn(['serviceProps', 'sendAreaId'], 0);
      }
      return state.setIn(['serviceProps', 'sendAreaId'], payload);
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
    case 'SET_ERROR_MSG':
      return state.set(
        'errorMessage', payload
      );
    default:
  }
  return state;
};
