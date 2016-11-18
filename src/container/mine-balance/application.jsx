const React = require('react');
const connect = require('react-redux').connect;
const mineBalanceAction = require('../../action/mine/mine-balance.js');
const IncomeExpensesList = require('../../component/mine/income-expenses-list.jsx');
const shopId = require('../../helper/common-helper').getUrlParam('shopId');

require('../../asset/style/style.scss');
require('./application.scss');
require('../../component/mine/common.scss');

const MineBalanceApplication = React.createClass({
  displayName: 'MineBalanceApplication',
  propTypes: {
    balanceInfo: React.PropTypes.object,
    getBalanceInfo: React.PropTypes.func,
  },

  componentWillMount() {
    this.props.getBalanceInfo();
  },

  render() {
    const { balanceInfo } = this.props;
    return (
      <div className="balance-page">
        <div className="balance-outline">
          <div className="balance-outline-total">{balanceInfo.valueCard}</div>
          <div className="balance-outline-title">我的余额(元)</div>
          {balanceInfo.supportCharge &&
            <div className="balance-outline-operate">
              <a className="btn-balance-charge" href={`http://${location.host}/shop/recharge?shopId=${shopId}`}>立即充值</a>
            </div>
          }
        </div>
        <div className="balance-detail">
          <div className="balance-detail-title">余额记录</div>
          <div className="balance-section records">
            {
              balanceInfo.vhList && balanceInfo.vhList.map((item, index) => {
                const listInfo = {
                  name: item.commercialName,
                  time: item.createDateTime,
                  title: item.balanceType,
                };
                const balanceAmount = item.addValuecard;
                let balanceAmountClass = '';

                if (Number(balanceAmount) >= 0) {
                  balanceAmountClass = 'balance-amount-orange';
                }

                return (<IncomeExpensesList listInfo={listInfo} key={index}>
                  <div className={balanceAmountClass}>{balanceAmount}</div>
                </IncomeExpensesList>
                );
              }
              )
            }
          </div>
        </div>
        <div className="balance-footer copyright"></div>
      </div>
    );
  },
});

const mapStateToProps = function (state) {
  return {
    balanceInfo: state.balanceInfo,
  };
};

module.exports = connect(mapStateToProps, mineBalanceAction)(MineBalanceApplication);
