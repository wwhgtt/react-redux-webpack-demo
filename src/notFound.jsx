const React = require('react');
const ReactDOM = require('react-dom');



const NotFound=React.createClass({
	displayName:"NotFound",
	render(){
		let imgStyle={"display":"block","width":"12em","maxWidth":"100%","margin":"2em auto"};
		let pStyle={"textAlign":"center","color":"#686868"};
		return(
			<div>
			    <img src="../../../src/asset/images/404.png" alt="页面找不到了" style={imgStyle}/>
			    <p style={pStyle}>
			      <b>最有可能的原因是</b>
			      <br/>
			      1.您输入的网址可能不正确<br/>
			      2.链接已经过期<br/>
			      3.网速不够稳定<br/>
			    </p>
			</div>
		)
	}
})


ReactDOM.render(
  <NotFound /> ,
  document.getElementById('app-holder')
);
