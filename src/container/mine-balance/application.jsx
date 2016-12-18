const React = require('react');
const connect = require('react-redux').connect;
const classnames = require('classnames');
const IScroll = require('iscroll/build/iscroll-probe');

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

  getInitialState() {
    return {
      balanceInfoArray: [],
      currentBalanceInfo: {},
    };
  },

  componentWillMount() {
    this.props.getBalanceInfo(1);
  },

  componentDidMount() {
    const options = {
      mouseWheel: true,
      click: true,
    };

    const wapper = document.getElementById('balanceScroll');
    this.balanceScroll = new IScroll(wapper, options);
    this.balanceScroll.on('scrollEnd', this.onScrollEnd);
  },

  componentWillReceiveProps(nextProps) {
    const { balanceInfo } = nextProps;
    this.setState({ currentBalanceInfo: balanceInfo });

    if (JSON.stringify(this.props.balanceInfo) !== JSON.stringify(balanceInfo)) {
      this.setState({ balanceInfoArray: this.mergeList(this.state.balanceInfoArray, balanceInfo.vhList) });
    }
  },

  componentDidUpdate(prevProps, prevState) {
    setTimeout(() => {
      this.balanceScroll.refresh();
    }, 0);
  },

  onScrollEnd() {
    const { currentBalanceInfo } = this.state;
    if (this.balanceScroll.y === this.balanceScroll.maxScrollY) {
      if (currentBalanceInfo.currentPage < currentBalanceInfo.totalPage) {
        this.props.getBalanceInfo(currentBalanceInfo.currentPage + 1);
      }
    }
  },

  mergeList(list, newList) {
    const existedOrders = {};
    const result = [];

    (list || []).forEach(item => {
      existedOrders[item.id] = true;
      result.push(item);
    });

    (newList || []).forEach(item => {
      if (!existedOrders[item.id]) {
        result.push(item);
      }
    });
    return result;
  },

  render() {
    const { currentBalanceInfo, balanceInfoArray } = this.state;
    return (
      <div className="balance-page">
        <div className="balance-outline">
          <div className="balance-outline-total">{currentBalanceInfo.valueCard || 0}</div>
          <div className="balance-outline-title">我的余额(元)</div>
          {currentBalanceInfo.supportCharge &&
            <div className="balance-outline-operate">
              <a className="btn-balance-charge" href={`http://${location.host}/shop/recharge?shopId=${shopId}`}>立即充值</a>
            </div>
          }
        </div>
        <div className="balance-detail-title" style={{ top: currentBalanceInfo.supportCharge ? 169 : 121 }}>余额记录</div>
        <div
          id="balanceScroll"
          className={classnames('balance-detail', { 'balance-detail-sm': currentBalanceInfo.supportCharge })}
          style={{ top: currentBalanceInfo.supportCharge ? 204 : 156 }}
        >
          <div className="records">
            {
              balanceInfoArray && balanceInfoArray.map((item, index) => {
                const listInfo = {
                  name: item.commercialName,
                  time: item.createDateTime,
                  title: item.balanceType,
                };
                const balanceAmount = item.changeValue;
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
        {
          // <div className="balance-footer copyright"></div>
        }
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
