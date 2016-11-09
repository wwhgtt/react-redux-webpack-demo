exports.filterCouponListByStatus = (couponList, status) =>
  couponList.filter(item =>
    item.couponStatus === status
  );

exports.formateDate = (date) => {
  const replaceStr = '-';
  if (date) {
    return date.toString().replace(new RegExp(replaceStr, 'gm'), '/');
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

exports.formateInstruction = (information) => {
  const reg = new RegExp('<[^<]*>', 'gi');    // 标签的正则表达式
  if (information.replace(reg, '')) {
    return information.replace(/<p>/ig, '').replace(/<\/p>/ig, '\n');
  }
  return information.replace(reg, '');
};

