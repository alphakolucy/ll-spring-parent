package com.booledata.llspringparent.model.ucenter.ext;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

/**
 * Created by xlr on 2019/09/26.
 */
@Data
@ToString
@NoArgsConstructor
public class UserBasicInfo {

    private String id;
    private String username;
    private String userpic;
    private String name;
    private String utype;
    //所属企业信息
    private String companyId;
    //jwt令牌
    private String jwt_token;

}
