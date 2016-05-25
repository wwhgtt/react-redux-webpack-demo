const React = require('react');
const IScroll = require('iscroll');
const _ = require('lodash');
require('isomorphic-fetch');
require('./test.scss');

const MenuData = [
  {
    id: 1,
    name: '降价品',
    data: [1, 2, 3, 4, 5, 6],
  },
  {
    id: 2,
    name: '热菜',
    data: _.range(1, 100),
  },
  {
    id: 3,
    name: '凉菜',
    data: _.range(101, 120),
  },
  {
    id: 4,
    name: '菜品类别1',
    data: _.range(201, 202),
  },
  {
    id: 5,
    name: '菜品类别2',
    data: _.range(203, 204),
  },
  {
    id: 6,
    name: '菜品类别3',
    data: _.range(205, 206),
  },
];

const Test = React.createClass({
  getInitialState() {
    return {
      orderList: [],
    };
  },
  componentDidMount() {
    this.fetchData();
  },
  fetchData() {
    // const that = this;
    fetch('http://192.168.10.162:3001/orders', {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    }).then(response => response.json()).then((json) => {
      this.setState({
        orderList: json,
      });
      const wrapper = document.getElementById('wrapper');
      /* jshint nonew: true */
      let iscroll = new IScroll(wrapper, {
        deceleration: 0.001,
        tap: true,
      });
      console.info(iscroll);
      wrapper.addEventListener('tap',
        (event) => { this.refs.debugger_msg.textContent = `tap${new Date().getTime()}`; }, false);
    }).
    catch((error) => {
      console.info(`login failed:${error}`);
    });
  },
  render() {
    const { orderList } = this.state;
    return (
      <div>
        <header className="header">
          客如云微信平台
          <span id="debugger_msg" ref="debugger_msg"></span>
        </header>
        <menu className="menu">
          <ul>
            {MenuData.map(menu => <li key={menu.id}>
              <a>{menu.name}</a>
            </li>)}
          </ul>
        </menu>
        {orderList.length > 0 ? <div className="content" id="wrapper">
          <div id="scroller">
          {MenuData.map(menu => <div key={menu.id}>
            <h2>{menu.name}</h2>
            {menu.data.map((orderId, index) => <section key={orderId} className="order-section">
              <p><span>菜品名称{index}:{_.find(orderList, { id: orderId }).name}</span></p>
            </section>)}
          </div>)}
          </div>
        </div> : null}
      </div>
    );
  },
});

module.exports = Test;
