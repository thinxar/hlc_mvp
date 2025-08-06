package com.palmyralabs.dms.masterdata.handler;

import java.util.Map;
import java.util.Map.Entry;

import org.springframework.beans.factory.annotation.Autowired;

import com.palmyralabs.palmyra.base.FilterCriteria;
import com.palmyralabs.palmyra.handlers.HandlerContext;
import com.palmyralabs.palmyra.handlers.PreProcessor;
import com.zitlab.palmyra.store.Tuple;
import com.zitlab.palmyra.store.base.security.ACLRights;
import com.zitlab.palmyra.store.base.security.AuthProvider;

public abstract class AbstractHandler implements PreProcessor {
	private AuthProvider userProvider;

	public void aclCheck(FilterCriteria criteria, Map<String, String> map) {

	}

	@Override
	public final int aclCheck(Tuple item, HandlerContext ctx) {
		return ACLRights.ALL;
	}

	public void preProcess(FilterCriteria criteria, HandlerContext ctx) {
		Map<String, String> inputs = ctx.getParams();
		if (null != inputs) {
			for (Entry<String, String> entry : inputs.entrySet()) {
				if (!entry.getKey().equalsIgnoreCase("org"))
					criteria.addCriteria(entry.getKey(), entry.getValue());
			}
		}
	}

	@Override
	public Tuple preProcess(Tuple data, HandlerContext ctx) {
		Map<String, String> inputs = ctx.getParams();
		if (null != inputs) {
			for (Entry<String, String> entry : inputs.entrySet()) {
				data.set(entry.getKey(), entry.getValue());
			}
		}
		return data;
	}
	
	public void preApplyCriteria(FilterCriteria criteria, HandlerContext ctx) {
		Map<String, String> inputs = ctx.getParams();
		if (null != inputs) {
			for (Entry<String, String> entry : inputs.entrySet()) {
				if (!entry.getKey().equalsIgnoreCase("org"))
					criteria.addCriteria(entry.getKey(), entry.getValue());
			}
		}
	}

	@Autowired
	public void setUserProvider(AuthProvider userProvider) {
		this.userProvider = userProvider;
	}

	protected String getUser() {
		return userProvider.getUser();
	}
}
