/************************************************************************************************************************************************/
/**风险普查--滑坡--基础信息
 * 地图上标记泥石流沟位置
 */
function getHpMarkers(data) {
  //河口位置点
  markers = new SuperMap.Layer.Markers("泥石流沟位置");
  map.addLayer(markers);
  $.each(data, function(i, value) {
    //MAP
    var x = value.V06001_LS; //滑坡位置纬度（度）
    var y = value.V05001_LS; //滑坡沟位置纬度
    var size = new SuperMap.Size(20, 20);
    var offset = new SuperMap.Pixel(-(size.w / 2), -size.h);
    var icon = new SuperMap.Icon("../images/gis/hekou.png", size, offset);
    var hpMarker = new SuperMap.Marker(
      new SuperMap.LonLat(x, y).transform("EPSG:4326", "EPSG:900913"),
      icon
    );
    hpMarker.events.on({
      click: hpWin,
      scope: hpMarker
    });
    hpMarker.V_P_NAME = value.V_P_NAME; //所属省
    hpMarker.V_C_NAME = value.V_C_NAME; //所属市
    hpMarker.V_CT_NAME = value.V_CT_NAME; //所属县
    hpMarker.V_T_NAME = value.V_T_NAME; //所属乡镇
    hpMarker.V_LS_NAME = value.V_LS_NAME; //泥石流沟名称
    hpMarker.V_LS_CODE = value.V_LS_CODE; //泥石流沟代码
    hpMarker.V_AC_CODE = value.V_AC_CODE; //行政村代码
    hpMarker.V_M_CODE = value.V_M_CODE; //中小河流代码
    hpMarker.V_R_AREA = value.V_R_AREA; //流域面积

    hpMarker.V_TOP_HEIGHT = value.V_TOP_HEIGHT; //坡顶标高
    hpMarker.V_TOE_HEIGHT = value.V_TOE_HEIGHT; //坡脚标高
    hpMarker.V_LS_AGE = value.V_LS_AGE; //滑坡动力

    hpMarker.x = x;
    hpMarker.y = y;
    if (i == 0) {
      map.panTo(
        new SuperMap.LonLat(x, y).transform("EPSG:4326", "EPSG:900913")
      );
      map.setCenter(
        new SuperMap.LonLat(x, y).transform("EPSG:4326", "EPSG:900913"),
        6
      );
    }
    markers.addMarker(hpMarker);
  });
  //	layerFullScreen();
}
function hpWin() {
  if (popup) {
    try {
      map.removePopup(popup);
    } catch (e) {}
  }
  var contentHTML =
    "<div style='font-size:12px; opacity: 0.8;width:200px;height:180px;'>" +
    "<table style='width:200px;cellspacing=\"5\"'>" +
    "<tr><td colspan=\"2\" style='font-size:14px; font-weight:bold ;color:#2476E3;border-bottom: 1px solid #E4E4E4;height:25px;line-height: 25px;'>" +
    this.V_LS_NAME +
    "</td></tr>" +
    "<tr><td>滑坡代码：</td><td>" +
    this.V_LS_CODE +
    "</td></tr>" +
    "<tr><td>所属省：</td><td>" +
    this.V_P_NAME +
    "</td></tr>" +
    "<tr><td>所属市：</td><td>" +
    this.V_C_NAME +
    "</td></tr>" +
    "<tr><td>所属县：</td><td>" +
    this.V_CT_NAME +
    "</td></tr>" +
    "<tr><td>所属乡镇：</td><td>" +
    this.V_T_NAME +
    "</td></tr>" +
    "<tr><td>坡顶标高：</td><td>" +
    this.V_TOP_HEIGHT +
    "</td></tr>" +
    "<tr><td>坡脚标高：</td><td>" +
    this.V_TOE_HEIGHT +
    "</td></tr>" +
    "<tr><td>滑坡年代：</td><td>" +
    this.V_LS_AGE +
    "</td></tr>" +
    "<tr><td colspan=\"2\" style='text-align:right;'>" +
    "<a href='../huapodetails.html?vmcode=" +
    this.V_LS_CODE +
    "&area=" +
    escape(this.V_P_NAME + this.V_C_NAME + this.V_CT_NAME + this.V_T_NAME) +
    "' target='_blank'>详情</a>" +
    "</td></tr>";
  contentHTML += "</table></div>";
  popup = new SuperMap.Popup.FramedCloud(
    "popwin",
    new SuperMap.LonLat(this.x, this.y).transform("EPSG:4326", "EPSG:900913"),
    null,
    contentHTML,
    null,
    true
  );
  map.addPopup(popup);
}

/**
 * 隐患点
 * @param data
 */
function getHpYhdMarkers(data) {
  GoclearMarkers();
  //创建标记图层
  markers = new SuperMap.Layer.Markers("Markers", {});
  //循环遍历所有的隐患点数据
  $.each(data, function(i, dataObj) {
    var V_HIDDEN_NAME = dataObj.V_HIDDEN_NAME; //隐患点名称
    var V_HIDD_LON = dataObj.V_HIDD_LON; //经度
    var V_HIDD_LAT = dataObj.V_HIDD_LAT; //纬度
    var V_HIDD_HEIGHT = dataObj.V_HIDD_HEIGHT; //海拔高度
    var V_HIDD_POP = dataObj.V_HIDD_POP; //人数

    var V_HIDD_ETYPE = dataObj.V_HIDD_ETYPE; //隐患点类型
    var V_HIDD_EA = dataObj.V_HIDD_EA; //固定资产
    var V_RZ_PLANTTYPE = dataObj.V_RZ_PLANTTYPE; //主要作物类型
    var V_ARG_AREA = dataObj.V_ARG_AREA; //耕种面积
    var V_HIDD_MEA = dataObj.V_HIDD_MEA; //防灾减灾措施

    var HIDD_LON = dataObj.V_HIDD_LON; //经度
    var HIDD_LAT = dataObj.V_HIDD_LAT; //纬度
    var V_MFR_NAME = dataObj.V_MFR_NAME; //山洪沟名称
    var V_MFR_CODE = dataObj.V_MFR_CODE; //山洪沟编码

    var LON = V_HIDD_LON.replace("°", ".")
      .replace("′", "")
      .replace("″", "");
    var LAT = V_HIDD_LAT.replace("°", ".")
      .replace("′", "")
      .replace("″", "");

    //标记图层上添加标记
    var size = new SuperMap.Size(20, 20);
    var offset = new SuperMap.Pixel(-(size.w / 2), -size.h);
    var picurl = "../images/yhd/nodata.png";
    if (V_HIDD_ETYPE == "" || V_HIDD_ETYPE == "无") {
      picurl = "../images/yhd/nodata.png";
    }
    if (V_HIDD_ETYPE.indexOf("村庄") != -1) {
      picurl = "../images/yhd/cz.png";
    }
    if (V_HIDD_ETYPE.indexOf("公路") != -1) {
      picurl = "../images/yhd/gl.png";
    }
    if (V_HIDD_ETYPE.indexOf("建筑") != -1) {
      picurl = "../images/yhd/jzqy.png";
    }
    if (V_HIDD_ETYPE.indexOf("制造") != -1) {
      picurl = "../images/yhd/zzqy.png";
    }
    if (V_HIDD_ETYPE.indexOf("采矿") != -1) {
      picurl = "../images/yhd/ckqy.png";
    }
    if (V_HIDD_ETYPE.indexOf("桥梁") != -1) {
      picurl = "../images/yhd/ql.png";
    }
    if (V_HIDD_ETYPE.indexOf("居民小区") != -1) {
      picurl = "../images/yhd/sq.png";
    }
    if (V_HIDD_ETYPE.indexOf("学校") != -1) {
      picurl = "../images/yhd/xx.png";
    }
    if (V_HIDD_ETYPE.indexOf("医院") != -1) {
      picurl = "../images/yhd/yy.png";
    }
    var icon = new SuperMap.Icon(picurl, size, offset);

    var marker = new SuperMap.Marker(
      new SuperMap.LonLat(LON, LAT).transform("EPSG:4326", "EPSG:900913"),
      icon
    );
    marker.events.on({
      click: OpenHpYhd
      //		   "scope": marker
    });

    marker.V_HIDDEN_NAME = V_HIDDEN_NAME;
    marker.V_HIDD_LON = HIDD_LON;
    marker.V_HIDD_LAT = HIDD_LAT;
    marker.V_HIDD_HEIGHT = V_HIDD_HEIGHT;
    marker.V_HIDD_POP = V_HIDD_POP;
    marker.V_HIDD_ETYPE = V_HIDD_ETYPE;
    marker.V_HIDD_EA = V_HIDD_EA;
    marker.V_RZ_PLANTTYPE = V_RZ_PLANTTYPE;
    marker.V_ARG_AREA = V_ARG_AREA;
    marker.V_HIDD_MEA = V_HIDD_MEA;
    marker.V_MFR_NAME = V_MFR_NAME; //山洪沟名称
    marker.V_MFR_CODE = V_MFR_CODE; //山洪沟编码

    if (i == 0) {
      map.setCenter(
        new SuperMap.LonLat(LON, LAT).transform("EPSG:4326", "EPSG:900913"),
        6
      );
    }
    markers.addMarker(marker);
  });
  map.addLayer(markers);
  //	layerFullScreen();
}
function OpenHpYhd() {
  clearPopup();
  var marker = this;
  var V_HIDDEN_NAME = marker.V_HIDDEN_NAME;
  var V_HIDD_LON = marker.V_HIDD_LON;
  var V_HIDD_LAT = marker.V_HIDD_LAT;
  var V_HIDD_HEIGHT = marker.V_HIDD_HEIGHT;
  var V_HIDD_POP = marker.V_HIDD_POP;
  var V_HIDD_ETYPE = marker.V_HIDD_ETYPE;
  var V_HIDD_EA = marker.V_HIDD_EA;
  var V_RZ_PLANTTYPE = marker.V_RZ_PLANTTYPE;
  var V_ARG_AREA = marker.V_ARG_AREA;
  var V_HIDD_MEA = marker.V_HIDD_MEA;
  var V_MFR_NAME = marker.V_MFR_NAME;
  var V_MFR_CODE = marker.V_MFR_CODE;

  var contentHTML =
    "<div style='opacity: 0.7;text-align: left; font-size: 12px;height:100px;width:400px;'>" +
    "<div style=' font-size:12px; font-weight:bold ;color:#2476E3;border-bottom: 1px solid #E4E4E4;height:25px;line-height: 25px;'>" +
    V_HIDDEN_NAME +
    "</div>" +
    "<table>" +
    "<tr>" +
    "<th style='width:90px;'>经度：</th>" +
    "<td>" +
    V_HIDD_LON +
    "</td>" +
    "<th style='width:100px;'>纬度：</th>" +
    "<td>" +
    V_HIDD_LAT +
    "</th>" +
    "</tr>" +
    "<tr>" +
    "<th style='width:90px;'>山洪沟名称：</th>" +
    "<td>" +
    V_MFR_NAME +
    "</td>" +
    "<th style='width:100px;'>山洪沟编码：</th>" +
    "<td>" +
    V_MFR_CODE +
    "</th>" +
    "</tr>" +
    "<tr>" +
    "<th>海拔高度：</th>" +
    "<td>" +
    V_HIDD_HEIGHT +
    "</td>" +
    "<th style='width:96px;'>人数：</th>" +
    "<td>" +
    V_HIDD_POP +
    "</th>" +
    "</tr>" +
    "<tr>" +
    "<th>隐患点类型：</th>" +
    "<td>" +
    V_HIDD_ETYPE +
    "</td>" +
    "<th>固定资产：</th>" +
    "<td>" +
    V_HIDD_EA +
    "</th>" +
    "</tr>" +
    "<tr>" +
    "<th>主要作物类型：</th>" +
    "<td>" +
    V_RZ_PLANTTYPE +
    "</td>" +
    "<th>耕种面积：</th>" +
    "<td>" +
    V_ARG_AREA +
    "</td>" +
    "</tr>" +
    "<tr>" +
    "<th>防灾减灾措施：</th>" +
    "<td colspan='3'>" +
    V_HIDD_MEA +
    "</td>" +
    "</tr>" +
    "</table></div>";

  var LON = V_HIDD_LON.replace("°", ".")
    .replace("′", "")
    .replace("″", "");
  var LAT = V_HIDD_LAT.replace("°", ".")
    .replace("′", "")
    .replace("″", "");

  //	console.log(LON+"--"+LAT);

  popup = new SuperMap.Popup.FramedCloud(
    "popwin",
    new SuperMap.LonLat(LON, LAT).transform("EPSG:4326", "EPSG:900913"),
    null,
    contentHTML,
    null,
    true
  );
  map.addPopup(popup);
}

function getHpYjdMarkers(data, hsleval, shixiao) {
  GoclearMarkers();
  markers = new SuperMap.Layer.Markers("预警点", {});
  //创建标记图层
  //循环遍历所有的隐患点数据
  $.each(data, function(i, dataObj) {
    var V_P_NAME = dataObj.V_P_NAME; //省
    var V_C_NAME = dataObj.V_C_NAME; //市
    var V_CT_AL_NAME = dataObj.V_CT_AL_NAME; //县
    var V_VILLAGE_TOWN = dataObj.V_VILLAGE_TOWN; //乡
    var V_DENIZEN_COMM = dataObj.V_DENIZEN_COMM; //村
    var V_NAME = dataObj.V_NAME; //流域名称
    var V_CODE = dataObj.V_CODE; //流域编码
    var V06001 = dataObj.V06001; //x
    var V05001 = dataObj.V05001; //y
    var V_ALARM_PLACE = dataObj.V_ALARM_PLACE; //预警点名称

    var V01301 = dataObj.V01301; //预警点编码

    var D_ALARM_ID = dataObj.D_ALARM_ID; //唯一标示xxxxxxxxxxxxxxxxx
    //标记图层上添加标记
    var size = new SuperMap.Size(20, 20);
    var offset = new SuperMap.Pixel(-(size.w / 2), -size.h);

    var pic = "../images/gis/yjd/yj.png";
    if (hsleval != "all" && shixiao != "all") {
      var V_HAZARD_PRE = dataObj.V_HAZARD_PRE;

      if (V_HAZARD_PRE > 250) {
        pic = "../images/gis/yjd/1.png";
      } else if (V_HAZARD_PRE > 100 && V_HAZARD_PRE <= 250) {
        pic = "../images/gis/yjd/2.png";
      } else if (V_HAZARD_PRE > 50 && V_HAZARD_PRE <= 100) {
        pic = "../images/gis/yjd/3.png";
      } else if (V_HAZARD_PRE > 25 && V_HAZARD_PRE <= 50) {
        pic = "../images/gis/yjd/4.png";
      } else if (V_HAZARD_PRE > 10 && V_HAZARD_PRE <= 25) {
        pic = "../images/gis/yjd/5.png";
      } else if (V_HAZARD_PRE > 5 && V_HAZARD_PRE <= 10) {
        pic = "../images/gis/yjd/6.png";
      } else if (V_HAZARD_PRE > 0.1 && V_HAZARD_PRE <= 5) {
        pic = "../images/gis/yjd/7.png";
      } else {
        pic = "../images/gis/yjd/8.png";
      }
    }
    var icon = new SuperMap.Icon(pic, size, offset);
    var marker = new SuperMap.Marker(
      new SuperMap.LonLat(V06001, V05001).transform("EPSG:4326", "EPSG:900913"),
      icon
    );
    marker.events.on({
      click: OpenHpYjd
      //		   "scope": marker
    });
    marker.hsleval = hsleval; //洪水等级
    marker.shixiao = shixiao; //临界面雨量时效
    marker.V_P_NAME = V_P_NAME;
    marker.V_C_NAME = V_C_NAME;
    marker.V_CT_AL_NAME = V_CT_AL_NAME;
    marker.V_VILLAGE_TOWN = V_VILLAGE_TOWN;
    marker.V_DENIZEN_COMM = V_DENIZEN_COMM;
    marker.D_ALARM_ID = D_ALARM_ID;
    marker.V_NAME = V_NAME;
    marker.V_CODE = V_CODE;
    marker.V06001 = V06001;
    marker.V05001 = V05001;
    marker.V_ALARM_PLACE = V_ALARM_PLACE;

    marker.V01301 = V01301;
    markers.addMarker(marker);
  });

  map.addLayer(markers);
  //	 layerFullScreen();
}
function OpenHpYjd() {
  clearPopup();
  var marker = this;
  var V_P_NAME = marker.V_P_NAME; //省
  var V_C_NAME = marker.V_C_NAME; //市
  var V_CT_AL_NAME = marker.V_CT_AL_NAME; //县
  var V_VILLAGE_TOWN = marker.V_VILLAGE_TOWN; //乡
  var V_DENIZEN_COMM = marker.V_DENIZEN_COMM; //村
  var D_ALARM_ID = marker.D_ALARM_ID;
  var V_NAME = marker.V_NAME; //流域名称
  var V_CODE = marker.V_CODE; //流域编码
  var V06001 = marker.V06001;
  var V05001 = marker.V05001;
  var V_ALARM_PLACE = marker.V_ALARM_PLACE; //预警点名称
  var hsleval = marker.hsleval; //洪水等级
  var shixiao = marker.shixiao; //临界面雨量时
  var V01301 = marker.V01301;
  $.ajax({
    async: false,
    cache: true,
    type: "POST",
    dataType: "json",
    url: "../getHpLevelAndDate.do",
    data: { alramcode: D_ALARM_ID, hsleval: hsleval, shixiao: shixiao },
    error: function() {},
    success: function(data) {
      maparr.clear();
      $.each(data, function(i, dataObj) {
        maparr.put(dataObj.PRE_TIME + "-" + dataObj.LEVEL, dataObj.HAZARD_PRE); //HAZARD_PRE
      });
    }
  });
  var contentHTML = "";
  var basetable =
    "<table style='height:100%'>" +
    "<tr><th style='width:78px;'>流域名称：</th><td>" +
    V_NAME +
    "</td></tr>" +
    "<tr><th>流域编码：</th><td>" +
    V_CODE +
    "</td></tr>" +
    "<tr><th>预警点位置：</th><td>" +
    (V_P_NAME == "-" ? "" : V_P_NAME) +
    "&nbsp;" +
    (V_C_NAME == "-" ? "" : V_C_NAME) +
    "&nbsp;" +
    (V_CT_AL_NAME == "-" ? "" : V_CT_AL_NAME) +
    "&nbsp;" +
    (V_VILLAGE_TOWN == "-" ? "" : V_VILLAGE_TOWN) +
    "&nbsp;" +
    (V_DENIZEN_COMM == "-" ? "" : V_DENIZEN_COMM) +
    "</td></tr>" +
    "</table>";
  //没有阈值的情况
  if (
    (maparr.get("1-1") == undefined || maparr.get("1-1") == "") &&
    (maparr.get("3-1") == undefined || maparr.get("3-1") == "") &&
    (maparr.get("6-1") == undefined || maparr.get("6-1") == "") &&
    (maparr.get("12-1") == undefined || maparr.get("12-1") == "") &&
    (maparr.get("24-1") == undefined || maparr.get("24-1") == "") &&
    (maparr.get("1-2") == undefined || maparr.get("1-2") == "") &&
    (maparr.get("1-2") == undefined || maparr.get("1-2") == "") &&
    (maparr.get("1-3") == undefined || maparr.get("1-3") == "") &&
    (maparr.get("1-4") == undefined || maparr.get("1-4") == "") &&
    (maparr.get("3-2") == undefined || maparr.get("3-2") == "") &&
    (maparr.get("3-3") == undefined || maparr.get("3-3") == "") &&
    (maparr.get("3-4") == undefined || maparr.get("3-4") == "") &&
    (maparr.get("6-2") == undefined || maparr.get("6-2") == "") &&
    (maparr.get("6-4") == undefined || maparr.get("6-4") == "") &&
    (maparr.get("6-3") == undefined || maparr.get("6-3") == "") &&
    (maparr.get("12-2") == undefined || maparr.get("12-2") == "") &&
    (maparr.get("12-3") == undefined || maparr.get("12-3") == "") &&
    (maparr.get("12-4") == undefined || maparr.get("12-4") == "") &&
    (maparr.get("24-2") == undefined || maparr.get("24-2") == "") &&
    (maparr.get("24-3") == undefined || maparr.get("24-3") == "") &&
    (maparr.get("24-4") == undefined || maparr.get("24-4") == "")
  ) {
    contentHTML =
      "<div style='width:231px;height:110px; font-size:12px; opacity: 0.8'>";
    contentHTML +=
      "<div style=' font-size:12px; font-weight:bold ;color:#2476E3;border-bottom: 1px solid #E4E4E4;height:25px;line-height: 25px;'>" +
      V_ALARM_PLACE +
      "</div>";
    contentHTML += basetable;
    contentHTML += "</div>";
  } else {
    var yuzhi = "<table style='text-align:left;width:230px;'>";
    var boatou = "<tr><th></th>";
    var tabbody_1h1 = "",
      tabbody_1h2 = "",
      tabbody_1h3 = "",
      tabbody_1h4 = "";
    var tabbody_3h1 = "",
      tabbody_3h2 = "",
      tabbody_3h3 = "",
      tabbody_3h4 = "";
    var tabbody_6h1 = "",
      tabbody_6h2 = "",
      tabbody_6h3 = "",
      tabbody_6h4 = "";
    var tabbody_12h1 = "",
      tabbody_12h2 = "",
      tabbody_12h3 = "",
      tabbody_12h4 = "";
    var tabbody_24h1 = "",
      tabbody_24h2 = "",
      tabbody_24h3 = "",
      tabbody_24h4 = "";
    //1h
    if (
      (maparr.get("1-1") != undefined && maparr.get("1-1") != "") ||
      (maparr.get("1-2") != undefined && maparr.get("1-2") != "") ||
      (maparr.get("1-3") != undefined && maparr.get("1-3") != "") ||
      (maparr.get("1-4") != undefined && maparr.get("1-4") != "")
    ) {
      boatou += "<th >1h</th>";
      tabbody_1h1 +=
        "<td>" +
        (maparr.get("1-1") == undefined || maparr.get("1-1") == ""
          ? "-"
          : maparr.get("1-1")) +
        "</td>";
      tabbody_1h2 +=
        "<td>" +
        (maparr.get("1-2") == undefined || maparr.get("1-2") == ""
          ? "-"
          : maparr.get("1-2")) +
        "</td>";
      tabbody_1h3 +=
        "<td>" +
        (maparr.get("1-3") == undefined || maparr.get("1-3") == ""
          ? "-"
          : maparr.get("1-3")) +
        "</td>";
      tabbody_1h4 +=
        "<td>" +
        (maparr.get("1-4") == undefined || maparr.get("1-4") == ""
          ? "-"
          : maparr.get("1-4")) +
        "</td>";
    }
    //3h
    if (
      (maparr.get("3-1") != undefined && maparr.get("3-1") != "") ||
      (maparr.get("3-2") != undefined && maparr.get("3-2") != "") ||
      (maparr.get("3-3") != undefined && maparr.get("3-3") != "") ||
      (maparr.get("3-4") != undefined && maparr.get("3-4") != "")
    ) {
      boatou += "<th >3h</th>";
      tabbody_3h1 +=
        "<td>" +
        (maparr.get("3-1") == undefined || maparr.get("3-1") == ""
          ? "-"
          : maparr.get("3-1")) +
        "</td>";
      tabbody_3h2 +=
        "<td>" +
        (maparr.get("3-2") == undefined || maparr.get("3-2") == ""
          ? "-"
          : maparr.get("3-2")) +
        "</td>";
      tabbody_3h3 +=
        "<td>" +
        (maparr.get("3-3") == undefined || maparr.get("3-3") == ""
          ? "-"
          : maparr.get("3-3")) +
        "</td>";
      tabbody_3h4 +=
        "<td>" +
        (maparr.get("3-4") == undefined || maparr.get("3-4") == ""
          ? "-"
          : maparr.get("3-4")) +
        "</td>";
    }
    //6h
    if (
      (maparr.get("6-1") != undefined && maparr.get("6-1") != "") ||
      (maparr.get("6-2") != undefined && maparr.get("6-2") != "") ||
      (maparr.get("6-3") != undefined && maparr.get("6-3") != "") ||
      (maparr.get("6-4") != undefined && maparr.get("6-4") != "")
    ) {
      boatou += "<th>6h</th>";
      tabbody_6h1 +=
        "<td>" +
        (maparr.get("6-1") == undefined || maparr.get("6-1") == ""
          ? "-"
          : maparr.get("6-1")) +
        "</td>";
      tabbody_6h2 +=
        "<td>" +
        (maparr.get("6-2") == undefined || maparr.get("6-2") == ""
          ? "-"
          : maparr.get("6-2")) +
        "</td>";
      tabbody_6h3 +=
        "<td>" +
        (maparr.get("6-3") == undefined || maparr.get("6-3") == ""
          ? "-"
          : maparr.get("6-3")) +
        "</td>";
      tabbody_6h4 +=
        "<td>" +
        (maparr.get("6-4") == undefined || maparr.get("6-4") == ""
          ? "-"
          : maparr.get("6-4")) +
        "</td>";
    }
    //12h
    if (
      (maparr.get("12-1") != undefined && maparr.get("12-1") != "") ||
      (maparr.get("12-2") != undefined && maparr.get("12-2") != "") ||
      (maparr.get("12-3") != undefined && maparr.get("12-3") != "") ||
      (maparr.get("12-4") != undefined && maparr.get("12-4") != "")
    ) {
      boatou += "<th >12h</th>";
      tabbody_12h1 +=
        "<td>" +
        (maparr.get("12-1") == undefined || maparr.get("12-1") == ""
          ? "-"
          : maparr.get("12-1")) +
        "</td>";
      tabbody_12h2 +=
        "<td>" +
        (maparr.get("12-2") == undefined || maparr.get("12-2") == ""
          ? "-"
          : maparr.get("12-2")) +
        "</td>";
      tabbody_12h3 +=
        "<td>" +
        (maparr.get("12-3") == undefined || maparr.get("12-3") == ""
          ? "-"
          : maparr.get("12-3")) +
        "</td>";
      tabbody_12h4 +=
        "<td>" +
        (maparr.get("12-4") == undefined || maparr.get("12-4") == ""
          ? "-"
          : maparr.get("12-4")) +
        "</td>";
    }
    //24h
    if (
      (maparr.get("24-1") != undefined && maparr.get("24-1") != "") ||
      (maparr.get("24-2") != undefined && maparr.get("24-2") != "") ||
      (maparr.get("24-3") != undefined && maparr.get("24-3") != "") ||
      (maparr.get("24-4") != undefined && maparr.get("24-4") != "")
    ) {
      boatou += "<th >24h</th>";
      tabbody_24h1 +=
        "<td>" +
        (maparr.get("24-1") == undefined || maparr.get("24-1") == ""
          ? "-"
          : maparr.get("24-1")) +
        "</td>";
      tabbody_24h2 +=
        "<td>" +
        (maparr.get("24-2") == undefined || maparr.get("24-2") == ""
          ? "-"
          : maparr.get("24-2")) +
        "</td>";
      tabbody_24h3 +=
        "<td>" +
        (maparr.get("24-3") == undefined || maparr.get("24-3") == ""
          ? "-"
          : maparr.get("24-3")) +
        "</td>";
      tabbody_24h4 +=
        "<td>" +
        (maparr.get("24-4") == undefined || maparr.get("24-4") == ""
          ? "-"
          : maparr.get("24-4")) +
        "</td>";
    }
    boatou += "</tr>";

    yuzhi += boatou; //拼接头
    yuzhi +=
      "<tr><td style='font-weight:bold ;width:25%;'>&nbsp;一级</td>" +
      (tabbody_1h1 + tabbody_3h1 + tabbody_6h1 + tabbody_12h1 + tabbody_24h1) +
      "</tr>"; //拼接体
    yuzhi +=
      "<tr><td style='font-weight:bold ;width:25%;'>&nbsp;二级</td>" +
      (tabbody_1h2 + tabbody_3h2 + tabbody_6h2 + tabbody_12h2 + tabbody_24h2) +
      "</tr>"; //拼接体
    yuzhi +=
      "<tr><td style='font-weight:bold ;width:25%;'>&nbsp;三级</td>" +
      (tabbody_1h3 + tabbody_3h3 + tabbody_6h3 + tabbody_12h3 + tabbody_24h3) +
      "</tr>"; //拼接体
    yuzhi +=
      "<tr><td style='font-weight:bold ;width:25%;'>&nbsp;四级</td>" +
      (tabbody_1h4 + tabbody_3h4 + tabbody_6h4 + tabbody_12h4 + tabbody_24h4) +
      "</tr>"; //拼接体
    yuzhi += "</table>";
    contentHTML =
      "<div style='width:226px;height:135px; font-size:12px; opacity: 0.8'>";
    contentHTML +=
      "<div style=' font-size:12px; font-weight:bold ;color:#2476E3;border-bottom: 1px solid #E4E4E4;height:25px;line-height: 25px;'><div style='float:left'>" +
      V_ALARM_PLACE +
      "</div><div id='yuliangdanwei' style='float:left;display:none'>（<font size=1>雨量：毫米</font>）</div></div>";
    contentHTML +=
      "<div style='width:231px;height:20px; font-size:12px; opacity: 0.8;margin-top: 2px;'>";
    contentHTML +=
      "<div id='baseinfo_but' style='text-align:center;float:left;background:#E3F1BC;border:1px solid #cfcfcf;width:50px;cursor: pointer;font-size:12px;' onclick=\"return yuzhiinfo('baseinfo')\" >基本信息</div>";
    contentHTML +=
      "<div id='yuzhiinfo_but' style=\"text-align:center;float:left;border:1px solid #cfcfcf;margin-left:2px;width:50px;cursor: pointer;font-size:12px;\" onclick=\"return yuzhiinfo('yuzhiinfo')\">阈值</div>";
    contentHTML += "</div>";
    contentHTML +=
      "<div id='baseinfo' style='width:229px;display:block;'>" +
      "<div style='border:1px solid #E4E4E4;margin-top:-5px;height: 95px;'>" +
      basetable +
      "</div>" +
      "</div>";
    contentHTML +=
      "<div id='yuzhiinfo' style='width:231px;display: none;'><div style='border:1px solid #E4E4E4;margin-top:-5px;height: 95px;'>" +
      yuzhi +
      "</div></div>";
    contentHTML += "</div>";
  }

  popup = new SuperMap.Popup.FramedCloud(
    "popwin",
    new SuperMap.LonLat(V06001, V05001).transform("EPSG:4326", "EPSG:900913"),
    null,
    contentHTML,
    null,
    true
  );
  map.addPopup(popup);
}
function getHpXzcMarkers(data) {
  //创建标记图层
  xz_markers = new SuperMap.Layer.Markers("行政村", {});

  //循环遍历所有的隐患点数据
  $.each(data, function(i, dataObj) {
    var V_AC_CODE = dataObj.V_AC_CODE; //乡镇代码
    var V_AC_NAME =
      dataObj.V_AC_NAME == null ? dataObj.V_LS_NAME : dataObj.V_AC_NAME; //乡镇名称
    V_AC_NAME =
      V_AC_NAME.length > 14 ? V_AC_NAME.substring(0, 14) + "..." : V_AC_NAME;
    var V06001_LS = dataObj.V06001_LS; //x
    var V05001_LS = dataObj.V05001_LS; //y

    var V_LS_CODE = dataObj.V_LS_CODE; //泥石流沟编码
    var V_RZ_AAREA = dataObj.V_RZ_AAREA; //受灾面积
    var V_RZ_APOP = dataObj.V_RZ_APOP; //受灾人口

    var V_RZ_DPOP = dataObj.V_RZ_DPOP; //死亡人口
    var V_URG_TPOP = dataObj.V_URG_TPOP; //紧急转移安置人口
    var V_RZ_DBUILDING = dataObj.V_RZ_DBUILDING; //倒塌房屋
    var V_D_HOUSE = dataObj.V_D_HOUSE; //损坏房屋
    var V_ARG_AAREA = dataObj.V_ARG_AAREA; //农作物受灾面积
    var V_TCF_AREA = dataObj.V_TCF_AREA; //农作物绝收面积
    var V_LA_DEADNUM = dataObj.V_LA_DEADNUM; //大牲畜死亡数(头)
    var V_ARG_ELOSS = dataObj.V_ARG_ELOSS; //直接经济损失(万元)
    //标记图层上添加标记
    var size = new SuperMap.Size(20, 20);
    var offset = new SuperMap.Pixel(-(size.w / 2), -size.h);
    var icon = new SuperMap.Icon("../images/gis/xiangzheng.png", size, offset);

    var marker = new SuperMap.Marker(
      new SuperMap.LonLat(V06001_LS, V05001_LS).transform(
        "EPSG:4326",
        "EPSG:900913"
      ),
      icon
    );
    marker.events.on({
      click: openHpDetailsXzcView,
      scope: marker
    });

    marker.V_AC_CODE = V_AC_CODE;
    marker.V_AC_NAME = V_AC_NAME;
    marker.V_LS_CODE = V_LS_CODE;
    marker.V06001_LS = V06001_LS;
    marker.V05001_LS = V05001_LS;

    marker.V_RZ_AAREA = V_RZ_AAREA;
    marker.V_RZ_APOP = V_RZ_APOP;
    marker.V_RZ_DPOP = V_RZ_DPOP;
    marker.V_URG_TPOP = V_URG_TPOP;
    marker.V_RZ_DBUILDING = V_RZ_DBUILDING;
    marker.V_D_HOUSE = V_D_HOUSE;
    marker.V_ARG_AAREA = V_ARG_AAREA;
    marker.V_TCF_AREA = V_TCF_AREA;
    marker.V_LA_DEADNUM = V_LA_DEADNUM;
    marker.V_ARG_ELOSS = V_ARG_ELOSS;
    xz_markers.addMarker(marker);
  });
  map.addLayer(xz_markers);
}

function openHpDetailsXzcView() {
  clearPopup();
  var marker = this;
  var V_AC_CODE = marker.V_AC_CODE; //乡镇代码
  var V_AC_NAME = marker.V_AC_NAME; //乡镇名称
  var V_LS_CODE = marker.V_LS_CODE; //流域编码
  var V06001_LS = marker.V06001_LS; //x
  var V05001_LS = marker.V05001_LS; //y
  var V_RZ_AAREA = marker.V_RZ_AAREA;
  var V_RZ_APOP = marker.V_RZ_APOP;
  var V_RZ_DPOP = marker.V_RZ_DPOP;
  var V_URG_TPOP = marker.V_URG_TPOP;
  var V_RZ_DBUILDING = marker.V_RZ_DBUILDING;
  var V_D_HOUSE = marker.V_D_HOUSE;
  var V_ARG_AAREA = marker.V_ARG_AAREA;
  var V_TCF_AREA = marker.V_TCF_AREA;
  var V_LA_DEADNUM = marker.V_LA_DEADNUM;
  var V_ARG_ELOSS = marker.V_ARG_ELOSS;
  var contentHTML =
    "<div style='width:240px;height:115px; font-size:12px; opacity: 0.8'>";
  contentHTML +=
    "<div style=' font-size:14px; font-weight:bold ;color:#2476E3;border-bottom: 1px solid #E4E4E4;height:25px;line-height: 25px;'>" +
    V_AC_NAME +
    "</div>";
  contentHTML += "<table style='text-align:left;margin-left:5px;'>";
  contentHTML +=
    "<tr><td>居民区受灾面积:</td><td>" +
    (V_RZ_AAREA == "" || V_RZ_AAREA == undefined
      ? "-"
      : V_RZ_AAREA + "&nbsp;平方公里") +
    "</td></tr>";
  contentHTML +=
    "<tr><td>居民区受灾人口:</td><td>" +
    (V_RZ_APOP == "" || V_RZ_APOP == undefined ? "-" : V_RZ_APOP + "&nbsp;人") +
    "</td></tr>";
  contentHTML +=
    "<tr><td>居民区死亡人口:</td><td>" +
    (V_RZ_DPOP == "" || V_RZ_DPOP == undefined ? "-" : V_RZ_DPOP + "&nbsp;人") +
    "</td></tr>";
  contentHTML +=
    "<tr><td>紧急转移安置人口:</td><td>" +
    (V_URG_TPOP == "" || V_URG_TPOP == undefined
      ? "-"
      : V_URG_TPOP + "&nbsp;人") +
    "</td></tr>";
  contentHTML +=
    "<tr><td>居民区倒塌房屋:</td><td>" +
    (V_RZ_DBUILDING == "" || V_RZ_DBUILDING == undefined
      ? "-"
      : V_RZ_DBUILDING + "&nbsp;间") +
    "</td></tr>";
  contentHTML +=
    "<tr><td>≥损坏房屋:</td><td>" +
    (V_D_HOUSE == "" || V_D_HOUSE == undefined ? "-" : V_D_HOUSE + "&nbsp;人") +
    "</td></tr>";
  contentHTML +=
    "<tr><td>≥农作物受灾面积:</td><td>" +
    (V_ARG_AAREA == "" || V_ARG_AAREA == undefined
      ? "-"
      : V_ARG_AAREA + "&nbsp;平方公里") +
    "</td></tr>";
  contentHTML +=
    "<tr><td>≤农作物绝收面积:</td><td>" +
    (V_TCF_AREA == "" || V_TCF_AREA == undefined
      ? "-"
      : V_TCF_AREA + "&nbsp;平方公里") +
    "</td></tr>";
  contentHTML +=
    "<tr><td>大牲畜死亡数:</td><td>" +
    (V_LA_DEADNUM == "" || V_LA_DEADNUM == undefined
      ? "-"
      : V_LA_DEADNUM + "&nbsp;头") +
    "</td></tr>";
  contentHTML +=
    "<tr><td>直接经济损失:</td><td>" +
    (V_ARG_ELOSS == "" || V_ARG_ELOSS == undefined
      ? ""
      : V_ARG_ELOSS + "&nbsp;万元") +
    "</td></tr>";
  contentHTML += "</table>";
  contentHTML += "</div>";

  popup = new SuperMap.Popup.FramedCloud(
    "popwin",
    new SuperMap.LonLat(V06001_LS, V05001_LS).transform(
      "EPSG:4326",
      "EPSG:900913"
    ),
    null,
    contentHTML,
    null,
    true
  );
  map.addPopup(popup);
}

function getHpYjdDetails(vmcode) {
  //预警点位置
  markers = new SuperMap.Layer.Markers("预警点位置", {});
  map.addLayer(markers);

  $.ajax({
    async: false,
    cache: true,
    type: "POST",
    dataType: "json",
    url: "../getHpYjdDetails.do",
    timeout: 1000,
    data: {
      vmcode: vmcode
    },
    success: function(data) {
      if (data.length == 0) {
        return;
      }
      $.each(data, function(i, value) {
        var size = new SuperMap.Size(20, 20);
        var offset = new SuperMap.Pixel(-(size.w / 2), -size.h);
        var icon_yjd = new SuperMap.Icon(
          "../images/gis/yjd/yj.png",
          size,
          offset
        );

        //MAP河源坐标
        var x = value.V06001; //预警点经 度
        var y = value.V05001; //预警点 纬 度(度)
        //河源点
        var markerYuJinDian = new SuperMap.Marker(
          new SuperMap.LonLat(x, y).transform("EPSG:4326", "EPSG:900913"),
          icon_yjd
        );
        markerYuJinDian.events.on({
          click: openHpYjdView
        });

        markerYuJinDian.V_DISA_TYPE = value.V_DISA_TYPE; //灾种类形
        markerYuJinDian.V_P_NAME = value.V_P_NAME; //省份
        markerYuJinDian.V_NAME = value.V_NAME; //流域名称
        markerYuJinDian.V_CODE = value.V_CODE; //流域代码
        markerYuJinDian.V_R_AREA = value.V_R_AREA; //流域面积
        markerYuJinDian.V_Lat = value.V_Lat; //经度
        markerYuJinDian.V_Lon = value.V_Lon; //纬度
        markerYuJinDian.V01301_H = value.V01301_H; //关联水文站
        markerYuJinDian.V01301_P = value.V01301_P; //关联雨量站
        markerYuJinDian.V_REMARK = value.V_REMARK; //致灾阈值确定方法
        markerYuJinDian.V_A_METHOD = value.V_A_METHOD; //面雨量计算方法
        markerYuJinDian.V_ALARM_PLACE = value.V_ALARM_PLACE; //预警点名称
        markerYuJinDian.V01301 = value.V01301; //预警点代码
        markerYuJinDian.V_C_NAME = value.V_C_NAME; //预警点所在市
        markerYuJinDian.V_CT_AL_NAME = value.V_CT_AL_NAME; //预警点所在县
        markerYuJinDian.V_VILLAGE_TOWN = value.V_VILLAGE_TOWN; //预警点所在乡镇街道
        markerYuJinDian.V_DENIZEN_COMM = value.V_DENIZEN_COMM; //预警点所在居民委员会
        markerYuJinDian.V07001 = value.V07001; //预警点海拔高度
        markerYuJinDian.x = x;
        markerYuJinDian.y = y;
        if (i == 0) {
          map.panTo(
            new SuperMap.LonLat(x, y).transform("EPSG:4326", "EPSG:900913")
          );
          map.setCenter(
            new SuperMap.LonLat(x, y).transform("EPSG:4326", "EPSG:900913"),
            4
          );
        }
        markers.addMarker(markerYuJinDian);
        $("body", parent.document)
          .find("#yujin_detail")
          .show();
      });
    },
    error: function() {}
  });
  //	layerFullScreen();
}
/**
 * 弹出窗口
 */
function openHpYjdView() {
  clearPopup();
  var marker = this;
  var V_DISA_TYPE = marker.V_DISA_TYPE; //灾种类形
  var V_P_NAME = marker.V_P_NAME; //省份
  var V_NAME = marker.V_NAME; //流域名称
  var V_CODE = marker.V_CODE; //流域代码
  var V_R_AREA = marker.V_R_AREA; //流域面积
  var V_Lat = marker.V_Lat; //经度
  var V_Lon = marker.V_Lon; //纬度
  var V01301_H = marker.V01301_H; //关联水文站
  var V01301_P = marker.V01301_P; //关联雨量站
  var V_REMARK = marker.V_REMARK; //致灾阈值确定方法
  var V_A_METHOD = marker.V_A_METHOD; //面雨量计算方法
  var V_ALARM_PLACE = marker.V_ALARM_PLACE; //预警点名称
  var V01301 = marker.V01301; //预警点代码
  var V_C_NAME = marker.V_C_NAME; //预警点所在市
  var V_CT_AL_NAME = marker.V_CT_AL_NAME; //预警点所在县
  var V_VILLAGE_TOWN = marker.V_VILLAGE_TOWN; //预警点所在乡镇街道
  var V_DENIZEN_COMM = marker.V_DENIZEN_COMM; //预警点所在居民委员会
  var V07001 = marker.V07001; //预警点海拔高度
  var x = marker.x;
  var y = marker.y;

  var contentHTML =
    "<div style='width:230px;height:115px; font-size:12px; opacity: 0.8'>";
  contentHTML +=
    "<div style=' font-size:14px; font-weight:bold ;color:#2476E3;border-bottom: 1px solid #E4E4E4;height:25px;line-height: 25px;'>" +
    (V_ALARM_PLACE == "" || V_ALARM_PLACE == undefined
      ? "-"
      : V_ALARM_PLACE + "&nbsp;") +
    "</div>";
  contentHTML += "<table style='text-align:left;margin-left:5px;'>";
  contentHTML +=
    "<tr><td style='width:130px;font-family:'微软雅黑 Regular''>预警点代码:</td><td>" +
    (V01301 == "" || V01301 == undefined ? "-" : V01301 + "") +
    "</td></tr>";
  contentHTML +=
    "<tr><td style='width:100px;'>省份:</td><td>" +
    (V_P_NAME == "" || V_P_NAME == undefined ? "-" : V_P_NAME + "") +
    "</td></tr>";
  contentHTML +=
    "<tr><td>灾种类形:</td><td>" +
    (V_DISA_TYPE == "" || V_DISA_TYPE == undefined ? "-" : V_DISA_TYPE + "") +
    "</td></tr>";
  contentHTML +=
    "<tr><td>预警点所在市:</td><td>" +
    (V_C_NAME == "" || V_C_NAME == undefined ? "-" : V_C_NAME + "") +
    "</td></tr>";
  contentHTML +=
    "<tr><td>预警点所在县:</td><td>" +
    (V_CT_AL_NAME == "" || V_CT_AL_NAME == undefined
      ? "-"
      : V_CT_AL_NAME + "") +
    "</td></tr>";
  contentHTML +=
    "<tr><td>预警点所在乡镇街道:</td><td>" +
    (V_VILLAGE_TOWN == "" || V_VILLAGE_TOWN == undefined
      ? "-"
      : V_VILLAGE_TOWN + "") +
    "</td></tr>";
  contentHTML +=
    "<tr><td>预警点所在居民委员会:</td><td>" +
    (V_DENIZEN_COMM == "" || V_DENIZEN_COMM == undefined
      ? "-"
      : V_DENIZEN_COMM + "") +
    "</td></tr>";
  contentHTML +=
    "<tr><td>预警点海拔高度:</td><td>" +
    (V07001 == "" || V07001 == undefined ? "-" : V07001 + "&nbsp;米") +
    "</td></tr>";
  contentHTML +=
    "<tr><td>致灾阈值确定方法:</td><td>" +
    (V_A_METHOD == "" || V_A_METHOD == undefined
      ? "-"
      : V_A_METHOD + "&nbsp;") +
    "</td></tr>";
  contentHTML +=
    "<tr><td>流域名称:</td><td>" +
    (V_NAME == "" || V_NAME == undefined ? "-" : V_NAME + "") +
    "</td></tr>";
  contentHTML +=
    "<tr><td>流域代码:</td><td>" +
    (V_CODE == "" || V_CODE == undefined ? "-" : V_CODE + "&nbsp;") +
    "</td></tr>";
  contentHTML +=
    "<tr><td>流域面积:</td><td>" +
    (V_R_AREA == "" || V_R_AREA == undefined
      ? "-"
      : V_R_AREA + "&nbsp;平方千米") +
    "</td></tr>";
  contentHTML += "</table>";
  contentHTML += "</div>";

  popup = new SuperMap.Popup.FramedCloud(
    "popwin",
    new SuperMap.LonLat(x, y).transform("EPSG:4326", "EPSG:900913"),
    null,
    contentHTML,
    null,
    true
  );
  map.addPopup(popup);
}

/**
 * 详细信息页面加载隐患点
 * @param data
 * area_code:V_M_CODE 中小河流代码
 */
function getHpYhdDetails(area_code) {
  $.ajax({
    async: true,
    cache: true,
    type: "POST",
    dataType: "json",
    url: "../getHpYhdDetails.do", //中小河流域对应的镇信息
    timeout: 60000,
    data: {
      vmcode: area_code
    },
    success: function(data) {
      if (data.length == 0) {
        return;
      }
      yh_markers = new SuperMap.Layer.Markers("隐患点", {});
      $.each(data, function(i, dataObj) {
        var x = dataObj.V06001_HIDD;
        var y = dataObj.V05001_HIDD;
        var V_HIDDEN_NAME = dataObj.V_HIDDEN_NAME; //隐患点名称
        var V_HIDD_HEIGHT = dataObj.V_HIDD_HEIGHT; //隐患点海拔
        var V_HIDD_POP = dataObj.V_HIDD_POP; //隐患点
        var V_HIDD_MEA = dataObj.V_HIDD_MEA; //防灾减灾措施
        //标记图层上添加标记
        var size = new SuperMap.Size(20, 20);
        var offset = new SuperMap.Pixel(-(size.w / 2), -size.h);
        var icon = new SuperMap.Icon("../images/yhd/nodata.png", size, offset);

        var marker = new SuperMap.Marker(
          new SuperMap.LonLat(x, y).transform("EPSG:4326", "EPSG:900913"),
          icon
        );
        marker.events.on({
          click: openHpYhdDetails
        });
        //参数
        marker.x = x;
        marker.y = y;
        marker.V_HIDDEN_NAME = V_HIDDEN_NAME;
        marker.V_HIDD_HEIGHT = V_HIDD_HEIGHT;
        marker.V_HIDD_POP = V_HIDD_POP;
        marker.V_HIDD_MEA = V_HIDD_MEA;

        yh_markers.addMarker(marker);
      });

      map.addLayer(yh_markers);
      $("body", parent.document)
        .find("#yinhuan_detail")
        .show();
    },
    error: function() {}
  });
  //	layerFullScreen();
}
function openHpYhdDetails() {
  clearPopup();
  var marker = this;
  var V_HIDDEN_NAME = marker.V_HIDDEN_NAME; //隐患点名称
  var V_HIDD_HEIGHT = marker.V_HIDD_HEIGHT; //隐患点海拔
  var V_HIDD_POP = marker.V_HIDD_POP; //隐患点
  var V_HIDD_MEA = marker.V_HIDD_MEA; //防灾减灾措施
  var x = marker.x; //危险品名称
  var y = marker.y; //防灾减灾措施
  var contentHTML =
    "<div style='width:220px;height:115px; font-size:12px; opacity: 0.8'>";
  contentHTML +=
    "<div style=' font-size:14px; font-weight:bold ;color:#2476E3;border-bottom: 1px solid #E4E4E4;height:25px;line-height: 25px;'>" +
    V_HIDDEN_NAME +
    "</div>";
  contentHTML += "<table style='text-align:left;margin-left:5px;'>";
  contentHTML +=
    "<tr><td style='width:100px;'>隐患点海拔:</td><td>" +
    (V_HIDD_HEIGHT == "" || V_HIDD_HEIGHT == undefined
      ? "-"
      : V_HIDD_HEIGHT + "&nbsp;千米") +
    "</td></tr>";
  contentHTML +=
    "<tr><td>涉及人口数:</td><td>" +
    (V_HIDD_POP == "" || V_HIDD_POP == undefined
      ? "-"
      : V_HIDD_POP + "&nbsp;人") +
    "</td></tr>";
  contentHTML +=
    "<tr><td>防灾减灾措施:</td><td>" +
    (V_HIDD_MEA == "" || V_HIDD_MEA == undefined
      ? "-"
      : V_HIDD_MEA + "&nbsp;") +
    "</td></tr>";
  contentHTML += "</table>";
  contentHTML += "</div>";

  popup = new SuperMap.Popup.FramedCloud(
    "popwin",
    new SuperMap.LonLat(x, y).transform("EPSG:4326", "EPSG:900913"),
    null,
    contentHTML,
    null,
    true
  );
  map.addPopup(popup);
}
