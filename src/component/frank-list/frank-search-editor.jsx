const React = require('react');
require('./frank-search-editor.scss');

var AJSearch = React.createClass({
  displayName: 'AJSearch',
  propTypes: {
    //customerProps:React.PropTypes.object,
  },
  componentDidMount() {
  },
  componentWillReceiveProps(newProps) {
  },
  onSubmitBtntap(evt) {
  },
  searching(event) {
  	let id=this.refs.getId.value;
  	const {getId}=this.props;
  	//alert(id)
  	getId(id);
  	
  },
  inputing:function(e){
  	alert(this.refs.getId.value)
  	
  },
  render() {
    const { customerProps } = this.props;
    
    return(
    	<div style={{"padding":"1em"}}>
    	   <a href="javascript:void(0)" title="点击搜索" className="fr button-search" onClick={this.searching} >搜索</a>
    	   <div className="of" style={{"paddingRight":'1em'}}>
    	        <input type="text" placeholder="请输入门店号进行搜索" className="input_style" ref="getId" onInput={this.inputing}/> 
    	   </div>
    	</div>
    	
    	
    )
  },
});

module.exports=AJSearch;