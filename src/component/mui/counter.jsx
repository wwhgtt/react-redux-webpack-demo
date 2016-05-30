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
  onBtnsTap(newCount, increment) {
    const { maximum, minimum, onCountChange } = this.props;
    if ((maximum && newCount > maximum) || (newCount < minimum)) {
      return false;
    }
    return onCountChange(newCount, increment);
  },
  render() {
    const { count, step, maximum, minimum } = this.props;
    return (
      <div className="counter">
        <a className={classnames('btn-minus counter-minus', { 'btn-disabled':minimum || count === minimum })}>
          <span className="counter-click-mask" onTouchTap={evt => this.onBtnsTap(count - step, -step)} />
        </a>
        <a className={classnames('btn-add counter-add', { 'btn-disabled':maximum || count === maximum })}>
          <span className="counter-click-mask" onTouchTap={evt => this.onBtnsTap(count + step, step)} />
        </a>
        <span className="counter-num">{count}</span>
      </div>
    );
  },
});
