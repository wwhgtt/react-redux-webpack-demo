const React = require('react');
const validateAddressInfo = require('../../helper/common-helper').validateAddressInfo;
require('./customer-toshop-info-editor.scss');

module.exports = React.createClass({
  displayName: 'CustomerToShopInfoEditor',
  propTypes: {
    customerProps: React.PropTypes.object,
    onSaveToShopAddress: React.PropTypes.func,
    onDone: React.PropTypes.func,
    onCustomerPropsChange: React.PropTypes.func,
  },
  getInitialState() {
    const { customerProps } = this.props;
    const state = customerProps ? customerProps.set('id', 'customer-info-shop') : {};
    return {
      customerProps: state,
    };
  },
  componentDidMount() {

  },
  componentWillReceiveProps(newProps) {
    if (newProps) {
      this.setState({ customerProps: newProps.customerProps.update('sex', value => +value) });
    }
  },
  onSaveBtntap(evt) {
    const { customerProps } = this.state;
    const { onDone, onCustomerPropsChange } = this.props;
    const validateRet = this.validateInput();
    if (onCustomerPropsChange(evt, customerProps, validateRet)) {
      onDone(evt, '#customer-info');
    }
  },
  validateInput() {
    const { customerProps } = this.state;
    return validateAddressInfo(customerProps, false);
  },
  handleBasicInfoChange(evt) {
    const input = evt.target;
    const propertys = {};
    let value = propertys[input.name] = input.value;
    if (input.name === 'sex') {
      value = value ? parseInt(value, 10) : -1;
    }
    const { customerProps } = this.state;
    this.setState({
      customerProps:customerProps.set(input.name, value),
    });
  },
  render() {
    const { customerProps } = this.state;
    return (
      <div className="subpage flex-columns">
        <div className="flex-rest">
          <div className="customer-address-page">
            <div className="options-group">
              <div className="option">
                <span className="option-title">姓名：</span>
                <div className="option-content">
                  <input
                    type="text"
                    className="option-input customer-name"
                    name="name"
                    id="editor-name"
                    placeholder="请录入姓名"
                    maxLength="30"
                    value={customerProps.name || ''}
                    onChange={this.handleBasicInfoChange}
                  />
                  <div className="customer-gender">
                    <label className="half">
                      <input
                        className="option-radio" type="radio" name="sex" defaultValue="1"
                        onChange={this.handleBasicInfoChange} defaultChecked={+customerProps.sex === 1}
                      />
                      <span className="btn-tickbox"></span>
                      <span className="option-desc">先生</span>
                    </label>
                    <label className="half">
                      <input
                        className="option-radio" type="radio" name="sex" defaultValue="0"
                        onChange={this.handleBasicInfoChange} defaultChecked={+customerProps.sex === 0}
                      />
                      <span className="btn-tickbox"></span>
                      <span className="option-desc">女士</span>
                    </label>
                  </div>
                </div>
              </div>

              <label className="option">
                <span className="option-title">联系电话：</span>
                <input
                  type="tel"
                  className="option-content option-input"
                  name="mobile"
                  onChange={this.handleBasicInfoChange}
                  maxLength="11"
                  placeholder="请输入手机号码"
                  value={customerProps.mobile || ''}
                />
              </label>
            </div>
          </div>
        </div>
        <button className="subpage-submit-btn btn--yellow flex-none" onTouchTap={this.onSaveBtntap}>保存</button>
      </div>
    );
  },
});
