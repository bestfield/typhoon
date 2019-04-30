<template>
  <div id="typhoon">
    <banner></banner>
    <MyMap></MyMap>
  </div>
</template>

<script>
import Banner from "./Banner";
import MyMap from "./MyMap";

export default {
  name: "Typhoon",
  components: {
    Banner,
    MyMap,
  },
  data() {
    return {};
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#typhoon {
  width: 100%;
  height: 100%;
  color: white;
  font-family: "Microsoft Yahei";
  font-size: 13px;
  margin: 0 auto;
  padding: 0px;
  overflow: hidden;
}
</style>
