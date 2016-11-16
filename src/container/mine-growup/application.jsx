const React = require('react');
const Dialog = require('../../component/mui/dialog/dialog.jsx');

const connect = require('react-redux').connect;
const dateUtility = require('../../helper/common-helper.js').dateUtility;
const mineGrowupAction = require('../../action/mine/mine-growup.js');
const GrowAccumeList = require('../../component/mine/grow-accume-list.jsx');
const shallowCompare = require('react-addons-shallow-compare');
const IScroll = require('iscroll/build/iscroll-probe');
require('../../asset/style/style.scss');
require('../../component/mine/income-expenses-list.scss');
require('../mine-accumulation/application.scss');
require('./application.scss');
require('../../component/mine/common.scss');

const MineGrowupApplication = React.createClass({
  displayName: 'MineGrowupApplication',
  propTypes: {
    growupInfo: React.PropTypes.object,
    currentRule: React.PropTypes.object,
    fetchGrowupInfo: React.PropTypes.func.isRequired,
    fetchCurrGrownRule: React.PropTypes.func.isRequired,
  },
  getInitialState() {
    return {
      descriptionContentVisible: false,
    };
  },
  componentWillMount() {
    this.props.fetchGrowupInfo().then(this.props.fetchCurrGrownRule);
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
    if (nextProps.growupInfo.pageSize === 1) {
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
    const { growupInfo } = this.props;
    this.pageNum++;
    if (growupInfo.pageSize >= this.pageNum) {
      this.props.fetchGrowupInfo(this.pageNum);
    } else {
      this.setState({ hideLoad:true });
    }
  },
  toggleDescriptContent() {
    this.setState({ descriptionContentVisible: !this.state.descriptionContentVisible });
  },
  buildListElement() {
    const { ghList } = this.props.growupInfo;
    if (!ghList || !ghList.length) {
      return [];
    }

    const getGrowthTypeText = type => {
      let ret = '消费增加成长值';
      if (type === 2) {
        ret = '修改会员等级变动成长值';
      }
      return ret;
    };

    return (
      ghList.map((item, index) => {
        const amount = item.addValue;
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
            <p className="list-title">{getGrowthTypeText(item.grownType)}</p>
            <div className="list-detail">
              <span className="list-detail-item">{dateUtility.format(new Date(item.serverUpdateTime), 'yyyy/MM/dd')}</span>
              <span className="list-detail-item list-detail-name ellipsis">{item.commercialName}</span>
            </div>
          </div>
        );
      })
    );
  },
  buildDescriptContentElement() {
    const { currentRule } = this.props;
    if (!currentRule) {
      return <p>无</p>;
    }

    const text = `每消费${currentRule.grownConsumeValue}元可获得${currentRule.grownConsumeGainValue}点成长值`;
    return (
      <ul className="masthead-discription-content" onTouchTap={this.toggleDescriptContent}>
        <li style={{ textAlign: 'center' }}>{text}</li>
      </ul>
    );
  },
  render() {
    const { currentRule } = this.props;
    const { hideLoad } = this.state;
    return (
      <div className="accumulation">
        <div className="masthead">
          <a className="masthead-discription-title" onTouchTap={this.toggleDescriptContent}>成长值说明</a>
          <p className="masthead-total">{currentRule && currentRule.curGrownValue}</p>
          <p className="masthead-title">我的成长值</p>
        </div>
        <GrowAccumeList
          listName="成长值记录"
          buildListElement={this.buildListElement()}
          hideLoad={hideLoad}
        />
        {/* <div className="footer copyright"></div> */}
        {this.state.descriptionContentVisible &&
          <Dialog
            title="成长值说明"
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
module.exports = connect(state => state, mineGrowupAction)(MineGrowupApplication);
