package com.field.typhoonquery.controller;

import com.field.typhoonquery.entity.TyphoonForecast;
import com.field.typhoonquery.entity.TyphoonLive;
import com.field.typhoonquery.entity.TyphoonOrg;
import com.field.typhoonquery.service.TyphoonBaseService;
import com.field.typhoonquery.service.TyphoonForecastService;
import com.field.typhoonquery.service.TyphoonLiveService;
import com.field.typhoonquery.service.TyphoonOrgService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by Tian.Ye in 15:36 2019/3/12
 */
@RestController
@Slf4j
@RequestMapping(value = "/typhoon")
public class TyphoonController {

    @Autowired
    TyphoonOrgService typhoonOrgServiceImpl;

    @Autowired
    TyphoonBaseService typhoonBaseServiceImpl;

    @Autowired
    TyphoonLiveService typhoonLiveServiceImpl;

    @Autowired
    TyphoonForecastService typhoonForecastServiceImpl;

    //TODO listorg 改造 feign?
    /** t_typhoon_org*/
    @RequestMapping(value = "/listorgs")
    @ResponseBody
    public List<TyphoonOrg> listOrgs() {
        List<TyphoonOrg> list = new ArrayList<>();
        list = typhoonOrgServiceImpl.listAllOrgs();
        return list;
    }

    /** typhoon_live 按年查询台风实况路径 GET方式*/
    @RequestMapping(value = "/listlive")
    @ResponseBody
    public List<Object> listLiveByYears(HttpServletRequest request, Model model){
        /**
         * @Description: 测试地址: http://localhost:8083/typhoon/listlive?startYear=2018&endYear=2019
         * @Date: Created in 上午 10:34 2019/2/25 0025
         * @Param: [request, model]
         * @Return: java.util.List<java.lang.Object>
         */
        String startYear = request.getParameter("startYear");
        String endYear = request.getParameter("endYear");
        List<TyphoonLive> list = new ArrayList<>();
        list = typhoonLiveServiceImpl.listTyphoonByYears(Integer.parseInt(startYear), Integer.parseInt(endYear));
        log.info("***Query Result is : "+list);
        List<Integer> index = new ArrayList<>();
        List<Object> json = new ArrayList<>();
        int typhoonCount = typhoonLiveServiceImpl.calcTyphoonCount(list);
        /** 台风数==0 */
        if(typhoonCount == 0) {
            json.add("***The database query result is NULL!");
            return json;
        }
        /** 台风数==1 && 数据行数==1 */
        if(typhoonCount == 1 && list.size() == 1 ){
            json.add(list);
            return json;
        }
        /** 台风数==1 && 数据行数>1 */
        if(typhoonCount == 1 ){
            json.add(listToMapForLive(list));
            return json;
        }
        /** 台风数>1 */
        index = typhoonLiveServiceImpl.cutJson(list, typhoonCount);
        int flag1 = 0;
        for(int i = 0; i<index.size(); i++){
            json.add(i, listToMapForLive(list.subList(flag1,index.get(i)+1)));
            flag1 = index.get(i)+1;
        }

        return json;
    }

    private Map<String, Object> listToMapForLive(List<TyphoonLive> list){
        /**
         * @Description:
         *      根据指定格式将list转换为map
         *      当参数list中所有数组的typhoonId相等时才调用此函数！
         * @Date: Created in 11:42 2018/12/6
         * @param list
         */
        Map<String, Object> outerMap = new HashMap<>();
        List<Map<String,Object>> pointsList = new ArrayList<>();

//        TyphoonName typhoonName = typhoonNameService.selectByPrimaryKey(list.get(0).getTyphoonName());// (1)
        outerMap.put("typhoonId", list.get(0).getTyphoon_id());
        outerMap.put("typhoonName", list.get(0).getTyphoon_name());             //(2)    获取中文名
//        outerMap.put("begin_time", list.get(list.size()-1).getObs_time());    //取第一个点的时间作为begin_time
        outerMap.put("begin_time", list.get(0).getObs_time());
        for (int i = 0; i < list.size(); i++) {
            Map<String, Object> innerMap = new HashMap<>();
            innerMap.put("time", list.get(i).getObs_time());
            innerMap.put("longitude", list.get(i).getLon());
            innerMap.put("latitude", list.get(i).getLat());
            innerMap.put("power", list.get(i).getWind_power());
            /** ??? */
//            innerMap.put("speed", list.get(i).getMove_speed());
            innerMap.put("move_dir", list.get(i).getMove_direction());
            innerMap.put("move_speed", list.get(i).getMove_speed());
            innerMap.put("pressure", list.get(i).getCentral_pressure());
            innerMap.put("radius7", list.get(i).getRadius_7());
            innerMap.put("radius10", list.get(i).getRadius_10());
            /** 添加forecast*/
            List<Object> forecastList = new ArrayList<>();
            forecastList = this.listForecast(list.get(0).getTyphoon_id(), list.get(i).getObs_time());
            innerMap.put("forecast", forecastList);

            pointsList.add(i, innerMap);
        }
        outerMap.put("points", pointsList);

//        for (Map.Entry<String, Object> m : outerMap.entrySet()) {
//            System.out.println("key:" + m.getKey() + " value:" + m.getValue());
//        }
        return outerMap;
    }


    /** typhoon_forecast 获取预报路径*/
    @RequestMapping(value = "/listfc")
    @ResponseBody
    public List<Object> listFcByIdAndTime(HttpServletRequest request, Model model){
        /**
            * @Description: 测试地址: http://localhost:8083/typhoon/listfc?typhoon_id=201901&obs_time=2019-01-05 00:00:00.000
            * @Date: Created in 19:18 2019/4/10
             * @param request
         * @param model
        */
        String id = request.getParameter("typhoon_id");
        String time = request.getParameter("obs_time");
        return listForecast(Integer.parseInt(id), time);
    }

    private List<Object> listForecast(int typhoon_id, String time) {
        List<TyphoonForecast> list = typhoonForecastServiceImpl.listTpForecastByIdAndTime(typhoon_id, time);
//        log.info("正在调用listForecast() -----" );
        if (list.size() == 0) return null;
        List<Object> json = new ArrayList<>();
        json.add(listToMapForFc(list));
        return json;
    }

    /** ***????? 不懂map中power.speed分别对应数据库中的什么字段 */
    private Map<String, Object> listToMapForFc(List<TyphoonForecast> list){
        /**
         * @Description: listFcByIdAndTime()方法中从request获取了两个参数
         * ，这两个参数对应T_TYPHOON_FORECAST中>=1行的数据，均相等
         * @Date: Created in 16:55 2018/12/7
         * @param list
         */
        TyphoonOrg typhoonOrg = typhoonOrgServiceImpl.selectByPrimaryKey(list.get(0).getForecast_org()); //(1)
        Map<String, Object> outerMap = new HashMap<>();
        List<Map<String,Object>> pointsList = new ArrayList<>();
        outerMap.put("sets", typhoonOrg.getName());         //(2)  获取站点名
        for (int i = 0; i < list.size(); i++) {
            Map<String, Object> innerMap = new HashMap<>();
            innerMap.put("time", list.get(i).getPre_time());
            innerMap.put("longitude", list.get(i).getLon());
            innerMap.put("latitude", list.get(i).getLat());
            innerMap.put("power", list.get(i).getWind_speed());                     //????
            innerMap.put("speed", list.get(i).getWind_speed_max());                 //????
            innerMap.put("move_dir", list.get(i).getWind_direction());
            innerMap.put("move_speed", list.get(i).getWind_speed());
            innerMap.put("pressure", list.get(i).getCentral_pressure());
            innerMap.put("radius7", list.get(i).getRadius_7());
            innerMap.put("radius10", list.get(i).getRadius_10());
            pointsList.add(i, innerMap);
        }
        outerMap.put("points", pointsList);


        return outerMap;
    }

}
