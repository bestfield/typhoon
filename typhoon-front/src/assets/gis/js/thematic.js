var wtlayer,
  stylewt,
  wtselectFeatureZQ,
  wtselectFeatureGL,
  stylewt2,
  snamearr,
  wturl1 = path + "/iserver/services/map-china/rest/maps/china", //行政区划图层
  wturl2 = path + "/iserver/services/data-china/rest/data"; //行政区划数据图层
/**
 * 初始化遮罩图层
 */
function initwtfengduan() {
  wtlayer = new SuperMap.Layer.TiledDynamicRESTLayer(
    "china",
    wturl1,
    { transparent: true, cacheEnabled: true },
    { maxResolution: "auto" }
  );
  wtlayer.events.on({ layerInitialized: addwtLayer });
  wtvectorLayer = new SuperMap.Layer.Vector("Vector Layer");
}

function addwtLayer() {
  map.addLayers([wtlayer, wtvectorLayer]);
}
/**综合灾情
 * 查询对应的地块
 * 按县级行政区划查询
 */
function getFeaturesBySQLwt(name, namecode, x, y) {
  //初始化样式
  stylewt = {
    strokeColor: "#E23130",
    strokeWidth: 2,
    fillColor: "#E23130",
    fontWeight: "bold",
    fontFamily: "隶书",
    fontSize: "12px",
    label: name,
    fillOpacity: "0.2"
  };
  //	labeltext=name;
  map.panTo(new SuperMap.LonLat(y, x));
  map.setCenter(
    new SuperMap.LonLat(y, x).transform("EPSG:4326", "EPSG:900913"),
    6
  ); //108.07567641634,36.855795258955
  //	city@china@@china  province
  //	county@china@@china
  //	var tucheng="county@china";

  wtvectorLayer.removeAllFeatures();

  var getFeatureParam, getFeatureBySQLService, getFeatureBySQLParams;

  getFeatureParam = new SuperMap.REST.FilterParameter({
    name: "county@china",
    attributeFilter: "CODE = '" + namecode + "'"
  });
  getFeatureBySQLParams = new SuperMap.REST.GetFeaturesBySQLParameters({
    queryParameter: getFeatureParam,
    datasetNames: ["china:county"]
  });
  getFeatureBySQLService = new SuperMap.REST.GetFeaturesBySQLService(wturl2, {
    eventListeners: {
      processCompleted: processCompletedwt,
      processFailed: processFailedwt
    }
  });

  getFeatureBySQLService.processAsync(getFeatureBySQLParams);
  mouseClickHandler(new SuperMap.LonLat(y, x), namecode, "zaiqing");
  //	selectDiWU(new SuperMap.LonLat(y,x),map)
  layerFullScreen();
}
/********************灾害个例
 * 省级行政区划查询
 * @param name
 * @param x
 * @param y
 */
var lonLat1 = null;
function getFeaturesBySQLProvince(name, y, x) {
  clearFeatureswt();
  //初始化样式
  //	stylewt2 = {
  //			strokeColor: "#DF5200",
  //			strokeWidth: 2,
  ////			label:name,
  //			fillColor: "#DF5200",
  //			fillOpacity: "0.3"
  //			}
  lonLat1 = new SuperMap.LonLat(x, y).transform("EPSG:4326", "EPSG:900913");
  map.panTo(new SuperMap.LonLat(x, y).transform("EPSG:4326", "EPSG:900913"));
  map.setCenter(
    new SuperMap.LonLat(x, y).transform("EPSG:4326", "EPSG:900913"),
    3
  ); //108.07567641634,36.855795258955
  //	city@china@@china  province
  //	county@china@@china
  //	var tucheng="county@china";

  wtvectorLayer.removeAllFeatures();

  var getFeatureParam, getFeatureBySQLService, getFeatureBySQLParams;

  getFeatureParam = new SuperMap.REST.FilterParameter({
    name: "province@china",
    attributeFilter: "NAME in (" + name + ") or SNAME in (" + name + ")"
  });
  getFeatureBySQLParams = new SuperMap.REST.GetFeaturesBySQLParameters({
    queryParameter: getFeatureParam,
    datasetNames: ["china:province"]
  });
  getFeatureBySQLService = new SuperMap.REST.GetFeaturesBySQLService(wturl2, {
    eventListeners: {
      processCompleted: processCompletedwtGL,
      processFailed: processFailedwt
    }
  });

  getFeatureBySQLService.processAsync(getFeatureBySQLParams);
  //	mouseClickHandler(new SuperMap.LonLat(x,y),name,'geli')
  selectGL(new SuperMap.LonLat(x, y));
  layerFullScreen();
}
//
function processCompletedwt(getFeaturesEventArgs) {
  var i,
    len,
    features,
    feature,
    result = getFeaturesEventArgs.result;
  if (result && result.features) {
    features = result.features;
    for (i = 0, len = features.length; i < len; i++) {
      feature = features[i];
      feature.style = stylewt;
      wtvectorLayer.addFeatures(feature);
    }
  }
}
function processCompletedwtGL(getFeaturesEventArgs) {
  var i,
    len,
    features,
    feature,
    result = getFeaturesEventArgs.result;
  if (result && result.features) {
    features = result.features;
    for (i = 0, len = features.length; i < len; i++) {
      feature = features[i];

      feature.style = {
        strokeColor: "#F4F4ED",
        strokeWidth: 2,
        label: feature.data.NAME,
        //			fontColor:'',
        //			  fontWeight:"bold",
        fontSize: "12px",
        fillColor: "#DF5200",
        fillOpacity: "0.4"
      }; //stylewt2;

      wtvectorLayer.addFeatures(feature);
    }
  }
}

//function dodo(){
//
//}

function processFailedwt(e) {
  alert(e.error.errorMsg);
}
function clearFeatureswt() {
  if (wtvectorLayer) {
    //先清除上次的显示结果
    wtvectorLayer.removeAllFeatures();
    wtvectorLayer.refresh();
  }
}
/**综合灾情
 * 地物选取(点击)
 * 当前只查县（区）
 */
//声明一个矢量图层 vectorLayer，在 vectorLayer 上进行要素选择
//vectorLayer = new SuperMap.Layer.Vector("Vector Layer");
//实例化 selectFeature 控件，调用了 onSelect 和 onUnselect 方法
//地物被选中时调用 onSelect 方法，地物被取消选中时调用 onUnselect 方法

function selectDiWU(loat, maparr) {
  wtselectFeatureZQ = new SuperMap.Control.SelectFeature(wtvectorLayer, {
    onSelect: onFeatureSelectZQ,
    onUnselect: onUnFeatureSelectZQ,
    callbacks: {
      //alert(lonLat1);   loat
      click: function() {
        openWin(loat, maparr, "qu");
      }
    },
    hover: true
  });

  //map上添加控件
  map.addControl(wtselectFeatureZQ);
  //激活控件
  wtselectFeatureZQ.activate();
  //		mouseClickHandler();
}
/**
 * 灾害个例
 * 当前只查询省
 */
function selectGL(loat, maparr) {
  wtselectFeatureGL = new SuperMap.Control.SelectFeature(wtvectorLayer, {
    onSelect: onFeatureSelectGL,
    onUnselect: onUnFeatureSelectGL,

    callbacks: {
      click: function() {
        openWin(loat, maparr, "shen");
      }
    },
    hover: true
  });

  //map上添加控件
  map.addControl(wtselectFeatureGL);
  //激活控件
  wtselectFeatureGL.activate();
}
//要素被选中时调用此函数,需要传入当前选中要素参数feature
var arr = new Map();
function onFeatureSelectGL(feature) {
  //TODO
  //	alert(1);
  feature.style = {
    strokeColor: "#CFCFCF",
    strokeWidth: 1,
    label: feature.data.NAME,
    //			fontColor:'',
    //			  fontWeight:"bold",
    fillColor: "yellow",
    fontSize: "12px",
    fillOpacity: "0.5"
  }; //stylewt2;
  wtvectorLayer.removeFeatures();
  wtvectorLayer.addFeatures(feature);
  var ok = arr.get(feature.data.NAME + "x");
  if (ok == "false" || ok == false) {
    $.ajax({
      async: false,
      cache: true,
      type: "POST",
      dataType: "json",
      url: "../getXY.do",
      data: { proname: feature.data.NAME },
      error: function() {},
      success: function(data) {
        $.each(data, function(i, dataObj) {
          arr.put(feature.data.NAME + "x", dataObj.LON);
          arr.put(feature.data.NAME + "y", dataObj.LAT);
        });
      }
    });
  }
  var lonlat = new SuperMap.LonLat(
    arr.get(feature.data.NAME + "x"),
    arr.get(feature.data.NAME + "y")
  );
  mouseClickHandler(lonlat, feature.data.NAME, "geli");
}
//要素被取消选中时调用此函数,需要传入当前要素参数feature
function onUnFeatureSelectGL(feature) {
  feature.style = {
    strokeColor: "#F4F4ED",
    strokeWidth: 1,
    label: feature.data.NAME,
    //			fontColor:'',
    //			  fontWeight:"bold",
    fillColor: "#DF5200",
    fontSize: "12px",
    fillOpacity: "0.4"
  }; //stylewt2;
  wtvectorLayer.removeFeatures();
  wtvectorLayer.addFeatures(feature);
}
function onFeatureSelectZQ(feature) {
  feature.style = {
    strokeColor: "#CFCFCF", //#DF5200
    strokeWidth: 1,
    label: feature.data.NAME,
    //				fontColor:'',
    //				  fontWeight:"bold",
    fillColor: "yellow",
    fontSize: "12px",
    fillOpacity: "0.5"
  }; //stylewt2;
  wtvectorLayer.removeFeatures();
  wtvectorLayer.addFeatures(feature);
}
function onUnFeatureSelectZQ(feature) {
  feature.style = {
    strokeColor: "#F4F4ED",
    strokeWidth: 1,
    label: feature.data.NAME,
    //				fontColor:'',
    fontWeight: "bold",
    fillColor: "#DF5200",
    fontSize: "12px",
    fillOpacity: "0.4"
  }; //stylewt2;
  wtvectorLayer.removeFeatures();
  wtvectorLayer.addFeatures(feature);
}
/**
 * 信息弹窗.events.on({"click":mouseClickHandler
 */
var infowin = null;
//定义mouseClickHandler函数，触发click事件会调用此函数

function mouseClickHandler(loat, namecode, types) {
  //初始化标记图层类
  var maparr = new Map();

  //请求人口经济数据
  $.ajax({
    async: false,
    cache: true,
    type: "POST",
    dataType: "json",
    url: "../getGDPInfo.do",
    data: { pcode: namecode, types: types },
    error: function() {},
    //	    timeout: 1000,
    success: function(data) {
      $.each(data, function(i, dataObj) {
        maparr.put("areaname", dataObj.areaname);
        maparr.put("scmoney03", dataObj.scmoney03);
        maparr.put("scmoney04", dataObj.scmoney04);
        maparr.put("scmoney05", dataObj.scmoney05);
        maparr.put("scmoney06", dataObj.scmoney06);
        maparr.put("scmoney07", dataObj.scmoney07);
        maparr.put("renkou03", dataObj.renkou03);
        maparr.put("renkou04", dataObj.renkou04);
        maparr.put("renkou05", dataObj.renkou05);
        maparr.put("renkou06", dataObj.renkou06);
        maparr.put("renkou07", dataObj.renkou07);
        maparr.put("onecan03", dataObj.onecan03);
        maparr.put("onecan04", dataObj.onecan04);
        maparr.put("onecan05", dataObj.onecan05);
        maparr.put("onecan07", dataObj.onecan07);
        maparr.put("twocan03", dataObj.twocan03);
        maparr.put("twocan04", dataObj.twocan04);
        maparr.put("twocan05", dataObj.twocan05);
        maparr.put("twocan06", dataObj.twocan06);
        maparr.put("twocan07", dataObj.twocan07);
      });
    }
  });
  if (types == "zaiqing") selectDiWU(loat, maparr);
  if (types == "geli") selectGL(loat, maparr);
}

function openWin(loat, maparr, bj) {
  closeInfoWin();
  var lonlat = loat;
  var contentHTML =
    "<div style='width:320px;height:90px; font-size:12px; opacity: 0.8'>";
  contentHTML +=
    "<div style=' font-size:14px; font-weight:bold ;color:#2476E3;border-bottom: 1px solid #E4E4E4;height:25px;line-height: 25px;'>" +
    (maparr.get("areaname") == "false" ||
    maparr.get("areaname") == false ||
    maparr.get("areaname") == undefined
      ? "暂无"
      : maparr.get("areaname")) +
    "</div>";
  contentHTML += "<table style='text-align:center;'>";
  if (bj == "shen" || bj == "shi") {
    contentHTML +=
      "<tr><th></th><th>年生产总值（万元）</th><th>年底人口数（万人）</th></tr>";
    //		contentHTML += "<tr><td style='font-weight:bold ;width:45px;'>2003年</td><td>"+(maparr.get("scmoney03")==undefined||maparr.get("scmoney03")==""?"-":maparr.get("scmoney03"))+"</td><td>"+(maparr.get('renkou03')==undefined||maparr.get('renkou03')==""?"-":maparr.get("renkou03"))+"</td></tr>" ;
    //		contentHTML += "<tr><td style='font-weight:bold ;'>2004年</td><td>"+(maparr.get("scmoney04")==undefined||maparr.get("scmoney04")==""?"-":maparr.get("scmoney04"))+"</td><td>"+(maparr.get("renkou04")==undefined||maparr.get("renkou04")==""?"-":maparr.get("renkou04"))+"</td></tr>" ;
    //		contentHTML += "<tr><td style='font-weight:bold ;'>2005年</td><td>"+(maparr.get("scmoney05")==undefined||maparr.get("scmoney05")==""?"-":maparr.get("scmoney05"))+"</td><td>"+(maparr.get("renkou05")==undefined||maparr.get("renkou05")==""?"-":maparr.get("renkou05"))+"</td></tr>" ;
    contentHTML +=
      "<tr><td style='font-weight:bold ;width:45px;'>2006年</td><td>" +
      (maparr.get("scmoney06") == undefined || maparr.get("scmoney06") == ""
        ? "-"
        : maparr.get("scmoney06")) +
      "</td><td>" +
      (maparr.get("renkou06") == undefined || maparr.get("renkou06") == ""
        ? "-"
        : maparr.get("renkou06")) +
      "</td></tr>";
    //		contentHTML += "<tr><td style='font-weight:bold ;'>2007年</td><td>"+(maparr.get("scmoney07")==undefined||maparr.get("scmoney07")==""?"-":maparr.get("scmoney07"))+"</td><td>"+(maparr.get("renkou07")==undefined||maparr.get("renkou07")==""?"-":maparr.get("renkou07"))+"</td></tr>" ;
  } else if (bj == "qu") {
    contentHTML +=
      "<tr><th></th><th>年底人口数（万人）</th><th>第一产业增加值（万元）</th><th>第二产业增加值（万元）</th></tr>";
    //		contentHTML += "<tr><td style='font-weight:bold ;width:45px;'>2003年</td><td>"+(maparr.get('renkou03')==undefined||maparr.get('renkou03')==""?"-":maparr.get("renkou03"))+"</td><td>"+(maparr.get("onecan03")==undefined||maparr.get("onecan03")==""?"-":maparr.get("onecan03"))+"</td><td>"+(maparr.get("twocan03")==undefined||maparr.get("twocan03")==""?"-":maparr.get("twocan03"))+"</td></tr>" ;
    //		contentHTML += "<tr><td style='font-weight:bold ;'>2004年</td><td>"+(maparr.get("renkou04")==undefined||maparr.get("renkou04")==""?"-":maparr.get("renkou04"))+"</td><td>"+(maparr.get("onecan04")==undefined||maparr.get("onecan04")==""?"-":maparr.get("onecan04"))+"</td><td>"+(maparr.get("twocan04")==undefined||maparr.get("twocan04")==""?"-":maparr.get("twocan04"))+"</td></tr>" ;
    //		contentHTML += "<tr><td style='font-weight:bold ;'>2005年</td><td>"+(maparr.get("renkou05")==undefined||maparr.get("renkou05")==""?"-":maparr.get("renkou05"))+"</td><td>"+(maparr.get("onecan05")==undefined||maparr.get("onecan05")==""?"-":maparr.get("onecan05"))+"</td><td>"+(maparr.get("twocan05")==undefined||maparr.get("twocan05")==""?"-":maparr.get("twocan05"))+"</td></tr>" ;
    contentHTML +=
      "<tr><td style='font-weight:bold ;width:45px;'>2006年</td><td>" +
      (maparr.get("renkou06") == undefined || maparr.get("renkou06") == ""
        ? "-"
        : maparr.get("renkou06")) +
      "</td><td>" +
      (maparr.get("onecan06") == undefined || maparr.get("onecan06") == ""
        ? "-"
        : maparr.get("onecan06")) +
      "</td><td>" +
      (maparr.get("twocan06") == undefined || maparr.get("twocan06") == ""
        ? "-"
        : maparr.get("twocan06")) +
      "</td></tr>";
    //		contentHTML += "<tr><td style='font-weight:bold ;'>2007年</td><td>"+(maparr.get("renkou07")==undefined||maparr.get("renkou07")==""?"-":maparr.get("renkou07"))+"</td><td>"+(maparr.get("onecan07")==undefined||maparr.get("onecan07")==""?"-":maparr.get("onecan07"))+"</td><td>"+(maparr.get("twocan07")==undefined||maparr.get("twocan07")==""?"-":maparr.get("twocan07"))+"</td></tr>" ;
  }

  contentHTML += "</table>";
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

function closeInfoWin() {
  if (infowin) {
    try {
      infowin.hide();
      infowin.destroy();
    } catch (e) {}
  }
}
/*
 * MAP对象，实现MAP功能
 *
 * 接口：
 * size()     获取MAP元素个数
 * isEmpty()    判断MAP是否为空
 * clear()     删除MAP所有元素
 * put(key, value)   向MAP中增加元素（key, value) 
 * remove(key)    删除指定KEY的元素，成功返回True，失败返回False
 * get(key)    获取指定KEY的元素值VALUE，失败返回NULL
 * element(index)   获取指定索引的元素（使用element.key，element.value获取KEY和VALUE），失败返回NULL
 * containsKey(key)  判断MAP中是否含有指定KEY的元素
 * containsValue(value) 判断MAP中是否含有指定VALUE的元素
 * values()    获取MAP中所有VALUE的数组（ARRAY）
 * keys()     获取MAP中所有KEY的数组（ARRAY）
 *
 * 例子：
 * var map = new Map();
 *
 * map.put("key", "value");
 * var val = map.get("key")
 * ……
 *
 */
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
