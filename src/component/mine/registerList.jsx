const React = require('react');
require('./registerList.scss');
const config = require('../../config');
const helper = require('../../helper/dish-hepler');
const type = helper.getUrlParam('type');
const shopId = helper.getUrlParam('shopId');

const restore="";
var RegisterList = React.createClass({
  displayName: 'ShowSettingList',
  propTypes:{
  	Info:React.PropTypes.object,
  	getInfo:React.PropTypes.func,
  	updateInfo:React.PropTypes.func
  },
  getInitialState(){
  	return {"value":"","sex":""};	
  },
  componentWillMount(){},
  componentDidMount(){},
  componentWillReceiveProps(nextProps){
  	if(this.props.Info.name==nextProps.Info.name && this.props.Info.sex==nextProps.Info.sex ){
  		return;
  	}
  	this.setState({value: nextProps.Info.name,sex:nextProps.Info.sex});
  },
  sex_switch(sex,e){
  	if(sex===0){
  		if(e.target.className=="active"){}
  		else{
		  		this.refs.male.className="";
		  		e.target.className="active"; 
  		}
  	}
  	else if(sex===1){
  		if(e.target.className=="active"){}
  		else{
  	      this.refs.female.className="";
  		    e.target.className="active";
  		}
  	}
  },
  action(e){
  	let name=this.refs.name.value;
  	let {updateInfo}=this.props;

  	updateInfo(this.state.sex,name);
  	
  },
  imgError(e){
  	e.target.src="../../../src/asset/images/register-banner-default.jpg";
  },
  render(){
  	const {Info}=this.props;
  	//this.setState({value: Info.name});
  	return (
  		  <ul className="register-list-ul">
  		      <li style={{padding:"0.75em 0"}}>
  		         <div className="input-outer fr">
  		              <input type="text" placeholder="请填写姓名" className="fr"/>
  		         </div>
  		         <span className="name">姓名</span>
  		         <div className="sex-switch">
                  <i className={Info.sex==0?"active":""} onClick={this.sex_switch.bind(this,0)} ref="female">女士</i>
                  <i className={Info.sex==1?"active":""} onClick={this.sex_switch.bind(this,1)} ref="male">先生</i>
               </div>
  		         
  		      </li>
  		      <li>
  		         <span className="name">生日</span>
  		         <div className="input-outer fr">
  		              <input type="text" placeholder="请填写生日" className="fr"/>
  		         </div>
  		      </li>
  		      <li>
  		         <span className="name">交易密码</span>
  		         <div className="input-outer fr">
  		              <input type="password" placeholder="请填写交易密码" className="fr" maxLength="6"/>
  		         </div>
  		      </li>
  		  </ul>   
  	)
  }
  
});

module.exports=RegisterList;