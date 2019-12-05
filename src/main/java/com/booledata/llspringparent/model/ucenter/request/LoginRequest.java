package com.booledata.llspringparent.model.ucenter.request;


import com.booledata.llspringparent.common.model.request.RequestData;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import lombok.ToString;
import org.hibernate.annotations.Generated;
import org.hibernate.annotations.GenerationTime;
import org.hibernate.annotations.GenericGenerator;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.Date;

/**
 * Created by xlr on 2019/09/26.
 */
@Data
@Table(name = "spring_login")
@ToString
@Entity
public class LoginRequest extends RequestData {

    @Id
    @GeneratedValue(generator = "identifier", strategy = GenerationType.IDENTITY)
    @GenericGenerator(name = "identifier", strategy = "uuid")
    @Column(nullable = false, length = 32, unique = true)
    private String id;

    @NotNull(message = "username不能为空")
    @Column(nullable = false, length = 20,unique = true)
    String username;

    @NotNull(message = "password不能为空")
    @Column(nullable = false, length = 20,unique = true)
    String password;

    @Column(columnDefinition = "datetime default now()")
    @Generated(GenerationTime.INSERT)
    @JsonFormat(timezone = "GMT+8", pattern = "yyyy-MM-dd HH:mm:ss")
    @DateTimeFormat(pattern = "yyyy-MM-dd hh:mm:ss")
    private Date createTime;




//    String verifycode;

}
