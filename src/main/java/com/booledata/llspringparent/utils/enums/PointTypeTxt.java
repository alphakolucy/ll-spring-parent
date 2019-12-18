package com.booledata.llspringparent.utils.enums;


import com.booledata.llspringparent.utils.EmptyUtil;

/**
* @author xlr
* @description 温泉点类型文本
* @date 2019/12/17
**/
public enum PointTypeTxt {
    //未处理  已处理  已完成  已取消
    KQS(50001, "TDS"),
    I(50002, "I-"),
    CO2(50003, "CO2"),
    FE(50004, "Fe2+ + Fe3+"),
    H2S(50005, "H2S+HS-"),
    AS(50006, "As"),
    H2SIO3(50007, "H2SiO3"),
    RN(50008, "222Rn"),
    HBO2(50009, "HBO2"),
    BR(50010, "Br-"),
    WATERTEMPERATURE(50011,"温度"),

    CANCEL(-50000,"已取消");

    private Integer value;
    private String txt;

    PointTypeTxt(Integer v, String txt) {
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
        for (PointTypeTxt state : values()) {
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
        for (PointTypeTxt e : PointTypeTxt.values()) {
            if (e.getValue().equals(value)) {
                return true;
            }
        }
        return false;
    }
}