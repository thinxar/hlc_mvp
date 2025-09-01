package com.palmyralabs.dms.dataload.client;

import java.io.IOException;

import org.apache.hc.core5.http.ClassicHttpResponse;
import org.apache.hc.core5.http.HttpEntity;
import org.apache.hc.core5.http.HttpException;
import org.apache.hc.core5.http.io.entity.EntityUtils;

import com.palmyralabs.palmyra.client.impl.AbstractResponseHandler;

public class StringResponseHandler extends AbstractResponseHandler<String>{

	public StringResponseHandler(String url) {
		super(url);		
	}

	@Override
	public String handleResponse(ClassicHttpResponse response) throws HttpException, IOException {
		HttpEntity entity = processHttpCode(response);
		if (null != entity) {
			return EntityUtils.toString(entity);			
		}
		return null;
	}

}
