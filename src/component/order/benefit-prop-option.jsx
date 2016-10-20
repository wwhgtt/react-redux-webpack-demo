const React = require('react');
const classnames = require('classnames');
const DynamicClassLink = require('../mui/misc/dynamic-class-hoc.jsx')('a');
const shallowCompare = require('react-addons-shallow-compare');

module.exports = React.createClass({
  displayName: 'BenefitPropOption',
  propTypes: {
    priName: React.PropTypes.string.isRequired,
    priId:React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
    priType:React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
    dishNum:React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
    reduce:React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
    discount:React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
  },
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  },
  render() {
    const { priName, priId, priType, dishNum, reduce, discount, ...otherProps } = this.props;
    return (
      <div className="option">
        <span className="option-title">{+priType === 2 ? `礼品券(${priName})` : priName}</span>
        <span style={{ display:'none' }}>{priId}{priType}{dishNum}{reduce}{discount}</span>
        <DynamicClassLink className={classnames('option-btn')} {...otherProps} />
      </div>
    );
  },
});
