const React = require('react');
const connect = require('react-redux').connect;
const getUrlParam = require('../../helper/common-helper.js').getUrlParam;
const actions = require('../../action/pay-detail/pay-detail.js');
const Loading = require('../../component/mui/loading.jsx');
const Toast = require('../../component/mui/toast.jsx');
const PasswordInput = require('../../component/common/password-input.jsx');
require('../../asset/style/_trump.application.scss');
require('./application.scss');
const classnames = require('classnames');

const PayDetailApplication = React.createClass({
  displayName:'PayDetailApplication',
  propTypes:{
    // MapedActionsToProps
    fetchPayDetail: React.PropTypes.func.isRequired,
    setPayDetail: React.PropTypes.func.isRequired,
    clearErrorMsg: React.PropTypes.func.isRequired,
    // MapedStatesToProps
    payProps: React.PropTypes.object,
    errorMessage:React.PropTypes.string,
  },
  getInitialState() {
    return { expand:false, loading:false };
  },
  componentWillMount() {},
  componentDidMount() {
    const { fetchPayDetail } = this.props;
    fetchPayDetail();
  },
  setPayDetail(bool, payString) {
    const { setPayDetail, payProps } = this.props;
    if (payString !== 'balance') {
      setPayDetail(payString, payProps.price);
    } else {
      if (bool) {
        // 表示不能支付
        return false;
      }
      const { expand } = this.state;
      this.setState({
        expand: !expand,
      });
    }
    return true;
  },
  setBalancePay(password) {
    const { setPayDetail, payProps } = this.props;
    setPayDetail(password, payProps.price);
  },
  closePasswordInput() {
    const { expand } = this.state;
    this.setState({
      expand: !expand,
    });
  },
  render() {
    // mapStateToProps
    const { payProps, errorMessage, clearErrorMsg } = this.props;
    const { expand, loading } = this.state;
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
                <div className="method-item" onTouchTap={evt => this.setPayDetail(null, 'weixin')}>
                  <div className="pay-item-left weixin-pay"></div>
                  <div className="pay-item-name subname">
                    <p>微信支付</p>
                    <p className="subname-describe">微信客户端版本5.0以上</p>
                  </div>
                </div>
                :
                false
              }
              {payProps.alipay && window.navigator.userAgent.toLowerCase().indexOf('micromessenger') === -1 ?
                <div className="method-item" onTouchTap={evt => this.setPayDetail(null, 'alipay')}>
                  <div className="pay-item-left ali-pay"></div>
                  <div className="pay-item-name">
                    <p>支付宝支付</p>
                  </div>
                </div>
                :
                false
              }
              {payProps.baidu ?
                <div className="method-item" onTouchTap={evt => this.setPayDetail(null, 'baidu')}>
                  <div className="pay-item-left baidu-pay"></div>
                  <div className="pay-item-name">
                    <p>百度钱包</p>
                  </div>
                </div>
                :
                false
              }
              {getUrlParam('orderType') !== 'recharge' && payProps.isVIP ?
                <div
                  className={classnames(
                  'method-item',
                  { 'balance-pay-disable':
                    (payProps.valueCard && +payProps.valueCard < +payProps.price) || payProps.isDisable || payProps.loginType !== 0,
                  }
                )}
                  onTouchTap={evt => this.setPayDetail(
                    (payProps.valueCard && +payProps.valueCard < +payProps.price) || payProps.isDisable || payProps.loginType !== 0, 'balance')
                  }
                >
                  <div className="pay-item-left balance-pay">
                  </div>
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
        {expand ?
          <PasswordInput closePasswordInput={this.closePasswordInput} setBalancePay={this.setBalancePay} />
          :
          false
        }
        {errorMessage ?
          <Toast errorMessage={errorMessage} clearErrorMsg={clearErrorMsg} />
          :
          false
        }
        {loading ?
          <Loading />
          :
          false
        }
        <div className="copyright"></div>
      </div>
    );
  },
});

module.exports = connect(state => state, actions)(PayDetailApplication);
