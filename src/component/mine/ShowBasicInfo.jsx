const React = require('react');
require('./ShowBasicInfo.scss');

var ShowBasicInfo = React.createClass({
  displayName: 'BrandBg',
  propTypes:{},
  componentWillMount(){
  	
  },
  componentDidMount(){
    
  },
  imgError(sex,e){
  	switch(sex){
  		case "1":{this.refs.logo.src="../../../src/asset/images/head-male.png";break;}
  		case "0":{this.refs.logo.src="../../../src/asset/images/head-female.png";break;}
  		default:{this.refs.logo.src="../../../src/asset/images/head-default.png";break;}
  	}
  },
  render(){
  	const {Info}=this.props;
  	return(
  		<div className="BasicInfo-bg">
  		     <img src={Info.iconUri?Info.iconUri:Info.sex==1?"../../../src/asset/images/head-male.png":Info.sex==0?"../../../src/asset/images/head-female.png":"../../../src/asset/images/head-default.png"} alt="用户头像" title={Info.name||""} ref="logo" onError={this.imgError.bind(this,Info.sex)}/>
  		     <p className="omit">{Info.name || "不愿透露姓名的用户"} {Info.sex==1?"先生":Info.sex==0?"女士":""}</p>
  		     <div className="wave"></div>
  		</div>
  	)
  }
  
});

module.exports=ShowBasicInfo;