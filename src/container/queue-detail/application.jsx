const React = require('react');
const connect = require('react-redux').connect;
const ReactCSSTransitionGroup = require('react-addons-css-transition-group');
const queueDetailAction = require('../../action/order-detail/queue-detail.js');
const dateUtility = require('../../helper/common-helper.js').dateUtility;
const getUrlParam = require('../../helper/common-helper.js').getUrlParam;
const Toast = require('../../component/mui/toast.jsx');
const ConfirmDialog = require('../../component/mui/dialog/confirm-dialog.jsx');
const QueueInfoHover = require('../../component/book/book-info-hover.jsx');
const shopLogoDefault = require('../../asset/images/logo_default.svg');
const Loading = require('../../component/mui/loading.jsx');
const config = require('../../config');

require('../../asset/style/style.scss');
require('../../component/order-detail/common.scss');
require('./application.scss');

const QueueDetailApplication = React.createClass({
  displayName: 'QueueDetailApplication',
  propTypes: {
    // from reducers
    load:React.PropTypes.object,
    errorMessage: React.PropTypes.string,
    queueInfo: React.PropTypes.object,
    queueDetail: React.PropTypes.object,

    // from actions
    getQueueInfo: React.PropTypes.func,
    getQueueDetail: React.PropTypes.func,
    cancelQueue: React.PropTypes.func,
    setErrorMsg: React.PropTypes.func,
    clearErrorMsg: React.PropTypes.func,
    setRefresh: React.PropTypes.func,
    isRefresh: React.PropTypes.bool,
  },

  getInitialState() {
    return ({
      showBill:false,
      isDialogShow: false,
      shopLogo:shopLogoDefault,
    });
  },
  componentWillMount() {
    const { getQueueDetail } = this.props;
    getQueueDetail();
  },
  // 排队状态 queueStatus 0:排队中 1:入场 -1作废 -2取消
  getQueueStatus(queueDetail) {
    if (!queueDetail.queue) {
      return false;
    }

    let queueStatusStyle = '';
    let queueStatus = '';
    const queueStatusStr = String(queueDetail.queue.queueStatus);

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
  getTableType(queueDetail) {
    let minNum = '';
    let maxNum = '';
    if (queueDetail.ql) {
      minNum = queueDetail.ql.minPersonCount;
      if (queueDetail.ql.maxPersonCount) {
        maxNum = queueDetail.ql.maxPersonCount;
        if (minNum === maxNum) {
          return `${minNum}人`;
        }
        return `${minNum}-${maxNum}人`;
      }
    }
    return `${minNum}人及以上`;
  },

  // 下单人性别
  getUserSex(queueDetail) {
    let userSexStr = '';
    if (queueDetail.queue) {
      const sex = String(queueDetail.queue.sex);
      if (sex === '0') {
        userSexStr = '女士';
      } else if (sex === '1') {
        userSexStr = '先生';
      }
    }

    return userSexStr;
  },
  getHoverState() {
    this.setState({ showBill:false });
  },
  // 取消排队
  handleCancelQueue() {
    this.setState({ isDialogShow: false });
    this.props.cancelQueue();
  },
  goToBook() {
    const getMoreTSDishesURL = `${config.getMoreTSDishesURL}?shopId=${getUrlParam('shopId')}&type=PD`;
    location.href = getMoreTSDishesURL;
  },
  // 排队信息
  handleRefreshQueueDetail() {
    const { setRefresh, getQueueDetail, isRefresh } = this.props;
    if (isRefresh) {
      return;
    }
    setRefresh(true);
    getQueueDetail();
  },
  checkBill() {
    this.setState({ showBill:true });
  },
  handleDialog() {
    this.setState({ isDialogShow: !this.state.isDialogShow });
  },
  checkQueueList(orderDish, hasOrder) {
    if (orderDish) {
      if (hasOrder) {
        return (
          <div className="flex-rest">
            <div className="btn-row btn-row-sure" onTouchTap={this.checkBill}>查看菜单</div>
          </div>
        );
      }
      return (
        <div className="flex-rest">
          <div className="btn-row btn-row-sure" onTouchTap={this.goToBook}>排队点菜</div>
        </div>
      );
    }
    return false;
  },
  picError() {
    this.setState({ shopLogo:shopLogoDefault });
  },
  render() {
    const { queueInfo, queueDetail, getQueueInfo, errorMessage, isRefresh, clearErrorMsg, load } = this.props;
    const { showBill, isDialogShow, shopLogo } = this.state;
    const orderDish = queueDetail.orderDish === 1; // 是否已开通排队预点菜
    const hasOrder = queueDetail.hasOrder === 1; // 1 已点菜 0 未点菜
    const checkQueueList = this.checkQueueList(orderDish, hasOrder);
    return (
      <div className="queue-page bg-orange application">
        <div className="queue-content content-fillet">
          <div className="box-head">
            <img className="box-head-logo" role="presentation" src={shopLogo} onError={this.picError} />
            <div className="ellipsis box-head-title">{queueDetail.shopName}</div>
          </div>
          <div className="divide-line">
            <div className="divide-line-title divide-line-time">
              {queueDetail.queue && dateUtility.format(new Date(queueDetail.queue.createDateTime), 'yyyy/MM/dd HH:mm:ss')} 取号
            </div>
          </div>
          <div className="queue-info">
            <p className="queue-info-no">{queueDetail.ql && queueDetail.ql.queueChar}{queueDetail.queueNumber}</p>
            <p className="queue-info-table">{queueDetail.ql && queueDetail.ql.queueName} {this.getTableType(queueDetail)}桌</p>
          </div>
          {queueDetail.queue && String(queueDetail.queue.queueStatus) === '0' &&
            <div className="queue-detail">
              <div className="queue-waite">
                <p>在您之前还有
                  <span className="queue-waite-num">{queueDetail.count}</span>
                  桌客人等候
                  <a className={`queue-waite-refresh ${isRefresh && 'refresh-animation'}`} onTouchTap={this.handleRefreshQueueDetail}></a>
                </p>
                <p className="queue-waite-tip">听到叫号请到迎宾台，过号作废</p>
              </div>
            </div>
          }

          <div className="queue-user clearfix">
            <span className="queue-user-name ellipsis">{queueDetail.queue && queueDetail.queue.name}{this.getUserSex(queueDetail)}</span>
            <span className="queue-user-phone ellipsis">{queueDetail.queue && queueDetail.queue.mobile}</span>
            <span className="queue-user-num ellipsis">{queueDetail.queue && queueDetail.queue.repastPersonCount}人</span>
          </div>
          {queueDetail.queue && String(queueDetail.queue.queueStatus) === '0' &&
            <div>
              <div className="divide-line">
                <div className="divide-line-title divide-line-three">您可以</div>
              </div>
              <div className="queue-operate flex-row">
                <div className="flex-rest">
                  <a className="btn-queue-cancel" onTouchTap={this.handleDialog}>取消排队</a>
                </div>
                {checkQueueList}
              </div>
            </div>
          }
          {this.getQueueStatus(queueDetail)}
        </div>
        <ReactCSSTransitionGroup transitionName="slideuphover" transitionEnterTimeout={600} transitionLeaveTimeout={600}>
        {
          showBill && (
            <QueueInfoHover
              bookQueueItemList={queueInfo.dishItems}
              bookQueueDetail={queueDetail}
              setHoverState={this.getHoverState}
              getBookQueueInfo={getQueueInfo}
            />
          )
        }
        </ReactCSSTransitionGroup>
        {
          load.status && <Loading word={load.word} />
        }
        {
          errorMessage && <Toast clearErrorMsg={clearErrorMsg} errorMessage={errorMessage} />
        }
        {
          isDialogShow && <ConfirmDialog
            onCancel={this.handleDialog}
            onConfirm={this.handleCancelQueue}
            cancelText={'容我想想'}
            confirmText={'去意已决'}
          >
            <p>是否取消排队？</p>
          </ConfirmDialog>
        }
      </div>
    );
  },

});

module.exports = connect(state => state, queueDetailAction)(QueueDetailApplication);
