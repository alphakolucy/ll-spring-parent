package com.booledata.llspringparent.utils.enums;


import com.booledata.llspringparent.utils.EmptyUtil;

/**
* @author XLR
* @date 2019/10/11
**/
public enum PicState {
    //图片代码
    WZT(10001, "位置图"),
    DZT(10002, "地质图"),
    ZZT(10003, "柱状图/剖面图"),
    SZFX(10004,"水质分析"),
    CYMS(10005,"成因模式"),
    SCWJ(10006,"上传附件"),
    LLGX(10007,"理疗功效研究");

    private Integer value;
    private String txt;

    PicState(Integer v, String txt) {
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
        for (PicState state : values()) {
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
        for (PicState e : PicState.values()) {
            if (e.getValue().equals(value)) {
                return true;
            }
        }
        return false;
    }
}