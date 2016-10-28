const React = require('react');
const classnames = require('classnames');

const RechargeItem = React.createClass({
  displayName: 'RechargeItem',
  propTypes: {
    rechargeInfo: React.PropTypes.object,
    onSetChoseValue: React.PropTypes.func,
    realAmount: React.PropTypes.number,
  },

  getInitialState() {
    return {
      isChose: false,
    };
  },

  componentWillReceiveProps(nextProps) {
    if (this.state.isChose) {
      this.setState({ isChose: false });
    }
  },

  handleChoseValue() {
    const { realAmount, onSetChoseValue } = this.props;
    this.setState({ isChose: true });
    onSetChoseValue(realAmount);
  },

  render() {
    const { rechargeInfo, realAmount } = this.props;
    const { isChose } = this.state;
    return (
      <div className={classnames('recharge-item', { 'recharge-item-orange': isChose })} onTouchTap={this.handleChoseValue}>
        <p className="recharge-item-real ellipsis"><span>{realAmount}</span>元</p>
        <p className="recharge-item-sale ellipsis">售价<span>{rechargeInfo.fullValue}</span></p>
      </div>
    );
  },
});

module.exports = RechargeItem;
