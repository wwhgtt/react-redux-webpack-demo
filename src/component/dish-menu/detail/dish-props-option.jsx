const React = require('react');
const DynamicClassAnchor = require('../../mui/misc/dynamic-class-hoc.jsx')('a');

require('./dish-props-option.scss');

module.exports = React.createClass({
  displayName: 'DishPropsOption',
  propTypes: {
    id: React.PropTypes.number.isRequired,
    name: React.PropTypes.string.isRequired,
    reprice: React.PropTypes.number.isRequired,
    isChecked: React.PropTypes.bool.isRequired,

  },
  render() {
    const { id, name, reprice, ...otherProps } = this.props;
    return (
      <DynamicClassAnchor className="dish-porps-option" data-id={id} data-reprice={reprice} {...otherProps}>
        <span className="name ellipsis">{name}</span>
        <span className="extra">+5.00元</span>
      </DynamicClassAnchor>
    );
  },
});
