const React = require('react');
require('./item-spand.scss');
const classnames = require('classnames');

module.exports = React.createClass({ // SexSwitch
  displayName: 'itemSpand',
  propTypes:{
    typeClass:React.PropTypes.string,
    giftUnitBefore:React.PropTypes.string,
    giftFontStyle:React.PropTypes.object,
    typeUnit:React.PropTypes.string,
    ruleVale:React.PropTypes.string,
    fullValue:React.PropTypes.number,
    periodStart:React.PropTypes.string,
    periodEnd:React.PropTypes.string,
    statusWord:React.PropTypes.string,
    validTime:React.PropTypes.object,
    codeNumber:React.PropTypes.string,
    instructions:React.PropTypes.array,
    getShowDetail:React.PropTypes.func,
    couponName:React.PropTypes.string,
  },
  getInitialState() {
    return { hideRule:true };
  },
  componentWillMount() {},
  componentDidMount() {},
  showDetail(e) {
    e.preventDefault();
    const { hideRule } = this.state;
    if (hideRule) {
      this.setState({ hideRule:false });
    } else {
      this.setState({ hideRule:true });
    }
  },
  render() {
    const { typeClass, giftUnitBefore, giftFontStyle, typeUnit, ruleVale, fullValue, couponName,
      periodStart, periodEnd, statusWord, validTime, codeNumber, instructions } = this.props;
    const { hideRule } = this.state;
    const UpRowLeftpartInnerStyle = {
      display: '-webkit-box',
      WebkitBoxOrient: 'vertical',
      WebkitLineClamp: 2,
    };
    return (
      <div>
        <div className="uprow of" onTouchTap={this.showDetail}>
          <div className={typeClass ? `uprow-leftpart ${typeClass}` : 'uprow-leftpart'}>
            <div className="uprow-leftpart-value">
              <div className="uprow-leftpart-inner" style={UpRowLeftpartInnerStyle}>
                {giftUnitBefore}<span className="discount-num" style={giftFontStyle}>{ruleVale}</span>{typeUnit}
              </div>
              <span className="expense-condition">消费满{fullValue || '0'}元可用
              {
                periodStart !== periodEnd && <span>({periodStart}~{periodEnd})</span>
              }
              </span>
              <p className="detail-click">
                {couponName}使用规则<span className={classnames('arrow', { arrowup:!hideRule, arrowdown:hideRule })}></span>
              </p>
            </div>
          </div>
          <div className="uprow-rightpart">
            <div>
              <p className="validity">{statusWord}</p>
              {validTime}
            </div>
          </div>
        </div>
        <div className={classnames('downrow of', { show:!hideRule })} data-code={codeNumber}>
          <p className="downrow-no">No.{codeNumber || '000000000000000'}</p>
          {
            instructions.map((item, index) => {
              if (item) {
                return <p className="downrow-item" key={index}>{item}</p>;
              }
              return false;
            }
            )
          }
        </div>
      </div>
    );
  },
});
