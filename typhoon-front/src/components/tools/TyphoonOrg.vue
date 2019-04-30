<template>
  <div id="typhoonOrg">
    <div class="panelItem" v-show="isLengend">
      <div class="orgTitle" ><span class="orgTitletext">预报机构</span></div>
      <div class="typhoonOrgInfor">
        <ul class="orgUl">
          <li
            class="typhoonOrgLi"
            v-for="(item,index) in typhoonOrg"
            @click="item.isOrgChecked = !item.isOrgChecked, isOrgShow(item)"
            :key="item.id" 
          >
            <input type="checkbox" id="index" :value="item.orgValue" :checked="item.isOrgChecked">
            <span class="orgline" :style="item.lineStyle">━ ━</span>
            <span :class="[ item.isOrgChecked ? 'typhoonOrgLiSelect' : '']">{{item.orgName}}</span>
          </li>
          <li :class="[ isAllOrgChecked ? 'typhoonOrgLiSelect' : '', 'typhoonOrgLi']" @click="isAllOrgChecked = !isAllOrgChecked, allOrgChecked()">
            <span>全选</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
import Bus from "./bus.js";
export default {
  data() {
    return {
      isLengend:"",
      isAllOrgChecked: true,
      //预报机构数据
      typhoonOrg: [
        {
          orgValue: "zy",
          orgName: "中央",
          lineStyle: "color:red",
          isOrgChecked: true
        },
        {
          orgValue: "Janpan",
          orgName: "日本",
          lineStyle: "color:yellow",
          isOrgChecked: true
        },
        {
          orgValue: "TaiWan",
          orgName: "中国台湾",
          lineStyle: "color:green",
          isOrgChecked: true
        },
        {
          orgValue: "Korea",
          orgName: "韩国",
          lineStyle: "color:rgb(5, 59, 115)",
          isOrgChecked: true
        },
        {
          orgValue: "European",
          orgName: "欧洲",
          lineStyle: "color:black",
          isOrgChecked: true
        },
        {
          orgValue: "HongKong",
          orgName: "中国香港",
          lineStyle: "color:pink",
          isOrgChecked: true
        },
        {
          orgValue: "TUS",
          orgName: "美国",
          lineStyle: "color:purple",
          isOrgChecked: true
        }
      ]
    };
  },
  methods: {
    allOrgChecked() {
      //预报机构全选打钩
      if (this.isAllOrgChecked == true) {
        this.typhoonOrg.forEach(item => {
          item.isOrgChecked = true;
        });
      } else {
        //预报机构全选不打钩
        this.typhoonOrg.forEach(item => {
          item.isOrgChecked = false;
        });
      }
      this.$emit("allForecastupdate", {
        //将isAllOrgChecked和typhoonOrg传到Panel组件
        isAllOrgChecked: this.isAllOrgChecked,
        typhoonOrg: this.typhoonOrg
      });
    },
    //预报机构单个打钩
    isOrgShow(item) {
      // 预报机构有一个没选中则全选置为false
      if(!item.isOrgChecked) {
        this.isAllOrgChecked = false
      }
      //将singleForcastUpdate传到Panel组件
      this.$emit("singleForcastUpdate", { singleOrgChecked: item });
    },

    //将预报数据传到Panel组件
    forecastShow() {
      this.$emit("forecastShow", {
        typhoonOrg: this.typhoonOrg
      });
    }
  },
  mounted() {
    this.forecastShow();
    //接收图例MapLengend组件的isLengend
    Bus.$on('isShowLegend',(data)=>{
      this.isLengend = data
    })
  }
};
</script>

<style scoped>
#typhoonOrg {
  width: 310px;
  color: #000;
  font-size: 12px;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  background: rgba(255, 255, 255, 0.6);
  /* box-shadow: 0 1px 5px rgba(0, 0, 0, 0.65); */
  z-index: 10001;
  right: 10px;
  position: absolute;
  bottom: 37px;
}

.panelItem {
  margin-top: 2px;
  margin-bottom: 5px;
}

.typhoonOrgInfor {
  margin-top:3px;
  right: 78px;
  bottom: 60px;
  z-index: 10000;
  margin-left: 6px;
}

.typhoonOrgLi {
  display: inline-block;
  width: 93px;
  margin: 3px;
  list-style: none;
  font-size: 12px;
  font-weight: normal;
  user-select: none;
  cursor: pointer;
}
.typhoonOrgLi input[type="checkbox"] {
  cursor: pointer;
}
.typhoonOrgLiSelect {
  /* color: rgb(175, 57, 78) */
}

.orgTitle{
  border-bottom: 1px solid rgba(98, 81, 81, 0.33);
}

.orgTitletext{
  margin-left: 10px;
  height: 25px;
  line-height: 25px;
  display: inline-block;
  font-weight: bold;
  font-size: 14px;
  /* text-align: center; */
}

.orgline {
  font-weight: bold;
  margin-left:5px;
  margin-right: 5px;
}
</style>
