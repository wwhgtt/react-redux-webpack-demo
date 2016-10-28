const React = require('react');
const classnames = require('classnames');

const RechargeItem = React.createClass({
  displayName: 'RechargeItem',
  propTypes: {
    rechargeInfo: React.PropTypes.object,
    onSetChooseValue: React.PropTypes.func,
    realAmount: React.PropTypes.number,
    isChoose: React.PropTypes.bool,
  },

  getInitialState() {
    return {
      isChose: false,
    };
  },

  handleChoseValue() {
    const { realAmount, onSetChooseValue } = this.props;
    onSetChooseValue(realAmount);
  },

  render() {
    const { rechargeInfo, realAmount, isChoose } = this.props;

    return (
      <div className={classnames('recharge-item', { 'recharge-item-orange': isChoose })} onTouchTap={this.handleChoseValue}>
        <p className="recharge-item-real ellipsis"><span>{realAmount}</span>元</p>
        <p className="recharge-item-sale ellipsis">售价<span>{rechargeInfo.fullValue}</span></p>
      </div>
    );
  },
});

module.exports = RechargeItem;
