const React = require('react');
const connect = require('react-redux').connect;
const posLoginAction = require('../../action/pos-login/pos-login.js');
const helper = require('../../helper/common-helper.js');

const Toast = require('../../component/mui/toast.jsx');
const Loading = require('../../component/mui/loading.jsx');

const shopId = helper.getUrlParam('shopId');
const uuid = helper.getUrlParam('uuid');
const posDeviceID = helper.getUrlParam('posDeviceID');

require('../../asset/style/style.scss');
require('./application.scss');

const PosLoginApplication = React.createClass({
  displayName: 'PosLoginApplication',
  propTypes: {
    info: React.PropTypes.object,
    errorMsg: React.PropTypes.string,
    getPosLoginInfo: React.PropTypes.func,
    setErrorMsg: React.PropTypes.func,
    loginWxByPos: React.PropTypes.func,
    loadStatus: React.PropTypes.bool,
  },
  componentWillMount() {
    this.props.getPosLoginInfo();
  },

  getLoginContent(info) {
    let loginContent = '';

    if (info.hasCustomer) {
      loginContent = (
        <div className="pos-login-info">
          <p>Hi,{info.name}</p>
          <p>欢迎光临{info.shopName}</p>
        </div>
      );
    } else if (info.hasCustomer === false) {
      // 以上条件保证接口未获取到数据时，什么都不显示
      loginContent = (
        <div className="pos-login-info">
          <p>欢迎光临</p>
          <p>{info.shopName}</p>
        </div>
      );
    }
    return loginContent;
  },

  poLogin(info) {
    const { loginWxByPos, setErrorMsg } = this.props;
    if (info.hasCustomer) {
      if (info.isDisable) {
        setErrorMsg('非常抱歉，您的会员卡已被停用，无法登录');
        return;
      }
      loginWxByPos();
    } else {
      location.href = `http://${location.host}/user/loginFromPosScan?shopId=${shopId}&uuid=${uuid}&posDeviceID=${posDeviceID}`;
    }
  },

  render() {
    const { info, errorMsg, setErrorMsg, loadStatus } = this.props;
    return (
      <div className="application">
        <div className="pos-login">
          <div className="pos-login-img"></div>
          {this.getLoginContent(info)}
          <a className="pos-login-btn" onTouchTap={() => { this.poLogin(info); }}>
            {info.hasCustomer ? '登录' : '注册并登录'}
          </a>
        </div>
        <div className="copyright"></div>
        {errorMsg &&
          <Toast errorMessage={errorMsg} clearErrorMsg={() => { setErrorMsg(''); }} />
        }
        {loadStatus &&
          <Loading word={''} />
        }
      </div>
    );
  },
});

module.exports = connect(state => state, posLoginAction)(PosLoginApplication);
