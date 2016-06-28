const React = require('react');
const DynamicClassButton = require('../mui/misc/dynamic-class-hoc.jsx')('button');
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
        <DynamicClassButton className="order-prop-option" data-id={id} data-checked={isChecked} {...otherProps}>
          <span className="order-prop-checked">{isChecked ? '选中' : '未选中'}</span>
        </DynamicClassButton>
      </div>

    );
  },
});
