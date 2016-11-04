const React = require('react');
const connect = require('react-redux').connect;
const queueDetailAction = require('../../action/queue-detail/queue-detail.js');
const dateUtility = require('../../helper/common-helper.js').dateUtility;
const Toast = require('../../component/mui/toast.jsx');

require('../../asset/style/style.scss');
require('../../component/order-detail/common.scss');
require('./application.scss');

const QueueDetailApplication = React.createClass({
  displayName: 'QueueDetailApplication',
  propTypes: {
    getQueueInfo: React.PropTypes.func,
    queueInfo: React.PropTypes.object,
    errorMsg: React.PropTypes.string,
    cancelQueue: React.PropTypes.func,
    setErrorMsg: React.PropTypes.func,
    setRefresh: React.PropTypes.func,
    isRefresh: React.PropTypes.bool,
  },

  getInitialState() {
    return ({
      // isDialogShow: false,
    });
  },

  componentWillMount() {
    this.props.getQueueInfo();
  },

  // 排队状态 queueStatus 0:排队中 1:入场 -1作废 -2取消
  getQueueStatus(queueInfo) {
    if (!queueInfo.queue) {
      return false;
    }

    let queueStatusStyle = '';
    let queueStatus = '';
    const queueStatusStr = String(queueInfo.queue.queueStatus);

    if (queueStatusStr === '1') {
      queueStatusStyle = 'queue-status-in';
    } else if (queueStatusStr === '-1') {
      queueStatusStyle = 'queue-status-timeOut';
    } else if (queueStatusStr === '-2') {
      queueStatusStyle = 'queue-status-cancel';
    }

    queueStatus = <div className={`queue-status ${queueStatusStyle}`}></div>;
    return queueStatus;
  },

  // 餐桌类型
  getTableType(queueInfo) {
    let minNum = '';
    let maxNum = '';
    if (queueInfo.ql) {
      minNum = queueInfo.ql.minPersonCount;
      maxNum = queueInfo.ql.maxPersonCount;
      if (minNum === maxNum) {
        return minNum;
      }
    }
    return `${minNum}-${maxNum}`;
  },

  // 下单人性别
  getUserSex(queueInfo) {
    let userSexStr = '';
    if (queueInfo.queue) {
      const sex = String(queueInfo.queue.sex);
      if (sex === '0') {
        userSexStr = '女士';
      } else if (sex === '1') {
        userSexStr = '男士';
      }
    }

    return userSexStr;
  },

  handleClearErrorMsg() {
    this.props.setErrorMsg('');
  },

  // 排队信息
  handleRefreshQueueInfo() {
    const { setRefresh, getQueueInfo, isRefresh } = this.props;
    if (isRefresh) {
      return;
    }
    setRefresh(true);
    getQueueInfo();
  },

  // 取消排队
  handleCancelQueue() {
    this.setState({ isDialogShow: true });
    this.props.cancelQueue();
  },

  render() {
    const { queueInfo, errorMsg, isRefresh } = this.props;
    // const { isDialogShow } = this.state;

    return (
      <div className="queue-page bg-orange application">
        <div className="queue-content content-fillet">
          <div className="box-head">
            <img className="box-head-logo" src={queueInfo.shopLogo} role="presentation" />
            <div className="ellipsis box-head-title">{queueInfo.shopName}</div>
          </div>
          <div className="divide-line">
            <div className="divide-line-title divide-line-time">
              {queueInfo.queue && dateUtility.format(new Date(queueInfo.queue.localCreateDateTime), 'yyyy/MM/dd HH:mm:ss')} 取号
            </div>
          </div>
          <div className="queue-info">
            <p className="queue-info-no">{queueInfo.ql && queueInfo.ql.queueChar}{queueInfo.queueNumber}</p>
            <p className="queue-info-table">{'未知'} {this.getTableType(queueInfo)}人</p>
          </div>
          {queueInfo.queue && String(queueInfo.queue.queueStatus) === '0' &&
            <div className="queue-detail">
              <div className="queue-waite">
                <p>在您之前还有
                  <span className="queue-waite-num">{queueInfo.queue.repastPersonCount}</span>
                  桌客人等候
                  <a className={`queue-waite-refresh ${isRefresh && 'refresh-animation'}`} onTouchTap={this.handleRefreshQueueInfo}></a>
                </p>
                <p className="queue-waite-tip">听到叫号请到迎宾台，过号作废</p>
              </div>
            </div>
          }

          <div className="queue-user clearfix">
            <span className="queue-user-name ellipsis">{queueInfo.queue && queueInfo.queue.name}{this.getUserSex(queueInfo)}</span>
            <span className="queue-user-phone ellipsis">{queueInfo.queue && queueInfo.queue.mobile}</span>
            <span className="queue-user-num ellipsis">{queueInfo.queue && queueInfo.queue.repastPersonCount}人</span>
          </div>
          {queueInfo.queue && String(queueInfo.queue.queueStatus) === '0' &&
            <div>
              <div className="divide-line">
                <div className="divide-line-title divide-line-waite">您可以</div>
              </div>
              <div className="queue-operate">
                <a className="btn-queue-cancel" onTouchTap={this.handleCancelQueue}>取消排队</a>
              </div>
            </div>
          }
          {this.getQueueStatus(queueInfo)}
        </div>
        {errorMsg && <Toast errorMessage={errorMsg} clearErrorMsg={this.handleClearErrorMsg} />}
        {
        //   isDialogShow && <Dialog
        //   hasTopBtnClose={false}
        //   title={'活动详情'}
        //   onClose={this.handleClose}
        //   theme="sliver"
        // >
        //   <p>是否取消排队？</p>
        // </Dialog>
        }
      </div>
    );
  },

});

module.exports = connect(state => state, queueDetailAction)(QueueDetailApplication);
