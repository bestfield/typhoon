<template>
  <transition
    name="fadeAni"
  >
  <!-- 左侧图层控制面板 -->
  <div v-show="show" id="overlay">
    <div class="overlayControl" >
      <div class="overlayTitle">
        <span>图层</span>
      </div>
      <div class="overlayItem" v-for="(item,index) in dataElements" :key="item.id">
        <div class="overTitle">
          <span>
            {{item.Element}}
            <Icon class="colorGray" type="ios-arrow-forward"/>
          </span>
        </div>
        <div class="overlayUL">
          <li class="overlayLi" v-for="(item2,index) in item.subElement" :key="item2.id">
            <span @click="item2.isSelect = !item2.isSelect,getContent(item.Element,item2.subName)" :class="[item2.isSelect == true ? 'selectOver' : 'overlayText']">{{item2.subName}}</span>
            <i v-if="index != (item.subElement.length-1) && (index+1)%3 != 0" class="overlayLine"></i>
          </li>
        </div>
      </div>
    </div>
    <!-- 图层显示时间控制 -->
    <div class="timeSlider">
      <div class="sliderleft"  @click="timeValue -= 24">
        <span class="timeText">0h</span>
        <Icon class="timeMinus" type="md-arrow-dropleft" size="24"/>
      </div>
      <div class="rangeSlider">
        <Slider class="slider" v-model="timeValue" :max="240" show-stops :tip-format="showTime" :step="24"></Slider>
      </div>
      <div class="sliderRight" @click="timeValue += 24">
        <Icon class="timePlus" type="md-arrow-dropright" size="24"/>
        <span class="timeText">240h</span>
      </div>
    </div>
  </div>
  </transition>
</template>

<script>
import Bus from './bus.js'
import $ from "jquery"
// import { loadUTFGridLayer } from '../../../src/assets/js/layer'
export default {
  props: {
    map: {
      type: Object,
      required: true
    },
    show: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      wireMarkerLayer:  new SuperMap.Layer.Markers("wireMarkerLayer"),
      UTFGridControl: {},
      weatherLayer: new SuperMap.Layer.Vector("weatherLayer"),  //气象图层
      nephanalysisLayer:new SuperMap.Layer.Vector("nephanalysisLayer"),  //卫星图层
      wireLineLayer: new SuperMap.Layer.Vector("wireLineLayer"),//输电线路图层
      weatherData: [],  //气象图层json数据
      nephanalysisData:[],
      isWeatherSelect:false,
      isNephaSelect:false,
      isWireSelect:false,
      showWeatherLayer: false,  //是否显示气象图层
      shownephanalysisLayer: false, 
      getWeather: true,
      timeValue: 0,
      weatherElement:"", //气候要素
      nephanalysis:"",//卫星云图
      wire_paths:[],//输电线路
      dataElements: [  //图层、图例数据
        {  //气象要素图例
            "Element": "气象要素",
            "subElement": [
                {
                    "subName": "海面温度",
                    "isSelect": false,
                },
                {
                    "subName": "降水",
                    "isSelect": false,
                },
                {
                    "subName": "风",
                    "isSelect": false,
                }
            ],
            
        },
        {  //卫星云图
            "Element": "卫星云图",
            "subElement": [
                {
                    "subName": "FY4A真彩色",
                    "isSelect": false,
                },
                {
                    "subName": "FY4A红外",
                    "isSelect": false,
                },
                {
                    "subName": "FY4A可见光",
                    "isSelect": false,
                },
                {
                    "subName": "FY4A水汽",
                    "isSelect": false,
                },
                {
                    "subName": "FY2E彩色云图",
                    "isSelect": false,
                },
                {
                    "subName": "FY2E可见光",
                    "isSelect": false,
                },
                {
                    "subName": "FY2G可见光",
                    "isSelect": false,
                },
                {
                    "subName": "FY2G增强图",
                    "isSelect": false,
                }
            ],
            
        },
        {  //输电线路
            "Element": "输电线路",
            "subElement":[
                {
                    "subName": "±1000KV",
                    "isSelect": false,
                },
                {
                    "subName": "±500KV",
                    "isSelect": false,
                },
                {
                    "subName": "±380KV",
                    "isSelect": false,
                },
                {
                    "subName": "±220KV",
                    "isSelect": false,
                },
                {
                    "subName": "±200KV",
                    "isSelect": false,
                },
                {
                    "subName": "±110KV",
                    "isSelect": false,
                },
            ],
        }
      ]
    }
  },
  methods: {
    //时间显示提示样式
    showTime(val) {
      return val + 'h'
    },

    //li图层面板要素选择
    getContent(dataParent,dataChild) {
     //  console.log("****",dataParent,dataChild)
     var that = this
     this.dataElements.forEach(function(dataElement) {
        //选择气象要素（weatherElement）
        if(dataParent == dataElement.Element && dataParent == "气象要素"){
          that.weatherElement = dataChild
          dataElement.subElement.filter(function(data){
           if(data.subName == dataChild){
              if(data.isSelect){
                dataElement.subElement.forEach(function(item){
                  item.isSelect  =false
                })
                data.isSelect  = true
              }else{
                that.weatherElement = ""
              }
              that.showWeatherLayer =  data.isSelect
              //将weatherElementde值传给图例MapLengd组件
              Bus.$emit('legdendElement', that.weatherElement)
            }
          })
          //请求气象要素图层
          that.getWeatherData(that.weatherElement)
          
          // console.log("气象要素",that.weatherElement)
        }
        //选择卫星云图（nephanalysis）
        else if(dataParent == dataElement.Element && dataParent == "卫星云图"){
          that.nephanalysis = dataChild
          dataElement.subElement.filter(function(data){
           if(data.subName == dataChild){
              if(data.isSelect){
                dataElement.subElement.forEach(function(item){
                  item.isSelect  =false
                })
                data.isSelect  = true
              }
              else{
               that.nephanalysis = ""
              }
            }
          })
          that.getNephanalysisData(that.nephanalysis)
          console.log("卫星云图",that.nephanalysis)
          
        }
        //选择输电线路（wire_paths）
        if(dataParent == dataElement.Element && dataParent == "输电线路"){
          var voltage = dataChild
          var wireValue = voltage.substring(1)
          if(that.wire_paths.indexOf(voltage)<0){
            that.wire_paths.push(voltage)
          }else{
            that.wire_paths = that.wire_paths.filter(function(data){
              return data != voltage
            })
          }   
          that.dataElements[2].subElement.forEach(data => {
            //选中电压(isSelect为true）则请求数据绘制线路，否则清除该选项电压的线路
            if( data.isSelect && data.subName == voltage){ 
               that.createWirePath(wireValue)
            }else if(!data.isSelect && data.subName == voltage){
                 //清除选中电压值的mark元素
                var wireBuffers = that.wireMarkerLayer.markers.filter(singalWireMark => {
                    return singalWireMark.VOLTAGE == wireValue
                })
                wireBuffers.forEach(item => {
                    that.wireMarkerLayer.removeMarker(item)
                })
               
                
                //清除选中电压值的杆塔线
                that.wireLineLayer.features.forEach(singalWireLine => {
                  if(singalWireLine.VOLTAGE == wireValue){
                    that.wireLineLayer.removeFeatures(singalWireLine)
                  }
                })
               
               
               console.log("图标：",that.wireMarkerLayer)
               Bus.$emit("clearWirePath",{wireValue:wireValue, wireOption:that.dataElements[2].subElement})
            }
          })
          
        }
     })
    },

    //请求输电线路数据
    createWirePath(wireValue){
      var that = this
      this.$axios.get('mock/wire.json')
      .then(res => {
        // console.log("杆塔数据",res.data)
        res.data.forEach(wireData => {
          if(wireData.VOLTAGE == wireValue){
             that.creatWireLayer(wireData)
          }
          // console.log(wireData)
        })
      }).catch(e => {
        console.log(e)
      })
    },
    
    //绘制输电线路
    creatWireLayer(wireData){
      var size = new SuperMap.Size(40, 40)  
      var offset = new SuperMap.Pixel(-(size.w / 2), -20)
      var icon = new SuperMap.Icon("image/tower.png", size, offset)
      var that = this
      var wirePointBuffer;
      var wirePoints = [];
      var wirePointVector;
      var wirePointVectors = [];
      wireData.wireStations.forEach(wirePoint => {
        wirePointBuffer = new SuperMap.Geometry.Point(wirePoint.SmX,wirePoint.SmY)
        wirePointBuffer.strength = Math.ceil(Math.random()*100)
        wirePointVector = new SuperMap.Feature.Vector(wirePointBuffer, {
          "电压：": wirePoint.VOLTAGE,
          "经度：": wirePoint.LONGITUDE,
          "维度：": wirePoint.LATITUDE, 
          "公司：": wirePoint.DEPT,
          "省份：": wirePoint.PROVINCE,
        });
        wirePointVector.NAME = wireData.NAME
        wirePointVector.style = {
          "fillColor": "rgba(255,255,255,0)",
          "pointRadius": 6,
          "strokeColor": "rgba(255,255,255,0)",
          // strokeOpacity: 0,
        }
        wirePoints.push(wirePointBuffer)
        wirePointVectors.push(wirePointVector)
        var WireMarkBuffer = new SuperMap.Marker(new SuperMap.LonLat(wirePoint.SmX, wirePoint.SmY), icon) 
        WireMarkBuffer.VOLTAGE = wireData.VOLTAGE
        this.wireMarkerLayer.addMarker(WireMarkBuffer);
        
        $(".olAlphaImg").parent().parent().css("z-index", 390)
      })
      
      //更具
      var len = wirePoints.length
      for( var i=0;i<len-1;i++){
        var buffers = [];
        buffers.push(wirePoints[i])
        buffers.push(wirePoints[i+1])
        var line = new  SuperMap.Geometry.LineString(buffers)
        var linePathVector = new SuperMap.Feature.Vector(line)
        // console.log(buffers[0].strength,"**",buffers[1].strength)
            linePathVector.style  = this.setWireLineStyle(buffers[0].strength , buffers[1].strength)
            // = {
            //     "strokeColor": "#6d6666",
            //     "strokeWidth": 2,
            //     "label":wireData.NAME,
            // };
        linePathVector.NAME = wireData.NAME
        linePathVector.VOLTAGE = wireData.VOLTAGE
        this.wireLineLayer.addFeatures(linePathVector);
      }
      // var line = new  SuperMap.Geometry.LineString(wirePoints)
      // var linePathVector = new SuperMap.Feature.Vector(line)
      // linePathVector.style = {
      //           "strokeColor": "#6d6666",
      //           "strokeWidth": 2,
      //           "label":wireData.NAME,
      //       };
      // linePathVector.NAME = wireData.NAME
      // linePathVector.VOLTAGE = wireData.VOLTAGE
      // this.wireLineLayer.addFeatures(linePathVector);
      Bus.$emit("getWireStation",{wirePointVectors: wirePointVectors})
    },

    //设置杆塔线路样式
    setWireLineStyle(point1 , point2){
      var strength = point1 - point2
      var color = ""
      if(strength<0) {
        strength = strength*(-1)
      }
      if(strength>0 && strength<20){
         color = "pink"
      }else if(strength>20 && strength<40){
        color = "#e4734f"
      }else if(strength>40 && strength<60){
         color = "#8186d5"
      }else{
         color = "yellow"
      }

      var style = {
        "strokeColor": color,
        "strokeWidth": 3,
        // "label":wireData.NAME,
      }

      return style
    },
    
    // 绘制输电线路，电路杆塔线
    loadUTFGridLayer(layerName, url, cacheEnabled, transparent, layerIndex, extentFlag, iserverName, utfgridName, id, callback, eventType){
      // var that = this
      // var layer = this.map.getLayersByName(layerName);
      // if(layer.length>0){
      //   this.map.removeLayer(layer[0]);
      //   // this.UTFGridControl[id].destroy();
      //   this.map.removeControl(this.UTFGridControl[id]);
      //   // this.UTFGridControl[id] = null;
      // } 
      // else {
      //   layer = new SuperMap.Layer.TiledDynamicRESTLayer(layerName, url, {
      //         transparent: transparent,
      //         cacheEnabled: cacheEnabled
      //   });
      //   layer.isBaseLayer = false;
      //     layer.events.on({"layerInitialized": function(){
      //       that.map.addLayer(layer);
      //       //图层排序
      //       that.map.setLayerIndex(layer, layerIndex);
      //       //是否定位
      //       if(extentFlag == true){
      //         var left = layer.maxExtent.left;
      //         var bottom = layer.maxExtent.bottom;
      //         var right = layer.maxExtent.right;
      //         var top = layer.maxExtent.top;
      //         that.map.zoomToExtent(new SuperMap.Bounds(left, bottom, right, top));
      //       }
      //       //加载utfgrid图层
      //       var UTFGridLayers = that.map.getLayersByName(utfgridName);
      //       if(UTFGridLayers.length>0){
      //         that.map.addLayer(UTFGridLayers[0]);
      //       }		
      //       var utfgrid = new SuperMap.Layer.UTFGrid(utfgridName, url, {
      //         layerName: iserverName,
      //         utfTileSize: 256,
      //         pixcell: 8,
      //         isUseCache: true
      //       },
      //       {
      //         utfgridResolution: 8
      //       });
      //       utfgrid.maxExtent = layer.maxExtent;
      //       that.map.addLayer(utfgrid);
      //       //图层排序
      //       var index = that.map.getLayerIndex(layer);
      //       that.map.setLayerIndex(utfgrid, index+1);
      //       that.UTFGridControl[id] = new SuperMap.Control.UTFGrid({
      //         layers: [utfgrid],
      //         callback: function(infoLookup, loc, pixel){
      //           // 根据每个弹窗对应的id确定关闭的弹窗
      //           // if(that.map.popup != null && this.map.popup.id == layerName) {
      //             // that.map.removePopup(that.map.popup);
      //           // }
      //           if( that.map.popup){
      //               try{
      //                  that.map.popup.hide();
      //                  that.map.popup.destroy();
      //               }
      //               catch(e){}
      //           }

      //           if (infoLookup) {
      //             var info;
      //             for (var idx in infoLookup) {
      //                 info = infoLookup[idx];
      //                 if (info && info.data) {
      //                   // if(that.map.popup != null) {
      //                   //   that.map.removePopup(that.map.popup);
      //                   // }
      //                   var html = "<p class=\"popup_p\" style=\"font-weight:bold;\">"+'杆塔'+"</p>" +
      //                         "<hr class=\"popup_hr\"/>" +
      //                         "<table class=\"popup_table\">";
                        
      //                         var lon = info.data.SmX;
      //                         var lat = info.data.SmY;
      //                         html += "<tr class=\"popup_tr\">" +
      //                           "	<td class=\"popup_style1\">"+'线路名称：'+info.data.LINE+"</td>" +
      //                           "	<td class=\"popup_style1\">"+'电压：'+info.data.VOLTAGE+"</td>" +
      //                           "	<td class=\"popup_style1\">"+'经度：'+lon+"</td>" +
      //                           "	<td class=\"popup_style1\">"+'纬度：'+lat+"</td>" +
      //                           "</tr>";
      //                     html += "</table>";
      //                     //设置x与y的像素偏移量，不影响地图浏览；
    	// 	                  //var xOff = (1 / this.map.getScale()) * 0.001;
   		//                     // var yOff = -(1 / this.map.getScale()) * 0.005;
      //                     var pos = new SuperMap.LonLat(loc.lon, loc.lat);
      //                     // var icon = new SuperMap.Icon(null, null, new SuperMap.Pixel(-18, -3));
      //                     var icon = new SuperMap.Icon(null, null, new SuperMap.Pixel(-0, -0));
      //                     var popup = new SuperMap.Popup.FramedCloud(
      //                     layerName,							//弹窗的唯一标识，如设为null，则将会自动生成
      //                     pos, 										//地图上弹窗显示的位置
      //                     null,										//弹窗内容的大小
      //                     html,										//弹窗中显示的一个HTML要素的字符串
      //                     icon,										//锚点，包含一个大小信息 SuperMap.Size和偏移信息 SuperMap.Size的对象。(一般为 SuperMap.Icon类型）
      //                     false,									//在弹出窗口的里面是否显示关闭窗
      //                     null										//关闭弹窗触发该回调函数
      //                   );
      //                   that.map.popup = popup;
      //                   that.map.addPopup(popup);
      //                 }
      //             }
      //           }
      //         },
      //       handlerMode: eventType
      //     });
      //     that.map.addControl(that.UTFGridControl[id]);
      //   }});
      // }
    },

    //气象图层数据请求
    getWeatherData(weatherElement) {
      // if(this.map.getLayer(this.weatherLayer.id) != null) {
      //   this.map.removeLayer(this.weatherLayer, false)
      // }
      // var bounds = new SuperMap.Bounds(73.4,3.1,134.9,54.4)
      // var options = {numZoomLevels: 14,useCanvas: false,isBaseLayer: false}
      // if(weatherElement == '海面温度') {
      //   this.weatherLayer = new SuperMap.Layer.Image("weatherData", 'http://localhost:8080/image/20180828.png', bounds, options)    
      // }
      // else if(weatherElement == '降水') {
      //   this.weatherLayer = new SuperMap.Layer.Image("weatherData", 'http://localhost:8080/image/20180828.png', bounds, options)
      // }
      // else if(weatherElement == '风') {
      //   this.weatherLayer = new SuperMap.Layer.Image("weatherData", 'http://localhost:8080/image/20180828.png', bounds, options)
      // }

      // // this.showWeatherLayer = !this.showWeatherLayer
      // // this.weatherLayer.setVisibility(this.showWeatherLayer)
      // this.weatherLayer.setOpacity(0.6)
      // this.map.addLayers([this.weatherLayer])
      // if(weatherElement == '') {
      //   this.weatherLayer.setVisibility(false)  
      // } else {
      //   this.weatherLayer.setVisibility(true)
      // }
      
      
      this.$axios.get('mock/geojson.json', {
      }).then(res => {
        console.log("色斑图",res.data)
        this.weatherData = res.data
        this.geoColorLayer()
      }).catch(function(e) {
        console.log(e)
      })


    },
    
    // 卫星云图数据请求
    getNephanalysisData(nephanalysis){
      if(this.map.getLayer(this.nephanalysisLayer.id) != null) {
        this.map.removeLayer(this.nephanalysisLayer, false)
      }
      // var bounds = new SuperMap.Bounds(73.4,3.1,134.9,54.4)
      var bounds = new SuperMap.Bounds(63,3.1,134.9,54.4)
      var options = {numZoomLevels: 14,useCanvas: false,isBaseLayer: false}
      if(nephanalysis == 'FY4A真彩色') {
        this.nephanalysisLayer = new SuperMap.Layer.Image("nephanalysisData", 'image/01.jpg', bounds, options)    
      }

      // this.showWeatherLayer = !this.showWeatherLayer
      // this.weatherLayer.setVisibility(this.showWeatherLayer)
      this.nephanalysisLayer.setOpacity(0.6)
      this.map.addLayer(this.nephanalysisLayer)
      // this.map.setLayerIndex(this.nephanalysisLayer,365)
      // $(".smTileImage").parent().parent().css("z-index", 400)
      if(nephanalysis == '') {
        this.nephanalysisLayer.setVisibility(false)  
      } else {
        this.nephanalysisLayer.setVisibility(true)
      }
    },

    // 生成气象要素色斑图
    geoColorLayer() {
      var colors = this.weatherData[1].items.reverse()
      var datas = this.weatherData[2].features
      var features = []
      datas.forEach(regionItem => {
        regionItem.geometry.coordinates.forEach(polygon => {
          var multiPolygon = polygon.map(line => {
            // 边界点
            var points = line.map(point => {
              return new SuperMap.Geometry.Point(point[0], point[1])
            })
            // 点连线
            return new SuperMap.Geometry.LinearRing(points)
          })
          // 由线生成岛洞图
          var region = new SuperMap.Geometry.Polygon(multiPolygon)
          var regionVector = new SuperMap.Feature.Vector(region)
          var MGMinValue = regionItem.properties.MGMinValue
          var MGMaxValue = regionItem.properties.MGMaxValue
          // 填色
          MGMinValue = MGMinValue <= -90 ? MGMaxValue : MGMinValue
          colors.some(colorStyle => {
            if(MGMinValue >= colorStyle.Value) {
              regionVector.style = {
                fillColor: colorStyle.FillStyle.ForeColor,
                fillOpacity: 1,
                strokeWidth: 0
              }
              return true
            }
          })
          features.push(regionVector)
        })
      })
      this.weatherLayer.addFeatures(features)
      // if(this.getWeather) {
      //   this.map.addLayer(this.weatherLayer)
      //   this.getWeather = false
      // }
      this.weatherLayer.setOpacity(0.8)
      this.weatherLayer.setVisibility(this.showWeatherLayer)
      
    },
  }
};
</script>

<style scoped>
/* 图层控制面板样式 */

.fadeAni-enter-active, .fadeAni-leave-active {
  transition: all .38s cubic-bezier(0.69, -0.39, 0.88, 0.74);
}
.fadeAni-enter, .fadeAni-leave-to  {
  transform: translateX(-100%) scale(.3);
  opacity: 0
}

#overlay{
  height: 100%;
  width: 365px;
}

.overlayControl {
  width: 365px;
  background-color: #ffffff;
  z-index: 10002;
  position: absolute;
  bottom: 40px;
  color: #444;
  font-size: 12px;
  box-shadow: 1px 1px 10px #666;
  border-radius: 4px;
  overflow: hidden;
  left: 15px;
}

.overlayTitle{
  width: 100%;
  height: 30px;
  line-height: 30px;
  /* background-color: #3cb4dc; */
  background-color:#57a3f3
}

.overlayTitle span {
  margin-left: 10px;
  font-weight: bold;
  font-size: 14px;
  color: #ffffff;
}

.overlayItem {
  width: 98%;
  margin: 5px 3px 3px 3px;
  border-bottom:1px solid #ccc; 
}

.overlayItem:last-of-type{
  border:none;
}

.overTitle {
  font-weight: bold;
  float: left;
  margin-top: 4px;
  margin-left: 3px;
}

.overlayUL{
  width:280px;
  display: inline-block;
} 

.overlayLi {
  height: 25px;
  line-height: 25px;
  display: inline-block;
  margin: 0 3px;
} 

.selectOver,
.overlayText{
  width: 80px;
  height: 25px;
  line-height: 25px;
  display: inline-block;
  cursor: pointer;
  text-align: center;
  margin-right: 5px;
}

.overlayText:hover {
  color: #2d8cf0;
}

.selectOver {
  color: #2d8cf0;
}

.overlayLine {
  width: 1px;
  height: 10px;
  line-height: 10px;
  display: inline-block;
  background-color: #8e8c8c;
}

/* 时间滑块样式 */
.timeSlider {
  width: 690px;
  height: 20px;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 1);
  position: absolute;
  left: 35%;
  bottom: 80px;
  color: black;
  border-radius:10px; 
  /* overflow: hidden; */
  opacity: 0.5;
}

.timeSlider:hover {
  /* background: rgba(255, 255, 255, 0.2); */
  opacity: 1;
}

.timeSlider:active {
  /* background: rgba(255, 255, 255, 0.2); */
  opacity: 1;
}

.timeMinus {
  margin-left: -8px;
}

.timePlus{
  position: absolute;
  right: 28px;
}

.sliderleft{
  width: 40px;
  display: inline-block;
  cursor: pointer;
  margin-left: 2px;
}

.sliderRight {
  float: right;
  width: 40px;
  text-align: right;
  margin-right: 5px;
  cursor: pointer;
}

.rangeSlider{
  width: 600px;
  position: absolute;
  top: -7px;
  left: 36px;
}

.slider{
  height: 4px;
}

.timeText {
  height: 20px;
  line-height: 20px;
}
</style>
