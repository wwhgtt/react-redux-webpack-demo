const React = require('react');
const shopId = require('../../helper/common-helper.js').getUrlParam('shopId');
const ExceptionInfo = require('../../component/common/exception-info.jsx');
require('../../asset/style/style.scss');

const ExceptionDishCurrentApplication = React.createClass({
  render() {
    const tips = '非常抱歉，您目前无法在该桌台点餐';
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

module.exports = ExceptionDishCurrentApplication;
