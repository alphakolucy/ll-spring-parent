package com.booledata.llspringparent.model.springPoint.response;

import com.booledata.llspringparent.model.Image;
import com.booledata.llspringparent.model.springPoint.SpringPointPic;
import lombok.Data;

/**
* @author xlr
* @description
* @date 2019/10/17
**/
@Data
public class RespondAuth {


    private Integer code;

    private String message;

    public RespondAuth(Integer code, String message) {
        this.code = code;
        this.message = message;
    }


}
