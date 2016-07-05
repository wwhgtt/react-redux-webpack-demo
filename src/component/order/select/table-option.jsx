const React = require('react');
const DynamicClassAncor = require('../../mui/misc/dynamic-class-hoc.jsx')('a');
const shallowCompare = require('react-addons-shallow-compare');

module.exports = React.createClass({
  displayName: 'TableOption',
  propTypes: {
    tableName: React.PropTypes.string.isRequired,
  },
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
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
