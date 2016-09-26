const React = require('react');

require('../../asset/style/style.scss');
require('./application.scss');

const shopId = require('../../helper/common-helper.js').getUrlParam('shopId');
const ExceptionInfo = require('../../component/common/exception-info.jsx');

const ExceptionLinkApplication = React.createClass({
  render() {
    const tips = '该链接已失效，如需点餐请重新扫码';
    const returnName = '返回门店首页';
    const returnUrl = `http://${location.host}/brand/index?shopId=${shopId}`;
    return (
      <div className="exception-dish">
        <ExceptionInfo
          tips={tips}
          returnName={returnName}
          returnUrl={returnUrl}
        />
      </div>
      );
  },
});

module.exports = ExceptionLinkApplication;
