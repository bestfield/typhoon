var map = null,
  layer1,
  layer2,
  themeLayer,
  fwfdThemeLayer,
  markerLayer,
  infowin,
  infowinPosition,
  labelLayer;
var markers = null,
  xz_markers,
  yjd_markers,
  wtvectorLayer,
  backLayer,
  yh_markers;
var layer_river, layer_landuse;
//风险普查相关图层
var cylayer, cyvectorLayer;
var drawControls, polygonLayer;
var scaleline;
var isSelFea = false; //记录当前是否是框选查询，如果不是则为量距量面操作

var path = "http://localhost:8090";
//             host = "http://localhost:8090",
//             url=host+"/iserver/services/map-china400/rest/maps/";
var lineLayer,
  drawLine,
  polygonLayer,
  drawFeature,
  style = {
    strokeColor: "#304DBE",
    strokeWidth: 2,
    pointerEvents: "visiblePainted",
    fillColor: "#304DBE",
    fillOpacity: 0.5
  };
function init() {
  //新建量算图层底图
  //    	layer = new SuperMap.Layer.Vector("lineLayer");
  //新建线矢量图层
  lineLayer = new SuperMap.Layer.Vector("lineLayer");
  //对线图层应用样式style（前面有定义）
  lineLayer.style = style;
  //创建画线控制，图层是lineLayer;这里DrawFeature(图层,类型,属性)；multi:true在将要素放入图层之前是否现将其放入几何图层中
  drawLine = new SuperMap.Control.DrawFeature(
    lineLayer,
    SuperMap.Handler.Path,
    { multi: true }
  );
  /*
     	     注册featureadded事件,触发drawCompleted()方法
	                例如注册"loadstart"事件的单独监听
          events.on({ "loadstart": loadStartListener });
         */
  drawLine.events.on({ featureadded: drawCompleted });
  //drawFeature = new SuperMap.Control.DrawFeature(lineLayer, SuperMap.Handler.Box,{"handlerOptions":{"cursorCSS":"crosshair"}});
  polygonLayer = new SuperMap.Layer.Vector("polygonLayer");
  drawFeature = new SuperMap.Control.DrawFeature(
    polygonLayer,
    SuperMap.Handler.Polygon
  );
  drawFeature.events.on({ featureadded: drawCompleted });
  var pathtopName = window.top.document.location.pathname.split("/")[2];
  cc = new SuperMap.Control.PanZoomBar({
    forceFixedZoomLevel: false,
    showCompass: false,
    showSlider: true
  });
  cc2 = new SuperMap.Control.Navigation({
    dragPanOptions: {
      enableKinetic: true
    }
  });
  map = new SuperMap.Map("map", {
    controls: [
      //                     new SuperMap.Control.LayerSwitcher(),//圖層控制
      //                     new SuperMap.Control.ScaleLine({isImperialUnits:false}),
      //                     new SuperMap.Control.OverviewMap(),//地图鹰眼
      //            new SuperMap.Control.PanZoomBar({forceFixedZoomLevel:false,showCompass:false,showSlider:false}),//標尺
      new SuperMap.Control.Navigation({
        dragPanOptions: {
          enableKinetic: true
        }
      }),
      drawLine,
      drawFeature
    ],
    allOverlays: true,
    projection: "EPSG:900913", //900913
    minScale: 7
  });
  scaleline = new SuperMap.Control.ScaleLine({
    isImperialUnits: false,
    maxWidth: 120
  });
  scaleline.geodesic = true;
  addLayertiandi("vec");
  // 注册地图 mousemove，用于获取当前鼠标在地图中的像素位置
  map.events.on({
    mousemove: function(e) {
      infowinPosition = e.xy.clone();
      // 偏移
      infowinPosition.x += 40;
      infowinPosition.y -= 25;
    }
  });
  map.setCenter(
    new SuperMap.LonLat(108.07567641634, 36.855795258955).transform(
      "EPSG:4326",
      "EPSG:900913"
    ),
    3
  );
  /**
   * 风险普查页面图层
   */
  if (pathtopName.indexOf("risksurveysearch") != -1) {
    initcyfengduan();
  }
}
var initStatus = true;
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
  /*  	  if(layer1)
		     map.removeLayer(layer1,false);
 	  if(layer2){
           map.removeLayer(layer2,false);
 	  } */
  layer1 = new SuperMap.Layer.Tianditu({ layerType: ty }); //img,ter
  layer2 = new SuperMap.Layer.Tianditu({ layerType: ty, isLabel: true });
  layer1.setOpacity(1);
  map.addLayers([layer1, layer2, lineLayer]);
  map.setLayerIndex(layer1, 0); //将底图设置到最下面
  map.setLayerIndex(layer2, map.getNumLayers() - 1); //将注记设置到最上面
  if (initStatus) {
    //初始化加载一次，后面不再执行
    layer2.setOpacity(0);
    initStatus = false;
    addOtherLayer();
  }

  map.addControl(scaleline, new SuperMap.Pixel(750, 595)); //为了设定比例尺位置，只有单独添加
}
function addOtherLayer() {
  if (layer_river) {
    try {
      map.removeLayer(layer_river, false);
    } catch (e) {}
  }
  if (layer_landuse) {
    try {
      map.removeLayer(layer_landuse, false);
    } catch (e) {}
  }
  /*		if(layer_river)
			map.removeLayer(layer_river,false);
		if(layer_landuse){
			map.removeLayer(layer_landuse,false);
		}*/
  layer_river = new SuperMap.Layer.TiledDynamicRESTLayer(
    "river",
    path + "/iserver/services/map-china/rest/maps/river",
    {
      transparent: true,
      cacheEnabled: true
    },
    null
  );
  layer_river.setOpacity(0);
  layer_river.events.on({ layerInitialized: addlayer_river });
}
function addlayer_landuse() {
  map.addLayers([layer_landuse]);
  map.setLayerIndex(layer_landuse, 1); //将注记设置到最上面
  map.raiseLayer(layer2, 1); //注记图层向上移动一层
  //      通过参数传递加载地图服务时执行此方法。by_ljw
  if (parent.mapData != null && parent.mapData != "") {
    addData();
  }
}
function addlayer_river() {
  map.addLayers([layer_river]);
  map.setLayerIndex(layer_river, 2); //将注记设置到最上面
  map.raiseLayer(layer2, 1); //注记图层向上移动一层
  layer_landuse = new SuperMap.Layer.TiledDynamicRESTLayer(
    "landuse",
    path + "/iserver/services/map-china/rest/maps/landuse",
    {
      transparent: true,
      cacheEnabled: true
    },
    null
  );
  layer_landuse.setOpacity(0);
  layer_landuse.events.on({ layerInitialized: addlayer_landuse });
}
//移除图层上的点和面，包括弹窗口
function GoclearMarkers() {
  //风险普查移除mark点
  if (markers) {
    try {
      markers.clearMarkers();
    } catch (e) {}
  }
  //
  if (wtvectorLayer) {
    try {
      //先清除上次的显示结果
      wtvectorLayer.removeAllFeatures();
      wtvectorLayer.refresh();
    } catch (e) {}
  }
  if (cyvectorLayer) {
    try {
      //先清除上次的显示结果
      cyvectorLayer.removeAllFeatures();
      cyvectorLayer.refresh();
    } catch (e) {}
  }
  clearPopup();
}
//	地图加载完成后加载对应数据
function addData() {
  if (parent.mapFun == "zhzq_tjgl") {
    getSearchFw(parent.mapData);
    addZhMarker(parent.mapData);
  } else if (parent.mapFun == "zhzq_tjsz") {
    if (parent.mapState == "no") {
      addFwfdThemeLayer(
        parent.mapSpace,
        parent.mapData,
        parent.mapMax,
        parent.mapYs,
        parent.mapName,
        "no",
        parent.mapFwfdSql
      );
      addLabelThemeLayer(parent.mapData);
      //	    		addYsThemeLayer(parent.mapData,"1",parent.mapTjzd,parent.mapMax,true);
    } /*else{
	    		addThemeLayer(parent.mapKjData,"1",parent.mapTjData,parent.mapMax,parent.mapYs);
	    	}*/
  }
}
//   清楚气泡框/点图层/面图层
function clearDM() {
  tf_clearpopups();
  if (popup) {
    try {
      map.removePopup(popup);
    } catch (e) {}
  }
  if (markerLayer) {
    try {
      map.removeLayer(markerLayer);
    } catch (e) {}
  }
  if (themeLayer) {
    try {
      map.removeLayer(themeLayer);
    } catch (e) {}
  }
  if (vector) {
    try {
      map.removeLayer(vector);
    } catch (e) {}
  }
  if (sFLayer) {
    try {
      map.removeLayer(sFLayer);
    } catch (e) {}
  }
  if (labelLayer) {
    try {
      map.removeLayer(labelLayer);
    } catch (e) {}
  }
  if (fwfdThemeLayer) {
    try {
      map.removeLayer(fwfdThemeLayer);
    } catch (e) {}
  }
  if (addFwfdThemeLayer) {
    try {
      map.removeLayer(addFwfdThemeLayer);
    } catch (e) {}
  }
  if (yjd_markers) {
    try {
      map.removeLayer(yjd_markers);
    } catch (e) {}
  }
  if (cyvectorLayer) {
    try {
      map.removeLayer(cyvectorLayer);
    } catch (e) {}
  }
  if (cylayer) {
    try {
      map.removeLayer(cylayer);
    } catch (e) {}
  }
  if (cyvectorLayer) {
    try {
      map.removeLayer(cyvectorLayer);
    } catch (e) {}
  }
  if (markers) {
    try {
      map.removeLayer(markers);
    } catch (e) {}
  }

  if (cylayer) {
    try {
      map.removeLayer(cylayer);
    } catch (e) {}
  }
  if (cyvectorLayer) {
    try {
      map.removeLayer(cyvectorLayer);
    } catch (e) {}
  }
  if (backLayer) {
    try {
      map.removeLayer(backLayer);
    } catch (e) {}
  }
}
//高亮图层全屏显示功能  SuperMap.Bounds.scale
var scaleValue = 1.2;
function layerFullScreen() {
  var bounds = new SuperMap.Bounds();
  if (markerLayer && map.getLayer(markerLayer.id)) {
    for (var i = 0; i < markerLayer.markers.length; i++) {
      bounds.extend(markerLayer.markers[i].lonlat);
    }
  }
  if (themeLayer && map.getLayer(themeLayer.id)) {
    for (var i = 0; i < themeLayer.features.length; i++) {
      bounds.extend(themeLayer.features[i].geometry.bounds);
    }
  }
  if (vector && map.getLayer(vector.id)) {
    for (var i = 0; i < vector.features.length; i++) {
      bounds.extend(vector.features[i].geometry.bounds);
    }
  }
  if (sFLayer && map.getLayer(sFLayer.id)) {
    for (var i = 0; i < sFLayer.features.length; i++) {
      bounds.extend(sFLayer.features[i].geometry.bounds);
    }
  }
  if (labelLayer && map.getLayer(labelLayer.id)) {
    for (var i = 0; i < labelLayer.features.length; i++) {
      bounds.extend(labelLayer.features[i].geometry.bounds);
    }
  }
  if (fwfdThemeLayer && map.getLayer(fwfdThemeLayer.id)) {
    for (var i = 0; i < fwfdThemeLayer.features.length; i++) {
      bounds.extend(fwfdThemeLayer.features[i].geometry.bounds);
    }
  }
  if (yjd_markers && map.getLayer(yjd_markers.id)) {
    for (var i = 0; i < yjd_markers.markers.length; i++) {
      bounds.extend(yjd_markers.markers[i].lonlat);
    }
  }
  if (cyvectorLayer && map.getLayer(cyvectorLayer.id)) {
    for (var i = 0; i < cyvectorLayer.features.length; i++) {
      bounds.extend(cyvectorLayer.features[i].geometry.bounds);
    }
  }
  if (markers && map.getLayer(markers.id)) {
    for (var i = 0; i < markers.markers.length; i++) {
      bounds.extend(markers.markers[i].lonlat);
    }
  }
  if (backLayer && map.getLayer(backLayer.id)) {
    for (var i = 0; i < backLayer.features.length; i++) {
      bounds.extend(backLayer.features[i].geometry.bounds);
    }
  }
  if (wtselectFeatureGL && map.getLayer(wtselectFeatureGL.id)) {
    for (var i = 0; i < wtselectFeatureGL.features.length; i++) {
      bounds.extend(wtselectFeatureGL.features[i].geometry.bounds);
    }
  }
  if (zxhldetailsvectorLayer && map.getLayer(zxhldetailsvectorLayer.id)) {
    for (var i = 0; i < zxhldetailsvectorLayer.features.length; i++) {
      bounds.extend(zxhldetailsvectorLayer.features[i].geometry.bounds);
    }
  }
  if (wtselectFeatureZQ && map.getLayer(wtselectFeatureZQ.id)) {
    for (var i = 0; i < wtselectFeatureZQ.features.length; i++) {
      bounds.extend(wtselectFeatureZQ.features[i].geometry.bounds);
    }
  }
  if (wtvectorLayer && map.getLayer(wtvectorLayer.id)) {
    for (var i = 0; i < wtvectorLayer.features.length; i++) {
      bounds.extend(wtvectorLayer.features[i].geometry.bounds);
    }
  }
  if (xz_markers && map.getLayer(xz_markers.id)) {
    for (var i = 0; i < xz_markers.markers.length; i++) {
      bounds.extend(xz_markers.markers[i].lonlat);
    }
  }
  if (bounds.getWidth() <= 0) {
    //最后判断如果当前没有要素图层，则默认定位全国范围
    //			var bounds = new SuperMap.Bounds(9522715.454306,3025732.112108,14545077.194694,5815955.148669);
    bounds = new SuperMap.Bounds(
      9522715.454306,
      3025732.112108,
      14545077.194694,
      5815955.148669
    );
  }
  //统一缩放
  if (bounds != null) {
    map.zoomToExtent(bounds.scale(scaleValue));
  }
}
//	量算执行方法
function distanceMeasure() {
  clearFeatures();
  drawLine.activate();
}
function distanceMeasureM() {
  clearFeatures();
  drawFeature.activate();
}
//绘完触发事件
function drawCompleted(drawGeometryArgs) {
  //停止画面控制
  drawLine.deactivate();
  drawFeature.deactivate();
  //获得图层几何对象
  var geometry = drawGeometryArgs.feature.geometry;

  if (isSelFea) {
    //如果是框选查询，则需要进行空间分析
    isSelFea = false;
    window.parent.$("#loading_id").show();
    window.parent.$("#loading_mask_id").show();

    var overlayServiceByDatasets = new SuperMap.REST.OverlayAnalystService(
        path + "/iserver/services/spatialAnalysis-china/restjsr/spatialanalyst"
      ),
      dsOverlayAnalystParameters = new SuperMap.REST.DatasetOverlayAnalystParameters(
        {
          sourceDataset: "province@china",
          sourceDatasetFields: ["SNAME"],
          operateRegions: [geometry],
          tolerance: 0,
          operation: SuperMap.REST.OverlayOperationType.INTERSECT
        }
      );
    overlayServiceByDatasets.events.on({
      processCompleted: overlayAnalystCompleted,
      processFailed: overlayAnalystFailed
    });
    overlayServiceByDatasets.processAsync(dsOverlayAnalystParameters);

    return;
  }

  var measureParam = new SuperMap.REST.MeasureParameters(
    geometry
  ); /* MeasureParameters：量算参数类。 客户端要量算的地物间的距离或某个区域的面积*/
  var myMeasuerService = new SuperMap.REST.MeasureService(
    path + "/iserver/services/map-china/rest/maps/merge"
  ); //量算服务类，该类负责将量算参数传递到服务端，并获取服务端返回的量算结果
  myMeasuerService.events.on({ processCompleted: measureCompleted });

  //对MeasureService类型进行判断和赋值，当判断出是LineString时设置MeasureMode.DISTANCE，否则是MeasureMode.AREA
  if (geometry.CLASS_NAME.indexOf("LineString") > -1) {
    myMeasuerService.measureMode = SuperMap.REST.MeasureMode.DISTANCE;
  } else {
    myMeasuerService.measureMode = SuperMap.REST.MeasureMode.AREA;
  }
  myMeasuerService.processAsync(measureParam); //processAsync负责将客户端的量算参数传递到服务端。
}
//测量结束调用事件
function measureCompleted(measureEventArgs) {
  var distance = measureEventArgs.result.distance;
  var area = measureEventArgs.result.area;
  var unit = measureEventArgs.result.unit;
  var result = document.getElementById("result");
  var value = "量算结果：";
  if (distance != -1) {
    value += parseFloat(distance).toFixed(2) + "米";
  } else if (area != -1) {
    value += parseFloat(area).toFixed(2) + "平方米";
  }
  //var distance = measureEventArgs.result.distance;
  //var  unit = measureEventArgs.result.unit;
  //alert("量算结果:"+distance + "米");
  alert(value);
}
//叠加分析成果处理方法
function overlayAnalystCompleted(args) {
  var feature,
    features = [];
  if (args.result.recordset.features.length > 0) {
    window.parent.$("#zhzq_kj_id ul").html("");
    window.parent.$("#area_pan2 .pro_checkbox").attr("checked", false);
    for (var i = 0; i < args.result.recordset.features.length; i++) {
      feature = args.result.recordset.features[i];
      var zhhtml =
        "<li><p>" +
        feature.attributes.SNAME +
        "</p><img src='images/census/u54.png' onclick='imgclick(this)'></li>";
      window.parent
        .$("#zhzq_kj_id ul")
        .html(window.parent.$("#zhzq_kj_id ul").html() + " " + zhhtml);

      var chk_obj;
      for (
        var j = 0;
        j < window.parent.$("#area_pan2 .pro_checkbox").length;
        j++
      ) {
        chk_obj = window.parent.$("#area_pan2 .pro_checkbox")[j];
        if (chk_obj.type === "checkbox") {
          if (
            feature.attributes.SNAME.indexOf(chk_obj.value) >= 0 ||
            chk_obj.value.indexOf(feature.attributes.SNAME) >= 0
          ) {
            chk_obj.checked = true;
            window.parent.proarr.push(chk_obj.value);
          } else {
            //            				chk_obj.checked = false;
          }
        }
      }
    }
  }
  window.parent.$("#loading_id").hide();
  window.parent.$("#loading_mask_id").hide();
}
//叠加分析失败处理方法
function overlayAnalystFailed(args) {
  window.parent.$("#loading_id").hide();
  window.parent.$("#loading_mask_id").hide();
  alert(args.error.errorMsg);
}

//移除图层要素
function clearFeatures() {
  if (parent.kxState == "zhzq") {
    parent.townarr = [];
  }
  lineLayer.removeAllFeatures();
}
function drawGeometry() {
  //先清除上次的显示结果
  clearFeatures();

  drawFeature.activate();
}
function drawCompletedF(obj) {
  drawFeature.deactivate();
  var feature = obj.feature;
  feature.style = style;
  lineLayer.addFeatures(feature);
  var queryBounds = feature.geometry.bounds;
  var queryParam, queryByBoundsParams, queryService;
  queryParam = new SuperMap.REST.FilterParameter({ name: "county_tj@china" }); //FilterParameter设置查询条件，name是必设的参数，（图层名称格式：数据集名称@数据源别名）
  var fwurl = path + "/iserver/services/map-china/rest/maps/china";
  queryByBoundsParams = new SuperMap.REST.QueryByBoundsParameters({
    queryParams: [queryParam],
    bounds: queryBounds
  }); //queryParams查询过滤条件参数数组。bounds查询范围
  queryService = new SuperMap.REST.QueryByBoundsService(fwurl, {
    eventListeners: {
      processCompleted: processCompletedF,
      processFailed: processFailedF
    }
  });
  queryService.processAsync(queryByBoundsParams); //向服务端传递参数，然后服务端返回对象
}
function processCompletedF(queryEventArgs) {
  var i,
    j,
    result = queryEventArgs.result,
    marker; //queryEventArgs服务端返回的对象
  if (result && result.recordsets) {
    for (
      i = 0, recordsets = result.recordsets, len = recordsets.length;
      i < len;
      i++
    ) {
      if (recordsets[i].features) {
        for (j = 0; j < recordsets[i].features.length; j++) {
          var f = recordsets[i].features[j];
          var code = f.attributes.CODE;
          parent.townarr.push(code);
        }
      }
    }
    if (parent.kxState == "zhzq") {
      parent.getZhzqTjgl();
    }
  }
}
function processFailedF(e) {
  alert(e.error.errorMsg);
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
