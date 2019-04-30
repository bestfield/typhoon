/**
 * 隐患点
 * @param data
 */
function ZXHL_YHD_Markers(data) {
  //	clearFeaturescy();
  //	if(markers){
  //		markers.clearMarkers();
  //	}
  GoclearMarkers();
  //创建标记图层
  markers = new SuperMap.Layer.Markers("Markers", {});
  //循环遍历所有的隐患点数据
  $.each(data, function(i, dataObj) {
    //		obj.put("V_P_NAME", val.get("V_P_NAME"));//省
    //		obj.put("V_P_CODE", val.get("V_P_CODE"));//
    //		obj.put("V_C_NAME", val.get("V_C_NAME"));//市
    //		obj.put("V_C_CODE", val.get("V_C_CODE"));
    //		obj.put("V_M_NAME", val.get("V_M_NAME"));//流域名称
    //		obj.put("V_M_CODE", val.get("V_M_CODE"));//流域编码
    //		obj.put("V_CT_NAME", val.get("V_CT_NAME"));//县
    //		obj.put("V_CT_CODE", val.get("V_CT_CODE"));//
    //		obj.put("V_T_NAME", val.get("V_T_NAME"));//乡
    //		obj.put("V_T_CODE", val.get("V_T_CODE"));//
    //		obj.put("V_HIDDEN_NAME", val.get("V_HIDDEN_NAME")==null?"":val.get("V_HIDDEN_NAME"));//隐患点名称
    //		obj.put("V_HIDD_LON", val.get("V_HIDD_LON")==null?"":val.get("V_HIDD_LON"));//经度
    //		obj.put("V_HIDD_LAT", val.get("V_HIDD_LAT")==null?"":val.get("V_HIDD_LAT"));//纬度
    //		obj.put("V_HIDD_HEIGHT", val.get("V_HIDD_HEIGHT")==null?"":val.get("V_HIDD_HEIGHT"));//海拔高度
    //		obj.put("V_HIDD_POP", val.get("V_HIDD_POP")==null?"":val.get("V_HIDD_POP"));//人数
    //		obj.put("V_HIDD_ETYPE", val.get("V_HIDD_ETYPE")==null?"":val.get("V_HIDD_ETYPE"));//隐患点类型
    //		obj.put("V_HIDD_EA", val.get("V_HIDD_EA")==null?"":val.get("V_HIDD_EA"));//固定资产
    //		obj.put("V_HIDD_DGN", val.get("V_HIDD_DGN")==null?"":val.get("V_HIDD_DGN"));//危险品名称
    //		obj.put("V_RZ_PLANTTYPE", val.get("V_RZ_PLANTTYPE")==null?"":val.get("V_RZ_PLANTTYPE"));//主要作物类型
    //		obj.put("V_ARG_AREA", val.get("V_ARG_AREA")==null?"":val.get("V_ARG_AREA"));//耕种面积
    //		obj.put("V_HIDD_MEA", val.get("V_HIDD_MEA")==null?"":val.get("V_HIDD_MEA"));//防灾减灾措施

    var V_HIDDEN_NAME = dataObj.V_HIDDEN_NAME; //隐患点名称
    var V_HIDD_LON = dataObj.V_HIDD_LON; //经度
    var V_HIDD_LAT = dataObj.V_HIDD_LAT; //纬度
    var V_HIDD_HEIGHT = dataObj.V_HIDD_HEIGHT; //海拔高度
    var V_HIDD_POP = dataObj.V_HIDD_POP; //人数

    var V_HIDD_ETYPE = dataObj.V_HIDD_ETYPE; //隐患点类型
    var V_HIDD_EA = dataObj.V_HIDD_EA; //固定资产
    var V_HIDD_DGN = dataObj.V_HIDD_DGN; //危险品名称
    var V_RZ_PLANTTYPE = dataObj.V_RZ_PLANTTYPE; //主要作物类型
    var V_ARG_AREA = dataObj.V_ARG_AREA; //耕种面积
    var V_HIDD_MEA = dataObj.V_HIDD_MEA; //防灾减灾措施

    var HIDD_LON = dataObj.V_HIDD_LON; //经度
    var HIDD_LAT = dataObj.V_HIDD_LAT; //纬度
    var V_M_NAME = dataObj.V_M_NAME; //流域名称
    var V_M_CODE = dataObj.V_M_CODE; //流域编码

    var LON = V_HIDD_LON.replace("°", ".")
      .replace("′", "")
      .replace("″", "");
    var LAT = V_HIDD_LAT.replace("°", ".")
      .replace("′", "")
      .replace("″", "");

    //标记图层上添加标记
    var size = new SuperMap.Size(20, 20);
    var offset = new SuperMap.Pixel(-(size.w / 2), -size.h);
    //		alert(V_HIDD_ETYPE);
    //		var icon = "";
    var picurl = "../images/yhd/nodata.png";
    if (V_HIDD_ETYPE == "" || V_HIDD_ETYPE == "无") {
      //			icon = new SuperMap.Icon('../images/zhtb/0.png',size,offset);
      picurl = "../images/yhd/nodata.png";
    }
    if (V_HIDD_ETYPE.indexOf("村庄") != -1) {
      picurl = "../images/yhd/cz.png";
    }
    if (V_HIDD_ETYPE.indexOf("公路") != -1) {
      picurl = "../images/yhd/gl.png";
    } /*if(V_HIDD_ETYPE.indexOf("企业")!=-1){
			 picurl="../images/yhd/qy.png";
		}*/
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
    } /*else{
			 picurl="../images/zhtb/0.png";
//			alert(V_HIDD_ETYPE);
		}*/
    var icon = new SuperMap.Icon(picurl, size, offset);

    var marker = new SuperMap.Marker(
      new SuperMap.LonLat(LON, LAT).transform("EPSG:4326", "EPSG:900913"),
      icon
    );
    marker.events.on({
      click: OpenYHDView
      //		   "scope": marker
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
    marker.V_M_NAME = V_M_NAME; //流域名称
    marker.V_M_CODE = V_M_CODE; //流域编码

    if (i == 0) {
      //			map.panTo(new SuperMap.LonLat(V06001_T,V05001_T));
      map.setCenter(
        new SuperMap.LonLat(LON, LAT).transform("EPSG:4326", "EPSG:900913"),
        6
      );
    }
    markers.addMarker(marker);
  });

  map.addLayer(markers);
  layerFullScreen();
}

function OpenYHDView() {
  clearPopup();
  var marker = this;
  var V_HIDDEN_NAME = marker.V_HIDDEN_NAME;
  var V_HIDD_LON = marker.V_HIDD_LON;
  var V_HIDD_LAT = marker.V_HIDD_LAT;
  var V_HIDD_HEIGHT = marker.V_HIDD_HEIGHT;
  var V_HIDD_POP = marker.V_HIDD_POP;
  var V_HIDD_ETYPE = marker.V_HIDD_ETYPE;
  var V_HIDD_EA = marker.V_HIDD_EA;
  var V_HIDD_DGN = marker.V_HIDD_DGN;
  var V_RZ_PLANTTYPE = marker.V_RZ_PLANTTYPE;
  var V_ARG_AREA = marker.V_ARG_AREA;
  var V_HIDD_MEA = marker.V_HIDD_MEA;

  var V_M_NAME = marker.V_M_NAME; //流域名称
  var V_M_CODE = marker.V_M_CODE; //流域编码

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
    "<th style='width:90px;'>流域名称：</th>" +
    "<td>" +
    V_M_NAME +
    "</td>" +
    "<th style='width:100px;'>流域编码：</th>" +
    "<td>" +
    V_M_CODE +
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
    "<th>危险品名称：</th>" +
    "<td>" +
    V_HIDD_DGN +
    "</td>" +
    "<th>主要作物类型：</th>" +
    "<td>" +
    V_RZ_PLANTTYPE +
    "</th>" +
    "</tr>" +
    "<tr>" +
    "<th>耕种面积：</th>" +
    "<td>" +
    V_ARG_AREA +
    "</td>" +
    "<th>防灾减灾措施：</th>" +
    "<td>" +
    V_HIDD_MEA +
    "</th>" +
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

/*function YHD_dingwei(v1,v2,v3,v4,v5,v6,v7,v8,v9,v10,v11){
	//创建标记图层
	var dw_markers = new SuperMap.Layer.Markers("定位点",{});
	
	var V_HIDDEN_NAME = v1;//隐患点名称
	var V_HIDD_LON = v2;//经度
	var V_HIDD_LAT = v3;//纬度
	var V_HIDD_HEIGHT = v4;//海拔高度
	var V_HIDD_POP = v5;//人数
	
	var V_HIDD_ETYPE = v6;//隐患点类型
	var V_HIDD_EA = v7;//固定资产
	var V_HIDD_DGN = v8;//危险品名称
	var V_RZ_PLANTTYPE = v9;//主要作物类型
	var V_ARG_AREA = v10;//耕种面积
	
	var V_HIDD_MEA = v11;//防灾减灾措施
	
	var HIDD_LON = v2;//经度
	var HIDD_LAT = v3;//纬度
	
	
	console.log(v2+"--"+v3);
	
	var LON = V_HIDD_LON.replace("°",".").replace("′","").replace("″","");
	var LAT = V_HIDD_LAT.replace("°",".").replace("′","").replace("″","");
	
	//标记图层上添加标记
	var size = new SuperMap.Size(21,25);
	var offset = new SuperMap.Pixel(-(size.w/2), -size.h);
	var icon = new SuperMap.Icon('../image/p1.png',size,offset);
	
	var marker =new SuperMap.Marker(new SuperMap.LonLat(LON,LAT).transform("EPSG:4326","EPSG:900913"),icon) ;
	 marker.events.on({
	   "click":OpenYHDView,
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
	map.setCenter(new SuperMap.LonLat(LON,LAT).transform("EPSG:4326","EPSG:900913"), 9);
	
	
}*/
