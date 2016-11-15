const React = require('react');
const config = require('../../config');
const commonHelper = require('../../helper/common-helper');

const SexSwitch = require('../common/sex-switch.jsx');
const shopId = commonHelper.getUrlParam('shopId');
let registerUrl = ` ${config.registerMemberURL}?shopId=${shopId}`;
const modifypwdUrl = ` ${config.modifyPwdURL}?shopId=${shopId}`;
const bindMobileUrl = ` ${config.bindMobileURL}?shopId=${shopId}`;
const bindWXUrl = ` ${config.bindWXURL}?shopId=${shopId}`;
const defaultPic = require('../../asset/images/head-default.png');


require('./show-setting-list.scss');

module.exports = React.createClass({
  displayName: 'ShowSettingList',
  propTypes:{
    info:React.PropTypes.shape({
      name: React.PropTypes.string,
      sex: React.PropTypes.string,
      loginType:React.PropTypes.number,
    }).isRequired,
    getInfo:React.PropTypes.func,
    logOff:React.PropTypes.func,
    onSave:React.PropTypes.func,
  },
  getInitialState() {
    return { name : '', sex : '' }; // 两个参数姓名和性别
  },
  componentWillMount() {},
  componentDidMount() {},
  componentWillReceiveProps(nextProps) {   // 接收props
    if (JSON.stringify(this.props.info) === JSON.stringify(nextProps.info)) {
      return;
    }
    this.setState({ name: nextProps.info.name, sex:nextProps.info.sex }, () => this.commonMethod()); // 把props赋值给state(需要的值)
  },
  onInputName() {
    const nameValue = this.refs.name.value;
    this.setState({ name :nameValue }, () => this.commonMethod());
  },
  onLogOff() {   // 注销
    const { logOff } = this.props;
    logOff();
  },
  getSex(obj) {  // 获取选择的性别
    this.setState({ sex:obj.sex }, () => this.commonMethod());
  },
  commonMethod() {
    // 回传值给container
    const { getInfo } = this.props;
    // const { name, sex } = this.state;
    getInfo({ name: this.state.name, sex: this.state.sex });
  },
  render() {
    let condition = '';// 1 微信号(未绑定手机)  2手机号非会员（未绑定微信）3手机号会员（未绑定微信） 4绑定成功
    let partOne = '';
    let partTwo = '';
    const isWeiXinBroswer = commonHelper.getWeixinVersionInfo().weixin;
    const { info } = this.props;
    // 几种状态的判断
    if (info.loginType === 1 && !info.bindMobile) {
      condition = 1;
    } else if (info.loginType === 0 && !info.bindWx) {
      if (!info.isMember) {
        condition = 2;
      } else {
        condition = 3;
      }
    } else if (info.bindWx && info.bindMobile) {
      condition = 4;
    }
    const { name, sex } = this.state;

    // 几种状态的判断

    // 用户注册地址判断
    if (info.loginType === 1) {
      registerUrl = `http://${location.host}/user/validBindMobile?shopId=${shopId}`;
    } else if (info.loginType === 0) {
      registerUrl = `${registerUrl}&mobile=${info.mobile}`;
    }

    if (condition === 2 || condition === 3 || condition === 4) {
      partOne = (
        <ul className="list-group">
          <li className="list-item">
            <a className="list-link disable flex-row" href=" javascript:void(0)">
              <div className="list-name-holder flex-none">
                <span className="list-name">姓名</span>
              </div>
              <div className="list-content flex-rest">
                <input
                  className="input-content"
                  type="text"
                  maxLength="30"
                  placeholder="请输入姓名"
                  ref="name"
                  value={name}
                  onChange={this.onInputName}
                />
              </div>
            </a>
          </li>
          <li className="list-item">
            <a className="list-link disable flex-row" href=" javascript:void(0)">
              <div className="list-name-holder flex-none">
                <span className="list-name">性别</span>
              </div>
              <div className="list-content flex-rest">
                <SexSwitch changeSex={this.getSex} sex={sex} />
              </div>
            </a>
          </li>
          {
            condition !== 2 && info.isMember ?
              <div>
                <li className="list-item">
                  <a className="list-link disable flex-row" href=" javascript:void(0)">
                    <div className="list-name-holder flex-none">
                      <span className="list-name">生日</span>
                    </div>
                    <div className="list-content flex-rest">
                      <span className="list-content-info">{info.birthday}</span>
                    </div>
                  </a>
                </li>
                {info.loginType === 0 &&
                  <li className="list-item">
                    <a className="list-link flex-row" href={modifypwdUrl}>
                      <div className="list-name-holder flex-none">
                        <span className="list-name">修改密码</span>
                      </div>
                      <span className="list-arrow list-arrow-right"></span>
                    </a>
                  </li>
                }
              </div>
            :
            false
          }
        </ul>
      );
    }
    partTwo = (
      <ul className="list-group">
        {
          isWeiXinBroswer ?
            <div>
              {
                condition !== 1 && condition !== 4 ?
                  <li className="list-item">
                    <a className="list-link flex-row" href={bindWXUrl}>
                      <div className="list-name-holder flex-none">
                        <span className="list-name">微信号</span>
                      </div>
                      <span className="list-brief">未绑定</span>
                      <span className="list-arrow list-arrow-right"></span>
                    </a>
                  </li>
                :
                  <li className="list-item">
                    <a className="list-link disable flex-row" href=" javascript:void(0)">
                      <div className="list-name-holder flex-none">
                        <span className="list-name">微信号</span>
                      </div>
                      <div className="list-content flex-rest">
                        <img src={info.iconUri || defaultPic} alt="微信头像" title="微信头像" className="list-content-logo flex-none" />
                        <span className="wxName ellipsis">{info.wxName}</span>
                      </div>
                    </a>
                  </li>
              }
            </div>
          :
          false
        }
        {
          condition === 1 ?
            <li className="list-item">
              <a className="list-link flex-row" href={bindMobileUrl}>
                <div className="list-name-holder flex-none">
                  <span className="list-name">手机号</span>
                </div>
                <span className="list-brief">未绑定</span>
                <span className="list-arrow list-arrow-right"></span>
              </a>
            </li>
          :
            <li className="list-item">
              <a className="list-link disable flex-row" href=" javascript:void(0)">
                <div className="list-name-holder flex-none">
                  <span className="list-name">手机号</span>
                </div>
                <div className="list-content flex-rest">
                  <span className="list-content-info">{info.mobile}</span>
                </div>
              </a>
            </li>
        }
        {
          // !info.isMember ?
          //   <li className="list-item">
          //     <a className="list-link flex-row" href={registerUrl}>
          //       <div className="list-name-holder flex-none">
          //         <span className="list-name">会员注册</span>
          //       </div>
          //       <span className="list-brief">注册会员享受更多福利</span>
          //       <span className="list-arrow list-arrow-right"></span>
          //     </a>
          //   </li>
          // :
          // false
        }
      </ul>
    );

    // return
    return (
      <div className="list-outer of">
        {partOne}
        {partTwo}
        <a href=" javascript:;" className="btn-row btn-row-sure btn-row-mt" onTouchTap={this.props.onSave}>保存</a>
        <a href=" javascript:;" className="btn-row btn-row-mt" onTouchTap={this.onLogOff}>注销</a>
      </div>
    );
  },
});
