const React = require('react');
require('./Shop.scss');

var Shop = React.createClass({
  displayName: 'Shop',
  propTypes:{},
  getInitialState(){
  	return {"imageStatus":"../../../src/asset/images/personal-icon.png"}
  },
  componentWillMount(){
  	const {getShopList}=this.props;
  	getShopList();
  	
  }, //此处是通过BrandBg.jsx获取数据
  componentDidMount(){},
  handleClick(){},
  imgError(name,e){
  	//this.setState({ imageStatus: '../../../src/asset/images/personal-icon.png' });
  	//alert(this.state.imageStatus)
  	e.target.src="../../../src/asset/images/personal-icon.png";
  	//console.log(name);
  	//console.log(e.target);
  	//e.target.setAttribute("src","../../../src/asset/images/personal-icon.png")
  },
  getName(name){
  	alert(name)
  },
  render(){
  	const {shop_list,nameInfo}=this.props;
  	let origin=["WM","TS","YD","PD"];
  	let shop_status="";
  	
  	return(
  		<ul className="shopList-ul">
  		    {
  		    	shop_list.map(function(item,index){
  		    		if(item.openStatus){
					  		shop_status={"background":"orange","color":"#fff"};
					  	}
					  	else{
					  		shop_status={"background":"#d4d4d4","color":"#fff"};
					  	}
					  	
  		        return (
  		        	  <li key={index} className="of" onClick={this.getName.bind(this,item.commercialName)}>
  		        	      <img src={item.commercialLogo || nameInfo.logo || this.state.imageStatus} onError={this.imgError.bind(this,item.commercialName)} className="fl" ref="logo"/>
  		        	      <div className="small-icon fr">  
  		        	          {
  		        	           	
  		        	           	item.funcList.map(function(item1,index1){
  		        	           		if(origin.indexOf(item1)!=-1){
  		        	           			//alert(item1)
  		        	           		   return (<i key={index1} title={item1}></i>)
  		        	           		 }
  		        	           	})
  		        	           	
  		        	          }
  		        	      </div>
  		        	      <div className="of">
  		        	           <p className="title">{item.commercialName}</p>
  		        	           <p className="info">
  		        	              <i style={shop_status}>{item.openStatus?"营业中":"已打烊"}</i>
  		        	              <span>{item.busiName}</span>
  		        	           </p>
  		        	      </div>
  		        	  </li>
  		        	
  		        )
  		    		
  		    		
  		    	}.bind(this))
  		    	
  		    	
  		    }
  		
  		
  		</ul>
  		
  	)
  }
  
});

module.exports=Shop;