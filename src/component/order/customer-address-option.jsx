const React = require('react');
const DynamicClassDiv = require('../../component/mui/misc/dynamic-class-hoc.jsx')('div');
const config = require('../../config');
const helper = require('../../helper/dish-hepler');

module.exports = React.createClass({
  displayName: 'CustomerAddressOption',
  propTypes: {
    id: React.PropTypes.number.isRequired,
    address: React.PropTypes.string.isRequired,
  },
  setSessionAndGoTo() {
    const { id } = this.props;
    sessionStorage.setItem('rurl_address', location.href);
    location.href = `${config.editUserAddressURL}?shopId=${helper.getUrlParam('shopId')}&id=${id}`;
  },
  render() {
    const { address, ...props } = this.props;
    return (
      <DynamicClassDiv className="address-option" {...props}>
        <span>{address}</span>
        <a
          className="address-edit"
          onTouchTap={this.setSessionAndGoTo}
        >
        </a>
      </DynamicClassDiv>
    );
  },
});
