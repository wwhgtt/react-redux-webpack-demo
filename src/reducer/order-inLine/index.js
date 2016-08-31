const Immutable = require('seamless-immutable');
module.exports = function (
  state = Immutable.from({
    commercialProps:{
      shopName:null,
      shopLogo:null,
      maxPersonNum:null,
      hasQLine:null,
      shopOpenStatus:null,
    },
    customerProps:{
      name:null,
      mobile:null,
      sex:null,
      dinePersonCount:1,
    },
    dinePersonCount:1,
    queueList:[],
    errorMessage:null,
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
        .setIn(['commercialProps', 'shopOpenStatus'], payload.shopOpenStatus)
        .setIn(['customerProps', 'name'], payload.name)
        .setIn(['customerProps', 'mobile'], payload.mobile)
        .setIn(['customerProps', 'sex'], payload.sex >= 0 ? payload.sex : -1)
        .set('queueList', payload.queList);
    case 'SET_CUSTOMER_PROPS':
      return state.set('customerProps', payload);
    case 'SET_ORDER_PROPS':
      if (payload.id === 'dine-person-count') {
        return state.set('dinePersonCount', payload.newCount);
      }
      break;
    default:
  }
  return state;
};
