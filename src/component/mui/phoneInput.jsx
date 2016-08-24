const React = require('react');
require('./phoneInput.scss');
const config = require('../../config');
const helper = require('../../helper/dish-hepler');
const commonHelper = require('../../helper/common-helper');
const type = helper.getUrlParam('type');
const shopId = helper.getUrlParam('shopId');

const restore="";
var PhoneInput = React.createClass({
  displayName: 'ShowSettingList',
  propTypes:{
  
  },
  getInitialState(){
  	return {};
  	
  },
  componentWillMount(){
  	
  	
  },
  componentDidMount(){
  
  	
  },
  getCode(){
  	let phoneNumber=this.refs.phoneNumber.value;
  	const {getCode}=this.props;
  	getCode(phoneNumber);
  },
  valid(){
  	let phoneNumber=this.refs.phoneNumber.value;
  	commonHelper.phoneNumber(phoneNumber);
  },
  render(){
  	//const {Info}=this.props;
  	//this.setState({value: Info.name});
  	return (
  		  <ul className="register-phone-ul">
  		       <li className="of" style={{padding:"0.8em 0"}}>
  		          <span className="middle"></span>
  		          <span className="name">手机号</span>
  		          <i className="fr" onClick={this.getCode}>
  		             获取验证码
  		          </i>
  		          <div className="input-outer fr">
  		              <input type="text" placeholder="请填写手机号码" className="fr" ref="phoneNumber" onInput={this.valid}/>
  		          </div>
  		       </li>
  		       <li>
  		          <span className="name">验证码</span>
  		          <div className="input-outer fr">
  		              <input type="text" placeholder="请填写验证码" className="fr" style={{padding:"0"}}/>
  		          </div>
  		       </li>
  		  </ul>   
  	)
  }
  
});

module.exports=PhoneInput;