const React = require('react');
const connect = require('react-redux').connect;
const getUrlParam = require('../../helper/common-helper.js').getUrlParam;
const actions = require('../../action/pay-detail/pay-detail.js');
// const Loading = require('../../component/mui/loading.jsx');
require('../../asset/style/_trump.application.scss');
require('./application.scss');

const PayDetailApplication = React.createClass({
  displayName:'PayDetailApplication',
  propTypes:{
    // MapedActionsToProps
    fetchPayDetail: React.PropTypes.func.isRequired,
    setPayDetail: React.PropTypes.func.isRequired,
    // MapedStatesToProps
    payProps: React.PropTypes.object,
    errorMessage:React.PropTypes.string,
  },
  componentWillMount() {},
  componentDidMount() {
    const { fetchPayDetail } = this.props;
    fetchPayDetail();
  },
  setPayDetail(evt, payString) {
    const { setPayDetail, payProps } = this.props;
    setPayDetail(payString, payProps.price);
  },
  render() {
    // mapStateToProps
    const { payProps } = this.props;
    // mapActionsToProps
    // const { } = this.props;
    return (
      <div className="application">
        {payProps ?
          <div className="pay">
            <div className="pay-header">
              <p className="pay-header-title">支付金额</p>
              <p className="pay-header-money">{payProps.price}</p>
            </div>
            <div className="pay-chose-title">
              请选择支付方式
            </div>
            <div className="pay-method">
              {payProps.weixin ?
                <div className="method-item" onTouchTap={evt => this.setPayDetail(evt, 'weixin')}>
                  <div className="pay-item-left weixin-pay"></div>
                  <div className="pay-item-name subname">
                    <p>微信支付</p>
                    <p className="subname-describe">微信客户端版本5.0以上</p>
                  </div>
                </div>
                :
                false
              }
              {payProps.alipay ?
                <div className="method-item" onTouchTap={evt => this.setPayDetail(evt, 'alipay')}>
                  <div className="pay-item-left ali-pay"></div>
                  <div className="pay-item-name">
                    <p>支付宝支付</p>
                  </div>
                </div>
                :
                false
              }
              {payProps.baidu ?
                <div className="method-item" onTouchTap={evt => this.setPayDetail(evt, 'baidu')}>
                  <div className="pay-item-left baidu-pay"></div>
                  <div className="pay-item-name">
                    <p>百度钱包</p>
                  </div>
                </div>
                :
                false
              }
              {payProps.valueCard && +payProps.valueCard >= +payProps.price && !payProps.isDisable
                && getUrlParam('orderType') !== 'recharge' && payProps.loginType === 0 && payProps.isVIP ?
                <div className="method-item" onTouchTap={evt => this.setPayDetail(evt, 'balance')}>
                  <div className="pay-item-left balance-pay"></div>
                  <div className="pay-item-name subname">
                    <p>会员余额</p>
                    <p className="subname-describe">我的余额：<span>{payProps.valueCard}元</span></p>
                  </div>
                </div>
                :
                false
              }
            </div>
          </div>
          :
          false
        }
        <div className="copyright"></div>
      </div>
    );
  },
});

module.exports = connect(state => state, actions)(PayDetailApplication);
