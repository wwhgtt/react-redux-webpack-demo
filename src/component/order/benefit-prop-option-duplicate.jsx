const React = require('react');
const classnames = require('classnames');
const DynamicClassLink = require('../mui/misc/dynamic-class-hoc.jsx')('a');
const shallowCompare = require('react-addons-shallow-compare');

module.exports = React.createClass({
  displayName: 'BenefitPropOptionDuplicate',
  propTypes: {
    priName: React.PropTypes.string.isRequired,
    setActivityBenefit:React.PropTypes.func.isRequired,
  },
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  },
  render() {
    const { priName, setActivityBenefit, ...otherProps } = this.props;
    return (
      <div className="option" onTouchTap={setActivityBenefit} >
        <span className="option-title">{priName}</span>
        <DynamicClassLink className={classnames('option-btn')} {...otherProps} />
      </div>
    );
  },
});
