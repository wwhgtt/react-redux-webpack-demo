const React = require('react');
const classnames = require('classnames');

const RechargeItem = React.createClass({
  displayName: 'RechargeItem',
  propTypes: {
    rechargeInfo: React.PropTypes.object,
    onSetChoseValue: React.PropTypes.func,
  },

  getInitialState() {
    return {
      isChose: false,
    };
  },

  handleChoseValue() {
    const { rechargeInfo, onSetChoseValue } = this.props;
    this.setState({ isChose: true });
    onSetChoseValue(rechargeInfo.fullValue);
  },

  render() {
    const { rechargeInfo } = this.props;
    const { isChose } = this.state;

    return (
      <div className={classnames('recharge-item', { 'recharge-item-orange': isChose })} onTouchTap={this.handleChoseValue}>
        <p className="recharge-item-real ellipsis"><span>{rechargeInfo.fullValue}</span>元</p>
        <p className="recharge-item-sale ellipsis">售价<span>10</span></p>
      </div>
    );
  },
});

module.exports = RechargeItem;
