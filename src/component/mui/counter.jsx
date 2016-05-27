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
      step:1,
    };
  },
  onBtnsClick(action, count) {
    const { maximum, minimum, onCountChange } = this.props;
    if ((!maximum || count > maximum) || (!minimum || count < minimum)) {
      return false;
    }
    return onCountChange(action, count);
  },
  render() {
    const { count, step, maximum, minimum } = this.props;
    return (
      <div className="counter">
        <a
          className={classnames('btn-minus counter-minus', { 'btn-disabled':!minimum || count === minimum })}
          onTouchTap={evt => this.onBtnsClick('minus', count - step)}
        >
        </a>
        <a
          className={classnames('btn-add counter-add', { 'btn-disabled':!maximum || count === maximum })}
          onTouchTap={evt => this.onBtnsClick('add', count + step)}
        >
        </a>
        <span className="counter-num">{count}</span>
      </div>
    );
  },
});
