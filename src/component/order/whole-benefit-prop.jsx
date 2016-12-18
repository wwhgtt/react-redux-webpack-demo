const React = require('react');
// const classnames = require('classnames');
const DynamicClassLink = require('../mui/misc/dynamic-class-hoc.jsx')('a');
const shallowCompare = require('react-addons-shallow-compare');

module.exports = React.createClass({
  displayName: 'WholeOrderBenefit',
  propTypes: {
    name:React.PropTypes.string,
  },
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  },
  render() {
    const { name, ...otherProps } = this.props;
    return (
      <div className="option">
        <span className="option-title">{name}</span>
        <DynamicClassLink className="option-btn btn-toggle" {...otherProps} />
      </div>
    );
  },
});
