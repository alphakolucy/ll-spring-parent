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
public class JwtResult extends ResponseResult {
    public JwtResult(ResultCode resultCode, String jwt) {
        super(resultCode);
        this.jwt = jwt;
    }
    private String jwt;
}
