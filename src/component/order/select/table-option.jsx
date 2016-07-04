const React = require('react');
const DynamicClassAncor = require('../../mui/misc/dynamic-class-hoc.jsx')('a');

module.exports = React.createClass({
  displayName: 'TableOption',
  propTypes: {
    tableName: React.PropTypes.string.isRequired,
  },
  render() {
    const { tableName, ...props } = this.props;
    return (
      <DynamicClassAncor {...props} >
        {tableName}
      </DynamicClassAncor>
    );
  },
});
