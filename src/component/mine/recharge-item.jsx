const React = require('react');
const classnames = require('classnames');

const RechargeItem = React.createClass({
  displayName: 'RechargeItem',
  propTypes: {
    rechargeInfo: React.PropTypes.object,
    onSetChooseValue: React.PropTypes.func,
    realAmount: React.PropTypes.number,
    isChoosed: React.PropTypes.bool,
    isFullSend: React.PropTypes.number,
  },

  getInitialState() {
    return {
      isChose: false,
    };
  },

  handleChoseValue() {
    const { rechargeInfo, onSetChooseValue } = this.props;
    onSetChooseValue(rechargeInfo.fullValue);
  },

  render() {
    const { rechargeInfo, realAmount, isChoosed, isFullSend } = this.props;
    let itemClass = '';
    if (isFullSend !== 0) {
      itemClass = 'recharge-item-single';
    }

    return (
      <div className={classnames('recharge-item', { 'recharge-item-orange': isChoosed })} onTouchTap={this.handleChoseValue}>
        <p className={`recharge-item-real ellipsis ${itemClass}`}><span>{realAmount}</span>元</p>
        {isFullSend === 0 &&
          <p className="recharge-item-sale ellipsis">售价<span>{rechargeInfo.fullValue}元</span></p>
        }
      </div>
    );
  },
});

module.exports = RechargeItem;
