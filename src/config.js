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
  takeawayMenuAPI: `${apiBase}/takeaway/dishAll.json`,
  orderallMenuAPI: `${apiBase}/orderall/dishAll.json`,
  orderDineInAPi: `${apiBase}/orderall/dishBox.json`,
  orderTakeAwayAPi: `${apiBase}/takeaway/dishBox.json`,
  orderCouponsAPI:`${apiBase}/coupon/getCanUseCoupons.json`,
  orderDiscountInfoAPI:`${apiBase}/shop/discountInfo.json`,
  submitTSOrderAPI:`${apiBase}/orderall/subOrder.json`,
  submitWMOrderAPI:`${apiBase}/takeaway/subOrder.json`,
  userAddressAPI: `${apiBase}/user/addressList.json`,

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

  userLoginAPI: `${apiBase}/user/login.json`,
  userLoginWXAPI: `${apiBase}/user/login4WX.json`,
  getUserLoginSupportAPI: `${apiBase}/user/supportTypes.json`,

  shopDetailURL:`${apiBase}/shop/detail`,
  mineIndexURL:'/mineIndex.html',
  mineSettingURL:'/mineSetting.html',
  getMoreTSDishesURL:`${apiBase}/orderall/selectDish`,
  getMoreWMDishesURL:`${apiBase}/takeaway/selectDish`,
  editUserAddressURL: `${apiBase}/user/address`,
  bindAccountURL:'${apiBase}/bind-account.html',  // 绑定页面 手机 #bind-phone 微信 #bind-wx
  registerMemberURL:'${apiBase}/register-member.html',
  logAddressURL: `${apiBase}/user/notLogin`, // 登陆页面
  integralURL: `${apiBase}/member/integral`, // 我的积分
  valueCardURL:`${apiBase}/member/valueCard`, // 我的余额
  memberIndexURL:`${apiBase}/member/index`, // 会员页面
  rechargeURL:`${apiBase}/shop/recharge`, // 充值页面
  orderallListURL:`${apiBase}/order/orderallList`, // 订单列表
  getCouponListURL:`${apiBase}/coupon/getCouponList`, // 优惠券
  addressListURL:`${apiBase}/user/addressList`, // 地址管理
  modifyPwdURL:`${apiBase}/member/modifyPwd`, // 修改密码

  getDefaultSendArea: `${apiBase}/user/getDefaultSendArea.json`,

  // ================================
  // 账号绑定
  // ================================
  sendCodeAPI: `${apiBase}/user/sendCode.json`, // 发送验证码
  bindPhoneAPI: `${apiBase}/user/bindMobile.json`, // 绑定手机

  // 会员注册
  // =======
  registerInfoAPI: `${apiBase}/member/register.json`, // 获取用户信息
  registerAPI: `${apiBase}/member/addMember.json`, // 申请会员

  requestOptions,
};

