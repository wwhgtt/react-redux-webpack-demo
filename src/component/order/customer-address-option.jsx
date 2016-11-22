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
    const { id, address, sex, name, mobile, ...props } = this.props;
    return (
      <DynamicClassDiv className="address-option" {...props}>
        <div className="address-meta clearfix">
          <div className="half ellipsis address-meta-name">{[name, sex].join(' ').trim()}</div>
          <div className="half address-meta-phone">{mobile}</div>
        </div>
        <h3 className="address-title ellipsis">{address}</h3>
        <a
          className="address-edit"
          data-editor={id}
        >
        </a>
        <i className="address-option-border"></i>
      </DynamicClassDiv>
    );
  },
});
