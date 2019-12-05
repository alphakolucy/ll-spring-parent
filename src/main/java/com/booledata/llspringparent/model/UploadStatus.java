package com.booledata.llspringparent.model;

public class UploadStatus {
	
	private String name;
	
	private String status;
	
	private Long size;
	
	private String downloadURL;
	private String fileURL;
	private String imgURL; 

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}  

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Long getSize() {
		return size;
	}

	public void setSize(Long size) {
		this.size = size;
	}

	public String getDownloadURL() {
		return downloadURL;
	}

	public void setDownloadURL(String downloadURL) {
		this.downloadURL = downloadURL;
	}

	public String getFileURL() {
		return fileURL;
	}

	public void setFileURL(String fileURL) {
		this.fileURL = fileURL;
	}

	public String getImgURL() {
		return imgURL;
	}

	public void setImgURL(String imgURL) {
		this.imgURL = imgURL;
	}
}
