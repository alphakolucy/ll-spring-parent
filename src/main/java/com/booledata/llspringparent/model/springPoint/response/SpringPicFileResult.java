package com.booledata.llspringparent.model.springPoint.response;

import com.booledata.llspringparent.common.model.response.ResponseResult;
import com.booledata.llspringparent.common.model.response.ResultCode;
import com.booledata.llspringparent.model.springPoint.SpringPicFile;
import com.booledata.llspringparent.model.springPoint.SpringPointInfo;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.ToString;
import org.springframework.data.domain.Page;

import java.util.List;

//import com.booledata.llspringparent.model.springPointInfo.SpringPointInfo;

@Data
@ToString
public class SpringPicFileResult extends ResponseResult {

    @ApiModelProperty(value = "温泉点图片信息（分页）", example = "true", required = true)
    Page<SpringPicFile> springPicFiles;
    @ApiModelProperty(value = "温泉点图片信息", example = "true", required = true)
    SpringPicFile springPicFile;

    @ApiModelProperty(value = "温泉点图片列表", example = "true", required = true)
    List<SpringPicFile> springPicFileList;

    private int code;
    public SpringPicFileResult() {
    }

    public SpringPicFileResult(int code) {
        this.code = code;
    }




    public SpringPicFileResult(List<SpringPicFile> springPicFileList, int code) {
        this.springPicFileList = springPicFileList;
        this.code = code;
    }

    public SpringPicFileResult(Page<SpringPicFile> springPicFiles, int code) {
        this.springPicFiles = springPicFiles;
        this.code = code;
    }

    public SpringPicFileResult(ResultCode resultCode, List<SpringPicFile> springPicFileList, int code) {
        super(resultCode);
        this.springPicFileList = springPicFileList;
        this.code = code;
    }
}
