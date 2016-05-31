const React = require('react');
const DynamicClassAnchor = require('../../mui/misc/dynamic-class-hoc.jsx')('a');

module.exports = React.createClass({
  displayName: 'DishPropsOption',
  propTypes: {
    id: React.PropTypes.number.isRequired,
    name: React.PropTypes.string.isRequired,
    reprice: React.PropTypes.number.isRequired,
    isChecked: React.PropTypes.bool.isRequired,

  },
  render() {
    const { id, name, reprice, isChecked } = this.props;
    return (
      <DynamicClassAnchor className="dish-porps-option" data-id={id} isChecked={isChecked} data-reprice={reprice}>{name}</DynamicClassAnchor>
    );
  },
});
