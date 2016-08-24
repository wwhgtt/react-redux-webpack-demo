const React = require('react');
require('./ShowSettingList.scss');
const config = require('../../config');
const helper = require('../../helper/dish-hepler');
const type = helper.getUrlParam('type');
const shopId = helper.getUrlParam('shopId');
const register_url=`${config.registerURL}?shopId=`+shopId;
const modifypwd_url=`${config.modifyPwdURL}?shopId=`+shopId; 

const restore="";
var ShowSettingList = React.createClass({
  displayName: 'ShowSettingList',
  propTypes:{
  	Info:React.PropTypes.object,
  	getInfo:React.PropTypes.func,
  	updateInfo:React.PropTypes.func
  },
  getInitialState(){
  	return {"value":"","sex":""};
  	
  },
  componentWillMount(){
  	
  	
  },
  componentDidMount(){
  
  	
  },
  componentWillReceiveProps(nextProps){
  	if(this.props.Info.name==nextProps.Info.name && this.props.Info.sex==nextProps.Info.sex ){
  		return;
  	}
  	this.setState({value: nextProps.Info.name,sex:nextProps.Info.sex});
  },
  sex_switch(sex,e){
  	let name=this.refs.name.value;
  	if(sex===0){
  		if(e.target.className=="active"){}
  		else{
		  		this.refs.male.className="";
		  		e.target.className="active"; 
		  		this.setState({value: name,sex: 0}/*,function(){this.action(sex);}*/);	
  		}
  	}
  	else if(sex===1){
  		if(e.target.className=="active"){}
  		else{
  	      this.refs.female.className="";
  		    e.target.className="active";
  		    this.setState({value: name,sex: 1}/*,function(){this.action(sex);}*/);
  		}
  	}
  },
  action(e){
  	let name=this.refs.name.value;
  	let {updateInfo}=this.props;

  	updateInfo(this.state.sex,name);
  	
  },
  logOff(e){
  	const {logOff}=this.props;
  	logOff();
  },
  handleChange(event){
  	this.setState({value: event.target.value.replace(/(^\s+)|""/g,"")})
  },
  render(){
  	const condition=4;//1 微信号(未绑定手机)  2手机号非会员（未绑定微信）3手机号会员（未绑定微信） 4绑定成功
  	const {Info}=this.props;
  	//this.setState({value: Info.name});
  	return (
  		  <div className="list-outer">
  		       {
  		       	 condition==2 || condition==3 || condition==4?
	  		       <ul className="list-ul">
	  		           <li className="spe">
	  		             <a href="javascript:void(0)" style={{padding:"0.7em 0"}} >
	  		                <span className="name">姓名</span>
	  		                <div className="sex-switch">
	  		                   <i className={Info.sex==0?"active":""} onClick={this.sex_switch.bind(this,0)} ref="female">女士</i>
	  		                   <i className={Info.sex==1?"active":""} onClick={this.sex_switch.bind(this,1)} ref="male">先生</i>
	  		                </div>
	  		                <div className="input-outer">
	  		                     <input type="text" maxLength="30" placeholder="请输入姓名" ref="name" value={this.state.value} onChange={this.handleChange} />
	  		                </div>
	  		                <span className="arrow"></span>
	  		             </a>
	  		           </li>
	  		           {
	  		           	condition==3 || condition==4?
	  		           	<div>
	  		           	<li className="spe">
		  		             <a href="javascript:void(0)">
		  		                <span className="name">生日</span>
		  		                <span className="brief">{Info.birthday}</span>
		  		             </a>
		  		          </li>
	  		           	<li>
		  		             <a href={modifypwd_url}>
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
	       	      condition==1?
	       	      <ul className="list-ul">
  		          <li className="spe">
  		             <a href="javascript:void(0)">
  		                <span className="name">微信号</span>
  		                <img src={Info.iconUri || "../../../src/asset/images/head-default.png"} alt="微信头像" title="微信头像" className="logo" />
  		             </a>
  		          </li>
  		          <li>
  		             <a href="javascript:void(0)">
  		                <span className="name">手机号</span>
  		                <span className="brief">未注册</span>
  		                <span className="arrow"></span>
  		             </a>
  		          </li>
  		          <li>
			             <a href={register_url}>
			                <span className="name">会员注册</span>
			                <span className="brief">注册会员享受更多福利</span>
			                <span className="arrow"></span>
			             </a>
			          </li>
  		          </ul>
  		          :
  		          condition==2?
  		          <ul className="list-ul">
  		          <li>
  		             <a href="javascript:void(0)">
  		                <span className="name">微信号</span>
  		                <span className="brief">未绑定</span>
  		                <span className="arrow"></span>
  		             </a>
  		          </li>
  		          <li className="spe">
  		             <a href="javascript:void(0)">
  		                <span className="name">手机号</span>
  		                <span className="brief">{Info.mobile}</span>
  		             </a>
  		          </li>
  		          <li>
			             <a href={register_url}>
			                <span className="name">会员注册</span>
			                <span className="brief">注册会员享受更多福利</span>
			                <span className="arrow"></span>
			             </a>
			          </li>
					      </ul>
					      :
  		          condition==3?
  		          <ul className="list-ul">
  		          <li>
  		             <a href="javascript:void(0)">
  		                <span className="name">微信号</span>
  		                <span className="brief">未绑定</span>
  		                <span className="arrow"></span>
  		             </a>
  		          </li>
  		          <li className="spe">
  		             <a href="javascript:void(0)">
  		                <span className="name">手机号</span>
  		                <span className="brief">{Info.mobile}</span>
  		             </a>
  		          </li>
					      </ul>
					      :
  		          condition==4?
  		          <ul className="list-ul">
  		          <li>
  		             <a href="javascript:void(0)">
  		                <span className="name">微信号</span>
  		                <img src={Info.iconUri || "../../../src/asset/images/head-default.png"} alt="微信头像" title="微信头像" className="logo" />
  		                <span className="arrow"></span>
  		             </a>
  		          </li>
  		          <li>
  		             <a href="javascript:void(0)">
  		                <span className="name">手机号</span>
  		                <span className="brief">{Info.mobile}</span>
  		                <span className="arrow"></span>
  		             </a>
  		          </li>
					      </ul>
  		          :false
  		        }
  		          
  		       <a href="javascript:;" className="logoff" onClick={this.logOff}>注销</a>
  		       
  		       <a href="javascript:;" className="save" onClick={this.action}>保存</a>
  		  </div>
  	)
  }
  
});

module.exports=ShowSettingList;