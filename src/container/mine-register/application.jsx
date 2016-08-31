const React = require('react');
const connect = require('react-redux').connect;
const actions = require('../../action/mine/register.js');
const RegisterBanner = require('../../component/mine/registerBanner.jsx');
const RegisterList = require('../../component/mine/registerList.jsx');
const PhoneInput=require('../../component/mui/phoneInput.jsx');
const Toast = require('../../component/mui/toast.jsx');

require('../../asset/style/style.scss');
require('./application.scss');

const RegisterApplication = React.createClass({
  displayName: 'RegisterApplication',
  propTypes:{},
  getInitialState() {
    return {phoneNum:"",code:"",name:"",sex:"",birth:"",pwd:""};
  },
  componentWillMount(){},
  componentDidMount(){
  	const {getInfo}=this.props;
  	getInfo();
  },
  getPhone(obj){
  	this.setState({phoneNum:obj.phoneNum||"",code:obj.code||""});
  },
  getBasic(obj){
  	this.setState({name:obj.name||"",sex:obj.sex||"",birth:obj.birth||"",pwd:obj.pwd||""});
  },
  submit(){
  	const {saveInfo}=this.props;
  	if(this.valid(this.state)){
  	   saveInfo(this.state);
  	}
  },
  valid(obj){ //在此处进行验证
  	//在此处进行验证
  	return true;
  },
  render(){
  	const {Info,getCode}=this.props;
  	return (
  		 <div> 
	  		 	<RegisterBanner Info={Info}/>
	  		 	<PhoneInput getCode={getCode} getPhone={this.getPhone} />
	  		 	<RegisterList getBasic={this.getBasic}/>
	  		 	<a href="javascript:void(0)" className="registerBtn" onClick={this.submit}>注册会员</a>
  		 </div>
  	)
  }
});

module.exports = connect(state => state, actions)(RegisterApplication);
