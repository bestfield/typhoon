package com.field.typhoonquery.service;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

/**
 * Created by Tian.Ye in 16:34 2019/4/18
 *  feign测试
 */
@org.springframework.cloud.openfeign.FeignClient(value = "typhoon-eureka-client")
public interface FeignClient {
    @GetMapping("hello")
    public String hello(@RequestParam(value = "name") String name);
}