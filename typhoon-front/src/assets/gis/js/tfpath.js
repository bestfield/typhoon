var popup = null;
var vector;
var vector1;
var animatorVector1;

var vectorLayer;
var linevoctor = new SuperMap.Layer.Vector("vector");
var popups = {};
var markerLayer = new SuperMap.Layer.Markers("坐标图层"); //台风图标图层
var styleCar1 = {
  externalGraphic: "../image/taifeng.gif",
  graphicWidth: 32,
  graphicHeight: 32
};
/*var  styleCar1=
{
		externalGraphic:"../image/taifeng.gif",
		graphicWidth:32,
		graphicHeight:32
		};*/
var selpoint;
var style = {
  style1: {
    fillColor: "#02FF02", //热带低压
    pointRadius: 2,
    strokeColor: "#02FF02",
    strokeWidth: 4
  },
  style2: {
    fillColor: "#0264FF", //热带风暴
    pointRadius: 2,
    strokeColor: "#0264FF",
    strokeWidth: 4
  },
  style3: {
    fillColor: "#FFFB05",
    pointRadius: 2,
    strokeColor: "#FFFB05",
    strokeWidth: 4
  },
  style4: {
    fillColor: "#FFAC05",
    pointRadius: 2,
    strokeColor: "#FFAC05",
    strokeWidth: 4
  },
  style5: {
    fillColor: "#F171F9",
    pointRadius: 2,
    strokeColor: "#F171F9",
    strokeWidth: 4
  },
  style6: {
    fillColor: "#F50202",
    pointRadius: 2,
    strokeColor: "#F50202",
    strokeWidth: 4
  },
  style7: {
    fillColor: "#CCCCCC",
    pointRadius: 2,
    strokeColor: "#CCCCCC",
    strokeWidth: 4
  }
};
var tafname = "";
var linesarr = [];
var points2 = [];
var taifei_jdata;

function addMarker(data) {
  //init();

  taifei_jdata = data;
  var end_count = 40;
  if (data != null && data != "") {
    end_count = end_count > data.length ? end_count : data.length + 2;
  }

  animatorVector1 = new SuperMap.Layer.AnimatorVector(
    "Metro",
    { rendererType: "StretchLine" },
    {
      repeat: false,
      //设置速度为每帧播放0.05的数据
      speed: 0.2,
      //开始时间为0
      startTime: 0,
      //每秒渲染12帧
      frameRate: 12,
      //结束时间设置为10
      endTime: end_count
    }
  );
  vectorLayer = new SuperMap.Layer.Vector("point");

  animatorVector1.events.on({
    drawfeaturestart: drawfeaturestart,
    loadend: loadEndListener
  });
  //animatorVector.events.on({"loadend": loadEndListener});

  animatorVector1.animator.events.on({ firstframestart: framestart });
  // animatorVector.animator.events.on({"lastframeend": loadEndListener});
  //alert(animatorVector.animator.getEndTime());
  map.addLayers([linevoctor, animatorVector1, vectorLayer, markerLayer]);

  var selectFeature = new SuperMap.Control.SelectFeature(vectorLayer, {
    hover: true,
    onSelect: onFeatureSelected,
    onUnselect: function() {
      if (popup) {
        map.removePopup(popup);
      }
      /*			var color=selpoint.attributes["color"];
			selpoint.style={
					fillColor: color,
					pointRadius: 2,
					strokeColor: color,
					strokeWidth: 4
			};*/
    }
  });
  map.addControl(selectFeature);
  selectFeature.activate();

  var index = Math.floor(data.length / 2);
  var midx, midy;
  var zbarr = [];

  $.each(data, function(i, dataObj) {
    var pkid = dataObj.pd_record_id;

    var name = dataObj.v_typh_name;

    tafname = name == null || name == "" ? "台风" : name;
    var smx = dataObj.pv06001;
    var smy = dataObj.pv05001;
    var pathtime = dataObj.v_path_time;
    var path_level = dataObj.v_path_level;

    var center_min_pressure = dataObj.v_center_min_pressure;

    var center_max_windspeed = dataObj.v_center_max_windspeed;

    if (smx != null && smx != "" && smy != "" && smy != null) {
      if (index == i) {
        midx = smx;
        midy = smy;
      }
      points2[i] = new SuperMap.Geometry.Point(smx, smy).transform(
        "EPSG:4326",
        "EPSG:900913"
      );
      zbarr[i] = [
        smx,
        smy,
        path_level,
        pathtime,
        center_min_pressure,
        center_max_windspeed
      ];
    } else {
      alert("无路径信息");
    }
  });
  for (var i = 0; i < zbarr.length; i++) {
    var temparr = [];
    for (var j = 0; j <= i; j++) {
      temparr.push(zbarr[j]);
    }
    linesarr[i] = [1, i, tafname, temparr];
  }

  addMetro();

  if (midx != null && midy != null)
    map.setCenter(
      new SuperMap.LonLat(midx, midy).transform("EPSG:4326", "EPSG:900913"),
      3
    );
  //var point1=new SuperMap.Geometry.Point(-180,-90).transform("EPSG:4326","EPSG:900913")
  //var point2=new SuperMap.Geometry.Point(180,90).transform("EPSG:4326","EPSG:900913")
  //	if(points2.length>2){
  //	var bounds = new SuperMap.Bounds(points2[0].x,points2[0].y,points2[points2.length-1].x,points2[points2.length-1].y);
  //	map.zoomToExtent(bounds);
  //	//map.zoomOut()
  //	}
  animatorVector1.animator.start();
}
/*--------------------------------------------*/
function loadEndListener() {}
function framestart() {
  vectorLayer.removeAllFeatures();
  map.removeAllPopup();
}
var lastpo = [];
var shotVectors = [];
function drawfeaturestart(feature) {
  //清除台风图表
  markerLayer.clearMarkers();
  var featureId = feature.attributes["FEATUREID"];
  //删除弹出框
  if (!popups[featureId]) popups[featureId] = [];
  for (var n = 0; n < popups[featureId].length; n++) {
    map.removePopup(popups[featureId][n]);
  }
  popups[featureId] = [];
  var arr = [];
  //	for(var i = 0;i<feature.geometry.components.length;i++)
  //	{
  var ml = feature.geometry.components[0];
  for (var j = 0; j < ml.components.length; j++) {
    var po = ml.components[j];

    if (j == 0) {
      var contentHTML = "";
      contentHTML +=
        "<span style=' font-size:12px; line-height: 12px;background-color: #fff'>"; //
      contentHTML += po.MetroName;
      contentHTML += "</span>";
      var popup = new SuperMap.Popup(
        "d",
        new SuperMap.LonLat(po.x, po.y),
        new SuperMap.Size(po.MetroName.length * 10, 18),
        contentHTML,
        false
      );
      popup.setOpacity(0.8);
      popup.setBackgroundColor("#fff");
      popup.setBorder("1px solid " + feature.style.fillColor);
      popups[featureId].push(popup);
      map.addPopup(popup);
    } else if (j == ml.components.length - 1) {
      var size = new SuperMap.Size(20, 20);
      var icon = new SuperMap.Icon("../image/taifeng.gif", size);
      var marker = new SuperMap.Marker(new SuperMap.LonLat(po.x, po.y), icon);
      marker.events.on({
        mouseover: openWin,
        mouseout: clearPopup,
        scope: marker
      });

      marker.smx = po.smx;
      marker.smy = po.smy;
      marker.Metro = po.Metro;
      marker.MetroName = po.MetroName;
      marker.level = po.LEVEL;
      marker.pathtime = po.pathtime;
      marker.min_pressure = po.min_pressure;
      marker.max_windspeed = po.max_windspeed;
      markerLayer.addMarker(marker);
      /*		var contentHTML = "";
			contentHTML += "<span style=' font-size:12px; line-height: 12px;background-color: #fff'>"; //
			contentHTML += po.pathtime;
			contentHTML += "</span>";
			var popup = new SuperMap.Popup("d",
			new SuperMap.LonLat(po.x,po.y),
			new SuperMap.Size((po.pathtime.length)*12,20),
			contentHTML,
			false);
			popup.setOpacity(0.8);
			popup.setBackgroundColor("#fff");
			popup.setBorder("1px solid "+feature.style.fillColor);
			popups[featureId].push(popup);
			map.addPopup(popup);
			*/
    }
    //定义点的颜色
    var thisStyle = {};
    if (po.LEVEL == "1") {
      thisStyle = style.style1;
    } else if (po.LEVEL == "2") {
      thisStyle = style.style2;
    } else if (po.LEVEL == "3") {
      thisStyle = style.style3;
    } else if (po.LEVEL == "4") {
      thisStyle = style.style4;
    } else if (po.LEVEL == "5") {
      thisStyle = style.style5;
    } else if (po.LEVEL == "6") {
      thisStyle = style.style6;
    } else {
      thisStyle = style.style7;
    }

    var fea = new SuperMap.Feature.Vector(
      po,
      {
        smx: po.smx,
        smy: po.smy,
        metro: po.Metro,
        name: po.MetroName,
        level: po.LEVEL,
        pathtime: po.pathtime,
        min_pressure: po.min_pressure,
        max_windspeed: po.max_windspeed,
        color: thisStyle.fillColor
      },
      thisStyle
    );
    arr.push(fea);
  }

  vectorLayer.addFeatures(arr);

  if (lastpo != "" && lastpo != null) {
    var pos = [];
    pos.push(
      new SuperMap.Geometry.Point(po.smx, po.smy).transform(
        "EPSG:4326",
        "EPSG:900913"
      )
    );
    pos.push(
      new SuperMap.Geometry.Point(lastpo[0], lastpo[1]).transform(
        "EPSG:4326",
        "EPSG:900913"
      )
    );
    var shotline = new SuperMap.Geometry.LineString(pos);
    var shotVector = new SuperMap.Feature.Vector(shotline);
    var lineCol = "";
    if (lastpo[2] == "1") {
      lineCol = style.style1.fillColor;
    } else if (lastpo[2] == "2") {
      lineCol = style.style2.fillColor;
    } else if (lastpo[2] == "3") {
      lineCol = style.style3.fillColor;
    } else if (lastpo[2] == "4") {
      lineCol = style.style4.fillColor;
    } else if (lastpo[2] == "5") {
      lineCol = style.style5.fillColor;
    } else if (lastpo[2] == "6") {
      lineCol = style.style6.fillColor;
    } else {
      lineCol = "#CCCCCC";
    }
    shotVector.style = {
      fillColor: lineCol,
      pointRadius: 1,
      strokeColor: lineCol,
      strokeWidth: 3
    };
    shotVectors.push(shotVector);
    linevoctor.addFeatures(shotVectors);
  }
  //if(po.LEVEL=="1"||po.LEVEL=="2"||po.LEVEL=="3"||po.LEVEL=="4"||po.LEVEL=="5"||po.LEVEL=="6"){
  lastpo[0] = po.smx;
  lastpo[1] = po.smy;
  lastpo[2] = po.LEVEL;
  //}

  /*		if(arr.length==linesarr.length){
		//animatorVector1.animator.pause();
		var line1 = new SuperMap.Geometry.LineString(points2,100);
		
		var linecVector = new SuperMap.Feature.Vector(line1);
		linecVector.style = {
				fillColor: "red",
				pointRadius: 1,
				strokeColor: "red",
				strokeWidth: 1
				
				};
		linevoctor.addFeatures([linecVector]);
		//map.addLayers([linevoctor]);
	}*/
}

//选择具体地铁站
function onFeatureSelected(e) {
  if (popup) {
    map.removePopup(popup);
  }
  selpoint = e;
  var color = e.attributes["color"];
  vectorLayer.drawFeature(e, {
    fillColor: color,
    pointRadius: 4,
    strokeColor: color,
    strokeWidth: 6
  });

  var contentHTML =
    "<div style='font-family: 微软雅黑 Regular,微软雅黑;font-size:.8em; opacity: 0.8; overflow-y:hidden;text-align: center;'>" +
    "<table>" +
    "<tr><td><b>当前位置</b></td><td>" +
    parseFloat(e.attributes["smx"]).toFixed(2) +
    "/" +
    parseFloat(e.attributes["smy"]).toFixed(2) +
    "</td></tr>" +
    "<tr><td><b>记录时间</b></td><td>" +
    e.attributes["pathtime"] +
    "</td></tr>" +
    "<tr><td><b>台风强度</b></td><td>" +
    e.attributes["level"] +
    "级</td></tr>" +
    "<tr><td><b>近中心最低气压</b></td><td>" +
    e.attributes["min_pressure"] +
    "百帕</td></tr>" +
    "<tr><td><b>近中心最大风速</b></td><td>" +
    e.attributes["max_windspeed"] +
    "米/秒</td></tr>";

  contentHTML += "</table></div>";
  popup = new SuperMap.Popup.FramedCloud(
    "chicken",
    new SuperMap.LonLat(e.geometry.x, e.geometry.y),
    null,
    contentHTML,
    null,
    true
  );
  popup.setOpacity(0.8);
  popup.setBackgroundColor("#fff");
  map.addPopup(popup);
}

//添加数据
function addMetro() {
  var lineFeatures = [];

  //循环台风路径线路
  for (var i = 0, len = linesarr.length; i < len; i++) {
    var metro = linesarr[i];
    var arrL = [];
    //循环每一条地铁分几部分修建
    /*		for(var j=0;j<metro[3].length;j++)
{*/
    var part = metro[3];
    var arrP = [];
    for (var k = 0; k < part.length; k++) {
      var point = new SuperMap.Geometry.Point(part[k][0], part[k][1]).transform(
        "EPSG:4326",
        "EPSG:900913"
      );
      point.MetroName = metro[2];
      point.Metro = metro[2];
      point.LEVEL = part[k][2];
      point.pathtime = part[k][3];
      point.min_pressure = part[k][4];
      point.max_windspeed = part[k][5];
      point.smx = part[k][0];
      point.smy = part[k][1];
      arrP.push(point);
    }
    var lineString = new SuperMap.Geometry.LineString(arrP);
    arrL.push(lineString);
    //}
    var multiLineString = new SuperMap.Geometry.MultiLineString(arrL);

    var sty = {
      fillColor: "#0000cc",
      pointRadius: 0,
      strokeColor: "#0000cc",
      strokeWidth: 0,
      fillOpacity: 0,
      strokeOpacity: 0
    };

    var lineFeature = new SuperMap.Feature.Vector(
      multiLineString,
      {
        FEATUREID: metro[0],
        TIME: metro[1]
      },
      sty
    );
    lineFeatures.push(lineFeature);
  }
  animatorVector1.addFeatures(lineFeatures);
}

function openWin() {
  clearPopup();
  var marker = this;
  // var pkid = marker.pkid;
  var smx = marker.smx;
  if (smx != null) {
    smx = parseFloat(smx).toFixed(2);
  }
  var smy = marker.smy;
  if (smy != null) {
    smy = parseFloat(smy).toFixed(2);
  }
  //var name=marker.name;
  var pathtime = marker.pathtime;
  var path_level = marker.level;
  var min_pressure = marker.min_pressure;
  var max_windspeed = marker.max_windspeed;
  var lonlat = marker.getLonLat();
  var contentHTML =
    "<div style='font-family: 微软雅黑 Regular,微软雅黑;font-size:.8em; opacity: 0.8; overflow-y:hidden;text-align: center;'>" +
    // "<span style='font-weight: bold; font-size: 18px;'>"+name+"</span><br>" +
    "<table>" +
    "<tr><td><b>当前位置</b></td><td>" +
    smx +
    "/" +
    smy +
    "</td></tr>" +
    "<tr><td><b>记录时间</b></td><td>" +
    pathtime +
    "</td></tr>" +
    "<tr><td><b>台风强度</b></td><td>" +
    path_level +
    "级</td></tr>" +
    "<tr><td><b>近中心最低气压</b></td><td>" +
    min_pressure +
    "百帕</td></tr>" +
    "<tr><td><b>近中心最大风速</b></td><td>" +
    max_windspeed +
    "米/秒</td></tr>";

  contentHTML += "</table></div>";

  popup = new SuperMap.Popup.FramedCloud(
    "popwin",
    new SuperMap.LonLat(lonlat.lon, lonlat.lat),
    new SuperMap.Size(220, 160),
    contentHTML,
    null,
    true
  );
  map.addPopup(popup);
}
function clearPopup() {
  if (popup) {
    try {
      map.removePopup(popup);
    } catch (e) {}
  }
}
