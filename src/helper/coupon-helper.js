exports.filterCouponListByStatus = (couponList, status) =>
  couponList.filter(item =>
    item.couponStatus !== status
  );
