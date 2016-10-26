const React = require('react');
const connect = require('react-redux').connect;
const mineBalanceAction = require('../../action/mine/mine-balance.js');
// const Toast = require('../../component/mui/toast.jsx');

require('../../asset/style/style.scss');
require('./application.scss');

const MineBalanceApplication = React.createClass({
  displayName: 'MineBalanceApplication',
  propTypes: {

  },

  render() {
    return (
      <div className="balance-page">
        <div className="balance-outline">
          <div className="balance-outline-total">2345</div>
          <div className="balance-outline-title">我的余额(元)</div>
          <div className="balance-outline-operate">
            <a className="btn-balance-charge">立即充值</a>
          </div>
        </div>
        <div className="balance-detail">
          <div className="">余额储值消费记录</div>
          <div className="balance-section">
            <div className="balance-item">
              <div className="balance-item"></div>
              <div className="">
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
});

const mapStateToProps = function (state) {
  return {
    errorMessage: state.errorMessage,
    balanceInfo: state.balanceInfo,
  };
};

module.exports = connect(mapStateToProps, mineBalanceAction)(MineBalanceApplication);
