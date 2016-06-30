const React = require('react');
const classnames = require('classnames');
const DynamicClassLink = require('../mui/misc/dynamic-class-hoc.jsx')('button');
const shallowCompare = require('react-addons-shallow-compare');

module.exports = React.createClass({
  displayName: 'OrderPropOption',
  propTypes: {
    name: React.PropTypes.string.isRequired,
    subname:React.PropTypes.string,
    type: React.PropTypes.string,
  },
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  },
  render() {
    const { name, subname, type, ...otherProps } = this.props;
    return (
      <div className="order-prop-option">
        <span>{name}</span>
        <small className="order-prop-desc">{subname}</small>
        <DynamicClassLink className={classnames("order-option-btn", { 'btn-tickbox':type === 'tickbox', 'btn-toggle':!type })} {...otherProps} />
      </div>
    );
  },
});
