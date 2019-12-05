package com.booledata.llspringparent.utils.enums;
 
public enum LoginState {
	//
	USER_NOT_EXISTS("用户信息不存在"),

	SUCCESS("成功"),//成功
	FAIL( "失败");//失败


	private String txt;
	LoginState(String txt) {
	   this.setTxt(txt);
    }   
	public String getTxt() {
		return txt;
	}
	public void setTxt(String txt) {
		this.txt = txt;
	}   
}
