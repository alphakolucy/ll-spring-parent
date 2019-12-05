package com.booledata.llspringparent.common.exception;


import com.booledata.llspringparent.common.model.response.ResultCode;

/**
 * @author xlr
 * @version 1.0
 * @create 2019-09-26
 **/
public class ExceptionCast {

    public static void cast(ResultCode resultCode){
        throw new CustomException(resultCode);
    }
}
