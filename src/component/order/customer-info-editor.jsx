const React = require('react');
require('./customer-info-editor.scss');

module.exports = React.createClass({
  displayName: 'CustomerInfoEditor',
  propTypes: {
    customerProps:React.PropTypes.object.isRequired,
    onCustomerPropsChange:React.PropTypes.func.isRequired,
  },
  getInitialState() {
    const { customerProps } = this.props;
    return {
      customerProps:customerProps.set('id', 'customer-info'),
    };
  },
  componentDidMount() {

  },
  componentWillReceiveProps(newProps) {
    this.setState(newProps);
  },
  handleBasicInfoChange(event) {
    const { customerProps } = this.state;
    const { onCustomerPropsChange } = this.props;
    this.setState({
      customerProps:customerProps.set(event.target.getAttribute('name'), event.target.value),
    });
    onCustomerPropsChange(customerProps);
  },
  render() {
    const { customerProps } = this.state;
    return (
      <div className="options-group">
        <div className="option flex-row">
          <span className="editor-title flex-none">姓名：</span>
          <input
            className="editor-input flex-rest"
            name="name"
            id="editor-name"
            placeholder={customerProps.name || '请输入姓名'}
            onChange={this.handleBasicInfoChange}
          />
          <div className="editor-gender-group flex-none">
            <label className="half">
              <input
                className="option-radio" type="radio" name="sex" defaultValue="1"
                onChange={this.handleBasicInfoChange} defaultChecked={customerProps.sex === '1'}
              />
              <span className="editor-gender">先生</span>
            </label>
            <label className="half">
              <input
                className="option-radio" type="radio" name="sex" defaultValue="0"
                onChange={this.handleBasicInfoChange} defaultChecked={customerProps.sex < 1}
              />
              <span className="editor-gender">女士</span>
            </label>
          </div>
        </div>

        <div className="option flex-row">
          <span className="editor-title flex-none">手机号：</span>
          <input
            className="editor-input editor-input--right flex-rest"
            placeholder={customerProps.mobile || '请输入手机号'}
            onChange={this.handleBasicInfoChange}
            disabled={customerProps.mobile ? customerProps.mobile.toString().trim().length === 11 : false}
          />
        </div>
      </div>
    );
  },
});
