package com.field.typhoonquery.entity;

/**
 * Created by Tian.Ye in 15:27 2019/3/12
 */
public class TyphoonOrg {

    /** PK 机构编号*/
    private String forecast_org;

    /** 中文名*/
    private String name;

    public String getForecast_org() {
        return forecast_org;
    }

    public void setForecast_org(String forecast_org) {
        this.forecast_org = forecast_org;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
