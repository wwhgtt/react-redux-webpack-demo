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
        <h3 className="address-title ellipsis">{address}</h3>
        <div className="address-meta clearfix">
          <div className="half ellipsis">{name} {sex}</div>
          <div className="half address-meta-phone">{mobile}</div>
        </div>
        <a
          className="address-edit"
          data-editor={id}
        >
        </a>
      </DynamicClassDiv>
    );
  },
});
