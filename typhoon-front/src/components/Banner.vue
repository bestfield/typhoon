<template>
    <div id="header">
        <div class="logo">
          <img class="logoImg" src="../assets/images/logo3.png">
          <img class="titleText" src="../assets/images/title.png"></span>
        </div>
        <div class="login">
            <img src="../assets/images/user.png"/>
        </div>
        <!-- <div class="HeaderNav">
            <span class="navItem">台风预报</span>
            <span class="navItem">信息展示</span>
            <span class="navItem">查询统计</span>
        </div> -->
        
    </div>
</template>

<script>
export default {
  name: "Banner"
}
</script>

<style scoped>
#header {
  position: relative;
  width: 100%;
  height: 50px;
  line-height: 50px;
  z-index: 1;
  border-bottom: 1px solid #ccc;
  box-shadow: 0 0 20px #aaa;
  background: url(../assets/images/banner1.png) no-repeat;
  background-size:100%; 
  background-position: center;
  background-color: rgb(224, 214, 200);
}

.logo {
  text-align:center;
  margin-left: 10px;
  display: inline-block;
  vertical-align: middle;
}

.logoImg,
.titleText{
  cursor: pointer;
}

/* .titleText{
  display: inline-block;
  position: absolute;

  height: 45px;
  line-height: 45px;
  font-size: 20px;
  font-weight: bold;
}  */

/* .HeaderNav {
  width: 240px;
  height: 40px;
  line-height: 35px;
  float: right;
  margin-right: 10px;
}

.navItem {
  width: 80px;
  height: 40px;
  line-height: 40px;
  font-size: 15px;
  display: inline-block;
  text-align: center;
  cursor: pointer;
}

.navItem:hover {
  background-color: rgb(164, 216, 233);
} */

.login {
  width: 33px;
  height: 33px;
  border-radius: 50%;
  overflow: hidden;
  background-color: #eaffff;
  float: right;
  margin-right: 10px;
  margin-top: 10px;
  cursor: pointer;
}
.login:hover {
  background-color: #fff;
}
</style>
