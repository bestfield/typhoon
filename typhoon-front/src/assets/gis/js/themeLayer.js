//构建 feature 数据, 专题图的数据必须是 SuperMap.Feature.Vector
/**
 *
 * @param data
 * @param t
 * @param tjzd
 * @param max
 * @param ys
 * @param index 动态
 */
var yaosu;
function addThemeLayer(data, t, tjzd, max, ys, index) {
  yaosu = ys;
  if (index != null && index > -1) {
    tjzd = [tjzd[index]];
    if (t == "3") {
      tjzd.push("无数据");
    }
  }
  if (t == "1") {
    // 创建一个柱状图（Bar）统计专题图图层
    themeLayer = new SuperMap.Layer.Graph("柱状专题图", "Bar");
    var barwidth; //宽度
    // 指定用于专题图制作的属性字段
    if (!isArray(ys)) {
      themeLayer.themeFields = tjzd;
      barwidth = 20 * tjzd.length;
    } else {
      themeLayer.themeFields = changeArray(ys);
      barwidth = 20 * ys.length;
    }
    // 配置图表参数
    themeLayer.isOverLay = false;
    themeLayer.chartsSetting = {
      // width，height，codomain 分别表示图表宽、高、数据值域；此三项参数为必设参数
      width: barwidth,
      height: 100,
      YOffset: -55,
      useAxis: false,
      codomain: [0, max], // 允许图表展示的值域范围，此范围外的数据将不制作图表
      barStyle: { fillOpacity: 1, width: 10 }, // 柱状图中柱条的（表示字段值的图形）样式
      // 按字段设置柱条样式（与 themeLayer.themeFields 中的字段一一对应）
      barStyleByFields: [
        { fillColor: "#347BB1" },
        { fillColor: "#7DB251" },
        { fillColor: "blue" },
        { fillColor: "#2EC7C9" },
        { fillColor: "#D87A80" }
      ],
      barHoverStyle: { fillOpacity: 1 }, //  柱条 hover 样式
      xShapeBlank: [2, 2, 2], // 水平方向上的空白间距参数
      axisYTick: 5, // y 轴刻度数量
      axisYLabels: [
        Math.round(max),
        Math.round((max * 4) / 5),
        Math.round((max * 3) / 5),
        Math.round((max * 2) / 5),
        Math.round((max * 1) / 5),
        0
      ], // y 轴标签内容
      //                  axisXLabels: ["受灾人口", "死亡人口"],         // x 轴标签内容
      backgroundStyle: { fillOpacity: 0 } // 背景样式   fillOpacity背景透明度
      //                  backgroundRadius: [5, 5, 5, 5]         // 背景框圆角参数
    };
  } else if (t == "2") {
    // 创建一个折线（Line）统计专题图图层
    themeLayer = new SuperMap.Layer.Graph("折线专题图", "Line");

    // 指定用于专题图制作的属性字段
    if (!isArray(ys)) {
      themeLayer.themeFields = tjzd;
    } else {
      themeLayer.themeFields = changeArray(ys);
    }
    // 配置图表参数
    themeLayer.isOverLay = false;
    themeLayer.chartsSetting = {
      // width，height，codomain 分别表示图表宽、高、数据值域；此三项参数为必设参数
      width: 120,
      height: 80,
      YOffset: -35,
      codomain: [0, max], // 允许图表展示的值域范围，此范围外的数据将不制作图表
      // 折线 style
      lineStyle: { strokeColor: "#D8361B", strokeOpacity: 0.7 },
      // 折线节点（表示字段值的图形）样式
      pointStyle: {
        stroke: true,
        strokeColor: "#D8361B",
        pointRadius: 3,
        strokeWidth: 1,
        fillColor: "#F3F3F3",
        fillOpacity: 1
      },
      // 折线节点 hover 样式
      pointHoverStyle: {
        fillColor: "#D8361B"
      },
      //                  xShapeBlank: [10, 10],       // 水平方向上的空白间距参数
      //                  axisYTick: 4,         // y 轴刻度数量
      //                  axisYLabels: ["4万", "3万", "2万", "1万", "0"],         // y 轴标签
      //                  axisXLabels: ["09年", "10年", "11年", "12年", "13年"],         // x 轴标签
      backgroundStyle: { fillColor: "#CCE8CF", fillOpacity: 0 }, // 背景样式
      backgroundRadius: [5, 5, 5, 5] // 背景框圆角参数
    };
  } else if (t == "3") {
    // 创建一个饼状图（Pie）统计专题图图层
    themeLayer = new SuperMap.Layer.Graph("饼状专题图", "Pie");

    // 指定用于专题图制作的属性字段
    if (!isArray(ys)) {
      themeLayer.themeFields = tjzd;
    } else {
      themeLayer.themeFields = changeArray(ys);
    }

    // 配置图表参数
    themeLayer.isOverLay = false;
    themeLayer.chartsSetting = {
      // width，height，codomain 分别表示图表宽、高、数据值域；此三项参数为必设参数
      width: 50,
      height: 50,
      codomain: [0, max], // 允许图表展示的值域范围，此范围外的数据将不制作图表
      // 饼图扇形（表示字段值的图形）样式
      sectorStyle: { fillOpacity: 0.8 },
      // 按字段设置饼图扇形 (样式与 themeLayer.themeFields 数组中的字段名称一一对应)

      sectorStyleByFields: [
        { fillColor: "#347BB1" },
        { fillColor: "#7DB251" },
        { fillColor: "blue" },
        { fillColor: "#2EC7C9" },
        { fillColor: "#D87A80" }
      ],
      //  饼图扇形 hover 样式
      sectorHoverStyle: { fillOpacity: 1 }
    };
  }
  // 注册专题图 mousemove, mouseout 事件(注意：专题图图层对象自带 on 函数，没有 events 对象)
  themeLayer.on("mousemove", showInfoWin);
  themeLayer.on("mouseout", closeInfoWin);
  themeLayer.setOpacity(0.9);
  map.addLayer(themeLayer);
  var features = [];
  if (isArray(ys)) {
    for (var i = 0; i < data.length; i++) {
      var provinceInfo = data[i];
      var geo = new SuperMap.Geometry.Point(provinceInfo[1], provinceInfo[2]); //.transform("EPSG:4326","EPSG:900913")
      var attrs = {};
      attrs.state = ys;
      attrs.NAME = provinceInfo[0];
      /*		                    if(index!=null&&index>-1){
		                    	attrs[tjzd[0]]=provinceInfo[index+3];
		                    }else{
		                    	for(var j = 0;j<tjzd.length;j++){
		                            attrs[tjzd[j]]= provinceInfo[j+3];
		                        }
		                    }*/
      if (index == null && index < -1)
        index = tjzd.length - 1 >= 0 ? tjzd.length - 1 : 0;
      for (var j = 0; j < ys.length; j++) {
        attrs[getYaosuName(ys[j])] = provinceInfo[j + 3][index];
      }
      var fea = new SuperMap.Feature.Vector(geo, attrs);
      features.push(fea);
    }

    themeLayer.addFeatures(features);
    var html = "<table>" + "<tr>" + "<td><br>";
    var colSz = ["#347BB1", "#7DB251", "blue", "#2EC7C9"];
    for (var k = 0; k < ys.length; k++) {
      html +=
        "&nbsp;<span style='height:20px;background-color:" +
        colSz[k] +
        "'>&nbsp;&nbsp;</span>&nbsp;" +
        getYaosuName(ys[k]) +
        "&nbsp;<br>";
    }
    html =
      "<div id='other_chart_legend' style='float:right'>" +
      html +
      "</td></tr></table></div>";

    if (
      $("body", parent.document)
        .find("#map_li_")
        .find("#other_chart_legend")
    ) {
      $("body", parent.document)
        .find("#map_li_")
        .find("#other_chart_legend")
        .remove();
    }
    var fwfdStr = $("body", parent.document)
      .find("#map_li_")
      .html();
    if (fwfdStr == "") {
      html = html.replace("style='float:right'", "");
    } else {
      html = fwfdStr.replace("<div", "<div style='float:left'") + html;
    }
  } else {
    for (var i = 0; i < data.length; i++) {
      var provinceInfo = data[i];
      var geo = new SuperMap.Geometry.Point(provinceInfo[1], provinceInfo[2]); //.transform("EPSG:4326","EPSG:900913")
      var attrs = {};
      attrs.state = ys;
      attrs.NAME = provinceInfo[0];
      if (index != null && index > -1) {
        attrs[tjzd[0]] = provinceInfo[index + 3];
        if (t == "3") {
          attrs["无数据"] = 0.000001;
        }
      } else {
        for (var j = 0; j < tjzd.length; j++) {
          attrs[tjzd[j]] = provinceInfo[j + 3];
        }
      }
      var fea = new SuperMap.Feature.Vector(geo, attrs);

      features.push(fea);
    }

    themeLayer.addFeatures(features);
    var html = "<table>" + "<tr>" + "<td><br>";
    var colSz = ["#347BB1", "#7DB251", "blue", "#2EC7C9"];
    for (var k = 0; k < tjzd.length; k++) {
      html +=
        "&nbsp;<span style='height:20px;background-color:" +
        colSz[k] +
        "'>&nbsp;&nbsp;</span>&nbsp;" +
        tjzd[k] +
        "&nbsp;<br>";
    }
    html =
      "<div id='other_chart_legend' style='float:right'>" +
      html +
      "</td></tr></table></div>";

    if (
      $("body", parent.document)
        .find("#map_li_")
        .find("#other_chart_legend")
    ) {
      $("body", parent.document)
        .find("#map_li_")
        .find("#other_chart_legend")
        .remove();
    }
    var fwfdStr = $("body", parent.document)
      .find("#map_li_")
      .html();
    if (fwfdStr == "") {
      html = html.replace("style='float:right'", "");
    } else {
      html = fwfdStr.replace("<div", "<div style='float:left'") + html;
    }
  }
  $("body", parent.document)
    .find("#map_li_")
    .html(html);
  $("body", parent.document)
    .find("#map_li_")
    .show();
}
// 显示地图弹窗
function showInfoWin(e) {
  // e.target 是图形对象，即数据的可视化对象，柱状图中是柱条;
  // 图形对象的 refDataID 属性是数据（feature）的 id 属性，它指明图形对象是由那个数据制作而来;
  // 图形对象的 dataInfo 属性是图形对象表示的具体数据，他有两个属性，field 和 value;

  if (e.target && e.target.refDataID && e.target.dataInfo) {
    closeInfoWin();
    // 获取图形对应的数据 (feature)
    var fea = themeLayer.getFeatureById(e.target.refDataID);

    var info = e.target.dataInfo;

    // 弹窗内容
    //                var contentHTML = "<div style='color: #000; background-color: #fff'>";
    var contentHTML = "<div style='color: yellow;font-size:14px'>";
    contentHTML += "<strong>" + fea.attributes.NAME + "</strong>";
    contentHTML += "<hr>";
    if (!isArray(yaosu)) {
      if (fea.attributes.state == "1") {
        contentHTML +=
          info.field + "个数<br/><strong>" + info.value + "</strong>（个）";
      } else if (fea.attributes.state == "2") {
        contentHTML +=
          info.field +
          "直接经济损失<br/><strong>" +
          info.value +
          "</strong>（万元）";
      } else if (fea.attributes.state == "3") {
        contentHTML +=
          info.field + "受灾人口<br/><strong>" + info.value + "</strong>（人）";
      } else if (fea.attributes.state == "4") {
        contentHTML +=
          info.field + "死亡人口<br/><strong>" + info.value + "</strong>（人）";
      } else if (fea.attributes.state == "9") {
        contentHTML +=
          info.field + "失踪人口<br/><strong>" + info.value + "</strong>（人）";
      } else if (fea.attributes.state == "a") {
        contentHTML +=
          info.field +
          "饮水困难人口<br/><strong>" +
          info.value +
          "</strong>（人）";
      } else if (fea.attributes.state == "5") {
        contentHTML +=
          info.field +
          "受灾面积<br/><strong>" +
          info.value +
          "</strong>（公顷）";
      } else if (fea.attributes.state == "6") {
        contentHTML +=
          info.field +
          "绝收面积<br/><strong>" +
          info.value +
          "</strong>（公顷）";
      } else if (fea.attributes.state == "7") {
        contentHTML +=
          info.field + "倒塌房屋<br/><strong>" + info.value + "</strong>（间）";
      } else if (fea.attributes.state == "8") {
        contentHTML +=
          info.field + "损坏房屋<br/><strong>" + info.value + "</strong>（间）";
      } else {
        contentHTML += "No Data";
      }
    } else {
      switch (info.field) {
        case "个数":
          contentHTML += "个数<br/><strong>" + info.value + "</strong>（个）";
          break;
        case "直接经济损失":
          contentHTML +=
            "直接经济损失<br/><strong>" + info.value + "</strong>（万元）";
          break;
        case "受灾人口":
          contentHTML +=
            "受灾人口<br/><strong>" + info.value + "</strong>（人）";
          break;
        case "死亡人口":
          contentHTML +=
            "死亡人口<br/><strong>" + info.value + "</strong>（人）";
          break;
        case "饮水困难人口":
          contentHTML +=
            "饮水困难人口<br/><strong>" + info.value + "</strong>（人）";
          break;
        case "受灾面积":
          contentHTML +=
            "受灾面积<br/><strong>" + info.value + "</strong>（公顷）";
          break;
        case "绝收面积":
          contentHTML +=
            "绝收面积<br/><strong>" + info.value + "</strong>（公顷）";
          break;
        case "倒塌房屋":
          contentHTML +=
            "倒塌房屋<br/><strong>" + info.value + "</strong>（间）";
          break;
        case "损坏房屋":
          contentHTML +=
            "损坏房屋<br/><strong>" + info.value + "</strong>（间）";
          break;
        default:
          contentHTML += "No Data";
      }
    }

    contentHTML += "</div>";

    // 弹出框大小
    var infowinSize =
      SuperMap.Browser.name == "firefox"
        ? new SuperMap.Size(135, 95)
        : new SuperMap.Size(125, 85);

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
    infowin.setBackgroundColor("#000000");
    infowin.setOpacity(0.6);
    if (infowin) map.removePopup(infowin);
    map.addPopup(infowin);
  }
}
// 移除和销毁地图弹窗
function closeInfoWin() {
  if (infowin) {
    try {
      map.removePopup(infowin);
    } catch (e) {
      alert(e.message);
    }
  }
}
/**
 * 根据要素编号或的要素名称
 */
function getYaosuName(id) {
  switch (id) {
    case "1":
      return "个数";
    case "2":
      return "直接经济损失";
    case "3":
      return "受灾人口";
    case "4":
      return "死亡人口";
    case "9":
      return "失踪人口";
    case "a":
      return "饮水困难人口";
    case "5":
      return "受灾面积";
    case "6":
      return "绝收面积";
    case "7":
      return "倒塌房屋";
    case "8":
      return "损坏房屋";
    default:
      return "";
  }
}
/**
 * 要素id数组变成名称数组
 *
 */
function changeArray(yaosu_arr) {
  var temp = [];
  for (var i = 0; i < yaosu_arr.length; i++) {
    temp.push(getYaosuName(yaosu_arr[i]));
  }
  return temp;
}
/*
     * 
     *判断是否是数组
     *
    */
var isArray = function(v) {
  return toString.apply(v) === "[object Array]";
};
