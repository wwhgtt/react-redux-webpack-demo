const React = require('react');
const classnames = require('classnames');

require('./counter.scss');

module.exports = React.createClass({
  displayName:'Counter',
  propTypes: {
    count: React.PropTypes.number.isRequired,
    maximum: React.PropTypes.number,
    minimum: React.PropTypes.number,
    step: React.PropTypes.number,
    onCountChange: React.PropTypes.func.isRequired,
  },
  getDefaultProps() {
    return {
      count:0,
      minimum:0,
      step:1,
    };
  },
  componentDidUpdate() {
  },
  onBtnsTap(count, increment) {
    const { maximum, minimum, onCountChange } = this.props;
    // bug解决分析 newCount 可能为－1  （数量为2 step＝3）
    const maxNumber = !maximum ? Infinity : maximum;
    if (increment > 0 && maxNumber > count + increment) {
      // 表示要加菜
      return onCountChange(count + increment, increment);
    } else if (increment < 0 && count - increment > minimum) {
      // 表示减少菜品
      return onCountChange(count - increment, increment);
    } else if (increment < 0 && count < Math.abs(increment)) {
      return onCountChange(0, increment);
    }
    return false;
  },
  render() {
    const { count, step, maximum, minimum } = this.props;
    return (
      <div className="counter">
        <a className={classnames('btn-minus counter-minus', { 'btn-disabled': count === minimum })}>
          <span className="counter-click-mask" onTouchTap={evt => this.onBtnsTap(count, -step)} />
        </a>
        <a className={classnames('btn-add counter-add', { 'btn-disabled': count === maximum })}>
          <span className="counter-click-mask" onTouchTap={evt => this.onBtnsTap(count, step)} />
        </a>
        <span className="counter-num">{count}</span>
      </div>
    );
  },
});
