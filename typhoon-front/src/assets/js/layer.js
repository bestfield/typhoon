/**
 * @note UTFGrid图层
 * @param layerName:图层名称 String
 * @param url:iserver地图服务url String
 * @param cacheEnabled:是否缓存 Boolean
 * @param transparent:图层是否透明 Boolean
 * @param layerIndex:图层顺序 Integer 0为最下层
 * @param extentFlag:图层定位 Boolean true为地图定位到图层区域
 * @param iserverName:关联图层在iserver的名称 String
 * @param utfgridName:utfgrid图层名 String
 * @param id:图层id String
 * @param callback:回调函数 String
 * @param eventType:事件类别 String
 * @author 吴义迪
 * @create_time 2018-08-10
 */
var UTFGridControl = {};
function loadUTFGridLayer(layerName, url, cacheEnabled, transparent, layerIndex, extentFlag, iserverName, utfgridName, id, callback, eventType){
	var layer=Map.map.getLayersByName(layerName);
	if(layer.length>0){
		Map.map.removeLayer(layer[0]);
		UTFGridControl[id].destroy();
		Map.map.removeControl(UTFGridControl[id]);
		UTFGridControl[id] = null;
	}
	layer = new SuperMap.Layer.TiledDynamicRESTLayer(layerName, Path.iserver + url, {
        transparent: transparent,
        cacheEnabled: cacheEnabled
    });
	layer.isBaseLayer = false;
    layer.events.on({"layerInitialized": function(){
		Map.map.addLayer(layer);
		//图层排序
	    Map.map.setLayerIndex(layer, layerIndex);
	    //是否定位
	    if(extentFlag == true){
	    	var left = layer.maxExtent.left;
	        var bottom = layer.maxExtent.bottom;
	        var right = layer.maxExtent.right;
	        var top = layer.maxExtent.top;
	        Map.map.zoomToExtent(new SuperMap.Bounds(left, bottom, right, top));
	    }
	    //加载utfgrid图层
	    var UTFGridLayers = Map.map.getLayersByName(utfgridName);
	    if(UTFGridLayers.length>0){
	    	Map.map.addLayer(UTFGridLayers[0]);
	    }		
		var utfgrid = new SuperMap.Layer.UTFGrid(utfgridName, Path.iserver + url, {
	        layerName: iserverName,
	        utfTileSize: 256,
	        pixcell: 8,
	        isUseCache: true
	    },
	    {
	        utfgridResolution: 8
	    });
		utfgrid.maxExtent = layer.maxExtent;
		Map.map.addLayer(utfgrid);
		//图层排序
		var index = Map.map.getLayerIndex(layer);
	    Map.map.setLayerIndex(utfgrid, index+1);
		UTFGridControl[id] = new SuperMap.Control.UTFGrid({
	        layers: [utfgrid],
	        callback: function(infoLookup, loc, pixel){
	        	closePopup();
	            if (infoLookup) {
	                var info;
	                for (var idx in infoLookup) {
	                    info = infoLookup[idx];
	                    if (info && info.data) {
	                    	closePopup();
	                    	var html = "<p class=\"popup_p\" style=\"font-weight:bold;\">"+Layer[id].popupTitle+"</p>" +
	        	            		   "<hr class=\"popup_hr\"/>" +
	        	            		   "<table class=\"popup_table\">";
	                        for(var i=0; i<Layer[id].featurnInfo.length; i++){
	                        	if(info.data[Layer[id].featurnInfo[i].flag] != null && info.data[Layer[id].featurnInfo[i].flag] != ""){
	                        		var value = info.data[Layer[id].featurnInfo[i].flag];
	                        		html += "<tr class=\"popup_tr\">" +
	        	        				   	"	<td class=\"popup_style1\">"+Layer[id].featurnInfo[i].name+"：</td>" +
	        	        				   	"	<td class=\"popup_style2\">"+value+"</td>" +
	        	        				   	"</tr>";
	                        	}
	                        }
	                        html += "</table>";
	                        //设置x与y的像素偏移量，不影响地图浏览；
//		                        var xOff = (1 / Map.map.getScale()) * 0.001;
//		                        var yOff = -(1 / Map.map.getScale()) * 0.005;
	                        var pos = new SuperMap.LonLat(loc.lon, loc.lat);
	                        var icon = new SuperMap.Icon(null, null, new SuperMap.Pixel(-18, -3));
	                        var popup = new SuperMap.Popup.FramedCloud(
	                    		null,										//弹窗的唯一标识，如设为null，则将会自动生成
	                    		pos, 										//地图上弹窗显示的位置
	                    		null,										//弹窗内容的大小
	                    		html,										//弹窗中显示的一个HTML要素的字符串
	                    		icon,										//锚点，包含一个大小信息 SuperMap.Size和偏移信息 SuperMap.Size的对象。(一般为 SuperMap.Icon类型）
	                    		true,										//在弹出窗口的里面是否显示关闭窗
	                    		null										//关闭弹窗触发该回调函数
	                    	);
	                    	Map.popup = popup;
	                    	Map.map.addPopup(popup);
	                    }
	                }
	            }
	        },
	        handlerMode: eventType
	    });
		Map.map.addControl(UTFGridControl[id]);
	
    }});
}

/**
 * @note rest图层
 * @param layerName:图层名称 String
 * @param url:iserver地图服务url String
 * @param cacheEnabled:是否缓存 Boolean
 * @param transparent:图层是否透明 Boolean
 * @param layerIndex:图层顺序 Integer 0为最下层
 * @param extentFlag:图层定位 Boolean true为地图定位到图层区域
 * @author 吴义迪
 * @create_time 2018-04-17
 */
function loadRestLayer(layerName, url, cacheEnabled, transparent, layerIndex, extentFlag){
	var layer = new SuperMap.Layer.TiledDynamicRESTLayer(layerName, Path.iserver + url, {
        transparent: transparent,
        cacheEnabled: cacheEnabled
    });
    layer.events.on({
    	"layerInitialized": function(){
    		Map.map.addLayer(layer);
    		//图层排序
    	    Map.map.setLayerIndex(layer, layerIndex);
    	    //是否定位
    	    if(extentFlag == true){
    	    	var left = layer.maxExtent.left;
    	        var bottom = layer.maxExtent.bottom;
    	        var right = layer.maxExtent.right;
    	        var top = layer.maxExtent.top;
    	        Map.map.zoomToExtent(new SuperMap.Bounds(left, bottom, right, top));
    	    }
        }
    });
}

/**
 * @note 服务端单值专题图
 * @param layerName:图层名称 String
 * @param url:iserver地图服务url String
 * @param cacheEnabled:是否缓存 Boolean
 * @param transparent:图层是否透明 Boolean
 * @param sources1:数据源名称 String
 * @param sources2:数据集名称 String
 * @param attrFlag:单值标识 String
 * @param displayFilters:过滤条件，与sql语句写法一致 [String]
 * @param value:单值要素值 [Object]
 * @param fillForeColorArr:单值填充颜色 [String]
 * @param fillOpaqueRateArr:单值填充透明度 [Integer]
 * @param lineColorArr:单值边线颜色 [String] String写法为rgb(x,x,x)
 * @param lineWidthArr:单值边线宽度 [Integer]
 * @param defaultfillForeColor:默认填充颜色 String
 * @param defaultFillOpaqueRate:默认填充透明度 String
 * @param defaultLineColor:默认边线颜色 String
 * @param defaultLineWidth:默认边线宽度 String
 * @param layerIndex:图层顺序 Integer 0为最下层
 * @param extentFlag:图层定位 Boolean true为地图定位到图层区域
 * @author 吴义迪
 * @create_time 2018-04-17
 */
function showThemeUnique(layerName, url, cacheEnabled, transparent, sources1, sources2, attrFlag, displayFilters, value,
						 fillForeColorArr, fillOpaqueRateArr, lineColorArr, lineWidthArr, 
						 defaultfillForeColor, defaultFillOpaqueRate, defaultLineColor, defaultLineWidth,
						 layerIndex, extentFlag){
	var themeService = new SuperMap.REST.ThemeService(url, {
        eventListeners: {
            "processCompleted": function(themeEventArgs){
            	if(themeEventArgs.result.resourceInfo.id) {
        			var themeLayer = new SuperMap.Layer.TiledDynamicRESTLayer(layerName, url, {cacheEnabled:cacheEnabled,transparent:transparent,layersID: themeEventArgs.result.resourceInfo.id}, {"maxResolution":"auto"});
        			themeLayer.isBaseLayer = false;
        			themeLayer.events.on({
        				"layerInitialized": function(){
        					Map.map.addLayer(themeLayer);
        					if(extentFlag == true){
        						var left = themeLayer.maxExtent.left;
            					var bottom = themeLayer.maxExtent.bottom;
            					var right = themeLayer.maxExtent.right;
            					var top = themeLayer.maxExtent.top;
            					Map.map.zoomToExtent(new SuperMap.Bounds(left,bottom,right,top));
        					}
        					Map.map.setLayerIndex(themeLayer,layerIndex);
        				},
        			});
        		}
            },
            "processFailed": function(e){
            	console.log(e.error.errorMsg);
            }
        }
    });
    var themeUniqueItemes = [];
	for(var i=0; i<value.length; i++){
		var colorStr = fillForeColorArr[i];
		colorStr = colorStr.substring(4,colorStr.length-1);
		var color1 = Number(colorStr.split(",")[0]);
		var color2 = Number(colorStr.split(",")[1]);
		var color3 = Number(colorStr.split(",")[2]);
		var lineColorStr = lineColorArr[i];
		lineColorStr = lineColorStr.substring(4,lineColorStr.length-1);
		var lineColor1 = Number(lineColorStr.split(",")[0]);
		var lineColor2 = Number(lineColorStr.split(",")[1]);
		var lineColor3 = Number(lineColorStr.split(",")[2]);
		var style = new SuperMap.REST.ServerStyle({
	        fillForeColor: new SuperMap.REST.ServerColor(color1, color2, color3),
	        fillOpaqueRate: fillOpaqueRateArr[i],
	        lineColor: new SuperMap.REST.ServerColor(lineColor1, lineColor2, lineColor3),
	        lineWidth: lineWidthArr[i]
	    });
		var themeUniqueIteme = new SuperMap.REST.ThemeUniqueItem({
            unique: value[i],
            style: style
        });
		themeUniqueItemes.push(themeUniqueIteme);
	}
	defaultfillForeColor = defaultfillForeColor.substring(4,defaultfillForeColor.length-1);
	var defaultColor1 = Number(defaultfillForeColor.split(",")[0]);
	var defaultColor2 = Number(defaultfillForeColor.split(",")[1]);
	var defaultColor3 = Number(defaultfillForeColor.split(",")[2]);
	defaultLineColor = defaultLineColor.substring(4,defaultLineColor.length-1);
	var defaultLineColor1 = Number(defaultLineColor.split(",")[0]);
	var defaultLineColor2 = Number(defaultLineColor.split(",")[1]);
	var defaultLineColor3 = Number(defaultLineColor.split(",")[2]);
	var defaultStyle = new SuperMap.REST.ServerStyle({
        fillForeColor: new SuperMap.REST.ServerColor(defaultColor1, defaultColor2, defaultColor3),
        fillOpaqueRate: defaultFillOpaqueRate,
        lineColor: new SuperMap.REST.ServerColor(defaultLineColor1, defaultLineColor2, defaultLineColor3),
        lineWidth: defaultLineWidth
    });
    var themeUnique = new SuperMap.REST.ThemeUnique({
        uniqueExpression: attrFlag,
        items: themeUniqueItemes,
        defaultStyle: defaultStyle
    });
    var themeParameters = new SuperMap.REST.ThemeParameters({
        datasetNames: [sources2],
        dataSourceNames: [sources1],
        themes: [themeUnique],
        displayFilters: displayFilters,
        types: ['REGION']
    });

    themeService.processAsync(themeParameters);
}

/**
 * @note 服务端标签专题图（默认）
 * @param layerName:图层名称 String
 * @param url:iserver地图服务url String
 * @param cacheEnabled:是否缓存 Boolean
 * @param transparent:图层是否透明 Boolean
 * @param sources1:数据源名称 String
 * @param sources2:数据集名称 String
 * @param attrFlag:单值标识 String
 * @param displayFilters:过滤条件，与sql语句写法一致 [String]
 * @param fontColor:文本字体颜色 String
 * @param fontHeight:文本字体的高度 Integer
 * @param fontWeight:文本字体的磅数 Integer
 * @param fontName:文本字体的名称 String
 * @param outline:是否以轮廓的方式来显示文本的背景 Boolean
 * @param shadow:文本是否有阴影 Boolean
 * @param layerIndex:图层顺序 Integer 0为最下层
 * @param extentFlag:图层定位 Boolean true为地图定位到图层区域
 * @author 吴义迪
 * @create_time 2018-04-17
 */
function showDefaultThemeLabel(layerName, url, cacheEnabled, transparent, sources1, sources2, attrFlag, displayFilters,
							   fontColor, fontHeight, fontWeight, fontName, outline, shadow,
							   layerIndex, extentFlag){
	var themeService = new SuperMap.REST.ThemeService(url, {
        eventListeners: {
            "processCompleted": function(themeEventArgs){
            	if(themeEventArgs.result.resourceInfo.id) {
        			var themeLayer = new SuperMap.Layer.TiledDynamicRESTLayer(layerName, url, {cacheEnabled:cacheEnabled,transparent:transparent,layersID: themeEventArgs.result.resourceInfo.id}, {"maxResolution":"auto"});
        			themeLayer.isBaseLayer = false;
        			themeLayer.events.on({
        				"layerInitialized": function(){
        					Map.map.addLayer(themeLayer);
        					if(extentFlag == true){
        						var left = themeLayer.maxExtent.left;
            					var bottom = themeLayer.maxExtent.bottom;
            					var right = themeLayer.maxExtent.right;
            					var top = themeLayer.maxExtent.top;
            					Map.map.zoomToExtent(new SuperMap.Bounds(left,bottom,right,top));
        					}
        					Map.map.setLayerIndex(themeLayer,layerIndex);
        				},
        			});
        		}
            },
            "processFailed": function(e){
            	console.log(e.error.errorMsg);
            }
        }
    });
	fontColor = fontColor.substring(4,fontColor.length-1);
	var color1 = Number(fontColor.split(",")[0]);
	var color2 = Number(fontColor.split(",")[1]);
	var color3 = Number(fontColor.split(",")[2]);
    var themeLabel = new SuperMap.REST.ThemeLabel({
    	labelExpression: attrFlag,
    	text: new SuperMap.REST.ThemeLabelText({
    		uniformStyle: new SuperMap.REST.ServerTextStyle({
    			foreColor: new SuperMap.REST.ServerColor(color1, color2, color3),
    			fontHeight: fontHeight,
    			fontWeight: fontWeight,
    			fontName: fontName,
    			outline: outline,
    			shadow: shadow
    		})
    	})
    });
    var themeParameters = new SuperMap.REST.ThemeParameters({
        datasetNames: [sources2],
        dataSourceNames: [sources1],
        themes: [themeLabel],
        displayFilters: displayFilters,
        types: ['POINT']
    });

    themeService.processAsync(themeParameters);
}

/**
 * @note 数据集查询 by sql
 * @param url:iserver数据集地址 String
 * @param sources1:数据源名称 String
 * @param sources2:数据集名称 String
 * @param attributeFilter:过滤条件，与sql语句写法一致 String
 * @param callback:回调函数 String
 * @author 吴义迪
 * @create_time 2018-04-17
 */
function getFeaturesBySQL(url, sources1, sources2, attributeFilter, callback){
	var getFeatureParam, getFeatureBySQLService, getFeatureBySQLParams;
	getFeatureParam = new SuperMap.REST.FilterParameter({
		name: sources2 + "@" + sources1,
		attributeFilter: attributeFilter
	});
	getFeatureBySQLParams = new SuperMap.REST.GetFeaturesBySQLParameters({
		queryParameter: getFeatureParam,
		datasetNames:[sources1 + ":" + sources2]
	});
	getFeatureBySQLService = new SuperMap.REST.GetFeaturesBySQLService(url, {eventListeners: {
		"processCompleted": eval(callback), 
		"processFailed": function(e){
			console.log(e.error.errorMsg);
    	}
	}});
	getFeatureBySQLService.processAsync(getFeatureBySQLParams);
}

/**
 * @note 地图查询 by sql
 * @param layerName:图层名称 String
 * @param url:iserver地图地址 String
 * @param sources1:数据源名称 String
 * @param sources2:数据集名称 String
 * @param attributeFilter:过滤条件，与sql语句写法一致 String
 * @param queryOption:查询结果类型枚举类 String 枚举值：ATTRIBUTE ATTRIBUTEANDGEOMETRY GEOMETRY
 * @param fields:查询字段数组，如果不设置则使用系统返回的所有字段 [String]
 * @param callback:回调函数 String
 * @author 吴义迪
 * @create_time 2018-04-17
 */
function queryBySQL(layerName, url, attributeFilter, queryOption, fields, callback){
	var queryParam, queryBySQLParams, queryBySQLService;
    queryParam = new SuperMap.REST.FilterParameter({
        name: layerName,
        fields: fields,
        attributeFilter: attributeFilter
    });
    queryBySQLParams = new SuperMap.REST.QueryBySQLParameters({
        queryParams: [queryParam],
        queryOption: queryOption
    });
    queryBySQLService = new SuperMap.REST.QueryBySQLService(url, {eventListeners: {
    	"processCompleted": eval(callback),
    	"processFailed": function(e){
        	console.log(e.error.errorMsg);
        }
    }});
    queryBySQLService.processAsync(queryBySQLParams);
}




export {loadUTFGridLayer} 
