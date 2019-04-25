package com.field.typhoondata.controller;

import com.field.typhoondata.scheduler.DataScheduler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Created by Tian.Ye in 15:15 2019/4/23
 */
@RestController
public class DataController {

    @Autowired
    private DataScheduler dataSchedulerService;

    /** feign
     *  测试地址：http://localhost:8083/sync
     *  在typhoon-query模块通过feign 手动数据入库
     * */
    @RequestMapping("/sync")
    public String sync() throws Exception{
        dataSchedulerService.run();
        return "sync success";
    }
}
