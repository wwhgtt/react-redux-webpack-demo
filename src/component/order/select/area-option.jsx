const React = require('react');
const DynamicClassAncor = require('../../mui/misc/dynamic-class-hoc.jsx')('a');

module.exports = React.createClass({
  displayName: 'AreaOption',
  propTypes: {
    areaName: React.PropTypes.string.isRequired,
  },
  render() {
    const { areaName, ...props } = this.props;
    return (
      <DynamicClassAncor {...props} >
        {areaName}
      </DynamicClassAncor>
    );
  },
});
