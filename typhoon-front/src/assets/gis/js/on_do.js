$(document).ready(function() {
  //	initMapFrom();
});
/**
 *初始化地图页面按钮权限
 */
function initMapFrom() {
  $.getUrlParam = function(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
  };
  var mark = $.getUrlParam("mark") == null ? "" : $.getUrlParam("mark"); //回馈内容
  if (mark == "to") {
    //		document.getElementById('but_list_').style.display="none";
    //		document.getElementById('map_li_').style.display="none";
  }
} /*
function selectBut(v){
	
	if(v=='map'){
		$("#tab_map").css('background-image',"url('../images/census/u404.png')");
		$("#tab_table").css('background-image',"url('../images/census/u406.png')");
		$("#zhzq_table_id").hide();
		$("#map_li_").show();
		$("#zhzq_map_tool").show();
	}
	else if(v=='tab'){
		$("#tab_table").css('background-image',"url('../images/census/u404.png')");
		$("#tab_map").css('background-image',"url('../images/census/u406.png')");
		$("#zhzq_table_id").show();
		$("#map_li_").hide();
		$("#zhzq_map_tool").hide();
	}
}*/
/**
 * 按钮点击样式控制
 * @param v
 */
