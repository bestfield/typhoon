var map = null,
  layer1,
  layer2,
  layer3,
  layer4,
  layer5,
  layer6,
  layer_landuse,
  xzqhLayer,
  rainVector,
  rainDailyVector,
  markerLayer,
  siteMapLayer,
  vectorLayer,
  shadeLayer,
  drawPolygon,
  polygonLayer;
var mapType = "vec";
var isDownload = "false";
var shadeprovinceVector = new SuperMap.Layer.Vector("shadeprovinceVector", {
  renderers: ["Canvas"]
}); //遮罩图层
polygonLayer = new SuperMap.Layer.Vector("polygonLayer");
drawPolygon = new SuperMap.Control.DrawFeature(
  polygonLayer,
  SuperMap.Handler.Polygon
);
drawPolygon.style = {
  strokeColor: "yellow",
  strokeOpacity: 1,
  strokeWidth: 3,
  fill: false
};

var app = {
  dataType: "全球模式预估", //全球模式预估 or 区域模式预估
  dataNumberType: "RCP26", //RCP26,RCP45,RCP85
  startYear: "1901", //开始年份
  endYear: "2016", //结束年份
  dateType: "平均场", //平均场 or 距平
  anomalyStartYear: "1981", //距平参考开始年份
  anomalyEndYear: "1999", //距平参考时间结束年份
  meteoElement: "平均气温", //平均气温 or 最高气温 or 最低气温 or 降水
  timeResolution: "年平均", //年平均,春,夏,秋,冬,1月.....12月
  selectArea: "全国", //全国,XX省,自定义
  customArea: "53.9,131.8,27.2,83.4" //自定义区域坐标数组 待确认
}; //全局变量属性
app.rainMapVisable = true;
//var path="http://192.168.1.29:8090";
var path = "http://192.168.105.156:8090";
var infowin;
var currLonlat; //当前鼠标点击的坐标对象
var popVector = new SuperMap.Layer.Vector("popVector"); //鼠标点击地图分析结果图层
var borderProvinceVector = new SuperMap.Layer.Vector("borderProvinceVector"); //边界图层
var borderCityVector = new SuperMap.Layer.Vector("borderCityVector"); //边界图层
var swit = 1;
var style = {
  //边界显示样式
  strokeColor: "#E29100",
  strokeOpacity: 1,
  strokeWidth: 3,
  fill: false
};
var url2 = path + "/iserver/services/data-world/rest/data";
var urltest = path + "/iserver/services/data-china/rest/data";
var dataColor;
var requestTestFlag = false;
var typeFlag = "raster"; //色斑图类型

$(document).ready(function() {
  setDateControl();
  $("input[name='datatype']").click(function() {
    if (
      $(this).val() == "area" &&
      $("input[name='qihoudata']:checked").val() != "极端气候要素"
    ) {
      setDateControl(1);
    } else if (
      $(this).val() == "global" &&
      $("input[name='qihoudata']:checked").val() != "极端气候要素"
    ) {
      setDateControl();
    }
  });
  init(); //初始化图层数据
  //addlayer_szqh();
  //getStationsListener();
});

function layerSelect(flag) {
  if (flag == "vec") {
    layer1.setVisibility(true);
    layer2.setVisibility(false);
    layer3.setVisibility(false);
    layer4.setVisibility(true);
    layer5.setVisibility(false);
    layer6.setVisibility(false);
    $("#vecLayer").css("background", "#7FB8E1");
    $("#vecLayer").css("color", "#fff");
    $("#imgLayer").css("background", "");
    $("#imgLayer").css("color", "");
    $("#terLayer").css("background", "");
    $("#terLayer").css("color", "");
  }
  if (flag == "img") {
    layer1.setVisibility(false);
    layer2.setVisibility(true);
    layer3.setVisibility(false);
    layer4.setVisibility(false);
    layer5.setVisibility(true);
    layer6.setVisibility(false);
    $("#imgLayer").css("background", "#7FB8E1");
    $("#imgLayer").css("color", "#fff");
    $("#vecLayer").css("background", "#fff");
    $("#vecLayer").css("color", "#000");
    $("#terLayer").css("background", "");
    $("#terLayer").css("color", "");
  }
  if (flag == "ter") {
    layer1.setVisibility(false);
    layer2.setVisibility(false);
    layer3.setVisibility(true);
    layer4.setVisibility(false);
    layer5.setVisibility(false);
    layer6.setVisibility(true);
    $("#terLayer").css("background", "#7FB8E1");
    $("#terLayer").css("color", "#fff");
    $("#vecLayer").css("background", "#fff");
    $("#vecLayer").css("color", "#000");
    $("#imgLayer").css("background", "");
    $("#imgLayer").css("color", "");
  }
}

/** 通过name获取页面传来的值 */
function getQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return r[2];
  return null;
}
/** 仅带一个参数指明要调用某服务的 ** 方法(js不支持方法同名不同参，后定义的会将先定义的覆盖掉)~ */

function wrapMethodName(strMethodName, param) {
  var postData = '<?xml version="1.0" encoding="utf-8"?>';
  postData += "<soap:Envelope ";
  postData += 'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ';
  postData += 'xmlns:xsd="http://www.w3.org/2001/XMLSchema" ';
  postData += 'xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">';
  postData += "<soap:Body><";
  postData += strMethodName;
  postData += ' xmlns="http://tempuri.org/" >';
  postData += "<parameters>" + param + "</parameters>";
  postData += "</" + strMethodName + ">";
  postData += "</soap:Body>";
  postData += "</soap:Envelope>";
  return postData;
}
function init() {
  map = new SuperMap.Map("map", {
    controls: [
      //           new SuperMap.Control.LayerSwitcher(),//圖層控制
      new SuperMap.Control.ScaleLine({ isImperialUnits: false }),
      // new SuperMap.Control.OverviewMap(),//地图鹰眼
      new SuperMap.Control.PanZoomBar({
        forceFixedZoomLevel: false,
        showCompass: false,
        showSlider: false
      }), //標尺
      new SuperMap.Control.Navigation({
        dragPanOptions: {
          enableKinetic: true
        }
      })
    ],
    allOverlays: true,
    projection: "EPSG:900913", //900913
    minScale: 7,
    minResolution: "360度/256像素"
  });
  var bounds = map.maxExtent;
  var points1 = [
    new SuperMap.Geometry.Point(bounds.bottom, bounds.left),
    new SuperMap.Geometry.Point(bounds.top, bounds.left),
    new SuperMap.Geometry.Point(bounds.top, bounds.right),
    new SuperMap.Geometry.Point(bounds.bottom, bounds.right),
    new SuperMap.Geometry.Point(bounds.bottom, bounds.left)
  ];
  shadeLayer = new SuperMap.Geometry.LinearRing(points1);
  scaleline = new SuperMap.Control.ScaleLine({
    isImperialUnits: false,
    maxWidth: 120
  });
  scaleline.geodesic = true;
  addLayertiandi(mapType);
  shadeprovinceVector.setVisibility(false);

  // 注册地图 mousemove，用于获取当前鼠标在地图中的像素位置
  map.events.on({
    mousemove: function(e) {
      infowinPosition = e.xy.clone();
      // 偏移
      infowinPosition.x += 40;
      infowinPosition.y -= 25;
    }
  });
  //map.setCenter(new SuperMap.LonLat(103.07567641634,36.855795258955).transform("EPSG:4490","EPSG:900913"), 2);
}
function getFeaturesBySQL(city) {
  var getFeatureParam, getFeatureBySQLService, getFeatureBySQLParams;
  getFeatureParam = new SuperMap.REST.FilterParameter({
    name: "province@china",
    attributeFilter: "name ='" + city + "'"
  });
  getFeatureBySQLParams = new SuperMap.REST.GetFeaturesBySQLParameters({
    queryParameter: getFeatureParam,
    datasetNames: ["china:province"]
  });
  getFeatureBySQLService = new SuperMap.REST.GetFeaturesBySQLService(urltest, {
    eventListeners: {
      processCompleted: processCompleted,
      processFailed: processFailed
    }
  });
  getFeatureBySQLService.processAsync(getFeatureBySQLParams);
}
function processCompleted(getFeaturesEventArgs) {
  if (app.selectArea.split("-").length < 2) {
    var i,
      len,
      features,
      feature,
      result = getFeaturesEventArgs.result;
    var geometryTemp = result.features[0].geometry;
    var newpoint = geometryTemp.getCentroid();
    var bilichi;
    if (app.selectArea.indexOf("市") >= 0) {
      bilichi = 7;
    } else if (app.selectArea.indexOf("自治区") >= 0) {
      bilichi = 5;
    } else if (app.selectArea.indexOf("香港") >= 0) {
      bilichi = 10;
    } else if (app.selectArea.indexOf("澳门") >= 0) {
      bilichi = 13;
    } else {
      bilichi = 7;
    }
    //alert(bilichi);
    map.setCenter(
      new SuperMap.LonLat(newpoint.x, newpoint.y).transform(
        "EPSG:4490",
        "EPSG:900913"
      ),
      bilichi
    );
    //map.panTo(new SuperMap.LonLat(newpoint.x,newpoint.y).transform("EPSG:4490","EPSG:900913"), 5));
    //alert(newpoint);
    getprovinceshade(geometryTemp);
  } else {
    var points3 = [
      new SuperMap.Geometry.Point(
        app.selectArea.split("-")[2],
        app.selectArea.split("-")[0]
      ).transform(
        new SuperMap.Projection("EPSG:4490"),
        new SuperMap.Projection("EPSG:900913")
      ),
      new SuperMap.Geometry.Point(
        app.selectArea.split("-")[2],
        app.selectArea.split("-")[1]
      ).transform(
        new SuperMap.Projection("EPSG:4490"),
        new SuperMap.Projection("EPSG:900913")
      ),
      new SuperMap.Geometry.Point(
        app.selectArea.split("-")[3],
        app.selectArea.split("-")[1]
      ).transform(
        new SuperMap.Projection("EPSG:4490"),
        new SuperMap.Projection("EPSG:900913")
      ),
      new SuperMap.Geometry.Point(
        app.selectArea.split("-")[3],
        app.selectArea.split("-")[0]
      ).transform(
        new SuperMap.Projection("EPSG:4490"),
        new SuperMap.Projection("EPSG:900913")
      ),
      new SuperMap.Geometry.Point(
        app.selectArea.split("-")[2],
        app.selectArea.split("-")[0]
      ).transform(
        new SuperMap.Projection("EPSG:4490"),
        new SuperMap.Projection("EPSG:900913")
      )
    ];
    //alert(app.selectArea.split("-"));
    getprovinceshadelonat(points3);
    var centerPointG = new SuperMap.Geometry.Point(
      (parseFloat(app.selectArea.split("-")[3]) +
        parseFloat(app.selectArea.split("-")[2])) /
        2,
      (parseFloat(app.selectArea.split("-")[1]) +
        parseFloat(app.selectArea.split("-")[0])) /
        2
    ).transform(
      new SuperMap.Projection("EPSG:4490"),
      new SuperMap.Projection("EPSG:900913")
    );

    map.setCenter(new SuperMap.LonLat(centerPointG.x, centerPointG.y), 4);
  }
}
function processFailed(e) {
  alert(e.error.errorMsg);
}
/**
 * 遮罩处理(省)
 * @param {Object} geometryTemp
 */
function getprovinceshade(geometryTemp) {
  var bounds = geometryTemp.getVertices();
  bounds.push(bounds[0]); //添加头进数组形成环形
  var line2 = new SuperMap.Geometry.LinearRing(bounds);
  var regionDaodong = new SuperMap.Geometry.Polygon([shadeLayer, line2]);
  var regionDaodongVector = new SuperMap.Feature.Vector(regionDaodong);
  regionDaodongVector.style = {
    fillColor: "white",
    strokeColor: "yellow",
    pointRadius: 6
  };
  shadeprovinceVector.removeAllFeatures();
  shadeprovinceVector.setVisibility(true);
  map.setLayerIndex(shadeprovinceVector, map.getNumLayers() - 1);
  shadeprovinceVector.addFeatures([regionDaodongVector]);
}
/**
 * 遮罩处理(经纬度)
 * @param {Object} geometryTemp
 */
function getprovinceshadelonat(points3) {
  // alert(points3);
  var line2 = new SuperMap.Geometry.LinearRing(points3);
  var regionDaodong = new SuperMap.Geometry.Polygon([shadeLayer, line2]);
  var regionDaodongVector = new SuperMap.Feature.Vector(regionDaodong);
  regionDaodongVector.style = {
    fillColor: "white",
    strokeColor: "yellow",
    pointRadius: 6
  };
  shadeprovinceVector.removeAllFeatures();
  shadeprovinceVector.setVisibility(true);
  map.setLayerIndex(shadeprovinceVector, map.getNumLayers() - 1);
  shadeprovinceVector.addFeatures([regionDaodongVector]);
}
function addLayertiandi(ty) {
  if (layer1) {
    try {
      map.removeLayer(layer1, false);
    } catch (e) {}
  }
  if (layer2) {
    try {
      map.removeLayer(layer2, false);
    } catch (e) {}
  }
  layer1 = new SuperMap.Layer.TiledDynamicRESTLayer(
    "矢量底图",
    path + "/iserver/services/map-tianditu/rest/maps/矢量底图_经纬度",
    { transparent: true, cacheEnabled: true },
    null
  );
  //	    layer1 = new SuperMap.Layer.Tianditu({"layerType":"vec"});//img,ter
  layer2 = new SuperMap.Layer.TiledDynamicRESTLayer(
    "影像底图",
    path + "/iserver/services/map-tianditu/rest/maps/影像底图_经纬度",
    { transparent: true, cacheEnabled: true },
    null
  );
  //		layer2 = new SuperMap.Layer.Tianditu({"layerType":"img"});//img,ter
  layer3 = new SuperMap.Layer.TiledDynamicRESTLayer(
    "地形底图",
    path + "/iserver/services/map-tianditu/rest/maps/地形底图_经纬度",
    { transparent: true, cacheEnabled: true },
    null
  );
  //		layer3 = new SuperMap.Layer.Tianditu({"layerType":"ter"});//img,ter
  layer4 = new SuperMap.Layer.TiledDynamicRESTLayer(
    "矢量中文注记",
    path + "/iserver/services/map-tianditu/rest/maps/矢量中文注记_经纬度",
    { transparent: true, cacheEnabled: true },
    null
  );
  //		layer4 = new SuperMap.Layer.Tianditu({"layerType":"vec","isLabel":true});
  layer5 = new SuperMap.Layer.TiledDynamicRESTLayer(
    "影像中文注记",
    path + "/iserver/services/map-tianditu/rest/maps/影像中文注记_经纬度",
    { transparent: true, cacheEnabled: true },
    null
  );
  //		layer5 = new SuperMap.Layer.Tianditu({"layerType":"img","isLabel":true});
  layer6 = new SuperMap.Layer.TiledDynamicRESTLayer(
    "地形中文注记",
    path + "/iserver/services/map-tianditu/rest/maps/地形中文注记_经纬度",
    { transparent: true, cacheEnabled: true },
    null
  );
  //		layer6 = new SuperMap.Layer.Tianditu({"layerType":"ter","isLabel":true});
  markerLayer = new SuperMap.Layer.Markers("markerLayer"); //站点定位
  siteMapLayer = new SuperMap.Layer.Vector("siteMapLayer"); //站点分布图
  vectorLayer = new SuperMap.Layer.Vector("vectorLayer"); //山洪沟
  //		layer1.setOpacity(1);
  layer2.setVisibility(false);
  layer3.setVisibility(false);
  layer5.setVisibility(false);
  layer6.setVisibility(false);
  layer1.events.on({ layerInitialized: addlayer1 });
  layer2.events.on({ layerInitialized: addlayer2 });
  layer3.events.on({ layerInitialized: addlayer3 });
  layer4.events.on({ layerInitialized: addlayer4 });
  layer5.events.on({ layerInitialized: addlayer5 });
  layer6.events.on({ layerInitialized: addlayer6 });
  //		map.addLayers([layer1,layer2,layer3,layer4,layer5,layer6,shadeprovinceVector]);
  //		map.addControl(scaleline,new SuperMap.Pixel($("#map").width()-100,$("#map").height()-100));//为了设定比例尺位置，只有单独添加

  //添加行政区划数据
  //		iserver/services/maps/rest/maps/World
  //		/iserver/services/map-china400/rest/maps/China
  //		xzqhLayer = new SuperMap.Layer.TiledDynamicRESTLayer("China", path+"/iserver/services/map-china400/rest/maps/China", {
  //    		transparent: true, cacheEnabled:true
  //    	}, null);
  //		xzqhLayer = new SuperMap.Layer.TiledDynamicRESTLayer("xzqh", path+"/iserver/services/map-china/rest/maps/storm2", {
  //    		transparent: true, cacheEnabled:true
  //    	}, null);
  //xzqhLayer.setOpacity(1);
  //		xzqhLayer.setVisibility(true);
  //		xzqhLayer.events.on({"layerInitialized": addlayer_szqh});
  //		markerLayer = new SuperMap.Layer.TiledDynamicRESTLayer("xzqh", path+"/iserver/services/map-china/rest/maps/storm2", {
  //    		transparent: true, cacheEnabled:true
  //    	}, null);
  //		markerLayer.setOpacity(1);
  //		markerLayer.setVisibility(false);
  //		markerLayer.events.on({"layerInitialized": addlayer_landuse});
  //drawPolygon = new SuperMap.Control.DrawFeature(markerLayer.v, SuperMap.Handler.Polygon);
  //		map.addLayers([xzqhLayer]);
  //		map.setLayerIndex(layer1,0);//将底图设置到最下面
  //		map.setLayerIndex(layer2,map.getNumLayers()-1);//将注记设置到最上面
  //		layer_landuse = new SuperMap.Layer.TiledDynamicRESTLayer("landuse", path+"/iserver/services/map-china/rest/maps/landuse", {
  //    		transparent: true, cacheEnabled:true
  //    	}, null);
  //		layer_landuse.setVisibility(false);
  //    	layer_landuse.events.on({"layerInitialized": addlayer_landuse});
}
function addlayer1() {
  map.addLayers([layer1, shadeprovinceVector]);
  map.setCenter(
    new SuperMap.LonLat(103.07567641634, 36.855795258955).transform(
      "EPSG:4490",
      "EPSG:900913"
    ),
    2
  );
}
function addlayer2() {
  map.addLayers([layer2]);
  map.setCenter(
    new SuperMap.LonLat(103.07567641634, 36.855795258955).transform(
      "EPSG:4490",
      "EPSG:900913"
    ),
    2
  );
}
function addlayer3() {
  map.addLayers([layer3]);
  map.setCenter(
    new SuperMap.LonLat(103.07567641634, 36.855795258955).transform(
      "EPSG:4490",
      "EPSG:900913"
    ),
    2
  );
}
function addlayer4() {
  map.addLayers([layer4]);
  map.setCenter(
    new SuperMap.LonLat(103.07567641634, 36.855795258955).transform(
      "EPSG:4490",
      "EPSG:900913"
    ),
    2
  );
}
function addlayer5() {
  map.addLayers([layer5]);
  map.setCenter(
    new SuperMap.LonLat(103.07567641634, 36.855795258955).transform(
      "EPSG:4490",
      "EPSG:900913"
    ),
    2
  );
}
function addlayer6() {
  map.addLayers([layer6]);
  map.setCenter(
    new SuperMap.LonLat(103.07567641634, 36.855795258955).transform(
      "EPSG:4490",
      "EPSG:900913"
    ),
    2
  );
  var qihoudataSelect = getQueryString("qihoudata");
  if (qihoudataSelect != null) {
    if (
      qihoudataSelect == "averageTemperature" ||
      qihoudataSelect == "maximumTemperature" ||
      qihoudataSelect == "minimumTemperature"
    ) {
      $("#temperatureInput").attr("checked", true);
      $("#qihoudataSelector option[value=" + qihoudataSelect + "]").attr(
        "selected",
        true
      );
    } else {
      if (qihoudataSelect == "rain") {
        $("input[name='qihoudata'][value='降水']").attr("checked", true);
      } else {
        $("input[name='qihoudata'][value='极端气候要素']").attr(
          "checked",
          true
        );
      }
    }
    estimateNumberShow();
  }
}
function addlayer_landuse() {
  map.addLayers([markerLayer]);
  map.addLayers([polygonLayer]);
  map.setLayerIndex(markerLayer, map.getNumLayers() - 1); //将注记设置到最上面
  //map.addLayers([shadeprovinceVector]);
  //传参加载数据开始
  var qihoudataSelect = getQueryString("qihoudata");
  if (qihoudataSelect != null) {
    if (
      qihoudataSelect == "averageTemperature" ||
      qihoudataSelect == "maximumTemperature" ||
      qihoudataSelect == "minimumTemperature"
    ) {
      $("#temperatureInput").attr("checked", true);
      $("#qihoudataSelector option[value=" + qihoudataSelect + "]").attr(
        "selected",
        true
      );
    } else {
      if (qihoudataSelect == "rain") {
        $("input[name='qihoudata'][value='降水']").attr("checked", true);
      } else {
        $("input[name='qihoudata'][value='极端气候要素']").attr(
          "checked",
          true
        );
      }
    }
    estimateNumberShow();
  }
  //传参加载数据结束
}

function mapPan() {
  drawLine.deactivate();
  drawFeature.deactivate();
}
function mapZoomin() {
  mapPan();
  map.zoomIn();
}
function mapZoomout() {
  mapPan();
  map.zoomOut();
}
function addTDTbyType(ty) {
  mapType = ty;
  if (layer1) {
    try {
      map.removeLayer(layer1, false);
    } catch (e) {}
  }
  if (layer2) {
    try {
      map.removeLayer(layer2, false);
    } catch (e) {}
  }
  layer1 = new SuperMap.Layer.Tianditu({ layerType: ty }); //img,ter
  layer2 = new SuperMap.Layer.Tianditu({ layerType: ty, isLabel: true });
  map.addLayers([layer1, layer2]);
  map.setLayerIndex(layer1, 0);
  //		map.setLayerIndex(layer2,2);
  map.setLayerIndex(layer2, map.getNumLayers() - 1); //将注记设置到最上面
}
/**
 * 根据图层名称来控制图层的显隐性
 * @param {Object} slayNam
 */
function controlVectorLaysByNam(slayNam, sproccedate) {
  var layarr = map.layers;
  var prelayname = "rainVector";
  if (slayNam == undefined) prelayname = "rainVector";
  else prelayname = "rainVector" + slayNam;
  if (sproccedate != undefined && sproccedate != null) {
    prelayname = prelayname + "-" + sproccedate.substring(5);
  }
  if (layarr != null) {
    var isfind = false;
    var strdisplaynam;
    for (var prey = 0, y = layarr.length; prey < y; prey++) {
      //遍历图层
      var prelyr = layarr[prey];
      if (prelyr != null) {
        var strplyernam = prelyr.id; //图层名称
        if (strplyernam.indexOf("rainVector") >= 0) {
          if (strplyernam == prelayname) {
            //同一个图层
            prelyr.setVisibility(true); //显示
            isfind = true;
            strdisplaynam = prelyr.name;
          } else {
            prelyr.setVisibility(false); //隐藏
          }
        }
      }
    }
    if (isfind) {
      $("body", window.document)
        .find("#map_tuli")
        .show();
      $("body", window.document)
        .find("#marker_map_name_id")
        .show();
      if (strdisplaynam != null && strdisplaynam.indexOf("rainVector") < 0) {
        $("body", window.document)
          .find("#map")
          .html(strdisplaynam);
        $("body", window.document)
          .find("#map")
          .show();
      }
    }
  }
}
/**
 * 根据名称来删除图层
 * @param {Object} slayerNam
 */
function delVectorLayerByNam(slayerNam) {
  var prelayname = "rainVector";
  if (slayerNam == undefined) prelayname = "rainVector";
  else prelayname = "rainVector" + slayerNam;
  var slayarr = map.layers;
  if (slayarr != null) {
    var isfind = false;
    for (var prey = 0; prey < slayarr.length; prey++) {
      //遍历图层
      var prelyr = slayarr[prey];
      if (prelyr != null) {
        var strplyernam = prelyr.id; //图层名称
        if (strplyernam.indexOf(prelayname) >= 0) {
          //同一个图层
          if (strplyernam.indexOf("rainVector") >= 0) {
            prelyr.removeAllFeatures();
          }
          map.removeLayer(prelyr);
          prey--;
          isfind = true;
        }
      }
    }
    if (isfind) {
      $("body", parent.document)
        .find("#map_tuli")
        .hide();
      $("body", parent.document)
        .find("#marker_map_name_id")
        .hide();
    }
  }
}
/**
 * 获取分析结果数据
 * @return
 */
var mapMC, mapMC2, mapSiteMC;
function requestTest(type) {
  //    	map.events.un({"click":provinceClickMapHandler});
  //		 $("body",window.document).find('#map').html("");
  app.selstormid = type;

  if (isDownload != "true") {
    isDownload = "false";
  }
  shadeprovinceVector.removeAllFeatures();
  map.setCenter(
    new SuperMap.LonLat(103.07567641634, 36.855795258955).transform(
      "EPSG:4490",
      "EPSG:900913"
    ),
    2
  );
  var quyu = $("input:radio[name=quyu]:checked").val();
  var city = $(".city")
    .find("option:selected")
    .text();
  var latstart = $("#latstart").val();
  var latend = $("#latend").val();
  var lonstart = $("#lonstart").val();
  var lonsend = $("#lonend").val();
  if (quyu == "全国") {
    positiondata = quyu;
  } else if (quyu == "分省") {
    positiondata = city;
  } else {
    positiondata = latstart + "-" + latend + "-" + lonstart + "-" + lonsend;
  }
  app.selectArea = positiondata;
  //构造缓存替换矢量图层20160504
  var prelayname = "rainVector";
  if (type == undefined) prelayname = "rainVector";
  else prelayname = "rainVector" + type;
  var currVectorlyer = map.getLayer(prelayname);
  if (currVectorlyer == null) {
    currVectorlyer = new SuperMap.Layer.Vector(prelayname);
    currVectorlyer.id = prelayname;
    map.addLayers([currVectorlyer]);

    //    		map.setLayerIndex(xzqhLayer,map.getNumLayers()-1);
    //    		map.setLayerIndex(layer2,map.getNumLayers()-1);//将注记设置到最上面
  }
  rainVector = currVectorlyer;
  //drawPolygon = new SuperMap.Control.DrawFeature(rainVector, SuperMap.Handler.Polygon);
  //控制图层的显隐
  //		controlVectorLaysByNam(type);
  if (rainVector != null) {
    rainVector.removeAllFeatures();
  } else {
    //rainVector = new SuperMap.Layer.Vector("rainVector");
    //map.addLayers([rainVector]);
    //map.setLayerIndex(xzqhLayer,map.getNumLayers()-1);
    //map.setLayerIndex(layer2,map.getNumLayers()-1);//将注记设置到最上面
  }
  dataType = $("input[name='datatype']:checked").val();
  dataNumberType = $("#typeSelector").val();
  startYear = $("#datastartime").val();
  endYear = $("#dataendtime").val();
  dateType = $("input[name='shiduan']:checked").val();
  var shiduandata = "";
  if ($("input[name='shiduandata']:checked").val() == "参考时段") {
    shiduandata = $("#cankaotime").val() + "";
  } else {
    shiduandata = $("#zidingdatastar").val() + "-" + $("#zidingdataend").val();
  }
  if ($("#temperatureInput").attr("checked") == true) {
    meteoElement = $("#qihoudataSelector").val();
  } else if ($("#extremeClimateInput").attr("checked") == true) {
    meteoElement = $("#extremeClimateSelect").val();
  } else {
    meteoElement = "precipitation";
  }

  timeResolution = $("#timefenSelector").val();
  if (startYear > endYear) {
    alert("开始时间不能大于结束时间");
    return;
  }
  if (
    timeResolution != "yearAverage" &&
    (meteoElement == "r20mm" || meteoElement == "r95p")
  ) {
    alert("目前大于20mm降水日数、降水强度要素只有年数据");
    controlTip(false, "当前暂无数据!");
    return;
  }
  if (
    dataType != "global" &&
    (meteoElement == "r20mm" ||
      meteoElement == "r95p" ||
      meteoElement == "rx5day" ||
      meteoElement == "tnn" ||
      meteoElement == "txx")
  ) {
    alert("目前极端气候要素只有全球预估模式数据");
    controlTip(false, "当前暂无数据!");
    return;
  }
  var tempdate = isDownload;
  var param =
    "{dataType:'" +
    dataType +
    "',sdate:'" +
    startYear +
    "',edate:'" +
    endYear +
    "',dateType:'" +
    dateType +
    "',shiduandata:'" +
    shiduandata +
    "',dataNumberType:'" +
    dataNumberType +
    "',meteoElement:'" +
    meteoElement +
    "',timeResolution:'" +
    timeResolution +
    "',isDownload:'" +
    isDownload +
    "',typeFlag:'" +
    typeFlag +
    "'}";
  $.ajax({
    type: "post",
    contentType: "application/json;charset=utf-8",
    dataType: "xml",
    url: moserverAction,
    data: wrapMethodName("geCZFXResult", param),
    //   async: false,
    success: function(xml) {
      var jsonStr = "";
      if ($.browser.msie || $.browser.mozilla) {
        var nn = xml.getElementsByTagName("ns1:out")[0].childNodes.length;
        for (var n = 0; n < nn; n++) {
          jsonStr += xml.getElementsByTagName("ns1:out")[0].childNodes[n].data;
        }
      } else {
        $(xml)
          .find("out")
          .each(function() {
            if (jsonStr == "") {
              jsonStr = $(this).text();
            } else {
              jsonStr = jsonStr + $(this).text();
            }
          });
      }
      var data = eval("(" + jsonStr + ")");
      dataColor = data;
      //dataUrl=data.dataUrl;
      $("#dataUrl").val(data.dataUrl);
      //alert(data.dataUrl);
      if (data != null && data != "") {
        //    				rainVector = new SuperMap.Layer.Vector("rainVector");
        var region,
          vArray = new Array();
        $.each(data.geoRegionResults, function(idx, regionItem) {
          if (
            regionItem.maxGeoRegion != null &&
            regionItem.maxGeoRegion.length != 0
          ) {
            //判断外层
            var points = new Array();
            $.each(regionItem.maxGeoRegion.point2ds, function(idx2, pointItem) {
              points[idx2] = new SuperMap.Geometry.Point(
                pointItem.pointX,
                pointItem.pointY
              ).transform("EPSG:4490", "EPSG:3857");
            });
            var line1 = new SuperMap.Geometry.LinearRing(points);
            if (
              regionItem.minGeoRegions != null &&
              regionItem.minGeoRegions.length != 0
            ) {
              //判断是否有内层
              var mulregions = new Array();
              mulregions[0] = line1;
              $.each(regionItem.minGeoRegions, function(idx3, subpointItem) {
                var points2 = new Array();
                var mullenght = mulregions.length;
                $.each(subpointItem.point2ds, function(idx4, psubpointItem) {
                  points2[idx4] = new SuperMap.Geometry.Point(
                    psubpointItem.pointX,
                    psubpointItem.pointY
                  ).transform("EPSG:4490", "EPSG:3857");
                });
                var line2 = new SuperMap.Geometry.LinearRing(points2);
                mulregions[mullenght + 1] = line2;
              });
              region = new SuperMap.Geometry.Polygon(mulregions);
            } else {
              region = new SuperMap.Geometry.Polygon([line1]);
            }
            var regionVector = new SuperMap.Feature.Vector(region);
            regionVector.attributes.maxValue = regionItem.maxValue;
            regionVector.attributes.minValue = regionItem.minValue;
            if (
              regionItem.color.red == 255 &&
              regionItem.color.green == 255 &&
              regionItem.color.blue == 255
            ) {
              regionVector.style = {
                fillColor: rgbToHex(
                  regionItem.color.red,
                  regionItem.color.green,
                  regionItem.color.blue
                ),
                fillOpacity: 0,
                strokeWidth: 0
              };
            } else {
              regionVector.style = {
                fillColor: rgbToHex(
                  regionItem.color.red,
                  regionItem.color.green,
                  regionItem.color.blue
                ),
                fillOpacity: 0.65,
                strokeWidth: 0
              };
            }
            vArray.push(regionVector);
          }
        });
        rainVector.addFeatures(vArray);
        //    				vArray = null;
        //    				map.addLayers([rainVector]);
        var html = "";
        if (dateType == "pjc") {
          if (
            meteoElement == "precipitation" ||
            meteoElement == "r95p" ||
            meteoElement == "rx5day"
          ) {
            html +=
              "<div><table><tr><td style='text-align: center;background-color:#7392D8;height:24px;font-size:12px;color:white'>&nbsp;图例&nbsp;(mm)&nbsp;</td></tr>";
          } else if (meteoElement == "r20mm") {
            html +=
              "<div><table><tr><td style='text-align: center;background-color:#7392D8;height:24px;font-size:12px;color:white'>&nbsp;图例&nbsp;(日)&nbsp;</td></tr>";
          } else {
            html +=
              "<div><table><tr><td style='text-align: center;background-color:#7392D8;height:24px;font-size:12px;color:white'>&nbsp;图例&nbsp;(℃)&nbsp;</td></tr>";
          }
        } else {
          html +=
            "<div><table><tr><td style='text-align: center;background-color:#7392D8;height:24px;font-size:12px;color:white'>&nbsp;图例&nbsp;(%)&nbsp;</td></tr>";
        }
        var htmlColor = "";
        var colorsLength = 1 + 2; //预留2个单位长度
        $.each(data.legend.colors, function(idx_c, color) {
          colorsLength++;
          var htmlCache = "";
          htmlCache =
            "<tr><td style='height:20px;'>&nbsp;<span style='height:20px;background-color:" +
            rgbToHex(color.red, color.green, color.blue);
          if (idx_c == 0) {
            if (
              (meteoElement == "precipitation" ||
                meteoElement == "r95p" ||
                meteoElement == "rx5day" ||
                meteoElement == "r20mm") &&
              dateType != "jp"
            ) {
              htmlCache +=
                "'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>&nbsp;&nbsp;" +
                data.legend.colorValues[idx_c] +
                "-" +
                data.legend.colorValues[idx_c + 1] +
                "&nbsp;</td></tr>";
            } else {
              htmlCache +=
                "'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>&nbsp;&nbsp;&lt;" +
                data.legend.colorValues[idx_c + 1] +
                "&nbsp;</td></tr>";
            }
          } else if (idx_c < data.legend.colors.length - 1) {
            htmlCache +=
              "'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>&nbsp;&nbsp;" +
              data.legend.colorValues[idx_c] +
              "-" +
              data.legend.colorValues[idx_c + 1] +
              "&nbsp;</td></tr>";
          } else {
            htmlCache +=
              "'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>&nbsp;&nbsp;&gt;" +
              data.legend.colorValues[idx_c] +
              "&nbsp;</td></tr>";
          }
          htmlColor = htmlCache + htmlColor;
        });
        html += htmlColor;
        html += "</table></div>";
        if (meteoElement == "precipitation") {
          mapMC =
            startYear +
            "年-" +
            endYear +
            "年" +
            " " +
            $("input[name='datatype']:checked").attr("title") +
            " " +
            $("input[name='shiduan']:checked").attr("title") +
            $("#timefenSelector option:selected").html() +
            " 降水";
        } else if (
          meteoElement == "r20mm" ||
          meteoElement == "r95p" ||
          meteoElement == "rx5day" ||
          meteoElement == "tnn" ||
          meteoElement == "txx"
        ) {
          mapMC =
            startYear +
            "年-" +
            endYear +
            "年" +
            " " +
            $("input[name='datatype']:checked").attr("title") +
            " " +
            $("input[name='shiduan']:checked").attr("title") +
            $("#timefenSelector option:selected").html() +
            $("#extremeClimateSelect option:selected").html();
        } else {
          mapMC =
            startYear +
            "年-" +
            endYear +
            "年" +
            " " +
            $("input[name='datatype']:checked").attr("title") +
            " " +
            $("input[name='shiduan']:checked").attr("title") +
            $("#timefenSelector option:selected").html() +
            $("#qihoudataSelector option:selected").html();
        }
        rainVector.name = mapMC;
        if (app.selectArea != "全国") {
          getFeaturesBySQL(app.selectArea);
        }
        if (window.swit == 1 && window.app.rainMapVisable) {
          $("body", window.document)
            .find("#tuli")
            .html(html);
          $("body", window.document)
            .find("#map_name")
            .html(mapMC);
          $("body", window.document)
            .find("#tuli")
            .show();
          $("body", window.document)
            .find("#map_name")
            .show();
          if ($("input[name='quyu']:checked").val() == "全国") {
            $("body", window.document)
              .find("#nanhai")
              .show();
          }
          //        		    	markerLayer.setVisibility(true);
          //        		    	xzqhLayer.setVisibility(false);
          controlTip(false, "数据请求完毕！");
          if (tempdate == "true") {
            var dataUrl = $("#dataUrl").val();
            window.self.location = action;
          }
        } else if (!window.app.rainMapVisable) {
          window.app.rainMapVisable = true; //恢复默认值
        }
      } else {
        controlTip(false, "当前暂无数据!");
        delVectorLayerByNam("");
      }
      requestTestFlag = true;
    },
    error: function() {
      controlTip(false, "请求失败!");
    }
  });
}

function geCZFXResult(sdate, edate, stormid) {
  $("body", parent.document)
    .find("#map_name")
    .html("");
  app.selstormid = stormid;
  //构造缓存替换矢量图层20160504
  var prelayname = "rainVector";
  if (stormid == undefined) prelayname = "rainVector";
  else prelayname = "rainVector" + stormid;
  var currVectorlyer = map.getLayer(prelayname);
  if (currVectorlyer == null) {
    currVectorlyer = new SuperMap.Layer.Vector(prelayname);
    currVectorlyer.id = prelayname;
    map.addLayers([currVectorlyer]);
    map.setLayerIndex(xzqhLayer, map.getNumLayers() - 1);
    map.setLayerIndex(layer2, map.getNumLayers() - 1); //将注记设置到最上面
  }
  rainVector = currVectorlyer;
  //控制图层的显隐
  controlVectorLaysByNam(stormid);
  if (rainVector != null) {
    rainVector.removeAllFeatures();
  } else {
    //rainVector = new SuperMap.Layer.Vector("rainVector");
    //map.addLayers([rainVector]);
    //map.setLayerIndex(xzqhLayer,map.getNumLayers()-1);
    //map.setLayerIndex(layer2,map.getNumLayers()-1);//将注记设置到最上面
  }
  $.ajax({
    url: "/MDMIS/geCZFXResult.do",
    type: "POST",
    dataType: "json",
    data: {
      sdate: sdate,
      edate: edate
    },
    success: function(data) {
      if (data != null && data != "") {
        //    				rainVector = new SuperMap.Layer.Vector("rainVector");
        var region,
          vArray = new Array();
        $.each(data.geoRegionResults, function(idx, regionItem) {
          if (
            regionItem.maxGeoRegion != null &&
            regionItem.maxGeoRegion.length != 0
          ) {
            //判断外层
            var points = new Array();
            $.each(regionItem.maxGeoRegion.point2ds, function(idx2, pointItem) {
              points[idx2] = new SuperMap.Geometry.Point(
                pointItem.pointX,
                pointItem.pointY
              ).transform("EPSG:4490", "EPSG:900913");
            });
            var line1 = new SuperMap.Geometry.LinearRing(points);
            if (
              regionItem.minGeoRegions != null &&
              regionItem.minGeoRegions.length != 0
            ) {
              //判断是否有内层
              var mulregions = new Array();
              mulregions[0] = line1;
              $.each(regionItem.minGeoRegions, function(idx3, subpointItem) {
                var points2 = new Array();
                var mullenght = mulregions.length;
                $.each(subpointItem.point2ds, function(idx4, psubpointItem) {
                  points2[idx4] = new SuperMap.Geometry.Point(
                    psubpointItem.pointX,
                    psubpointItem.pointY
                  ).transform("EPSG:4490", "EPSG:900913");
                });
                var line2 = new SuperMap.Geometry.LinearRing(points2);
                mulregions[mullenght + 1] = line2;
              });
              region = new SuperMap.Geometry.Polygon(mulregions);
            } else {
              region = new SuperMap.Geometry.Polygon([line1]);
            }
            var regionVector = new SuperMap.Feature.Vector(region);
            regionVector.attributes.maxValue = regionItem.maxValue;
            regionVector.attributes.minValue = regionItem.minValue;
            if (
              regionItem.color.red == 255 &&
              regionItem.color.green == 255 &&
              regionItem.color.blue == 255
            ) {
              regionVector.style = {
                fillColor: rgbToHex(
                  regionItem.color.red,
                  regionItem.color.green,
                  regionItem.color.blue
                ),
                fillOpacity: 0,
                strokeWidth: 0
              };
            } else {
              regionVector.style = {
                fillColor: rgbToHex(
                  regionItem.color.red,
                  regionItem.color.green,
                  regionItem.color.blue
                ),
                fillOpacity: 0.65,
                strokeWidth: 0
              };
            }
            vArray.push(regionVector);
          }
        });
        rainVector.addFeatures(vArray);
        vArray = null;
        //    				map.addLayers([rainVector]);

        var html = "";
        html +=
          "<div><table><tr><td style='text-align: center;background-color:#7392D8;height:24px;font-size:12px;color:white'>&nbsp;图例&nbsp;(mm)&nbsp;</td></tr>";
        $.each(data.legend.colors, function(idx_c, color) {
          html +=
            "<tr><td style='height:20px;'>&nbsp;<span style='height:20px;background-color:" +
            rgbToHex(color.red, color.green, color.blue);
          if (idx_c == 0) {
            html +=
              "'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>&nbsp;&nbsp;无降水&nbsp;</td></tr>";
          } else if (idx_c < data.legend.colors.length - 1) {
            html +=
              "'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>&nbsp;&nbsp;" +
              data.legend.colorValues[idx_c] +
              "-" +
              data.legend.colorValues[idx_c + 1] +
              "&nbsp;</td></tr>";
          } else {
            html +=
              "'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>&nbsp;&nbsp;&gt;" +
              data.legend.colorValues[idx_c] +
              "&nbsp;</td></tr>";
          }
        });

        html += "</table></div>";
        mapMC =
          "<div id='marker_map_name_id'>过程累计降水量分布图" +
          "" +
          "<br><span style='font-size:14px;'>" +
          sdate.split("-")[0] +
          "年" +
          parseInt(sdate.split("-")[1]) +
          "月" +
          parseInt(sdate.split("-")[2]) +
          "日";
        if (sdate != edate) {
          mapMC +=
            "—" +
            parseInt(edate.split("-")[1]) +
            "月" +
            parseInt(edate.split("-")[2]) +
            "日";
        }
        mapMC += "<span></div>";
        rainVector.name = mapMC;
        if (window.parent.swit == 1 && window.parent.app.rainMapVisable) {
          $("body", parent.document)
            .find("#map_tuli")
            .html(html);
          $("body", parent.document)
            .find("#map_name")
            .html(mapMC);
          $("body", parent.document)
            .find("#map_tuli")
            .show();
          $("body", parent.document)
            .find("#map_name")
            .show();
          xzqhLayer.setVisibility(true);
          layer1.setVisibility(false);
          layer2.setVisibility(false);
        } else if (!window.parent.app.rainMapVisable) {
          window.parent.app.rainMapVisable = true; //恢复默认值
        }
      } else {
        delVectorLayerByNam(app.selstormid);
      }
    }
  });
  xzqhVector;
}
function geCZFXResult2(date, stormid) {
  $("body", parent.document)
    .find("#map_name")
    .html("");
  //    	if(rainDailyVector!=null){
  //    		rainDailyVector.removeAllFeatures();
  //    	}else{
  //    		rainDailyVector = new SuperMap.Layer.Vector("rainDailyVector");
  //    		map.addLayers([rainDailyVector]);
  //    		map.setLayerIndex(xzqhLayer,map.getNumLayers()-1);
  //    		map.setLayerIndex(layer2,map.getNumLayers()-1);//将注记设置到最上面
  //    	}
  app.selstormid = stormid;
  var prelayname = "rainVector";
  if (stormid == undefined) prelayname = "rainVector";
  else prelayname = "rainVector" + stormid;
  if (date != null) {
    prelayname = prelayname + "-" + date.substring(5);
  }
  var currVectorlyer = map.getLayer(prelayname);
  var isexit = false; ///是否存在图层
  if (currVectorlyer != null) {
    isexit = true;
  }
  if (currVectorlyer == null) {
    currVectorlyer = new SuperMap.Layer.Vector(prelayname);
    currVectorlyer.id = prelayname;
    map.addLayers([currVectorlyer]);
    map.setLayerIndex(xzqhLayer, map.getNumLayers() - 1);
    map.setLayerIndex(layer2, map.getNumLayers() - 1); //将注记设置到最上面
  }
  rainVector = currVectorlyer;
  //控制图层的显隐
  controlVectorLaysByNam(stormid, date);
  if (isexit) return; //////直接返回
  $.ajax({
    url: "/MDMIS/geCZFXResult.do",
    type: "POST",
    dataType: "json",
    data: {
      sdate: date,
      edate: date
    },
    success: function(data) {
      if (data != null && data != "") {
        var region,
          vArray = new Array();
        $.each(data.geoRegionResults, function(idx, regionItem) {
          if (
            regionItem.maxGeoRegion != null &&
            regionItem.maxGeoRegion.length != 0
          ) {
            //判断外层
            var points = new Array();
            $.each(regionItem.maxGeoRegion.point2ds, function(idx2, pointItem) {
              points[idx2] = new SuperMap.Geometry.Point(
                pointItem.pointX,
                pointItem.pointY
              ).transform("EPSG:4490", "EPSG:900913");
            });
            var line1 = new SuperMap.Geometry.LinearRing(points);
            if (
              regionItem.minGeoRegions != null &&
              regionItem.minGeoRegions.length != 0
            ) {
              //判断是否有内层
              var mulregions = new Array();
              mulregions[0] = line1;
              $.each(regionItem.minGeoRegions, function(idx3, subpointItem) {
                var points2 = new Array();
                var mullenght = mulregions.length;
                $.each(subpointItem.point2ds, function(idx4, psubpointItem) {
                  points2[idx4] = new SuperMap.Geometry.Point(
                    psubpointItem.pointX,
                    psubpointItem.pointY
                  ).transform("EPSG:4490", "EPSG:900913");
                });
                var line2 = new SuperMap.Geometry.LinearRing(points2);
                mulregions[mullenght + 1] = line2;
              });
              region = new SuperMap.Geometry.Polygon(mulregions);
            } else {
              region = new SuperMap.Geometry.Polygon([line1]);
            }
            var regionVector = new SuperMap.Feature.Vector(region);
            regionVector.attributes.maxValue = regionItem.maxValue;
            regionVector.attributes.minValue = regionItem.minValue;
            if (
              regionItem.color.red == 255 &&
              regionItem.color.green == 255 &&
              regionItem.color.blue == 255
            ) {
              regionVector.style = {
                fillColor: rgbToHex(
                  regionItem.color.red,
                  regionItem.color.green,
                  regionItem.color.blue
                ),
                fillOpacity: 0,
                strokeWidth: 0
              };
            } else {
              regionVector.style = {
                fillColor: rgbToHex(
                  regionItem.color.red,
                  regionItem.color.green,
                  regionItem.color.blue
                ),
                fillOpacity: 0.65,
                strokeWidth: 0
              };
            }
            vArray.push(regionVector);
          }
        });
        rainVector.addFeatures(vArray);
        vArray = null;

        var html = "";
        html +=
          "<div><table><tr><td style='text-align: center;background-color:#7392D8;height:24px;font-size:12px;color:white'>&nbsp;图例&nbsp;(mm)&nbsp;</td></tr>";
        $.each(data.legend.colors, function(idx_c, color) {
          html +=
            "<tr><td style='height:20px;'>&nbsp;<span style='height:20px;background-color:" +
            rgbToHex(color.red, color.green, color.blue);
          if (idx_c == 0) {
            html +=
              "'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>&nbsp;&nbsp;无降水&nbsp;</td></tr>";
          } else if (idx_c < data.legend.colors.length - 1) {
            html +=
              "'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>&nbsp;&nbsp;" +
              data.legend.colorValues[idx_c] +
              "-" +
              data.legend.colorValues[idx_c + 1] +
              "&nbsp;</td></tr>";
          } else {
            html +=
              "'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>&nbsp;&nbsp;&gt;" +
              data.legend.colorValues[idx_c] +
              "&nbsp;</td></tr>";
          }
        });

        html += "</table></div>";
        mapMC2 =
          "<div id='marker_map_name_id'>全国降水量分布图" +
          "" +
          "<br><span style='font-size:14px;'>" +
          date.split("-")[0] +
          "年" +
          parseInt(date.split("-")[1]) +
          "月" +
          parseInt(date.split("-")[2]) +
          "日<span></div>";
        $("body", parent.document)
          .find("#map_tuli")
          .html(html);
        $("body", parent.document)
          .find("#map_name")
          .html(mapMC2);
        rainVector.name = mapMC2;
        if (window.parent.swit == 1) {
          $("body", parent.document)
            .find("#map_tuli")
            .show();
          $("body", parent.document)
            .find("#map_name")
            .show();
          xzqhLayer.setVisibility(true);
          layer1.setVisibility(false);
          layer2.setVisibility(false);
        }
      } else {
        delVectorLayerByNam(app.selstormid);
      }
    }
  });
}
/**
 * RGB转16进制
 * @param r
 * @param g
 * @param b
 * @return
 */
function rgbToHex(r, g, b) {
  var color = "#";
  if (r == 0) {
    color += "00";
  } else if (r < 16) {
    color += "0" + r.toString(16);
  } else {
    color += r.toString(16);
  }
  if (g == 0) {
    color += "00";
  } else if (g < 16) {
    color += "0" + g.toString(16);
  } else {
    color += g.toString(16);
  }
  if (b == 0) {
    color += "00";
  } else if (b < 16) {
    color += "0" + b.toString(16);
  } else {
    color += b.toString(16);
  }
  return color;
  //return "#"+((r << 16) | (g << 8) | b).toString(16);
}
/**
 * 设置图层可见
 */
function setLayerVisable(layerName) {
  if (window.parent.swit == 2) {
    $("body", parent.document)
      .find(".switch_map_list [data-swit='1']")
      .click();
  }
  if (layerName == "rainVector") {
    $("body", parent.document)
      .find("#map_name")
      .html(mapMC);
    $("body", parent.document)
      .find("#map_tuli")
      .show();
    $("body", parent.document)
      .find("#map_name")
      .show();
    if (rainVector) {
      layer1.setVisibility(false);
      layer2.setVisibility(false);
      xzqhLayer.setVisibility(true);
      rainVector.setVisibility(true);
    }
  } else {
    if (rainVector) {
      rainVector.setVisibility(false);
    }
  }
  if (layerName == "rainDailyVector") {
    $("body", parent.document)
      .find("#map_name")
      .html(mapMC2);
    $("body", parent.document)
      .find("#map_tuli")
      .show();
    $("body", parent.document)
      .find("#map_name")
      .show();
    if (rainDailyVector) {
      layer1.setVisibility(false);
      layer2.setVisibility(false);
      xzqhLayer.setVisibility(true);
      rainDailyVector.setVisibility(true);
    }
  } else {
    if (rainDailyVector) {
      rainDailyVector.setVisibility(false);
    }
  }
  if (
    layerName != "rainVector" &&
    layerName != "rainDailyVector" &&
    layerName != "siteMapLayer"
  ) {
    $("body", parent.document)
      .find("#map_tuli")
      .hide();
    $("body", parent.document)
      .find("#map_name")
      .hide();
  }
  if (layerName == "siteMapLayer") {
    if (siteMapLayer) {
      $("body", parent.document)
        .find("#map_name")
        .html(mapSiteMC);
      layer1.setVisibility(true);
      layer2.setVisibility(false);
      xzqhLayer.setVisibility(false);
      siteMapLayer.setVisibility(true);
      map.zoomToExtent(siteMapLayer.getDataExtent().scale(1.2));
    }
  } else {
    if (siteMapLayer) {
      siteMapLayer.setVisibility(false);
    }
  }
  if (layerName == "markerLayer") {
    if (markerLayer) {
      layer1.setVisibility(true);
      layer2.setVisibility(true);
      xzqhLayer.setVisibility(false);
      markerLayer.setVisibility(true);
    }
  } else {
    if (markerLayer) {
      markerLayer.setVisibility(false);
    }
  }
  if (layerName == "vectorLayer") {
    if (vectorLayer) {
      if (mapType != "ter") {
        addTDTbyType("ter");
      }
      layer1.setVisibility(true);
      layer2.setVisibility(false);
      xzqhLayer.setVisibility(false);
      vectorLayer.setVisibility(true);
    }
  } else {
    if (vectorLayer) {
      if (mapType != "vec") {
        addTDTbyType("vec");
      }
      vectorLayer.setVisibility(false);
    }
  }
  if (layerName == "landuseLayer") {
    if (layer_landuse) {
      layer1.setVisibility(true);
      layer2.setVisibility(false);
      xzqhLayer.setVisibility(false);
      layer_landuse.setVisibility(true);
    }
  } else {
    if (layer_landuse) {
      layer_landuse.setVisibility(false);
    }
  }
}
/**
 * 定位站点位置
 */
function siteLocation(x, y) {
  setLayerVisable("markerLayer");
  markerLayer.clearMarkers();
  var size = new SuperMap.Size(16, 16);
  //var offset = new SuperMap.Pixel(-(size.w/2), -size.h);
  var icon = new SuperMap.Icon("../images/gis/marker_red.gif", size); //, offset
  marker = new SuperMap.Marker(
    new SuperMap.LonLat(y, x).transform("EPSG:4490", "EPSG:900913"),
    icon
  );
  markerLayer.addMarker(marker);
}
/**
 * 暴雨过程暴雨站分布图
 */
function siteMap(data, sdate, edate) {
  siteMapLayer.removeAllFeatures();
  $.each(data, function(i, item) {
    var point = new SuperMap.Geometry.Point(item.v06001, item.v05001).transform(
      "EPSG:4490",
      "EPSG:900913"
    );
    var pointVector = new SuperMap.Feature.Vector(point);
    var color = "#FFFFFF";
    if (item.v_es_total_rainfull < 0.1) {
      color = "#FFFFFF";
    } else if (item.v_es_total_rainfull < 10) {
      color = "#A6F28F";
    } else if (item.v_es_total_rainfull < 25) {
      color = "#3DBA3D";
    } else if (item.v_es_total_rainfull < 50) {
      color = "#61B8FF";
    } else if (item.v_es_total_rainfull < 100) {
      color = "#0000FF";
    } else if (item.v_es_total_rainfull < 250) {
      color = "#FA00FA";
    } else {
      color = "#800040";
    }
    pointVector.style = {
      fillColor: color,
      strokeWidth: 1,
      strokeColor: "#ffffff",
      label: item.ch_name,
      labelAlign: "lt",
      labelXOffset: 3,
      labelYOffset: -3,
      fontFamily: "微软雅黑",
      fontSize: "8px",
      pointRadius: 4
    };
    pointVector.toolTip = "站点名称：" + item.ch_name;
    siteMapLayer.addFeatures([pointVector]);
  });
  siteMapLayer.setVisibility(false);
  mapSiteMC =
    "<div id='marker_map_name_id'>暴雨站点分布图" +
    "<br><span style='font-size:14px;'>" +
    sdate.split("-")[0] +
    "年" +
    parseInt(sdate.split("-")[1]) +
    "月" +
    parseInt(sdate.split("-")[2]) +
    "日";
  if (sdate != edate) {
    mapSiteMC +=
      "—" +
      parseInt(edate.split("-")[1]) +
      "月" +
      parseInt(edate.split("-")[2]) +
      "日";
  }
  mapSiteMC += "<span></div>";
}
/**
 * 暴雨过程实施影响评估-山洪沟影响评估
 */
var shg_name_obj,
  shg_num = 0,
  yhd_num = 0,
  shg_geo_len = 0;
function zq_shg(yhd) {
  vectorLayer.removeAllFeatures();
  shg_name_obj = new Object();
  shg_num = 0; //记录受影响的山洪沟个数
  yhd_num = 0; //记录受影响的隐患点个数
  shg_geo_len = 0;
  //走数据集集合查询，根据插值分析结果对山洪沟数据集进行查询
  $.each(rainVector.features, function(i, feaItem) {
    if (feaItem.attributes.maxValue > 50) {
      $.each(yhd, function(i, yhdItem) {
        if (
          feaItem.geometry.distanceTo(
            new SuperMap.Geometry.Point(yhdItem.LON, yhdItem.LAT).transform(
              "EPSG:4490",
              "EPSG:900913"
            )
          ) <= 0
        ) {
          yhd_num = yhd_num + 1;
        }
      });
      shg_geo_len = shg_geo_len + 1;
      getSHGByGeometry(feaItem.geometry);
    }
  });
}
function getSHGByGeometry(geometry) {
  var getFeaturesByGeometryParameters, getFeaturesByGeometryService;
  getFeaturesByGeometryParameters = new SuperMap.REST.GetFeaturesByGeometryParameters(
    {
      datasetNames: ["china:fjshg344"],
      toIndex: -1,
      spatialQueryMode: SuperMap.REST.SpatialQueryMode.INTERSECT,
      geometry: geometry
    }
  );
  getFeaturesByGeometryService = new SuperMap.REST.GetFeaturesByGeometryService(
    path + "/iserver/services/data-china/rest/data",
    {
      eventListeners: {
        processCompleted: function(getFeaturesEventArgs) {
          var i,
            len,
            features,
            feature,
            result = getFeaturesEventArgs.result;
          shg_geo_len = shg_geo_len - 1;
          if (result && result.features) {
            features = result.features;
            for (i = 0, len = features.length; i < len; i++) {
              feature = features[i];
              //							feature.style = style;
              if (!shg_name_obj.hasOwnProperty(feature.attributes.NAME)) {
                shg_name_obj[feature.attributes.NAME] = ""; //将已经添加到地图上的数据进行记录，防止重复添加
                shg_num = shg_num + 1;
                vectorLayer.addFeatures(feature);
              }
            }
          }
          if (shg_geo_len == 0) {
            var tabhtml =
              " <table id='stromrain_tab' class='table table-bordered'>" +
              "<tr class='success'><th width='10%'>序号</th>" +
              "<th width='18%'>省</th>" +
              "<th width=''>受影响山洪沟</th>" +
              "<th width=''>受影响隐患点</th></tr>" +
              "<tr><td>1</td><td>福建</td><td>" +
              shg_num +
              "</td><td>" +
              yhd_num +
              "</td></tr></table>";
            $("body", parent.document)
              .find("#collapsesix .inner-sub[data-con='six6'] ")
              .html(tabhtml);

            map.zoomToExtent(vectorLayer.getDataExtent().scale(1.2));
          }
        },
        processFailed: function(e) {
          alert(e.error.errorMsg);
        }
      }
    }
  );
  getFeaturesByGeometryService.processAsync(getFeaturesByGeometryParameters);
}
/**
 * 累计降水分布监听地图点击
 *
 */
function getProvincesListener(type) {
  alert(type);
  var cityVector = map.getLayersByName("borderCityVector");
  var provinceVector = map.getLayersByName("borderProvinceVector");
  if (cityVector.length > 0) {
    map.removeLayer(borderCityVector, false);
  }
  if (provinceVector.length > 0) {
    map.removeLayer(borderProvinceVector, false);
  }
  popVector.removeAllFeatures();
  closeInfoWin();
  if (null == map.getLayer("popVector")) {
    map.addLayer(popVector);
  }
  map.events.un({ click: provinceClickMapHandler });
  map.events.un({ click: cityClickMapHandler });
  map.events.un({ click: countryClickMapHandler });
  map.events.un({ click: provincegdpClickMapHandler });
  map.events.un({ click: citygdpClickMapHandler });
  map.events.un({ click: countrygdpClickMapHandler });
  map.events.un({ click: provincepopuClickMapHandler });
  map.events.un({ click: citypopuClickMapHandler });
  map.events.un({ click: countrypopuClickMapHandler });
  map.events.un({ click: provincelandClickMapHandler });
  map.events.un({ click: citylandClickMapHandler });
  map.events.un({ click: countrylandClickMapHandler });
  map.events.un({ click: provinceStationHandler });
  map.events.un({ click: cityStationHandler });
  map.events.un({ click: countryStationHandler });
  map.events.un({ click: stormdisClickMapHandler });
  if (type == "province") {
    cityVector = map.getLayersByName("borderCityVector");
    provinceVector = map.getLayersByName("borderProvinceVector");
    map.events.on({ click: provinceClickMapHandler });
    map.zoomTo(3);
    if (cityVector.length > 0) {
      map.removeLayer(borderCityVector, false);
    }
    if (provinceVector.length > 0) {
      map.removeLayer(borderProvinceVector, false);
    }
  } else if (type == "city") {
    cityVector = map.getLayersByName("borderCityVector");
    provinceVector = map.getLayersByName("borderProvinceVector");
    map.events.on({ click: cityClickMapHandler });
    map.panTo(currLonlat);
    map.zoomTo(5);
    if (cityVector.length > 0) {
      map.removeLayer(borderCityVector, false);
    }

    map.addLayer(borderProvinceVector);
  } else if (type == "country") {
    cityVector = map.getLayersByName("borderCityVector");
    provinceVector = map.getLayersByName("borderProvinceVector");
    map.events.on({ click: countryClickMapHandler });
    map.panTo(currLonlat);
    map.zoomTo(7);
    map.addLayer(borderCityVector);
    if (provinceVector.length > 0) {
      map.removeLayer(borderProvinceVector, false);
    }
  } else if (type == "provincegdp") {
    cityVector = map.getLayersByName("borderCityVector");
    provinceVector = map.getLayersByName("borderProvinceVector");
    map.events.on({ click: provincegdpClickMapHandler });
    map.zoomTo(3);
    if (cityVector.length > 0) {
      map.removeLayer(borderCityVector, false);
    }
    if (provinceVector.length > 0) {
      map.removeLayer(borderProvinceVector, false);
    }
  } else if (type == "citygdp") {
    cityVector = map.getLayersByName("borderCityVector");
    provinceVector = map.getLayersByName("borderProvinceVector");
    map.events.on({ click: citygdpClickMapHandler });
    map.panTo(currLonlat);
    map.zoomTo(5);
    if (cityVector.length > 0) {
      map.removeLayer(borderCityVector, false);
    }

    map.addLayer(borderProvinceVector);
  } else if (type == "countrygdp") {
    cityVector = map.getLayersByName("borderCityVector");
    provinceVector = map.getLayersByName("borderProvinceVector");
    map.events.on({ click: countrygdpClickMapHandler });
    map.panTo(currLonlat);
    map.zoomTo(7);
    map.addLayer(borderCityVector);
    if (provinceVector.length > 0) {
      map.removeLayer(borderProvinceVector, false);
    }
  } else if (type == "provincepopu") {
    cityVector = map.getLayersByName("borderCityVector");
    provinceVector = map.getLayersByName("borderProvinceVector");
    map.events.on({ click: provincepopuClickMapHandler });
    map.zoomTo(3);
    if (cityVector.length > 0) {
      map.removeLayer(borderCityVector, false);
    }
    if (provinceVector.length > 0) {
      map.removeLayer(borderProvinceVector, false);
    }
  } else if (type == "citypopu") {
    cityVector = map.getLayersByName("borderCityVector");
    provinceVector = map.getLayersByName("borderProvinceVector");
    map.events.on({ click: citypopuClickMapHandler });
    map.panTo(currLonlat);
    map.zoomTo(5);
    if (cityVector.length > 0) {
      map.removeLayer(borderCityVector, false);
    }

    map.addLayer(borderProvinceVector);
  } else if (type == "countrypopu") {
    cityVector = map.getLayersByName("borderCityVector");
    provinceVector = map.getLayersByName("borderProvinceVector");
    map.events.on({ click: countrypopuClickMapHandler });
    map.panTo(currLonlat);
    map.zoomTo(7);
    map.addLayer(borderCityVector);
    if (provinceVector.length > 0) {
      map.removeLayer(borderProvinceVector, false);
    }
  } else if (type == "provinceland") {
    cityVector = map.getLayersByName("borderCityVector");
    provinceVector = map.getLayersByName("borderProvinceVector");
    map.events.on({ click: provincelandClickMapHandler });
    map.zoomTo(3);
    if (cityVector.length > 0) {
      map.removeLayer(borderCityVector, false);
    }
    if (provinceVector.length > 0) {
      map.removeLayer(borderProvinceVector, false);
    }
  } else if (type == "cityland") {
    cityVector = map.getLayersByName("borderCityVector");
    provinceVector = map.getLayersByName("borderProvinceVector");
    map.events.on({ click: citylandClickMapHandler });
    map.panTo(currLonlat);
    map.zoomTo(5);
    if (cityVector.length > 0) {
      map.removeLayer(borderCityVector, false);
    }

    map.addLayer(borderProvinceVector);
  } else if (type == "countryland") {
    cityVector = map.getLayersByName("borderCityVector");
    provinceVector = map.getLayersByName("borderProvinceVector");
    map.events.on({ click: countrylandClickMapHandler });
    map.panTo(currLonlat);
    map.zoomTo(7);
    map.addLayer(borderCityVector);
    if (provinceVector.length > 0) {
      map.removeLayer(borderProvinceVector, false);
    }
  } else if (type == "stormdis") {
    cityVector = map.getLayersByName("borderCityVector");
    provinceVector = map.getLayersByName("borderProvinceVector");
    map.events.on({ click: stormdisClickMapHandler });
    if (cityVector.length > 0) {
      map.removeLayer(borderCityVector, false);
    }
    if (provinceVector.length > 0) {
      map.removeLayer(borderProvinceVector, false);
    }
  } else {
  }
}
/**
 *
 * 暴雨站点分布图监听
 */
function getStationsListener(type) {
  var cityVector = map.getLayersByName("borderCityVector");
  var provinceVector = map.getLayersByName("borderProvinceVector");
  if (cityVector.length > 0) {
    map.removeLayer(borderCityVector, false);
  }
  if (provinceVector.length > 0) {
    map.removeLayer(borderProvinceVector, false);
  }
  popVector.removeAllFeatures();
  closeInfoWin();
  if (null == map.getLayer("popVector")) {
    map.addLayer(popVector);
  }
  map.events.un({ click: provinceClickMapHandler });
  alert(1);
  map.events.un({ click: cityClickMapHandler });
  map.events.un({ click: countryClickMapHandler });
  map.events.un({ click: provincegdpClickMapHandler });
  map.events.un({ click: citygdpClickMapHandler });
  map.events.un({ click: countrygdpClickMapHandler });
  map.events.un({ click: provincepopuClickMapHandler });
  map.events.un({ click: citypopuClickMapHandler });
  map.events.un({ click: countrypopuClickMapHandler });
  map.events.un({ click: provincelandClickMapHandler });
  map.events.un({ click: citylandClickMapHandler });
  map.events.un({ click: countrylandClickMapHandler });
  map.events.un({ click: provinceStationHandler });
  map.events.un({ click: cityStationHandler });
  map.events.un({ click: countryStationHandler });
  map.events.un({ click: stormdisClickMapHandler });
  if (type == "province") {
    cityVector = map.getLayersByName("borderCityVector");
    provinceVector = map.getLayersByName("borderProvinceVector");
    map.zoomTo(3);
    if (cityVector.length > 0) {
      map.removeLayer(borderCityVector, false);
    }
    if (provinceVector.length > 0) {
      map.removeLayer(borderProvinceVector, false);
    }
    map.events.on({ click: provinceStationHandler });
  } else if (type == "city") {
    cityVector = map.getLayersByName("borderCityVector");
    provinceVector = map.getLayersByName("borderProvinceVector");
    if (cityVector.length > 0) {
      map.removeLayer(borderCityVector, false);
    }
    if (borderProvinceVector.features.length > 0) {
      map.addLayer(borderProvinceVector);
    } else {
    }

    map.events.on({ click: cityStationHandler });
    map.panTo(currLonlat);
    map.zoomTo(5);
  } else if (type == "country") {
    cityVector = map.getLayersByName("borderCityVector");
    provinceVector = map.getLayersByName("borderProvinceVector");
    map.events.on({ click: countryStationHandler });
    map.addLayer(borderCityVector);
    if (provinceVector.length > 0) {
      map.removeLayer(borderProvinceVector, false);
    }
    map.panTo(currLonlat);
    map.zoomTo(7);
  } else {
  }
}
/**
 * 累计降水分布省级查询
 * @param {Object} e
 */
function provinceClickMapHandler(e) {
  var lonlat = map.getLonLatFromPixel(new SuperMap.Pixel(e.xy.x, e.xy.y));
  var xxx = lonlat.lon.toFixed(5);
  var yyy = lonlat.lat.toFixed(5);
  currLonlat = new SuperMap.LonLat(xxx, yyy);
  var point = new SuperMap.Geometry.Point(xxx, yyy);
  var pointVector = new SuperMap.Feature.Vector(point);
  var vector = new SuperMap.Layer.Vector("vector");
  var province = "";
  vector.addFeatures([pointVector]);
  var getFeaturesByGeometryParameters, getFeaturesByGeometryService;

  getFeaturesByGeometryParameters = new SuperMap.REST.GetFeaturesByGeometryParameters(
    {
      datasetNames: ["china:province"],
      toIndex: -1,
      spatialQueryMode: SuperMap.REST.SpatialQueryMode.INTERSECT,
      geometry: pointVector.geometry
    }
  );
  getFeaturesByGeometryService = new SuperMap.REST.GetFeaturesByGeometryService(
    path + "/iserver/services/data-china/rest/data",
    {
      eventListeners: {
        processCompleted: function(getFeaturesEventArgs) {
          var i,
            len,
            features,
            feature,
            result = getFeaturesEventArgs.result;
          province = result.features[0].data.NAME;
          var geometryTemp = result.features[0].geometry;
          var currVector = new SuperMap.Feature.Vector(
            geometryTemp,
            null,
            null
          );
          var borderVector = new SuperMap.Feature.Vector(
            geometryTemp,
            null,
            style
          );
          popVector.removeAllFeatures();
          //					map.addLayer(popVector);
          borderProvinceVector.removeAllFeatures();
          borderProvinceVector.addFeatures([borderVector]);
          parent.window.getStormAreaByProvince(province);
          popVector.addFeatures([currVector]);
        },
        processFailed: function(e) {}
      }
    }
  );
  getFeaturesByGeometryService.processAsync(getFeaturesByGeometryParameters);
}
/**
 * 累计降水分布市级查询
 * @param {Object} e
 */
function cityClickMapHandler(e) {
  alert(1);
  var lonlat = map.getLonLatFromPixel(new SuperMap.Pixel(e.xy.x, e.xy.y));
  var xxx = lonlat.lon.toFixed(5);
  var yyy = lonlat.lat.toFixed(5);
  currLonlat = new SuperMap.LonLat(xxx, yyy);
  var point = new SuperMap.Geometry.Point(xxx, yyy);
  var pointVector = new SuperMap.Feature.Vector(point);
  var vector = new SuperMap.Layer.Vector("vector");
  var province = "";
  vector.addFeatures([pointVector]);
  var getFeaturesByGeometryParameters, getFeaturesByGeometryService;

  getFeaturesByGeometryParameters = new SuperMap.REST.GetFeaturesByGeometryParameters(
    {
      datasetNames: ["china:city"],
      toIndex: -1,
      spatialQueryMode: SuperMap.REST.SpatialQueryMode.INTERSECT,
      geometry: pointVector.geometry
    }
  );
  getFeaturesByGeometryService = new SuperMap.REST.GetFeaturesByGeometryService(
    path + "/iserver/services/data-china/rest/data",
    {
      eventListeners: {
        processCompleted: function(getFeaturesEventArgs) {
          var i,
            len,
            features,
            feature,
            result = getFeaturesEventArgs.result;
          province = result.features[0].data.NAME;
          var geometryTemp = result.features[0].geometry;
          var currVector = new SuperMap.Feature.Vector(geometryTemp);
          var borderVector = new SuperMap.Feature.Vector(
            geometryTemp,
            null,
            style
          );
          popVector.removeAllFeatures();
          borderCityVector.removeAllFeatures();
          borderCityVector.addFeatures([borderVector]);
          parent.window.getStormAreaByCity(province);
          popVector.addFeatures([currVector]);
        },
        processFailed: function(e) {}
      }
    }
  );
  getFeaturesByGeometryService.processAsync(getFeaturesByGeometryParameters);
}
/**
 * 累计降水分布县级查询
 * @param {Object} e
 */
function countryClickMapHandler(e) {
  var lonlat = map.getLonLatFromPixel(new SuperMap.Pixel(e.xy.x, e.xy.y));
  var xxx = lonlat.lon.toFixed(5);
  var yyy = lonlat.lat.toFixed(5);
  currLonlat = new SuperMap.LonLat(xxx, yyy);
  var point = new SuperMap.Geometry.Point(xxx, yyy);
  var pointVector = new SuperMap.Feature.Vector(point);
  var vector = new SuperMap.Layer.Vector("vector");
  var province = "";
  vector.addFeatures([pointVector]);
  var getFeaturesByGeometryParameters, getFeaturesByGeometryService;

  getFeaturesByGeometryParameters = new SuperMap.REST.GetFeaturesByGeometryParameters(
    {
      datasetNames: ["china:county"],
      toIndex: -1,
      spatialQueryMode: SuperMap.REST.SpatialQueryMode.INTERSECT,
      geometry: pointVector.geometry
    }
  );
  getFeaturesByGeometryService = new SuperMap.REST.GetFeaturesByGeometryService(
    path + "/iserver/services/data-china/rest/data",
    {
      eventListeners: {
        processCompleted: function(getFeaturesEventArgs) {
          var i,
            len,
            features,
            feature,
            result = getFeaturesEventArgs.result;
          province = result.features[0].data.NAME;
          var geometryTemp = result.features[0].geometry;
          var currVector = new SuperMap.Feature.Vector(geometryTemp);
          popVector.removeAllFeatures();
          parent.window.getStormAreaByCountry(province);
          popVector.addFeatures([currVector]);
        },
        processFailed: function(e) {}
      }
    }
  );
  getFeaturesByGeometryService.processAsync(getFeaturesByGeometryParameters);
}
/**
 * 累计降水分布省级查询
 * @param {Object} e
 */
function provinceStationHandler(e) {
  var lonlat = map.getLonLatFromPixel(new SuperMap.Pixel(e.xy.x, e.xy.y));
  var xxx = lonlat.lon.toFixed(5);
  var yyy = lonlat.lat.toFixed(5);
  currLonlat = new SuperMap.LonLat(xxx, yyy);
  var point = new SuperMap.Geometry.Point(xxx, yyy);
  var pointVector = new SuperMap.Feature.Vector(point);
  var vector = new SuperMap.Layer.Vector("vector");
  var province = "";
  vector.addFeatures([pointVector]);
  var getFeaturesByGeometryParameters, getFeaturesByGeometryService;

  getFeaturesByGeometryParameters = new SuperMap.REST.GetFeaturesByGeometryParameters(
    {
      datasetNames: ["china:province"],
      toIndex: -1,
      spatialQueryMode: SuperMap.REST.SpatialQueryMode.INTERSECT,
      geometry: pointVector.geometry
    }
  );
  getFeaturesByGeometryService = new SuperMap.REST.GetFeaturesByGeometryService(
    path + "/iserver/services/data-china/rest/data",
    {
      eventListeners: {
        processCompleted: function(getFeaturesEventArgs) {
          var i,
            len,
            features,
            feature,
            result = getFeaturesEventArgs.result;
          province = result.features[0].data.NAME;
          var geometryTemp = result.features[0].geometry;
          var currVector = new SuperMap.Feature.Vector(geometryTemp);
          var borderVector = new SuperMap.Feature.Vector(
            geometryTemp,
            null,
            style
          );
          popVector.removeAllFeatures();
          //					map.addLayer(popVector);
          borderProvinceVector.removeAllFeatures();
          borderProvinceVector.addFeatures([borderVector]);
          parent.window.getStormStationByProvince(province);
          popVector.addFeatures([currVector]);
        },
        processFailed: function(e) {}
      }
    }
  );
  getFeaturesByGeometryService.processAsync(getFeaturesByGeometryParameters);
}
/**
 * 累计降水分布市级查询
 * @param {Object} e
 */
function cityStationHandler(e) {
  var lonlat = map.getLonLatFromPixel(new SuperMap.Pixel(e.xy.x, e.xy.y));
  var xxx = lonlat.lon.toFixed(5);
  var yyy = lonlat.lat.toFixed(5);
  currLonlat = new SuperMap.LonLat(xxx, yyy);
  var point = new SuperMap.Geometry.Point(xxx, yyy);
  var pointVector = new SuperMap.Feature.Vector(point);
  var vector = new SuperMap.Layer.Vector("vector");
  var province = "";
  vector.addFeatures([pointVector]);
  var getFeaturesByGeometryParameters, getFeaturesByGeometryService;

  getFeaturesByGeometryParameters = new SuperMap.REST.GetFeaturesByGeometryParameters(
    {
      datasetNames: ["china:city"],
      toIndex: -1,
      spatialQueryMode: SuperMap.REST.SpatialQueryMode.INTERSECT,
      geometry: pointVector.geometry
    }
  );
  getFeaturesByGeometryService = new SuperMap.REST.GetFeaturesByGeometryService(
    path + "/iserver/services/data-china/rest/data",
    {
      eventListeners: {
        processCompleted: function(getFeaturesEventArgs) {
          var i,
            len,
            features,
            feature,
            result = getFeaturesEventArgs.result;
          province = result.features[0].data.NAME;
          var geometryTemp = result.features[0].geometry;
          var currVector = new SuperMap.Feature.Vector(geometryTemp);
          var borderVector = new SuperMap.Feature.Vector(
            geometryTemp,
            null,
            style
          );
          popVector.removeAllFeatures();
          borderCityVector.removeAllFeatures();
          borderCityVector.addFeatures([borderVector]);
          parent.window.getStormStationByCity(province);
          popVector.addFeatures([currVector]);
        },
        processFailed: function(e) {}
      }
    }
  );
  getFeaturesByGeometryService.processAsync(getFeaturesByGeometryParameters);
}
/**
 * 累计降水分布县级查询
 * @param {Object} e
 */
function countryStationHandler(e) {
  var lonlat = map.getLonLatFromPixel(new SuperMap.Pixel(e.xy.x, e.xy.y));
  var xxx = lonlat.lon.toFixed(5);
  var yyy = lonlat.lat.toFixed(5);
  currLonlat = new SuperMap.LonLat(xxx, yyy);
  var point = new SuperMap.Geometry.Point(xxx, yyy);
  var pointVector = new SuperMap.Feature.Vector(point);
  var vector = new SuperMap.Layer.Vector("vector");
  var province = "";
  vector.addFeatures([pointVector]);
  var getFeaturesByGeometryParameters, getFeaturesByGeometryService;

  getFeaturesByGeometryParameters = new SuperMap.REST.GetFeaturesByGeometryParameters(
    {
      datasetNames: ["china:county"],
      toIndex: -1,
      spatialQueryMode: SuperMap.REST.SpatialQueryMode.INTERSECT,
      geometry: pointVector.geometry
    }
  );
  getFeaturesByGeometryService = new SuperMap.REST.GetFeaturesByGeometryService(
    path + "/iserver/services/data-china/rest/data",
    {
      eventListeners: {
        processCompleted: function(getFeaturesEventArgs) {
          var i,
            len,
            features,
            feature,
            result = getFeaturesEventArgs.result;
          province = result.features[0].data.NAME;
          var geometryTemp = result.features[0].geometry;
          var currVector = new SuperMap.Feature.Vector(geometryTemp);
          popVector.removeAllFeatures();
          parent.window.getStormStationByCountry(province);
          popVector.addFeatures([currVector]);
        },
        processFailed: function(e) {}
      }
    }
  );
  getFeaturesByGeometryService.processAsync(getFeaturesByGeometryParameters);
}
function provincegdpClickMapHandler(e) {
  var lonlat = map.getLonLatFromPixel(new SuperMap.Pixel(e.xy.x, e.xy.y));
  var xxx = lonlat.lon.toFixed(5);
  var yyy = lonlat.lat.toFixed(5);
  currLonlat = new SuperMap.LonLat(xxx, yyy);
  var point = new SuperMap.Geometry.Point(xxx, yyy);
  var pointVector = new SuperMap.Feature.Vector(point);
  var vector = new SuperMap.Layer.Vector("vector");
  var province = "";
  vector.addFeatures([pointVector]);
  var getFeaturesByGeometryParameters, getFeaturesByGeometryService;

  getFeaturesByGeometryParameters = new SuperMap.REST.GetFeaturesByGeometryParameters(
    {
      datasetNames: ["china:province"],
      toIndex: -1,
      spatialQueryMode: SuperMap.REST.SpatialQueryMode.INTERSECT,
      geometry: pointVector.geometry
    }
  );
  getFeaturesByGeometryService = new SuperMap.REST.GetFeaturesByGeometryService(
    path + "/iserver/services/data-china/rest/data",
    {
      eventListeners: {
        processCompleted: function(getFeaturesEventArgs) {
          var i,
            len,
            features,
            feature,
            result = getFeaturesEventArgs.result;
          province = result.features[0].data.NAME;
          var geometryTemp = result.features[0].geometry;
          var currVector = new SuperMap.Feature.Vector(geometryTemp);
          var borderVector = new SuperMap.Feature.Vector(
            geometryTemp,
            null,
            style
          );
          popVector.removeAllFeatures();
          borderProvinceVector.removeAllFeatures();
          borderProvinceVector.addFeatures([borderVector]);
          parent.window.getStormAreaByProvincegdp(province);
          popVector.addFeatures([currVector]);
        },
        processFailed: function(e) {}
      }
    }
  );
  getFeaturesByGeometryService.processAsync(getFeaturesByGeometryParameters);
}
function citygdpClickMapHandler(e) {
  var lonlat = map.getLonLatFromPixel(new SuperMap.Pixel(e.xy.x, e.xy.y));
  var xxx = lonlat.lon.toFixed(5);
  var yyy = lonlat.lat.toFixed(5);
  currLonlat = new SuperMap.LonLat(xxx, yyy);
  var point = new SuperMap.Geometry.Point(xxx, yyy);
  var pointVector = new SuperMap.Feature.Vector(point);
  var vector = new SuperMap.Layer.Vector("vector");
  var province = "";
  vector.addFeatures([pointVector]);
  var getFeaturesByGeometryParameters, getFeaturesByGeometryService;

  getFeaturesByGeometryParameters = new SuperMap.REST.GetFeaturesByGeometryParameters(
    {
      datasetNames: ["china:city"],
      toIndex: -1,
      spatialQueryMode: SuperMap.REST.SpatialQueryMode.INTERSECT,
      geometry: pointVector.geometry
    }
  );
  getFeaturesByGeometryService = new SuperMap.REST.GetFeaturesByGeometryService(
    path + "/iserver/services/data-china/rest/data",
    {
      eventListeners: {
        processCompleted: function(getFeaturesEventArgs) {
          var i,
            len,
            features,
            feature,
            result = getFeaturesEventArgs.result;
          province = result.features[0].data.NAME;
          var geometryTemp = result.features[0].geometry;
          var currVector = new SuperMap.Feature.Vector(geometryTemp);
          var borderVector = new SuperMap.Feature.Vector(
            geometryTemp,
            null,
            style
          );
          var borderVector = new SuperMap.Feature.Vector(
            geometryTemp,
            null,
            style
          );
          popVector.removeAllFeatures();
          borderCityVector.removeAllFeatures();
          borderCityVector.addFeatures([borderVector]);
          parent.window.getStormAreaBycitygdp(province);
          popVector.addFeatures([currVector]);
        },
        processFailed: function(e) {}
      }
    }
  );
  getFeaturesByGeometryService.processAsync(getFeaturesByGeometryParameters);
}
function countrygdpClickMapHandler(e) {
  var lonlat = map.getLonLatFromPixel(new SuperMap.Pixel(e.xy.x, e.xy.y));
  var xxx = lonlat.lon.toFixed(5);
  var yyy = lonlat.lat.toFixed(5);
  currLonlat = new SuperMap.LonLat(xxx, yyy);
  var point = new SuperMap.Geometry.Point(xxx, yyy);
  var pointVector = new SuperMap.Feature.Vector(point);
  var vector = new SuperMap.Layer.Vector("vector");
  var province = "";
  vector.addFeatures([pointVector]);
  var getFeaturesByGeometryParameters, getFeaturesByGeometryService;

  getFeaturesByGeometryParameters = new SuperMap.REST.GetFeaturesByGeometryParameters(
    {
      datasetNames: ["china:county"],
      toIndex: -1,
      spatialQueryMode: SuperMap.REST.SpatialQueryMode.INTERSECT,
      geometry: pointVector.geometry
    }
  );
  getFeaturesByGeometryService = new SuperMap.REST.GetFeaturesByGeometryService(
    path + "/iserver/services/data-china/rest/data",
    {
      eventListeners: {
        processCompleted: function(getFeaturesEventArgs) {
          var i,
            len,
            features,
            feature,
            result = getFeaturesEventArgs.result;
          province = result.features[0].data.NAME;
          var geometryTemp = result.features[0].geometry;
          var currVector = new SuperMap.Feature.Vector(geometryTemp);
          popVector.removeAllFeatures();
          //					map.addLayer(popVector);
          parent.window.getStormAreaByCountrygdp(province);
          popVector.addFeatures([currVector]);
        },
        processFailed: function(e) {}
      }
    }
  );
  getFeaturesByGeometryService.processAsync(getFeaturesByGeometryParameters);
}
function provincepopuClickMapHandler(e) {
  var lonlat = map.getLonLatFromPixel(new SuperMap.Pixel(e.xy.x, e.xy.y));
  var xxx = lonlat.lon.toFixed(5);
  var yyy = lonlat.lat.toFixed(5);
  currLonlat = new SuperMap.LonLat(xxx, yyy);
  var point = new SuperMap.Geometry.Point(xxx, yyy);
  var pointVector = new SuperMap.Feature.Vector(point);
  var vector = new SuperMap.Layer.Vector("vector");
  var province = "";
  vector.addFeatures([pointVector]);
  var getFeaturesByGeometryParameters, getFeaturesByGeometryService;

  getFeaturesByGeometryParameters = new SuperMap.REST.GetFeaturesByGeometryParameters(
    {
      datasetNames: ["china:province"],
      toIndex: -1,
      spatialQueryMode: SuperMap.REST.SpatialQueryMode.INTERSECT,
      geometry: pointVector.geometry
    }
  );
  getFeaturesByGeometryService = new SuperMap.REST.GetFeaturesByGeometryService(
    path + "/iserver/services/data-china/rest/data",
    {
      eventListeners: {
        processCompleted: function(getFeaturesEventArgs) {
          var i,
            len,
            features,
            feature,
            result = getFeaturesEventArgs.result;
          province = result.features[0].data.NAME;
          var geometryTemp = result.features[0].geometry;
          var currVector = new SuperMap.Feature.Vector(geometryTemp);
          var borderVector = new SuperMap.Feature.Vector(
            geometryTemp,
            null,
            style
          );
          popVector.removeAllFeatures();
          borderProvinceVector.removeAllFeatures();
          borderProvinceVector.addFeatures([borderVector]);
          parent.window.getStormAreaByProvincepopu(province);
          popVector.addFeatures([currVector]);
        },
        processFailed: function(e) {}
      }
    }
  );
  getFeaturesByGeometryService.processAsync(getFeaturesByGeometryParameters);
}

function citypopuClickMapHandler(e) {
  var lonlat = map.getLonLatFromPixel(new SuperMap.Pixel(e.xy.x, e.xy.y));
  var xxx = lonlat.lon.toFixed(5);
  var yyy = lonlat.lat.toFixed(5);
  currLonlat = new SuperMap.LonLat(xxx, yyy);
  var point = new SuperMap.Geometry.Point(xxx, yyy);
  var pointVector = new SuperMap.Feature.Vector(point);
  var vector = new SuperMap.Layer.Vector("vector");
  var province = "";
  vector.addFeatures([pointVector]);
  var getFeaturesByGeometryParameters, getFeaturesByGeometryService;

  getFeaturesByGeometryParameters = new SuperMap.REST.GetFeaturesByGeometryParameters(
    {
      datasetNames: ["china:city"],
      toIndex: -1,
      spatialQueryMode: SuperMap.REST.SpatialQueryMode.INTERSECT,
      geometry: pointVector.geometry
    }
  );
  getFeaturesByGeometryService = new SuperMap.REST.GetFeaturesByGeometryService(
    path + "/iserver/services/data-china/rest/data",
    {
      eventListeners: {
        processCompleted: function(getFeaturesEventArgs) {
          var i,
            len,
            features,
            feature,
            result = getFeaturesEventArgs.result;
          province = result.features[0].data.NAME;
          var geometryTemp = result.features[0].geometry;
          var currVector = new SuperMap.Feature.Vector(geometryTemp);
          var borderVector = new SuperMap.Feature.Vector(
            geometryTemp,
            null,
            style
          );
          popVector.removeAllFeatures();
          borderCityVector.removeAllFeatures();
          borderCityVector.addFeatures([borderVector]);
          parent.window.getStormAreaByCitypopu(province);
          popVector.addFeatures([currVector]);
        },
        processFailed: function(e) {}
      }
    }
  );
  getFeaturesByGeometryService.processAsync(getFeaturesByGeometryParameters);
}
function countrypopuClickMapHandler(e) {
  var lonlat = map.getLonLatFromPixel(new SuperMap.Pixel(e.xy.x, e.xy.y));
  var xxx = lonlat.lon.toFixed(5);
  var yyy = lonlat.lat.toFixed(5);
  currLonlat = new SuperMap.LonLat(xxx, yyy);
  var point = new SuperMap.Geometry.Point(xxx, yyy);
  var pointVector = new SuperMap.Feature.Vector(point);
  var vector = new SuperMap.Layer.Vector("vector");
  var province = "";
  vector.addFeatures([pointVector]);
  var getFeaturesByGeometryParameters, getFeaturesByGeometryService;

  getFeaturesByGeometryParameters = new SuperMap.REST.GetFeaturesByGeometryParameters(
    {
      datasetNames: ["china:county"],
      toIndex: -1,
      spatialQueryMode: SuperMap.REST.SpatialQueryMode.INTERSECT,
      geometry: pointVector.geometry
    }
  );

  getFeaturesByGeometryService = new SuperMap.REST.GetFeaturesByGeometryService(
    path + "/iserver/services/data-china/rest/data",
    {
      eventListeners: {
        processCompleted: function(getFeaturesEventArgs) {
          var i,
            len,
            features,
            feature,
            result = getFeaturesEventArgs.result;
          province = result.features[0].data.NAME;
          var geometryTemp = result.features[0].geometry;
          var currVector = new SuperMap.Feature.Vector(geometryTemp);
          popVector.removeAllFeatures();
          //					map.addLayer(popVector);

          parent.window.getStormAreaByCountrypopu(province);
          popVector.addFeatures([currVector]);
        },
        processFailed: function(e) {}
      }
    }
  );
  getFeaturesByGeometryService.processAsync(getFeaturesByGeometryParameters);
}
function provincelandClickMapHandler(e) {
  var lonlat = map.getLonLatFromPixel(new SuperMap.Pixel(e.xy.x, e.xy.y));
  var xxx = lonlat.lon.toFixed(5);
  var yyy = lonlat.lat.toFixed(5);
  currLonlat = new SuperMap.LonLat(xxx, yyy);
  var point = new SuperMap.Geometry.Point(xxx, yyy);
  var pointVector = new SuperMap.Feature.Vector(point);
  var vector = new SuperMap.Layer.Vector("vector");
  var province = "";
  vector.addFeatures([pointVector]);
  var getFeaturesByGeometryParameters, getFeaturesByGeometryService;

  getFeaturesByGeometryParameters = new SuperMap.REST.GetFeaturesByGeometryParameters(
    {
      datasetNames: ["china:province"],
      toIndex: -1,
      spatialQueryMode: SuperMap.REST.SpatialQueryMode.INTERSECT,
      geometry: pointVector.geometry
    }
  );
  getFeaturesByGeometryService = new SuperMap.REST.GetFeaturesByGeometryService(
    path + "/iserver/services/data-china/rest/data",
    {
      eventListeners: {
        processCompleted: function(getFeaturesEventArgs) {
          var i,
            len,
            features,
            feature,
            result = getFeaturesEventArgs.result;
          province = result.features[0].data.NAME;
          var geometryTemp = result.features[0].geometry;
          var currVector = new SuperMap.Feature.Vector(geometryTemp);
          var borderVector = new SuperMap.Feature.Vector(
            geometryTemp,
            null,
            style
          );
          popVector.removeAllFeatures();
          borderProvinceVector.removeAllFeatures();
          borderProvinceVector.addFeatures([borderVector]);
          parent.window.getStormAreaByProvinceland(province);
          popVector.addFeatures([currVector]);
        },
        processFailed: function(e) {}
      }
    }
  );
  getFeaturesByGeometryService.processAsync(getFeaturesByGeometryParameters);
}
function citylandClickMapHandler(e) {
  var lonlat = map.getLonLatFromPixel(new SuperMap.Pixel(e.xy.x, e.xy.y));
  var xxx = lonlat.lon.toFixed(5);
  var yyy = lonlat.lat.toFixed(5);
  currLonlat = new SuperMap.LonLat(xxx, yyy);
  var point = new SuperMap.Geometry.Point(xxx, yyy);
  var pointVector = new SuperMap.Feature.Vector(point);
  var vector = new SuperMap.Layer.Vector("vector");
  var province = "";
  vector.addFeatures([pointVector]);
  var getFeaturesByGeometryParameters, getFeaturesByGeometryService;

  getFeaturesByGeometryParameters = new SuperMap.REST.GetFeaturesByGeometryParameters(
    {
      datasetNames: ["china:city"],
      toIndex: -1,
      spatialQueryMode: SuperMap.REST.SpatialQueryMode.INTERSECT,
      geometry: pointVector.geometry
    }
  );
  getFeaturesByGeometryService = new SuperMap.REST.GetFeaturesByGeometryService(
    path + "/iserver/services/data-china/rest/data",
    {
      eventListeners: {
        processCompleted: function(getFeaturesEventArgs) {
          var i,
            len,
            features,
            feature,
            result = getFeaturesEventArgs.result;
          province = result.features[0].data.NAME;
          var geometryTemp = result.features[0].geometry;
          var currVector = new SuperMap.Feature.Vector(geometryTemp);
          var borderVector = new SuperMap.Feature.Vector(
            geometryTemp,
            null,
            style
          );
          popVector.removeAllFeatures();
          borderCityVector.removeAllFeatures();
          borderCityVector.addFeatures([borderVector]);
          parent.window.getStormAreaByCityland(province);
          popVector.addFeatures([currVector]);
        },
        processFailed: function(e) {}
      }
    }
  );
  getFeaturesByGeometryService.processAsync(getFeaturesByGeometryParameters);
}
function countrylandClickMapHandler(e) {
  var lonlat = map.getLonLatFromPixel(new SuperMap.Pixel(e.xy.x, e.xy.y));
  var xxx = lonlat.lon.toFixed(5);
  var yyy = lonlat.lat.toFixed(5);
  currLonlat = new SuperMap.LonLat(xxx, yyy);
  var point = new SuperMap.Geometry.Point(xxx, yyy);
  var pointVector = new SuperMap.Feature.Vector(point);
  var vector = new SuperMap.Layer.Vector("vector");
  var province = "";
  vector.addFeatures([pointVector]);
  var getFeaturesByGeometryParameters, getFeaturesByGeometryService;

  getFeaturesByGeometryParameters = new SuperMap.REST.GetFeaturesByGeometryParameters(
    {
      datasetNames: ["china:county"],
      toIndex: -1,
      spatialQueryMode: SuperMap.REST.SpatialQueryMode.INTERSECT,
      geometry: pointVector.geometry
    }
  );
  getFeaturesByGeometryService = new SuperMap.REST.GetFeaturesByGeometryService(
    path + "/iserver/services/data-china/rest/data",
    {
      eventListeners: {
        processCompleted: function(getFeaturesEventArgs) {
          var i,
            len,
            features,
            feature,
            result = getFeaturesEventArgs.result;
          province = result.features[0].data.NAME;
          var geometryTemp = result.features[0].geometry;
          var currVector = new SuperMap.Feature.Vector(geometryTemp);
          popVector.removeAllFeatures();
          //					map.addLayer(popVector);
          parent.window.getStormAreaByCountryland(province);
          popVector.addFeatures([currVector]);
        },
        processFailed: function(e) {}
      }
    }
  );
  getFeaturesByGeometryService.processAsync(getFeaturesByGeometryParameters);
}
function stormdisClickMapHandler(e) {
  var lonlat = map.getLonLatFromPixel(new SuperMap.Pixel(e.xy.x, e.xy.y));
  var xxx = lonlat.lon.toFixed(5);
  var yyy = lonlat.lat.toFixed(5);
  currLonlat = new SuperMap.LonLat(xxx, yyy);
  var point = new SuperMap.Geometry.Point(xxx, yyy);
  var pointVector = new SuperMap.Feature.Vector(point);
  var vector = new SuperMap.Layer.Vector("vector");
  var province = "";
  vector.addFeatures([pointVector]);
  var getFeaturesByGeometryParameters, getFeaturesByGeometryService;

  getFeaturesByGeometryParameters = new SuperMap.REST.GetFeaturesByGeometryParameters(
    {
      datasetNames: ["china:province"],
      toIndex: -1,
      spatialQueryMode: SuperMap.REST.SpatialQueryMode.INTERSECT,
      geometry: pointVector.geometry
    }
  );
  getFeaturesByGeometryService = new SuperMap.REST.GetFeaturesByGeometryService(
    path + "/iserver/services/data-china/rest/data",
    {
      eventListeners: {
        processCompleted: function(getFeaturesEventArgs) {
          var i,
            len,
            features,
            feature,
            result = getFeaturesEventArgs.result;
          province = result.features[0].data.NAME;
          var geometryTemp = result.features[0].geometry;
          var currVector = new SuperMap.Feature.Vector(geometryTemp);
          popVector.removeAllFeatures();
          //					map.addLayer(popVector);
          parent.window.getStormdisByProvince(province);
          popVector.addFeatures([currVector]);
        },
        processFailed: function(e) {}
      }
    }
  );
  getFeaturesByGeometryService.processAsync(getFeaturesByGeometryParameters);
}
/**
 * 弹窗
 * @param {Object} htmlStr
 * @param {Object} lonlat
 * @param {Object} width
 * @param {Object} height
 */
function getInfoWindow(htmlStr, lonlat, width, height) {
  closeInfoWin();
  parent.window.setMarkerMapName("none");
  //			$("#marker_map_name_id").css('display','none');//隐藏色斑图标题
  //初始化Anchored类
  popup = new SuperMap.Popup.FramedCloud(
    "chicken",
    lonlat,
    new SuperMap.Size(width, height),
    htmlStr,
    null,
    true,
    closeInfoWin
  );
  popup.autoSize = false;
  popup.setBorder("solid 1px black;");
  popup.setBackgroundColor("#F2F2F2");
  //            infowin = popup;
  //            popVector.addFeatures(popup);
  //添加弹窗到map图层
  map.addPopup(popup);
}
function closeInfoWin() {
  //        	map.removePopup(popup);
  map.removeAllPopup();
  popVector.removeAllFeatures();
  parent.window.setMarkerMapName("block");
  //        	$("#marker_map_name_id").css('display','block');//显示色斑图标题
  if (infowin) {
    try {
      infowin.hide();
      infowin.destroy();
      popVector.removeAllFeatures();
    } catch (e) {}
  }
}

function geCZFX08Result(sdate, edate, stormid, title) {
  $("body", parent.document)
    .find("#map_name")
    .html("");
  app.selstormid = stormid;
  //构造缓存替换矢量图层20160504
  var prelayname = "rainVector";
  if (stormid == undefined) prelayname = "rainVector";
  else prelayname = "rainVector" + stormid;
  var currVectorlyer = map.getLayer(prelayname);
  if (currVectorlyer == null) {
    currVectorlyer = new SuperMap.Layer.Vector(prelayname);
    currVectorlyer.id = prelayname;
    map.addLayers([currVectorlyer]);
    map.setLayerIndex(xzqhLayer, map.getNumLayers() - 1);
    map.setLayerIndex(layer2, map.getNumLayers() - 1); //将注记设置到最上面
  }
  rainVector = currVectorlyer;
  //控制图层的显隐
  controlVectorLaysByNam(stormid);
  if (rainVector != null) {
    rainVector.removeAllFeatures();
  } else {
    //rainVector = new SuperMap.Layer.Vector("rainVector");
    //map.addLayers([rainVector]);
    //map.setLayerIndex(xzqhLayer,map.getNumLayers()-1);
    //map.setLayerIndex(layer2,map.getNumLayers()-1);//将注记设置到最上面
  }
  $.ajax({
    url: "/MDMIS/geCZFX08Result.do",
    type: "POST",
    dataType: "json",
    data: {
      sdate: sdate,
      edate: edate
    },
    success: function(data) {
      if (data != null && data != "") {
        //    				rainVector = new SuperMap.Layer.Vector("rainVector");
        var region,
          vArray = new Array();
        $.each(data.geoRegionResults, function(idx, regionItem) {
          if (
            regionItem.maxGeoRegion != null &&
            regionItem.maxGeoRegion.length != 0
          ) {
            //判断外层
            var points = new Array();
            $.each(regionItem.maxGeoRegion.point2ds, function(idx2, pointItem) {
              points[idx2] = new SuperMap.Geometry.Point(
                pointItem.pointX,
                pointItem.pointY
              ).transform("EPSG:4490", "EPSG:900913");
            });
            var line1 = new SuperMap.Geometry.LinearRing(points);
            if (
              regionItem.minGeoRegions != null &&
              regionItem.minGeoRegions.length != 0
            ) {
              //判断是否有内层
              var points2 = new Array();
              $.each(regionItem.minGeoRegions.point2ds, function(
                idx3,
                pointItem
              ) {
                points2[idx3] = new SuperMap.Geometry.Point(
                  pointItem.pointX,
                  pointItem.pointY
                ).transform("EPSG:4490", "EPSG:900913");
              });
              var line2 = new SuperMap.Geometry.LinearRing(points2);
              region = new SuperMap.Geometry.Polygon([line1, line2]);
            } else {
              region = new SuperMap.Geometry.Polygon([line1]);
            }
            var regionVector = new SuperMap.Feature.Vector(region);
            regionVector.attributes.maxValue = regionItem.maxValue;
            regionVector.attributes.minValue = regionItem.minValue;
            regionVector.style = {
              fillColor: rgbToHex(
                regionItem.color.red,
                regionItem.color.green,
                regionItem.color.blue
              ),
              fillOpacity: 0.6,
              strokeWidth: 0
            };
            vArray.push(regionVector);
          }
        });
        rainVector.addFeatures(vArray);
        vArray = null;
        //    				map.addLayers([rainVector]);

        var html = "";
        html +=
          "<div><table><tr><td style='text-align: center;background-color:#7392D8;height:24px;font-size:12px;color:white'>&nbsp;图例&nbsp;(mm)&nbsp;</td></tr>";
        $.each(data.legend.colors, function(idx_c, color) {
          html +=
            "<tr><td style='height:20px;'>&nbsp;<span style='height:20px;background-color:" +
            rgbToHex(color.red, color.green, color.blue);
          if (idx_c == 0) {
            html +=
              "'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>&nbsp;&nbsp;无降水&nbsp;</td></tr>";
          } else if (idx_c < data.legend.colors.length - 1) {
            html +=
              "'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>&nbsp;&nbsp;" +
              data.legend.colorValues[idx_c] +
              "-" +
              data.legend.colorValues[idx_c + 1] +
              "&nbsp;</td></tr>";
          } else {
            html +=
              "'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>&nbsp;&nbsp;&gt;" +
              data.legend.colorValues[idx_c] +
              "&nbsp;</td></tr>";
          }
        });

        html += "</table></div>";
        mapMC =
          "<div id='marker_map_name_id'>过程累计降水量分布图" +
          "" +
          "<br><span style='font-size:14px;'>" +
          title +
          "<span></div>";
        rainVector.name = mapMC;
        if (window.parent.swit == 1 && window.parent.app.rainMapVisable) {
          $("body", parent.document)
            .find("#map_tuli")
            .html(html);
          $("body", parent.document)
            .find("#map_name")
            .html(mapMC);
          $("body", parent.document)
            .find("#map_tuli")
            .show();
          $("body", parent.document)
            .find("#map_name")
            .show();
          xzqhLayer.setVisibility(true);
          layer1.setVisibility(true);
          layer2.setVisibility(false);
        } else if (!window.parent.app.rainMapVisable) {
          window.parent.app.rainMapVisable = true; //恢复默认值
        }
      } else {
        delVectorLayerByNam(app.selstormid);
      }
    }
  });
}
function geCZFX20Result(sdate, edate, stormid, title) {
  $("body", parent.document)
    .find("#map_name")
    .html("");
  app.selstormid = stormid;
  //构造缓存替换矢量图层20160504
  var prelayname = "rainVector";
  if (stormid == undefined) prelayname = "rainVector";
  else prelayname = "rainVector" + stormid;
  var currVectorlyer = map.getLayer(prelayname);
  if (currVectorlyer == null) {
    currVectorlyer = new SuperMap.Layer.Vector(prelayname);
    currVectorlyer.id = prelayname;
    map.addLayers([currVectorlyer]);
    map.setLayerIndex(xzqhLayer, map.getNumLayers() - 1);
    map.setLayerIndex(layer2, map.getNumLayers() - 1); //将注记设置到最上面
  }
  rainVector = currVectorlyer;
  //控制图层的显隐
  controlVectorLaysByNam(stormid);
  if (rainVector != null) {
    rainVector.removeAllFeatures();
  } else {
    //rainVector = new SuperMap.Layer.Vector("rainVector");
    //map.addLayers([rainVector]);
    //map.setLayerIndex(xzqhLayer,map.getNumLayers()-1);
    //map.setLayerIndex(layer2,map.getNumLayers()-1);//将注记设置到最上面
  }
  $.ajax({
    url: "/MDMIS/geCZFXResult.do",
    type: "POST",
    dataType: "json",
    data: {
      sdate: sdate,
      edate: edate
    },
    success: function(data) {
      if (data != null && data != "") {
        //    				rainVector = new SuperMap.Layer.Vector("rainVector");
        var region,
          vArray = new Array();
        $.each(data.geoRegionResults, function(idx, regionItem) {
          if (
            regionItem.maxGeoRegion != null &&
            regionItem.maxGeoRegion.length != 0
          ) {
            //判断外层
            var points = new Array();
            $.each(regionItem.maxGeoRegion.point2ds, function(idx2, pointItem) {
              points[idx2] = new SuperMap.Geometry.Point(
                pointItem.pointX,
                pointItem.pointY
              ).transform("EPSG:4490", "EPSG:900913");
            });
            var line1 = new SuperMap.Geometry.LinearRing(points);
            if (
              regionItem.minGeoRegions != null &&
              regionItem.minGeoRegions.length != 0
            ) {
              //判断是否有内层
              var points2 = new Array();
              $.each(regionItem.minGeoRegions.point2ds, function(
                idx3,
                pointItem
              ) {
                points2[idx3] = new SuperMap.Geometry.Point(
                  pointItem.pointX,
                  pointItem.pointY
                ).transform("EPSG:4490", "EPSG:900913");
              });
              var line2 = new SuperMap.Geometry.LinearRing(points2);
              region = new SuperMap.Geometry.Polygon([line1, line2]);
            } else {
              region = new SuperMap.Geometry.Polygon([line1]);
            }
            var regionVector = new SuperMap.Feature.Vector(region);
            regionVector.attributes.maxValue = regionItem.maxValue;
            regionVector.attributes.minValue = regionItem.minValue;
            if (
              regionItem.color.red == 255 &&
              regionItem.color.green == 255 &&
              regionItem.color.blue == 255
            ) {
              regionVector.style = {
                fillColor: rgbToHex(
                  regionItem.color.red,
                  regionItem.color.green,
                  regionItem.color.blue
                ),
                fillOpacity: 0,
                strokeWidth: 0
              };
            } else {
              regionVector.style = {
                fillColor: rgbToHex(
                  regionItem.color.red,
                  regionItem.color.green,
                  regionItem.color.blue
                ),
                fillOpacity: 0.65,
                strokeWidth: 0
              };
            }
            vArray.push(regionVector);
          }
        });
        rainVector.addFeatures(vArray);
        vArray = null;
        //   				map.addLayers([rainVector]);
        var html = "";
        html +=
          "<div><table><tr><td style='text-align: center;background-color:#7392D8;height:24px;font-size:12px;color:white'>&nbsp;图例&nbsp;(mm)&nbsp;</td></tr>";
        $.each(data.legend.colors, function(idx_c, color) {
          html +=
            "<tr><td style='height:20px;'>&nbsp;<span style='height:20px;background-color:" +
            rgbToHex(color.red, color.green, color.blue);
          if (idx_c == 0) {
            html +=
              "'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>&nbsp;&nbsp;无降水&nbsp;</td></tr>";
          } else if (idx_c < data.legend.colors.length - 1) {
            html +=
              "'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>&nbsp;&nbsp;" +
              data.legend.colorValues[idx_c] +
              "-" +
              data.legend.colorValues[idx_c + 1] +
              "&nbsp;</td></tr>";
          } else {
            html +=
              "'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>&nbsp;&nbsp;&gt;" +
              data.legend.colorValues[idx_c] +
              "&nbsp;</td></tr>";
          }
        });

        html += "</table></div>";
        mapMC =
          "<div id='marker_map_name_id'>过程累计降水量分布图" +
          "" +
          "<br><span style='font-size:14px;'>" +
          title +
          "<span></div>";
        rainVector.name = mapMC;
        if (window.parent.swit == 1 && window.parent.app.rainMapVisable) {
          $("body", parent.document)
            .find("#map_tuli")
            .html(html);
          $("body", parent.document)
            .find("#map_name")
            .html(mapMC);
          $("body", parent.document)
            .find("#map_tuli")
            .show();
          $("body", parent.document)
            .find("#map_name")
            .show();
          xzqhLayer.setVisibility(true);
          layer1.setVisibility(true);
          layer2.setVisibility(false);
        } else if (!window.parent.app.rainMapVisable) {
          window.parent.app.rainMapVisable = true; //恢复默认值
        }
      } else {
        delVectorLayerByNam(app.selstormid);
      }
    }
  });
}
/**
 * 距平百分率
 * @param {Object} sdate起始日期
 * @param {Object} edate结束日期
 * @param {Object} title标题
 * @param {Object} dateType 08||20
 * @param {Object} startYear 历史开始年份
 * @param {Object} endYear	历史结束年份
 */
function getPrecentRainResult(
  sdate,
  edate,
  title,
  dateType,
  startYear,
  endYear
) {
  var stormid = "";
  $("body", parent.document)
    .find("#map_name")
    .html("");
  app.selstormid = stormid;
  //构造缓存替换矢量图层20160504
  var prelayname = "rainVector";
  if (stormid == undefined) prelayname = "rainVector";
  else prelayname = "rainVector" + stormid;
  var currVectorlyer = map.getLayer(prelayname);
  if (currVectorlyer == null) {
    currVectorlyer = new SuperMap.Layer.Vector(prelayname);
    currVectorlyer.id = prelayname;
    map.addLayers([currVectorlyer]);
    map.setLayerIndex(xzqhLayer, map.getNumLayers() - 1);
    map.setLayerIndex(layer2, map.getNumLayers() - 1); //将注记设置到最上面
  }
  rainVector = currVectorlyer;
  //控制图层的显隐
  controlVectorLaysByNam(stormid);
  if (rainVector != null) {
    rainVector.removeAllFeatures();
  } else {
    //rainVector = new SuperMap.Layer.Vector("rainVector");
    //map.addLayers([rainVector]);
    //map.setLayerIndex(xzqhLayer,map.getNumLayers()-1);
    //map.setLayerIndex(layer2,map.getNumLayers()-1);//将注记设置到最上面
  }
  $.ajax({
    url: "/MDMIS/getPrecentRainResult.do",
    type: "POST",
    dataType: "json",
    data: {
      sdate: sdate,
      edate: edate,
      dateType: dateType,
      startYear: startYear,
      endYear: endYear
    },
    success: function(data) {
      if (data != null && data != "") {
        //    				rainVector = new SuperMap.Layer.Vector("rainVector");
        var region,
          vArray = new Array();
        $.each(data.geoRegionResults, function(idx, regionItem) {
          if (
            regionItem.maxGeoRegion != null &&
            regionItem.maxGeoRegion.length != 0
          ) {
            //判断外层
            var points = new Array();
            $.each(regionItem.maxGeoRegion.point2ds, function(idx2, pointItem) {
              points[idx2] = new SuperMap.Geometry.Point(
                pointItem.pointX,
                pointItem.pointY
              ).transform("EPSG:4490", "EPSG:900913");
            });
            var line1 = new SuperMap.Geometry.LinearRing(points);
            if (
              regionItem.minGeoRegions != null &&
              regionItem.minGeoRegions.length != 0
            ) {
              //判断是否有内层
              var points2 = new Array();
              $.each(regionItem.minGeoRegions.point2ds, function(
                idx3,
                pointItem
              ) {
                points2[idx3] = new SuperMap.Geometry.Point(
                  pointItem.pointX,
                  pointItem.pointY
                ).transform("EPSG:4490", "EPSG:900913");
              });
              var line2 = new SuperMap.Geometry.LinearRing(points2);
              region = new SuperMap.Geometry.Polygon([line1, line2]);
            } else {
              region = new SuperMap.Geometry.Polygon([line1]);
            }
            var regionVector = new SuperMap.Feature.Vector(region);
            regionVector.attributes.maxValue = regionItem.maxValue;
            regionVector.attributes.minValue = regionItem.minValue;
            regionVector.style = {
              fillColor: rgbToHex(
                regionItem.color.red,
                regionItem.color.green,
                regionItem.color.blue
              ),
              fillOpacity: 0.6,
              strokeWidth: 0
            };
            vArray.push(regionVector);
          }
        });
        rainVector.addFeatures(vArray);
        vArray = null;
        //    				map.addLayers([rainVector]);

        var html = "";
        html +=
          "<div><table><tr><td style='text-align: center;background-color:#7392D8;height:24px;font-size:12px;color:white'>&nbsp;图例&nbsp;(mm)&nbsp;</td></tr>";
        $.each(data.legend.colors, function(idx_c, color) {
          html +=
            "<tr><td style='height:20px;'>&nbsp;<span style='height:20px;background-color:" +
            rgbToHex(color.red, color.green, color.blue);
          if (idx_c == 0) {
            html +=
              "'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>&nbsp;&nbsp;无降水&nbsp;</td></tr>";
          } else if (idx_c < data.legend.colors.length - 1) {
            html +=
              "'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>&nbsp;&nbsp;" +
              data.legend.colorValues[idx_c] +
              "-" +
              data.legend.colorValues[idx_c + 1] +
              "&nbsp;</td></tr>";
          } else {
            html +=
              "'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>&nbsp;&nbsp;&gt;" +
              data.legend.colorValues[idx_c] +
              "&nbsp;</td></tr>";
          }
        });

        html += "</table></div>";
        mapMC =
          "<div id='marker_map_name_id'>累计降水量距平百分率分布图" +
          "" +
          "<br><span style='font-size:14px;'>" +
          title +
          "<span></div>";
        rainVector.name = mapMC;
        if (window.parent.swit == 1 && window.parent.app.rainMapVisable) {
          $("body", parent.document)
            .find("#map_tuli")
            .html(html);
          $("body", parent.document)
            .find("#map_name")
            .html(mapMC);
          $("body", parent.document)
            .find("#map_tuli")
            .show();
          $("body", parent.document)
            .find("#map_name")
            .show();
          xzqhLayer.setVisibility(true);
          layer1.setVisibility(true);
          layer2.setVisibility(false);
        } else if (!window.parent.app.rainMapVisable) {
          window.parent.app.rainMapVisable = true; //恢复默认值
        }
      } else {
        delVectorLayerByNam(app.selstormid);
      }
    }
  });
}

var timeStartCheck = new Date().getFullYear() - 10;
var timeEndCheck = new Date().getFullYear();
var zidingTimeStartCheck = new Date().getFullYear() - 10;
var zidingTimeEndCheck = new Date().getFullYear();
function setDateControl(type) {
  var zidingdataend = $("#zidingdataend");
  zidingdataend.html("");
  var element = "";
  var zidingElement = "";
  var begin = 1901;
  var end = 2100;
  if (type == 1) {
    begin = 1961;
    end = 2050;
  }
  if (type == 2) {
    begin = 1950;
    end = 2099;
  }
  for (var i = begin; i <= end; i++) {
    if (i == timeEndCheck) {
      element +=
        '<option value="' + i + '" selected="selected">' + i + "</option>";
    } else {
      element += '<option value="' + i + '">' + i + "</option>";
    }
    if (i == zidingTimeEndCheck) {
      zidingElement +=
        '<option value="' + i + '" selected="selected">' + i + "</option>";
    } else {
      zidingElement += '<option value="' + i + '">' + i + "</option>";
    }
  }
  zidingdataend.html(zidingElement);
  $("#dataendtime").html(element);
  var zidingdatastar = $("#zidingdatastar");
  zidingdatastar.html("");
  var element1 = "";
  var zidingElement1 = "";
  for (var j = begin; j <= end; j++) {
    if (j == timeStartCheck) {
      element1 +=
        '<option value="' + j + '" selected="selected">' + j + "</option>";
    } else {
      element1 += '<option value="' + j + '">' + j + "</option>";
    }
    if (j == zidingTimeStartCheck) {
      zidingElement1 +=
        '<option value="' + j + '" selected="selected">' + j + "</option>";
    } else {
      zidingElement1 += '<option value="' + j + '">' + j + "</option>";
    }
  }
  zidingdatastar.html(zidingElement1);
  $("#datastartime").html(element1);
}

function timeChange() {
  timeStartCheck = $("#datastartime option:selected").val();
  timeEndCheck = $("#dataendtime option:selected").val();
  zidingTimeStartCheck = $("#zidingdatastar option:selected").val();
  zidingTimeEndCheck = $("#zidingdataend option:selected").val();
}

function changeDitu(type) {
  addLayertiandi(type);
  //linevoctor,animatorVector1,vectorLayer,markerLayer
  //map.removeLayer(linevoctor);
  //map.removeLayer(animatorVector1);
  //map.removeLayer(vectorLayer);
  //map.removeLayer(markerLayer);
  //map.addLayers([linevoctor,animatorVector1,vectorLayer,markerLayer]);
  //addMarker(taifei_jdata);
}
function estimateNumberShow() {
  controlTip(true, "数据加载中...");
  requestTest(1);
}
function downLoadData() {
  controlTip(true, "数据加载中...");
  isDownload = "true";
  requestTest(1);
  isDownload = "false";
}
/**
 * 控制图例
 */
function controlTitleLengend(titleBol, lengendBol) {
  if (titleBol) {
    $("#map_name").show();
  } else {
    $("#map_name").hide();
  }
  if (lengendBol) {
    $("#tuli").show();
  } else {
    $("#tuli").hide();
  }
}

function showChar() {
  var diag = new Dialog();
  diag.Width = 1050;
  diag.Height = 1800;

  diag.modal = true;
  diag.Title = "查看曲线";
  controlTitleLengend(false, false); //隐藏图例和标题
  diag.CancelEvent = function() {
    if (requestTestFlag) {
      controlTitleLengend(true, true);
    }
    diag.close();
  }; //退出时如果请求过数据则显示图例标题
  var type = $("input:radio[name=datatype]:checked").val();
  var typeSelector = $("#typeSelector")
    .find("option:selected")
    .val();
  var qihoudata = $("input:radio[name=qihoudata]:checked").val();
  if (qihoudata == "气温") {
    qihoudata = $(".qihoudataSelector")
      .find("option:selected")
      .val();
  }
  if (qihoudata == "极端气候要素") {
    qihoudata = $("#extremeClimateSelect")
      .find("option:selected")
      .val();
  }
  var timefenSelector = $("#timefenSelector")
    .find("option:selected")
    .val();
  var shiduan = $("input:radio[name=shiduan]:checked").val();
  var shiduandata = $("input:radio[name=shiduandata]:checked").val();
  var cankaodata = $(".cankaotime")
    .find("option:selected")
    .text();
  var zidingdatastar = $(".zidingdatastar")
    .find("option:selected")
    .text();
  var zidingdataend = $(".zidingdataend")
    .find("option:selected")
    .text();
  var time;
  if (shiduandata != "参考时段") {
    time = zidingdatastar + "-" + zidingdataend;
  } else {
    time = cankaodata;
  }
  var positiondata;
  var quyu = $("input:radio[name=quyu]:checked").val();
  var city = $(".city")
    .find("option:selected")
    .text();
  var latstart = $("#latstart").val();
  var latend = $("#latend").val();
  var lonstart = $("#lonstart").val();
  var lonsend = $("#lonend").val();
  if (quyu == "全国") {
    positiondata = quyu;
  } else if (quyu == "分省") {
    positiondata = city;
  } else {
    positiondata = latstart + "-" + latend + "-" + lonstart + "-" + lonsend;
  }
  app["dataType"] = type;
  app["dateNumberType"] = typeSelector;
  app["dateType"] = shiduan;
  app["meteoElement"] = qihoudata;
  app["timeResolution"] = timefenSelector;
  app["selectArea"] = positiondata;
  app["customArea"] = "";
  app["startYear"] = $("#datastartime")
    .find("option:selected")
    .text();
  app["endYear"] = $("#dataendtime")
    .find("option:selected")
    .text();
  app["anomalyStartYear"] = zidingdatastar;
  app["anomalyEndYear"] = zidingdataend;
  diag.URL =
    Url +
    "?type=" +
    type +
    "&typeSelector=" +
    typeSelector +
    "&shiduan=" +
    shiduan +
    "&qihoudata=" +
    qihoudata +
    "&positiondata=" +
    positiondata +
    "&timefenSelector=" +
    timefenSelector +
    "&startYear=" +
    app.startYear +
    "&endYear=" +
    app.endYear +
    "";
  diag.show();
}
/**
 * 截取地图图片
 */
function saveImg() {
  MapToImg && MapToImg.excute(map);
  //		html2canvas(document.getElementById("leftside"), {
  //                        allowTaint: true,
  //                        taintTest: false,
  //                       	onrendered: function(canvas) {
  //                           canvas.id = "mycanvas";
  //                           var image = canvas.toDataURL("image/png");
  //						    var w = window.open('about:blank', 'image from canvas');
  //						    w.document.write("<img src='" + image + "' alt='from canvas'/>");
  //                        }
  //                    });
}
/**
 * 地图框选
 */
function draw_polygon() {
  //新建面矢量图层

  map.addControl(drawPolygon);

  //deactiveAll();
  drawPolygon.activate();
  drawPolygon.events.on({ featureadded: drawCompleted });
  $("#dituBtn").text("取消");
  $("#dituBtn").bind("click", function() {
    clearFeatures();
  });
}
function deactiveAll() {
  drawPolygon.deactivate();
}
function clearFeatures() {
  window.location.reload();
  //		deactiveAll();
  //		map.removeControl(drawPolygon);
  //		polygonLayer.setVisibility(false);
  //		shadeprovinceVector.setVisibility(false);
  //deactiveAll();removeControl
  //		$("#dituBtn").text("地图框选");
  //		$("#dituBtn").unbind();
  //		$("#dituBtn").bind("click",function(){
  //			draw_polygon();
  //			});
}
/**
 * 框选的返回函数
 * @param eventArgs
 * @return
 */
function drawCompleted(eventArgs) {
  // 获取传入参数 eventArgs 的几何信息
  var geometry = eventArgs.feature.geometry;
  controlTip(true, "数据加载中...");
  requestTest(1);
  getprovinceshade(geometry);
  deactiveAll();
}

/**
 * 数据类型控制
 * param value
 */
function dataTypeHandler(value) {
  if (value == "global") {
    $("#typeSelector").html(
      '<option value="RCP26" selected="selected">RCP2.6</option>' +
        '<option value="RCP45">RCP4.5</option>' +
        '<option value="RCP85">RCP8.5</option>'
    );
  } else {
    $("#typeSelector").html(
      '<option value="RCP45" selected="selected">RCP4.5</option>' +
        '<option value="RCP85">RCP8.5</option>'
    );
  }
}
/**
 * 时段控制
 * @param {Object} value
 */
function dateTypeHandler(value) {
  if (value == "pjc") {
    $("#cankaoRadio").attr("disabled", true);
    $("#cankaotime").attr("disabled", true);
    $("#zidingRadio").attr("disabled", true);
    $("#zidingdatastar").attr("disabled", true);
    $("#zidingdataend").attr("disabled", true);
  } else {
    $("#cankaoRadio").attr("disabled", false);
    $("#zidingRadio").attr("disabled", false);
    if ($("#cankaoRadio").attr("checked")) {
      $("#cankaotime").attr("disabled", false);
    } else {
      $("#zidingdatastar").attr("disabled", false);
      $("#zidingdataend").attr("disabled", false);
    }
  }
}
/**
 * 距平时段控制
 * @param {Object} value
 */
function anomalyHandler(value) {
  if (value == "参考时段") {
    $("#cankaotime").attr("disabled", false);
    $("#zidingdatastar").attr("disabled", true);
    $("#zidingdataend").attr("disabled", true);
  } else {
    $("#cankaotime").attr("disabled", true);
    $("#zidingdatastar").attr("disabled", false);
    $("#zidingdataend").attr("disabled", false);
  }
}
/**
 * 要素选择控制
 * @param {Object} value
 */
function elementHandler(value) {
  if (value == "气温") {
    $("#qihoudataSelector").attr("disabled", false);
    $("#extremeClimateSelect").attr("disabled", true);
    if ($("input[name='datatype']:checked").val() == "global") {
      setDateControl();
    } else {
      setDateControl(1);
    }
  } else if (value == "极端气候要素") {
    $("#qihoudataSelector").attr("disabled", true);
    $("#extremeClimateSelect").attr("disabled", false);
    setDateControl(2);
  } else {
    $("#qihoudataSelector").attr("disabled", true);
    $("#extremeClimateSelect").attr("disabled", true);
    if ($("input[name='datatype']:checked").val() == "global") {
      setDateControl();
    } else {
      setDateControl(1);
    }
  }
}
/**
 * 区域选择控制
 * @param {Object} value
 */
function areaHandler(value) {
  if (value == "全国") {
    $("#provinceSelect").attr("disabled", true);
    $("#lonstart").attr("disabled", true);
    $("#lonend").attr("disabled", true);
    $("#latstart").attr("disabled", true);
    $("#latend").attr("disabled", true);
  } else if (value == "分省") {
    $("#provinceSelect").attr("disabled", false);
    $("#lonstart").attr("disabled", true);
    $("#lonend").attr("disabled", true);
    $("#latstart").attr("disabled", true);
    $("#latend").attr("disabled", true);
  } else {
    $("#provinceSelect").attr("disabled", true);
    $("#lonstart").attr("disabled", false);
    $("#lonend").attr("disabled", false);
    $("#latstart").attr("disabled", false);
    $("#latend").attr("disabled", false);
  }
}
/**
 * 消息提示
 * @param {Object} Imgvisible
 * @param {Object} font
 */
function controlTip(visible, font) {
  if (visible) {
    $("#tipImg").show();
  } else {
    $("#tipImg").hide();
  }
  $("#tipFont").html(font);
}
