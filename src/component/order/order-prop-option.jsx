const React = require('react');
const DynamicClassLink = require('../mui/misc/dynamic-class-hoc.jsx')('a');
const shallowCompare = require('react-addons-shallow-compare');

module.exports = React.createClass({
  displayName: 'OrderPropOption',
  propTypes: {
    name: React.PropTypes.string.isRequired,
    isChecked: React.PropTypes.bool.isRequired,
    id:React.PropTypes.number.isRequired,
  },
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  },
  render() {
    const { name, isChecked, id, ...otherProps } = this.props;
    return (
      <div>
        <span>{name}</span>
        <DynamicClassLink className="order-prop-option" data-trigger="true" data-id={id} data-checked={isChecked} {...otherProps} >
          <button>选择</button>
        </DynamicClassLink>
      </div>

    );
  },
});
