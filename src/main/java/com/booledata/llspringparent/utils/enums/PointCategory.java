package com.booledata.llspringparent.utils.enums;


import com.booledata.llspringparent.utils.EmptyUtil;

/**
* @author xlr
* @description 温泉点种类
* @date 2019/10/15
**/
public enum PointCategory {
    //天然温泉，地热井状态
    // 关键字：pointCategory
    S(30001, "天然温泉"),
    SBDB(-30002, "不达标温泉"),
    SWZL(-30003, "无资料温泉"),
    SFQ(-30004, "废弃温泉"),
    DR(30005, "地热井"),
    DRSGZ(30006, "施工中地热井"),
    DRBDB(-30007, "不达标地热"),
    DRFQ(-30008, "废弃地热井"),
    DRWZL(-30009, "无资料地热井"),
    //理疗指标状态
    //关键字； llStatus
    LLGXYJD(30010,"理疗功效研究点"),
    SGZRKSZK(30011,"成因解剖研究点"),
    //只需要显示 不需要图例
    BOTHLLCY(30012,"理疗功效成因解刨"),
    NCANCEL(-30012,"录入编号异常");


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