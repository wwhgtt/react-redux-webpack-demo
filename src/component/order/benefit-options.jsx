const React = require('react');
module.exports = React.createClass({
  displayName: 'BenefitOptions',
  propTypes: {
    benefitProp:React.PropTypes.object.isRequired,
    benefitLength:React.PropTypes.func.isRequired,
  },
  componentDidMount() {

  },
  render() {
    const { benefitProp, benefitLength } = this.props;
    return (
      <div className="options">
        <div className="">
          {benefitProp ?
            <div className="benefit-prop">
              <span>优惠</span>
              <span>{benefitProp}</span>
            </div>
            :
            false
          }
          {benefitLength > 1 ?
            <button onTouchTap={evt => this.onSelectBenefit(evt)}>切换优惠</button>
            :
            false
          }
        </div>
      </div>
    );
  },
});
