package com.palmyralabs.dms.dataload.client;

import java.io.File;
import java.io.IOException;
import java.net.ConnectException;
import java.nio.file.Path;
import java.util.HashMap;
import java.util.List;

import org.apache.hc.client5.http.ClientProtocolException;
import org.apache.hc.client5.http.classic.methods.HttpPost;
import org.apache.hc.client5.http.entity.mime.HttpMultipartMode;
import org.apache.hc.client5.http.entity.mime.MultipartEntityBuilder;
import org.apache.hc.core5.http.ContentType;
import org.apache.hc.core5.http.HttpEntity;
import org.apache.hc.core5.http.HttpMessage;
import org.apache.hc.core5.http.HttpStatus;
import org.apache.tika.Tika;

import com.palmyralabs.dms.dataload.model.PolicyModel;
import com.palmyralabs.palmyra.client.PalmyraClient;
import com.palmyralabs.palmyra.client.PalmyraClientFactory;
import com.palmyralabs.palmyra.client.ResultSet;
import com.palmyralabs.palmyra.client.exception.ClientException;
import com.palmyralabs.palmyra.client.impl.BaseRestClient;
import com.palmyralabs.palmyra.client.impl.PalmyraClientFactoryImpl;
import com.palmyralabs.palmyra.client.pojo.FilterCriteria;

import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class PalmyraDMSClient extends BaseRestClient {

	private final String baseURL;
	Tika tika = new Tika();
	private final PalmyraClientFactory clientFactory;
	private final PalmyraClient<PolicyModel, Integer> client;

	@SneakyThrows
	public PalmyraDMSClient(String baseUrl, String context) {
		this.baseURL = baseUrl;
		this.clientFactory = new PalmyraClientFactoryImpl(baseURL, context);
		this.client = this.clientFactory.getClient(PolicyModel.class);
	}

	public void login(String username, String password) throws IOException {
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

	public void uploadFile(Integer policyId, Integer docketTypeId, Path filePath) throws IOException {

		String url = baseURL + "palmyra/policy/" + policyId + "/docketType/" + docketTypeId + "/file";

		uploadFile(url, filePath);
	}

	public String uploadFile(String url, Path filePath) throws IOException {
		MultipartEntityBuilder builder = MultipartEntityBuilder.create();
		builder.setMode(HttpMultipartMode.LEGACY);
		String mimeType = tika.detect(filePath);
		
		ContentType ct = ContentType.parse(mimeType);
		File f = filePath.toFile();
		builder.addBinaryBody("file", f,  ct, f.getName());
		final HttpEntity entity = builder.build();
		

		HttpPost httpPost = new HttpPost(url);
		httpPost.setEntity(entity);
		StringResponseHandler handler = new StringResponseHandler(url);
		try {
			return getClient().execute(httpPost, handler);

		} catch (ConnectException ce) {
			log.info("Server Connection refused !! - {}", ce.getMessage());
			throw new ClientException(HttpStatus.SC_SERVICE_UNAVAILABLE,
					"Server Connection refused !! Please check server reachability", ce);
		} catch (ClientProtocolException e1) {
			throw new ClientException(HttpStatus.SC_BAD_REQUEST, "Invalid protocol", e1);
		}
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
