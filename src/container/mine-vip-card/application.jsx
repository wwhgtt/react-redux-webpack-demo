const React = require('react');
const connect = require('react-redux').connect;
const actions = require('../../action/mine/mine-vip-card.js');
require('../../asset/style/style.scss');
require('./application.scss');
const Loading = require('../../component/mui/loading.jsx');
const Toast = require('../../component/mui/toast.jsx');
const ShowVipCardList = require('../../component/mine/show-vip-card-list.jsx');
const VipCard = require('../../asset/images/vip-card.svg');

const MineVipCardApplication = React.createClass({
  displayName: 'MineVipCardApplication',
  propTypes:{
    getInfo:React.PropTypes.func.isRequired,
    clearErrorMsg:React.PropTypes.func,
    errorMessage:React.PropTypes.string,
    load:React.PropTypes.object,
    memberInfo:React.PropTypes.object.isRequired,
    userInfo:React.PropTypes.object.isRequired,
  },
  getInitialState() {
    return {};
  },
  componentWillMount() {},
  componentDidMount() {
    const { getInfo } = this.props;
    getInfo();
  },
  render() {
    const { errorMessage, clearErrorMsg, load, memberInfo, userInfo } = this.props;
    return (
      <div className="application">
        <div className="application-inner">
          <div className="vip-card">
            <div className="vip-card-inner">
              <img src={VipCard} alt="会员卡" className="vip-card-img" />
              <p className="vip-card-number">NO.{memberInfo.memberCard || '00000000000'}</p>
            </div>
          </div>
          <ShowVipCardList memberInfo={memberInfo} userInfo={userInfo} />
          {
            load.status ?
              <Loading word={load.word} />
            :
              false
          }
          {
          errorMessage ?
            <Toast clearErrorMsg={clearErrorMsg} errorMessage={errorMessage} />
          :
            false
          }
        </div>
        <div className="copyright"></div>
      </div>
    );
  },
});

module.exports = connect(state => state, actions)(MineVipCardApplication);
