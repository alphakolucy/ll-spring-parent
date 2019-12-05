package com.booledata.llspringparent.utils.enums;


import com.booledata.llspringparent.utils.EmptyUtil;

/**
* @author xlr
* @description 温泉点种类
* @date 2019/10/15
**/
public enum PointCategory {
    //天然温泉，地热井
    S(30001, "天然温泉"),
    DR(30002, "地热井"),
    SGZRKSZK(30003,"施工中热矿水钻孔"),

    SCANCEL(-30001,"不达标温泉"),
    DRCANCEL(-30002,"不达标地热"),
    NCANCEL(-30003,"其他"),
    WZL(-30004,"无资料"),
    FQ(-30005,"废弃");

    private Integer value;
    private String txt;

    PointCategory(Integer v, String txt) {
        this.value = v;
        this.txt = txt;
    }

    public Integer getValue() {
        return this.value;
    }

    public String getTxt() {
        return this.txt;
    }

    public static String getTxtByValue(Integer value) {
        for (PointCategory state : values()) {
            if (state.getValue().equals(value)) {
                return state.getTxt();
            }
        }
        return "";
    }

    /**
     * value是否存在此枚举中
     *
     * @param value 枚举value值
     * @return boolean
     */
    public static boolean isExist(Integer value) {
        if (EmptyUtil.isEmpty(value)) {
            return false;
        }
        for (PointCategory e : PointCategory.values()) {
            if (e.getValue().equals(value)) {
                return true;
            }
        }
        return false;
    }
}