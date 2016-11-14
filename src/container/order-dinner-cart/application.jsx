const React = require('react');
const ReactCSSTransitionGroup = require('react-addons-css-transition-group');
const connect = require('react-redux').connect;
const actions = require('../../action/order-dinner-cart/order-dinner-cart');
const DinnerTableSelect = require('../../component/order/dinner-cart-table-select.jsx');
const Toast = require('../../component/mui/toast.jsx');
const Loading = require('../../component/mui/loading.jsx');
const ImportableCounter = require('../../component/mui/importable-counter.jsx');
const CartOrderedDish = require('../../component/dish-menu/cart/cart-ordered-dish.jsx');
const wxClient = require('wechat-jssdk/client');
const dishHelper = require('../../helper/dish-hepler');
const getSubmitDishData = require('../../helper/order-helper').getSubmitDishData;
const defaultPersonLogo = require('../../asset/images/person-default.svg');
const shopId = dishHelper.getUrlParam('shopId');

require('../../asset/style/style.scss');
require('./application.scss');
require('../../component/order/customer-info-editor.scss');
require('../../component/order/order-summary.scss');

const OrderTSCartApplication = React.createClass({
  displayName: 'OrderTSCartApplication',
  propTypes: {
    // MapedActionsToProps
    fetchOrderInfo: React.PropTypes.func.isRequired,
    fetchShopSetting: React.PropTypes.func.isRequired,
    fetchWXAuthInfo: React.PropTypes.func.isRequired,
    setOrderInfo: React.PropTypes.func.isRequired,
    setOrderDish: React.PropTypes.func.isRequired,
    fetchLastOrderedDishes: React.PropTypes.func.isRequired,
    removeAllOrders: React.PropTypes.func.isRequired,
    selectTable: React.PropTypes.func.isRequired,
    gotoDishMenuPage: React.PropTypes.func.isRequired,
    submitOrder: React.PropTypes.func.isRequired,
    initOrderTable: React.PropTypes.func.isRequired,
    fetchTableIdFromNewVersionQRCode: React.PropTypes.func.isRequired,
    fetchMainOrderInfo: React.PropTypes.func.isRequired,
    // MapedStatesToProps
    orderTSCart: React.PropTypes.object.isRequired,
    dishMenu: React.PropTypes.object.isRequired,
  },
  getInitialState() {
    return {
      tableVisible: false,
      loadingInfo: {},
      errorMessage: '',
    };
  },
  componentDidMount() {
    const { fetchOrderInfo, fetchLastOrderedDishes, fetchShopSetting, fetchWXAuthInfo, initOrderTable, fetchMainOrderInfo } = this.props;
    fetchLastOrderedDishes();
    fetchOrderInfo(this.setErrorMsg);
    initOrderTable(tableInfo => {
      const { tableId, tableKey } = tableInfo;
      if (!tableId && !tableKey) {
        fetchShopSetting(this.setErrorMsg).then(res => {
          fetchWXAuthInfo(this.setErrorMsg);
        });
        return;
      }
      fetchMainOrderInfo(tableId, tableKey, this.setErrorMsg);
    });
  },
  componentWillReceiveProps(newProps) {
    const { wxAuthInfo } = newProps.orderTSCart;
    if (!this._wxClient && wxAuthInfo) {
      const { shopSetting } = this.props.orderTSCart;
      let wxAuthSuccess = true;
      this._wxClient = wxClient(Object.assign({
        debug: false,
        appId: wxAuthInfo.appid,
        timestamp: 0,
        nonceStr: wxAuthInfo.noncestr,
        signature: '',
        success: suc => {
          this.props.setOrderInfo(null, { wxAuthSuccess });
        },
        error: err => {
          // 强制扫码
          if (shopSetting.enableScanTable && !shopSetting.enableSelectTable) {
            this.setErrorMsg(`商户配置错误 ${err.errMsg}`);
          }
          wxAuthSuccess = false;
        },
        jsApiList: [
          'scanQRCode',
        ],
      }, wxAuthInfo));
    }
  },
  onValueChange(evt) {
    const info = {};
    const { member } = this.props.orderTSCart;
    const { name, value } = evt.target;
    const convertValue = ({
      sex: _value => +_value,
    })[name];

    info[name] = convertValue ? convertValue(value) : value;
    this.props.setOrderInfo(null,
      member.hasOwnProperty(name) ? { member: Object.assign({}, member, info) } : info);
  },
  onDishCountChange(dishData, increment) {
    this.props.setOrderDish(dishData, increment);
  },
  onClearCart(evt) {
    evt.preventDefault();
    if (!window.confirm('您确定清空购物车吗？')) {
      return;
    }

    this.props.removeAllOrders();
  },
  onCompleteSelectTable(evt, data) {
    const tableId = data.table.id;
    const { tableList } = this.props.orderTSCart;
    const table = tableList.filter(item => item.tableID === tableId)[0];
    this.props.selectTable(data);
    this.setState({ tableVisible: false });
    if (table) {
      this.submitOrder(table.synFlag);
    }
  },
  getAreaTableTitle() {
    const { tableId, tableProps, tableName } = this.props.orderTSCart;
    if (tableName) {
      return tableName;
    }

    if (!tableId) {
      return '';
    }

    const { areaList, tableList } = tableProps;
    const table = (tableList || []).filter(item => item.tableID === tableId)[0];
    if (!table) {
      return '';
    }

    const area = (areaList || []).filter(item => item.id === table.areaId)[0];
    return area ? `${area.areaName} ${table.tableName}` : '';
  },
  getValidSexValue(sex) {
    const value = +String(sex);
    return isNaN(value) ? -1 : value;
  },
  setErrorMsg(msg) {
    this.setState({ errorMessage: msg });
  },
  setLoadingInfo(info) {
    this.setState({ loadingInfo: info || { ing: false } });
  },
  selectTable() {
    const { tableList } = this.props.orderTSCart.tableProps;
    if (!tableList || !tableList.length) {
      this.setErrorMsg('非常抱歉，店里当前爆满，无可用桌台');
      return;
    }

    const validateResult = this.validateMoblieUserInfo();
    if (validateResult) {
      this.setState({ tableVisible: true });
    }
  },
  scanTableQRCode() {
    const validateResult = this.validateMoblieUserInfo();
    if (!validateResult) {
      return;
    }

    const { wx } = this._wxClient;
    const handleScanResult = res => {
      const str = res.resultStr;
      if (!str) {
        this.setErrorMsg('扫码结果为空');
        return;
      }

      const reg = /tableId=(\w+)/i;
      const match = reg.exec(str);
      // 老二维码可以直接取到tableId
      if (match) {
        this.submitOrder(match[1]);
        return;
      }

      const { fetchTableIdFromNewVersionQRCode } = this.props;
      // 新二维码需要调用后端接口获取tableId
      fetchTableIdFromNewVersionQRCode(str, this.setLoadingInfo, ret => {
        const { data, code, msg } = ret;
        if (code !== '200') {
          this.setErrorMsg(msg);
          return;
        }

        if (data.errCode !== 0) {
          this.setErrorMsg('该桌台编码无效');
          return;
        }
        this.submitOrder(data.synFlag);
      });
    };
    if (wx) {
      wx.scanQRCode({
        needResult: 1,
        scanType: ['qrCode'],
        success: handleScanResult,
      });
    }
  },
  continueDishMenu() {
    this.props.gotoDishMenuPage();
  },
  validateMoblieUserInfo() {
    return true;
  },
  placeOrder(tableId, tableKey) {
    const validateResult = this.validateMoblieUserInfo();
    if (validateResult) {
      this.submitOrder(tableId, tableKey);
    }
  },
  submitOrder(tableId, tableKey) {
    if (!tableId && !tableKey) {
      this.setErrorMsg('请选择桌台');
      return;
    }

    const data = { shopId };
    const { member, peopleCount, memo, mainOrderId } = this.props.orderTSCart;
    const { dishesDataDuplicate } = this.props.dishMenu;
    if (!dishesDataDuplicate || !dishesDataDuplicate.length) {
      this.setErrorMsg('请点餐');
      return;
    }

    Object.assign(data, {
      name: (member.name || '').trim(),
      sex: this.getValidSexValue(member.sex),
      mobile: member.mobile,
      memo,
      peopleCount,
      tableId: tableId || '',
      mainOrderId: mainOrderId || -1,
      payMethod: 1,
      needPayPrice: dishHelper.getDishesPrice(dishesDataDuplicate),
      serviceApproach: 'totable',
    });
    // console.log(getSubmitDishData(dishesDataDuplicate, parseInt(shopId, 10) || 0))
    Object.assign(data, getSubmitDishData(dishesDataDuplicate, parseInt(shopId, 10) || 0));
    this.props.submitOrder(tableKey, data, this.setLoadingInfo, this.setErrorMsg);
  },
  buildButtonGroupElement(tableId, tableKey, shopSetting) {
    if (tableId || tableKey) {
      return (
        <div className="flex-row">
          <button className="flex-rest btn-select-table" onTouchTap={() => this.placeOrder(tableId, tableKey)}>下单</button>
        </div>
      );
    }

    const { wxAuthSuccess } = this.props.orderTSCart;
    return (
      <div className="flex-row">
        {shopSetting && shopSetting.enableSelectTable &&
          <button className="flex-rest btn-select-table" onTouchTap={this.selectTable}>选桌下单</button>
        }
        {shopSetting && shopSetting.enableScanTable && wxAuthSuccess &&
          <button className="flex-rest btn-order" onTouchTap={this.scanTableQRCode}>扫码下单</button>
        }
      </div>
    );
  },
  buildOrderedElements(orderedDishes, onOrderBtnTap) {
    if (!orderedDishes || !orderedDishes.length) {
      return false;
    }

    function divideDishes(dishes) {
      return [].concat.apply(
        [], dishes.map(dish => {
          if (dishHelper.isSingleDishWithoutProps(dish)) {
            return dish.order > 0 ? [Object.assign({}, dish, { key:`${dish.id}` })] : false;
          }

          return dish.order.map((dishOrder, idx) =>
            Object.assign({}, dish,
              { key:`${dish.id}-${idx}` },
              { order: [Object.assign({}, dishOrder)] }
            )
          );
        })
      );
    }
    const dividedDishes = divideDishes(orderedDishes);
    return (
      <div className="cart-ordered-list">
      {
        dividedDishes.map(dish => dish && (<CartOrderedDish key={dish.key} dish={dish} onOrderBtnTap={this.onDishCountChange} />))
      }
      </div>
    );
  },
  buildCustomerInfoElement(member, wxName) {
    let sex = '';
    if (member.sex === 1) {
      sex = '先生';
    } else if (member.sex === 0) {
      sex = '女士';
    } else {
      sex = '';
    }

    let nameSex = '';

    if (!member.sex || !member.name) {
      nameSex = wxName || member.mobile;
    } else {
      nameSex = `${member.name} ${sex}`;
    }

    return (
      <div className="weixin-login">
        <a className="option-user">
          <img className="option-user-icon" src={member.iconUri || defaultPersonLogo} alt="用户头像" />
          <p className="option-user-name">{nameSex}</p>
        </a>
      </div>
    );
  },
  render() {
    const { dishMenu, orderTSCart } = this.props;
    const { member, wxName, peopleCount, memo, commercialName } = orderTSCart;
    const { tableProps, mainOrderId, tableId, tableKey, shopSetting, addItemStatus } = orderTSCart;
    const { errorMessage, loadingInfo } = this.state;
    const dishesData = dishMenu.dishesDataDuplicate || [];
    const dishCount = dishHelper.getDishesCount(dishesData);
    const totalPrice = dishHelper.getDishesPrice(dishesData);
    return (
      <div className="application flex-columns">
        <div className="application-content">
          <p className="shop-name ellipsis">{commercialName}</p>
          <div className="shop-method of">
            <span className="shop-table ellipsis">{this.getAreaTableTitle()}</span>
            <span className="shop-clear-cart" onTouchTap={this.onClearCart}>清空购物车</span>
            <span className="shop-edit" onTouchTap={this.continueDishMenu}>继续点菜</span>
          </div>
          <div className="options-group">
            <div className="option editor">
              {this.buildCustomerInfoElement(member, wxName)}
            </div>
          </div>
          <div className="flex-rest">
            <div className="options-group options-group-mb">
              <div className="option option--nopadding">
                {this.buildOrderedElements(dishesData)}
              </div>
            </div>
            {!(mainOrderId !== -1 && addItemStatus === 1) &&
              <div className="options-group options-group-bigmb">
                {orderTSCart.enableInputDinnerTableCount &&
                  <div className="option">
                    <span className="option-title">就餐人数：</span>
                    <ImportableCounter
                      setErrorMsg={this.setErrorMsg}
                      onCountChange={(count) => this.onValueChange({ target: { name: 'peopleCount', value: count } })}
                      count={peopleCount}
                      maximum={99}
                      minimum={1}
                    />
                  </div>
                }
                <label className="option">
                  <span className="option-title">备注: </span>
                  <input
                    className="option-input"
                    name="memo"
                    placeholder="输入备注"
                    maxLength="35"
                    onChange={this.onValueChange} value={memo}
                  />
                </label>
              </div>
            }
            <div className="options-group options-group-devide flex-row">
              <label className="option flex-rest">
                <span className="option-title">共{dishCount}份</span>
                <span className="option-input totalprice" data-count={`￥${totalPrice}`}>总计:</span>
              </label>
              <div className="option order-dinner-buttons flex-none">
                {this.buildButtonGroupElement(tableId, tableKey, shopSetting)}
              </div>
            </div>
          </div>
          <ReactCSSTransitionGroup transitionName="slideup" transitionEnterTimeout={600} transitionLeaveTimeout={600}>
            {this.state.tableVisible &&
              <DinnerTableSelect
                title={'请选择桌台'}
                areas={tableProps.areaList}
                tables={tableProps.tableList}
                onTableSelect={this.onCompleteSelectTable}
                onDone={evt => this.setState({ tableVisible: false })}
              />
            }
          </ReactCSSTransitionGroup>
          {errorMessage && <Toast errorMessage={errorMessage} clearErrorMsg={() => { this.setErrorMsg(''); }} />}
          {loadingInfo.ing && <Loading word={loadingInfo.text} />}
        </div>
      </div>
    );
  },
});

module.exports = connect(state => state, actions)(OrderTSCartApplication);
