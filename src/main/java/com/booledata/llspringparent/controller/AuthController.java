package com.booledata.llspringparent.controller;

import com.booledata.llspringparent.api.auth.AuthControllerApi;
import com.booledata.llspringparent.common.exception.ExceptionCast;
import com.booledata.llspringparent.common.model.response.CommonCode;
import com.booledata.llspringparent.common.model.response.ResponseResult;
import com.booledata.llspringparent.dao.SpringUserRepository;
import com.booledata.llspringparent.model.springPoint.response.RespondAuth;
import com.booledata.llspringparent.model.ucenter.ext.AuthToken;
import com.booledata.llspringparent.model.ucenter.request.LoginRequest;
import com.booledata.llspringparent.model.ucenter.response.AuthCode;
import com.booledata.llspringparent.model.ucenter.response.JwtResult;
import com.booledata.llspringparent.model.ucenter.response.LoginResult;
import com.booledata.llspringparent.service.AuthService;
import io.swagger.annotations.Api;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/")
public class AuthController implements AuthControllerApi {


    @Autowired
    private AuthService authService;

    @Autowired
    private SpringUserRepository springUserRepository;


    @Override
    @PostMapping("userLogin")
    public RespondAuth login(LoginRequest loginRequest) {
        if (loginRequest == null || StringUtils.isEmpty(loginRequest.getUsername())) {
            ExceptionCast.cast(AuthCode.AUTH_USERNAME_NONE);
        }
        if (loginRequest == null || StringUtils.isEmpty(loginRequest.getPassword())) {
            ExceptionCast.cast(AuthCode.AUTH_PASSWORD_NONE);
        }
//        //账号
//        String username = loginRequest.getUsername();
//        //密码
//        String password = loginRequest.getPassword();

        //验证账密
//         authService.login(loginRequest);

        //用户身份令牌
//        String access_token = authToken.getAccess_token();
        //将令牌存储到cookie
//        this.saveCookie(access_token);

        return authService.login(loginRequest);
    }

    @Override
    @PostMapping("/userLogout")
    public ResponseResult logout() {
        return new ResponseResult(CommonCode.SUCCESS);
    }

    @Override
    @PostMapping("/userSignIn")
    public ResponseResult signIn(LoginRequest loginRequest) {
        LoginRequest save = springUserRepository.save(loginRequest);
        if (save==null){
            return new ResponseResult(CommonCode.INVALID_PARAM);
        }else{
            return new ResponseResult(CommonCode.SUCCESS);
        }

    }


    @Override
    @GetMapping("/getJwt")
    public JwtResult userjwt() {
        return null;
    }
}
