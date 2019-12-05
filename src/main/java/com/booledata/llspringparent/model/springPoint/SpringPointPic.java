package com.booledata.llspringparent.model.springPoint;

import com.booledata.llspringparent.utils.enums.PicState;
import com.booledata.llspringparent.utils.enums.PointType;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import org.hibernate.annotations.Generated;
import org.hibernate.annotations.GenerationTime;
import org.hibernate.annotations.GenericGenerator;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;

/**
* @author xlr
* @description 温泉点照片
* @date 2019/10/15
**/
@Entity
@Data
@Table(name = "spring_pointpic")
public class SpringPointPic implements Serializable {
    private static final long serialVersionUID = -558096895794728691L;


//    @ManyToOne(cascade = CascadeType.MERGE, fetch = FetchType.EAGER)
//    @JoinColumn(name = "point_codenumber",referencedColumnName = "codeNumber", foreignKey = @ForeignKey(name = "none", value = ConstraintMode.NO_CONSTRAINT))
//    private SpringPointInfo springPointInfo;  //所属点


//    @ManyToOne(cascade={CascadeType.MERGE,CascadeType.REFRESH})//可选属性optional=false,表示author不能为空。删除文章，不影响用户
//    @JoinColumn(name="point_id")//设置在article表中的关联字段(外键)
//    private SpringPointInfo springPointInfo;//所属作者

    @Id
    @GeneratedValue(generator = "system-uuid")
    @GenericGenerator(name = "system-uuid", strategy = "uuid")
    @Column(nullable=false,length=32, unique = true)
    private String pid;


    @Column(nullable = false, length = 255)
    private String url;


    @Column(nullable = false, length = 20)
    private Integer picState;


    @Column(columnDefinition = "datetime default now()")
    @Generated(GenerationTime.INSERT)
    @JsonFormat(timezone = "GMT+8", pattern = "yyyy-MM-dd HH:mm:ss")
    @DateTimeFormat(pattern = "yyyy-MM-dd hh:mm:ss")
    private Date createTime;

    @Column(nullable = false, length = 255)
    private String filePath;

    @Column(nullable = false, length = 255)
    private String pointId;



    @Column(length = 100)
    private String fileName;

    //处理状态txt
    public String getPointTypeTxt(){
        if(this.getPicState()!=null){
            return PointType.getTxtByValue(this.getPicState());
        }
        return null;
    }




    public Integer getPicState() {
        return picState;
    }

    public void setPicState(Integer picState) {
        this.picState = picState;
    }

    //类型状态txt
    public String getPicStateTxt(){
        if(this.getPicState() != null){
            return PicState.getTxtByValue(this.getPicState());
        }
        return null;
    }

    public String getPid() {
        return pid;
    }

    public void setPid(String pid) {
        this.pid = pid;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

//    public SpringPointInfo getSpringPointInfo() {
//        return springPointInfo;
//    }
//
//    public void setSpringPointInfo(SpringPointInfo springPointInfo) {
//        this.springPointInfo = springPointInfo;
//    }
}
