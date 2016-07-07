const _find = require('lodash.find');
const getDishesPrice = require('../helper/dish-hepler.js').getDishesPrice;
const getDishPrice = require('../helper/dish-hepler.js').getDishPrice;
const getDishesCount = require('../helper/dish-hepler.js').getDishesCount;
const getUrlParam = require('../helper/dish-hepler.js').getUrlParam;
exports.isPaymentAvaliable = function (payment, diningForm, isPickupFromFrontDesk, pickupPayType, totablePayType) {
  if (diningForm === 0) {
    return payment === 'offline';
  }
  return isPickupFromFrontDesk ? pickupPayType.indexOf(payment) : totablePayType.indexOf(payment);
};
exports.shouldPaymentAutoChecked = function (payment, isPickupFromFrontDesk, pickupPayType, totablePayType) {
  if (isPickupFromFrontDesk) {
    return pickupPayType.indexOf(',') !== -1 ? payment === pickupPayType.split(',')[0] : payment === pickupPayType;
  }
  return totablePayType.indexOf(',') !== -1 ? payment === totablePayType.split(',')[0] : payment === totablePayType;
};
exports.getSelectedTable = function (tableProps) {
  return {
    area: _find(tableProps.areas, { isChecked:true }),
    table: _find(tableProps.tables, { isChecked:true }),
  };
};
exports.countPriceByCoupons = function (coupon, totalPrice) {
  let remission = '';
  if (coupon.couponType === 1) {
    // '满减券'
    return remission = coupon.coupRuleBeanList[0].ruleValue;
  } else if (coupon.couponType === 2) {
    // '折扣券';
    return remission = totalPrice * Number(coupon.coupRuleBeanList[0].ruleValue);
  } else if (coupon.couponType === 3) {
    // '礼品券';
    return remission;
  } else if (coupon.couponType === 4) {
    // '现金券';
    return remission = coupon.coupRuleBeanList[0].ruleValue;
  }
  return true;
};
const countIntegralsToCash = exports.countIntegralsToCash = function (totalPrice, remission, integralsInfo) {
  if (!remission) {
    remission = 0;
  }
  const canBeUsedCommutation = totalPrice - remission;
  let limitType = integralsInfo.limitType;
  if (limitType === 1) {
    return {
      commutation:integralsInfo.integral * integralsInfo.exchangeCashValue / integralsInfo.exchangeIntegralValue < canBeUsedCommutation ?
        integralsInfo.integral * integralsInfo.exchangeCashValue / integralsInfo.exchangeIntegralValue
        :
        canBeUsedCommutation,
      integralInUsed:integralsInfo.integral * integralsInfo.exchangeCashValue / integralsInfo.exchangeIntegralValue < canBeUsedCommutation ?
        integralsInfo.integral
        :
        canBeUsedCommutation * integralsInfo.exchangeIntegralValue / integralsInfo.exchangeCashValue,
    };
  } else if (limitType === 2) {
    return integralsInfo.limitIntegral < integralsInfo.integral ?
    {
      commutation:integralsInfo.limitIntegral * integralsInfo.exchangeCashValue / integralsInfo.exchangeIntegralValue < canBeUsedCommutation ?
          integralsInfo.limitIntegral * integralsInfo.exchangeCashValue / integralsInfo.exchangeIntegralValue
          :
          canBeUsedCommutation,
      integralInUsed:integralsInfo.limitIntegral * integralsInfo.exchangeCashValue / integralsInfo.exchangeIntegralValue < canBeUsedCommutation ?
          integralsInfo.limitIntegral
          :
          canBeUsedCommutation * integralsInfo.exchangeIntegralValue / integralsInfo.exchangeCashValue,
    }
      :
    {
      commutation:integralsInfo.integral * integralsInfo.exchangeCashValue / integralsInfo.exchangeIntegralValue < canBeUsedCommutation ?
          integralsInfo.integral * integralsInfo.exchangeCashValue / integralsInfo.exchangeIntegralValue
          :
          canBeUsedCommutation,
      integralInUsed:integralsInfo.integral * integralsInfo.exchangeCashValue / integralsInfo.exchangeIntegralValue < canBeUsedCommutation ?
          integralsInfo.integral
          :
          canBeUsedCommutation * integralsInfo.exchangeIntegralValue / integralsInfo.exchangeCashValue,
    };
  }
  return false;
};
const clearSmallChange = exports.clearSmallChange = function (carryRuleVO, totalPrice) {
  const { transferType, scale } = carryRuleVO;
  // 从order-dish传过来的totalPrice最多有两位小数
  if (transferType === 1) {
    // 四舍五入
    return Math.abs(totalPrice - totalPrice.toFixed(scale)).toFixed(scale);
  } else if (transferType === 2) {
    // 无条件进位
    if (scale === 2) {
      return 0;
    } else if (scale === 1) {
      return totalPrice.toString().length === 4 ?
        (Number(totalPrice.toString().substr(-2)) + 0.1 - totalPrice).toFixed(1)
        :
        0;
    } else if (scale === 0) {
      return Math.ceil(totalPrice) - totalPrice;
    }
  } else if (transferType === 3) {
    // 无条件舍去
    if (scale === 2) {
      return 0;
    } else if (scale === 1) {
      return totalPrice.toString().length === 4 ?
        (totalPrice - Number(totalPrice.toString().substr(-2))).toFixed(2)
        :
        0;
    } else if (scale === 0) {
      return (totalPrice - Math.floor(totalPrice)).toFixed(0);
    }
  }
  return false;
};
// 计算优惠价格
const countDecreasePrice = exports.countDecreasePrice = function (orderedDishesProps, orderSummary, integralsInfo, commercialProps) {
  if (integralsInfo.isChecked && commercialProps.carryRuleVO) {
    return orderSummary.coupon ?
          Number(countIntegralsToCash(
                    getDishesPrice(orderedDishesProps.dishes),
                    orderSummary.coupon,
                    integralsInfo.integralsDetail
                  ).commutation
          ) + Number(
            clearSmallChange(commercialProps.carryRuleVO, getDishesPrice(orderedDishesProps.dishes))
          )
          + Number(orderSummary.coupon)
          :
          Number(countIntegralsToCash(
                    getDishesPrice(orderedDishesProps.dishes),
                    false,
                    integralsInfo.integralsDetail
                  ).commutation
          ) + Number(
            clearSmallChange(commercialProps.carryRuleVO, getDishesPrice(orderedDishesProps.dishes))
          )
          + Number(orderSummary.discount);
  } else if (!integralsInfo.isChecked && commercialProps.carryRuleVO) {
    return orderSummary.coupon ?
          Number(
              clearSmallChange(commercialProps.carryRuleVO, getDishesPrice(orderedDishesProps.dishes))
           )
           + Number(orderSummary.coupon)
           :
           Number(
               clearSmallChange(commercialProps.carryRuleVO, getDishesPrice(orderedDishesProps.dishes))
            )
            + Number(orderSummary.discount);
  }
  return false;
};
// 计算会员价格
exports.countMemberPrice = function (orderedDishes, memberDishesProps) {
  const discountType = memberDishesProps.discountType;
  const disCountPriceList = [];
  if (discountType === 1) {
    // 表示会员折扣
    memberDishesProps.discountList.forEach(
      dishcount => {
        orderedDishes.forEach(
          orderedDish => {
            if (orderedDish.id === dishcount.dishId) {
              disCountPriceList.push(dishcount.value * getDishPrice(orderedDish));
            }
          }
        );
      }
    );
  } else if (discountType === 1) {
    // 表示会员价格
    memberDishesProps.discountList.forEach(
      dishcount => {
        orderedDishes.forEach(
          orderedDish => {
            if (orderedDish.id === dishcount.dishId) {
              disCountPriceList.push(dishcount.value * getDishesCount([orderedDish]));
            }
          }
        );
      }
    );
  }
  return disCountPriceList.reduce((p, c) => p + c, 0);
};
// 计算优惠后的价格
const countFinalPrice = exports.countFinalPrice = function (orderedDishesProps, orderSummary, integralsInfo, commercialProps) {
  return Number(getDishesPrice(orderedDishesProps.dishes))
        - Number(countDecreasePrice(orderedDishesProps, orderSummary, integralsInfo, commercialProps));
};
exports.dataSubmitInfo = function (state, note, receipt) {
  const payMethodScope = state.serviceProps.payMethods.filter(payMethod => payMethod.isChecked)[0].name === '在线支付' ? '1' : '0';
  const integral = countIntegralsToCash(getDishesPrice(state.orderedDishesProps.dishes),
    state.orderSummary.coupon,
    state.serviceProps.integralsInfo.integralsDetail
  ).integralInUsed;
  const needPayPrice = countFinalPrice(
    state.orderedDishesProps, state.orderSummary, state.serviceProps.integralsInfo, state.commercialProps
  );
  const useDiscount = !state.orderSummary.discount ? '0' : '1';
  const serviceApproach = state.serviceProps.isPickupFromFrontDesk.isChecked ? 'pickup' : 'totable';
  const coupId = state.serviceProps.couponsProps.inUseCouponDetail.id ? state.serviceProps.couponsProps.inUseCouponDetail.id : '0';
  let tableId;
  if (serviceApproach === 'totable' && state.tableProps.tables && state.tableProps.tables.length) {
    if (!state.tableProps.tables.filter(table => table.isChecked)) {
      throw new Error('未选择桌台信息');
    } else {
      tableId = state.tableProps.tables.filter(table => table.isChecked)[0].id;
    }
  } else {
    tableId = 0;
  }
  // const tableId = getState().tableProps.tables.filter(table => table.isChecked)[0].id;
  const params = '?name=' + state.customerProps.name
      + '&Invoice=' + receipt + '&note=' + note
      + '&mobile=' + state.customerProps.mobile
      + '&sex=' + state.customerProps.sex
      + '&payMethod=' + payMethodScope
      + '&coupId=' + coupId
      + '&integral=' + Number(integral)
      + '&useDiscount=' + useDiscount
      + '&orderType=' + getUrlParam('type')
      + '&tableId=' + tableId
      + '&peopleCount=' + state.customerProps.customerCount
      + '&serviceApproach=' + serviceApproach
      + '&shopId=' + getUrlParam('shopId')
      + '&needPayPrice=' + needPayPrice;
  console.log(params);
  return params;
};
