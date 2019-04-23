package com.field.typhoonquery.controller;

import com.field.typhoonquery.service.FeignService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;

/**
 * Created by Tian.Ye in 16:34 2019/4/18
 */
@RestController
public class ComsumerController {

    @Resource
    private FeignService feignService;

    /** feign   http://localhost:8083/hello/field */
    @GetMapping("/hello/{name}")
    public String index(@PathVariable("name") String name) {
        return feignService.hello(name);
    }

}
