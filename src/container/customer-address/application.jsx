const React = require('react');
const connect = require('react-redux').connect;
const actions = require('../../action/customer-address/customer-address');
const StandardAddressSelect = require('../../component/mui/standard-addrselect/standard-addrselect.jsx');
const CustomerAddressEditor = require('../../component/customer-address/customer-address-editor.jsx');
const Toast = require('../../component/mui/toast.jsx');
require('../../asset/style/style.scss');
require('./application.scss');
const CustomerAddressApplication = React.createClass({
  displayName: 'CustomerAddressApplication',
  propTypes: {
    // MapedActionsToProps
    // MapedStatesToProps
    errorMessage: React.PropTypes.string,
    clearErrorMsg: React.PropTypes.func,
    setChildView: React.PropTypes.func,
    childView: React.PropTypes.string,
    customerProps: React.PropTypes.object.isRequired,
  },
  getInitialState() {
    return {
    };
  },
  componentWillMount() {
  	
    window.addEventListener('hashchange', this.setChildViewAccordingToHash);
  },
  componentDidMount() {
    this.setChildViewAccordingToHash();
  },
  componentDidUpdate() {
  },
  setChildViewAccordingToHash() {
  	//debugger;
  	
    const { setChildView } = this.props;
    const hash = location.hash;
    setChildView(hash);
    //console.log(this.props)
  },
  resetChildView(evt) {
    evt.preventDefault();
    const { setChildView } = this.props;
    if (location.hash !== '') {
      location.hash = '';
    } else {
      setChildView('');
    }
  },
  submitOrder() {
  },
  render() {
    const { childView, errorMessage, clearErrorMsg, customerProps } = this.props;
    const customerAddressProps = {
      currentPoint: { lng: 104.066082, lat: 30.542718 },
      placeholder: '请选择收货地址',
      onSelectComplete(poi) {
      },
    };
    return (
      <div className="application">
        {
          childView ?
            <StandardAddressSelect {...customerAddressProps} />
            :
            <CustomerAddressEditor customerProps={customerProps} />
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
