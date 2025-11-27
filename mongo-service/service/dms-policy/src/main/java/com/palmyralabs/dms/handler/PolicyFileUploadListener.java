package com.palmyralabs.dms.handler;

import com.palmyralabs.palmyra.filemgmt.stream.FileUploadListener;

import lombok.SneakyThrows;

public class PolicyFileUploadListener implements FileUploadListener{

	@Override
	public void onSuccess(String filePath) {
		
	}

	@Override
	@SneakyThrows
	public void onFailure(Throwable e) {
		throw e;
	}

}
