package com.booledata.llspringparent.model;

import com.alibaba.fastjson.JSONObject;

import java.io.Serializable;

public class Image implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = -8629259512297089342L;
	 
	 
	private String imageName; 
	  
	private String imageType;
	
	private JSONObject content;


	private String imageUrl;

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getImageName() {
		return imageName;
	}

	public void setImageName(String imageName) {
		this.imageName = imageName;
	}

	public String getImageType() {
		return imageType;
	}

	public void setImageType(String imageType) {
		this.imageType = imageType;
	}

	public JSONObject getContent() {
		return content;
	}

	public void setContent(JSONObject jsonObject) {
		this.content = jsonObject;
	}  
}
