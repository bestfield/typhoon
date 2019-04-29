package com.field.typhoondata.scheduler;

import com.field.typhoondata.entity.TyphoonBase;
import com.field.typhoondata.entity.TyphoonForecast;
import com.field.typhoondata.entity.TyphoonLive;
import com.field.typhoondata.service.TyphoonBaseService;
import com.field.typhoondata.service.TyphoonForecastService;
import com.field.typhoondata.service.TyphoonLiveService;
import lombok.extern.slf4j.Slf4j;
import net.sf.json.JSON;
import net.sf.json.JSONArray;
import net.sf.json.JSONException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.io.*;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

/**
 * Created by Tian.Ye in 下午 16:32 2019/1/22 0022
 */
@Slf4j
@Component
public class DataScheduler {

    @Autowired
    TyphoonLiveService typhoonLiveServiceImpl;

    @Autowired
    TyphoonForecastService typhoonForecastServiceImpl;

    @Autowired
    TyphoonBaseService typhoonBaseServiceImpl;

    static String path = "E:\\workspace\\typhoon-cloud\\typhoon-download\\download\\babj\\";

    /** TODO: readFile中文件路径要改*/

/** 调度器 【奇数】分钟执行一次*/
//    @Scheduled(cron = "0 1/2 * * * ? ")
    public void run() throws Exception {
        this.readFile("view_2468535");
    }

    public void runAll() throws Exception {
        ArrayList<String> fileNameList = new ArrayList<>();
        this.getAllFileName(path, fileNameList);
        for (String file : fileNameList) {
            this.readFile(file.toString());
        }
    }

    /**
     * 解析json格式 解析单个台风 入库
     */
    public void readFile(String file) throws Exception {
//        String pathName = "E:\\workspace\\typhoon-cloud\\typhoon-download\\download\\babj\\view_2468535";     //帕布
        String pathName = path + file;
        File fileName = new File(pathName);
        InputStreamReader reader = new InputStreamReader(new FileInputStream(fileName));
        BufferedReader br = new BufferedReader(reader);

        String line = "";
        line = br.readLine();
        int index1 = line.indexOf("(");
        int index2 = line.indexOf(")");
        line = line.substring(index1 + 1, index2);

        JSON json = JSONArray.fromObject("[" + line + "]");
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String name = ((JSONArray) json).getJSONObject(0).getJSONArray("typhoon").getString(1);
        String num = "20" + ((JSONArray) json).getJSONObject(0).getJSONArray("typhoon").getString(4);
//        String station_code = "BABJ";

        /** 更新typhoon_base表*/
        TyphoonBase typhoonBase = new TyphoonBase();
        typhoonBase.setTyphoon_id(Integer.parseInt(num));
        typhoonBase.setTyphoon_name(name);
        typhoonBaseServiceImpl.insertOrUpdateBase(typhoonBase);

        /** 遍历实况路径及预报路径*/
        for (int i = 0; i < ((JSONArray) json).getJSONObject(0).getJSONArray("typhoon").getJSONArray(8).size(); i++) {

            String obs_time = ((JSONArray) json).getJSONObject(0).getJSONArray("typhoon").getJSONArray(8)
                    .getJSONArray(i).getString(1);  //201812310900
            obs_time = obs_time.substring(0, 4) + "-" + obs_time.substring(4, 6) + "-" + obs_time.substring(6, 8) + " "
                    + obs_time.substring(8, 10) + ":" + obs_time.substring(10, 12) + ":00";
            String grade = ((JSONArray) json).getJSONObject(0).getJSONArray("typhoon").getJSONArray(8).getJSONArray(i).getString(3);
            String lon = ((JSONArray) json).getJSONObject(0).getJSONArray("typhoon").getJSONArray(8).getJSONArray(i).getString(4);
            String lat = ((JSONArray) json).getJSONObject(0).getJSONArray("typhoon").getJSONArray(8).getJSONArray(i).getString(5);
            String pressure = ((JSONArray) json).getJSONObject(0).getJSONArray("typhoon").getJSONArray(8).getJSONArray(i).getString(6);
            String wind_power = ((JSONArray) json).getJSONObject(0).getJSONArray("typhoon").getJSONArray(8).getJSONArray(i).getString(7);
            String move_direction = ((JSONArray) json).getJSONObject(0).getJSONArray("typhoon").getJSONArray(8).getJSONArray(i).getString(8);
            String move_speed = ((JSONArray) json).getJSONObject(0).getJSONArray("typhoon").getJSONArray(8).getJSONArray(i).getString(9);
            //        BigDecimal bigDecimal = new BigDecimal(lon);
            //        System.out.println(lon+"----"+bigDecimal);

            TyphoonLive typhoonLive = new TyphoonLive();
            typhoonLive.setTyphoon_name(name);
            typhoonLive.setTyphoon_id(Integer.parseInt(num));
            typhoonLive.setObs_time(obs_time);
            typhoonLive.setGrade(grade);
            typhoonLive.setLon(Float.parseFloat(lon));
            typhoonLive.setLat(Float.parseFloat(lat));
            typhoonLive.setCentral_pressure(Float.parseFloat(pressure));
            typhoonLive.setWind_power(Float.parseFloat(wind_power));
            typhoonLive.setMove_direction(move_direction);
            typhoonLive.setMove_speed(Float.parseFloat(move_speed));

            /** 判断是否有7级、10级、12级风圈 ——30KTS/50KTS/64KTS */
            if (!((JSONArray) json).getJSONObject(0).getJSONArray("typhoon").getJSONArray(8)
                    .getJSONArray(i).getJSONArray(10).isEmpty()) {
                for (int k = 0; k < ((JSONArray) json).getJSONObject(0).getJSONArray("typhoon").getJSONArray(8)
                        .getJSONArray(i).getJSONArray(10).size(); k++) {
                    if (((JSONArray) json).getJSONObject(0).getJSONArray("typhoon").getJSONArray(8)
                            .getJSONArray(i).getJSONArray(10).getJSONArray(k).getString(0).equals("30KTS")) {
                        /** 风圈半径以(ne,se,sw,nw)的方式进行存储*/
                        typhoonLive.setRadius_7(((JSONArray) json).getJSONObject(0).getJSONArray("typhoon").getJSONArray(8)
                                .getJSONArray(i).getJSONArray(10).getJSONArray(k).getString(1)
                                + "," + ((JSONArray) json).getJSONObject(0).getJSONArray("typhoon").getJSONArray(8)
                                .getJSONArray(i).getJSONArray(10).getJSONArray(k).getString(2)
                                + "," + ((JSONArray) json).getJSONObject(0).getJSONArray("typhoon").getJSONArray(8)
                                .getJSONArray(i).getJSONArray(10).getJSONArray(k).getString(3)
                                + "," + ((JSONArray) json).getJSONObject(0).getJSONArray("typhoon").getJSONArray(8)
                                .getJSONArray(i).getJSONArray(10).getJSONArray(k).getString(4)
                        );
                    } else if (((JSONArray) json).getJSONObject(0).getJSONArray("typhoon").getJSONArray(8)
                            .getJSONArray(i).getJSONArray(10).getJSONArray(k).getString(0).equals("50KTS")) {
                        /** 风圈半径以(ne,se,sw,nw)的方式进行存储*/
                        typhoonLive.setRadius_10(((JSONArray) json).getJSONObject(0).getJSONArray("typhoon").getJSONArray(8)
                                .getJSONArray(i).getJSONArray(10).getJSONArray(k).getString(1)
                                + "," + ((JSONArray) json).getJSONObject(0).getJSONArray("typhoon").getJSONArray(8)
                                .getJSONArray(i).getJSONArray(10).getJSONArray(k).getString(2)
                                + "," + ((JSONArray) json).getJSONObject(0).getJSONArray("typhoon").getJSONArray(8)
                                .getJSONArray(i).getJSONArray(10).getJSONArray(k).getString(3)
                                + "," + ((JSONArray) json).getJSONObject(0).getJSONArray("typhoon").getJSONArray(8)
                                .getJSONArray(i).getJSONArray(10).getJSONArray(k).getString(4)
                        );
                    } else if (((JSONArray) json).getJSONObject(0).getJSONArray("typhoon").getJSONArray(8)
                            .getJSONArray(i).getJSONArray(10).getJSONArray(k).getString(0).equals("64KTS")) {
                        /** 风圈半径以(ne,se,sw,nw)的方式进行存储*/
                        typhoonLive.setRadius_12(((JSONArray) json).getJSONObject(0).getJSONArray("typhoon").getJSONArray(8)
                                .getJSONArray(i).getJSONArray(10).getJSONArray(k).getString(1)
                                + "," + ((JSONArray) json).getJSONObject(0).getJSONArray("typhoon").getJSONArray(8)
                                .getJSONArray(i).getJSONArray(10).getJSONArray(k).getString(2)
                                + "," + ((JSONArray) json).getJSONObject(0).getJSONArray("typhoon").getJSONArray(8)
                                .getJSONArray(i).getJSONArray(10).getJSONArray(k).getString(3)
                                + "," + ((JSONArray) json).getJSONObject(0).getJSONArray("typhoon").getJSONArray(8)
                                .getJSONArray(i).getJSONArray(10).getJSONArray(k).getString(4)
                        );
                    }
                }
            }

            /** 添加BABJ的预报路径 */
            JSONArray jsonArray = null;
            try {
                jsonArray = ((JSONArray) json).getJSONObject(0).getJSONArray("typhoon").getJSONArray(8)
                        .getJSONArray(i).getJSONObject(11).getJSONArray("BABJ");
                System.out.println(jsonArray);
            } catch (JSONException e) {
                log.info("*********an null object happened in forecast syncing");
            }
            if (jsonArray != null) {
                List<TyphoonForecast> forecastList = new ArrayList<>();
                for (int k = 0; k < jsonArray.size(); k++) {
                    TyphoonForecast typhoonForecast = new TyphoonForecast();
                    Calendar c = Calendar.getInstance();
                    c.setTime(sdf.parse(obs_time));
                    c.add(Calendar.HOUR_OF_DAY, jsonArray.getJSONArray(k).getInt(0)); //预报时间=观察时间+预报时效
                    typhoonForecast.setTyphoon_id(Integer.parseInt(num));
                    typhoonForecast.setObs_time(obs_time);
                    typhoonForecast.setPre_time(sdf.format(c.getTime()));
                    typhoonForecast.setForecast_org("BABJ");

                    String longitude = jsonArray.getJSONArray(k).getString(2);
                    String latitude = jsonArray.getJSONArray(k).getString(3);
                    String cen_pressure = jsonArray.getJSONArray(k).getString(4);
                    String max_speed = jsonArray.getJSONArray(k).getString(5);
                    typhoonForecast.setLon(Float.parseFloat(longitude));
                    typhoonForecast.setLat(Float.parseFloat(latitude));
                    typhoonForecast.setCentral_pressure(Float.parseFloat(cen_pressure));
                    typhoonForecast.setWind_speed_max(Float.parseFloat(max_speed));
                    /**当台风为无名台风时，向typhoon_forecast表中存入字段nameless_id*/
                    if (num.equals("20")) {
                        String namelessId = ((JSONArray) json).getJSONObject(0).getJSONArray("typhoon").getString(0);
                        typhoonForecast.setNameless_id(Integer.parseInt(namelessId));
                    }

                    forecastList.add(typhoonForecast);
                }
                /** forecast入库*/
                typhoonForecastServiceImpl.insertOrUpdateForecast(forecastList);
            }


            /** 当台风为无名台风时，向typhoon_live表中存入字段nameless_id */
            if (num.equals("20")) {
                String namelessId = ((JSONArray) json).getJSONObject(0).getJSONArray("typhoon").getString(0);
                typhoonLive.setNameless_id(Integer.parseInt(namelessId));
            }

            /** live入库*/
            List<TyphoonLive> list = new ArrayList<>();
            list.add(typhoonLive);
            typhoonLiveServiceImpl.insertOrUpdateLive(list);

        }
        System.out.println(Calendar.getInstance().getTime() + " 实况数据及BABJ预报数据入库成功");
    }

    /** 获取所有以"view"开头的文件名*/
    public void getAllFileName(String path,ArrayList<String> fileNameList) {
        /**
            * @Description: 获取所有文件名
            * @Date: Created in 16:43 2019/4/29
             * @param path:文件夹的路径
         * @param fileNameList : 存放文件名称的list
        */
        //ArrayList<String> files = new ArrayList<String>();
//        boolean flag = false;
        File file = new File(path);
        File[] tempList = file.listFiles();

        for (int i = 0; i < tempList.length; i++) {
            if (tempList[i].isFile()    &&   tempList[i].getName().substring(0,4).equals("view")) {
              System.out.println("文     件：" + tempList[i].getName());
//                fileNameList.add(tempList[i].toString());
                fileNameList.add(tempList[i].getName());
            }
        }
    }

}
