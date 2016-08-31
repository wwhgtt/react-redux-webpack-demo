const React = require('react');
const classnames = require('classnames');

require('./counter.scss');

module.exports = React.createClass({
  displayName:'ImportableCounter',
  propTypes: {
    count: React.PropTypes.number.isRequired,
    maximum: React.PropTypes.number,
    minimum: React.PropTypes.number,
    step: React.PropTypes.number,
    hiddenNum: React.PropTypes.number,
    onCountChange: React.PropTypes.func.isRequired,
    setErrorMsg:React.PropTypes.func.isRequired,
  },
  getDefaultProps() {
    return {
      count:4,
      minimum:1,
      maximum:99,
      step:1,
      hiddenNum:0,
    };
  },
  getInitialState() {
    const { count } = this.props;
    return {
      count,
    };
  },
  componentWillReceiveProps(newProps) {
    this.setState({ count:Number(newProps.count) });
  },
  componentDidUpdate() {
  },
  onChange(evt) {
    const { setErrorMsg, maximum, minimum, onCountChange } = this.props;
    const { count } = this.state;
    const value = evt.target.value;
    if (value === '') { return this.setState({ count:'' }); }
    if (value.match(/^\+?\d*$/) === null) {
      setErrorMsg('只能输入数字');
      this.setState({ count });
      return false;
    } else if (Number(value) > maximum) {
      setErrorMsg(`最多支持${maximum}人`);
      this.setState({ count });
      return false;
    } else if (Number(value) < minimum) {
      setErrorMsg(`至少输入${minimum}人`);
      this.setState({ count });
      return false;
    }
    return (this.setState({ count:value }), onCountChange(value));
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
    const { step, maximum, minimum, hiddenNum } = this.props;
    const { count } = this.state;
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
        <input className="counter-num" value={count} type="tel" onChange={this.onChange} />
        <a className="counter-add">
          <span className="counter-click-mask" onTouchTap={evt => this.onBtnsTap(count, step)} />
        </a>
      </div>
    );
  },
});
