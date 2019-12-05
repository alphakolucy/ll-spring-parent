package com.booledata.llspringparent.model.springPoint;


import com.booledata.llspringparent.utils.enums.PackageState;
import com.booledata.llspringparent.utils.enums.PicState;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import org.hibernate.annotations.Generated;
import org.hibernate.annotations.GenerationTime;
import org.hibernate.annotations.GenericGenerator;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;
import java.util.Date;

/**
* @author xlr
* @description 上传图片历史数据
* @date 2019/10/25
**/
@Entity
@Table(name = "spring_picfile")
@Data
public class SpringPicFile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, length = 32, unique = true)
    private Integer id;

    @Column(nullable = false, length = 255)
    private String fileName;

    @Column(nullable = false, length = 255)
    private String pointId;

    @Column(nullable = false, length = 255)
    private String url;

    //照片才有
    @Column( length = 255)
    private String plottingScale;

    //附件才有
    @Column( length = 255)
    private Integer packageType;

    @Column(columnDefinition = "datetime default now()")
    @Generated(GenerationTime.INSERT)
    @JsonFormat(timezone = "GMT+8", pattern = "yyyy-MM-dd HH:mm:ss")
    @DateTimeFormat(pattern = "yyyy-MM-dd hh:mm:ss")
    private Date createTime;

    @Column(nullable = false, length = 20)
    private String codeNumber;

    @Column(nullable = false, length = 20)
    private Integer picState;

    @Column(length = 255)
    private String content;


    //类型状态txt
    public String getPicStateTxt(){
        if(this.getPicState() != null){
            return PicState.getTxtByValue(this.getPicState());
        }
        return null;
    }


    //附件分类状态txt
    public String getPackageStateTxt(){
        if(this.getPackageType() != null){
            return PackageState.getTxtByValue(this.getPackageType());
        }
        return null;
    }
}
