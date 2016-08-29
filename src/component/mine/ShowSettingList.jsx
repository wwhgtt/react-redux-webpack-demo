const React = require('react');
require('./ShowSettingList.scss');
const SexSwitch = require('../../component/mui/sexSwitch.jsx');
const config = require('../../config');
const helperCommon = require('../../helper/common-helper');
const shopId = helperCommon.getUrlParam('shopId');
const registerUrl = ` ${config.registerURL}?shopId=${shopId}`;
const modifypwdUrl = ` ${config.modifyPwdURL}?shopId=${shopId}`;

module.exports = React.createClass({
  displayName: 'ShowSettingList',
  propTypes:{
    info:React.PropTypes.object,
    getInfo:React.PropTypes.func,
    logOff:React.PropTypes.func,
  },
  getInitialState() {
    return { name : '', sex : '' }; // 两个参数姓名和性别
  },
  componentWillMount() {},
  componentDidMount() {},
  componentWillReceiveProps(nextProps) {   // 接收props
    if (this.props.info.name === nextProps.info.name && this.props.info.sex === nextProps.info.sex) {
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
    const condition = 4;// 1 微信号(未绑定手机)  2手机号非会员（未绑定微信）3手机号会员（未绑定微信） 4绑定成功
    const { info } = this.props;
    const { name, sex } = this.state;
    return (
      <div className="list-outer of">
             {
                condition === 2 || condition === 3 || condition === 4 ?
                  <ul className="list-ul list-ul-mt">
                    <li className="list-ul-li spe">
                      <a className="settingLink" href=" javascript:void(0)" style={{ padding : '0.75em 0' }} >
                        <span className="middle"></span>
                        <span className="name">姓名</span>
                        <SexSwitch getSex={this.getSex} sex={sex} />
                        <div className="input-outer fr">
                          <input
                            className="input"
                            type="text"
                            maxLength="30"
                            placeholder="请输入姓名"
                            ref="name"
                            value={name}
                            onInput={this.onInputName}
                          />
                        </div>
                      </a>
                    </li>
                  {
                    condition === 3 || condition === 4 ?
                      <div>
                        <li className="list-ul-li spe">
                          <a className="settingLink" href=" javascript:void(0)">
                            <span className="name">生日</span>
                            <span className="brief spe">{info.birthday}</span>
                          </a>
                        </li>
                        <li className="list-ul-li">
                          <a className="settingLink" href={modifypwdUrl}>
                            <span className="name">修改密码</span>
                            <span className="arrow"></span>
                          </a>
                        </li>
                      </div>
                    :
                    false
                  }
                  </ul>
                :
                false
             }
             {
                condition === 1 ?
                  <ul className="list-ul list-ul-mt">
                    <li className="list-ul-li spe">
                      <a className="settingLink" href=" javascript:void(0)">
                        <span className="name">微信号</span>
                        <img src={info.iconUri || '../../../src/asset/images/head-default.png'} alt="微信头像" title="微信头像" className="logo spe" />
                      </a>
                    </li>
                    <li className="list-ul-li">
                      <a className="settingLink" href=" javascript:void(0)">
                        <span className="name">手机号</span>
                        <span className="brief">未注册</span>
                        <span className="arrow"></span>
                      </a>
                    </li>
                    <li className="list-ul-li">
                      <a className="settingLink" href={registerUrl}>
                        <span className="name">会员注册</span>
                        <span className="brief">注册会员享受更多福利</span>
                        <span className="arrow"></span>
                      </a>
                    </li>
                  </ul>
                :
                false
              }
              {
                condition === 2 ?
                  <ul className="list-ul list-ul-mt">
                    <li className="list-ul-li">
                      <a className="settingLink" href=" javascript:void(0)">
                        <span className="name">微信号</span>
                        <span className="brief">未绑定</span>
                        <span className="arrow"></span>
                      </a>
                    </li>
                    <li className="list-ul-li spe">
                      <a className="settingLink" href=" javascript:void(0)">
                        <span className="name">手机号</span>
                        <span className="brief spe">{info.mobile}</span>
                      </a>
                    </li>
                    <li className="list-ul-li">
                      <a className="settingLink" href={registerUrl}>
                        <span className="name">会员注册</span>
                        <span className="brief">注册会员享受更多福利</span>
                        <span className="arrow"></span>
                      </a>
                    </li>
                  </ul>
                :
                false
              }
              {
                condition === 3 ?
                  <ul className="list-ul list-ul-mt">
                    <li className="list-ul-li">
                      <a className="settingLink" href=" javascript:void(0)">
                        <span className="name">微信号</span>
                        <span className="brief">未绑定</span>
                        <span className="arrow"></span>
                      </a>
                    </li>
                    <li className="list-ul-li spe">
                      <a className="settingLink" href=" javascript:void(0)">
                        <span className="name">手机号</span>
                        <span className="brief spe">{info.mobile}</span>
                      </a>
                    </li>
                  </ul>
                :
                false
              }
              {
                condition === 4 ?
                  <ul className="list-ul list-ul-mt">
                    <li className="list-ul-li spe">
                      <a className="settingLink" href=" javascript:void(0)">
                        <span className="name">微信号</span>
                        <img src={info.iconUri || '../../../src/asset/images/head-default.png'} alt="微信头像" title="微信头像" className="logo spe" />
                      </a>
                    </li>
                    <li className="list-ul-li spe">
                      <a className="settingLink" href=" javascript:void(0)">
                        <span className="name">手机号</span>
                        <span className="brief spe">{info.mobile}</span>
                      </a>
                    </li>
                  </ul>
                :
                false
              }
        <a href=" javascript:;" className="btn-row btn-row-mt" onTouchTap={this.onLogOff}>注销</a>
      </div>
    );
  },
});
