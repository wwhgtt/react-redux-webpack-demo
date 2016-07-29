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
    hiddenNum: React.PropTypes.number,
    onCountChange: React.PropTypes.func.isRequired,
  },
  getDefaultProps() {
    return {
      count:0,
      minimum:0,
      step:1,
      hiddenNum:0,
    };
  },
  componentDidUpdate() {
  },
  onBtnsTap(count, increment) {
    const { maximum, minimum, onCountChange } = this.props;
    const maxNumber = !maximum && maximum !== 0 ? Infinity : maximum;
    if (increment > 0 && maxNumber >= count + increment) {
      return onCountChange(count + increment, increment);
    } else if (increment < 0 && count + increment >= minimum) {
      return onCountChange(count + increment, increment);
    } else if (increment < 0 && count < Math.abs(increment) && count !== minimum) {
      return onCountChange(0, increment);
    }
    return false;
  },
  render() {
    const { count, step, maximum, minimum, hiddenNum } = this.props;
    const className = classnames('counter', {
      'counter-max': count === maximum,
      'counter-min': count === minimum && count !== hiddenNum,
      'counter-min--nonum': count === minimum && count === hiddenNum,
    });
    return (
      <div className={className}>
        <a className="counter-minus">
          <span className="counter-click-mask" onTouchTap={evt => this.onBtnsTap(count, -step)} />
        </a>
        <span className="counter-num">{count}</span>
        <a className="counter-add">
          <span className="counter-click-mask" onTouchTap={evt => this.onBtnsTap(count, step)} />
        </a>
      </div>
    );
  },
});
