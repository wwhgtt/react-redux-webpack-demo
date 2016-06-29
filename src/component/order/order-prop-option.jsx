const React = require('react');
const DynamicClassLink = require('../mui/misc/dynamic-class-hoc.jsx')('a');
const shallowCompare = require('react-addons-shallow-compare');

module.exports = React.createClass({
  displayName: 'OrderPropOption',
  propTypes: {
    name: React.PropTypes.string.isRequired,
  },
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  },
  render() {
    const { name, ...otherProps } = this.props;
    return (
      <div className="order-prop-option">
        <span>{name}</span>
        <DynamicClassLink {...otherProps} >
          <button>选择</button>
        </DynamicClassLink>
      </div>
    );
  },
});
