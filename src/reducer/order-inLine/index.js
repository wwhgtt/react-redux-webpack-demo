const Immutable = require('seamless-immutable');
module.exports = function (
  state = Immutable.from({
    commercialProps:{
      shopName:null,
      shopLogo:null,
      maxPersonNum:null,
      hasQLine:null,
      openStatus:null,
    },
    customerProps:{
      name:null,
      mobile:null,
      sex:-1,
    },
    dinePersonCount:1,
    queueList:[],
    errorMessage:null,
    shuoldPhoneValidateShow:false,
    phoneValidateCode:'',
  }),
  action
) {
  const { type, payload } = action;
  switch (type) {

    case 'SET_ORDER_INLINE_PROPS':
      return state.setIn(
          ['commercialProps', 'shopName'], payload.shopName
        )
        .setIn(['commercialProps', 'shopLogo'], payload.shopLogo)
        .setIn(['commercialProps', 'maxPersonNum'], payload.maxPersonNum)
        .setIn(['commercialProps', 'hasQLine'], payload.hasQLine)
        .setIn(['commercialProps', 'openStatus'], payload.openStatus)
        .setIn(['customerProps', 'name'], payload.name)
        .setIn(['customerProps', 'mobile'], payload.mobile)
        .setIn(['customerProps', 'sex'], payload.sex >= 0 ? payload.sex : -1)
        .set('queueList', payload.queList);
    case 'SET_CUSTOMER_PROPS':
      return state
        .setIn(['customerProps', 'name'], payload.name)
        .setIn(['customerProps', 'mobile'], payload.mobile)
        .setIn(['customerProps', 'sex'], payload.sex);
    case 'SET_ORDER_PROPS':
      if (payload.id === 'dine-person-count') {
        return state.set('dinePersonCount', payload.newCount);
      }
      break;
    case 'SET_ERROR_MSG':
      return state
          .set('errorMessage', payload);
    case 'SET_PHONE_VALIDATE_PROPS':
      return state.set('shuoldPhoneValidateShow', payload);
    default:
  }
  return state;
};
