const React = require('react');
const connect = require('react-redux').connect;
const actions = require('../../action/main/main-index.js');
const BrandBg=require("../../component/main/BrandBg.jsx");
const Name=require("../../component/main/Name.jsx");
const Shop=require("../../component/main/Shop.jsx");

require('../../asset/style/style.scss');
require('./main-index.scss');

const MainIndexApplication = React.createClass({
  displayName: 'MainIndexApplication',
  getInitialState() {
    return {};
  },
  componentDidMount(){
  	

  },
  scrolling(event){
  	    let count=0;
			  count=event.target.scrollTop/event.target.offsetHeight+0.2;
			  document.querySelector("div.after").style.opacity=count;
  	
  },
  render(){
  	const {BG,getBg,nameInfo,menuList,getShopList,shop_list}=this.props;
  	//console.log("123",this.props)
  	return (
  		 <div style={{"height":"100%","overflow":"auto","position":"relative"}} id="scroll_outer" onScroll={this.scrolling}> 
	  		 	<div style={{"height":"100%"}}>
	  		 	    <div className="after"></div>
	  		     	<BrandBg BG={BG} getBg={getBg} />
	  		     	<Name nameInfo={nameInfo} menuList={menuList} />
	  		 	</div>
  		 		<Shop shop_list={shop_list} getShopList={getShopList} nameInfo={nameInfo}/>
  		 </div>
  	)
  	
  	
  	
  }
});

module.exports = connect(state => state, actions)(MainIndexApplication);
