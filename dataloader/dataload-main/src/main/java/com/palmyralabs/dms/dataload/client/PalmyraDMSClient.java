package com.palmyralabs.dms.dataload.client;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;

import org.apache.hc.core5.http.HttpMessage;

import com.palmyralabs.dms.dataload.model.PolicyModel;
import com.palmyralabs.palmyra.client.PalmyraClient;
import com.palmyralabs.palmyra.client.PalmyraClientFactory;
import com.palmyralabs.palmyra.client.ResultSet;
import com.palmyralabs.palmyra.client.impl.BaseRestClient;
import com.palmyralabs.palmyra.client.impl.PalmyraClientFactoryImpl;
import com.palmyralabs.palmyra.client.pojo.FilterCriteria;

public class PalmyraDMSClient extends BaseRestClient{

	private final String baseURL;
	
	private final PalmyraClientFactory clientFactory;
	
	public PalmyraDMSClient(String baseUrl, String context) {
		this.baseURL = baseUrl;
		this.clientFactory = new PalmyraClientFactoryImpl(baseURL, context);
	}
	
	public void login(String username, String password) throws IOException{
		String url = baseURL + "auth/login";
		HashMap<String, String> request = new HashMap<String, String>();
		request.put("userName", username);
		request.put("password", password);
		
		StringResponseHandler handler = new StringResponseHandler(url);
		String response = post(url, request, handler);
		System.out.println(response);
	}
	
	public List<PolicyModel> getPolicyByNumber(String policyNumber) throws IOException {
		PalmyraClient<PolicyModel, Integer> client = this.clientFactory.getClient(PolicyModel.class);
		FilterCriteria criteria = new FilterCriteria();
		criteria.addCriteria("policyNumber", policyNumber);
		ResultSet<PolicyModel> result = client.query(criteria);
		return result.getResult();
	}
	
	@Override
	protected void setAuthentication(HttpMessage request) {
				
	}

}
