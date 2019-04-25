package com.field.typhoonquery.controller;

import com.field.typhoonquery.service.DataFeignClient;
import com.field.typhoonquery.service.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;

/**
 * Created by Tian.Ye in 16:34 2019/4/18
 * feign 消费者 类
 */
@RestController
public class ConsumerController {

    @Resource
    private FeignClient feignClient;

    @Resource
    private DataFeignClient dataFeignClient;

    /** feign   http://localhost:8083/hello/field */
    @GetMapping("/hello/{name}")
    public String index(@PathVariable("name") String name) {
        return feignClient.hello(name);
    }

    /** 将.txt文件中的报文解析并同步到数据库
     *  http://localhost:8083/sync
     * */
    @GetMapping("/sync")
    public String syncDatabase() {
        return dataFeignClient.sync();
    }

}
