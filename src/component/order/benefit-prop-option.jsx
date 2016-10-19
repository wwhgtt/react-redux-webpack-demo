const React = require('react');
const classnames = require('classnames');
const DynamicClassLink = require('../mui/misc/dynamic-class-hoc.jsx')('a');
const shallowCompare = require('react-addons-shallow-compare');

module.exports = React.createClass({
  displayName: 'BenefitPropOption',
  propTypes: {
    priName: React.PropTypes.string.isRequired,
    priId:React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]).isRequired,
    priType:React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]).isRequired,
  },
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  },
  render() {
    const { priName, priId, priType, ...otherProps } = this.props;
    return (
      <div className="option">
        <span className="option-title">{priName}</span>
        <span style={{ display:'none' }}>{priId}{priType}</span>
        <DynamicClassLink className={classnames('option-btn')} {...otherProps} />
      </div>
    );
  },
});
