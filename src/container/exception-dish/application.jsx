const React = require('react');

require('../../asset/style/style.scss');

const shopId = require('../../helper/common-helper.js').getUrlParam('shopId');
const ExceptionInfo = require('../../component/common/exception-info.jsx');

const ExceptionDishApplication = React.createClass({
  render() {
    const tips = '非常抱歉，该桌台目前无法点餐';
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

module.exports = ExceptionDishApplication;
