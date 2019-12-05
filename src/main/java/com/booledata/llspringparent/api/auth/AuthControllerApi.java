package com.booledata.llspringparent.api.auth;


import com.booledata.llspringparent.common.model.response.ResponseResult;
import com.booledata.llspringparent.model.springPoint.response.RespondAuth;
import com.booledata.llspringparent.model.ucenter.request.LoginRequest;
import com.booledata.llspringparent.model.ucenter.response.JwtResult;
import com.booledata.llspringparent.model.ucenter.response.LoginResult;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.http.ResponseEntity;

/**
 * @author Administrator
 * @date 2019/10/11
 **/
@Api(value = "用户认证", tags = {"用户认证接口"})
public interface AuthControllerApi {
    @ApiOperation("登录")
    public RespondAuth login(LoginRequest loginRequest);

    @ApiOperation("退出--暂未启用")
    public ResponseResult logout();

    @ApiOperation("注册")
    ResponseResult signIn(LoginRequest loginRequest);

    @ApiOperation("查询用户jwt令牌--暂未启用")
    public JwtResult userjwt();
}
