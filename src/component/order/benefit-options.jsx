const React = require('react');
module.exports = React.createClass({
  displayName: 'BenefitOptions',
  propTypes: {
    benefitProps:React.PropTypes.array.isRequired,
  },
  componentDidMount() {

  },
  render() {
    const { benefitProps } = this.props;
    return (
      <div className="options">
        <div className="">
          {benefitProps ?
            <div className="benefit-prop">
              <span>优惠</span>
              <span>{benefitProps[0].priName}</span>
            </div>
            :
            false
          }
          {benefitProps.length > 1 ?
            <button onTouchTap={evt => this.onSelectBenefit(evt)}>切换优惠</button>
            :
            false
          }
        </div>
      </div>
    );
  },
});
