const _find = require('lodash.find');
const getDishesPrice = require('../helper/dish-hepler.js').getDishesPrice;
const getDishesCount = require('../helper/dish-hepler.js').getDishesCount;
const getUrlParam = require('../helper/dish-hepler.js').getUrlParam;
const config = require('../config.js');
exports.isPaymentAvaliable = function (payment, diningForm, isPickupFromFrontDesk, sendAreaId, selfPayType, sendPayType) {
  if (diningForm === 0) {
    return payment === 'offline' ? 0 : -1;
  }
  if (getUrlParam('type') === 'WM') {
    return sendAreaId.toString() === '0' ? selfPayType.indexOf(payment) : sendPayType.indexOf(payment);
  }
  return isPickupFromFrontDesk ? selfPayType.indexOf(payment) : sendPayType.indexOf(payment);
};
exports.shouldPaymentAutoChecked = function (payment, diningForm, isPickupFromFrontDesk, selfPayType, sendPayType) {
  if (diningForm === 0) {
    return payment === 'offline';
  }
  if (isPickupFromFrontDesk) {
    return selfPayType.indexOf(',') !== -1 ? payment === selfPayType.split(',')[0] : payment === selfPayType;
  }
  return sendPayType.indexOf(',') !== -1 ? payment === sendPayType.split(',')[0] : payment === sendPayType;
};
exports.getOfflinePaymentName = function (sendAreaId) {
  if (getUrlParam('type') === 'TS') {
    return '货到付款';
  }
  return sendAreaId === 0 ? '线下支付' : '货到付款';
};
const getDishBoxPrice = exports.getDishBoxPrice = function () {
  const dishBoxPrice = localStorage.getItem('dishBoxPrice');
  if (!dishBoxPrice || dishBoxPrice === 0) {
    return false;
  }
  return parseFloat(dishBoxPrice);
};
exports.getSelectedTable = function (tableProps) {
  return {
    area:_find(tableProps.areas, { isChecked:true }),
    table: _find(tableProps.tables, { isChecked:true }),
  };
};
exports.initializeAreaAdnTableProps = function (areaList, tableList) {
  if (!areaList || !tableList) {
    return {
      areaList:null,
      tableList:null,
      isEditable:false,
    };
  }
  const tableId = getUrlParam('tableId');
  if (!tableId) {
    tableList.forEach(table => table.id = parseInt(table.tableID, 10));
    return {
      areaList,
      tableList,
      isEditable:true,
    };
  }
  tableList.forEach(
    table => table.synFlag === tableId ?
      (_find(areaList, { id:table.areaId }).isChecked = true, table.isChecked = true)
      :
      false
  );
  if (_find(tableList, { isChecked:true }) !== undefined) {
    tableList.forEach(table => table.id = parseInt(table.tableID, 10));
    return {
      areaList,
      tableList,
      isEditable:false,
    };
  }
  return {
    areaList:null,
    tableList:null,
    isEditable:false,
  };
};
// 计算配送费
const countDeliveryPrice = exports.countDeliveryPrice = function (deliveryProps) {
  if (getUrlParam('type') === 'TS') {
    return false;
  }
  if (!deliveryProps || !deliveryProps.deliveryPrice) {
    return false;
  }
  return deliveryProps.deliveryPrice;
};
const countDeliveryRemission = exports.countDeliveryRemission = function (dishesPrice, deliveryProps) {
  if (getUrlParam('type') === 'TS') {
    return false;
  }
  if (!deliveryProps || !deliveryProps.freeDeliveryPrice || !deliveryProps.deliveryPrice) {
    return false;
  }
  if (dishesPrice >= deliveryProps.freeDeliveryPrice) {
    return deliveryProps.deliveryPrice;
  }
  return false;
};
// 计算会员价格

exports.countMemberPrice = function (isDiscountChecked, orderedDishes, memberDishesProps) {
  if (isDiscountChecked) {
    return false;
  }
  const discountType = memberDishesProps.discountType;
  const disCountPriceList = [];
  if (discountType === 1) {
    memberDishesProps.discountList.forEach(
      dishcount => {
        orderedDishes.forEach(
          orderedDish => {
            if (orderedDish.id === dishcount.dishId) {
              disCountPriceList.push(
                parseFloat(((1 - parseFloat(dishcount.value) / 10) * getDishesCount([orderedDish]) * orderedDish.marketPrice).toFixed(2))
              );
            }
          }
        );
      }
    );
  } else if (discountType === 2) {
    // 表示会员价格
    memberDishesProps.discountList.forEach(
      dishcount => {
        orderedDishes.forEach(
          orderedDish => {
            if (orderedDish.id === dishcount.dishId) {
              disCountPriceList.push(
                parseFloat((dishcount.value * getDishesCount([orderedDish])).toFixed(2))
              );
            }
          }
        );
      }
    );
  }
  return disCountPriceList.reduce((p, c) => p + c, 0);
};
// 计算优惠券多少价格
const countPriceByCoupons = exports.countPriceByCoupons = function (coupon, totalPrice) {
  if (coupon.couponType === 1) {
    // '满减券'
    return coupon.coupRuleBeanList[0].ruleValue;
  } else if (coupon.couponType === 2) {
    // '折扣券';
    return parseFloat((totalPrice * (1 - Number(coupon.coupRuleBeanList[0].ruleValue) / 10)).toFixed(2));
  } else if (coupon.couponType === 3) {
    // '礼品券';
    return 0;
  } else if (coupon.couponType === 4) {
    // '现金券';
    return coupon.coupRuleBeanList[0].ruleValue;
  }
  return true;
};
const countIntegralsToCash = exports.countIntegralsToCash = function (canBeUsedCommutation, integralsInfo) {
  if (canBeUsedCommutation <= 0 || !integralsInfo) {
    return {
      commutation:0,
      integralInUsed:0,
    };
  }
  let limitType = integralsInfo.limitType;
  // 取余数  向下取整
  const canUsesIntegralTimes = Math.floor(canBeUsedCommutation / integralsInfo.exchangeCashValue);
  if (limitType === 1) {
    const integralInUsed = canUsesIntegralTimes * integralsInfo.exchangeIntegralValue < integralsInfo.integral ?
      canUsesIntegralTimes * integralsInfo.exchangeIntegralValue
      :
      Math.floor(integralsInfo.integral / integralsInfo.exchangeIntegralValue) * integralsInfo.exchangeIntegralValue;
    return {
      commutation:integralInUsed / integralsInfo.exchangeIntegralValue * integralsInfo.exchangeCashValue,
      integralInUsed,
    };
  } else if (limitType === 2) {
    if (integralsInfo.integral > integralsInfo.limitIntegral) {
      const moneyLimit = Math.floor(integralsInfo.limitIntegral / integralsInfo.exchangeIntegralValue) * integralsInfo.exchangeCashValue;
      return {
        commutation:moneyLimit > canBeUsedCommutation ?
          Math.floor(canBeUsedCommutation / integralsInfo.exchangeCashValue) * integralsInfo.exchangeCashValue
          :
          moneyLimit,
        integralInUsed:moneyLimit > canBeUsedCommutation ?
          Math.floor(canBeUsedCommutation / integralsInfo.exchangeCashValue) * integralsInfo.exchangeIntegralValue
          :
          Math.floor(integralsInfo.limitIntegral / integralsInfo.exchangeIntegralValue) * integralsInfo.exchangeIntegralValue,
      };
    }
    const noLimitMoney = Math.floor(integralsInfo.integral / integralsInfo.exchangeIntegralValue) * integralsInfo.exchangeCashValue;
    return {
      commutation:noLimitMoney > canBeUsedCommutation ?
        Math.floor(canBeUsedCommutation / integralsInfo.exchangeCashValue) * integralsInfo.exchangeCashValue
        :
        noLimitMoney,
      integralInUsed:noLimitMoney > canBeUsedCommutation ?
        Math.floor(canBeUsedCommutation / integralsInfo.exchangeCashValue) * integralsInfo.exchangeIntegralValue
        :
         Math.floor(integralsInfo.integral / integralsInfo.exchangeIntegralValue) * integralsInfo.exchangeIntegralValue,
    };
  }
  return false;
};
//  自动抹零现规则是在积分，优惠券，折扣换算完以后才执行
//  计算优惠券信息是countPriceByCoupons 折扣信息为serviceProps.discountProps.inUseDiscount,已经计算好了的
const countTotalPriceWithoutBenefit = exports.countTotalPriceWithoutBenefit = function (dishesPrice, deliveryProps) {
  //  计算菜品初始价格加配送费和配送费优惠
  return parseFloat((dishesPrice + getDishBoxPrice() + Number(countDeliveryPrice(deliveryProps))).toFixed(2));
};


const countPriceWithCouponAndDiscount = exports.countPriceWithCouponAndDiscount = function (dishesPrice, serviceProps) {
  // 计算出优惠券和会员价后的价格
  let totalPrice = countTotalPriceWithoutBenefit(dishesPrice, serviceProps.deliveryProps);
  if (!serviceProps.couponsProps.inUseCoupon && !serviceProps.discountProps.inUseDiscount) {
    // 即没有使用任何优惠
    totalPrice = parseFloat(totalPrice.toFixed(2));
  } else if (serviceProps.couponsProps.inUseCoupon) {
    totalPrice = parseFloat((totalPrice - countPriceByCoupons(serviceProps.couponsProps.inUseCouponDetail, totalPrice)).toFixed(2));
  } else if (serviceProps.discountProps.inUseDiscount) {
    totalPrice = parseFloat((totalPrice - serviceProps.discountProps.inUseDiscount).toFixed(2));
  }
  return totalPrice;
};


// 处理优惠信息
const countPriceWithBenefit = exports.countPriceWithBenefit = function (dishesPrice, serviceProps) {
  const totalPrice = Number(countPriceWithCouponAndDiscount(dishesPrice, serviceProps));
  // 至此处理完了配送费和优惠券 还有折扣信息  需要考虑积分抵扣了
  const priceWithIntergrals = serviceProps.integralsInfo.isChecked ?
    totalPrice - countIntegralsToCash(totalPrice, serviceProps.integralsInfo.integralsDetail).commutation
    :
    totalPrice;
  // 至此各种优惠信息已经处理完
  return parseFloat(priceWithIntergrals.toFixed(2));
};


const clearSmallChange = exports.clearSmallChange = function (carryRuleVO, dishesPrice, serviceProps) {
  // serviceProps.integralsInfo.integralsDetail  前提条件
  const { transferType, scale } = carryRuleVO;
  const priceWithIntergrals = countPriceWithBenefit(dishesPrice, serviceProps);
  if (transferType === 1) {
    // 四舍五入
    return {
      smallChange:parseFloat((priceWithIntergrals - parseFloat(priceWithIntergrals.toFixed(scale))).toFixed(2)),
      priceWithClearSmallChange:parseFloat((
        priceWithIntergrals - parseFloat(
          Math.abs(priceWithIntergrals - parseFloat(priceWithIntergrals.toFixed(scale))).toFixed(scale)
        )).toFixed(scale)
      ),
    };
  } else if (transferType === 2) {
    // 无条件进位
    if (scale === 2) {
      return {
        smallChange:0,
        priceWithClearSmallChange:priceWithIntergrals,
      };
    } else if (scale === 1) {
      return priceWithIntergrals.toString().indexOf('.') !== -1 ?
      {
        smallChange:priceWithIntergrals.toString().split('.')[1].length === 1 ?
        0
        :
        parseFloat((priceWithIntergrals - Math.floor(priceWithIntergrals * 10 + 1) / 10).toFixed(2)),
        priceWithClearSmallChange:priceWithIntergrals.toString().split('.')[1].length === 1 ?
        priceWithIntergrals
        :
        parseFloat((Math.floor(priceWithIntergrals * 10 + 1) / 10).toFixed(2)),
      }
        :
      {
        smallChange:0,
        priceWithClearSmallChange:priceWithIntergrals,
      };
    } else if (scale === 0) {
      return {
        smallChange:parseFloat((priceWithIntergrals - Math.ceil(priceWithIntergrals)).toFixed(2)),
        priceWithClearSmallChange:Math.ceil(priceWithIntergrals),
      };
    }
  } else if (transferType === 3) {
    // 无条件舍去
    if (scale === 2) {
      return {
        smallChange:0,
        priceWithClearSmallChange:priceWithIntergrals,
      };
    } else if (scale === 1) {
      return priceWithIntergrals.toString().indexOf('.') !== -1 ?
      {
        smallChange:priceWithIntergrals.toString().split('.')[1].length === 1 ?
        0
        :
        parseFloat((priceWithIntergrals - Math.floor(priceWithIntergrals * 10) / 10).toFixed(2)),
        priceWithClearSmallChange:priceWithIntergrals.toString().split('.')[1].length === 1 ?
        priceWithIntergrals
        :
        parseFloat((Math.floor(priceWithIntergrals * 10) / 10).toFixed(2)),
      }
        :
      {
        smallChange:0,
        priceWithClearSmallChange:priceWithIntergrals,
      };
    } else if (scale === 0) {
      return {
        smallChange:parseFloat((priceWithIntergrals - Math.floor(priceWithIntergrals)).toFixed(2)),
        priceWithClearSmallChange:Math.floor(priceWithIntergrals),
      };
    }
  }
  return false;
};


// 计算优惠价格;
const countDecreasePrice = exports.countDecreasePrice = function (orderedDishesProps, serviceProps, commercialProps) {
  const dishesPrice = getDishesPrice(orderedDishesProps.dishes);
  const clearSmallChangeProps = clearSmallChange(commercialProps.carryRuleVO, dishesPrice, serviceProps);
  // smallChange>=0表示总数减少
  return clearSmallChangeProps.smallChange >= 0 ?
          parseFloat((countTotalPriceWithoutBenefit(dishesPrice, serviceProps.deliveryProps)
          - clearSmallChangeProps.priceWithClearSmallChange + Number(countDeliveryRemission(dishesPrice, serviceProps.deliveryProps))).toFixed(2))
          :
          parseFloat((countTotalPriceWithoutBenefit(dishesPrice, serviceProps.deliveryProps)
          - countPriceWithBenefit(dishesPrice, serviceProps) + Number(countDeliveryRemission(dishesPrice, serviceProps.deliveryProps))).toFixed(2));
};
exports.countFinalNeedPayMoney = function (orderedDishesProps, serviceProps, commercialProps) {
  const dishesPrice = getDishesPrice(orderedDishesProps.dishes);
  const clearSmallChangeProps = clearSmallChange(commercialProps.carryRuleVO, dishesPrice, serviceProps);
  const initializePayMement = countTotalPriceWithoutBenefit(dishesPrice, serviceProps.deliveryProps) -
    countDecreasePrice(orderedDishesProps, serviceProps, commercialProps);
  return clearSmallChangeProps.smallChange >= 0 ?
    parseFloat(initializePayMement.toFixed(2))
    :
    parseFloat((initializePayMement - parseFloat(clearSmallChangeProps.smallChange)).toFixed(2));
};

exports.getSubmitUrlParams = function (state, note, receipt) {
  const name = state.customerProps.name;
  if (!name) {
    return { success:false, msg:'未填写姓名' };
  }
  const payMethodScope = state.serviceProps.payMethods.filter(payMethod => payMethod.isChecked)[0].name === '在线支付' ? '1' : '0';
  const dishesPrice = getDishesPrice(state.orderedDishesProps.dishes);
  const integral = state.serviceProps.integralsInfo.isChecked ? countIntegralsToCash(
    Number(countPriceWithCouponAndDiscount(dishesPrice, state.serviceProps)),
    state.serviceProps.integralsInfo.integralsDetail
  ).integralInUsed : false;
  const needPayPrice = clearSmallChange(
    state.commercialProps.carryRuleVO,
    dishesPrice,
    state.serviceProps
  ).priceWithClearSmallChange;
  const type = getUrlParam('type');
  const useDiscount = !state.serviceProps.discountProps.inUseDiscount ? '0' : '1';
  const serviceApproach = state.serviceProps.isPickupFromFrontDesk.isChecked ? 'pickup' : 'totable';
  const coupId = state.serviceProps.couponsProps.inUseCouponDetail.id ? state.serviceProps.couponsProps.inUseCouponDetail.id : '0';
  let tableId;
  if (type === 'TS' && serviceApproach === 'totable' && state.tableProps.tables && state.tableProps.tables.length) {
    if (state.tableProps.tables.filter(table => table.isChecked).length === 0) {
      return { success:false, msg:'未选择桌台信息' };
    }
    tableId = state.tableProps.tables.filter(table => table.isChecked)[0].id;
  } else {
    tableId = 0;
  }
  let params;
  if (type === 'WM') {
    const selectedAddress = state.customerProps.addresses !== null && state.customerProps.addresses.length !== 0 ?
          state.customerProps.addresses.filter(address => address.isChecked)[0].address
          :
          0;
    const selectedAddressId = state.customerProps.addresses !== null && state.customerProps.addresses.length !== 0 ?
          state.customerProps.addresses.filter(address => address.isChecked)[0].id
          :
          0;
    const toShopFlag = state.serviceProps.sendAreaId === 0 ? '1' : '0';
    params = '?name=' + state.customerProps.name
        + '&Invoice=' + receipt + '&memo=' + note
        + '&mobile=' + state.customerProps.mobile
        + '&sex=' + state.customerProps.sex
        + '&payMethod=' + payMethodScope
        + '&coupId=' + coupId
        + '&integral=' + Number(integral)
        + '&useDiscount=' + useDiscount
        + '&orderType=WM'
        + '&peopleCount=' + state.customerProps.customerCount
        + '&shopId=' + getUrlParam('shopId')
        + '&needPayPrice=' + needPayPrice
        + '&time=' + state.timeProps.selectedDateTime.date + '%20' + (state.timeProps.selectedDateTime.time || '')
        + '&address=' + selectedAddress
        + '&memberAddressId=' + selectedAddressId
        + '&sendAreaId=' + state.serviceProps.sendAreaId
        + '&toShopFlag=' + toShopFlag;
  } else {
    params = '?name=' + state.customerProps.name
        + '&Invoice=' + receipt + '&memo=' + note
        + '&mobile=' + state.customerProps.mobile
        + '&sex=' + state.customerProps.sex
        + '&payMethod=' + payMethodScope
        + '&coupId=' + coupId
        + '&integral=' + Number(integral)
        + '&useDiscount=' + useDiscount
        + '&orderType=TS'
        + '&tableId=' + tableId
        + '&peopleCount=' + state.customerProps.customerCount
        + '&serviceApproach=' + serviceApproach
        + '&shopId=' + getUrlParam('shopId')
        + '&needPayPrice=' + needPayPrice;
  }
  return { success:true, params };
};

exports.initializeTimeTable = times => {
  if (!times || typeof times !== 'object') {
    return times;
  }

  const todayTime = times[new Date().toISOString().substr(0, 10)];
  if (todayTime && todayTime.length) {
    todayTime.unshift(0);
  }
  return times;
};
exports.setCallbackUrl = function (id) {
  const callbackUrlWithEncode = getUrlParam('type') === 'TS' ?
    encodeURIComponent(
      location.host + '/order/orderallDetail?shopId=' + getUrlParam('shopId') + '&orderId=' + id
    )
    :
    encodeURIComponent(
      location.host + '/order/takeOutDetail?shopId=' + getUrlParam('shopId') + '&orderId=' + id
    );
  sessionStorage.setItem('rurl_payDetaill', callbackUrlWithEncode);
};
exports.getMoreDishesUrl = function () {
  const type = getUrlParam('type');
  const shopId = getUrlParam('shopId');
  const tableId = getUrlParam('tableId');
  const initializeUrl = type === 'TS' ?
      config.getMoreTSDishesURL + '?type=TS&shopId=' + shopId
      :
      config.getMoreWMDishesURL + '?type=WM&shopId=' + shopId;
  return !tableId ? initializeUrl : initializeUrl + '&tableId=' + tableId;
};
