const React = require('react');
const Counter = require('../mui/counter.jsx');
const getUrlParam = require('../../helper/dish-hepler.js').getUrlParam;
require('./customer-info-editor.scss');

module.exports = React.createClass({
  displayName: 'CustomerInfoEditor',
  propTypes: {
    customerProps:React.PropTypes.object.isRequired,
    onDone:React.PropTypes.func.isRequired,
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
  onCountChange(newCount, increment) {
    const { customerProps } = this.state;
    this.setState({
      customerProps:customerProps.set('customerCount', newCount),
    });
  },
  onSubmitBtntap(evt) {
    const { customerProps } = this.state;
    const { onDone, onCustomerPropsChange } = this.props;
    if (onCustomerPropsChange(evt, customerProps)) onDone(evt, '');
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
      <div className="subpage flex-columns">
        <div className="flex-rest">
          <div className="options-group">
            <div className="option">
              <div className="editor-one-third">
                <span className="option-title">姓名：</span>
              </div>
              <div className="editor-two-thirds">
                <div className="option">
                  <input
                    className="editor-input"
                    name="name"
                    id="editor-name"
                    placeholder={customerProps.name}
                    onChange={this.handleBasicInfoChange}
                  />
                </div>
                <div className="option clearfix">
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
                      onChange={this.handleBasicInfoChange} defaultChecked={customerProps.sex < 1}
                    />
                    <span className="btn-tickbox"></span>
                    <span className="option-desc">女士</span>
                  </label>
                </div>
              </div>
            </div>

            <label className="option">
              <span className="option-title">联系电话：</span>
              <input className="editor-input" placeholder={customerProps.mobile} onChange={this.handleBasicInfoChange} disabled="disabled" />
            </label>
          </div>
          {getUrlParam('type') === 'TS' ?
            <div className="options-group">
              <div className="option">
                <span className="option-title">就餐人数：</span>
                <Counter minimum={1} count={customerProps.customerCount} maximum={99} step={1} onCountChange={this.onCountChange} />
              </div>
            </div>
            :
            false
          }

        </div>

        <button className="subpage-submit-btn btn--yellow flex-none" onTouchTap={this.onSubmitBtntap}>确定</button>
      </div>
    );
  },
});
