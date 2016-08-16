const React = require('react');
const DynamicClassDiv = require('../../component/mui/misc/dynamic-class-hoc.jsx')('div');

module.exports = React.createClass({
  displayName: 'CustomerAddressOption',
  propTypes: {
    id: React.PropTypes.number.isRequired,
    address: React.PropTypes.string.isRequired,
    sex: React.PropTypes.string,
    mobile: React.PropTypes.string,
    name: React.PropTypes.string,
  },
  render() {
    const { id, address, ...props, sex, name, mobile } = this.props;
    return (
      <DynamicClassDiv className="address-option" {...props}>
        <h3 className="ellipsis">{address}</h3>
        <p>
          <small className="name ellipsis">{name} {sex}</small><small className="phone">{mobile}</small>
        </p>
        <a
          className="address-edit"
          data-editor={id}
        >
        </a>
      </DynamicClassDiv>
    );
  },
});
