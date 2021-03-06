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
      sex:null,
    },
    dinePersonCount:4,
    queueList:[],
    errorMessage:null,
    shuoldPhoneValidateShow:false,
    timestamp:null,
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
        .setIn(['commercialProps', 'maxPersonNum'], payload.maxPersonNum || 99)
        .setIn(['commercialProps', 'hasQLine'], payload.hasQLine)
        .setIn(['commercialProps', 'openStatus'], payload.openStatus)
        .setIn(['customerProps', 'name'], payload.name)
        .setIn(['customerProps', 'mobile'], payload.mobile)
        .setIn(['customerProps', 'sex'], payload.sex >= 0 ? payload.sex : null)
        .set('queueList', payload.queList)
        .set('dinePersonCount', payload.maxPersonNum && payload.maxPersonNum > 4 ? 4 : (payload.maxPersonNum || 1));
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
    case 'SET_TIMESTAMP':
      return state.set('timeStamp', payload);
    default:
  }
  return state;
};
