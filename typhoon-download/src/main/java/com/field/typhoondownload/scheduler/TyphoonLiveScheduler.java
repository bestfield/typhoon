package com.field.typhoondownload.scheduler;

import lombok.extern.slf4j.Slf4j;
import net.sf.json.JSON;
import net.sf.json.JSONArray;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;

/**
 * Created by Tian.Ye in 下午 16:32 2019/1/22 0022
 */
@Slf4j
@Component
public class TyphoonLiveScheduler {

    /** 调度器 【偶数】分钟执行一次*/
    @Scheduled(cron = "0 0/2 * * * ? ")
    public void run() throws Exception {
        downList();
        downOne();
    }

    /**
     * 获取台风列表 写入文件——》list_default
     */
    public static void downList() throws Exception {
        String url1 = "http://typhoon.nmc.cn/weatherservice/typhoon/jsons/list_default?&callback=typhoon_jsons_list_default";
//        String url1 = "http://typhoon.nmc.cn/weatherservice/typhoon/jsons/list_2018?callback=typhoon_jsons_list_2018";
        /** 从url1下载 list_default */
        URL url = new URL(url1);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setConnectTimeout(3000);
        InputStream inputStream = conn.getInputStream();
        byte[] getData = readInputStream(inputStream);
        String strPath = "E:\\workspace\\typhoon-cloud\\typhoon-download\\download\\babj";
        File saveDir = new File(strPath);
        if (!saveDir.exists()) {
            saveDir.mkdir();
        }
//        String fileName = "list_default";
        String fileName = "list_2018";
        File file = new File(saveDir + File.separator + fileName);
        FileOutputStream fos = new FileOutputStream(file);
        fos.write(getData);
        if (fos != null) {
            fos.close();
        }
        if (inputStream != null) {
            inputStream.close();
        }
        System.out.println("info:" + url + " download success");
    }

    /**
     * 根据list_default 解析其中每个台风 写入文件——》view_编号
     */
    public static void downOne() throws Exception {
        String fileName = "E:\\workspace\\typhoon-cloud\\typhoon-download\\download\\babj\\list_default";
//        String fileName = "E:\\workspace\\typhoon-cloud\\typhoon-download\\download\\babj\\list_2018";

        File file = new File(fileName);
        InputStreamReader reader = new InputStreamReader(new FileInputStream(file));
        BufferedReader br = new BufferedReader(reader);
        String line = "";
        line = br.readLine();
        /** list_default*/
        line = line.replace("typhoon_jsons_list_default((", "");
        line = line.replace("))", "");
        /** list_2018*/
//        line = line.replace("typhoon_jsons_list_2018(", "");
//        line = line.replace(")", "");

        JSON json = JSONArray.fromObject("[" + line + "]");
        for (int i = 0; i < ((JSONArray) json).getJSONObject(0).getJSONArray("typhoonList").size(); i++) {
            /** 2468535 PABUK 1901 */
            writeByNum(((JSONArray) json).getJSONObject(0).getJSONArray("typhoonList").getJSONArray(i).getString(0));
        }


    }

    private static void writeByNum(String num) throws Exception {
        String url2 = "http://typhoon.nmc.cn/weatherservice/typhoon/jsons/view_%s?&callback=typhoon_jsons_view_%s";
        url2 = url2.replace("%s", num);
        /** 从url2下载单个台风数据 */
        URL url = new URL(url2);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setConnectTimeout(3000);
        InputStream inputStream = conn.getInputStream();
        byte[] getData = readInputStream(inputStream);
        String pathName = "E:\\workspace\\typhoon-cloud\\typhoon-download\\download\\babj";
        File saveDir = new File(pathName);
        if (!saveDir.exists()) {
            saveDir.mkdir();
        }
        String fileName = "view_" + num;
        File file = new File(saveDir + File.separator + fileName);
        FileOutputStream fos = new FileOutputStream(file);
        fos.write(getData);
        if (fos != null) {
            fos.close();
        }
        if (inputStream != null) {
            inputStream.close();
        }
        System.out.println("info:" + url + " download success");

    }

    private static byte[] readInputStream(InputStream inputStream) throws IOException {
        byte[] buffer = new byte[1024];
        int len = 0;
        ByteArrayOutputStream bos = new ByteArrayOutputStream();
        while ((len = inputStream.read(buffer)) != -1) {
            bos.write(buffer, 0, len);
        }
        bos.close();
        return bos.toByteArray();
    }


}
