package com.field.typhoondownload.scheduler;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.io.*;
import java.net.URL;
import java.text.SimpleDateFormat;
import java.util.Date;

@Component
public class TyphoonForecastScheduler {

    private String PREURL = "http://www.typhoon2000.ph/multi/data/";

    /** 调度器 【偶数】分钟【第30s时】执行一次
	* 2019/4/11 10:48:30
2019/4/11 10:50:30
2019/4/11 10:52:30
2019/4/11 10:54:30
2019/4/11 10:56:30
	*/
    @Scheduled(cron = "30/59 0/2 * * * ? ")
    public void run() throws Exception {
        /**TODO */
        this.downForecast("PABUK");
    }

    /**
     * 将www.typhoon2000.ph台风报文同步到本地
     */
    public void downForecast(String typhoonName)
            throws Exception {
        String urlStr = this.PREURL + typhoonName + ".TXT";
        File file = new File(typhoonName + ".TXT");

        String strPath = "E:\\workspace\\typhoon-cloud\\typhoon-download\\download\\others";
        File saveDir = new File(strPath);
        if (!saveDir.exists()) {
            saveDir.mkdir();
        }
        SimpleDateFormat sd = new SimpleDateFormat("yyyyMMdd");
        String fileName = sd.format(new Date()) + ".txt";
        File locfile = new File(saveDir + File.separator + fileName);
        BufferedOutputStream bos = new BufferedOutputStream(new FileOutputStream(file));

        /** 输出流 生成txt文件*/
        BufferedWriter fos = new BufferedWriter(new FileWriter(locfile));

        /** 解析url, 输入流读取报文 */
        InputStream bis = new URL(urlStr).openStream();
        byte[] buffer = new byte[1024];
        int index = -1;
        while ((index = bis.read(buffer)) != -1) {
            bos.write(buffer, 0, index);
        }
        bos.close();
        bis.close();

        InputStreamReader isr = new InputStreamReader(new FileInputStream(file), "gbk");             //使用指定的字符集读取字节并将它们解码为字符
        BufferedReader br = new BufferedReader(isr);
        String line = "";
        while ((line = br.readLine()) != null) {            //br  bufferedReader
            line = line.trim();                             //去掉字符串左边和右边的空格
            fos.write(line);                                //WRITE a string
            fos.newLine();
        }
        fos.close();
        br.close();

        System.out.println("info:http://www.typhoon2000.ph/multi/data/"+typhoonName+".TXT download success");
    }

}