package com.field.typhoonquery.service.impl;

import com.field.typhoonquery.service.DataFeignClient;
import org.springframework.stereotype.Component;

/**
 * Created by Tian.Ye in 10:22 2019/4/27
 *
 * 为sync方法提供熔断 —— hystrix
 *
 */
@Component
public class DataFeignClientHystrix implements DataFeignClient {

    @Override
    public String sync() {
        return "Sorry, sync job has FAILED !! plz try again ";
    }

    @Override
    public String syncAll() {
        return "plz wait and see the console!!";
    }
}
