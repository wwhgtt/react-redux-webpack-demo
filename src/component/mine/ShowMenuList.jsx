const React = require('react');
const config = require('../../config');
const helper = require('../../helper/dish-hepler');
const helperCommon = require('../../helper/common-helper');

const type = helper.getUrlParam('type');
const shopId = helper.getUrlParam('shopId');
const mid = helperCommon.getCookie('mid');
const setting_url=`${config.mineSettingURL}?shopId=`+shopId; 

require('./ShowMenuList.scss');

var ShowMenuList = React.createClass({
  displayName: 'Name',
  propTypes:{},
  componentWillMount(){
  	
  	
  },
  componentDidMount(){},
  render(){
  	const condition=4;//1 微信号(未绑定手机)  2手机号非会员（未绑定微信）3手机号会员（未绑定微信） 4绑定成功
  	return (
  		  <div className="list-outer">
  		       {
  		       	condition==3||condition==4?
  		       	  <div>
  		       	   <div className="mineInfo of">
  		       	        <div className="fl">
  		       	             <p className="title">我的积分</p>
  		       	             <p className="num">466</p>
  		       	        </div>
  		       	        <div className="fl">
  		       	             <p className="title">我的余额</p>
  		       	             <p className="num">78.50</p>
  		       	        </div>
  		       	   </div>
  		       	   <ul className="list-ul">
		  		          <li name="会员卡"><a href="javascript:void(0)"><i name="HYK"></i><span className="name">会员卡</span><span className="arrow"></span></a></li>
		  		          <li name="会员充值"><a href="javascript:void(0)"><i name="HYCZ"></i><span className="name">会员充值</span><span className="arrow"></span></a></li>
		  		       </ul>
		  		      </div>
  		       	:
  		       	   false
  		       }
  		       <ul className="list-ul">
  		          <li name="订单中心"><a href="javascript:void(0)"><i name="DD"></i><span className="name">订单中心</span><span className="arrow"></span></a></li>
  		          <li name="优惠券"><a href="javascript:void(0)"><i name="YH"></i><span className="name">优惠券</span><span className="arrow"></span></a></li>
  		          <li name="地址管理"><a href="javascript:void(0)"><i name="DZ"></i><span className="name">地址管理</span><span className="arrow"></span></a></li>
  		          {
  		       	    condition==3?
  		       	      <li name="绑定微信号"><a href="javascript:void(0)"><i name="BDWX"></i><span className="name">绑定微信号</span><span className="arrow"></span></a></li>
  		       	    :
  		       	    false
  		          }
  		       </ul>
  		       {
  		       	condition!=3 && condition!=4?
		  		       <ul className="list-ul">
		  		          <li name="会员注册"><a href="javascript:void(0)"><i name="HYZC"></i><span className="name">会员注册</span><span className="brief">注册会员享受更多福利</span><span className="arrow"></span></a></li>
		  		          {
					  		    	condition==1?
					  		          <li name="绑定手机号"><a href="javascript:void(0)"><i name="BDSJ"></i><span className="name">绑定手机号</span><span className="arrow"></span></a></li>
					  		      :
					  		      condition==2?
					  		          <li name="绑定微信号"><a href="javascript:void(0)"><i name="BDWX"></i><span className="name">绑定微信号</span><span className="arrow"></span></a></li>
					  		      :
					  		          false
					  		    }
		  		       </ul>
		  		    :
		  		    false
  		       }
  		       <ul className="list-ul">
  		          <li name="设置"><a href={setting_url}><i name="SZ"></i><span className="name">设置</span><span className="arrow"></span></a></li>
  		       </ul>
  		  </div>
  	)
  }
  
});

module.exports=ShowMenuList;