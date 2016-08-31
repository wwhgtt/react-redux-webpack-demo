const React = require('react');
require('./registerList.scss');
const config = require('../../config');
const helper = require('../../helper/dish-hepler');
const type = helper.getUrlParam('type');
const shopId = helper.getUrlParam('shopId');

const restore="";
var RegisterList = React.createClass({
  displayName: 'RegisterList',
  propTypes:{
  	Info:React.PropTypes.object	
  },
  getInitialState(){
  	return {
  		name:"",
  		sex:"",
  		birth:"",
  		pwd:""
  		};
  },
  componentWillMount(){},
  componentDidMount(){},
  componentWillReceiveProps(nextProps){},
  sex_switch(sex,e){
  	switch(sex){
  		case 0:{
  			this.setState({sex:0});
  			this.commonMethod();
  			break;
  		}
  		case 1:{
  			this.setState({sex:1});
  			this.commonMethod();
  			break;
  		}
  		default:break;
  	}
  },
  commonMethod(){
  	const {name,sex,birth,pwd}=this.state;
  	const {getBasic}=this.props;
  	getBasic({name:name,sex:sex,birth:birth,pwd:pwd});
  },
  inputName(){
  	this.setState({name:this.refs.name.value});
  	this.commonMethod();
  },
  inputBirth(){
  	this.setState({birth:this.refs.birth.value});
  	this.commonMethod();
  },
  inputPwd(){
  	this.setState({pwd:this.refs.pwd.value});
  	this.commonMethod();
  },
  render(){
  	const {name,sex,birth,pwd}=this.state;
  	//this.setState({value: Info.name});
  	return (
  		  <ul className="register-list-ul">
  		      <li style={{padding:"0.75em 0"}}>
  		         <div className="sex-switch fr">
                  <i className={sex===0?"active":""} onClick={this.sex_switch.bind(this,0)} ref="female">女士</i>
                  <i className={sex===1?"active":""} onClick={this.sex_switch.bind(this,1)} ref="male">先生</i>
               </div>
  		         <div className="input-outer fr">
  		              <input type="text" placeholder="请填写姓名" className="fr" defaultValue={name} onInput={this.inputName} ref="name"/>
  		         </div>
  		         <span className="middle"></span>
  		         <span className="name">姓名</span>
  		      </li>
  		      <li>
  		         <span className="name">生日</span>
  		         <div className="input-outer fr">
  		              <input type="text" placeholder="请填写生日" className="fr" defaultValue={birth} onInput={this.inputBirth} ref="birth"/>
  		         </div>
  		      </li>
  		      <li>
  		         <span className="name">交易密码</span>
  		         <div className="input-outer fr">
  		              <input type="password" placeholder="请填写交易密码" className="fr" defaultValue={pwd} maxLength="6" onInput={this.inputPwd} ref="pwd"/>
  		         </div>
  		      </li>
  		  </ul>   
  	)
  }
  
});

module.exports=RegisterList;