//构建 feature 数据, 专题图的数据必须是 SuperMap.Feature.Vector
function addYsThemeLayer(data, t, tjzd, max, ty) {
  if (t == "1") {
    // 创建一个柱状图（Bar）统计专题图图层
    themeLayer = new SuperMap.Layer.Graph("柱状专题图", "Bar");
    // 指定用于专题图制作的属性字段
    themeLayer.themeFields = tjzd;

    // 配置图表参数
    themeLayer.isOverLay = false;
    themeLayer.chartsSetting = {
      // width，height，codomain 分别表示图表宽、高、数据值域；此三项参数为必设参数
      width: 20 * tjzd.length,
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
        { fillColor: "#2EC7C9" }
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
    themeLayer.isOverLay = false;
    // 指定用于专题图制作的属性字段
    themeLayer.themeFields = tjzd;
    // 配置图表参数
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
    themeLayer.themeFields = tjzd;

    // 配置图表参数
    themeLayer.isOverLay = false;
    themeLayer.chartsSetting = {
      // width，height，codomain 分别表示图表宽、高、数据值域；此三项参数为必设参数
      width: 50,
      height: 50,
      codomain: [0, max], // 允许图表展示的值域范围，此范围外的数据将不制作图表
      // 饼图扇形（表示字段值的图形）样式
      sectorStyle: { fillOpacity: 1 },
      // 按字段设置饼图扇形 (样式与 themeLayer.themeFields 数组中的字段名称一一对应)
      sectorStyleByFields: [
        { fillColor: "#347BB1" },
        { fillColor: "#7DB251" },
        { fillColor: "blue" },
        { fillColor: "#2EC7C9" }
      ],
      //  饼图扇形 hover 样式
      sectorHoverStyle: { fillOpacity: 1 }
    };
  }

  // 注册专题图 mousemove, mouseout 事件(注意：专题图图层对象自带 on 函数，没有 events 对象)
  themeLayer.on("mousemove", showYsInfoWin);
  themeLayer.on("mouseout", closeInfoWin);
  themeLayer.setOpacity(0.9);
  map.addLayer(themeLayer);
  var features = [];
  var tempKind = "";
  for (var i = 0; i < data.length; i++) {
    var provinceInfo = data[i];
    if (tempKind != provinceInfo.kongjian) {
      tempKind = provinceInfo.kongjian;
    } else {
      continue;
    }
    var geo = new SuperMap.Geometry.Point(provinceInfo.smx, provinceInfo.smy); //.transform("EPSG:4326","EPSG:900913")
    var attrs = {};
    attrs.NAME = provinceInfo.kongjian;
    for (var k = 0; k < tjzd.length; k++) {
      eval("attrs." + tjzd[k] + " = provinceInfo." + tjzd[k]);
    }
    var fea = new SuperMap.Feature.Vector(geo, attrs);
    features.push(fea);
  }
  themeLayer.addFeatures(features);
  var html =
    "<table>" +
    "<tr>" +
    /*            				"<td style='width:40px;height:100px;'>"+max+"<br>" +
            					"<div style='width:20px;height:60px;border:1px solid #a4a2a2'></div>" +
            				"</td>" +*/
    "<td><br>";
  var tlsm = "";
  var dw = "";
  var colSz = ["#347BB1", "#7DB251", "blue", "#2EC7C9"];
  for (var k = 0; k < tjzd.length; k++) {
    if (tjzd[k] == "jishu") {
      tlsm = "个数";
      dw = "个";
    } else if (tjzd[k] == "zjjjSs") {
      tlsm = "直接经济损失";
      dw = "万元";
    } else if (tjzd[k] == "szaiRk") {
      tlsm = "受灾人口";
      dw = "人";
    } else if (tjzd[k] == "swangRk") {
      tlsm = "死亡人口";
      dw = "人";
    } else if (tjzd[k] == "szongRk") {
      tlsm = "失踪人口";
      dw = "人";
    } else if (tjzd[k] == "ysknRk") {
      tlsm = "饮水困难人口";
      dw = "人";
    } else if (tjzd[k] == "szaiMj") {
      tlsm = "受灾面积";
      dw = "公顷";
    } else if (tjzd[k] == "jshouMj") {
      tlsm = "绝收面积";
      dw = "公顷";
    } else if (tjzd[k] == "dsunFw") {
      tlsm = "倒塌房屋";
      dw = "间";
    } else if (tjzd[k] == "shuaiFw") {
      tlsm = "损坏房屋";
      dw = "间";
    } else if (tjzd[k] == "gdp") {
      tlsm = "地区生产总值";
      dw = "万元";
    } else if (tjzd[k] == "larea") {
      tlsm = "流域面积";
      dw = "平方千米";
    } else if (tjzd[k] == "llcd") {
      tlsm = "河流长度";
      dw = "千米";
    } else if (tjzd[k] == "lyrk") {
      tlsm = "流域人口";
      dw = "人";
    } else if (tjzd[k] == "renshu") {
      tlsm = "人数";
      dw = "人";
    } else if (tjzd[k] == "gdzc") {
      tlsm = "固定资产";
      dw = "万元";
    } else if (tjzd[k] == "gzmj") {
      tlsm = "耕种面积 ";
      dw = "平方千米";
    }
    html +=
      "&nbsp;<span style='height:20px;background-color:" +
      colSz[k] +
      "'>&nbsp;&nbsp;</span>&nbsp;" +
      tlsm +
      "(" +
      dw +
      ")&nbsp;<br>";
    //                html+= "<tr><td style='height:20px;'>&nbsp;<span style='width:30px;height:12px;background-color:"+colSz[k]+";'>&nbsp;&nbsp;&nbsp;</span>"+tlsm+"("+dw+")&nbsp;&nbsp;</td></tr>";
  }
  html = "<div style='float:left'>" + html + "</td></tr></table></div>";
  var fwfdStr = $("body", parent.document)
    .find("#map_li_")
    .html();
  if (fwfdStr == "") {
    html = html.replace("style='float:right'", "");
  } else {
    html = fwfdStr.replace("<div>", "<div style='float:left'>") + html;
  }
  $("body", parent.document)
    .find("#map_li_")
    .html(html);
  $("body", parent.document)
    .find("#map_li_")
    .show();
}

// 显示地图弹窗
function showYsInfoWin(e) {
  // e.target 是图形对象，即数据的可视化对象，柱状图中是柱条;
  // 图形对象的 refDataID 属性是数据（feature）的 id 属性，它指明图形对象是由那个数据制作而来;
  // 图形对象的 dataInfo 属性是图形对象表示的具体数据，他有两个属性，field 和 value;
  if (e.target && e.target.refDataID && e.target.dataInfo) {
    closeInfoWin();
    // 获取图形对应的数据 (feature)
    var fea = themeLayer.getFeatureById(e.target.refDataID);

    var info = e.target.dataInfo;
    // 弹窗内容
    var contentHTML = "<div style='color: yellow;font-size:14px'>";
    contentHTML += "<strong>" + fea.attributes.NAME + "</strong>";

    contentHTML += "<hr>";

    switch (info.field) {
      case "jishu":
        contentHTML +=
          "个数<br/><strong>" + addCommas(info.value) + "</strong>（个）";
        break;
      case "zjjjSs":
        contentHTML +=
          "直接经济损失<br/><strong>" +
          addCommas(info.value) +
          "</strong>（万元）";
        break;
      case "szaiRk":
        contentHTML +=
          "受灾人口<br/><strong>" + addCommas(info.value) + "</strong>（人）";
        break;
      case "swangRk":
        contentHTML +=
          "死亡人口<br/><strong>" + addCommas(info.value) + "</strong>（人）";
        break;
      case "szongRk":
        contentHTML +=
          "失踪人口<br/><strong>" + addCommas(info.value) + "</strong>（人）";
        break;
      case "ysknRk":
        contentHTML +=
          "饮水困难人口<br/><strong>" +
          addCommas(info.value) +
          "</strong>（人）";
        break;
      case "szaiMj":
        contentHTML +=
          "受灾面积<br/><strong>" + addCommas(info.value) + "</strong>（公顷）";
        break;
      case "jshouMj":
        contentHTML +=
          "绝收面积<br/><strong>" + addCommas(info.value) + "</strong>（公顷）";
        break;
      case "dsunFw":
        contentHTML +=
          "倒塌房屋<br/><strong>" + addCommas(info.value) + "</strong>（间）";
        break;
      case "shuaiFw":
        contentHTML +=
          "损坏房屋<br/><strong>" + addCommas(info.value) + "</strong>（间）";
        break;
      case "gdp":
        contentHTML +=
          "地区生产总值<br/><strong>" +
          addCommas(info.value) +
          "</strong>（万元）";
        break;
      case "larea":
        contentHTML +=
          "流域面积<br/><strong>" +
          addCommas(info.value) +
          "</strong>（平方千米）";
        break;
      case "llcd":
        contentHTML +=
          "流域长度<br/><strong>" + addCommas(info.value) + "</strong>（千米）";
        break;
      case "lyrk":
        contentHTML +=
          "流域人口<br/><strong>" + addCommas(info.value) + "</strong>（人）";
        break;
      case "renshu":
        contentHTML +=
          "人数<br/><strong>" + addCommas(info.value) + "</strong>（人）";
        break;
      case "gdzc":
        contentHTML +=
          "固定资产<br/><strong>" + addCommas(info.value) + "</strong>（万元）";
        break;
      case "gzmj":
        contentHTML +=
          "耕种面积<br/><strong>" +
          addCommas(info.value) +
          "</strong>（平方千米）";
        break;

      default:
        contentHTML += "No Data";
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
