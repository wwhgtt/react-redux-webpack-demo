const React = require('react');
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
    this.setState(newProps);
  },
  onSaveBtntap(evt) {
    const validateRet = this.validateInput();
    const { customerProps } = this.state;
    const { onDone, onCustomerPropsChange } = this.props;
    if (onCustomerPropsChange(evt, customerProps, validateRet)) {
      onDone(evt, '#customer-info');
    }
  },
  validateInput() {
    const rules = {
      name: [
        { msg: '请输入姓名', validate(value) { return !!value.trim(); } },
      ],
      mobile: [
        { msg: '请输入手机号', validate(value) { return !!value.trim(); } },
        { msg: '请录入正确的手机号', validate(value) { return /^1[34578]\d{9}$/.test(value); } },
      ],
    };

    const { customerProps } = this.state;
    for (const key in rules) {
      if (!rules.hasOwnProperty(key)) {
        continue;
      }

      const rule = rules[key];
      const value = customerProps[key];
      for (let i = 0, len = rule.length; i < len; i++) {
        const item = rule[i];
        const valid = item.validate(value || '');
        if (!valid) {
          return { valid: false, msg: item.msg };
        }
      }
    }
    return { valid: true, msg: '' };
  },
  handleBasicInfoChange(evt) {
    const input = evt.target;
    const propertys = {};
    let value = propertys[input.name] = input.value.trim();
    if (input.name === 'sex') {
      value = parseInt(value, 10) || 0;
    }

    const { customerProps } = this.state;
    this.setState({
      customerProps:customerProps.set(input.getAttribute('name'), value),
    });
  },
  render() {
    const { customerProps } = this.state;
    return (
      <div className="order-subpage">
        <div className="order-subpage-content">
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
            <button className="btn-submit btn--yellow" onTouchTap={this.onSaveBtntap}>保存</button>
          </div>
        </div>
      </div>
    );
  },
});
