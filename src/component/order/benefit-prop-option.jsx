const React = require('react');
const classnames = require('classnames');
const DynamicClassLink = require('../mui/misc/dynamic-class-hoc.jsx')('a');
const shallowCompare = require('react-addons-shallow-compare');

module.exports = React.createClass({
  displayName: 'BenefitPropOption',
  propTypes: {
    priName: React.PropTypes.string.isRequired,
    id:React.PropTypes.string.isRequired,
  },
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  },
  render() {
    const { priName, id, ...otherProps } = this.props;
    return (
      <div className="option" key={id}>
        <span className="option-title">{priName}</span>
        <DynamicClassLink className={classnames('option-btn')} {...otherProps} />
      </div>
    );
  },
});
