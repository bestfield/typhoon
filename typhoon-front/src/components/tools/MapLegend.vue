<template>
  <div id="maplegen">
    <div
      class="legend"
      @click="isLengend = !isLengend,setLegSlected()"
    >图例
    <Icon :type="isLengend ? 'ios-arrow-up' : 'ios-arrow-down'" />
    </div>
    <!-- <transition 
      name="fade"
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOut"
    > -->
      <div class="LengendSlider" v-show="isLengend">
        <div class="lengendContext warterInfor" v-show="legdendElement == '降水'">
          <ul class="lengendUl">
            <li class="lengendLi legendTitle"><span class="titleText">降水</span><span class="lengendDW">(mm)</span></li>
            <li class="lengendLi" v-for="(item,index) in warterLengend" :key="item.id">
              <span class="lengendRectangle" :style="item.roundStyle" ></span>
              <span class="lengenText">{{item.lengendType}}</span></li>
          </ul>
        </div>
        <div class="seaTemp" v-show="legdendElement == '海面温度'">
          <ul class="lengendUl">
            <li class="lengendLi legendTitle"><span class="titleText">海面温度</span><span class="lengendDW">(°C)</span></li>
            <li class="lengendLi" v-for="(item,index) in seaTemps" :key="item.id">
              <span class="lengendRectangle" :style="item.roundStyle" ></span>
              <span class="lengenText">{{item.lengendType}}</span>
            </li>
          </ul>
        </div>
        <div class="wind" v-show="legdendElement == '风'">
          <ul class="lengendUl">
            <li class="lengendLi legendTitle"><span class="titleText">风</span></li>
            <li class="lengendLi" v-for="(item,index) in windPower" :key="item.id">
              <span class="lengendRectangle" :style="item.roundStyle" ></span>
              <span class="lengenText">{{item.lengendType}}</span>
            </li>
          </ul>
        </div>
        <div class="lengendContext lastContext">
          <ul class="lengendUl">
            <li class="lengendLi legendTitle"><span class="titleText">台风</span></li>
            <li
              class="lengendLi"
              v-for="(item,index) in typhoonType"
              :key="item.id"
            ><span
                class="lengendRound"
                :style="item.roundStyle"
              ></span><span class="lengenText">{{item.lengendType}}</span></li>
          </ul>
        </div>
      </div>
    <!-- </transition> -->
  </div>
</template>
<script>
import $ from "jquery";
import Bus from './bus.js'
export default {
  data() {
    return {
      legdendElement: "降水",
      isLengend: false,
      warterLengend: [  //降水图例
        { roundStyle: "background-color:#fff", lengendType: "0~ 1" },
        {
          roundStyle: "background-color:rgb(166, 242, 143)",
          lengendType: "1~ 1.5"
        },
        {
          roundStyle: "background-color:rgb(61, 186, 61)",
          lengendType: "1.6~ 6.9"
        },
        {
          roundStyle: "background-color:rgb(97, 184, 255)",
          lengendType: "7~ 14.9"
        },
        {
          roundStyle: "background-color:rgb(0, 0, 225)",
          lengendType: "15~ 39.9"
        },
        {
          roundStyle: "background-color:rgb(250, 0, 250)",
          lengendType: "40~ 49.9"
        },
        {
          roundStyle: "background-color:rgb(128, 0, 64)",
          lengendType: "> 50.0"
        }
      ],
      seaTemps:[  //海面温度图例
        { 
          roundStyle: "background-color:#74e1e8",
           lengendType: "-16~ -8" 
        },
        {
          roundStyle: "background-color:#c8ffd8",
          lengendType: "-8~ 0"
        },
        {
          roundStyle: "background-color:#fdffbb",
          lengendType: "0~ 8"
        },
        {
          roundStyle: "background-color:#fbff01",
          lengendType: "8~ 16"
        },
        {
          roundStyle: "background-color:#fa7001",
          lengendType: "16~ 24"
        },
        {
          roundStyle: "background-color:#c2878b",
          lengendType: "24~ 32"
        },
        {
          roundStyle: "background-color:#9c0288",
          lengendType: "32~ 36"
        },
        {
          roundStyle: "background-color:#fd0100",
          lengendType: "36~ 40"
        },
        {
          roundStyle: "background-color:#700323",
          lengendType: "40~ 44"
        }
      ],
      windPower:[  //风力等级图例
        { 
          roundStyle: "background-color:#fff",
          lengendType: "6 级" 
        },
        {
          roundStyle: "background-color:rgb(166, 242, 143)",
          lengendType: "7 级" 
        },
        {
          roundStyle: "background-color:rgb(61, 186, 61)",
          lengendType: "8 级" 
        },
        {
          roundStyle: "background-color:rgb(97, 184, 255)",
          lengendType: "9 级" 
        },
        {
          roundStyle: "background-color:rgb(0, 0, 225)",
          lengendType: "10 级" 
        },
        {
          roundStyle: "background-color:rgb(250, 0, 250)",
          lengendType: "11 级" 
        },
        {
          roundStyle: "background-color:rgb(128, 0, 64)",
          lengendType:"≥12 级" 
        }
      ],
      typhoonType: [  //台风图例
        { roundStyle: "background-color:#efb796", lengendType: "热带低压" },
        { roundStyle: "background-color:#0062fe", lengendType: "热带风暴" },
        { roundStyle: "background-color:yellow", lengendType: "强热带风暴" },
        { roundStyle: "background-color:#f072f6", lengendType: "台风" },
        { roundStyle: "background-color:#fd5c1c", lengendType: "强台风" },
        { roundStyle: "background-color:#fd0026", lengendType: "超强台风" }
      ]
    };
  },
  methods: {
    setLegSlected() {
      Bus.$emit('isShowLegend',this.isLengend)
    }
  },
  mounted() {
    let self = this;
    Bus.$on('legdendElement',(data)=>{
      // console.log("*******",data)
      self.legdendElement = data
    })
  }
};
</script>
<style scoped>
/* 图例样式 */
.legend {
  position: absolute;
  right: 10px;
  bottom: 5px;
  height: 31px;
  width: 62px;
  height: 32px;
  z-index: 10000;
  font-size: 14px;
  cursor: pointer;
  line-height: 30px;
  text-align: center;
  color: #fff;
  
  background-color: #4d94f8;
  border: 1px solid #3d83e5;
  border-radius: 4px;
}

/* 内容样式 */
.LengendSlider {
  color: #000;
  right: 10px;
  width: 310px;
  bottom: 145px;
  position: absolute;
  z-index: 10001;
  font-size: 12px;
  background: rgba(255, 255, 255, 0.6);
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  user-select: none;
}

.titleText {
  margin-left: 10px;
  font-weight: bold;
}

.lastContext{
  margin-bottom: 3px;
}

.lengendLi {
  width: 100px;
  height: 20px;
  line-height: 20px;
  list-style: none;
  display: inline-block;
}

.legendTitle {
  width: 100%;
  height: 25px;
  line-height: 25px;
  font-size: 14px;
  border-bottom: 1px solid rgba(98, 81, 81, 0.33);
  background-position: center;
  display: block;
  margin-bottom: 3px;
}

.lengendRound {
  width: 10px;
  height: 10px;
  border-radius: 5px;
  display: inline-block;
  margin-right: 6px;
  margin-left: 10px;
  border: 1px solid #333;
}

.lengendRectangle {
  width: 11px;
  height: 10px;
  display: inline-block;
  margin-right: 6px;
  margin-left: 10px;
  border: 1px solid #333;
}

.lengendDW,
.lengenText {
  display: inline-block;
  width: 60px;
  font-size: 12px;
}
</style>
