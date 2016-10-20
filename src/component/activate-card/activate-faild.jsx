const React = require('react');
const getUrlParam = require('../../helper/common-helper.js').getUrlParam;
const errorMsg = decodeURIComponent(getUrlParam('errorMsg'));
const returnUrl = getUrlParam('returnUrl');

const ActivateFaildApplication = React.createClass({
  displayName: 'ActivateFaildApplication',
  propTypes: {

  },

  render() {
    return (
      <div className="activate-bound flex-rest">
        <div className="activate-img activate-img-faild"></div>
        <div className="activate-info">
          <p className="activate-info-title">非常抱歉，激活失败了</p>
          <p className="activate-info-item">原因：{errorMsg}</p>
        </div>
        <div className="activate-operate">
          <a className="btn--yellow" href={decodeURIComponent(returnUrl)}>重试</a>
        </div>
      </div>
    );
  },
});

module.exports = ActivateFaildApplication;
