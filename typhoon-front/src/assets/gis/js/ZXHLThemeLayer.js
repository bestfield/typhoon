//构建 feature 数据, 专题图的数据必须是 SuperMap.Feature.Vector
/*
data,数据,
max,最大值
ys,类型
*/

function ZXHLThemeLayer(data, max, ys) {
  clearDM();
  if (fwfdThemeLayer) {
    try {
      map.removeLayer(fwfdThemeLayer);
    } catch (e) {}
  }
  // 定义 Unique 单值专题图层
  fwfdThemeLayer = new SuperMap.Layer.Unique("分段专题图");
  fwfdThemeLayer.setOpacity(0.6);

  // 图层基础样式
  fwfdThemeLayer.style = {
    shadowBlur: 3,
    shadowColor: "#000000",
    shadowOffsetX: 1,
    shadowOffsetY: 1,
    fillColor: "#FFFFFF"
  };

  // 开启 hover 高亮效果
  fwfdThemeLayer.isHoverAble = true;

  // hover 高亮样式
  fwfdThemeLayer.highlightStyle = {
    stroke: true,
    strokeWidth: 2,
    strokeColor: "blue",
    fillColor: "#00F5FF",
    fillOpacity: 0.2
  };

  // 用于单值专题图的属性字段名称
  fwfdThemeLayer.themeField = "SNAME";
  // 风格数组，设定值对应的样式
  fwfdThemeLayer.styleGroups = styleGroup(data, max, ys);

  //专题图层 mousemove 事件
  fwfdThemeLayer.on("mousemove", evn);
  map.addLayer(fwfdThemeLayer);
  var queryParam, queryBySQLParams, queryBySQLService;

  var conditions = "";
  queryParam = new SuperMap.REST.FilterParameter({
    name: "province@china", //"Countries@World.1",
    attributeFilter: conditions //"光缆规格  like '%144芯%'"//"Pop_1994>1000000000 and SmArea>900"
  });
  queryBySQLParams = new SuperMap.REST.QueryBySQLParameters({
    queryParams: [queryParam]
  });

  var url =
    "http://192.168.1.30:8090/iserver/services/map-china/rest/maps/china";
  queryBySQLService = new SuperMap.REST.QueryBySQLService(url, {
    eventListeners: {
      processCompleted: processCompleted,
      processFailed: processFailed
    }
  });
  queryBySQLService.processAsync(queryBySQLParams);
  var html = "";
  var tlsm = "";
  var dw = "";
  if (ys == "2") {
    tlsm = "直接经济损失";
    dw = "（万元）";
  }
  html +=
    "<div><table><tr><td style='text-align: center;background-color:#7392D8;height:24px;font-size:12px;color:white'>&nbsp;图例(" +
    tlsm +
    ")&nbsp;&nbsp;</td></tr>" +
    "<tr><td style='height:20px;'>&nbsp;<img src='images/fwfdtl/1.png' style='width:30px;height:12px;'><" +
    Math.round(max / 4) +
    dw +
    "&nbsp;&nbsp;</td></tr>" +
    "<tr><td style='height:20px;'>&nbsp;<img src='images/fwfdtl/2.png' style='width:30px;height:12px;'>" +
    Math.round(max / 4) +
    "-" +
    Math.round((max / 4) * 2) +
    dw +
    "&nbsp;&nbsp;</td></tr>" +
    "<tr><td style='height:20px;'>&nbsp;<img src='images/fwfdtl/3.png' style='width:30px;height:12px;'>" +
    Math.round((max / 4) * 2) +
    "-" +
    Math.round((max / 4) * 3) +
    dw +
    "&nbsp;&nbsp;</td></tr>" +
    "<tr><td style='height:20px;'>&nbsp;<img src='images/fwfdtl/4.png' style='width:30px;height:12px;'>>" +
    Math.round((max / 4) * 3) +
    dw +
    "&nbsp;&nbsp;</td></tr>" +
    "</div>";
  $("body", parent.document)
    .find("#map_li_")
    .html(html);
  $("body", parent.document)
    .find("#map_li_")
    .show();
}

function processCompleted(queryEventArgs) {
  var i, j, feature, num;
  result = queryEventArgs.result;
  if (result && result.recordsets) {
    for (i = 0; i < result.recordsets.length; i++) {
      if (result.recordsets[i].features) {
        for (j = 0; j < result.recordsets[i].features.length; j++) {
          feature = result.recordsets[i].features[j];
          //                            var m = feature.attributes["NAME"];
          //                            addStyle(feature,m);
          /*	                            for(num=0;num<feature.geometry.components.length;num++){
                                feature.geometry.components[num].transform("EPSG:4326","EPSG:900913");
                            }*/
          fwfdThemeLayer.addFeatures(feature);
        }
      }
    }
  }
}
function processFailed(e) {
  alert(e.error.errorMsg);
}

function styleGroup(data, fwfdMax, fwfdYs) {
  var styGrops = [];
  $.each(data, function(i, dataObj) {
    if (fwfdYs.indexOf("2") != -1) {
      if (dataObj.zjjjSs < fwfdMax / 4) {
        var styGro = {
          value: dataObj.kongjian, //省名称
          style: {
            fillColor: "#F7DCB0"
          }
        };
        styGrops.push(styGro);
      } else if (dataObj.zjjjSs < (fwfdMax / 4) * 2) {
        var styGro = {
          value: dataObj.kongjian,
          style: {
            fillColor: "#FBD79D"
          }
        };
        styGrops.push(styGro);
      } else if (dataObj.zjjjSs < (fwfdMax / 4) * 3) {
        var styGro = {
          value: dataObj.kongjian,
          style: {
            fillColor: "#FBC875"
          }
        };
        styGrops.push(styGro);
      } else {
        var styGro = {
          value: dataObj.kongjian,
          style: {
            fillColor: "#FAB039"
          }
        };
        styGrops.push(styGro);
      }
    }
  });
  return styGrops;
}

function evn(e) {}

// 显示地图弹窗
function showFdInfoWin(e) {
  // e.target 是图形对象，即数据的可视化对象，柱状图中是柱条;
  // 图形对象的 refDataID 属性是数据（feature）的 id 属性，它指明图形对象是由那个数据制作而来;
  // 图形对象的 dataInfo 属性是图形对象表示的具体数据，他有两个属性，field 和 value;
  if (e.target && e.target.refDataID && e.target.dataInfo) {
    closeInfoWin();
    // 获取图形对应的数据 (feature)
    var fea = fwfdThemeLayer.getFeatureById(e.target.refDataID);

    var info = e.target.dataInfo;

    // 弹窗内容
    var contentHTML = "<div style='color: #000; background-color: #fff'>";
    contentHTML += "省级名称:<br><strong>" + fea.attributes.NAME + "</strong>";

    contentHTML += "<hr>";
    switch (info.field) {
      case "zjjjSs":
        contentHTML +=
          "直接经济损失<br/><strong>" + info.value + "</strong>（人）";
        break;
      case "szaiRk":
        contentHTML += "受灾人口<br/><strong>" + info.value + "</strong>（人）";
        break;
      case "swangRk":
        contentHTML += "死亡人口<br/><strong>" + info.value + "</strong>（人）";
        break;
      case "szaiMj":
        contentHTML +=
          "受灾面积<br/><strong>" + info.value + "</strong>（公顷）";
        break;
      case "jshouMj":
        contentHTML +=
          "绝收面积<br/><strong>" + info.value + "</strong>（公顷）";
        break;
      case "dsunFw":
        contentHTML += "倒损房屋<br/><strong>" + info.value + "</strong>（间）";
        break;
      default:
        contentHTML += "No Data";
    }
    contentHTML += "</div>";

    // 弹出框大小
    var infowinSize =
      SuperMap.Browser.name == "firefox"
        ? new SuperMap.Size(180, 115)
        : new SuperMap.Size(170, 100);

    // 弹出窗地理位置
    var lonLat = map.getLonLatFromPixel(infowinPosition);
    infowin = new SuperMap.Popup(
      "infowin",
      lonLat,
      infowinSize,
      contentHTML,
      false,
      false,
      null
    );
    infowin.setBackgroundColor("#fff");
    infowin.setOpacity(0.8);
    if (infowin) map.removePopup(infowin);
    map.addPopup(infowin);
  }
}
