const commonHelper = require('./common-helper');

exports.filterCouponListByStatus = (couponList, status) =>
  couponList.filter(item =>
    item.couponStatus === status
  );

exports.formateDate = (date) => {
  const replaceStr = '-';
  if (date) {
    return date.toString().replace(new RegExp(replaceStr, 'gm'), '/').substring(0, 10);
  }
  return false;
};

exports.formateOriginDate = (date) => {
  function appendZero(obj) {
    if (obj < 10) return `0${obj}`;
    return obj;
  }

  if (date) {
    const time = new Date(date);
    const getFullYear = time.getFullYear();
    const getMonth = time.getMonth() + 1;
    const getDate = time.getDate();
    return `${getFullYear}/${appendZero(getMonth)}/${appendZero(getDate)}`;
  }
  return false;
};

const formateInstruction = exports.formateInstruction = (information) => {
  if (information) {
    return information.replace(/<\/(h[1-6]|p|li)>/g, '</$1>\n')
           .replace(/<\/?.+?>/g, '')
           .replace(/&lt;/g, '<')
           .replace(/&gt;/g, '>')
           .replace(/&nbsp;/g, '')
           .trim();
  }
  return '';
};

const formateWeixinTime = exports.formateWeixinTime = (advancedInfo) => {
  function appendZero(obj) {
    if (obj < 10) return `0${obj}`;
    return obj;
  }
  if (advancedInfo.timeLimit && advancedInfo.timeLimit.length !== 0) {
    return advancedInfo.timeLimit.map((item, index) => {
      let day = '';
      switch (item.type) {
        case 'SUNDAY': day = '周日'; break;
        case 'MONDAY': day = '周一'; break;
        case 'TUESDAY': day = '周二'; break;
        case 'WEDNESDAY': day = '周三'; break;
        case 'THURSDAY': day = '周四'; break;
        case 'FRIDAY': day = '周五'; break;
        case 'SATURDAY': day = '周六'; break;
        default: day = item.type; break;
      }

      return `${day} ${appendZero(item.beginHour)}:${appendZero(item.beginMinute)} ~ ${appendZero(item.endHour)}:${appendZero(item.endMinute)} \n`;
    });
  }
  return false;
};

const getCouponRuleVale = exports.getCouponRuleVale = (couponType, itemInner) => {
  if (
    itemInner.ruleName === 'offerValue' ||
    itemInner.ruleName === 'zkValue' ||
    itemInner.ruleName === 'giftName' ||
    itemInner.ruleName === 'faceValue') {
    return itemInner.ruleValue || '--';
  }
  return false;
};

// weixin优惠券参数设置
exports.weixinCouponParam = (item) => {
  let ruleVale = '';
  let typeClass = '';
  let typeUnit = '';
  let statusWord = '';
  let couponName = '';
  let fullValue = '';
  let instructions = '';
  const codeNumber = item.code;
  const periodStart = item.beginDate ? item.beginDate.substring(0, 5) || '00:00' : '00:00';
  const periodEnd = item.endDate ? item.endDate.substring(0, 5) || '00:00' : '00:00';
  const giftFontStyle = {};

  switch (item.card.cardType) {
    case 'DISCOUNT':
      typeClass = 'zhekou';
      typeUnit = ' 折  折扣券';
      couponName = '折扣券';
      instructions = [
        formateInstruction(item.card.discount.baseInfo.description),
        formateWeixinTime(item.card.discount.advancedInfo),
      ];
      fullValue = item.card.discount.leastCost || 0;
      ruleVale = ((100 - item.card.discount.discount) / 10).toFixed(1);
      break;
    case 'CASH':
      typeClass = 'xianjin';
      typeUnit = ' 元  现金券';
      couponName = '现金券';
      instructions = [
        formateInstruction(item.card.cash.baseInfo.description),
        formateWeixinTime(item.card.cash.advancedInfo),
      ];
      fullValue = item.card.cash.leastCost || 0;
      ruleVale = item.card.cash.reduceCost.toString() || '';
      break;
    default: break;
  }

  statusWord = '有效期';

  return {
    typeClass,
    giftFontStyle,
    typeUnit,
    ruleVale,
    fullValue,
    statusWord,
    codeNumber,
    instructions,
    couponName,
    periodStart,
    periodEnd,
  };
};

// loyalty优惠券参数设置

exports.loyaltyCouponParam = (item) => {
  let ruleVale = '';
  let typeClass = '';
  let typeUnit = '';
  let giftUnitBefore = '';
  let giftFontSize = '';
  let giftVerticalAlign = '';
  let giftLineHeight = '';
  let statusWord = '';
  let couponName = '';
  let giftFontStyle = {};
  const fullValue = item.fullValue;
  const codeNumber = item.codeNumber;
  const renderWeek = commonHelper.renderDay(item.week);
  const periodStart = item.periodStart ? item.periodStart.substring(0, 5) || '00:00' : '00:00';
  const periodEnd = item.periodEnd ? item.periodEnd.substring(0, 5) || '00:00' : '00:00';

  const instructions = [formateInstruction(item.instructions)];
  if (renderWeek) {
    instructions.push(`${renderWeek.substring(0, renderWeek.length - 1)}可用`);
  } else {
    /* instructions.push('整周可用');*/
  }
  instructions.push(`本券${item.usableCommercialDesc}`);

  item.coupRuleBeanList.forEach((itemInner, indexInner) => {
    const vale = getCouponRuleVale(item.couponType, itemInner);
    if (vale) { ruleVale = vale; }
  });
  switch (item.couponType) {
    case 1: typeClass = 'manjian'; typeUnit = ' 元  满减券'; couponName = '满减劵'; break;
    case 2: typeClass = 'zhekou'; typeUnit = ' 折  折扣券'; couponName = '折扣券'; break;
    case 3:
      typeClass = 'lipin';
      giftUnitBefore = '送 ';
      couponName = '礼品券';
      giftFontSize = '1.2em';
      giftVerticalAlign = '0px';
      giftLineHeight = '1.2em';
      giftFontStyle = { fontSize:giftFontSize, verticalAlign:giftVerticalAlign, lineHeight:giftLineHeight };
      break;
    case 4: typeClass = 'xianjin'; typeUnit = ' 元  现金券'; couponName = '现金券'; break;
    default: break;
  }

  if (item.couponStatus !== 1) {
    if (item.couponStatus === 3) {
      typeClass = 'shixiao yiguoqi';
    } else {
      typeClass = 'shixiao yishiyong';
    }
  }

  statusWord = '有效期';

  return {
    typeClass,
    giftFontStyle,
    giftUnitBefore,
    typeUnit,
    ruleVale,
    fullValue,
    periodStart,
    periodEnd,
    statusWord,
    codeNumber,
    instructions,
    couponName,
  };
};
