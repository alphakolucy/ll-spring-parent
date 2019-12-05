package com.booledata.llspringparent.model.springPoint.response;

import com.booledata.llspringparent.model.Image;
import com.booledata.llspringparent.model.springPoint.SpringPicFile;
import com.booledata.llspringparent.model.springPoint.SpringPointPic;
import lombok.Data;

/**
* @author xlr
* @description
* @date 2019/10/17
**/
@Data
public class RespondSpringPicFile {

    private SpringPicFile springPicFile;

    private Image image;

    private int code;


}
