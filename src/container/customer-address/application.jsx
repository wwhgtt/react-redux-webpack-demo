const React = require('react');
const connect = require('react-redux').connect;
const actions = require('../../action/customer-address/customer-address');
const getUrlParam = require('../../helper/dish-helper.js').getUrlParam;
const StandardAddressSelect = require('../../component/mui/standard-addrselect/standard-addrselect.jsx');
const CustomerAddressEditor = require('../../component/customer-address/customer-address-editor.jsx');
const Toast = require('../../component/mui/toast.jsx');
const shopId = getUrlParam('shopId');
const addressId = getUrlParam('addressId');
require('../../asset/style/style.scss');
require('./application.scss');
const CustomerAddressApplication = React.createClass({
  displayName: 'CustomerAddressApplication',
  propTypes: {
    // MapedActionsToProps
    fetchCustomerAddressInfo: React.PropTypes.func.isRequired,
    setChildView: React.PropTypes.func,
    setErrorMsg: React.PropTypes.func,
    setAddressInfo: React.PropTypes.func,
    fetchAllAddressList: React.PropTypes.func,
    saveCustomerAddressInfo: React.PropTypes.func,
    deleteCustomerAddressInfo: React.PropTypes.func,
    setSessionAndForwardEditUserAddress: React.PropTypes.func,
    // MapedStatesToProps
    allAddressList: React.PropTypes.array,
    errorMessage: React.PropTypes.string,
    clearErrorMsg: React.PropTypes.func,
    childView: React.PropTypes.string,
    customerProps: React.PropTypes.object.isRequired,
  },
  componentWillMount() {
    window.addEventListener('hashchange', this.setChildViewAccordingToHash);
  },
  componentDidMount() {
    const { fetchCustomerAddressInfo } = this.props;
    Promise.all([fetchCustomerAddressInfo(shopId, addressId)]).then(() => {
      this.setChildViewAccordingToHash();
    });
  },
  onAddressEditor(editor, option) {
    const { setSessionAndForwardEditUserAddress } = this.props;
    setSessionAndForwardEditUserAddress(shopId, editor);
  },
  setChildViewAccordingToHash() {
    const { setChildView } = this.props;
    const hash = location.hash;
    setChildView(hash);
    this.setDocumentTitleByHash(hash);
  },
  setDocumentTitleByHash(hash) {
    const title = {
      '#address-select': '选择位置',
    }[hash] || (addressId ? '编辑地址' : '新增地址');
    document.title = title;
  },
  handleAddressPropertyChange(propertys) {
    const { setAddressInfo } = this.props;
    setAddressInfo(propertys);
  },
  handleSelectComplete(pos) {
    const { setAddressInfo } = this.props;
    const propertys = {
      baseAddress: pos.address ? `${pos.title}(${pos.address})` : pos.title,
      latitude: pos.point.latitude,
      longitude: pos.point.longitude,
    };
    setAddressInfo(propertys);
    location.hash = '';
  },
  saveAddress(evt, validateRet, data) {
    const { setErrorMsg, saveCustomerAddressInfo } = this.props;
    if (!validateRet.valid) {
      setErrorMsg(validateRet.msg);
      return;
    }

    saveCustomerAddressInfo(evt, shopId, data);
  },
  deleteAddress(data) {
    const { deleteCustomerAddressInfo } = this.props;
    deleteCustomerAddressInfo(shopId, addressId);
  },
  render() {
    const { childView, errorMessage, clearErrorMsg, customerProps } = this.props;
    const getElement = () => {
      if (childView === '#address-select') {
        return (
          <StandardAddressSelect
            placeholder="请输入收货位置"
            searchResultMaxLength={6}
            onSelectComplete={this.handleSelectComplete}
          />);
      }
      return (
        <CustomerAddressEditor
          customerProps={customerProps}
          onPropertyChange={this.handleAddressPropertyChange}
          onSaveAddress={this.saveAddress}
          onRemoveAddress={this.deleteAddress}
        />);
    };
    return (
      <div className="application">
        <div style={{ display: childView ? 'none' : '' }}>
        </div>
        {getElement()}
        {errorMessage && <Toast errorMessage={errorMessage} clearErrorMsg={clearErrorMsg} />}
      </div>
    );
  },
});

module.exports = connect(state => state, actions)(CustomerAddressApplication);
