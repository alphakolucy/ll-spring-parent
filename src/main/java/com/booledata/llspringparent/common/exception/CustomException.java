package com.booledata.llspringparent.common.exception;


import com.booledata.llspringparent.common.model.response.ResultCode;

/**
 * 自定义异常类型
 * @author xlr
 * @version 1.0
 * @create 2019-09-26
 **/
public class CustomException extends RuntimeException {

    //错误代码
    ResultCode resultCode;

    public CustomException(ResultCode resultCode){
        this.resultCode = resultCode;
    }
    public ResultCode getResultCode(){
        return resultCode;
    }


}
