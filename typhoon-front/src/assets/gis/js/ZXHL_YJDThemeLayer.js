function ZXHL_YJD_Markers(data, hsleval, shixiao) {
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
      click: OpenYJDView
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
  layerFullScreen();
}
/**
 * 灾害信息
 * @param data
 */
function ZXHL_ZHXX_Markers(data) {
  //GoclearMarkers();

  //创建标记图层
  markers = new SuperMap.Layer.Markers("灾害信息", {});
  //循环遍历所有的隐患点数据
  $.each(data, function(i, dataObj) {
    var V_M_CODE = dataObj.V_M_CODE; ///洪水编码
    var V_CJ_STIME = dataObj.V_CJ_STIME; //开始时间
    var V_CJ_FTIME = dataObj.V_CJ_FTIME; //结束时间
    var V06001_CJ = dataObj.V06001_CJ; ///x
    var V05001_CJ = dataObj.V05001_CJ; ////y
    var V_CJ_NAME = dataObj.V_CJ_NAME; ////采集点名称
    if (i == 0) {
      map.setCenter(
        new SuperMap.LonLat(V06001_CJ, V05001_CJ).transform(
          "EPSG:4326",
          "EPSG:900913"
        ),
        6
      );
    }

    //标记图层上添加标记
    var size = new SuperMap.Size(20, 20);
    var offset = new SuperMap.Pixel(-(size.w / 2), -size.h);
    var icon = new SuperMap.Icon("../images/yhd/zxhl_zq.png", size, offset);
    var marker = new SuperMap.Marker(
      new SuperMap.LonLat(V06001_CJ, V05001_CJ).transform(
        "EPSG:4326",
        "EPSG:900913"
      ),
      icon
    );
    marker.events.on({
      click: OpenZHView
      //		   "scope": marker
    });

    marker.V_M_CODE = V_M_CODE;
    marker.V_CJ_STIME = V_CJ_STIME;
    marker.V_CJ_FTIME = V_CJ_FTIME;
    marker.V_CJ_NAME = V_CJ_NAME;
    marker.V06001_CJ = V06001_CJ;
    marker.V05001_CJ = V05001_CJ;

    markers.addMarker(marker);
  });

  //	console.log(markers);
  map.addLayer(markers);
  layerFullScreen();
}
var maparr = new Map();
function OpenYJDView() {
  clearPopup();
  var marker = this;
  var V_P_NAME = marker.V_P_NAME; //省
  var V_C_NAME = marker.V_C_NAME; //市
  var V_CT_AL_NAME = marker.V_CT_AL_NAME; //县
  var V_VILLAGE_TOWN = marker.V_VILLAGE_TOWN; //乡
  var V_DENIZEN_COMM = marker.V_DENIZEN_COMM; //村
  var D_ALARM_ID = marker.D_ALARM_ID;
  //	alert(D_ALARM_ID);
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
    url: "../getLevelAndDate.do",
    data: { alramcode: D_ALARM_ID, hsleval: hsleval, shixiao: shixiao },
    error: function() {},
    success: function(data) {
      maparr.clear();
      $.each(data, function(i, dataObj) {
        //	    		alert(dataObj.PRE_TIME+"-"+dataObj.LEVEL+"-------"+dataObj.HAZARD_PRE);
        maparr.put(dataObj.PRE_TIME + "-" + dataObj.LEVEL, dataObj.HAZARD_PRE); //HAZARD_PRE
        //	    		alert(dataObj.PRE_TIME+"-"+dataObj.LEVEL);
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
    //			var yuzhi = "<table style='text-align:left;'>" +
    //					"<tr><th></th><th width='50px'>1h</th><th width='50px'>3h</th><th width='50px'>6h</th><th width='50px'>12h</th><th width='50px'>24h</th></tr>" +
    //					"<tr><td style='font-weight:bold ;width:45px;'>一级</td><td>"+(maparr.get("1-1")==undefined||maparr.get("1-1")==""?"-":maparr.get("1-1"))+"</td><td>"+(maparr.get('3-1')==undefined||maparr.get('3-1')==""?"-":maparr.get("3-1"))+"</td><td>"+(maparr.get("6-1")==undefined||maparr.get("6-1")==""?"-":maparr.get("6-1"))+"</td><td>"+(maparr.get("12-1")==undefined||maparr.get("12-1")==""?"-":maparr.get("12-1"))+"</td><td>"+(maparr.get("24-1")==undefined||maparr.get("24-1")==""?"-":maparr.get("24-1"))+"</td></tr>" +
    //					"<tr><td style='font-weight:bold ;'>二级</td><td>"+(maparr.get("1-2")==undefined||maparr.get("1-2")==""?"-":maparr.get("1-2"))+"</td><td>"+(maparr.get("3-2")==undefined||maparr.get("3-2")==""?"-":maparr.get("3-2"))+"</td><td>"+(maparr.get("6-2")==undefined||maparr.get("6-2")==""?"-":maparr.get("6-2"))+"</td><td>"+(maparr.get("12-2")==undefined||maparr.get("12-2")==""?"-":maparr.get("12-2"))+"</td><td>"+(maparr.get("24-2")==undefined||maparr.get("24-2")==""?"-":maparr.get("24-2"))+"</td></tr>" +
    //					"<tr><td style='font-weight:bold ;'>三级</td><td>"+(maparr.get("1-3")==undefined||maparr.get("1-3")==""?"-":maparr.get("1-3"))+"</td><td>"+(maparr.get("3-3")==undefined||maparr.get("3-3")==""?"-":maparr.get("3-3"))+"</td><td>"+(maparr.get("6-3")==undefined||maparr.get("6-3")==""?"-":maparr.get("6-3"))+"</td><td>"+(maparr.get("12-3")==undefined||maparr.get("12-3")==""?"-":maparr.get("12-3"))+"</td><td>"+(maparr.get("24-3")==undefined||maparr.get("24-3")==""?"-":maparr.get("24-3"))+"</td></tr>" +
    //					"<tr><td style='font-weight:bold ;'>四级</td><td>"+(maparr.get("1-4")==undefined||maparr.get("1-4")==""?"-":maparr.get("1-4"))+"</td><td>"+(maparr.get("3-4")==undefined||maparr.get("3-4")==""?"-":maparr.get("3-4"))+"</td><td>"+(maparr.get("6-4")==undefined||maparr.get("6-4")==""?"-":maparr.get("6-4"))+"</td><td>"+(maparr.get("12-4")==undefined||maparr.get("12-4")==""?"-":maparr.get("12-4"))+"</td><td>"+(maparr.get("24-4")==undefined||maparr.get("24-4")==""?"-":maparr.get("24-4"))+"</td></tr>" +
    //					"</table>";
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
/**
 * 预警点弹窗样式（致灾零界雨量）
 * @param id
 */
function yuzhiinfo(id) {
  if (id == "baseinfo") {
    document.getElementById("baseinfo").style.display = "block";
    $("#baseinfo_but").css("background", "#E3F1BC");
    $("#yuzhiinfo_but").css("background", "");
    $("#yuliangdanwei").hide();
    document.getElementById("yuzhiinfo").style.display = "none";
  }
  if (id == "yuzhiinfo") {
    $("#yuzhiinfo_but").css("background", "#E3F1BC");
    $("#baseinfo_but").css("background", "");
    $("#yuliangdanwei").show();
    document.getElementById("yuzhiinfo").style.display = "block";
    document.getElementById("baseinfo").style.display = "none";
  }
}
//var maparr = new Map();
function OpenZHView() {
  clearPopup();
  var marker = this;
  var V_M_CODE = marker.V_M_CODE;
  var V_CJ_STIME = marker.V_CJ_STIME;
  var V_CJ_FTIME = marker.V_CJ_FTIME;
  var V_CJ_NAME = marker.V_CJ_NAME;
  var V06001_CJ = marker.V06001_CJ;
  var V05001_CJ = marker.V05001_CJ;
  var contentHTML =
    "<div style='width:200px;height:100px; font-size:12px; opacity: 0.8'>";
  contentHTML +=
    "<div style=' font-size:12px; font-weight:bold ;color:#2476E3;border-bottom: 1px solid #E4E4E4;height:25px;line-height: 25px;'>" +
    V_CJ_NAME +
    "</div>";
  contentHTML +=
    "<table style='margin:10px;text-align: left;'><tr><th>洪水编码:</th><td>" +
    V_M_CODE +
    "</td></tr>";
  contentHTML += "<tr><th>开始时间:</th><td>" + V_CJ_STIME + "</td></tr>";
  contentHTML += "<tr><th>结束时间:</th><td>" + V_CJ_FTIME + "</td></tr>";
  ("</table>");
  contentHTML += "</div>";

  popup = new SuperMap.Popup.FramedCloud(
    "popwin",
    new SuperMap.LonLat(V06001_CJ, V05001_CJ).transform(
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

/*function OpenYJDView(){

	clearPopup();
	var marker = this;
	var V_P_NAME = marker.V_P_NAME;
	var V_C_NAME = marker.V_C_NAME;
	var V_CT_AL_NAME = marker.V_CT_AL_NAME;
	var V_VILLAGE_TOWN = marker.V_VILLAGE_TOWN;
	var V_DENIZEN_COMM = marker.V_DENIZEN_COMM;
	var D_ALARM_ID = marker.D_ALARM_ID;
//	alert(D_ALARM_ID);
	var V_NAME = marker.V_NAME;
	var V_CODE = marker.V_CODE;
	var V06001 = marker.V06001;
	var V05001 = marker.V05001;
	var V_ALARM_PLACE = marker.V_ALARM_PLACE;
	
	var V01301 = marker.V01301;
	$.ajax({
	    async: false, 
	    cache: true,
	    type: "POST",
	    dataType:'json',
	    url:"../getLevelAndDate.do",
	    data:{"alramcode":D_ALARM_ID}, 
	    error: function() {
	    },
	    success: function(data){
	    	maparr.clear();
	    	$.each(data,function(i,dataObj){
//	    		alert(dataObj.PRE_TIME+"-"+dataObj.LEVEL+"-------"+dataObj.HAZARD_PRE);
	    		maparr.put(dataObj.PRE_TIME+"-"+dataObj.LEVEL,dataObj.HAZARD_PRE);//HAZARD_PRE
//	    		alert(dataObj.PRE_TIME+"-"+dataObj.LEVEL);
	    	})
	    }
	});

	var contentHTML = "<div style='width:231px;height:120px; font-size:12px; opacity: 0.8'>"; 
	contentHTML += "<div style=' font-size:12px; font-weight:bold ;color:#2476E3;border-bottom: 1px solid #E4E4E4;height:25px;line-height: 25px;'>"+V_ALARM_PLACE+"（<font size=1>雨量：毫米</font>）</div>";
	contentHTML += "<table style='text-align:left;'>" +
			"<tr><th></th><th width='50px'>1h</th><th width='50px'>3h</th><th width='50px'>6h</th><th width='50px'>12h</th><th width='50px'>24h</th></tr>" +
			"<tr><td style='font-weight:bold ;width:45px;'>一级</td><td>"+(maparr.get("1-1")==undefined||maparr.get("1-1")==""?"-":maparr.get("1-1"))+"</td><td>"+(maparr.get('3-1')==undefined||maparr.get('3-1')==""?"-":maparr.get("3-1"))+"</td><td>"+(maparr.get("6-1")==undefined||maparr.get("6-1")==""?"-":maparr.get("6-1"))+"</td><td>"+(maparr.get("12-1")==undefined||maparr.get("12-1")==""?"-":maparr.get("12-1"))+"</td><td>"+(maparr.get("24-1")==undefined||maparr.get("24-1")==""?"-":maparr.get("24-1"))+"</td></tr>" +
			"<tr><td style='font-weight:bold ;'>二级</td><td>"+(maparr.get("1-2")==undefined||maparr.get("1-2")==""?"-":maparr.get("1-2"))+"</td><td>"+(maparr.get("3-2")==undefined||maparr.get("3-2")==""?"-":maparr.get("3-2"))+"</td><td>"+(maparr.get("6-2")==undefined||maparr.get("6-2")==""?"-":maparr.get("6-2"))+"</td><td>"+(maparr.get("12-2")==undefined||maparr.get("12-2")==""?"-":maparr.get("12-2"))+"</td><td>"+(maparr.get("24-2")==undefined||maparr.get("24-2")==""?"-":maparr.get("24-2"))+"</td></tr>" +
			"<tr><td style='font-weight:bold ;'>三级</td><td>"+(maparr.get("1-3")==undefined||maparr.get("1-3")==""?"-":maparr.get("1-3"))+"</td><td>"+(maparr.get("3-3")==undefined||maparr.get("3-3")==""?"-":maparr.get("3-3"))+"</td><td>"+(maparr.get("6-3")==undefined||maparr.get("6-3")==""?"-":maparr.get("6-3"))+"</td><td>"+(maparr.get("12-3")==undefined||maparr.get("12-3")==""?"-":maparr.get("12-3"))+"</td><td>"+(maparr.get("24-3")==undefined||maparr.get("24-3")==""?"-":maparr.get("24-3"))+"</td></tr>" +
			"<tr><td style='font-weight:bold ;'>四级</td><td>"+(maparr.get("1-4")==undefined||maparr.get("1-4")==""?"-":maparr.get("1-4"))+"</td><td>"+(maparr.get("3-4")==undefined||maparr.get("3-4")==""?"-":maparr.get("3-4"))+"</td><td>"+(maparr.get("6-4")==undefined||maparr.get("6-4")==""?"-":maparr.get("6-4"))+"</td><td>"+(maparr.get("12-4")==undefined||maparr.get("12-4")==""?"-":maparr.get("12-4"))+"</td><td>"+(maparr.get("24-4")==undefined||maparr.get("24-4")==""?"-":maparr.get("24-4"))+"</td></tr>" +
			"</table>";
	contentHTML += "</div>";

    popup = new SuperMap.Popup.FramedCloud("popwin",
               new SuperMap.LonLat(V06001,V05001).transform("EPSG:4326","EPSG:900913"),
               null,
               contentHTML,
               null,
               true);
    map.addPopup(popup);

}*/
function YJD_dingwei(v1, v2, v3, v4, v5, v6, v7, v8, v9, v10, v11) {
  //创建标记图层
  var dw_markers = new SuperMap.Layer.Markers("定位点", {});

  var V_HIDDEN_NAME = v1; //隐患点名称
  var V_HIDD_LON = v2; //经度
  var V_HIDD_LAT = v3; //纬度
  var V_HIDD_HEIGHT = v4; //海拔高度
  var V_HIDD_POP = v5; //人数

  var V_HIDD_ETYPE = v6; //隐患点类型
  var V_HIDD_EA = v7; //固定资产
  var V_HIDD_DGN = v8; //危险品名称
  var V_RZ_PLANTTYPE = v9; //主要作物类型
  var V_ARG_AREA = v10; //耕种面积

  var V_HIDD_MEA = v11; //防灾减灾措施

  var HIDD_LON = v2; //经度
  var HIDD_LAT = v3; //纬度

  //	console.log(v2+"--"+v3);

  var LON = V_HIDD_LON.replace("°", ".")
    .replace("′", "")
    .replace("″", "");
  var LAT = V_HIDD_LAT.replace("°", ".")
    .replace("′", "")
    .replace("″", "");

  //标记图层上添加标记
  var size = new SuperMap.Size(21, 25);
  var offset = new SuperMap.Pixel(-(size.w / 2), -size.h);
  var icon = new SuperMap.Icon("../image/p1.png", size, offset);

  var marker = new SuperMap.Marker(
    new SuperMap.LonLat(LON, LAT).transform("EPSG:4326", "EPSG:900913"),
    icon
  );
  marker.events.on({
    click: OpenYHDView
    //	   "scope": marker
  });

  marker.V_HIDDEN_NAME = V_HIDDEN_NAME;
  marker.V_HIDD_LON = HIDD_LON;
  marker.V_HIDD_LAT = HIDD_LAT;
  marker.V_HIDD_HEIGHT = V_HIDD_HEIGHT;
  marker.V_HIDD_POP = V_HIDD_POP;

  marker.V_HIDD_ETYPE = V_HIDD_ETYPE;
  marker.V_HIDD_EA = V_HIDD_EA;
  marker.V_HIDD_DGN = V_HIDD_DGN;
  marker.V_RZ_PLANTTYPE = V_RZ_PLANTTYPE;
  marker.V_ARG_AREA = V_ARG_AREA;

  marker.V_HIDD_MEA = V_HIDD_MEA;

  dw_markers.addMarker(marker);

  map.addLayer(dw_markers);
  map.setCenter(
    new SuperMap.LonLat(LON, LAT).transform("EPSG:4326", "EPSG:900913"),
    9
  );
}
function Map() {
  this.elements = new Array();

  //获取MAP元素个数
  this.size = function() {
    return this.elements.length;
  };

  //判断MAP是否为空
  this.isEmpty = function() {
    return this.elements.length < 1;
  };

  //删除MAP所有元素
  this.clear = function() {
    this.elements = new Array();
  };

  //向MAP中增加元素（key, value)
  this.put = function(_key, _value) {
    this.elements.push({
      key: _key,
      value: _value
    });
  };

  //删除指定KEY的元素，成功返回True，失败返回False
  this.removeByKey = function(_key) {
    var bln = false;
    try {
      for (i = 0; i < this.elements.length; i++) {
        if (this.elements[i].key == _key) {
          this.elements.splice(i, 1);
          return true;
        }
      }
    } catch (e) {
      bln = false;
    }
    return bln;
  };

  //删除指定VALUE的元素，成功返回True，失败返回False
  this.removeByValue = function(_value) {
    //removeByValueAndKey
    var bln = false;
    try {
      for (i = 0; i < this.elements.length; i++) {
        if (this.elements[i].value == _value) {
          this.elements.splice(i, 1);
          return true;
        }
      }
    } catch (e) {
      bln = false;
    }
    return bln;
  };

  //删除指定VALUE的元素，成功返回True，失败返回False
  this.removeByValueAndKey = function(_key, _value) {
    var bln = false;
    try {
      for (i = 0; i < this.elements.length; i++) {
        if (this.elements[i].value == _value && this.elements[i].key == _key) {
          this.elements.splice(i, 1);
          return true;
        }
      }
    } catch (e) {
      bln = false;
    }
    return bln;
  };

  //获取指定KEY的元素值VALUE，失败返回NULL
  this.get = function(_key) {
    try {
      for (i = 0; i < this.elements.length; i++) {
        if (this.elements[i].key == _key) {
          return this.elements[i].value;
        }
      }
    } catch (e) {
      return false;
    }
    return false;
  };

  //获取指定索引的元素（使用element.key，element.value获取KEY和VALUE），失败返回NULL
  this.element = function(_index) {
    if (_index < 0 || _index >= this.elements.length) {
      return null;
    }
    return this.elements[_index];
  };

  //判断MAP中是否含有指定KEY的元素
  this.containsKey = function(_key) {
    var bln = false;
    try {
      for (i = 0; i < this.elements.length; i++) {
        if (this.elements[i].key == _key) {
          bln = true;
        }
      }
    } catch (e) {
      bln = false;
    }
    return bln;
  };

  //判断MAP中是否含有指定VALUE的元素
  this.containsValue = function(_value) {
    var bln = false;
    try {
      for (i = 0; i < this.elements.length; i++) {
        if (this.elements[i].value == _value) {
          bln = true;
        }
      }
    } catch (e) {
      bln = false;
    }
    return bln;
  };

  //判断MAP中是否含有指定VALUE的元素
  this.containsObj = function(_key, _value) {
    var bln = false;
    try {
      for (i = 0; i < this.elements.length; i++) {
        if (this.elements[i].value == _value && this.elements[i].key == _key) {
          bln = true;
        }
      }
    } catch (e) {
      bln = false;
    }
    return bln;
  };

  //获取MAP中所有VALUE的数组（ARRAY）
  this.values = function() {
    var arr = new Array();
    for (i = 0; i < this.elements.length; i++) {
      arr.push(this.elements[i].value);
    }
    return arr;
  };

  //获取MAP中所有VALUE的数组（ARRAY）
  this.valuesByKey = function(_key) {
    var arr = new Array();
    for (i = 0; i < this.elements.length; i++) {
      if (this.elements[i].key == _key) {
        arr.push(this.elements[i].value);
      }
    }
    return arr;
  };

  //获取MAP中所有KEY的数组（ARRAY）
  this.keys = function() {
    var arr = new Array();
    for (i = 0; i < this.elements.length; i++) {
      arr.push(this.elements[i].key);
    }
    return arr;
  };

  //获取key通过value
  this.keysByValue = function(_value) {
    var arr = new Array();
    for (i = 0; i < this.elements.length; i++) {
      if (_value == this.elements[i].value) {
        arr.push(this.elements[i].key);
      }
    }
    return arr;
  };

  //获取MAP中所有KEY的数组（ARRAY）
  this.keysRemoveDuplicate = function() {
    var arr = new Array();
    for (i = 0; i < this.elements.length; i++) {
      var flag = true;
      for (var j = 0; j < arr.length; j++) {
        if (arr[j] == this.elements[i].key) {
          flag = false;
          break;
        }
      }
      if (flag) {
        arr.push(this.elements[i].key);
      }
    }
    return arr;
  };
}
