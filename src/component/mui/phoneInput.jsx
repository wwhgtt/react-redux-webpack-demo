const React = require('react');
require('./phoneInput.scss');
const config = require('../../config');
const helper = require('../../helper/dish-hepler');
const commonHelper = require('../../helper/common-helper');
const type = helper.getUrlParam('type');
const shopId = helper.getUrlParam('shopId');

const restore="";
const PhoneInput = React.createClass({
  displayName: 'PhoneInput',
  propTypes:{},
  getInitialState(){
  	return {
  		phoneNum:"",
  		code:"",
  		codeShall:false,
  		countShall:false,
  		num:60
  	};
  },
  componentWillMount(){},
  componentDidMount(){},
  getCode(){
  	this.setState({codeShall:false,countShall:true,num:60});
  	const {getCode}=this.props;
  	getCode();
  	let interval=setInterval(function(){
  		let {num}=this.state;
  		this.setState({num:num-1});
  		if(this.state.num===-1){
  			 clearInterval(interval);
  			 let {phoneNum}=this.state;
  			 if(commonHelper.phoneNumber(phoneNum)){
			  		this.setState({codeShall:true,countShall:false});
			   }
			   else{
			  		this.setState({codeShall:false,countShall:false});
			   }
  		}
  	}.bind(this),1000)
  },
  validingPhone(){
  	let phoneNumber=this.refs.phoneNumber.value;
  	let code=this.refs.code.value;
  	this.setState({phoneNum:phoneNumber});
  	if(commonHelper.phoneNumber(phoneNumber)){
  		 this.setState({codeShall:true});
  	}
  	else{
  		 this.setState({codeShall:false});
  	}
  	//更新数据
  	const {getPhone}=this.props;
  	getPhone({phoneNum:phoneNumber,code:code});
  },
  validingCode(){
  	let phoneNumber=this.refs.phoneNumber.value;
  	let code=this.refs.code.value;
  	//更新数据
  	const {getPhone}=this.props;
  	getPhone({phoneNum:phoneNumber,code:code});
  },
  render(){
  	//this.setState({value: Info.name});
  	const {phoneNum,code,codeShall,countShall,num}=this.state;
  	return (
  		  <ul className="register-phone-ul">
  		       <li className="of" style={{padding:"0.8em 0"}}>
  		          <span className="middle"></span>
  		          <span className="name">手机号</span>
  		          {
  		          codeShall && !countShall?
		  		          <i className="orange fr" onClick={this.getCode} >
		  		             获取验证码
		  		          </i>
		  		      :
		  		          <i className="fr">
		  		             {countShall?num+"s后获取":"获取验证码"}
		  		          </i>
		  		      }
  		          <div className="input-outer fr">
  		              <input type="text" placeholder="请填写手机号码" className="fr" defaultValue={phoneNum} onInput={this.validingPhone} ref="phoneNumber"/>
  		          </div>
  		       </li>
  		       <li>
  		          <span className="name">验证码</span>
  		          <div className="input-outer fr">
  		              <input type="text" maxLength="4" placeholder="请填写验证码" className="fr" style={{padding:"0"}} defaultValue={code} onInput={this.validingCode} ref="code"/>
  		          </div>
  		       </li>
  		  </ul>   
  	)
  }
  
});

module.exports=PhoneInput;