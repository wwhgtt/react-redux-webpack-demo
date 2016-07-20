const React = require('react');
const DynamicClassDiv = require('../../component/mui/misc/dynamic-class-hoc.jsx')('div');

module.exports = React.createClass({
  displayName: 'CustomerAddressOption',
  propTypes: {
    id: React.PropTypes.number.isRequired,
    address: React.PropTypes.string.isRequired,
  },
  render() {
    const { id, address, ...props } = this.props;
    return (
      <DynamicClassDiv className="address-option" {...props}>
        <span>{address}</span>
        <a
          className="address-edit"
          data-node={id}
        >
        </a>
      </DynamicClassDiv>
    );
  },
});
