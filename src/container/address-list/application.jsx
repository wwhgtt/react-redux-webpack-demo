const React = require('react');
const connect = require('react-redux').connect;
const actions = require('../../action/customer-address/customer-address');
const getUrlParam = require('../../helper/dish-hepler.js').getUrlParam;
const ActiveSelect = require('../../component/mui/select/active-select.jsx');
const CustomerAddressOption = require('../../component/order/customer-address-option.jsx');
const shopId = getUrlParam('shopId') || '';

require('../../asset/style/style.scss');
require('../../component/order/customer-takeaway-info-editor.scss');
require('./application.scss');

const AddressListApplication = React.createClass({
  displayName: 'AddressListApplication',
  propTypes: {
    fetchAllAddressList: React.PropTypes.func,
    setSessionAndForwardEditUserAddress: React.PropTypes.func,
    // MapedStatesToProps
    allAddressList: React.PropTypes.array,
  },
  getInitialState() {
    return {
      allAddressList: [],
      isShowTip: false,
    };
  },
  componentDidMount() {
    const { fetchAllAddressList } = this.props;
    fetchAllAddressList(shopId);
  },
  componentWillReceiveProps(newProps) {
    this.initStateByProps(newProps);
  },
  onAddressSelect(evt, option) {
    const dataset = evt.target.dataset;
    const { allAddressList } = this.state;
    const { setSessionAndForwardEditUserAddress } = this.props;
    if (!dataset.hasOwnProperty('editor')) {
      return;
    }
    if (!dataset.editor) {
      if (allAddressList.length >= 10) {
        this.setState({ isShowTip: true });
        setTimeout(() => {
          this.setState({ isShowTip: false });
        }, 5000);
        return;
      }
    }

    setSessionAndForwardEditUserAddress(shopId, dataset.editor);
  },
  initStateByProps(props) {
    const { allAddressList } = props;
    if (!allAddressList) {
      return;
    }

    this.setState({
      allAddressList,
    });
  },
  buildAddressElement() {
    const { allAddressList } = this.state;
    const elems = [];
    const addressListToOptionsData = addressList => addressList.map(item => {
      const { address, name, sex, mobile } = item;
      return {
        id: item.id,
        address,
        label: address,
        name,
        mobile,
        isChecked: item.isChecked,
        sex: sex === 1 ? '先生' : '女士 ',
      };
    });
    if (allAddressList.length) {
      elems.push(
        <ActiveSelect
          key="inSelect"
          className="address-group flex-rest"
          optionsData={addressListToOptionsData(allAddressList)}
          optionComponent={CustomerAddressOption}
          onSelectOption={this.onAddressSelect}
        />
      );
    } else {
      elems.push(
        <div className="address-no flex-rest" key="noAddress">
          <div className="address-no-img"></div>
          <p className="address-no-title">主人还没有收货地址 <br />快来添加一个吧～</p>
        </div>
      );
    }
    return elems;
  },
  render() {
    const { isShowTip } = this.state;
    return (
      <div className="address flex-columns">
      {isShowTip &&
        <div className="address-comments ellipsis flex-none">
          只能保存10个地址，如需新增，请删除或修改
        </div>
      }
        {this.buildAddressElement()}
        <a key="add" className="address-add-more btn--yellow flex-none" onTouchTap={this.onAddressSelect} data-editor="">新增地址</a>
      </div>
    );
  },
});
module.exports = connect(state => state, actions)(AddressListApplication);
