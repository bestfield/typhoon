var popup = null,
  sFLayer = null;
var popups = [];

//综合灾情-条件过滤-添加灾害图标
function addZhMarker(data, type) {
  if (
    parent.zhtypeArr2.length == 1 &&
    parent.zhtypeArr2[0] != "" &&
    parent.zhtypeArr2[0].indexOf("所有") == -1
  ) {
  } else {
    if (fwfdThemeLayer) {
      try {
        map.removeLayer(fwfdThemeLayer);
      } catch (e) {}
    }
    markerLayer = new SuperMap.Layer.Markers("坐标图层"); //创建一个有标签的图层Markers
    var zhStr = "";
    var levelStr = "";

    $.each(data, function(i, dataObj) {
      //			 var pkid=dataObj.pkid;
      //			 var name=dataObj.name;
      var sheng = dataObj.sheng;
      var shi = dataObj.shi;
      var xian = dataObj.xian;
      var code = dataObj.code;
      var level = dataObj.level == null ? "--" : dataObj.level;
      var zhlx = dataObj.oneZhlx;
      var smx = dataObj.smx;
      var smy = dataObj.smy;
      var img = "../images/zhtb/0.png";
      if (zhStr == "" || zhStr.indexOf(dataObj.oneZhlx) == -1) {
        zhStr += "," + dataObj.oneZhlx;
      }
      if (
        type == "1" &&
        zhlx.indexOf("暴雨洪涝") == -1 &&
        zhlx.indexOf("地质灾害")
      ) {
        return true;
      }
      if (dataObj.zhlevel == "1") {
        if (levelStr == "") {
          levelStr += "一级";
        } else if (levelStr.indexOf("一级") == -1) {
          levelStr += ",一级";
        }
      } else if (dataObj.zhlevel == "2") {
        if (levelStr == "") {
          levelStr += "二级";
        } else if (levelStr.indexOf("二级") == -1) {
          levelStr += ",二级";
        }
      } else if (dataObj.zhlevel == "3") {
        if (levelStr == "") {
          levelStr += "三级";
        } else if (levelStr.indexOf("三级") == -1) {
          levelStr += ",三级";
        }
      } else if (dataObj.zhlevel == "4") {
        if (levelStr == "") {
          levelStr += "四级";
        } else if (levelStr.indexOf("四级") == -1) {
          levelStr += ",四级";
        }
      }

      img =
        "../images/zhtb/" +
        dataObj.oneZhlx +
        (dataObj.zhlevel == null ? "" : dataObj.zhlevel) +
        ".png";
      if (dataObj.oneZhlx == null) {
        img = "../images/zhtb/0.png";
      }
      var size = new SuperMap.Size(16, 16);
      var offset = new SuperMap.Pixel(-(size.w / 2), -size.h);
      var icon = new SuperMap.Icon(img, size, offset);
      var marker = new SuperMap.Marker(new SuperMap.LonLat(smx, smy), icon); //.transform("EPSG:4326","EPSG:900913")
      marker.events.on({
        click: dOpenZqInfoWin,
        scope: marker
      });
      marker.sheng = sheng;
      marker.shi = shi;
      marker.xian = xian;
      marker.code = code;
      markerLayer.addMarker(marker);
    });
    map.addLayer(markerLayer);
    var zhArr = zhStr.split(",");
    var levelArr = levelStr.split(",");
    var zhSz =
      "热带气旋,暴雨洪涝,干旱,大风,冰雹,雷电,雪灾,低温冷害,冻害,沙尘暴,高温热浪,大雾,连阴雨,干热风,凌汛,地质灾害,风暴潮,寒潮,森林草原火灾,大气污染,其它";
    var zhSz1 =
      "热带气旋,暴雨洪涝,干旱,大风,冰雹,雷电,雪灾,低温冷害,冻害,沙尘暴,高温热浪,大雾,连阴雨,干热风,凌汛,地质灾害,风暴潮,寒潮,森林草原火灾,大气污染,其它";
    if (type == "1") {
      zhSz1 = "暴雨洪涝,地质灾害";
      zhSz = "暴雨洪涝,地质灾害";
    }

    $.each(zhArr, function(i, obj) {
      if (obj != null && obj != "" && obj != "null" && obj != "undefined") {
        var nobj = obj == "台风" ? "热带气旋" : obj;
        if (zhSz.indexOf(nobj) != -1) {
          zhSz1 = zhSz1.replace(nobj, "");
        }
      }
    });
    $.each(zhSz1.split(","), function(i, obj) {
      if (obj != null && obj != "" && obj != "null" && obj != "undefined") {
        zhSz = zhSz.replace(obj, "");
      }
    });
    var div1 = "",
      div2 = "<div>";
    $.each(zhSz.split(","), function(i, obj) {
      if (obj != null && obj != "" && obj != "null" && obj != "undefined") {
        div1 +=
          "<tr><td style='height:22px;'>&nbsp;<img src='images/zhtb/" +
          obj +
          ".png' style='width:16px;height:16px;'>&nbsp;&nbsp;" +
          obj +
          "&nbsp;&nbsp;</td></tr>";
      }
    });
    //		添加级别图例，暂时停用该功能
    /*	$.each(levelArr,function(i,obj){
			if(obj!=null&&obj!=""){
				div1+=obj+"<img src='images/zhtb/"+obj+".png' style='width:16px;height:16px;'>";
			}
		});*/
    div2 += "</div>";
    if (div1 != "") {
      div1 = "<div><table>" + div1 + "</table></div>"; //<tr><td style='text-align: center;background-color:#7392D8;font-size:12px;height:22px;color:white'>图例</td></tr>
      $("body", parent.document)
        .find("#map_li_")
        .html("<div>" + div1 + "</div>"); //+div2+
    }
  }
  var smapDate =
    (parent.startNian == "" ? "" : parent.startNian + "年") +
    (parent.startYue == "" ? "" : parent.startYue + "月") +
    (parent.startRi == "" ? "" : parent.startRi + "日");
  var emapDate =
    (parent.endNian == "" ? "" : parent.endNian + "年") +
    (parent.endYue == "" ? "" : parent.endYue + "月") +
    (parent.endRi == "" ? "" : parent.endRi + "日");
  var zhName = "";
  if (parent.zhtypeArr2.length > 0) {
    $.each(parent.zhtypeArr2, function(i, obj) {
      if (i < 2) {
        zhName +=
          parent.zhtypeArr2[i]
            .replace("_1", "")
            .replace("_2", "")
            .replace("热带气旋", "台风") +
          (i == 1 || i == parent.zhtypeArr2.length - 1 ? "" : "、");
      } else {
        i == 2 ? (zhName += "等") : "";
        return;
      }
    });
  } else {
    zhName = "气象";
  }
  var dateStr =
    smapDate == "" && emapDate == ""
      ? ""
      : "(" + (emapDate == "" ? smapDate : smapDate + "-" + emapDate) + ")";
  var kjName = "";

  if (parent.townarr.length == 0) {
    kjName = parent.kjfw;
    kjName = kjName == "全国全国" || kjName == "所有" ? "全国" : kjName;
  }

  var mapMC =
    "<div id='marker_map_name_id' contentEditable='true'>" +
    kjName +
    zhName +
    "灾害分布图" +
    "" +
    "<br><span style='font-size:14px;'>" +
    dateStr +
    "<span>" +
    "</div>";

  $("body", parent.document)
    .find("#map_list_")
    .html(mapMC);
  $("body", parent.document)
    .find("#map_list_")
    .show();
  //	$("#map_li_").html("<div>"+div1+div2+"</div>");
}
//综合灾情-条件过滤-查询灾情所属县-地图加面
function getSearchFw(data, sta) {
  var sqlStr = " code in (";
  //	$.each(data,function(i,dataObj){
  //		sqlStr+=((i==0?"":" or ")+"CODE='"+dataObj.code+"'");
  //	});
  $.each(data, function(i, dataObj) {
    //		if(i>1000)return;
    sqlStr += "'" + dataObj.code + (i == data.length - 1 ? "'" : "',"); //||i==1000
  });
  sqlStr += " )";
  sFLayer = new SuperMap.Layer.Vector("sFLayer");
  map.addLayer(sFLayer);
  if (sta != "click") {
    map.setLayerIndex(sFLayer, map.getNumLayers() - 1); //将注记设置到最上面
  }
  var queryParam, queryBySQLParams, queryBySQLService;
  var fwurl = path + "/iserver/services/map-china/rest/maps/china";
  queryParam = new SuperMap.REST.FilterParameter({
    name: "county@china", //"Countries@World.1",
    attributeFilter: sqlStr //"光缆规格  like '%144芯%'"//"Pop_1994>1000000000 and SmArea>900"
  });
  queryBySQLParams = new SuperMap.REST.QueryBySQLParameters({
    queryParams: [queryParam]
  });
  queryBySQLService = new SuperMap.REST.QueryBySQLService(fwurl, {
    eventListeners: {
      processCompleted: sfprocessCompleted,
      processFailed: sfprocessFailed
    }
  });
  queryBySQLService.processAsync(queryBySQLParams);
  sFWselectGL();
  $("body", parent.document)
    .find("#loading_id")
    .hide();
  $("body", parent.document)
    .find("#loading_mask_id")
    .hide();
}
//综合灾情-条件过滤-查询灾情所属县-地图加面-成功
function sfprocessCompleted(queryEventArgs) {
  var i, j, feature;
  result = queryEventArgs.result;
  if (result && result.recordsets) {
    for (i = 0; i < result.recordsets.length; i++) {
      if (result.recordsets[i].features) {
        for (j = 0; j < result.recordsets[i].features.length; j++) {
          feature = result.recordsets[i].features[j];
          //                  var name = feature.attributes["NAME"];
          feature.style = {
            strokeColor: "#F4F4ED",
            strokeWidth: 1,
            fillColor: "#E23130",
            //                    		fontWeight:"bold",
            //                    		fontFamily:"隶书",
            //                    		fontSize:"12px",
            //                    		fontColor:'#E23130',
            //                    		label:name,
            fillOpacity: "0.5"
          };
          sFLayer.addFeatures(feature);
        }
      }
    }
  }
}
//综合灾情-条件过滤-查询灾情所属县-地图加面-失败
function sfprocessFailed(e) {
  alert(e.error.errorMsg);
}
//综合灾情-条件过滤-增加面选中样式控件
function sFWselectGL() {
  var sFWselectFeatureGL = new SuperMap.Control.SelectFeature(sFLayer, {
    onSelect: sFWonFeatureSelectGL,
    onUnselect: sFWonUnFeatureSelectGL,
    callbacks: {
      click: function(e) {
        mOpenZqInfoWin(e);
      }
    },
    hover: true
  });

  //map上添加控件
  map.addControl(sFWselectFeatureGL);
  //激活控件
  sFWselectFeatureGL.activate();
}
//综合灾情-条件过滤-选中县范围时,变更显示颜色.
function sFWonFeatureSelectGL(feature) {
  /*		if(popup)
		{
		map.removePopup(popup);
		}*/
  sFLayer.drawFeature(feature, {
    strokeColor: "#CFCFCF",
    strokeWidth: 1,
    fontWeight: "bold",
    fillColor: "yellow",
    fontSize: "12px",
    fillOpacity: "0.8"
  });
  //		 openZqInfoWin(feature);
}
//综合灾情-条件过滤-要素被取消选中时调用此函数,需要传入当前要素参数feature
function sFWonUnFeatureSelectGL(feature) {
  /*		if(popup)
		{
		map.removePopup(popup);
		}*/
  /*	    feature.style =  {
	    		strokeColor: "#E23130",
	    		strokeWidth:1,
	    		fillColor: "#E23130",
	    		fillOpacity: "0.2"
	    		};*/
}
//综合灾情-条件过滤-灾害信息弹出框
function mOpenZqInfoWin(e) {
  var code = e.attributes["CODE"];
  var lonlat = e.geometry.getCentroid();
  openZqInfoWin(code, lonlat, "m");
}
function dOpenZqInfoWin(e) {
  var marker = this;
  var code = marker.code;
  var lonlat = marker.getLonLat();
  openZqInfoWin(code, lonlat, "d");
}
function openZqInfoWin(code, lonlat, st) {
  hideTitle();
  if (popup) {
    try {
      map.removePopup(popup);
    } catch (e) {}
  }
  var param = {
    code: code,
    zhlb: parent.zhtypeArr2.join(","),
    zbfw: parent.zbfw,
    startNian: parent.startNian,
    startYue: parent.startYue,
    startRi: parent.startRi,
    endNian: parent.endNian,
    endYue: parent.endYue,
    endRi: parent.endRi
  };
  $.ajax({
    async: false,
    cache: true,
    type: "POST",
    dataType: "json",
    url: "../getZhzqDetail.do",
    data: param,
    error: function() {},
    timeout: 1000,
    success: function(data) {
      var contentHTML = "";
      if (data.length > 1) {
        contentHTML =
          "<div style='font-size:12px; opacity: 0.8;min-width:280px;max-height:200px;'>" +
          "<table style='cellspacing=\"5\"'><tr><td colspan=\"5\" style='font-size:14px; font-weight:bold ;color:#2476E3;border-bottom: 1px solid #E4E4E4;height:25px;line-height: 25px;'>" +
          data[0].sheng +
          data[0].shi +
          data[0].xian +
          "</td></tr>" +
          '<tr style="font-weight:bold;"><td>灾害类型</td><td>开始日期</td><td>结束日期</td><td>详情</td></tr>'; //<th>受灾人口</th><th>死亡人口</th><th>失踪人口</th><th>饮水困难人口</th><th>受灾面积（公顷）</th><th>绝收面积（公顷）</th><th>倒塌房屋（间）</th><th>损坏房屋（间）</th>
        $.each(data, function(i, dataObj) {
          if (i > 9) return;
          contentHTML +=
            "<tr><td>" +
            dataObj.twoZhlx +
            "(" +
            dataObj.oneZhlx +
            ")" +
            "</td><td>" +
            dataObj.startDate +
            "</td><td>" +
            dataObj.endDate +
            "</td>" +
            "<td>" +
            '<a href="../disasterdetails_index.html?pkid=' +
            dataObj.pkid +
            "\" target='_blank'>详情</a>" +
            //		         							"<a href='javascript:getRootPath("+dataObj.pkid+")'>详情</a>" +
            "</td>" +
            /*	        					 "<td>"+dataObj.szaiRk+"</td><td>"+dataObj.swangRk+"</td><td>"+dataObj.szongRk+"</td><td>"+dataObj.ysknRk+"</td>" +
			        					 "<td>"+dataObj.szaiMj+"</td><td>"+dataObj.jshouMj+"</td>" +
			        					 "<td>"+dataObj.dTaFw+"</td><td>"+dataObj.sHuaiFw+"</td>" +*/
            "</tr>";
        });
        contentHTML += "<tr></tr></table></div>";
      } else if (data.length == 1) {
        var dataObj = data[0];
        contentHTML =
          "<div style='font-size:12px; opacity: 0.8;width:200px;height:180px;'>" +
          "<table style='width:200px;cellspacing=\"5\"'><tr><td colspan=\"2\" style='font-size:14px; font-weight:bold ;color:#2476E3;border-bottom: 1px solid #E4E4E4;height:25px;line-height: 25px;'>" +
          data[0].sheng +
          data[0].shi +
          data[0].xian +
          "</td></tr>" +
          "<tr><td>灾害类型：</td><td>" +
          dataObj.twoZhlx +
          "(" +
          dataObj.oneZhlx +
          ")</td></tr>" +
          "<tr><td>开始日期：</td><td>" +
          dataObj.startDate +
          "</td></tr>" +
          "<tr><td>结束日期：</td><td>" +
          dataObj.endDate +
          "</td></tr>" +
          "<tr><td>受灾人口：</td><td>" +
          dataObj.szaiRk +
          "人</td></tr>" +
          "<tr><td>死亡人口：</td><td>" +
          dataObj.swangRk +
          "人</td></tr>" +
          "<tr><td>失踪人口：</td><td>" +
          dataObj.szongRk +
          "人</td></tr>" +
          "<tr><td>饮水困难人口：</td><td>" +
          dataObj.ysknRk +
          "人</td></tr>" +
          "<tr><td colspan=\"2\" style='text-align:right;'>" +
          //			            			"<a href='javascript:getRootPath("+dataObj.pkid+")'>详情</a>" +
          '<a href="../disasterdetails_index.html?pkid=' +
          dataObj.pkid +
          "\" target='_blank'>详情</a>" +
          "</td></tr>";
        contentHTML += "</table></div>";
      }

      var dDx;
      if (st == "m") {
        dDx = new SuperMap.LonLat(lonlat.x, lonlat.y);
      } else {
        dDx = new SuperMap.LonLat(lonlat.lon, lonlat.lat);
      }

      popup = new SuperMap.Popup.FramedCloud(
        "popwin",
        dDx,
        null,
        contentHTML,
        null,
        true,
        function() {
          //关闭弹框显示函数
          window.parent.showTitleP();
          //return true;
          map.removePopup(popup);
        }
      );

      map.addPopup(popup);
    }
  });
}

function addMarker(data) {
  clearDM();
  if (fwfdThemeLayer) {
    try {
      map.removeLayer(fwfdThemeLayer);
    } catch (e) {}
  }
  //中小河流预警点
  markerLayer = new SuperMap.Layer.Markers("灾情图层"); //创建一个有标签的图层Markers
  $.each(data, function(i, dataObj) {
    var pkid = dataObj.pkid;
    var name = dataObj.name;
    var smx = dataObj.smx;
    var smy = dataObj.smy;
    var size = new SuperMap.Size(16, 16);
    var offset = new SuperMap.Pixel(-(size.w / 2), -size.h);
    var icon = new SuperMap.Icon("../images/0.png", size, offset);
    var marker = new SuperMap.Marker(new SuperMap.LonLat(smx, smy), icon); //.transform("EPSG:4326","EPSG:900913")
    marker.events.on({
      click: openWin,
      scope: marker
    });
    marker.pkid = pkid;
    marker.name = name;
    marker.smx = smx;
    marker.smy = smy;
    markerLayer.addMarker(marker);
  });
  map.addLayer(markerLayer);
}
function openWin() {
  clearPopup();
  var marker = this;
  var pkid = marker.pkid;
  var name = marker.name;
  var lonlat = marker.getLonLat();
  $.ajax({
    async: false,
    cache: true,
    type: "POST",
    dataType: "json",
    url: "../getFxpcDetail.do",
    data: { pkid: pkid },
    error: function() {},
    timeout: 1000,
    success: function(data) {
      var contentHTML =
        "<div style='font-size:.8em; opacity: 0.8; overflow-y:hidden;text-align: center;'>" +
        "<span style='font-weight: bold; font-size: 18px;'>" +
        name +
        "</span><br><table>" +
        "<tr><th>入库时间</th><th>最新修订标识</th><th>洪水等级</th><th>临界面雨量时效</th><th>临界面雨量</th></tr>";

      if (data != null) {
        $.each(data, function(i, dataObj) {
          contentHTML +=
            "<tr><td>" +
            dataObj.rksj +
            "</td><td>" +
            dataObj.zxxdbs +
            "</td><td>" +
            dataObj.hsdj +
            "</td><td>" +
            dataObj.ljmylsx +
            "</td><td>" +
            dataObj.ljmylsx +
            "</td></tr>";
        });
      } else {
      }

      contentHTML += "</table></div>";

      popup = new SuperMap.Popup.FramedCloud(
        "popwin",
        new SuperMap.LonLat(lonlat.lon, lonlat.lat),
        null,
        contentHTML,
        null,
        true,
        function() {
          //关闭弹框显示函数
          window.parent.showTitleP();
          //return true;
          map.removePopup(popup);
        }
      );
      map.addPopup(popup);
    }
  });
}
function clearPopup() {
  if (popup) {
    try {
      map.removePopup(popup);
    } catch (e) {}
  }
}
//添加个例坐标图层
function addGlMarker(data) {
  clearDM();
  if (fwfdThemeLayer) {
    try {
      map.removeLayer(fwfdThemeLayer);
    } catch (e) {}
  }
  markerLayer = new SuperMap.Layer.Markers("坐标图层"); //创建一个有标签的图层Markers
  var zhStr = "";
  var levelStr = "";

  $.each(data, function(i, dataObj) {
    var level = dataObj.zhlevel == null ? "--" : dataObj.level;
    var szdq = dataObj.szaiDq;
    var zhlx = dataObj.zhlx;
    var smx = dataObj.smx;
    var smy = dataObj.smy;
    var pkid = dataObj.pkid;
    var img = "../images/zhtb/0.png";
    if (zhStr == "" || zhStr.indexOf(dataObj.zhlx) == -1) {
      zhStr += "," + dataObj.zhlx;
    }
    if (dataObj.level == "1") {
      if (levelStr == "") {
        levelStr += "一级";
      } else if (levelStr.indexOf("一级") == -1) {
        levelStr += ",一级";
      }
    } else if (dataObj.level == "2") {
      if (levelStr == "") {
        levelStr += "二级";
      } else if (levelStr.indexOf("二级") == -1) {
        levelStr += ",二级";
      }
    } else if (dataObj.level == "3") {
      if (levelStr == "") {
        levelStr += "三级";
      } else if (levelStr.indexOf("三级") == -1) {
        levelStr += ",三级";
      }
    } else if (dataObj.level == "4") {
      if (levelStr == "") {
        levelStr += "四级";
      } else if (levelStr.indexOf("四级") == -1) {
        levelStr += ",四级";
      }
    }
    img =
      "../images/zhtb/" +
      dataObj.zhlx +
      (dataObj.level == null ? "" : dataObj.level) +
      ".png";
    if (dataObj.oneZhlx == "") {
      img = "../images/zhtb/0.png";
    }
    var size = new SuperMap.Size(16, 16);
    var offset = new SuperMap.Pixel(-(size.w / 2), -size.h);
    var icon = new SuperMap.Icon(img, size, offset);
    var marker = new SuperMap.Marker(new SuperMap.LonLat(smx, smy), icon); //.transform("EPSG:4326","EPSG:900913")
    marker.events.on({
      click: openZhWin,
      scope: marker
    });
    marker.area = szdq;
    marker.zhlx = zhlx;
    marker.level = level;
    marker.smy = smy;
    marker.pkid = pkid;
    if (i < 500) {
      markerLayer.addMarker(marker);
    }
  });
  map.addLayer(markerLayer);
  var zhArr = zhStr.split(",");
  var levelArr = levelStr.split(",");
  var div1 = "",
    div2 = "<div>";
  $.each(zhArr, function(i, obj) {
    if (obj != null && obj != "" && obj != "null" && obj != "undefined") {
      div1 +=
        "<tr><td style='height:22px;'>&nbsp;<img src='images/zhtb/" +
        obj +
        ".png' style='width:16px;height:16px;'>&nbsp;&nbsp;" +
        obj +
        "&nbsp;&nbsp;</td></tr>";
    }
  });
  $.each(levelArr, function(i, obj) {
    if (obj != null && obj != "") {
      div1 +=
        obj +
        ":<img src='images/zhtb/" +
        obj +
        ".png' style='width:16px;height:16px;'>&nbsp;&nbsp;";
    }
  });
  div2 += "</div>";
  if (div1 != null && div1 != "" && div1 != "null" && div1 != "undefined") {
    div1 =
      "<div><table><tr><td style='text-align: center;background-color:#7392D8;font-size:12px;height:22px;color:white'>图例</td></tr>" +
      div1 +
      "</table></div>";
    $("body", parent.document)
      .find("#map_li_")
      .html("<div style='text-align: left;'>" + div1 + div2 + "</div>");
  }

  //	$("#map_li_").html("<div>"+div1+div2+"</div>");
}
//灾害个例-只查询台风时加线
var vector;
var popup1;
function addZhglMarker(data) {
  $("body", parent.document)
    .find("#map_li_")
    .html("");
  $("body", parent.document)
    .find("#loading_id")
    .hide();
  $("body", parent.document)
    .find("#loading_mask_id")
    .hide();
  /*	map.removeAllPopup();
	if(markerLayer){
		map.removeLayer(markerLayer);
	}
	if(themeLayer){
		map.removeLayer(themeLayer);
	}
	if(vector){
		map.removeLayer(vector);
		vector=null;
	}*/
  /*	if( popup1){
		map.
	}*/
  if (data == null || data.data == 0) {
    return;
  }
  vector = new SuperMap.Layer.Vector("vector");
  var fea = [];
  var colors = [
    "#02FF02",
    "#0264FF",
    "#FFFB05",
    "#FFAC05",
    "#F171F9",
    "#F50202"
  ];
  //var xxx=0,yyy=0;
  map.events.on({
    mousemove: function(e) {
      var lonlat = map.getLonLatFromPixel(new SuperMap.Pixel(e.xy.x, e.xy.y));

      xxx = lonlat.lon.toFixed(5);

      yyy = lonlat.lat.toFixed(5);
      /*	var newHtml="地图坐标转换：像素坐标与地理位置坐标转换<br> 鼠标像素坐标：" + "x="+Math.floor(e.clientX)+"，"+"y="+Math.floor(e.clientY) +
	"<br>位置坐标："+ "lon="+ lonlat.lon.toFixed(5) + "，" + "lat="+
	lonlat.lat.toFixed(5);*/
    }
  });

  $.each(data, function(i, dataObj) {
    //..........................
    //if(i>50)return;

    var points = [];
    $.each(dataObj.pathinfo, function(k, value) {
      points.push(
        new SuperMap.Geometry.Point(value.smx, value.smy).transform(
          "EPSG:4326",
          "EPSG:900913"
        )
      );
    });
    var line = new SuperMap.Geometry.LineString(points);
    line.MetroName = dataObj.v_typh_name;
    line.pkid = dataObj.d_record_id;
    line.code = dataObj.v_typh_code;
    line.start = dataObj.v_start_date;
    line.end = dataObj.v_end_date;
    line.gnbh = dataObj.gnbh;
    line.x = dataObj.pathinfo[0].smx;
    line.y = dataObj.pathinfo[0].smy;
    // line.code=dataObj.v_typh_code
    /*		 if(xxx==null||yyy==null||xxx==0||yyy==0){
			
		 }else{
			 line.x=xxx;
			 line.y=yyy; 
			 
		 }*/
    var linecVector = new SuperMap.Feature.Vector(line);
    /*		 var index=0;
		 
		 if(dataObj.maxlevel){
			 index=parseInt(levelchange(dataObj.maxlevel)-1; 
		 }*/
    linecVector.style = {
      strokeColor: colors[levelchange(dataObj.maxlevel)],
      strokeWidth: 4,
      strokeOpacity: 0.8
    };
    /*	    linecVector.isHoverAble = true;
	    linecVector.highlightStyle={
	            strokeColor:colors[levelchange(dataObj.maxlevel)],
	            strokeWidth:4
	    };*/
    fea.push(linecVector);

    var lonlat = new SuperMap.LonLat(
      dataObj.pathinfo[0].smx,
      dataObj.pathinfo[0].smy
    ).transform("EPSG:4326", "EPSG:900913");

    var contentHTML = "";
    contentHTML +=
      "<span style=' font-size:12px; line-height: 12px;font-family: Consolas; background-color: #fff'>"; //
    contentHTML += dataObj.v_typh_code + "&nbsp;" + dataObj.v_typh_name;
    contentHTML += "</span>";
    popup = new SuperMap.Popup(
      "d",
      lonlat,
      new SuperMap.Size(
        (dataObj.v_typh_code.length + dataObj.v_typh_name.length - 1) * 10,
        18
      ),
      contentHTML,
      false
    );
    popup.setOpacity(0.8);
    popup.setBackgroundColor("#fff");
    popup.setBorder("1px solid " + colors[levelchange(dataObj.maxlevel)]);
    popups.push(popup);
    map.addPopup(popup);
  });
  vector.addFeatures(fea);
  map.addLayer(vector);
  map.setCenter(
    new SuperMap.LonLat(132.365649, 26.834565).transform(
      "EPSG:4326",
      "EPSG:900913"
    ),
    3
  );
  var selectFeature = new SuperMap.Control.SelectFeature(vector, {
    hover: true,
    onSelect: ClickFreature,
    /*		 callbacks: {
			 //alert(lonLat1);   loat
			 click:function(e){
				 //openWin(loat,maparr);
				 ClickFreature(e);
			 }
		 },*/
    onUnselect: function() {}
  });
  map.addControl(selectFeature);
  selectFeature.activate();

  function levelchange(maxlevel) {
    var inx = 0;
    if (maxlevel != null && maxlevel != "") {
      var levelint = parseInt(maxlevel);
      if (levelint >= 6 && levelint <= 7) {
        inx = 0;
      } else if (levelint >= 8 && levelint <= 9) {
        inx = 1;
      } else if (levelint >= 10 && levelint <= 11) {
        inx = 2;
      } else if (levelint >= 12 && levelint <= 13) {
        inx = 3;
      } else if (levelint >= 14 && levelint <= 15) {
        inx = 4;
      } else if (levelint >= 6) {
        inx = 5;
      }
    }
    return inx;
  }

  /*
 * 点击事件
 */

  function ClickFreature(e) {
    if (popup1) {
      map.removePopup(popup1);
    }
    var color = e.style.strokeColor;
    vector.drawFeature(e, {
      strokeWidth: 5,
      strokeOpacity: 1,
      strokeColor: color
    });

    var contentHTML =
      "<div style='font-family: 微软雅黑 Regular,微软雅黑;font-size:12px; opacity: 0.8; overflow-y:hidden;text-align: center;'>" +
      "<table style='width:100%'>" +
      "<tr><td><b>台风序号</b></td><td>" +
      e.geometry.code +
      "</td></tr>" +
      "<tr><td><b>国内编号</b></td><td>" +
      e.geometry.gnbh +
      "</td></tr>" +
      "<tr><td><b>台风名</b></td><td>" +
      e.geometry.MetroName +
      "</td></tr>" +
      "<tr><td><b>开始日期</b></td><td>" +
      e.geometry.start +
      "</td></tr>" +
      "<tr><td><b>结束日期</b></td><td>" +
      e.geometry.end +
      "</td></tr>" +
      "<tr><td></td><td>&nbsp;&nbsp;<a style='cursor:pointer' onclick='parentLink(\"" +
      e.geometry.pkid +
      "\")'" +
      "' onmouseover='this.style.color=\"#2476E3\"' onmouseout='this.style.color=\"#333333\"' >详情</a></td></tr>";

    contentHTML += "</table></div>";
    popup1 = new SuperMap.Popup.FramedCloud(
      "chicken",
      new SuperMap.LonLat(xxx, yyy),
      null,
      contentHTML,
      null,
      true
    );
    popup.setOpacity(0.8);
    popup.setBackgroundColor("#fff");
    map.addPopup(popup1);
  }

  /**
   * 焦点事件
   * @param e
   */
  function onFeatureSelected(e) {
    var color = e.style.strokeColor;
    vector.drawFeature(e, {
      strokeWidth: 5,
      strokeOpacity: 1,
      strokeColor: color
    });
  }
}
function parentLink(pkids) {
  window.parent.open("../taifengdetail1.html?PKID=" + pkids);
  return;
}
/**
 * 台风清除图层
 */
function tf_clearpopups() {
  if (popup1) {
    map.removePopup(popup1);
  }
  for (var int = 0; int < popups.length; int++) {
    if (popups[int]) {
      try {
        map.removePopup(popups[int]);
      } catch (e) {}
    }
  }
}
function openZhWin() {
  clearPopup();
  var marker = this;
  var kongjian = marker.area;
  var zhlx = marker.zhlx;
  var level = marker.level;
  var lonlat = marker.getLonLat();
  var pkid = marker.pkid;

  var contentHTML =
    "<div style='width:120px;height:100px;font-size:12px; opacity: 0.8; overflow-y:hidden;text-align: center;'>" +
    "<div style=' font-size:14px; font-weight:bold ;color:#2476E3;border-bottom: 1px solid #E4E4E4;height:25px;line-height: 25px;'>" +
    zhlx +
    "</div>" +
    "<table style='width:100%;cellspacing=5'>" +
    "<tr><td>受灾地区：</td><td>" +
    kongjian +
    "</td></tr>" +
    "<tr><td>类型：</td><td>" +
    zhlx +
    "</td></tr>" +
    "<tr><td>级别：</td><td>" +
    level +
    "</td></tr>" +
    "<tr><td></td><td><a style='cursor:pointer;color:#333333' onclick='parentLink_othergeli(\"" +
    pkid +
    "\")'" +
    " onmouseover='this.style.color=\"#2476E3\"' " +
    " onmouseout='this.style.color=\"#333333\"' >详情</a>" +
    "</td></tr>";

  contentHTML += "</table></div>";

  popup = new SuperMap.Popup.FramedCloud(
    "popwin",
    new SuperMap.LonLat(lonlat.lon, lonlat.lat),
    null,
    contentHTML,
    null,
    true
  );
  map.addPopup(popup);
}
function parentLink_othergeli(pkids) {
  window.parent.open("../casedetails.html?pkid=" + pkids);
  return;
}
function setCenter(pkid, area, zh, zh2, sd, ed, x, y) {
  clearPopup();
  map.setCenter(new SuperMap.LonLat(x, y), 3);
  var contentHTML =
    "<div style='font-family: 微软雅黑 Regular,微软雅黑;font-size:12px;opacity: 0.8; overflow-y:hidden;text-align: center;'>" +
    "<span style='font-weight: bold; font-size: 18px;'>" +
    area +
    "</span><br><table>" +
    "<tr><th>一级灾害</th><th>二级灾害</th><th>开始日期</th><th>结束日期</th><th>详情</th></tr>";
  contentHTML +=
    "<tr><td>" +
    zh +
    "</td><td>" +
    zh2 +
    "</td><td>" +
    sd +
    "</td><td>" +
    ed +
    "</td><td>" +
    //		 			"<a href='javascript:getRootPath("+pkid+")'>详情</a>" +
    '<a href="../disasterdetails_index.html?pkid=' +
    pkid +
    "\" target='_blank'>详情</a>" +
    "</td></tr>";
  contentHTML += "</table></div>";
  var popup = new SuperMap.Popup.FramedCloud(
    "popwin",
    new SuperMap.LonLat(x, y), //.transform("EPSG:4326","EPSG:900913")
    null,
    contentHTML,
    null,
    true
  );
  fhqinfowin = popup;
  map.addPopup(popup);
}
function getRootPath(pkid) {
  window.open(
    "../disasterdetails_index.html?pkid=" + pkid,
    "_blank",
    "fullscreen=yes"
  );
}

/*
 *隐藏标题
 */
function hideTitle() {
  window.parent.hidemapTitle();
}
