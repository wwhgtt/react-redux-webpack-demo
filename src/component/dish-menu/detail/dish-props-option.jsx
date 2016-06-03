const React = require('react');
const DynamicClassButton = require('../../mui/misc/dynamic-class-hoc.jsx')('button');
const shallowCompare = require('react-addons-shallow-compare');
require('./dish-props-option.scss');

module.exports = React.createClass({
  displayName: 'DishPropsOption',
  getDefaultProps() {
    return {
      isChecked: false,
    };
  },
  propTypes: {
    id: React.PropTypes.number.isRequired,
    name: React.PropTypes.string.isRequired,
    reprice: React.PropTypes.number.isRequired,
    isChecked: React.PropTypes.bool.isRequired,

  },
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  },
  render() {
    const { id, name, reprice, ...otherProps } = this.props;
    return (
      <DynamicClassButton className="dish-porps-option" data-id={id} data-reprice={reprice} {...otherProps}>
        <span className="name ellipsis">{name}</span>
        {reprice !== 0 ? <span className="extra">{reprice > 0 ? '+' : ''}{reprice}元</span> : false}
      </DynamicClassButton>
    );
  },
});
