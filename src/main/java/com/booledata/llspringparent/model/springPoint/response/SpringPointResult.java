package com.booledata.llspringparent.model.springPoint.response;

import com.booledata.llspringparent.common.model.response.ResponseResult;
import com.booledata.llspringparent.common.model.response.ResultCode;
//import com.booledata.llspringparent.model.springPointInfo.SpringPointInfo;
import com.booledata.llspringparent.model.springPoint.SpringPointInfo;
import org.springframework.data.domain.Page;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.ToString;

@Data
@ToString
public class SpringPointResult extends ResponseResult {

    @ApiModelProperty(value = "温泉点信息", example = "true", required = true)
    Page<SpringPointInfo> springPoints;
    @ApiModelProperty(value = "温泉点列表", example = "true", required = true)
    SpringPointInfo springPointInfo;

    private int code;
    public SpringPointResult() {
    }

    public SpringPointResult(int code) {
        this.code = code;
    }

    public SpringPointResult(Page<SpringPointInfo> springPoints, int code) {
        this.springPoints = springPoints;
        this.code = code;
    }

    public SpringPointResult(SpringPointInfo springPointInfo, int code) {
        this.springPointInfo = springPointInfo;
        this.code = code;
    }

    public SpringPointResult(ResultCode resultCode, SpringPointInfo springPointInfo) {
        super(resultCode);
        this.springPointInfo = springPointInfo;
    }
}
