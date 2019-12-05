package com.booledata.llspringparent.utils.enums;

public enum StatusState {
	//
	NORMAL(40001, "正常"),
	CONSTRUCTION(40002, "施工中"),
	NODATA(40003, "无资料"),
	ABANDON(40004, "废弃");





	private Integer value;
	private String txt;

	StatusState(Integer value, String txt) {
		this.setValue(value);
		this.setTxt(txt);
	}

	public Integer getValue() {
		return value;
	}

	public void setValue(Integer value) {
		this.value = value;
	}

	public String getTxt() {
		return txt;
	}

	public void setTxt(String txt) {
		this.txt = txt;
	}
}
