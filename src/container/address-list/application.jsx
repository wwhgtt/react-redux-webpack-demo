const React = require('react');
const connect = require('react-redux').connect;
const actions = require('../../action/customer-address/customer-address');
const getUrlParam = require('../../helper/dish-hepler.js').getUrlParam;
const ActiveSelect = require('../../component/mui/select/active-select.jsx');
const CustomerAddressOption = require('../../component/order/customer-address-option.jsx');
const shopId = getUrlParam('shopId') || '';

require('../../component/order/customer-takeaway-info-editor.scss');
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
  getInitialState() {
    return {
      allAddressList: [],
    };
  },
  componentDidMount() {
    const { fetchAllAddressList } = this.props;
    fetchAllAddressList(shopId);
  },
  componentWillReceiveProps(newProps) {
    this.initStateByProps(newProps);
  },
  onAddressEditor(editor, option) {
    const { setSessionAndForwardEditUserAddress } = this.props;
    setSessionAndForwardEditUserAddress(shopId, editor);
  },
  onAddressSelect(evt, option, func) {
    const editor = evt.target.getAttribute('data-editor');
    this.onAddressEditor(editor, option);
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
          className="address-group"
          optionsData={addressListToOptionsData(allAddressList)}
          optionComponent={CustomerAddressOption}
          onSelectOption={this.onAddressSelect}
        />
      );
    }
    if (allAddressList.length < 10) {
      elems.push(<a key="add" className="address-add-more" onTouchTap={this.onAddressSelect}>增加地址</a>);
    }
    return elems;
  },
  render() {
    return (
      <div className="order-subpage">
        <div className="order-subpage-content">
          {this.buildAddressElement()}
          <div className="address-title address-count-descript">
            最多为您保存10个常用地址，还需要新增，请删除或修改以上地址
          </div>
        </div>
      </div>
    );
  },
});
module.exports = connect(state => state, actions)(AddressListApplication);
