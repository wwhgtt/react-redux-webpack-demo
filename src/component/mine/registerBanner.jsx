const React = require('react');
require('./registerBanner.scss');
const config = require('../../config');
const helper = require('../../helper/dish-hepler');
const type = helper.getUrlParam('type');
const shopId = helper.getUrlParam('shopId');

const restore="";
var RegisterBanner = React.createClass({
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
  imgError(e){
  	e.target.src="../../../src/asset/images/register-banner-default.jpg";
  },
  render(){
  	const {Info}=this.props;
  	//this.setState({value: Info.name});
  	return (
  		  <div className="register-banner">
  		       <img src={Info.picUrl || "../../../src/asset/images/register-banner-default.jpg"} onError={this.imgError} alt="会员注册头图" title="会员注册头图"/>
  		  </div>   
  	)
  }
  
});

module.exports=RegisterBanner;