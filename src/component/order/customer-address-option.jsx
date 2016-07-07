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
  render() {
    const { id, address, ...props } = this.props;
    return (
      <DynamicClassDiv {...props}>
        <span>{address}</span>
        <a
          href={`${config.editUserAddressURL}?shopId=${helper.getUrlParam('type')}&id=${id}`}
        >
        </a>
      </DynamicClassDiv>
    );
  },
});
