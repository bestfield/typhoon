var zxhldetailsvectorLayer = null,
  zxhldetailslayer = null;
var stylecy = {
    strokeColor: "#F4F4ED",
    strokeWidth: 1,
    fillColor: "#DF5200",
    fillOpacity: "0.4"
  },
  cyurl1 = path + "/iserver/services/map-china/rest/maps/merge", //行政区划图层
  cyurl2 = path + "/iserver/services/data-china/rest/data"; //行政区划数据图层
/**
 * 初始化风险普查-基本信息遮罩图层
 */
function initcyfengduan() {
  cylayer = new SuperMap.Layer.TiledDynamicRESTLayer(
    "chinamerge",
    cyurl1,
    { transparent: true, cacheEnabled: true },
    { maxResolution: "auto" }
  );
  cylayer.events.on({
    layerInitialized: addcyLayer
  });
  cyvectorLayer = new SuperMap.Layer.Vector("中小河流行政区划图层");
}
function addcyLayer() {
  map.addLayers([cyvectorLayer]);
}
/************************************************************************************************************************************************
 * 风险普查-中小河流乡镇区划图层初始化
 */
function initzxhldetails() {
  zxhldetailslayer = new SuperMap.Layer.TiledDynamicRESTLayer(
    "detailsmerge",
    cyurl1,
    { transparent: true, cacheEnabled: true },
    { maxResolution: "auto" }
  );
  zxhldetailslayer.events.on({
    layerInitialized: addzxhldetailsLayer
  });
  zxhldetailsvectorLayer = new SuperMap.Layer.Vector(
    "中小河流详情行政区划图层"
  );
}
function addzxhldetailsLayer() {
  map.addLayers([zxhldetailsvectorLayer]);
}
/**
 * 通过SQL语句查询中小河流乡镇区划对应范围
 * 查询的是流域图层
 */
function getzxhldetailsFeaturesBySQL(liuyuCode) {
  //	selectZXHLDetails();
  clearzxhldetailsvectorLayer();
  var getFeatureParam, getFeatureBySQLService, getFeatureBySQLParams;
  if (liuyuCode == "") {
    getFeatureParam = new SuperMap.REST.FilterParameter({
      name: "merge@china",
      attributeFilter: "SMID<1 "
    });
  } else {
    getFeatureParam = new SuperMap.REST.FilterParameter({
      name: "merge@china",
      attributeFilter: "CODE = '" + liuyuCode + "'"
      //				,attributeFilter: " SMID>1 "
    });
  }
  getFeatureBySQLParams = new SuperMap.REST.GetFeaturesBySQLParameters({
    queryParameter: getFeatureParam,
    datasetNames: ["china:merge"]
  });
  getFeatureBySQLService = new SuperMap.REST.GetFeaturesBySQLService(cyurl2, {
    eventListeners: {
      processCompleted: Completedzxhldetails,
      processFailed: processFailedzxhldetails
    }
  });
  getFeatureBySQLService.processAsync(getFeatureBySQLParams);
}
function Completedzxhldetails(getFeaturesEventArgszxhldetails) {
  var i,
    len,
    features,
    feature,
    result = getFeaturesEventArgszxhldetails.result;
  if (result && result.features) {
    features = result.features;
    for (i = 0, len = features.length; i < len; i++) {
      feature = features[i];
      if (i == 0) {
        var lonlat = feature.geometry.getCentroid();
        map.setCenter(new SuperMap.LonLat(lonlat.x, lonlat.y), 6);
      }
      //	feature.style = stylecy;
      //	alert(feature.attributes.流域编码);
      //	 feature.geometry.components[i].transform("EPSG:4326","EPSG:900913");
      feature.style = {
        strokeColor: "#F4F4ED",
        strokeWidth: 1,
        label: feature.data.NAME,
        //fontWeight:"bold",
        fontSize: "12px",
        fillColor: "#DF5200",
        fillOpacity: "0.5"
      };
      zxhldetailsvectorLayer.addFeatures(feature);
    }
  }
}
function processFailedzxhldetails(e) {
  alert(e.error.errorMsg);
}
function clearzxhldetailsvectorLayer() {
  if (zxhldetailsvectorLayer) {
    //先清除上次的显示结果
    zxhldetailsvectorLayer.removeAllFeatures();
    zxhldetailsvectorLayer.refresh();
  }
}
/************************************************************************************************************************************************/
/**风险普查--基础信息
 * 地图上标记中小河流河口位置
 */
function getHeKouMarkers(data) {
  //河口位置点
  markers = new SuperMap.Layer.Markers("河口位置", {});
  map.addLayer(markers);
  $.each(data, function(i, value) {
    //MAP
    var x = value.V06001_MS; //河口位置纬度（度）
    var y = value.V05001_MS; //河口位置纬度
    if (x == null || y == null || x == 0 || y == 0) {
      return true;
    }
    var size = new SuperMap.Size(20, 20);
    var offset = new SuperMap.Pixel(-(size.w / 2), -size.h);
    var icon = new SuperMap.Icon("../images/gis/hekou.png", size, offset);
    var markerhekou = new SuperMap.Marker(
      new SuperMap.LonLat(x, y).transform("EPSG:4326", "EPSG:900913"),
      icon
    );
    markerhekou.events.on({
      click: heKouwino
      //			   "scope": marker
    });

    markerhekou.V_T_CODE = value.V_T_CODE; //乡镇代码
    markerhekou.V_M_ORISITE = value.V_M_ORISITE; //河源位置
    markerhekou.V_R_AREA = value.V_R_AREA; //流域面积(km2)
    markerhekou.V_R_POP = value.V_R_POP; //流域内人口(人口)
    markerhekou.V_M_LENGTH = value.V_M_LENGTH; //河流长度(km)
    markerhekou.V_O_GDP = value.V_O_GDP; //地 区 内生产 总 值(万元)
    markerhekou.V_Cross_Type = value.V_Cross_Type; //跨界类型
    markerhekou.V_M_ESTSITE = value.V_M_ESTSITE; //河口
    markerhekou.V_M_CODE = value.V_M_CODE; //中小河流代码
    markerhekou.V_M_NAME = value.V_M_NAME; //中小河流名称

    markerhekou.x = x;
    markerhekou.y = y;

    if (i == 0) {
      map.panTo(
        new SuperMap.LonLat(x, y).transform("EPSG:4326", "EPSG:900913")
      );
      map.setCenter(
        new SuperMap.LonLat(x, y).transform("EPSG:4326", "EPSG:900913"),
        6
      );
    }
    markers.addMarker(markerhekou);
  });
  layerFullScreen();
}
function heKouwino() {
  var marker = this;
  closeInfoWinzxhl();
  var contentHTML =
    "<div style='width:400px;height:120px; font-size:12px; opacity: 0.8'>";
  contentHTML +=
    "<div style=' font-size:14px; font-weight:bold ;color:#2476E3;border-bottom: 1px solid #E4E4E4;height:25px;line-height: 25px;' title='" +
    marker.V_M_NAME +
    "'>" +
    marker.V_M_NAME +
    "</div>";
  contentHTML += "<table>";
  contentHTML +=
    "<tr><th width='110px'>跨界类型：</th><td width='110px'>" +
    (marker.V_Cross_Type == undefined ? "" : marker.V_Cross_Type) +
    "</td>";
  contentHTML +=
    "<th width='110px'>河源位置：</th><td width='110px'>" +
    (marker.V_M_ORISITE == undefined ? "" : marker.V_M_ORISITE) +
    "</td></tr>";
  contentHTML +=
    "<tr><th width='110px'>河口经度(度)：</th><td width='110px'>" +
    (marker.x == undefined ? "" : marker.x) +
    "</td>";
  contentHTML +=
    "<th width='110px'>河口纬度(度)：</th><td width='110px'>" +
    (marker.y == undefined ? "" : marker.y) +
    "</td></tr>";
  contentHTML +=
    "<tr><th width='110px'>中小河流代码：</th><td width='110px'>" +
    (marker.V_M_CODE == undefined ? "" : marker.V_M_CODE) +
    "</td>";
  contentHTML +=
    "<th width='110px'>河口名称：</th><td width='110px'>" +
    (marker.V_M_ESTSITE == undefined ? "" : marker.V_M_ESTSITE) +
    "</td></tr>";
  contentHTML += "<tr><th>流域面积(km2)：</th><td>" + marker.V_R_AREA + "</td>";
  contentHTML +=
    "<th>流域内人口(人)：</th><td>" + marker.V_R_POP + "</td></tr>";
  contentHTML +=
    "<tr><th>河流长度(km)：</th><td>" + marker.V_M_LENGTH + "</td>";
  contentHTML +=
    "<th>地区内生产总值(万元)：</th><td>" +
    (marker.V_O_GDP == undefined ? "-" : marker.V_O_GDP + "") +
    "</td></tr>";
  contentHTML +=
    "<tr><th>河源位置名称：</th><td>" +
    marker.V_M_ORISITE +
    "</td><td></td><tr>";
  contentHTML +=
    "<tr><td></td><td></td><td></td><td style='text-align:right;'><a href='../risksurveydetails.html?vmcode=" +
    marker.V_M_CODE +
    "' target='_blank'>详情</a></td></tr>";
  contentHTML += "</table>";
  contentHTML += "</div>";
  popup = new SuperMap.Popup.FramedCloud(
    "popwin",
    new SuperMap.LonLat(marker.x, marker.y).transform(
      "EPSG:4326",
      "EPSG:900913"
    ),
    //				           new SuperMap.LonLat(LON,LAT).transform("EPSG:4326","EPSG:900913"),
    null,
    contentHTML,
    null,
    true
  );
  infowin = popup;
  map.addPopup(popup);
}
/*******************************************************************
 * 详细信息页面标注河口位置
 * vmcode:中小河流编码，流域编码
 */
function HeYuKouanWeiZidetails(vmcode) {
  $.ajax({
    async: false,
    cache: true,
    type: "POST",
    dataType: "json",
    url: "../getHeYuKouanWeiZidetails.do",
    timeout: 1000,
    data: {
      vmcode: vmcode
    },
    success: function(data) {
      getHeKouHeYuanMarkers(data);
    },
    error: function() {}
  });
}
function getHeKouHeYuanMarkers(data) {
  console.log(data);
  //河源与河口位置
  markers = new SuperMap.Layer.Markers("河源与河口位置", {});
  map.addLayer(markers);
  $.each(data, function(i, value) {
    var size = new SuperMap.Size(25, 40);
    var offset = new SuperMap.Pixel(-(size.w / 2), -size.h);
    var icon_hekou = new SuperMap.Icon(
      "../images/gis/yjd/hekou.png",
      size,
      offset
    );
    var icon_heyuan = new SuperMap.Icon(
      "../images/gis/yjd/heyuan.png",
      size,
      offset
    );

    var x = value.V06001_MS;
    var y = value.V05001_MS;

    //MAP河源坐标
    var yx = value.V06001_MO;
    var yy = value.V05001_MO;
    //河口点
    var markerheyuan = new SuperMap.Marker(
      new SuperMap.LonLat(yx, yy).transform("EPSG:4326", "EPSG:900913"),
      icon_heyuan
    );
    markerheyuan.events.on({
      click: ZXHLDETAILSWindow
    });

    //河源点
    var markerhekou = new SuperMap.Marker(
      new SuperMap.LonLat(x, y).transform("EPSG:4326", "EPSG:900913"),
      icon_hekou
    );
    markerhekou.events.on({
      click: ZXHLDETAILSWindow
    });
    //河口
    markerhekou.V_M_ESTSITE = value.V_M_ESTSITE; //河口位置名称
    markerhekou.V06001_MS = value.V06001_MS; //河 口 位 置 经 度
    markerhekou.V05001_MS = value.V05001_MS; //河 口 位 置 纬 度(度)
    markerhekou.V_M_SG_HEIGHT = value.V_M_SG_HEIGHT; //河口位置海拔高度（米）
    markerhekou.V_M_SG_Lon = value.V_M_SG_Lon; //河口位置经度o
    markerhekou.V_M_SG_Lat = value.V_M_SG_Lat; //河口位置纬度o
    markerhekou.BJ = "hekou";
    //MAP河口坐标
    markerhekou.x = x;
    markerhekou.y = y;
    //河源
    markerheyuan.V_M_ORISITE = value.V_M_ORISITE; //河源位置名称
    markerheyuan.V_M_ORI_Lon = value.V_M_ORI_Lon; //河源位置经度
    markerheyuan.V_M_ORI_Lat = value.V_M_ORI_Lat; //河源位置纬度
    markerheyuan.V_M_ORI_Height = value.V_M_ORI_Height; //河源位置海拔高度（米）
    markerheyuan.V06001_MO = value.V06001_MO; //河源位置 经 度
    markerheyuan.V05001_MO = value.V05001_MO; //河源位置  纬 度(度)
    markerheyuan.BJ = "heyuan";
    //MAP河坐标
    markerheyuan.x = yx;
    markerheyuan.y = yy;
    //公共
    markerheyuan.V_M_CODE = markerhekou.V_M_CODE = value.V_M_CODE; //中小河流代码
    markerheyuan.V_Cross_Type = markerhekou.V_Cross_Type = value.V_Cross_Type; //跨界类型
    markerheyuan.V_R_AREA = markerhekou.V_R_AREA = value.V_R_AREA; //流域面积
    markerheyuan.V_R_POP = markerhekou.V_R_POP = value.V_R_POP; //流域内人口
    markerheyuan.V_M_LENGTH = markerhekou.V_M_LENGTH = value.V_M_LENGTH; //河流长度
    markerheyuan.V_M_SDIR = markerhekou.V_M_SDIR = value.V_M_SDIR; //最大安全最 大安 全 泄 量(m3/s)
    markerheyuan.V_M_CS_NAME = markerhekou.V_M_CS_NAME = value.V_M_CS_NAME; //流域内控制站名称

    if (i == 0) {
      map.panTo(
        new SuperMap.LonLat(x, y).transform("EPSG:4326", "EPSG:900913")
      );
      map.setCenter(
        new SuperMap.LonLat(x, y).transform("EPSG:4326", "EPSG:900913"),
        4
      );
    }
    markers.addMarker(markerhekou);
    markers.addMarker(markerheyuan);
  });
}
/**
 * 河口河源弹窗-详细信息
 */
function ZXHLDETAILSWindow() {
  clearPopup();
  var marker = this;
  var V_Cross_Type = marker.V_Cross_Type; //跨界类型
  var V_R_AREA = marker.V_R_AREA; //流域面积
  var V_R_POP = marker.V_R_POP; //流域内人口
  var V_M_LENGTH = marker.V_M_LENGTH; //河流长度
  var V_M_ORISITE = marker.V_M_ORISITE; //河源位置名称
  var V_M_ORI_Lon = marker.V_M_ORI_Lon; //河源位置经度
  var V_M_ORI_Lat = marker.V_M_ORI_Lat; //河源位置纬度
  var V_M_ORI_Height = marker.V_M_ORI_Height; //河源位置海拔高度（米）
  var V_M_ESTSITE = marker.V_M_ESTSITE; //河口位置名称xx
  var V_M_SG_Lon = marker.V_M_SG_Lon; //河口位置经度o
  var V_M_SG_Lat = marker.V_M_SG_Lat; //河口位置纬度o
  var V_M_SG_HEIGHT = marker.V_M_SG_HEIGHT; //河口位置海拔高度（米）
  var V_M_SDIR = marker.V_M_SDIR; //最 大安 全 泄 量(m3/s)
  var V_M_CS_NAME = marker.V_M_CS_NAME; //流域内控制站名称
  var x = marker.x; //危险品名称
  var y = marker.y; //防灾减灾措施
  var contentHTML = "";
  if (marker.BJ == "hekou") {
    contentHTML =
      "<div style='width:220px;height:115px; font-size:12px; opacity: 0.8'>";
    contentHTML +=
      "<div style=' font-size:14px; font-weight:bold ;color:#2476E3;border-bottom: 1px solid #E4E4E4;height:25px;line-height: 25px;'>" +
      V_M_ESTSITE +
      "</div>";
    contentHTML += "<table style='text-align:left;margin-left:5px;'>";
    contentHTML +=
      "<tr><td style='width:110px;'>跨界类型:</td><td>" +
      (V_Cross_Type == "" || V_Cross_Type == undefined
        ? "-"
        : V_Cross_Type + "&nbsp;") +
      "</td></tr>";
    contentHTML +=
      "<tr><td style='width:100px;'>河口位置经度:</td><td>" +
      (V_M_SG_Lon == "" || V_M_SG_Lon == undefined
        ? "-"
        : V_M_SG_Lon + "&nbsp;") +
      "</td></tr>";
    contentHTML +=
      "<tr><td>河口位置纬度:</td><td>" +
      (V_M_SG_Lat == "" || V_M_SG_Lat == undefined
        ? "-"
        : V_M_SG_Lat + "&nbsp;") +
      "</td></tr>";
    contentHTML +=
      "<tr><td>河口位置海拔高度:</td><td>" +
      (V_M_SG_HEIGHT == "" || V_M_SG_HEIGHT == undefined
        ? "-"
        : V_M_SG_HEIGHT + "&nbsp;米") +
      "</td></tr>";
    contentHTML +=
      "<tr><td>流域面积:</td><td>" +
      (V_R_AREA == "" || V_R_AREA == undefined
        ? "-"
        : V_R_AREA + "&nbsp;平方千米") +
      "</td></tr>";
    contentHTML +=
      "<tr><td>流域内人口:</td><td>" +
      (V_R_POP == "" || V_R_POP == undefined ? "-" : V_R_POP + "&nbsp;人") +
      "</td></tr>";
    contentHTML +=
      "<tr><td>最大安全泄量:</td><td>" +
      (V_M_SDIR == "" || V_M_SDIR == undefined
        ? "-"
        : V_M_SDIR + "&nbsp;m3/s") +
      "</td></tr>";
    contentHTML +=
      "<tr><td>流域内控制站名称:</td><td>" +
      (V_M_CS_NAME == "" || V_M_CS_NAME == undefined
        ? "-"
        : V_M_CS_NAME + "&nbsp;") +
      "</td></tr>";
    contentHTML += "</table>";
    contentHTML += "</div>";
  } else if (marker.BJ == "heyuan") {
    contentHTML =
      "<div style='width:220px;height:115px; font-size:12px; opacity: 0.8'>";
    contentHTML +=
      "<div style=' font-size:14px; font-weight:bold ;color:#2476E3;border-bottom: 1px solid #E4E4E4;height:25px;line-height: 25px;'>" +
      V_M_ORISITE +
      "</div>";
    contentHTML += "<table style='text-align:left;margin-left:5px;'>";
    contentHTML +=
      "<tr><td style='width:110px;'>跨界类型:</td><td>" +
      (V_Cross_Type == "" || V_Cross_Type == undefined
        ? "-"
        : V_Cross_Type + "&nbsp;") +
      "</td></tr>";
    contentHTML +=
      "<tr><td style='width:100px;'>河源位置经度:</td><td>" +
      (V_M_ORI_Lon == "" || V_M_ORI_Lon == undefined
        ? "-"
        : V_M_ORI_Lon + "&nbsp;") +
      "</td></tr>";
    contentHTML +=
      "<tr><td>河源位置纬度:</td><td>" +
      (V_M_ORI_Lat == "" || V_M_ORI_Lat == undefined
        ? "-"
        : V_M_ORI_Lat + "&nbsp;") +
      "</td></tr>";
    contentHTML +=
      "<tr><td>河源位置海拔高度:</td><td>" +
      (V_M_ORI_Height == "" || V_M_ORI_Height == undefined
        ? "-"
        : V_M_ORI_Height + "&nbsp;米") +
      "</td></tr>";
    contentHTML +=
      "<tr><td>流域面积:</td><td>" +
      (V_R_AREA == "" || V_R_AREA == undefined
        ? "-"
        : V_R_AREA + "&nbsp;平方千米") +
      "</td></tr>";
    contentHTML +=
      "<tr><td>流域内人口:</td><td>" +
      (V_R_POP == "" || V_R_POP == undefined ? "-" : V_R_POP + "&nbsp;人") +
      "</td></tr>";
    contentHTML +=
      "<tr><td>最大安全泄量:</td><td>" +
      (V_M_SDIR == "" || V_M_SDIR == undefined
        ? "-"
        : V_M_SDIR + "&nbsp;m3/s") +
      "</td></tr>";
    contentHTML +=
      "<tr><td>流域内控制站名称:</td><td>" +
      (V_M_CS_NAME == "" || V_M_CS_NAME == undefined
        ? "-"
        : V_M_CS_NAME + "&nbsp;") +
      "</td></tr>";
    contentHTML += "</table>";
    contentHTML += "</div>";
  }

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
 * 中小河流详细信息页-预警点
 * SELECT * FROM DISA_BAS_META_DIC aa where aa.V_DISA_TYPE ='中小河流' and v_code ='GB104533'
 */
function getYuJinDianDetails(vmcode) {
  //预警点位置
  markers = new SuperMap.Layer.Markers("预警点位置", {});
  map.addLayer(markers);

  $.ajax({
    async: false,
    cache: true,
    type: "POST",
    dataType: "json",
    url: "../getYuJinDianDetails.do",
    timeout: 1000,
    data: {
      vmcode: vmcode
    },
    success: function(data) {
      $.each(data, function(i, value) {
        var size = new SuperMap.Size(20, 20);
        var offset = new SuperMap.Pixel(-(size.w / 2), -size.h);
        var icon_yjd = new SuperMap.Icon(
          "../images/gis/yjd/yj.png",
          size,
          offset
        );

        //MAP河源坐标
        var x = value.V06001; //河 口 位 置 经 度
        var y = value.V05001; //河 口 位 置 纬 度(度)
        //河源点
        var markerYuJinDian = new SuperMap.Marker(
          new SuperMap.LonLat(x, y).transform("EPSG:4326", "EPSG:900913"),
          icon_yjd
        );
        markerYuJinDian.events.on({
          click: yuJinDianWindow
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
      });
    },
    error: function() {}
  });
  layerFullScreen();
}
/**
 * 弹出窗口
 */
function yuJinDianWindow() {
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
/*****************************************************************************************************************************
 * 查询对应的地块
 * 按县级行政区划查询
 */
function getFeaturesBySQLcy(name, liuyuCode, y) {
  clearFeaturescy();

  var getFeatureParam, getFeatureBySQLService, getFeatureBySQLParams;
  if (liuyuCode == "") {
    getFeatureParam = new SuperMap.REST.FilterParameter({
      name: "merge@china", //china
      attributeFilter: "SMID<1 "
    });
  } else {
    getFeatureParam = new SuperMap.REST.FilterParameter({
      name: "merge@china", //china
      attributeFilter: "CODE in(" + liuyuCode + ") "
    });
  }

  getFeatureBySQLParams = new SuperMap.REST.GetFeaturesBySQLParameters({
    queryParameter: getFeatureParam,
    datasetNames: ["china:merge"]
  });
  getFeatureBySQLService = new SuperMap.REST.GetFeaturesBySQLService(cyurl2, {
    eventListeners: {
      processCompleted: Completedcy,
      processFailed: processFailedcy
    }
  });

  getFeatureBySQLService.processAsync(getFeatureBySQLParams);
  layerFullScreen();
}

function Completedcy(getFeaturesEventArgs) {
  var area_code = "";
  var i,
    len,
    features,
    feature,
    result = getFeaturesEventArgs.result;

  if (result && result.features) {
    features = result.features;

    for (i = 0, len = features.length; i < len; i++) {
      feature = features[i];

      if (i == 0) {
        var lonlat = feature.geometry.getCentroid();
        map.setCenter(new SuperMap.LonLat(lonlat.x, lonlat.y), 6);
        if (area_code == "") {
          area_code = "'" + feature.attributes.CODE + "'";
        }
      }
      /*  for(var num=0;num<feature.geometry.components.length;num++){
		        feature.geometry.components[num].transform("EPSG:4326","EPSG:900913");
		    	feature.style = stylecy;
		        if(area_code == ""){
		        	area_code += "'"+feature.attributes.流域编码+"'";
		        }else{
		        	area_code += ",'"+feature.attributes.流域编码+"'";
		        }

				cyvectorLayer.addFeatures(feature);
		    }*/
      feature.style = {
        strokeColor: "#F4F4ED",
        strokeWidth: 1,
        label: feature.data.NAME,
        // 					fontWeight:"bold",
        fontSize: "12px",
        fillColor: "#DF5200",
        fillOpacity: "0.5"
      };
      cyvectorLayer.addFeatures(feature);
    }
    selectZXHL();

    //基本信息加点
    //		$.ajax({
    //	        async: false,
    //	        cache: true,
    //	        type: "POST",
    //	        dataType:'json',
    //	        url:"../getZXHLxz.do",//中小河流域对应的镇信息
    //	        timeout: 1000,
    //	        data:{
    //	        	area_code:area_code
    //	        },
    //	        success: function(data){
    //	        	var x=1;
    //	        	$.each(data.data,function(i,dataObj){
    //	        		var V06001_T = dataObj.V06001_T;//x
    //	        		var V05001_T = dataObj.V05001_T;//y
    //	        		if(x==1){
    ////	        			alert(V06001_T+"-"+V05001_T);
    ////	        			map.setCenter(new SuperMap.LonLat(V05001_T,V06001_T),3);
    ////	        			selectZXHL(new SuperMap.LonLat(V06001_T,V05001_T));
    //	        		}
    //	        		x++;
    //	        	});
    //
    //	      },
    //	      error: function() {
    //	      }
    //	    });
  }
}
/**
 * 中小河流详细信息区域悬浮
 */
function selectZXHLDetails(feature) {
  var cyselectFeature = new SuperMap.Control.SelectFeature(zxhldetailslayer, {
    onSelect: onFeatureSelectZXHLDetails,
    onUnselect: onUnFeatureSelectZXHLDetails,
    callbacks: {
      //			 click:wino
    },
    hover: true
  });

  //map上添加控件
  map.addControl(cyselectFeature);
  //激活控件
  cyselectFeature.activate();
}

function selectZXHL() {
  var cyselectFeature = new SuperMap.Control.SelectFeature(cyvectorLayer, {
    onSelect: onFeatureSelectZXHL,
    onUnselect: onUnFeatureSelectZXHL,
    callbacks: {
      click: wino
    },
    hover: true
  });

  //map上添加控件
  map.addControl(cyselectFeature);
  //激活控件
  cyselectFeature.activate();
}
function openWinzxhl(loat) {
  closeInfoWinzxhl();
  var lonlat = loat;

  var contentHTML =
    "<div style='width:400px;height:120px; font-size:12px; opacity: 0.8'>";
  contentHTML +=
    "<div style=' font-size:14px; font-weight:bold ;color:#2476E3;border-bottom: 1px solid #E4E4E4;height:25px;line-height: 25px;'>111</div>";
  contentHTML +=
    "<table style='text-align:center;'>" +
    "<tr><th></th><th>年生产总值（万元）</th><th>年底人口数（万人）</th><th>第一产业增加值（万元）</th><th>第二产业增加值（万元）</th></tr>" +
    "</table>";
  contentHTML += "</div>";

  popup = new SuperMap.Popup.FramedCloud(
    "popwin",
    new SuperMap.LonLat(lonlat.lon, lonlat.lat),
    null,
    contentHTML,
    null,
    true
  );
  infowin = popup;
  map.addPopup(popup);
}
function closeInfoWinzxhl() {
  if (infowin) {
    try {
      infowin.hide();
      infowin.destroy();
    } catch (e) {}
  }
}
function wino(feature) {
  closeInfoWinzxhl();
  var lonlat = feature.geometry.getCentroid();

  $.ajax({
    async: false,
    cache: true,
    type: "POST",
    dataType: "json",
    url: "../getXHLYBaseInfo.do",
    data: { vmcode: feature.data.CODE },
    error: function() {},
    success: function(data) {
      $.each(data, function(i, dataObj) {
        var LON = dataObj.V06001_MO; //河 源 位 置 经 度(度)
        var LAT = dataObj.V05001_MO; //河 源 位 置 纬 度(度)

        var contentHTML =
          "<div style='width:220px;height:120px; font-size:12px; opacity: 0.8'>";
        contentHTML +=
          "<div style=' font-size:14px; font-weight:bold ;color:#2476E3;border-bottom: 1px solid #E4E4E4;height:25px;line-height: 25px;' title='" +
          feature.data.NAME +
          "'>" +
          (feature.data.NAME.length > 8
            ? feature.data.NAME.substring(0, 8) + ".."
            : feature.data.NAME) +
          "</div>";
        contentHTML += "<table>";
        contentHTML +=
          "<tr><th width='110px'>跨界类型：</th><td width='110px'>" +
          (dataObj.V_Cross_Type == undefined ? "" : dataObj.V_Cross_Type) +
          "</td></tr>";
        contentHTML +=
          "<tr><th>流域面积(km2)：</th><td>" + dataObj.V_R_AREA + "</td></tr>";
        contentHTML +=
          "<tr><th>流域内人口：</th><td>" + dataObj.V_R_POP + "</td></tr>";
        contentHTML +=
          "<tr><th>河流长度(km)：</th><td>" + dataObj.V_M_LENGTH + "</td></tr>";
        contentHTML +=
          "<tr><th>河源位置名称：</th><td>" +
          dataObj.V_M_ORISITE +
          "</td></tr>";
        contentHTML +=
          "<tr><td></td><td style='text-align:right;'><a href='../risksurveydetails.html?vmcode=" +
          feature.data.CODE +
          "' target='_blank'>详情</a></td></tr>";
        contentHTML += "</table>";
        contentHTML += "</div>";
        popup = new SuperMap.Popup.FramedCloud(
          "popwin",
          new SuperMap.LonLat(lonlat.x, lonlat.y),
          //				           new SuperMap.LonLat(LON,LAT).transform("EPSG:4326","EPSG:900913"),
          null,
          contentHTML,
          null,
          true
        );
        infowin = popup;
        map.addPopup(popup);
      });
    }
  });
}
//中小河流详细信息
function onFeatureSelectZXHLDetails(feature) {
  //TODO
  //		alert(1);
  feature.style = {
    strokeColor: "#CFCFCF",
    strokeWidth: 1,
    label: feature.data.NAME,
    //				fontColor:'',
    //				  fontWeight:"bold",
    fillColor: "yellow",
    fontSize: "12px",
    fillOpacity: "0.8"
  }; //stylewt2;
  zxhldetailslayer.removeFeatures();
  zxhldetailslayer.addFeatures(feature);
}
function onUnFeatureSelectZXHLDetails(feature) {
  feature.style = {
    strokeColor: "#F4F4ED",
    strokeWidth: 1,
    label: feature.data.NAME,
    //			fontColor:'',
    //			  fontWeight:"bold",
    fillColor: "#DF5200",
    fontSize: "12px",
    fillOpacity: "0.5"
  }; //stylewt2;
  zxhldetailslayer.removeFeatures();
  zxhldetailslayer.addFeatures(feature);
  //TODO
}

//中小河流详细信息结束
function onFeatureSelectZXHL(feature) {
  //TODO
  feature.style = {
    strokeColor: "#CFCFCF",
    strokeWidth: 1,
    label: feature.data.NAME,
    //				fontColor:'',
    //				  fontWeight:"bold",
    fillColor: "yellow",
    fontSize: "12px",
    fillOpacity: "0.8"
  }; //stylewt2;
  cyvectorLayer.removeFeatures();
  cyvectorLayer.addFeatures(feature);
  //		var ok = arr.get(feature.data.NAME+"x")

  //		var lonlat = new SuperMap.LonLat(arr.get(feature.data.NAME+'x'),arr.get(feature.data.NAME+'y'));
  //		mouseClickHandler(lonlat,feature.data.NAME,'geli')
}
function onUnFeatureSelectZXHL(feature) {
  feature.style = {
    strokeColor: "#F4F4ED",
    strokeWidth: 1,
    label: feature.data.NAME,
    //			fontColor:'',
    //			  fontWeight:"bold",
    fillColor: "#DF5200",
    fontSize: "12px",
    fillOpacity: "0.5"
  }; //stylewt2;
  cyvectorLayer.removeFeatures();
  cyvectorLayer.addFeatures(feature);
  //TODO
}
function processFailedcy(e) {
  alert(e.error.errorMsg);
}
function clearFeaturescy() {
  if (cyvectorLayer) {
    //先清除上次的显示结果
    cyvectorLayer.removeAllFeatures();
    cyvectorLayer.refresh();
  }
}
/**
 * 中小河流详细信息，实现定位功能
 */
var markerdingwei = null;
function dingwei(x, y) {
  if (markerdingwei) {
    xz_markers.removeMarker(markerdingwei);
  }
  var size = new SuperMap.Size(10, 10);
  var offset = new SuperMap.Pixel(-(size.w / 2), -size.h);
  var icon = new SuperMap.Icon("../images/gis/LocatePoint.gif", size, offset);
  markerdingwei = new SuperMap.Marker(
    new SuperMap.LonLat(x, y).transform("EPSG:4326", "EPSG:900913"),
    icon
  );

  map.panTo(new SuperMap.LonLat(x, y).transform("EPSG:4326", "EPSG:900913"));
  map.setCenter(
    new SuperMap.LonLat(x, y).transform("EPSG:4326", "EPSG:900913"),
    7
  );
  xz_markers.addMarker(markerdingwei);
}
/**
 * 中小河流详细信息加点
 * @param area_code
 * area_code:V_M_CODE 中小河流代码
 */
function area_point(area_code) {
  $.ajax({
    async: false,
    cache: true,
    type: "POST",
    dataType: "json",
    url: "../getZXHLxz.do", //中小河流域对应的镇信息
    timeout: 1000,
    data: {
      area_code: area_code
    },
    success: function(data) {
      //        	alert(area_code);

      ZXHL_YHD_XZ_Markers(data.data);
      initzxhldetails();
      getzxhldetailsFeaturesBySQL(area_code);
      //驾照
    },
    error: function() {}
  });
  layerFullScreen();
}
/**
 * 详细信息页面加载隐患点
 * @param data
 * area_code:V_M_CODE 中小河流代码
 */
function YHDDetails(area_code) {
  $.ajax({
    async: false,
    cache: true,
    type: "POST",
    dataType: "json",
    url: "../getYHDDetails.do", //中小河流域对应的镇信息
    timeout: 1000,
    data: {
      vmcode: area_code
    },
    success: function(data) {
      yh_markers = new SuperMap.Layer.Markers("隐患点", {});
      $.each(data, function(i, dataObj) {
        var x = dataObj.V06001_HIDD;
        var y = dataObj.V05001_HIDD;
        var V_HIDDEN_NAME = dataObj.V_HIDDEN_NAME; //隐患点名称
        var V_HIDD_HEIGHT = dataObj.V_HIDD_HEIGHT; //隐患点海拔
        var V_HIDD_POP = dataObj.V_HIDD_POP; //隐患点
        var V_HIDD_DGN = dataObj.V_HIDD_DGN; //危险品名称
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
          click: OpenYHD_Details
        });
        //参数
        marker.x = x;
        marker.y = y;
        marker.V_HIDDEN_NAME = V_HIDDEN_NAME;
        marker.V_HIDD_HEIGHT = V_HIDD_HEIGHT;
        marker.V_HIDD_POP = V_HIDD_POP;
        marker.V_HIDD_DGN = V_HIDD_DGN;
        marker.V_HIDD_MEA = V_HIDD_MEA;

        yh_markers.addMarker(marker);
      });

      map.addLayer(yh_markers);
    },
    error: function() {}
  });
  layerFullScreen();
}
function OpenYHD_Details() {
  clearPopup();
  var marker = this;
  var V_HIDDEN_NAME = marker.V_HIDDEN_NAME; //隐患点名称
  var V_HIDD_HEIGHT = marker.V_HIDD_HEIGHT; //隐患点海拔
  var V_HIDD_POP = marker.V_HIDD_POP; //隐患点
  var V_HIDD_DGN = marker.V_HIDD_DGN; //危险品名称
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
    "<tr><td>危险品名称:</td><td>" +
    (V_HIDD_DGN == "" || V_HIDD_DGN == undefined ? "-" : V_HIDD_DGN + "") +
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
function ZXHL_YHD_XZ_Markers(data) {
  var area_code = "";
  //创建标记图层
  xz_markers = new SuperMap.Layer.Markers("乡镇点", {});

  //循环遍历所有的隐患点数据
  $.each(data, function(i, dataObj) {
    var V_T_CODE = dataObj.V_T_CODE; //乡镇代码
    var V_T_NAME = dataObj.V_T_NAME; //乡镇名称

    var V_M_CODE = dataObj.V_M_CODE; //流域编码
    var V_O_SURVEY_YEAR = dataObj.V_O_SURVEY_YEAR; //数据年份
    var V_PO_TOTAL = dataObj.V_PO_TOTAL; //总人口

    var V06001_T = dataObj.V06001_T; //x
    var V05001_T = dataObj.V05001_T; //y
    if (
      V06001_T == "" ||
      V06001_T == null ||
      V05001_T == "" ||
      V05001_T == null
    ) {
      return false;
    }
    var V_G_ACREAGE = dataObj.V_G_ACREAGE; //土地面积(km2)
    var V_G_ARG_ACREAGE = dataObj.V_G_ARG_ACREAGE; //耕地面积(km2)
    var V_PO_CITY = dataObj.V_PO_CITY; //城镇人口
    var V_PO_COUNTY = dataObj.V_PO_COUNTY; ////乡村人口(ren)
    var V_PO_RESIDIENT = dataObj.V_PO_RESIDIENT; //常驻人口(ren)
    var V_PO_65_NUM = dataObj.V_PO_65_NUM; //≥65 岁老年人数(人)
    var V_PO_LGT_60 = dataObj.V_PO_LGT_60; //≥65 岁老年人口比例(％)
    var V_PO_14_NUM = dataObj.V_PO_14_NUM; //≤14 岁儿童人口(人)
    var V_PO_LST_14 = dataObj.V_PO_LST_14; //≤14 岁⼉童人口比例(％)
    var V_H_HOUSEHOLD_NUM = dataObj.V_H_HOUSEHOLD_NUM; //家庭户数(户)
    var V_H_HOUSE_NUM = dataObj.V_H_HOUSE_NUM; //房屋数(间)
    var V_O_GDP = dataObj.V_O_GDP; //地 区 ⽣ 产 总 值(万元)
    var V_O_GOV = dataObj.V_O_GOV; //工⼯业总产值(万元
    var V_O_RGDP = dataObj.V_O_RGDP; //农业总产值(
    //		if(i==0){
    //			map.panTo(new SuperMap.LonLat(V06001_T,V05001_T));
    //			map.setCenter(new SuperMap.LonLat(V06001_T,V05001_T).transform("EPSG:4326","EPSG:900913"),6);
    //		}
    //标记图层上添加标记
    var size = new SuperMap.Size(20, 20);
    var offset = new SuperMap.Pixel(-(size.w / 2), -size.h);
    var icon = new SuperMap.Icon("../images/gis/xiangzheng.png", size, offset);

    var marker = new SuperMap.Marker(
      new SuperMap.LonLat(V06001_T, V05001_T).transform(
        "EPSG:4326",
        "EPSG:900913"
      ),
      icon
    );
    marker.events.on({
      click: OpenYHD_XZView
      //		   "scope": marker
    });

    marker.V_T_CODE = V_T_CODE;
    marker.V_T_NAME = V_T_NAME;
    marker.V_M_CODE = V_M_CODE;
    marker.V_O_SURVEY_YEAR = V_O_SURVEY_YEAR;
    marker.V_PO_TOTAL = V_PO_TOTAL;
    marker.V06001_T = V06001_T;
    marker.V05001_T = V05001_T;

    marker.V_G_ACREAGE = V_G_ACREAGE; //土地面积(km2)
    marker.V_G_ARG_ACREAGE = V_G_ARG_ACREAGE; //耕地面积(km2)
    marker.V_PO_CITY = V_PO_CITY; //城镇人口
    marker.V_PO_COUNTY = V_PO_COUNTY; ////乡村人口(ren)
    marker.V_PO_RESIDIENT = V_PO_RESIDIENT; //常驻人口(ren)
    marker.V_PO_65_NUM = V_PO_65_NUM; //≥65 岁老年人数(人)
    marker.V_PO_LGT_60 = V_PO_LGT_60; //≥65 岁老年人口比例(％)
    marker.V_PO_14_NUM = V_PO_14_NUM; //≤14 岁儿童人口(人)
    marker.V_PO_LST_14 = V_PO_LST_14; //≤14 岁⼉童人口比例(％)
    marker.V_H_HOUSEHOLD_NUM = V_H_HOUSEHOLD_NUM; //家庭户数(户)
    marker.V_H_HOUSE_NUM = V_H_HOUSE_NUM; //房屋数(间)
    marker.V_O_GDP = V_O_GDP; //地 区 ⽣ 产 总 值(万元)
    marker.V_O_GOV = V_O_GOV; //工⼯业总产值(万元
    marker.V_O_RGDP = V_O_RGDP; //农业总产值(万元
    area_code = V_M_CODE;
    xz_markers.addMarker(marker);
  });

  map.addLayer(xz_markers);
}

function OpenYHD_XZView() {
  clearPopup();
  var marker = this;
  var V_T_CODE = marker.V_T_CODE; //乡镇代码
  var V_T_NAME = marker.V_T_NAME; //乡镇名称
  var V_M_CODE = marker.V_M_CODE; //流域编码
  var V_O_SURVEY_YEAR = marker.V_O_SURVEY_YEAR; //数据年份
  var V_PO_TOTAL = marker.V_PO_TOTAL; //总人口
  var V06001_T = marker.V06001_T; //x
  var V05001_T = marker.V05001_T; //y
  var V_G_ACREAGE = marker.V_G_ACREAGE; //土地面积(km2)
  var V_G_ARG_ACREAGE = marker.V_G_ARG_ACREAGE; //耕地面积(km2)
  var V_PO_CITY = marker.V_PO_CITY; //城镇人口
  var V_PO_COUNTY = marker.V_PO_COUNTY; ////乡村人口(ren)
  var V_PO_RESIDIENT = marker.V_PO_RESIDIENT; //常驻人口(ren)
  var V_PO_65_NUM = marker.V_PO_65_NUM; //≥65 岁老年人数(人)
  var V_PO_LGT_60 = marker.V_PO_LGT_60; //≥65 岁老年人口比例(％)
  var V_PO_14_NUM = marker.V_PO_14_NUM; //≤14 岁儿童人口(人)
  var V_PO_LST_14 = marker.V_PO_LST_14; //≤14 岁⼉童人口比例(％)
  var V_H_HOUSEHOLD_NUM = marker.V_H_HOUSEHOLD_NUM; //家庭户数(户)
  var V_H_HOUSE_NUM = marker.V_H_HOUSE_NUM; //房屋数(间)
  var V_O_GDP = marker.V_O_GDP; //地 区 ⽣ 产 总 值(万元)
  var V_O_GOV = marker.V_O_GOV; //工⼯业总产值(万元
  var V_O_RGDP = marker.V_O_RGDP; //农业总产值(万元

  var contentHTML =
    "<div style='width:240px;height:115px; font-size:12px; opacity: 0.8'>";
  contentHTML +=
    "<div style=' font-size:14px; font-weight:bold ;color:#2476E3;border-bottom: 1px solid #E4E4E4;height:25px;line-height: 25px;'>" +
    V_T_NAME +
    "</div>";
  contentHTML += "<table style='text-align:left;margin-left:5px;'>";
  contentHTML +=
    "<tr><td style='width:130px;'>土地面积:</td><td>" +
    (V_G_ACREAGE == "" || V_G_ACREAGE == undefined
      ? "-"
      : V_G_ACREAGE + "&nbsp;平方公里") +
    "</td></tr>";
  contentHTML +=
    "<tr><td>耕地面积:</td><td>" +
    (V_G_ARG_ACREAGE == "" || V_G_ARG_ACREAGE == undefined
      ? "-"
      : V_G_ARG_ACREAGE + "&nbsp;平方公里") +
    "</td></tr>";
  contentHTML +=
    "<tr><td>城镇人口:</td><td>" +
    (V_PO_CITY == "" || V_PO_CITY == undefined ? "-" : V_PO_CITY + "&nbsp;人") +
    "</td></tr>";
  contentHTML +=
    "<tr><td>乡村人口:</td><td>" +
    (V_PO_COUNTY == "" || V_PO_COUNTY == undefined
      ? "-"
      : V_PO_COUNTY + "&nbsp;人") +
    "</td></tr>";
  contentHTML +=
    "<tr><td>常驻人口:</td><td>" +
    (V_PO_RESIDIENT == "" || V_PO_RESIDIENT == undefined
      ? "-"
      : V_PO_RESIDIENT + "&nbsp;人") +
    "</td></tr>";
  contentHTML +=
    "<tr><td>≥65岁老年人数:</td><td>" +
    (V_PO_65_NUM == "" || V_PO_65_NUM == undefined
      ? "-"
      : V_PO_65_NUM + "&nbsp;人") +
    "</td></tr>";
  contentHTML +=
    "<tr><td>≥65岁老年人口比例:</td><td>" +
    (V_PO_LGT_60 == "" || V_PO_LGT_60 == undefined
      ? "-"
      : V_PO_LGT_60 + "&nbsp;％") +
    "</td></tr>";
  contentHTML +=
    "<tr><td>≤14岁儿童人口:</td><td>" +
    (V_PO_14_NUM == "" || V_PO_14_NUM == undefined
      ? "-"
      : V_PO_14_NUM + "&nbsp;人") +
    "</td></tr>";
  contentHTML +=
    "<tr><td>≤14岁儿童人口比例:</td><td>" +
    (V_PO_LST_14 == "" || V_PO_LST_14 == undefined
      ? "-"
      : V_PO_LST_14 + "&nbsp;％") +
    "</td></tr>";
  contentHTML +=
    "<tr><td>家庭户数:</td><td>" +
    (V_H_HOUSEHOLD_NUM == "" || V_H_HOUSEHOLD_NUM == undefined
      ? ""
      : V_H_HOUSEHOLD_NUM + "&nbsp;户") +
    "</td></tr>";
  contentHTML +=
    "<tr><td>地区生产总值:</td><td>" +
    (V_O_GDP == "" || V_O_GDP == undefined ? "-" : V_O_GDP + "&nbsp;万元") +
    "</td></tr>";
  contentHTML +=
    "<tr><td>工业总产值:</td><td>" +
    (V_O_GDP == "" || V_O_GDP == undefined ? "-" : V_O_GDP + "&nbsp;万元") +
    "</td></tr>";
  contentHTML +=
    "<tr><td>地区生产总值:</td><td>" +
    (V_O_GOV == "" || V_O_GOV == undefined ? "-" : V_O_GOV + "&nbsp;万元") +
    "</td></tr>";
  contentHTML +=
    "<tr><td>农业总产值:</td><td>" +
    (V_O_RGDP == "" || V_O_RGDP == undefined ? "-" : V_O_RGDP + "&nbsp;万元") +
    "</td></tr>";
  contentHTML +=
    "<tr><td>数据年份:</td><td>" +
    (V_O_SURVEY_YEAR == "" || V_O_SURVEY_YEAR == undefined
      ? "-"
      : V_O_SURVEY_YEAR + "&nbsp;年") +
    "</td></tr>";
  contentHTML += "</table>";
  contentHTML += "</div>";

  popup = new SuperMap.Popup.FramedCloud(
    "popwin",
    new SuperMap.LonLat(V06001_T, V05001_T).transform(
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
