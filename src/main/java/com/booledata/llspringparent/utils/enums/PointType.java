package com.booledata.llspringparent.utils.enums;


import com.booledata.llspringparent.utils.EmptyUtil;

/**
* @author xlr
* @description 温泉点类型
* @date 2019/10/15
**/
public enum PointType {
    //未处理  已处理  已完成  已取消
    KQS(20001, "矿泉水"),
    I(20002, "碘水"),
    CO2(20003, "碳酸水"),
    FE(20004, "铁水"),
    H2S(20005, "硫化氢水"),
    AS(20006, "砷水"),
    H2SIO3(20007, "硅酸水"),
    RN(20008, "氡水"),
    HBO2(20009, "硼酸水"),
    BR(20010, "溴水"),
    WATERTEMPERATURE(20011,"温泉水温"),

    CANCEL(-20000,"已取消");

    private Integer value;
    private String txt;

    PointType(Integer v, String txt) {
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
        for (PointType state : values()) {
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
        for (PointType e : PointType.values()) {
            if (e.getValue().equals(value)) {
                return true;
            }
        }
        return false;
    }
}