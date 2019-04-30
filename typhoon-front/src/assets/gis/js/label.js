//构建 feature 数据, 专题图的数据必须是 SuperMap.Feature.Vector
function addLabelThemeLayer(data, t) {
  //新建一个策略
  var strategy = new SuperMap.Strategy.GeoText();
  //新建一个标签专题图层
  labelLayer = new SuperMap.Layer.Vector("标签图层", {
    strategies: [strategy]
  });
  map.addLayer(labelLayer);
  //设置标签的样式
  strategy.style = {
    fontColor: "black",
    fontWeight: "bolder",
    fontFamily: "宋体",
    fontSize: "12px",
    fill: true,
    fillColor: "#FFFFFF",
    fillOpacity: 0,
    stroke: false,
    strokeColor: "#8B7B8B"
  };
  var labelFeas = [];

  for (var i = 0; i < data.length; i++) {
    //新建GeoText对象（文本标签）
    var label;
    if (t == null) {
      var dq = spaceNameChange(data[i].kongjian);
      if (data[i].zbName != null && data[i].zbName != "") {
        dq = data[i].zbName;
      }

      label = new SuperMap.Geometry.GeoText(
        data[i].smx,
        data[i].smy,
        dq.indexOf(" ") != -1 ? dq.substring(dq.indexOf(" ")) : dq
      );
    } else {
      label = new SuperMap.Geometry.GeoText(
        data[i][1],
        data[i][2],
        data[i][0].lastIndexOf(" ") != -1
          ? data[i][0].substring(data[i][0].lastIndexOf(" "))
          : data[i][0]
      );
    }
    //新建标签要素并添加到标签要素数组。注：标签要素是指 geometry 类型为 SuperMap.Geometry.GeoText 的矢量要素（SuperMap.Feature.Vector）。
    labelFeas.push(new SuperMap.Feature.Vector(label, null));
  }
  labelLayer.addFeatures(labelFeas);
}
/**
 * 空间名字转换
 */
function spaceNameChange(name) {
  var kongjian = "";
  if (name.indexOf("北京")) {
    kongjian = "北京";
  } else {
    kongjian = name;
  }
  return kongjian;
}
