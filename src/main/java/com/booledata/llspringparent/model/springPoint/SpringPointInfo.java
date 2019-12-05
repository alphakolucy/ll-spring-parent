package com.booledata.llspringparent.model.springPoint;

//import com.gitee.sunchenbin.mybatis.actable.annotation.Column;
//import com.gitee.sunchenbin.mybatis.actable.constants.MySqlTypeConstant;

//import com.gitee.sunchenbin.mybatis.actable.annotation.Table;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;
import org.hibernate.annotations.*;

import org.hibernate.annotations.Generated;
import org.hibernate.validator.constraints.NotBlank;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.ForeignKey;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

/**
* @author xlr
* @date 2019/9/27
**/

@Entity
@Table(name = "spring_point")
@Data
public class SpringPointInfo implements Serializable {
    private static final long serialVersionUID = 9102962457482172463L;


//    @OneToMany(mappedBy = "springPointInfo",cascade=CascadeType.ALL,fetch=FetchType.EAGER)
////    @JoinColumn(name = "pid",foreignKey = @ForeignKey(name = "none", value = ConstraintMode.NO_CONSTRAINT))
//    private List<SpringPointPic> springPointPics;


    @OneToOne(cascade=CascadeType.ALL,fetch=FetchType.EAGER)
    @JoinColumn(name = "typeId",foreignKey = @ForeignKey(name = "none", value = ConstraintMode.NO_CONSTRAINT))
    @NotFound(action= NotFoundAction.IGNORE)
    private SpringPointType springPointType;


//    @OneToMany(cascade = CascadeType.MERGE, fetch = FetchType.EAGER)
//    @JoinColumn(name = "pic_url",referencedColumnName = "codeNumber", foreignKey = @ForeignKey(name = "none", value = ConstraintMode.NO_CONSTRAINT))
//    private SpringPointPic springPointPicList;  //url

    @Id
    @GeneratedValue(generator = "identifier", strategy = GenerationType.IDENTITY)
    @GenericGenerator(name = "identifier", strategy = "uuid")
    @Column(nullable = false, length = 32, unique = true)
    private String id;


    @Column(columnDefinition = "datetime default now()")
    @Generated(GenerationTime.INSERT)
    @JsonFormat(timezone = "GMT+8", pattern = "yyyy-MM-dd HH:mm:ss")
    @DateTimeFormat(pattern = "yyyy-MM-dd hh:mm:ss")
    private Date createTime;

    //编号
    @NotNull(message = "codeNumber不能为空")
    @Column(nullable = false, length = 20,unique = true)
    private String codeNumber;


    //位置名称
//    @NotBlank(message = "address不能为空")
    @Column(nullable = false, length = 50)
    private String address;
    //x轴
//    @NotNull(message = "x不能为空")
    @Column(nullable = false, length = 20)
    private Double x;
    //y轴
    @Column(nullable = false, length = 20)
    private Double y;
    @Column( length = 20)
    private Double realX;
    //y轴
    @Column(length = 20)
    private Double realY;
    //z轴
    @Column(nullable = false, length = 20)
    private Double z;
    //孔深
    @Column(nullable = false, length = 20)
    private Double holeDepth;
    //ph值
    @Column(nullable = false, length = 11)
    private String ph;
    //水温
    @Column(nullable = false, length = 11)
    private Double waterTemperature;
    //涌水量
    @Column(nullable = false, length = 11)
    private String waterInflow;
    //开孔/出露层位
    @Column(nullable = false, length = 11)
    private String trepanning;
    //出水段
    @Column(nullable = false, length = 11)
    private String waterOutlet;
    //溶解性总固体
    @Column(nullable = false, length = 20)
    private Double dissolvedSolids;
    //二氧化碳
    @Column(nullable = false, length = 20)
    private Double co2;
    //总硫化氢
    @Column(nullable = false, length = 20)
    private Double hydrothion;
    //偏硅酸
    @Column(nullable = false, length = 20)
    private Double hsio;
    //偏硼酸
    @Column(nullable = false, length = 20)
    private Double hbo2;
    //溴
    @Column(nullable = false, length = 20)
    private Double br2;
    //碘
    @Column(nullable = false, length = 20)
    private Double i2;
    //总铁
    @Column(nullable = false, length = 20)
    private Double fe;
    // 砷
    @Column(nullable = false, length = 20)
    private Double asa;
    //氡
    @Column(nullable = false, length = 20)
    private Double rn;
    //水化学类型
    @Column(nullable = false, length = 20)
    private String hydrochemicalType;

    //热储单元
    @Column(nullable = false,length = 11)
    private String reservoirUnit;


    /**
     * ----四种状态----
     * 正常（符合理疗指标为红色、不符合为灰色）
     * 施工中（绿色）
     * 无资料（黄色）
     * 废弃（黑色）
     */
    @Column(nullable = false,length = 11)
    private String status;

    //温泉点类型：理疗温泉  地热井
    @Column( length = 10)
    private Integer pointCategory;

    //温泉地区流行病学调查
    @Column(nullable = false,length = 11)
    private String epidemiologicalSurvey;

    //温泉理疗功效干预实验
    @Column(nullable = false,length = 11)
    private String efficacyInterventionExperiment;

    //理疗温泉成因解剖
    @Column(nullable = false,length = 11)
    private String geneticDissection;

//    public Double getRealX() {
//        return this.x/500;
//    }
//
//    public void setRealX(Double realX) {
//        this.realX = this.x/500;
//    }
//
//    public Double getRealY() {
//        return this.y/500;
//    }
//
//    public void setRealY(Double realY) {
//        this.realY = realY;
//    }
}


