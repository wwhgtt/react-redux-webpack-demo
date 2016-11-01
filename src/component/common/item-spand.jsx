const React = require('react');
require('./item-spand.scss');
const classnames = require('classnames');

module.exports = React.createClass({ // SexSwitch
  displayName: 'itemSpand',
  propTypes:{
    typeClass:React.PropTypes.string,
    giftUnitBefore:React.PropTypes.string,
    giftFontSize:React.PropTypes.string,
    typeUnit:React.PropTypes.string,
    ruleVale:React.PropTypes.string,
    fullValue:React.PropTypes.number,
    periodStart:React.PropTypes.string,
    periodEnd:React.PropTypes.string,
    hideRule:React.PropTypes.bool,
    statusWord:React.PropTypes.string,
    validTime:React.PropTypes.object,
    codeNumber:React.PropTypes.string,
    instructions:React.PropTypes.array,
    getShowDetail:React.PropTypes.func,
  },
  getInitialState() {
    return {};
  },
  componentWillMount() {},
  componentDidMount() {},
  showDetail(num) {
    const { getShowDetail } = this.props;
    getShowDetail(num);
  },
  render() {
    const { typeClass, giftUnitBefore, giftFontSize, typeUnit, ruleVale, fullValue,
      periodStart, periodEnd, hideRule, statusWord, validTime, codeNumber, instructions } = this.props;
    return (
      <div>
        <div className="uprow of" onTouchTap={() => this.showDetail(codeNumber)}>
          <div className={typeClass ? `uprow-leftpart ${typeClass}` : 'uprow-leftpart'}>
            <div className="uprow-leftpart-value">
              {giftUnitBefore}<span className="discount-num" style={{ fontSize:giftFontSize }}>{ruleVale}</span>{typeUnit}
              <br />
              <span className="expense-condition">消费满{fullValue || '0'}元可用
              ({periodStart}~{periodEnd})
              </span>
              <p className="detail-click">
                代金券使用规则<span className={classnames({ arrowup:!hideRule, arrowdown:hideRule })}></span>
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
          <p className="downrow-no">NO.{codeNumber || '000000000000000'}</p>
          {
            instructions.map((item, index) =>
              <p className="downrow-item" key={index}>{item}</p>
            )
          }
        </div>
      </div>
    );
  },
});
