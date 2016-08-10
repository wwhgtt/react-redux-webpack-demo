const React = require('react');
const connect = require('react-redux').connect;
const actions = require('../../action/customer-address/customer-address');
const getUrlParam = require('../../helper/dish-hepler.js').getUrlParam;
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
    saveCustomerAddressInfo: React.PropTypes.func,
    deleteCustomerAddressInfo: React.PropTypes.func,
    // MapedStatesToProps
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
  setChildViewAccordingToHash() {
    const { setChildView } = this.props;
    const hash = location.hash;
    setChildView(hash);
  },
  handleAddressPropertyChange(propertys) {
    const { setAddressInfo } = this.props;
    setAddressInfo(propertys);
  },
  handleSelectComplete(pos) {
    const { setAddressInfo } = this.props;
    const propertys = {
      street: pos.title,
      baseAddress: pos.address,
      latitude: pos.point.latitude,
      longitude: pos.point.longitude,
    };
    setAddressInfo(propertys);
    location.hash = '';
  },
  saveAddress(validateRet, data) {
    const { setErrorMsg, saveCustomerAddressInfo, customerProps } = this.props;
    if (!validateRet.valid) {
      setErrorMsg(validateRet.msg);
      return;
    }

    const address = Object.assign({}, customerProps);
    saveCustomerAddressInfo(address);
  },
  deleteAddress(data) {
    const { deleteCustomerAddressInfo, customerProps } = this.props;
    const address = Object.assign({}, customerProps);
    deleteCustomerAddressInfo(address);
  },
  render() {
    const { childView, errorMessage, clearErrorMsg, customerProps } = this.props;
    const currentPoint = {
      latitude: customerProps.latitude,
      longitude: customerProps.longitude,
      isGPSPoint: customerProps._isGPSPoint === true,
    };
    return (
      <div className="application">
        <div style={{ display: childView ? 'none' : '' }}>
        </div>
        {
          childView ?
            <StandardAddressSelect placeholder="请选择收货地址" currentPoint={currentPoint} onSelectComplete={this.handleSelectComplete} />
            :
            <CustomerAddressEditor
              customerProps={customerProps}
              onPropertyChange={this.handleAddressPropertyChange}
              onSaveAddress={this.saveAddress}
              onRemoveAddress={this.deleteAddress}
            />
        }
        {errorMessage ?
          <Toast errorMessage={errorMessage} clearErrorMsg={clearErrorMsg} />
          :
          false
        }
      </div>
    );
  },
});

module.exports = connect(state => state, actions)(CustomerAddressApplication);
