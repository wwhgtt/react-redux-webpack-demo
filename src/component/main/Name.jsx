const React = require('react');
require('./Name.scss');

var Name = React.createClass({
  displayName: 'Name',
  propTypes:{},
  componentWillMount(){}, //此处是通过BrandBg.jsx获取数据
  componentDidMount(){},
  handleClick(uniqueId){
  	//alert(uniqueId)
  	
  	
  },
  hover(name,e){
  	//document.querySelector("ul.method-ul li[data-name="+name+"]").style.background="#eaeaea";
  	this.refs[name].style.background="#eaeaea";
  },
  nohover(name,t){
  	//document.querySelector("ul.method-ul li[data-name="+name+"]").style.background="#fff";
  	this.refs[name].style.background="#fff";
  },
  render(){
  	const {nameInfo,menuList}=this.props;
  	let menuList_ul="";
    //console.log("nameInfo",nameInfo);
    if(menuList.length<=4){menuList_ul={"width":100/menuList.length+"%"}}
    else if(menuList.length>4 && menuList.length<=6){menuList_ul={"width":"33.3%"}}
    else{menuList_ul={"width":"25%"}}
  	return (
  		  <div className="up-block">
  		       <div className="header-bg">
  		            <img src={nameInfo.logo||"../../../src/asset/images/personal-icon.png"} title="LOGO" alt="LOGO"/>
  		            <div className="header-bg-light-outer">
						           <div className="header-bg-light"></div>
						      </div>
  		       </div>
  		       <h1 className="">{nameInfo.name}</h1>
  		       <div className="line-up"></div>
  		       <div className="method-ul-outer" style={{"overflow":"hidden","display":"block"}}>
					      <ul className="method-ul clearfix">
					      {
					         menuList.map(function(item,index){
					         	return (
					         		  <li key={index} ref={item.uniqueId} data-name={item.uniqueId} onClick={this.handleClick.bind(this,item.uniqueId)} onTouchStart={this.hover.bind(this,item.uniqueId)} onTouchEnd={this.nohover.bind(this,item.uniqueId)}  style={menuList_ul}>
							             <a href="javascript:void(0)" title={item.name}>
							                <i name={item.uniqueId}></i>
							                <p>{item.name}</p>
							             </a>
							          </li>
					         		
					         	)
					         	
					         	
					         }.bind(this))
					          
					      }
					      </ul>
					      <div className="line-up"></div>
					      
					   </div>
  		  </div>
  		  
  	)
  }
  
});

module.exports=Name;