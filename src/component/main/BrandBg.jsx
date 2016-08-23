const React = require('react');
require('./BrandBg.scss');

var BrandBg = React.createClass({
  displayName: 'BrandBg',
  propTypes:{},
  componentWillMount(){
  	const {getBg}=this.props;
  	//console.log(this.props);
  	getBg("810005896");
  	
  	
  },
  componentDidMount(){},
  render(){
  	const {BG}=this.props;
  	
  	let myStyle={"backgroundImage":"url("+BG+")"};
  	return (
  		  <div className="bg" style={myStyle}></div>
  		  
  	)
  }
  
});

module.exports=BrandBg;