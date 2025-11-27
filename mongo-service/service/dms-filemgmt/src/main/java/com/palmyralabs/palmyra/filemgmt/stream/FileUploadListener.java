package com.palmyralabs.palmyra.filemgmt.stream;

public interface FileUploadListener {

	public void onSuccess(String filePath);

	public void onFailure(Throwable e);

}
