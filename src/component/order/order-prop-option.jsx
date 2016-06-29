const React = require('react');
const DynamicClassLink = require('../mui/misc/dynamic-class-hoc.jsx')('a');
const shallowCompare = require('react-addons-shallow-compare');

module.exports = React.createClass({
  displayName: 'OrderPropOption',
  propTypes: {
    name: React.PropTypes.string,
    subname:React.PropTypes.string,
  },
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  },
  render() {
    const { name, subname, ...otherProps } = this.props;
    return (
      <div className="order-prop-option">
        <span>{name}</span>
        <span>{subname}</span>
        <DynamicClassLink {...otherProps} >
          <button>选择</button>
        </DynamicClassLink>
      </div>
    );
  },
});
