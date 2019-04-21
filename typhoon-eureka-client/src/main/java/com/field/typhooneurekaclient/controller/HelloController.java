package com.field.typhooneurekaclient.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * Created by Tian.Ye in 20:50 2019/4/6
 */
@RestController
public class HelloController {

    /** feign  http://localhost:8083/hello/field */
    @RequestMapping("/hello")
    public String hello(@RequestParam(value = "name") String name){
        return "hello, "+ name +" world!";
    }


}
