const Immutable = require('seamless-immutable');
const _find = require('lodash.find');
const helper = require('../../helper/order-helper');
const initializeDishes = require('../../helper/order-dinner-helper.js').initializeDishes;
const reconstructDishes = require('../../helper/order-dinner-helper.js').reconstructDishes;
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
    orderedDishesProps:{
      dishes:[],
    },
    commercialProps:{
      diningForm:0,
      shopLogo:null,
      shopName:null,
      isSupportReceipt:true,
      carryRuleVO:null,
      receipt:null,
      hasPriviledge:false,
    },
    serviceProps:{
      diningForm:0,
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
        isMember:false,
      },
      activityBenefit:{
        relatedDish:null,
        benefitMoney:0,
      },
      benefitProps:{
        isPriviledge:false,
        priviledgeAmount:0,
        extraPrivilege:null,
        extraPrice:0,
        benefitList:[],
        totalAmount:0,
      },
      allowCheck:true,
    },
    childView:null,
    errorMessage:null,
  }),
  action
) {
  const { type, payload } = action;
  switch (type) {
    case 'SET_ORDER': {
      return state.setIn(['customerProps', 'dineCount'], payload.peopleCount)
      .setIn(['customerProps', 'dineSerialNumber'], payload.serialNo)
      .setIn(['customerProps', 'dineTableProp'], { area:payload.tableArea, table: payload.tableName })
      .setIn(['commercialProps', 'shopLogo'], payload.shopLogo)
      .setIn(['commercialProps', 'shopName'], payload.shopName)
      .setIn(['commercialProps', 'hasPriviledge'], payload.hasPriviledge)
      .setIn(['commercialProps', 'isSupportReceipt'], payload.isInvoice)
      .setIn(['commercialProps', 'receipt'], payload.invoice)
      .setIn(['commercialProps', 'carryRuleVO'], payload.carryRuleVO && payload.carryRuleVO.transferType ?
        Object.assign({}, payload.carryRuleVO, { isEnjoyRule:!payload.hasPriviledge })
        :
        Object.assign({}, { transferType: 1, scale: 2 }, { isEnjoyRule:!payload.hasPriviledge })
      )
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
       .setIn(['serviceProps', 'allowCheck'], payload.allowCheck)
       .setIn(['orderedDishesProps', 'dishes'], reconstructDishes(initializeDishes(payload.dishItems)))
       .setIn(['serviceProps', 'benefitProps', 'isPriviledge'], payload.hasPriviledge)
       .setIn(['serviceProps', 'benefitProps', 'priviledgeAmount'], payload.priviledgeAmount)
       .setIn(['serviceProps', 'benefitProps', 'extraPrivilege'], payload.addPrivilege)
       .setIn(['serviceProps', 'benefitProps', 'extraPrice'], helper.countExtraPrivilege(payload.addPrivilege))
       .setIn(['serviceProps', 'benefitProps', 'benefitList'], payload.privileges)
       .setIn(['serviceProps', 'benefitProps', 'totalAmount'], payload.totalAmount);
    }
    case 'SET_COUPONS_TO_ORDER':
      return state.setIn(['serviceProps', 'couponsProps', 'couponsList'], helper.handleWeixinCard(payload, false));
    case 'SET_DISCOUNT_TO_ORDER':
      if (payload.isDiscount && payload.isMember && !state.serviceProps.benefitProps.isPriviledge) {
        return state.setIn(
          ['serviceProps', 'discountProps', 'discountInfo'],
          Immutable.from({ name:'享受会员价', isChecked:true, id:'discount' })
         )
         .setIn(['serviceProps', 'discountProps', 'discountList'], payload.dishList)
         .setIn(['serviceProps', 'discountProps', 'discountType'], payload.type)
         .setIn(['serviceProps', 'discountProps', 'isMember'], true)
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
      return state.setIn(
        ['serviceProps', 'discountProps', 'isMember'], payload.isMember);
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
          } else if (!selectedCoupon.coupRuleBeanList.length && !selectedCoupon.coupDishBeanList.length && selectedCoupon.weixinValue) {
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
