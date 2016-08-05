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
exports.shouldPaymentAutoChecked = function (payment, diningForm, isPickupFromFrontDesk, sendAreaId, selfPayType, sendPayType) {
  if (diningForm === 0) {
    return payment === 'offline';
  }
  if (getUrlParam('type') === 'WM') {
    if (sendAreaId.toString() === '0') {
      return selfPayType.indexOf(',') !== -1 ? payment === selfPayType.split(',')[0] : payment === selfPayType;
    }
    return sendPayType.indexOf(',') !== -1 ? payment === sendPayType.split(',')[0] : payment === sendPayType;
  }
  if (isPickupFromFrontDesk) {
    return selfPayType.indexOf(',') !== -1 ? payment === selfPayType.split(',')[0] : payment === selfPayType;
  }
  return sendPayType.indexOf(',') !== -1 ? payment === sendPayType.split(',')[0] : payment === sendPayType;
};
exports.getOfflinePaymentName = function (sendAreaId) {
  if (getUrlParam('type') === 'TS') {
    return '线下支付';
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
  if (!areaList || !tableList || !areaList.length || !tableList.length) {
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
  // url中有传tableID且能找到的情况下  返回找到的tableID   如果没有找到的情况下返回的是
  // 空的areaList和tableList 这种情况会与后台没有返回数据的情况重合 前端无法判断  所以
  // 将这种情况下的isEditable设置为true  作为区分
  return {
    areaList:null,
    tableList:null,
    isEditable:true,
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
  if (!deliveryProps || deliveryProps.freeDeliveryPrice < 0 || deliveryProps.deliveryPrice < 0) {
    return false;
  }
  if (dishesPrice >= deliveryProps.freeDeliveryPrice) {
    return deliveryProps.deliveryPrice;
  }
  return false;
};
// 计算会员价格 优惠了多少钱

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
                parseFloat(((orderedDish.marketPrice - dishcount.value) * getDishesCount([orderedDish])).toFixed(2))
              );
            }
          }
        );
      }
    );
  }
  return disCountPriceList.reduce((p, c) => p + c, 0);
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
// 计算优惠券多少价格
const countPriceByCoupons = exports.countPriceByCoupons = function (coupon, totalPrice, deliveryProps) {
  const totalPriceWithoutDeliveryRemission = parseFloat((totalPrice - Number(countDeliveryRemission(totalPrice, deliveryProps))).toFixed(2));
  if (coupon.couponType === 1) {
    // '满减券'
    return coupon.coupRuleBeanList.filter(couponDetaile => couponDetaile.ruleName === 'offerValue')[0].ruleValue;
  } else if (coupon.couponType === 2) {
    // '折扣券';
    return parseFloat(
      (
        totalPriceWithoutDeliveryRemission *
        (1 - Number(coupon.coupRuleBeanList.filter(couponDetaile => couponDetaile.ruleName === 'zkValue')[0].ruleValue) / 10)
      ).toFixed(2)
    );
  } else if (coupon.couponType === 3) {
    // '礼品券';
    return 0;
  } else if (coupon.couponType === 4) {
    // '现金券';
    return coupon.coupRuleBeanList.filter(couponDetaile => couponDetaile.ruleName === 'faceValue')[0].ruleValue
      <= totalPriceWithoutDeliveryRemission ?
      coupon.coupRuleBeanList.filter(couponDetaile => couponDetaile.ruleName === 'faceValue')[0].ruleValue : totalPriceWithoutDeliveryRemission;
  }
  return true;
};

const countPriceWithCouponAndDiscount = exports.countPriceWithCouponAndDiscount = function (dishesPrice, serviceProps) {
  // 计算出优惠券和会员价后的价格
  let totalPrice = countTotalPriceWithoutBenefit(dishesPrice, serviceProps.deliveryProps);
  if (!serviceProps.couponsProps.inUseCoupon && !serviceProps.discountProps.inUseDiscount) {
    // 即没有使用任何优惠
    totalPrice = parseFloat(totalPrice.toFixed(2));
  } else if (serviceProps.couponsProps.inUseCoupon) {
    totalPrice = parseFloat(
      (totalPrice - countPriceByCoupons(serviceProps.couponsProps.inUseCouponDetail, totalPrice, serviceProps.deliveryProps)
    ).toFixed(2));
  } else if (serviceProps.discountProps.inUseDiscount) {
    totalPrice = parseFloat((totalPrice - serviceProps.discountProps.inUseDiscount).toFixed(2));
  }
  return totalPrice;
};


// 处理优惠信息
const countPriceWithBenefit = exports.countPriceWithBenefit = function (dishesPrice, serviceProps) {
  const totalPrice = Number(countPriceWithCouponAndDiscount(dishesPrice, serviceProps));
  // 至此处理完了配送费和优惠券 还有折扣信息  需要考虑积分抵扣了
  const IntergralsPrice = totalPrice - Number(countDeliveryRemission(dishesPrice, serviceProps.deliveryProps));
  const priceWithIntergrals = serviceProps.integralsInfo.isChecked ?
    totalPrice - countIntegralsToCash(IntergralsPrice, serviceProps.integralsInfo.integralsDetail).commutation
    :
    totalPrice;
  // 至此各种优惠信息已经处理完
  return parseFloat(priceWithIntergrals.toFixed(2));
};


const clearSmallChange = exports.clearSmallChange = function (carryRuleVO, dishesPrice, serviceProps) {
  // serviceProps.integralsInfo.integralsDetail  前提条件
  const { transferType, scale } = carryRuleVO;
  const priceWithBenefit = countPriceWithBenefit(dishesPrice, serviceProps);
  if (transferType === 1) {
    // 四舍五入
    return {
      smallChange:parseFloat((priceWithBenefit - parseFloat(priceWithBenefit.toFixed(scale))).toFixed(2)),
      priceWithClearSmallChange:parseFloat((
        priceWithBenefit - parseFloat(
          Math.abs(priceWithBenefit - parseFloat(priceWithBenefit.toFixed(scale))).toFixed(scale)
        )).toFixed(scale)
      ),
    };
  } else if (transferType === 2) {
    // 无条件进位
    if (scale === 2) {
      return {
        smallChange:0,
        priceWithClearSmallChange:priceWithBenefit,
      };
    } else if (scale === 1) {
      return priceWithBenefit.toString().indexOf('.') !== -1 ?
      {
        smallChange:priceWithBenefit.toString().split('.')[1].length === 1 ?
        0
        :
        parseFloat((priceWithBenefit - Math.floor(priceWithBenefit * 10 + 1) / 10).toFixed(2)),
        priceWithClearSmallChange:priceWithBenefit.toString().split('.')[1].length === 1 ?
        priceWithBenefit
        :
        parseFloat((Math.floor(priceWithBenefit * 10 + 1) / 10).toFixed(2)),
      }
        :
      {
        smallChange:0,
        priceWithClearSmallChange:priceWithBenefit,
      };
    } else if (scale === 0) {
      return {
        smallChange:parseFloat((priceWithBenefit - Math.ceil(priceWithBenefit)).toFixed(2)),
        priceWithClearSmallChange:Math.ceil(priceWithBenefit),
      };
    }
  } else if (transferType === 3) {
    // 无条件舍去
    if (scale === 2) {
      return {
        smallChange:0,
        priceWithClearSmallChange:priceWithBenefit,
      };
    } else if (scale === 1) {
      return priceWithBenefit.toString().indexOf('.') !== -1 ?
      {
        smallChange:priceWithBenefit.toString().split('.')[1].length === 1 ?
        0
        :
        parseFloat((priceWithBenefit - Math.floor(priceWithBenefit * 10) / 10).toFixed(2)),
        priceWithClearSmallChange:priceWithBenefit.toString().split('.')[1].length === 1 ?
        priceWithBenefit
        :
        parseFloat((Math.floor(priceWithBenefit * 10) / 10).toFixed(2)),
      }
        :
      {
        smallChange:0,
        priceWithClearSmallChange:priceWithBenefit,
      };
    } else if (scale === 0) {
      return {
        smallChange:parseFloat((priceWithBenefit - Math.floor(priceWithBenefit)).toFixed(2)),
        priceWithClearSmallChange:Math.floor(priceWithBenefit),
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
  let sex = state.customerProps.sex;
  if (!sex) {
    sex = -1;
  }
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
  // 金额为0的时候只有线下支付
  let payMethodScope = null;
  if (needPayPrice !== 0) {
    payMethodScope = state.serviceProps.payMethods.filter(payMethod => payMethod.isChecked)[0].name === '在线支付' ? '1' : '0';
  } else {
    payMethodScope = '0';
  }

  const type = getUrlParam('type');
  const useDiscount = !state.serviceProps.discountProps.inUseDiscount ? '0' : '1';
  const serviceApproach = state.serviceProps.isPickupFromFrontDesk.isChecked ? 'pickup' : 'totable';
  const coupId = state.serviceProps.couponsProps.inUseCoupon &&
                state.serviceProps.couponsProps.inUseCouponDetail.id ?
                state.serviceProps.couponsProps.inUseCouponDetail.id
                :
                '0';
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
    const sendAreaId = state.serviceProps.sendAreaId;
    const selectedDateTime = state.timeProps.selectedDateTime;
    let selectedAddress = '';
    if (sendAreaId === 0) {
      // 表示到店取餐
      selectedAddress = '';
    } else if (state.customerProps.addresses instanceof Array && state.customerProps.addresses.length) {
      selectedAddress = state.customerProps.addresses.filter(address => address.isChecked)[0].address;
    } else {
      return { success:false, msg:'请选择送餐地址' };
    }

    if (!selectedDateTime.date) {
      return { success:false, msg: `请选择${sendAreaId === 0 ? '取餐' : '送达'}时间` };
    }
    const selectedAddressId = state.customerProps.addresses instanceof Array && state.customerProps.addresses.length ?
          state.customerProps.addresses.filter(address => address.isChecked)[0].id
          :
          0;
    const toShopFlag = state.serviceProps.sendAreaId === 0 ? '1' : '0';
    params = '?name=' + state.customerProps.name
        + '&Invoice=' + receipt + '&memo=' + note
        + '&mobile=' + state.customerProps.mobile
        + '&sex=' + sex
        + '&payMethod=' + payMethodScope
        + '&coupId=' + coupId
        + '&integral=' + Number(integral)
        + '&useDiscount=' + useDiscount
        + '&orderType=WM'
        + '&shopId=' + getUrlParam('shopId')
        + '&needPayPrice=' + needPayPrice
        + '&address=' + selectedAddress
        + '&memberAddressId=' + selectedAddressId
        + '&sendAreaId=' + sendAreaId
        + '&toShopFlag=' + toShopFlag;
    if (selectedDateTime.time) {
      if (selectedDateTime.time !== '立即取餐' && selectedDateTime.time !== '立即送餐') {
        params += `&time=${selectedDateTime.date}%20${selectedDateTime.time}`;
      }
    }
  } else {
    params = '?name=' + state.customerProps.name
        + '&Invoice=' + receipt + '&memo=' + note
        + '&mobile=' + state.customerProps.mobile
        + '&sex=' + sex
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
  return { success:true, params, needPayPrice };
};

exports.initializeTimeTable = (times) => {
  if (!times || typeof times !== 'object') {
    return times;
  }

  const now = new Date();
  const todayTimes = times[now.toISOString().substr(0, 10)];
  if (!todayTimes || !todayTimes.length) {
    return times;
  }
  const firstItem = todayTimes[0];
  if (['立即取餐', '立即送餐'].indexOf(firstItem) !== -1) {
    todayTimes[0] = 0;
  }
  return times;
};
exports.setCallbackUrl = function (id) {
  const callbackUrlWithEncode = getUrlParam('type') === 'TS' ?
    encodeURIComponent(
      'http://' + location.host + '/order/orderallDetail?shopId=' + getUrlParam('shopId') + '&orderId=' + id
    )
    :
    encodeURIComponent(
      'http://' + location.host + '/order/takeOutDetail?shopId=' + getUrlParam('shopId') + '&orderId=' + id
    );
  sessionStorage.setItem('rurl_payDetaill', JSON.stringify(callbackUrlWithEncode));
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

exports.getDefaultSelectedDateTime = (timeTable) => {
  const selectedDateTime = { date: '', time: '' };
  if (!timeTable) {
    return selectedDateTime;
  }

  const todayStr = new Date().toISOString().substr(0, 10);
  let defaultDate = '';
  for (const key in timeTable) {
    if (!timeTable.hasOwnProperty(key)) {
      continue;
    }

    const firstValue = timeTable[key] && timeTable[key][0];
    const isToday = todayStr === key;
    if (!defaultDate || isToday) {
      selectedDateTime.date = defaultDate = key;
      selectedDateTime.time = firstValue;
      if (isToday) {
        break;
      }
    }
  }
  return selectedDateTime;
};
exports.isEmptyObject = (obj) => {
  for (let n in obj) { console.log(n); return false; }
  return true;
};
