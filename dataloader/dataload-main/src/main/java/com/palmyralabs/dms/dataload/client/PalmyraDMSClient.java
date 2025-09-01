package com.palmyralabs.dms.dataload.client;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
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
	private final PalmyraClient<PolicyModel, Integer> client;
	
	public PalmyraDMSClient(String baseUrl, String context) {
		this.baseURL = baseUrl;
		this.clientFactory = new PalmyraClientFactoryImpl(baseURL, context);
		this.client = this.clientFactory.getClient(PolicyModel.class);
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
	
	public PolicyModel save(PolicyModel policy) throws IOException {
		return client.save(policy);		
	}
	
	public void uploadFile(Integer policyId, Integer docketTypeId,String policyNumber,PalmyraDMSClient client) throws IOException{
		
		String url = baseURL + "/palmyra/policy/{policyId}/docketType/{docketTypeId}/file";
		HashMap<String, Object> request = new HashMap<String, Object>();
		request.put("policyId", policyId.toString());
		request.put("docketTypeId", docketTypeId.toString());
		
		Path path = Paths.get("/home/palmyra/suresh",  policyNumber, "597934126~correspondence~FeapDocument~correspondence~175313078" + ".txt");
		
		StringResponseHandler handler = new StringResponseHandler(url);
		String response = post(url, request, handler);
		System.out.println(response);
	}
	
	
	public List<PolicyModel> getPolicyByNumber(String policyNumber) throws IOException {		
		FilterCriteria criteria = new FilterCriteria();
		criteria.addCriteria("policyNumber", policyNumber);
		ResultSet<PolicyModel> result = client.query(criteria);
		return result.getResult();
	}
	
	@Override
	protected void setAuthentication(HttpMessage request) {
				
	}

}
