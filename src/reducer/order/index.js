const Immutable = require('seamless-immutable');
const _find = require('lodash.find');
const _has = require('lodash.has');
const helper = require('../../helper/order-helper');
const orderTypeOfUrl = require('../../helper/dish-hepler.js').getUrlParam('type');
module.exports = function (
  state = Immutable.from({
    customerProps:{},
    orderedDishesProps:{},
    commercialProps:{},
    serviceProps:{
      isPickupFromFrontDesk:null,
      payMethods:[],
      integralsInfo:null,
      sendAreaId:null,
      deliveryProps:null,
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
      isEditable:true,
      areas:[],
      tables:[],
    },
    timeProps:{
      selectedDateTime:{ date:'', time:'' },
      timeTable:undefined,
    },
    childView:null,
    errorMessage:null,
    shuoldPhoneValidateShow:false,
  }),
  action
) {
  const { type, payload } = action;
  switch (type) {
    case 'SET_ORDER': {
      return state.setIn(
                    ['tableProps', 'areas'],
                    Immutable.from(
                      helper.initializeAreaAdnTableProps(payload.areaList, payload.tableList).areaList
                    )
                  )
                  .setIn(
                    ['tableProps', 'tables'],
                    Immutable.from(
                      helper.initializeAreaAdnTableProps(payload.areaList, payload.tableList).tableList
                    )
                  )
                  .setIn(
                    ['tableProps', 'isEditable'],
                    Immutable.from(
                      helper.initializeAreaAdnTableProps(payload.areaList, payload.tableList).isEditable
                    )
                  )
                  .setIn(['timeProps', 'timeTable'],
                    Immutable.from(
                      helper.initializeTimeTable(payload.timeJson)
                    )
                  )
                  .setIn(['timeProps', 'selectedDateTime'],
                    Immutable.from(
                      helper.getDefaultSelectedDateTime(payload.timeJson, payload.defaultSelectedDateTime)
                    )
                  )
                  .set(
                    'customerProps',
                    Immutable.from({
                      name:payload.member.name, mobile:payload.member.mobile, loginType:+payload.member.loginType > 0 ? +payload.member.loginType : 0,
                      iconUri:payload.member.iconUri, sex: isNaN(+payload.member.sex) ? null : payload.member.sex,
                      isMember:payload.isMember, customerCount:1,
                      originMa:payload.originMa || {},
                      addresses:payload.ma ? [Object.assign({ isChecked:true, id: payload.ma.memberAddressId }, payload.ma)] : null,
                    })
                  )
                  .set('defaultCustomerProps', payload.member || {})
                  .set(
                    'commercialProps',
                    Immutable.from({
                      name:payload.commercialName, integral:payload.integral, commercialLogo:payload.commercialLogo,
                      selfPayType:orderTypeOfUrl === 'TS' ? payload.pickupPayType : payload.toShopPayType,
                      sendPayType:orderTypeOfUrl === 'TS' ? payload.totablePayType : payload.toHomePayType,
                      diningForm: payload.diningForm >= 0 ? payload.diningForm : 1,
                      carryRuleVO:payload.carryRuleVO && payload.carryRuleVO.transferType ?
                        payload.carryRuleVO : { transferType: 1, scale: 2 },
                      isSupportInvoice:payload.isInvoice,
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
                            helper.isPickUpAutoChecked(payload.serviceApproach).isChecked,
                            state.serviceProps.sendAreaId,
                            orderTypeOfUrl === 'TS' ? payload.pickupPayType : payload.toShopPayType,
                            orderTypeOfUrl === 'TS' ? payload.totablePayType : payload.toHomePayType
                          ),
                        isChecked:
                          helper.shouldPaymentAutoChecked(
                            'online',
                            payload.diningForm,
                            helper.isPickUpAutoChecked(payload.serviceApproach).isChecked,
                            state.serviceProps.sendAreaId,
                            orderTypeOfUrl === 'TS' ? payload.pickupPayType : payload.toShopPayType,
                            orderTypeOfUrl === 'TS' ? payload.totablePayType : payload.toHomePayType
                          ),
                        id:'online-payment',
                        type: 'tickbox',
                      },
                      {
                        name:helper.getOfflinePaymentName(state.serviceProps.sendAreaId),
                        isAvaliable:
                          helper.isPaymentAvaliable(
                            'offline',
                            payload.diningForm,
                            helper.isPickUpAutoChecked(payload.serviceApproach).isChecked,
                            state.serviceProps.sendAreaId,
                            orderTypeOfUrl === 'TS' ? payload.pickupPayType : payload.toShopPayType,
                            orderTypeOfUrl === 'TS' ? payload.totablePayType : payload.toHomePayType
                          ),
                        isChecked:
                          helper.shouldPaymentAutoChecked(
                            'offline',
                            payload.diningForm,
                            helper.isPickUpAutoChecked(payload.serviceApproach).isChecked,
                            state.serviceProps.sendAreaId,
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
                        Immutable.from(helper.isPickUpAutoChecked(payload.serviceApproach))
                        :
                        false
                   )
                   .setIn(
                     ['serviceProps', 'serviceApproach'], payload.serviceApproach
                   )
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
                state.serviceProps.sendAreaId,
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
                state.commercialProps.diningForm,
                !state.serviceProps.isPickupFromFrontDesk.isChecked,
                state.serviceProps.sendAreaId,
                state.commercialProps.selfPayType,
                state.commercialProps.sendPayType
              ),
            )
          )
        );
      } else if (payload.id === 'customer-info') {
        return state.set(
          'customerProps', payload
        );
      } else if (payload.id === 'customer-count') {
        return state.setIn(['customerProps', 'customerCount'], payload.newCount);
      } else if (payload.id === 'customer-info-selected-address') {
        return state.setIn(['customerProps', 'addresses'], payload.addresses);
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
      } else if (payload.id && payload.id.indexOf('payment') !== -1) {
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
        return state
          .setIn(
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
           _has(state.commercialProps, 'diningForm') && state.commercialProps.diningForm === 0 ?
            0
            :
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
    case 'SET_ADDRESS_INFO_TO_ORDER':
      return state.setIn(
        ['customerProps', 'addresses'],
        Immutable.from((state.customerProps.addresses || []).concat(payload))
      ).setIn(['customerProps', 'isAddressesLoaded'], true);
    case 'SET_ADDRESS_TOSHOP_TO_ORDER':
      return state.setIn(payload.isJustToShop ? ['customerProps', 'originMa'] : ['customerAddressListInfo', 'data', 'toShopInfo'], payload.value);
    case 'SET_ADDRESS_LIST_INFO_TO_ORDER':
      return state.set('customerAddressListInfo', {
        isAddressesLoaded: true,
        data: Immutable.from(payload).update('inList', list => list.map((item, index) => {
          const address = item.wXMemberAddress;
          return Object.assign({ rangeId: item.rangeId }, address);
        })),
      });
    case 'SET_SEND_AREA_ID':
      if (!payload || payload === 0) {
        // 表示到店取餐的情况
        return state.setIn(['serviceProps', 'sendAreaId'], 0);
      }
      return state.setIn(['serviceProps', 'sendAreaId'], payload);
    case 'SET_DELIVERY_PRICE':
      return state.setIn(['serviceProps', 'deliveryProps'], payload);
    case 'SET_CHILDVIEW':
      if (payload === '#customer-info') {
        return state.set('childView', 'customer-info');
      } else if (payload === '#table-select') {
        return state.set('childView', 'table-select');
      } else if (payload === '#coupon-select') {
        return state.set('childView', 'coupon-select');
      } else if (payload === '#time-select') {
        return state.set('childView', 'time-select');
      } else if (payload === '#selectCoupon') {
        return state.setIn(
          ['serviceProps', 'discountProps', 'inUseDiscount'],
          helper.countMemberPrice(
            true, state.orderedDishesProps.dishes, state.serviceProps.discountProps.discountList, state.serviceProps.discountProps.discountType
          )
        )
        .set('childView', '');
      } else if (payload === '#customer-info-toshop') {
        return state.set('childView', 'customer-info-toshop');
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
    case 'SET_ORDER_TIME_PROPS':
      return state.setIn(['timeProps', 'timeTable'],
          Immutable.from(
            helper.initializeTimeTable(payload)
          )
        )
        .setIn(['timeProps', 'selectedDateTime'],
          Immutable.from(
            helper.getDefaultSelectedDateTime(payload)
          )
        );
    case 'SET_PHONE_VALIDATE_PROPS':
      return state.set('shuoldPhoneValidateShow', payload);
    default:
  }
  return state;
};
