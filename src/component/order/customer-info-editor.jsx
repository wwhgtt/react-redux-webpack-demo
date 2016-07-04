const React = require('react');
const Counter = require('../mui/counter.jsx');

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
  onCountChange(newCount, increment) {
    const { customerProps } = this.state;
    this.setState({
      customerProps:customerProps.set('customerCount', newCount),
    });
  },
  onSubmitBtntap() {
    const { customerProps } = this.state;
    const { onCustomerPropsChange } = this.props;
    window.location.hash = '';
    onCustomerPropsChange(null, customerProps);
  },
  handleBasicInfoChange(event) {
    const { customerProps } = this.state;
    this.setState({
      customerProps:customerProps.set(event.target.getAttribute('name'), event.target.value),
    });
  },
  render() {
    const { customerProps } = this.state;
    return (
      <div className="order-subpage">
        <div className="options-group">
          <div className="order-prop-option">
            <div className="editor-one-third">
              <span className="option-title">姓名：</span>
            </div>
            <div className="editor-two-thirds">
              <div className="order-prop-option">
                <input className="editor-input" id="editor-name" placeholder={customerProps.name} onChange={this.handleBasicInfoChange} />
              </div>
              <div className="order-prop-option clearfix">
                <label className="half">
                  <input
                    className="option-radio" type="radio" name="sex" defaultValue="1"
                    onChange={this.handleBasicInfoChange} defaultChecked={customerProps.sex === '1'}
                  />
                  <span className="btn-tickbox"></span>
                  <span className="option-desc">先生</span>
                </label>
                <label className="half">
                  <input
                    className="option-radio" type="radio" name="sex" defaultValue="0"
                    onChange={this.handleBasicInfoChange} defaultChecked={customerProps.sex === '0'}
                  />
                  <span className="btn-tickbox"></span>
                  <span className="option-desc">女士</span>
                </label>
              </div>
            </div>
          </div>

          <label className="order-prop-option">
            <span className="option-title">联系电话：</span>
            <input className="editor-input" placeholder={customerProps.mobile} onChange={this.handleBasicInfoChange} />
          </label>
        </div>

        <div className="options-group">
          <div className="order-prop-option">
            <span className="option-title">就餐人数：</span>
            <Counter minimum={1} count={customerProps.customerCount} maximum={99} step={1} onCountChange={this.onCountChange} />
          </div>
        </div>

        <button className="order-subpage-submit btn--yellow" onTouchTap={this.onSubmitBtntap}>确定</button>
      </div>
    );
  },
});
