//构建 feature 数据, 专题图的数据必须是 SuperMap.Feature.Vector
function addFwfdThemeLayer(bSpace, data, max, ys, v, t, conditions, date_ind) {
  // 定义 Unique 单值专题图层
  fwfdThemeLayer = new SuperMap.Layer.Unique("分段专题图");
  fwfdThemeLayer.setOpacity(1);

  // 图层基础样式
  fwfdThemeLayer.style = {
    shadowBlur: 3,
    shadowColor: "#000000",
    shadowOffsetX: 1,
    shadowOffsetY: 1,
    fillColor: "#E7E3E7"
  };

  // 开启 hover 高亮效果
  fwfdThemeLayer.isHoverAble = true;

  // hover 高亮样式
  fwfdThemeLayer.highlightStyle = {
    stroke: true,
    strokeWidth: 2,
    strokeColor: "blue",
    fillColor: "#00F5FF",
    fillOpacity: 0.2
  };

  // 用于单值专题图的属性字段名称
  fwfdThemeLayer.themeField = v;
  // 风格数组，设定值对应的样式
  if (t == "no") {
    fwfdThemeLayer.styleGroups = styleGroup(data, max, ys, bSpace); //当查询条件不包含日期时执行
  } else {
    fwfdThemeLayer.styleGroups = styleGroup2(data, max, ys, date_ind); //当查询条件包含日期时执行
  }
  //专题图层 mousemove 事件
  /*fwfdThemeLayer.on("mousemove", evn);*/

  map.addLayer(fwfdThemeLayer);
  var queryParam, queryBySQLParams, queryBySQLService;

  //var conditions ="";
  var fwurl = path + "/iserver/services/map-china/rest/maps/china";
  var tc = "province@china";
  if (bSpace == "4") {
    //省
    tc = "province@china";
  } else if (bSpace == "6") {
    //市
    tc = "city@china";
  } else if (bSpace == "5") {
    //县
    tc = "county_tj@china";
  }
  queryParam = new SuperMap.REST.FilterParameter({
    name: tc, //"Countries@World.1",
    attributeFilter: conditions //"name  like '%144芯%'"//"Pop_1994>1000000000 and SmArea>900"
  });
  queryBySQLParams = new SuperMap.REST.QueryBySQLParameters({
    queryParams: [queryParam]
  });
  queryBySQLService = new SuperMap.REST.QueryBySQLService(fwurl, {
    eventListeners: {
      processCompleted: processCompletedFwfd,
      processFailed: processFailedFwfd
    }
  });
  queryBySQLService.processAsync(queryBySQLParams);
  var html = "";
  var tlsm = "";
  var dw = "";
  if (ys.indexOf("1") != -1) {
    tlsm = "个数";
    dw = "个";
  } else if (ys.indexOf("2") != -1) {
    tlsm = "直接经济损失";
    dw = "万元";
  } else if (ys.indexOf("3") != -1) {
    tlsm = "受灾人口";
    dw = "人";
  } else if (ys.indexOf("4") != -1) {
    tlsm = "死亡人口";
    dw = "人";
  } else if (ys.indexOf("9") != -1) {
    tlsm = "失踪人口";
    dw = "人";
  } else if (ys.indexOf("a") != -1) {
    tlsm = "饮水困难人口";
    dw = "人";
  } else if (ys.indexOf("5") != -1) {
    tlsm = "受灾面积";
    dw = "公顷";
  } else if (ys.indexOf("6") != -1) {
    tlsm = "绝收面积";
    dw = "公顷";
  } else if (ys.indexOf("7") != -1) {
    tlsm = "倒塌房屋";
    dw = "间";
  } else if (ys.indexOf("8") != -1) {
    tlsm = "损坏房屋";
    dw = "间";
  } else if (ys.indexOf("b") != -1) {
    tlsm = "地区生产总值";
    dw = "万元";
  } else if (ys.indexOf("c") != -1) {
    tlsm = "流域面积";
    dw = "平方千米";
  } else if (ys.indexOf("d") != -1) {
    tlsm = "河流长度";
    dw = "千米";
  } else if (ys.indexOf("e") != -1) {
    tlsm = "河流面积";
    dw = "平方千米";
  } else if (ys.indexOf("f") != -1) {
    tlsm = "人数";
    dw = "人";
  } else if (ys.indexOf("g") != -1) {
    tlsm = "固定资产";
    dw = "万元";
  } else if (ys.indexOf("h") != -1) {
    tlsm = "耕种面积 ";
    dw = "平方千米";
  }
  if (max == "-" || max == null || max == "") {
    html +=
      "<div id='breakClass_legend'><table style='border-left:1px solid #a4a2a2'><tr><td style='text-align: center;margin-left:-10px;height:24px;font-size:12px;'>&nbsp;" +
      tlsm +
      "(" +
      dw +
      ")&nbsp;&nbsp;</td></tr>" +
      "<tr><td style='height:20px;'>&nbsp;<span style='width:30px;height:12px;background-color:#E7E3E7;'>&nbsp;&nbsp;&nbsp;</span>&nbsp;无&nbsp;&nbsp;</td></tr></table>" +
      "</div>";
  } else {
    html +=
      "<div id='breakClass_legend'><table style='border-left:1px solid #a4a2a2'><tr><td style='text-align: center;height:24px;font-size:12px;margin-left:-10px;'>&nbsp;" +
      tlsm +
      "(" +
      dw +
      ")&nbsp;&nbsp;</td></tr>" +
      "<tr><td style='height:20px;'>&nbsp;<span style='width:30px;height:12px;background-color:#FEC2AC;'>&nbsp;&nbsp;&nbsp;</span>&nbsp;<" +
      Math.round(max / 4) +
      "&nbsp;&nbsp;</td></tr>" +
      "<tr><td style='height:20px;'>&nbsp;<span style='width:30px;height:12px;background-color:#FEA896;'>&nbsp;&nbsp;&nbsp;</span>&nbsp;" +
      Math.round(max / 4) +
      "-" +
      Math.round((max / 4) * 2) +
      "&nbsp;&nbsp;</td></tr>" +
      "<tr><td style='height:20px;'>&nbsp;<span style='width:30px;height:12px;background-color:#FE9A8B;'>&nbsp;&nbsp;&nbsp;</span>&nbsp;" +
      Math.round((max / 4) * 2) +
      "-" +
      Math.round((max / 4) * 3) +
      "&nbsp;&nbsp;</td></tr>" +
      "<tr><td style='height:20px;'>&nbsp;<span style='width:30px;height:12px;background-color:#A10B0B;'>&nbsp;&nbsp;&nbsp;</span>&nbsp;>" +
      Math.round((max / 4) * 3) +
      "&nbsp;&nbsp;</td></tr>" +
      "<tr><td style='height:20px;'>&nbsp;<span style='width:30px;height:12px;background-color:#E7E3E7;'>&nbsp;&nbsp;&nbsp;</span>&nbsp;无&nbsp;&nbsp;</td></tr></table>" +
      "</div>";
  }

  $("body", parent.document)
    .find("#map_li_")
    .html(html);
  $("body", parent.document)
    .find("#map_li_")
    .show();
  $("body", parent.document)
    .find("#loading_id")
    .hide();
  $("body", parent.document)
    .find("#loading_mask_id")
    .hide();
}

function processCompletedFwfd(queryEventArgs) {
  var i, j, feature;
  result = queryEventArgs.result;
  if (result && result.recordsets) {
    for (i = 0; i < result.recordsets.length; i++) {
      if (result.recordsets[i].features) {
        for (j = 0; j < result.recordsets[i].features.length; j++) {
          feature = result.recordsets[i].features[j];
          fwfdThemeLayer.addFeatures(feature);
        }
      }
    }
  }
}
function processFailedFwfd(e) {
  alert(e.error.errorMsg);
}

function styleGroup(data, fwfdMax, ys, bSpace) {
  var styGrops = [];
  $.each(data, function(i, dataObj) {
    var fdNum = 0;
    if (ys.indexOf("1") != -1) {
      fdNum = dataObj.jishu;
    } else if (ys.indexOf("2") != -1) {
      fdNum = dataObj.zjjjSs;
    } else if (ys.indexOf("3") != -1) {
      fdNum = dataObj.szaiRk;
    } else if (ys.indexOf("4") != -1) {
      fdNum = dataObj.swangRk;
    } else if (ys.indexOf("9") != -1) {
      fdNum = dataObj.szongRk;
    } else if (ys.indexOf("a") != -1) {
      fdNum = dataObj.ysknRk;
    } else if (ys.indexOf("5") != -1) {
      fdNum = dataObj.szaiMj;
    } else if (ys.indexOf("6") != -1) {
      fdNum = dataObj.jshouMj;
    } else if (ys.indexOf("7") != -1) {
      fdNum = dataObj.dsunFw;
    } else if (ys.indexOf("8") != -1) {
      fdNum = dataObj.shuaiFw;
    } else if (ys.indexOf("b") != -1) {
      fdNum = dataObj.gdp;
    } else if (ys.indexOf("c") != -1) {
      fdNum = dataObj.larea;
    } else if (ys.indexOf("d") != -1) {
      fdNum = dataObj.llcd;
    } else if (ys.indexOf("e") != -1) {
      fdNum = dataObj.lyrk;
    } else if (ys.indexOf("f") != -1) {
      fdNum = dataObj.renshu;
    } else if (ys.indexOf("g") != -1) {
      fdNum = dataObj.gdzc;
    } else if (ys.indexOf("h") != -1) {
      fdNum = dataObj.gzmj;
    }

    var valTj = "dataObj.kongjian";
    if (bSpace != "4") {
      valTj = "dataObj.code";
    }
    //	            	alert(eval(valTj));
    if (fdNum == 0) {
      var styGro0 = {
        value: eval(valTj),
        style: {
          fillColor: "#E7E3E7"
        }
      };
      styGrops.push(styGro0);
    } else if (fdNum > 0 && fdNum < fwfdMax / 4) {
      var styGro1 = {
        value: eval(valTj),
        style: {
          fillColor: "#FEC2AC"
        }
      };
      styGrops.push(styGro1);
    } else if (fdNum < (fwfdMax / 4) * 2) {
      var styGro2 = {
        value: eval(valTj),
        style: {
          fillColor: "#FEA896"
        }
      };
      styGrops.push(styGro2);
    } else if (fdNum < (fwfdMax / 4) * 3) {
      var styGro3 = {
        value: eval(valTj),
        style: {
          fillColor: "#FE9A8B"
        }
      };
      styGrops.push(styGro3);
    } else {
      var tjspace = "";
      if (eval(valTj).indexOf("北京") != -1) {
        tjspace = "北京";
      } else {
        tjspace = eval(valTj);
      }
      var styGro4 = {
        value: tjspace,
        style: {
          fillColor: "#A10B0B"
        }
      };
      styGrops.push(styGro4);
    }
  });
  styGrops.push({ value: "香港", style: { fillColor: "#E7E3E7" } });
  styGrops.push({ value: "台湾", style: { fillColor: "#E7E3E7" } });
  return styGrops;
}

/**
 *
 * @param data
 * @param fwfdMax
 * @param ys
 * @param date_ind 时间index
 * @returns {Array}
 */
function styleGroup2(data, fwfdMax, ys, date_ind) {
  var styGrops = [];
  //是否有台湾
  var taiwan_flag = false;
  //是否有香港
  var xianggang_flag = false;
  $.each(data, function(i, dataObj) {
    if (dataObj[0] == "台湾") {
      taiwan_flag = true;
    }
    if (dataObj[0] == "香港") {
      xianggang_flag = true;
    }
    var fdNum;
    if (date_ind != null) {
      fdNum = dataObj[3 + date_ind];
    } else {
      fdNum = dataObj[dataObj.length - 1];
    }

    if (fdNum == 0) {
      var styGro0 = {
        value: dataObj[0],
        style: {
          fillColor: "#E7E3E7"
        }
      };
      styGrops.push(styGro0);
    } else if (fdNum > 0 && fdNum < fwfdMax / 4) {
      var styGro1 = {
        value: dataObj[0],
        style: {
          fillColor: "#FEC2AC"
        }
      };
      styGrops.push(styGro1);
    } else if (fdNum < (fwfdMax / 4) * 2) {
      var styGro2 = {
        value: dataObj[0],
        style: {
          fillColor: "#FEA896"
        }
      };
      styGrops.push(styGro2);
    } else if (fdNum < (fwfdMax / 4) * 3) {
      var styGro3 = {
        value: dataObj[0],
        style: {
          fillColor: "#FE9A8B"
        }
      };
      styGrops.push(styGro3);
    } else {
      var styGro4 = {
        value: dataObj[0],
        style: {
          fillColor: "#A10B0B"
        }
      };
      styGrops.push(styGro4);
    }
  });
  if (!xianggang_flag) {
    styGrops.push({ value: "香港", style: { fillColor: "#E7E3E7" } });
  }

  if (!taiwan_flag) {
    styGrops.push({ value: "台湾", style: { fillColor: "#E7E3E7" } });
  }

  return styGrops;
}

//  -------------------------------------------------------------------------------------------------------------------------
//构建 feature 数据, 专题图的数据必须是 SuperMap.Feature.Vector
function addBackLayer(data, field, bSpace, dateSta) {
  // 定义 Unique 单值专题图层
  backLayer = new SuperMap.Layer.Unique("背景图");
  backLayer.setOpacity(1);
  // 图层基础样式
  backLayer.style = {
    shadowBlur: 3,
    shadowColor: "#000000",
    shadowOffsetX: 1,
    shadowOffsetY: 1,
    fillColor: "#F4F4ED"
  };
  // 用于单值专题图的属性字段名称
  backLayer.themeField = field;
  // 风格数组，设定值对应的样式
  if (dateSta == "no") {
    backLayer.styleGroups = styleGroupBack(data, bSpace); //当查询条件不包含日期时执行
  } else {
    backLayer.styleGroups = styleGroupBack2(data); //当查询条件包含日期时执行
  }
  map.addLayer(backLayer);
  var queryParam, queryBySQLParams, queryBySQLService;

  //var conditions ="";
  var url = path + "/iserver/services/map-china/rest/maps/china";
  var tc = "province@china";
  if (bSpace == "4") {
    //省
    tc = "province@china";
  } else if (bSpace == "6") {
    //市
    tc = "city@china";
  } else if (bSpace == "5") {
    //县
    tc = "county_tj@china";
  }
  queryParam = new SuperMap.REST.FilterParameter({
    name: tc, //"Countries@World.1",
    attributeFilter: "" //"name  like '%144芯%'"//"Pop_1994>1000000000 and SmArea>900"
  });
  queryBySQLParams = new SuperMap.REST.QueryBySQLParameters({
    queryParams: [queryParam]
  });
  queryBySQLService = new SuperMap.REST.QueryBySQLService(url, {
    eventListeners: {
      processCompleted: processCompletedBack,
      processFailed: processFailedBack
    }
  });
  queryBySQLService.processAsync(queryBySQLParams);
  $("body", parent.document)
    .find("#loading_id")
    .hide();
  $("body", parent.document)
    .find("#loading_mask_id")
    .hide();
}

function processCompletedBack(queryEventArgs) {
  var i, j, feature;
  result = queryEventArgs.result;
  if (result && result.recordsets) {
    for (i = 0; i < result.recordsets.length; i++) {
      if (result.recordsets[i].features) {
        for (j = 0; j < result.recordsets[i].features.length; j++) {
          feature = result.recordsets[i].features[j];
          backLayer.addFeatures(feature);
        }
      }
    }
  }
}
function processFailedBack(e) {
  alert(e.error.errorMsg);
}

function styleGroupBack(data, bSpace) {
  var styGrops = [];
  $.each(data, function(i, dataObj) {
    var valTj = dataObj.kongjian;
    if (bSpace != "4" && bSpace != 4) {
      valTj = dataObj.code;
    }
    var styGro = {
      value: valTj,
      style: {
        fillColor: "#FEC2AC"
      }
    };
    styGrops.push(styGro);
  });
  return styGrops;
}

function styleGroupBack2(data) {
  var styGrops = [];
  $.each(data, function(i, dataObj) {
    var styGro = {
      value: dataObj[0],
      style: {
        fillColor: "#FEC2AC"
      }
    };
    styGrops.push(styGro);
  });
  return styGrops;
}

/*        //获得图例宽度
        function getLegendWidth(){
        	return $("#map_li_").offset().left+$("#map_li_").width();
        }*/
