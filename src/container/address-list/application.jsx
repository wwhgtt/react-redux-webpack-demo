const React = require('react');
const connect = require('react-redux').connect;
const actions = require('../../action/customer-address/customer-address');
const getUrlParam = require('../../helper/dish-hepler.js').getUrlParam;
const AddresList = require('../../component/address-list/address-list.jsx');
const shopId = getUrlParam('shopId') || '';
require('../../asset/style/style.scss');
require('./application.scss');
const AddressListApplication = React.createClass({
  displayName: 'AddressListApplication',
  propTypes: {
    fetchAllAddressList: React.PropTypes.func,
    setSessionAndForwardEditUserAddress: React.PropTypes.func,
    // MapedStatesToProps
    allAddressList: React.PropTypes.array,
  },
  componentDidMount() {
    const { fetchAllAddressList } = this.props;
    fetchAllAddressList(shopId);
  },
  onAddressEditor(editor, option) {
    const { setSessionAndForwardEditUserAddress } = this.props;
    setSessionAndForwardEditUserAddress(shopId, editor);
  },
  render() {
    return (
      <AddresList
        allAddressList={this.props.allAddressList || []}
        onAddressEditor={this.onAddressEditor}
      />
    );
  },
});
module.exports = connect(state => state, actions)(AddressListApplication);
