const React = require('react');

require('../../asset/style/style.scss');
require('./application.scss');

const shopId = require('../../helper/common-helper.js').getUrlParam('shopId');
const ExceptionInfo = require('../../component/common/exception-info.jsx');

const ExceptionDeviceApplication = React.createClass({
  render() {
    const tips = '非常抱歉，请在微信中打开该链接';
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

module.exports = ExceptionDeviceApplication;
