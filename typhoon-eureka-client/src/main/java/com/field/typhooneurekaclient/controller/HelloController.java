package com.field.typhooneurekaclient.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * Created by Tian.Ye in 20:50 2019/4/6
 * service-producer 测试
 */
@RestController
public class HelloController {

    /** feign 启动typhoon-query               访问地址为： http://localhost:8083/hello/field           */
    /** zuul  启动typhoon-eureka-client-zuul  访问地址为: http://localhost:8070/api-a/hello?name=field */
    @RequestMapping("/hello")
    public String hello(@RequestParam(value = "name") String name){
        return "hello, "+ name +" world!";
    }

}
