//package com.booledata.llspringparent.model.ucenter;
//
//import lombok.Data;
//import lombok.ToString;
//import org.hibernate.annotations.GenericGenerator;
//
//import javax.persistence.*;
//import java.util.Date;
//
///**
// * Created by xlr on 2019/09/26.
// */
//@Data
//@ToString
//@Entity
//@Table(name="xc_user_role")
//@GenericGenerator(name = "jpa-uuid", strategy = "uuid")
//public class LlUserRole {
//
//    @Id
//    @GeneratedValue(generator = "jpa-uuid")
//    @Column(length = 32)
//    private String id;
//
//    @Column(name="user_id")
//    private String userId;
//    @Column(name="role_id")
//    private String roleId;
//    private String creator;
//    @Column(name="create_time")
//    private Date createTime;
//
//}
