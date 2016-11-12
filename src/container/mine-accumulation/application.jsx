require('../../asset/style/style.scss');
require('../../component/mine/income-expenses-list.scss');
require('./application.scss');
require('../../component/mine/common.scss');

const React = require('react');
const Dialog = require('../../component/mui/dialog/dialog.jsx');
const GrowAccumeList = require('../../component/mine/grow-accume-list.jsx');
const connect = require('react-redux').connect;
const dateUtility = require('../../helper/common-helper.js').dateUtility;
const mineAccumulationAction = require('../../action/mine/mine-accumulation.js');
const IScroll = require('iscroll/build/iscroll-probe');
const shallowCompare = require('react-addons-shallow-compare');

const MineAccumulationApplication = React.createClass({
  displayName: 'MineAccumulationApplication',
  propTypes: {
    accumulationInfo: React.PropTypes.object,
    fetchAccumulationInfo: React.PropTypes.func,
  },
  getInitialState() {
    return {
      descriptionContentVisible: false,
      hideLoad: false,
    };
  },
  componentWillMount() {
    this.props.fetchAccumulationInfo(1);
    this.pageNum = 1;
    this.wholeData = [];
  },
  componentDidMount() {
    const iScroll = this.iScroll = new IScroll('.records', {
      click: true,
      tap: true,
      probeType: 3,
    });

    iScroll.on('scrollStart', () => {
      this._className = '';
    });

    iScroll.on('scroll', () => {
      const distance = Math.abs(iScroll.y) - Math.abs(iScroll.maxScrollY);
      if (distance >= 50) {
        this._className = 'flip';
      }
    });

    iScroll.on('scrollEnd', () => {
      if (this._className === 'flip') {
        this.addItems();
      }
    });
  },
  componentWillReceiveProps(nextProps) {
    if (nextProps.accumulationInfo.pageSize === 1) {
      this.setState({ hideLoad:true });
    }
  },
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  },
  componentDidUpdate(prevProps, prevState) {
    this.iScroll.refresh();
  },
  addItems() {
    const { accumulationInfo } = this.props;
    this.pageNum++;
    if (accumulationInfo.pageSize >= this.pageNum) {
      this.props.fetchAccumulationInfo(this.pageNum);
    } else {
      this.setState({ hideLoad:true });
    }
  },
  toggleDescriptContent() {
    this.setState({ descriptionContentVisible: !this.state.descriptionContentVisible });
  },
  buildListElement() {
    const { accumulationInfo } = this.props;
    const { ihList } = accumulationInfo;

    if (!ihList || !ihList.length) {
      return [];
    }

    if (accumulationInfo.currentPage === this.pageNum) {
      this.wholeData = this.wholeData.concat(ihList);
    }
    const getIntegralTypeText = type => {
      const types = ['消费获得积分', '抽奖扣积分', '积分抵现', '消费获得积分退回', '抵现积分退回'];
      return types[type] || '获得积分';
    };

    return (
      this.wholeData.map((item, index) => {
        const amount = item.addIntegral;
        let amountClass = 'list-amount';

        if (+amount >= 0) {
          amountClass += ' positivenum';
        }
        return (
          <div className="list-box" key={index}>
            <span className={amountClass}>
              <i className="symbol"></i>
              {Math.abs(amount)}
            </span>
            <p className="list-title">{getIntegralTypeText(item.operateType)}</p>
            <div className="list-detail">
              <span className="list-detail-item">{dateUtility.format(new Date(item.createDateTime), 'yyyy/MM/dd')}</span>
              <span className="list-detail-item list-detail-name ellipsis">{item.commercialName}</span>
            </div>
          </div>
        );
      })
    );
  },
  buildDescriptContentElement() {
    const { levelRights, dishNames } = this.props.accumulationInfo;
    if (!levelRights) {
      return (
        <ul className="masthead-discription-content" >
          <li><label>积分规则: </label><p>无</p></li>
          <li><label>积分抵现: </label><p>无</p></li>
        </ul>
      );
    }

    let rules = [];
    rules.push(`每消费${levelRights.consumeValue}元可获得${levelRights.consumeGainValue}个积分`);
    if (levelRights.isGainAll === 0) {
      rules.push('全部商品可积分');
    } else {
      rules.push(`无积分商品：${dishNames}`);
    }

    let cash = [];
    if (levelRights.isExchangeCash === 0) {
      cash.push(`每${levelRights.exchangeIntegralValue}个积分抵现${levelRights.exchangeCashValue}元`);
      if (levelRights.limitType === 1) {
        cash.push('积分使用无上限');
      } else if (levelRights.limitType === 2) {
        cash.push(`单次最多可抵用${levelRights.limitIntegral}个积分`);
      } else if (levelRights.limitType === 3) {
        cash.push(`单次最多可抵用订单金额的${levelRights.discount}`);
      }
    } else {
      cash.push('不可抵现');
    }

    /* 判断有木有积分规则或者积分抵现*/
    if (!levelRights.consumeValue || !levelRights.consumeGainValue) {
      rules = ['不积分'];
    }

    if (!levelRights.exchangeIntegralValue || !levelRights.exchangeCashValue) {
      cash = ['不抵现'];
    }

    return (
      <ul className="masthead-discription-content">
        <li><label>积分规则: </label><p>{rules.join('\n')}</p></li>
        <li><label>积分抵现: </label><p>{cash.join('\n')}</p></li>
      </ul>
    );
  },
  render() {
    const { accumulationInfo } = this.props;
    const { hideLoad } = this.state;
    return (
      <div className="accumulation">
        <div className="masthead">
          <a className="masthead-discription-title" onTouchTap={this.toggleDescriptContent}>积分说明</a>
          <p className="masthead-total">{accumulationInfo.integral}</p>
          <p className="masthead-title">我的积分</p>
        </div>
        <GrowAccumeList
          listName="积分记录"
          buildListElement={this.buildListElement()}
          hideLoad={hideLoad}
        />
        {this.state.descriptionContentVisible &&
          <Dialog
            title="积分说明"
            theme="sliver"
            onClose={this.toggleDescriptContent}
          >
            {this.buildDescriptContentElement()}
          </Dialog>
        }
      </div>
    );
  },
});

module.exports = connect(state => state, mineAccumulationAction)(MineAccumulationApplication);
