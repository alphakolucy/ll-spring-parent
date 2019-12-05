package com.booledata.llspringparent.model.ucenter.response;

import com.booledata.llspringparent.common.model.response.ResponseResult;
import com.booledata.llspringparent.common.model.response.ResultCode;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

/**
 * Created by xlr on 2019/09/26.
 */
@Data
@ToString
@NoArgsConstructor
public class LoginResult extends ResponseResult {
    public LoginResult(ResultCode resultCode, String token) {
        super(resultCode);
        this.token = token;
    }
    private String token;
}
