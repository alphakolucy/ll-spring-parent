package com.booledata.llspringparent.utils;


import com.booledata.llspringparent.utils.enums.LoginState;
import com.booledata.llspringparent.utils.enums.OutputState;

public class HttpStatusContent {
    private String message;

    private Integer code;

    public HttpStatusContent(OutputState state) {
    	this.message = state.getTxt();
	}
    
    public HttpStatusContent(OutputState state, String msg) {
		// TODO Auto-generated constructor stub  
    	this.message = msg;
	}
    public HttpStatusContent(LoginState state, String msg) {
        // TODO Auto-generated constructor stub
        this.message = msg;
    }
    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
