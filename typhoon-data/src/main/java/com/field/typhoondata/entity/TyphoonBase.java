package com.field.typhoondata.entity;

/**
 * Created by Tian.Ye in 16:01 2019/3/12
 */
public class TyphoonBase {
    /** PK*/
    private int typhoon_id;

    /** 英文名*/
    private String typhoon_name;

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
}
