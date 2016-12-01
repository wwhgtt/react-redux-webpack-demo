const React = require('react');
const helper = require('../../helper/common-helper.js');
const shopId = helper.getUrlParam('shopId');

require('../../asset/style/style.scss');
require('../pos-login/application.scss');

const PosLoginSuccessApplication = React.createClass({
  displayName: 'PosLoginSuccessApplication',

  render() {
    return (
      <div className="application">
        <div className="pos-login">
          <div className="pos-login-success"></div>
          <div className="pos-login-info">
            <p>恭喜您！登录成功~</p>
          </div>
          <a className="pos-login-btn" href={`http://${location.host}/shop/detail?shopId=${shopId}`} >
            去门店首页看看
          </a>
        </div>
        <div className="copyright"></div>
      </div>
    );
  },
});

module.exports = PosLoginSuccessApplication;
