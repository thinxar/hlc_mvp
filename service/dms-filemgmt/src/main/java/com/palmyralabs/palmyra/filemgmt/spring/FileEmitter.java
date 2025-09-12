package com.palmyralabs.palmyra.filemgmt.spring;

import java.io.IOException;

public interface FileEmitter {

	void completeWithError(Throwable t);

	void setContentType(String contentType);

	void send(byte[] buffer, int bufferSize) throws IOException;

	void complete();

}
