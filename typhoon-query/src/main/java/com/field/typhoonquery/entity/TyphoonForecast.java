package com.field.typhoonquery.entity;

public class TyphoonForecast {
    /**
     * PK
     */
    private int typhoon_id;

    /**
     * PK 预报时间
     */
    private String obs_time;

    /**
     * PK 预报时效
     */
    private String pre_time;

    /**
     * PK 预报机构
     */
    private String forecast_org;

    private float lon;

    private float lat;

    private float central_pressure;

    private float central_lon;

    private float central_lat;

    /**
     * 风圈半径以(ne,se,sw,nw)的方式进行存储
     */
    private String radius_7;

    private String radius_10;

    private String radius_12;

    private float wind_speed;

    private String wind_direction;

    private float wind_speed_max;

    /**
     * 当typhoon_id==20 typhoon_name==nameless时 存入nameless_id
     */
    private int nameless_id;


    @Override
    public String toString() {
        return "typhoon_id:" + typhoon_id + " / " + "obs_time:" + obs_time + " / " + "pre_time:" + pre_time + " / " +
                "forecast_org:" + forecast_org + " / " + "lon:" + lon + " / " + "lat:" + lat + " / " +
                "central_pressure:" + central_pressure + " / " + "central_lon:" + central_lon + " / " + "central_lat:" + central_lat + " / " +
                "radius_7:" + radius_7 + " / " + "radius_10:" + radius_10 + " / " + "radius_12:" + radius_12 + " / " +
                "wind_speed:" + wind_speed + " / " + "wind_direction:" + wind_direction + " / " + "wind_speed_max:" + wind_speed_max + " / \n";
    }

    public int getTyphoon_id() {
        return typhoon_id;
    }

    public void setTyphoon_id(int typhoon_id) {
        this.typhoon_id = typhoon_id;
    }

    public String getObs_time() {
        return obs_time;
    }

    public void setObs_time(String obs_time) {
        this.obs_time = obs_time;
    }

    public String getPre_time() {
        return pre_time;
    }

    public void setPre_time(String pre_time) {
        this.pre_time = pre_time;
    }

    public String getForecast_org() {
        return forecast_org;
    }

    public void setForecast_org(String forecast_org) {
        this.forecast_org = forecast_org;
    }

    public float getLon() {
        return lon;
    }

    public void setLon(float lon) {
        this.lon = lon;
    }

    public float getLat() {
        return lat;
    }

    public void setLat(float lat) {
        this.lat = lat;
    }

    public float getCentral_pressure() {
        return central_pressure;
    }

    public void setCentral_pressure(float central_pressure) {
        this.central_pressure = central_pressure;
    }

    public float getCentral_lon() {
        return central_lon;
    }

    public void setCentral_lon(float central_lon) {
        this.central_lon = central_lon;
    }

    public float getCentral_lat() {
        return central_lat;
    }

    public void setCentral_lat(float central_lat) {
        this.central_lat = central_lat;
    }

    public String getRadius_7() {
        return radius_7;
    }

    public void setRadius_7(String radius_7) {
        this.radius_7 = radius_7;
    }

    public String getRadius_10() {
        return radius_10;
    }

    public void setRadius_10(String radius_10) {
        this.radius_10 = radius_10;
    }

    public String getRadius_12() {
        return radius_12;
    }

    public void setRadius_12(String radius_12) {
        this.radius_12 = radius_12;
    }

    public float getWind_speed() {
        return wind_speed;
    }

    public void setWind_speed(float wind_speed) {
        this.wind_speed = wind_speed;
    }

    public String getWind_direction() {
        return wind_direction;
    }

    public void setWind_direction(String wind_direction) {
        this.wind_direction = wind_direction;
    }

    public float getWind_speed_max() {
        return wind_speed_max;
    }

    public void setWind_speed_max(float wind_speed_max) {
        this.wind_speed_max = wind_speed_max;
    }

    public int getNameless_id() {
        return nameless_id;
    }

    public void setNameless_id(int nameless_id) {
        this.nameless_id = nameless_id;
    }
}
