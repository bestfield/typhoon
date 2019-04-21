package com.field.typhoondata.entity;

public class TyphoonLive {
    /**
     * PK
     */
    private int typhoon_id;

    private String typhoon_name;

    /**
     * PK
     */
    private String obs_time;

    private float lon;

    private float lat;

    private float central_pressure;

    private float wind_power;

    private String move_direction;

    private float move_speed;

    /**
     * !!新增
     */
    private String grade;

    /**
     * 风圈半径以(ne,se,sw,nw)的方式进行存储
     */
    private String radius_7;

    private String radius_10;

    private String radius_12;

    /**
     * 当typhoon_id==20 typhoon_name==nameless时 存入nameless_id
     */
    private int nameless_id;

    private TyphoonForecast typhoonForecast;


    public int getTyphoon_id() {
        return typhoon_id;
    }

    public void setTyphoon_id(int typhoon_id) {
        this.typhoon_id = typhoon_id;
    }

    public String getTyphoon_name() {
        return typhoon_name;
    }

    public void setTyphoon_name(String typhoon_name) {
        this.typhoon_name = typhoon_name;
    }

    public String getObs_time() {
        return obs_time;
    }

    public void setObs_time(String obs_time) {
        this.obs_time = obs_time;
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

    public float getWind_power() {
        return wind_power;
    }

    public void setWind_power(float wind_power) {
        this.wind_power = wind_power;
    }

    public String getMove_direction() {
        return move_direction;
    }

    public void setMove_direction(String move_direction) {
        this.move_direction = move_direction;
    }

    public float getMove_speed() {
        return move_speed;
    }

    public void setMove_speed(float move_speed) {
        this.move_speed = move_speed;
    }

    public String getGrade() {
        return grade;
    }

    public void setGrade(String grade) {
        this.grade = grade;
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

    public TyphoonForecast getTyphoonForecast() {
        return typhoonForecast;
    }

    public void setTyphoonForecast(TyphoonForecast typhoonForecast) {
        this.typhoonForecast = typhoonForecast;
    }

    public int getNameless_id() {
        return nameless_id;
    }

    public void setNameless_id(int nameless_id) {
        this.nameless_id = nameless_id;
    }
}
