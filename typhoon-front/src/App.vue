<template>
  <div id="app">
   <Typhoon></Typhoon>
  </div>
</template>

<script>
import Typhoon from "./components/Typhoon";
export default {
  name: "app",
  components: {
    Typhoon
  }
};
</script>
<style>
@import "./assets/css/reset.css";
body,
html,
#app {
  width: 100%;
  height: 100%;
  overflow: hidden;
  min-width: 943px;
  user-select: none;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.smControlAttribution,/* 版权字体样式*/
.smControlNoSelect {  /* 左下角经纬度字体样式 */
  font-size: normal;
  color: #000;
  opacity: 0.8;
}
.smControlAttribution {
  display: none!important;
}

/* 版权下链接字体样式*/
.smControlAttribution a,
.smControlAttribution a:hover{
  color: #000;
}
/* 台风信息弹窗样式 */
.pop-header {
  height: 26px;
  line-height: 26px;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}
#feature_contentDiv {
  top: 30px !important;
  overflow: unset !important;
}
#null_contentDiv {
  top: 30px !important;
  overflow: unset !important;
}
.content-table {
  margin-top: -2px;
}
#feature_hide {
  top: 7px;
  font-size: 13px;
  right: 5px;
}
.pop-hide {
  opacity: 0;
}
.feature_hide {
  float: right;
  margin-right: 4px;
  line-height: 27px;
  cursor: pointer;
}
.pop-container {
  border-radius: 3px;
}
.content-table tr {
  height: 24px;
}
.content-table td {
  height: 0px;
  font-size: 13px;
  padding: 0px;
  width: 10px;
}

.pop-header .pop-titlename {
  font-size: 14px;
  margin-left: 15px;
  line-height: 25px;
  font-weight: 800;
}

.content-table td .radius_qual {
  margin-right: 7px;
  text-align: center;
  display: inline-block;
  width: 23px;
}
.content-table td:first-child {
  width: 3px;
  text-align: right;
}
.content-table td:first-child span {
  color: #5f5e5e;
  font-weight: 800;
}
.content-table td:last-child {
  width: 7px;
  color: #666;
  padding-left: 7px;
}
/* 功能按钮标题样式 */
.ivu-col-span-2 {
  width: unset !important;
}
.ivu-col-offset-1 {
  margin-left: 2.166667% !important;
}
/* 时间选择器样式 */
.timeSelect .ivu-input {
  width: 100%;
  /*height: 30px;*/
}
/* 线路搜索框 */
.searchInput .ivu-input {
  width: 100%;
  /*height: 30px;*/
  border-radius: 20px;
}
/* 表格样式 */
.tableStyle .ivu-table-tip {
  overflow: hidden;
}
.tableStyle .ivu-table-cell {
  padding: 0;
}
.tableStyle .ivu-table td {
  height: 30px;
}
/* 图层面板样式 */
#overlay .ivu-radio-inner,
#overlay .ivu-checkbox-inner{
  display: none !important;
}

#overlay .ivu-slider-wrap{
  background-color: #a4a6a99c !important;
}
#overlay .ivu-slider-stop{
  background-color: #666 !important;
  width: 2px !important;
}
#positionValue {
  color: black;
  height: 30px !important;
  border: 1px solid #9ebce5 !important;
}

/* 输电线路杆塔内容样式 */
.smFramedCloudPopupContent {
  color: black;
  width: 100% !important;
}
.olPopup {
  width: 150px !important;
  height: 104px !important;
}
.popup_p {
  padding-bottom: 2px;
}
.popup_style1 {
  float: left;
  padding: 2px 0;
}

.gray-line{
  background-color: #fff;
}

.ivu-btn>span{
  font-weight:800 ;
}

/* .SuperMap.Layer.Vector_23{
  z-index: 500;
} */
</style>
