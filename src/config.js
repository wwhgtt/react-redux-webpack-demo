let apiBase;
let requestOptions;

switch (process.env.NODE_ENV) {
  case 'production':
    apiBase = `http://${process.env.PROD_HOST}`;
    requestOptions = {
      method: 'GET',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    };
    break;
  default:
    apiBase = `http://${process.env.DEV_HOST}:3001`;   // 测试环境 //本地 `http://testweixin.shishike.com`;
    requestOptions = {
      method: 'GET', mod: 'cors',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    };
}

module.exports = {
  // API
  takeawayMenuAPI: `${apiBase}/takeaway/dishAll.json`,
  orderallMenuAPI: `${apiBase}/orderall/dishAll.json`,
  orderDineInAPi: `${apiBase}/orderall/dishBox.json`,
  orderTakeAwayAPi: `${apiBase}/takeaway/dishBox.json`,
  orderCouponsAPI:`${apiBase}/coupon/getCanUseCoupons.json`,
  orderDiscountInfoAPI:`${apiBase}/shop/discountInfo.json`,
  orderDinnerStatementAPI:`${apiBase}/orderall/settlement4Dinner.json`,
  orderDinnerStatementZeroAPI:`${apiBase}/pay/pay4Zero.json`,
  submitTSOrderAPI:`${apiBase}/orderall/subOrder.json`,
  submitWMOrderAPI:`${apiBase}/takeaway/subOrder.json`,
  userAddressAPI: `${apiBase}/user/addressList.json`,
  submitDinnerOrderAPI:`${apiBase}/orderall/tradeBilling.json`,
  orderedDishBenefitAPI:`${apiBase}/marketplan/dishPrivilegeList.json`,

  individualAPI:`${apiBase}/user/individual.json`, // 获取用户基本信息(我的页面)
  individualviewAPI:`${apiBase}/user/individualView.json`,  // 获取用户基本信息(设置页面)
  logoutAPI:`${apiBase}/user/logout.json`,  // 注销用户页面
  individualupdateAPI:`${apiBase}/user/individualUpdate.json`, // 设置页面 更新信息
  getUserAddressListAPI: `${apiBase}/user/getAddressList.json`,
  getAllAddressListAPI: `${apiBase}/user/addressList.json`,
  customerAddressAPI: `${apiBase}/user/address.json`,
  saveAddressAPI: `${apiBase}/user/saveAddress.json`,
  deleteAddressAPI: `${apiBase}/user/delAddress.json`,
  getOrderAddressInfoAPI: `${apiBase}/user/getAddressInfo.json`,
  submitTSOrderCartAPI: `${apiBase}/orderall/subOrderDinner.json`,
  placeCheckOrderAPI: `${apiBase}/place/placeCheckOrder.json`,

  userLoginAPI: `${apiBase}/user/login.json`,
  userLoginWXURL: `${apiBase}/user/login4WX`,
  getUserLoginSupportAPI: `${apiBase}/user/supportTypes.json`,
  getServiceStatusHaveTableAPI: `${apiBase}/orderall/serviceStatusHaveTable.json`, // 获取基本信息(带桌台)
  getServiceStatusNoTableAPI: `${apiBase}/orderall/serviceStatusNoTable.json`, // 获取基本信息(不带桌台)
  getIsShowButtonAPI: `${apiBase}/orderall/isShowButton.json`, // 按钮是否显示
  getTableInfoAPI: `${apiBase}/orderall/tableInfo.json`, // 获取tableInfo
  getOtherTableIdAPI: `${apiBase}/orderall/getTableId.json`, // 获取用户是否在其他桌台下单
  getOrderTableTypeAPI: `${apiBase}/orderall/orderTableType.json`, // 获取tableInfo
  callServiceAPI: `${apiBase}/orderall/callService.json`, // 获取tableId
  memberIndexAPI: `${apiBase}/member/index.json`, // 获取会员基本信息
  grownLevelxAPI:`${apiBase}/member/customerLevel.json`, // 会员页面
  getCouponListAPI:`${apiBase}/coupon/getCouponList.json`, // 优惠券列表
  // 跳转URL
  getMoreTSDishesURL:`${apiBase}/orderall/selectDish`, // TS
  getMoreWMDishesURL:`${apiBase}/takeaway/selectDish`, // WM
  editUserAddressURL: `${apiBase}/user/address`,

  brandIndexURL:`${apiBase}/brand/index`, // 品牌首页
  shopDetailURL:`${apiBase}/shop/detail`, // 门店首页
  mineIndexURL:`${apiBase}/user/individual`, // 个人中心页面
  mineSettingURL:`${apiBase}/user/individualView`, // 设置页面
  bindMobileURL:`${apiBase}/user/bindMobile`, // 绑定手机页面
  bindWXURL:`${apiBase}/user/bindOpenid`, // 绑定微信页面
  registerMemberURL:`${apiBase}/member/register`, // 注册会员
  logAddressURL: `${apiBase}/user/notLogin`, // 登陆页面
  integralURL: `${apiBase}/member/integral`, // 我的积分
  valueCardURL:`${apiBase}/member/valueCard`, // 我的余额
  memberIndexURL:`${apiBase}/member/index`, // 会员页面
  grownLevelxURL:`${apiBase}/member/grownLevel`, // 会员页面
  growthValueURL:`${apiBase}/member/growthValue`, // 成长明细页面
  rechargeURL:`${apiBase}/shop/recharge`, // 充值页面
  orderallListURL:`${apiBase}/order/orderallList`, // 订单列表
  getCouponListURL:`${apiBase}/coupon/getCouponList`, // 优惠券
  addressListURL:`${apiBase}/user/addressList`, // 地址管理
  modifyPwdURL:`${apiBase}/member/modifyPwd`, // 修改密码
  tradeDetailUncheckURL:`${apiBase}/order/tradeDetailUncheck`, // 堂食正餐订单详情页 结算前
  dishCart4DinnerURL:`${apiBase}/orderall/dishCart4Dinner`, // 购物车详情页
  settlement4DinnerURL:`${apiBase}/orderall/settlement4Dinner`, // 正餐结算页面

  bookingDetailURL:`${apiBase}/booking/bookingDetail`, // 预定详情
  bookCheckOrderURL:`${apiBase}/prepare/dishBoxBooking`, // 预定下单页面
  queueDetailURL:`${apiBase}/queue/success`, // 排队详情
  queueCheckOrderURL:`${apiBase}/prepare/dishBoxQueue`, // 排队下单页面

  exceptionDishURL:`${apiBase}/orderall/tableCantOrder`, // 异常页面(无法在该桌台点餐)
  exceptionDishCurrentURL:`${apiBase}/orderall/tableError`, // 异常页面(该桌台无法点餐)
  exceptionLinkURL:`${apiBase}/orderall/tableTimeout`, // 异常页面(链接无效)
  exceptionDeviceURL:'exception-device.html', // 异常页面(请在微信浏览器打开连接)

  getDefaultSendArea: `${apiBase}/user/getDefaultSendArea.json`,
  getOrderInLineAPI: `${apiBase}/queue/info.json`,
  submitOrderInLineAPI: `${apiBase}/queue/add.json`,
  placeOrderAPI:`${apiBase}/booking/book.json`,
  getCheckTableAvaliable:`${apiBase}/booking/getTableByAreaAndNum.json`,
  getPlaceOrderTablesAPI:`${apiBase}/booking/getTables.json`,
  submitPlaceOrderAPI:`${apiBase}/booking/addBooking.json`,

  sendCodeAPI: `${apiBase}/user/sendCode.json`, // 发送验证码
  bindPhoneAPI: `${apiBase}/user/bindMobile.json`, // 绑定手机
  wxOauthAPI: `${apiBase}/weixinapi/weixinOauthUrl`, // 获取openid
  bindWXAPI: `${apiBase}/user/bindOpenid.json`, // 绑定微信
  getWXInfoAPI: `${apiBase}/user/weixinUserInfo.json`, // 获取微信信息

  registerInfoAPI: `${apiBase}/member/register.json`, // 获取用户信息
  registerAPI: `${apiBase}/member/addMember.json`, // 申请会员
  checkCodeAvaliableAPI:`${apiBase}/user/validMobile.json`,
  tradeDetailUncheckAPI: `${apiBase}/order/tradeDetailUncheck.json`, // 订单详情（结算前）
  getWXAuthInfoAPI: `${apiBase}/weixinapi/jsApiTicket.json`,
  getTableIdFromQRCodeAPI: `${apiBase}/orderall/tableExt.json`,
  getMainOrderAPI: `${apiBase}/orderall/getMainOrder.json`,
  validBindMobileAPI: `${apiBase}/user/validBindMobile.json`, // 绑定手机验证码校验：是否会员/是否和其他微信绑定
  validBindMobileActiveAPI: `${apiBase}/user/validBindMobileActive.json`, // 绑定手机验证码校验(会员卡激活)：是否会员/是否和其他微信绑定

  getBalanceInfoAPI: `${apiBase}/member/valueCard.json`, // 会员卡余额信息
  getIntegralDetailAPI: `${apiBase}/member/integralDetail.json`, //
  getGrownDetailAPI: `${apiBase}/member/grownDetail.json`, //
  getGrownLevelsAPI: `${apiBase}/member/grownLevel.json`, //
  getRechargeInfoAPI: `${apiBase}/shop/recharge.json`, // 会员卡充值信息
  addRechargeAPI: `${apiBase}/member/addRecharge.json`, // 会员卡充值
  indexAPI: `${apiBase}/brand/index.json`,
  modifyPwd: `${apiBase}/member/modifyPwd.json`, // 修改密码
  resetPassword: `${apiBase}/member/resetPassword.json`, // 重置密码
  getResetPasswordUserInfoAPI: `${apiBase}/member/resetPwd.json`, // 取密码重置用户信息

  cancelQueueAPI: `${apiBase}/queue/cancel.json`, // 取消排队
  orderListAPI: `${apiBase}/order/orderallList.json`, // 订单列表
  takeOutListAPI: `${apiBase}/order/takeOutList.json`, // 外卖列表
  bookListAPI: `${apiBase}/order/bookingList.json`, // 预订列表
  queueListAPI: `${apiBase}/queue/queueList.json`, // 排队列表
  getDinnerDetailAPI: `${apiBase}/order/orderallDetail.json`, // 堂食结算后订单详情
  getDishMarketInfosAPI: `${apiBase}/orderall/dishMarketInfos.json`,
  saveMarkRecordAPI: `${apiBase}/order/saveMarkRecord.json`, // 评分

  getBookDetailAPI: `${apiBase}/booking/bookingDetail.json`, // 预订详情
  getQueueDetailAPI: `${apiBase}/queue/success.json`, // 排队详情
  bookingMyPreOrderAPI:`${apiBase}/prepare/myPreOrder.json`, // 预定我的菜单
  queueMyPreOrderAPI:`${apiBase}/prepare/myPreOrder.json`, // 排队我的菜单
  bookingSubOrderAPI:`${apiBase}/prepare/subOrder.json`,
  queueSubOrderAPI:`${apiBase}/prepare/subOrder.json`,

  getTakeoutDetailAPI: `${apiBase}/order/takeOutDetail.json`, // 外卖结算后订单详情
  getCurrIntegralRuleAPI: `${apiBase}/member/currIntegralRule.json`, // 获取当前积分信息
  getCurrGrownRuleAPI: `${apiBase}/member/currGrownRule.json`, // 获取当前成长值信息

  getPosLoginInfoAPI: `${apiBase}/user/loginPosScanCode.json`, // pos扫码信息
  loginWxByPosAPI: `${apiBase}/user/loginWxByPos.json`, // pos扫码登录
  getPayDetailAPI:`${apiBase}/shop/payDetail.json`,
  baiduPayAPI:`${apiBase}/pay/baiduPay.json`,
  weixinPayAPI:`${apiBase}/pay/weixinPay.json`,
  balancePayAPI: `${apiBase}/pay/valueCardPay.json`,

  requestOptions,
};
