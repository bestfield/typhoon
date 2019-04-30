<template>
  <div class="map">
    <div id="map" style=" border:none; touch-action: none; cursor: url('iClient/../theme/images/cursors/Pan.cur'), default;"></div>
    <!-- 缩放控件 -->
    <!-- 地图切换菜单 -->
    <div id="map_change">
      <div id="vecLayer" class="map_changeElement" @click="layerSelect('vec')" title="矢量图">
        矢量
      </div>
      <div id="imgLayer" class="map_changeElement" @click="layerSelect('img')" title="影像图">
        影像
      </div>
      <div id="terLayer" class="map_changeElement map_changeElementSelect" @click="layerSelect('ter')" title="地形图">
        地形
      </div>
    </div>
    <!-- 图层与查询统计控制 -->
    <div id="tab">
      <div type="button">
        <Button @click="totalShow = !totalShow" :type="typeTotal">查询统计</Button>
      </div>
    </div>
    <MapLegend></MapLegend>
    <OverlayPanel :show="layerShow" ref="overlay" :map="map"></OverlayPanel>
    <Panel :show="totalShow" :map="map" @update="updateMap"></Panel>
    <MeasureDistance ref="measureDistance"  :map="map" ></MeasureDistance>
  </div>
</template>

<script>
import $ from "jquery"
import { TiandituBorder } from '../assets/gis/js/TiandituBorder.js'
import OverlayPanel from './tools/OverlayPanel'
import MapLegend from "./tools/MapLegend"
import Panel from './tools/Panel'
import MeasureDistance from './tools/MeasureDistance'
export default {
  data() {
    return {
      map: {},
      tiandituLayer: '',
      tianMarkerLayer: '',
      layer1: '',
      layer2: '',
      layer3: '',
      layer4: '',
      layer5: '',
      layer6: '',
      layer7: '',
      layer8: '',
      markerLayer: '',  //厦门标记图层
      typhoonLineVector: '',  //警戒线图层
      marker: '',  //厦门标记
      // index: 100,
      // isTimeShow: false,
      // timeLineShow: 'timeLineShow',
      // timeLineHidden: 'timeLineHidden',
      layerShow: false, //地图默认选中图层按钮
      totalShow: false
    }
  },
  components: {
    Panel, MeasureDistance,OverlayPanel,MapLegend
  },
  computed: {
    // 计算属性控制按钮样式
    typeLayer: function() {
      return this.layerShow ? "primary" : "default"
    },
    typeTotal: function() {
      return this.totalShow ? "primary" : "default"
    }
  },
  methods: {
    // 地图初始化
    initMap() {
      this.map = new SuperMap.Map('map', {
        controls: [
          new SuperMap.Control.Navigation(),
        ],
        allOverlays: true,
      })
      this.map.addControl(new SuperMap.Control.Zoom(), new SuperMap.Pixel(8, -1, SuperMap.Pixel.Mode.RightTop))  
      this.map.addControl(new SuperMap.Control.MousePosition(), new SuperMap.Pixel(170, 52, SuperMap.Pixel.Mode.LeftBottom))
      this.map.addControl(new SuperMap.Control.Attribution(),new SuperMap.Pixel(90,52, SuperMap.Pixel.Mode.RightBottom))
      this.tiandituLayer = new SuperMap.Layer.Tianditu() 
      this.tianMarkerLayer = new SuperMap.Layer.Tianditu()
      this.tianMarkerLayer.layerType = 'cva'
      this.tianMarkerLayer.isLabel = true
      this.map.addLayers([this.tiandituLayer, this.tianMarkerLayer])
      this.map.setCenter(new SuperMap.LonLat(118, 40), 4)
      this.addInitLayer()
    },
    // 添加图层
    addInitLayer() {
      var map = this.map
      this.layer1 = new SuperMap.Layer.Tianditu({ layerType: 'vec' }) //矢量
      this.layer2 = new SuperMap.Layer.Tianditu({ layerType: 'img' }) //影像
      this.layer3 = new SuperMap.Layer.Tianditu({ layerType: 'ter' }) //地形
      this.layer4 = new SuperMap.Layer.TiandituBorder({ layerType: 'ibo' }) //影像边界
      this.layer5 = new SuperMap.Layer.TiandituBorder({ layerType: 'tbo' }) //地形边界
      this.layer6 = new SuperMap.Layer.Tianditu({
        layerType: 'vec',
        isLabel: true
      }) //矢量中文注记
      this.layer7 = new SuperMap.Layer.Tianditu({
        layerType: 'img',
        isLabel: true
      }) //影像中文注记
      this.layer8 = new SuperMap.Layer.Tianditu({
        layerType: 'ter',
        isLabel: true
      }) 
      this.layer1.attribution = "@SuperMap"
      this.layer2.attribution = "@SuperMap"
      this.layer3.attribution = "@SuperMap"
      map.addLayers([
        this.layer1,
        this.layer2,
        this.layer3,
        // this.layer4,
        // this.layer5,
        this.layer6,
        this.layer7,
        this.layer8
      ])
      //地形中文注记
      //	layer1 = new SuperMap.Layer.TiledDynamicRESTLayer("矢量底图", path+"/iserver/services/map-tianditu/rest/maps/矢量底图_经纬度", {transparent: true, cacheEnabled:true}, null);
      //	layer2 = new SuperMap.Layer.TiledDynamicRESTLayer("影像底图", path+"/iserver/services/map-tianditu/rest/maps/影像底图_经纬度", {transparent: true, cacheEnabled:true}, null);
      //	layer3 = new SuperMap.Layer.TiledDynamicRESTLayer("地形底图", path+"/iserver/services/map-tianditu/rest/maps/地形底图_经纬度", {transparent: true, cacheEnabled:true}, null);
      //	layer4 = new SuperMap.Layer.TiledDynamicRESTLayer("矢量中文注记", path+"/iserver/services/map-tianditu/rest/maps/矢量中文注记_经纬度", {transparent: true, cacheEnabled:true}, null);
      //	layer5 = new SuperMap.Layer.TiledDynamicRESTLayer("影像中文注记", path+"/iserver/services/map-tianditu/rest/maps/影像中文注记_经纬度", {transparent: true, cacheEnabled:true}, null);
      //	layer6 = new SuperMap.Layer.TiledDynamicRESTLayer("地形中文注记", path+"/iserver/services/map-tianditu/rest/maps/地形中文注记_经纬度", {transparent: true, cacheEnabled:true}, null);
      this.layer1.setVisibility(false) //设置初始图层可见性 地形图
      this.layer2.setVisibility(false)
      this.layer4.setVisibility(false)
      this.layer6.setVisibility(false)
      this.layer7.setVisibility(false)
      
      //	layer1.events.on({"layerInitialized": addlayer1});
      //	layer2.events.on({"layerInitialized": addlayer2});
      //	layer3.events.on({"layerInitialized": addlayer3});
      //	layer4.events.on({"layerInitialized": addlayer4});
      //	layer5.events.on({"layerInitialized": addlayer5});
      //	layer6.events.on({"layerInitialized": addlayer6});
      this.map.setCenter(new SuperMap.LonLat(117.27, 31.85), 4)
      this.addInitOtherLayer()
    },
    // 图层切换(同时切换图层预报时间轴的字体颜色)
    layerSelect(flag) {
      if (flag == 'vec') {
        this.layer1.setVisibility(true)
        this.layer2.setVisibility(false)
        this.layer3.setVisibility(false)
        this.layer4.setVisibility(false)
        this.layer5.setVisibility(false)
        this.layer6.setVisibility(true)
        this.layer7.setVisibility(false)
        this.layer8.setVisibility(false)
        $('#vecLayer').addClass('map_changeElementSelect')
        $('#imgLayer').removeClass('map_changeElementSelect')
        $('#terLayer').removeClass('map_changeElementSelect')
        $(".smControlNoSelect").css("color","#000")
        $(".smControlAttribution").css("color","#000")
        $(".smControlAttribution>a").css("color","#000")         
      }
      if (flag == 'img') {
        this.layer1.setVisibility(false)
        this.layer2.setVisibility(true)
        this.layer3.setVisibility(false)
        this.layer4.setVisibility(true)
        this.layer5.setVisibility(false)
        this.layer6.setVisibility(false)
        this.layer7.setVisibility(true)
        this.layer8.setVisibility(false)
        $('#imgLayer').addClass('map_changeElementSelect')
        $('#vecLayer').removeClass('map_changeElementSelect')
        $('#terLayer').removeClass('map_changeElementSelect')
        $(".smControlNoSelect").css("color","#fff")
        $(".smControlAttribution").css("color","#fff")
        $(".smControlAttribution").children().css("color","#fff")
      }
      if (flag == 'ter') {
        this.layer1.setVisibility(false)
        this.layer2.setVisibility(false)
        this.layer3.setVisibility(true)
        this.layer4.setVisibility(false)
        this.layer5.setVisibility(true)
        this.layer6.setVisibility(false)
        this.layer7.setVisibility(false)
        this.layer8.setVisibility(true)
        $('#terLayer').addClass('map_changeElementSelect')
        $('#vecLayer').removeClass('map_changeElementSelect')
        $('#imgLayer').removeClass('map_changeElementSelect')
        $(".smControlNoSelect").css("color","#000")
        $(".smControlAttribution").css("color","#000")
        $(".smControlAttribution a").css("color","#000")
      }
    },
    // 添加标记\警戒线图层
    addInitOtherLayer() {
      var map = this.map;
      var markerLayer = this.markerLayer;
      var typhoonLineVector = this.typhoonLineVector;
      var marker = this.marker;
      markerLayer = new SuperMap.Layer.Markers('markerLayer')
      var points48h = [
        //48小时警戒线
        new SuperMap.Geometry.Point(132, 34),
        new SuperMap.Geometry.Point(132, 22),
        new SuperMap.Geometry.Point(125, 15),
        new SuperMap.Geometry.Point(110, 15)
      ]
      var points24h = [
        //24小时警戒线
        new SuperMap.Geometry.Point(127, 34),
        new SuperMap.Geometry.Point(127, 22),
        new SuperMap.Geometry.Point(110, 15)
      ]
      var line48h = new SuperMap.Geometry.LineString(points48h)
      var line24h = new SuperMap.Geometry.LineString(points24h)
      var line24hVector = new SuperMap.Feature.Vector(line24h)
      var line48hVector = new SuperMap.Feature.Vector(line48h)
      line24hVector.style = {
        strokeColor: '#2228FC',
        strokeWidth: 2,
        label: '2\n4\n小\n时\n警\n戒\n线',
        labelYOffset: -150,
        labelXOffset: 10,
        fontColor: '#2228FC',
        fontFamily: 'Microsoft YaHei',
        fontSize: 14
      }
      line48hVector.style = {
        strokeColor: 'yellow',
        strokeWidth: 2,
        strokeDashstyle: 'dash',
        label: '4\n8\n小\n时\n警\n戒\n线',
        labelYOffset: -150,
        labelXOffset: 10,
        fontColor: 'yellow',
        fontFamily: 'Microsoft YaHei',
        fontSize: 14
      }
      typhoonLineVector = new SuperMap.Layer.Vector('typhoonLineVector')
      typhoonLineVector.addFeatures([line24hVector, line48hVector])
      map.addLayers([typhoonLineVector])
      var size = new SuperMap.Size(44, 44)
      var offset = new SuperMap.Pixel(-(size.w / 2), -size.h)
      var icon = new SuperMap.Icon('images/marker.png', size, offset)
      marker = new SuperMap.Marker(
        new SuperMap.LonLat(118.068, 24.446).transform(
          'EPSG:4490',
          'EPSG:900913'
        ),
        icon
      )
      marker.events.on({
        // click: this.markerClickHandler(),
        // mousemove: markerMouseMoveHandler,
        // mouseout: markerMouseOutHandler,
        // touchstart: markerClickHandler, //假如要在移动端的浏览器也实现点击弹框，则在注册touch类事件
        scope: marker
      })
      markerLayer.addMarker(marker)
      //map.addLayers([markerLayer]);
      // map.addLayer(this.elementVector)
    },
    // 接收panel对map的更新
    updateMap(data) {
      //panel组件中的控件
      this.map.addControl(data.drawPoint)
      this.map.addControl(data.drawLine)
      this.map.addControl(data.drawPolygon)
      this.map.addControl(data.selectControl)
      data.selectControl.activate()
      //测量距离
      this.$refs.measureDistance.initDrawline()
      this.map.addControl(this.$refs.measureDistance.drawLineMeasure)
      this.map.addLayers([this.$refs.overlay.wireLineLayer,this.$refs.overlay.wireMarkerLayer,this.$refs.overlay.weatherLayer,data.typhoonCircleVector, data.foreLineLayer, data.lineVectorLayer, data.markerlayer, data.elementVector, this.$refs.measureDistance.measureLineLayer, data.pointVectorLayer])
    }
  },
  mounted() {
    this.initMap()
  }
}
</script>
<style scoped>
.map {
  height: 100%;
}
.timeLineShow {
  position: absolute;
  right: 0px;
  bottom: 104px;
  width: 176px;
  height: 30px;
  z-index: 10000;
  border: 1px solid #9ebce5;
  background: white;
}
.timeLineHidden {
  position: absolute;
  right: 0px;
  bottom: 0;
  width: 176px;
  height: 30px;
  z-index: 10000;
  border: 1px solid #9ebce5;
  background: white;
}
#map {
  position: absolute;
  float: left;
  width: 100%;
  height: 100%;
}
#map_change {
  position: absolute;
  right: 42px;
  top: 53px;
  z-index: 10002;
  border-radius: 4px;
  border: 1px solid rgb(216, 214, 214);
}
.map_changeElement {
  width: 40px;
  text-align: center;
  height: 22px;
  line-height: 22px;
  display: inline-block;
  color: black;
  background: white;
  cursor: pointer;
}

.map_changeElement:first-of-type {
   border-bottom-left-radius: 4px;
   border-top-left-radius: 4px;
   border-right:1px solid rgb(216, 214, 214);;   
}

.map_changeElement:last-of-type {
   border-bottom-right-radius: 4px;
   border-top-right-radius: 4px;
   border-left:1px solid rgb(216, 214, 214);;  
}

.map_changeElementSelect {
  color: white;
  background-color: #2d8cf0;
}
.map_changeElement:hover, .map_changeElementSelect:hover {
  color: white;
  background-color: #57a3f3;
}
/* 图层与查询统计切换按钮样式 */
#tab {
  position: absolute;
  left: 15px;
  bottom: 5px;
  z-index: 10;
}
#tab .ivu-radio-group-button .ivu-radio-wrapper-checked {
  background: #2d8cf0;
  color: #fff;
}
#tab .ivu-radio-wrapper-checked:hover {
  color: #fff;
}
</style>
