package com.palmyralabs.dms.masterdata.handler;

import java.util.Map;
import java.util.Map.Entry;

import org.springframework.beans.factory.annotation.Autowired;

import com.palmyralabs.palmyra.base.FilterCriteria;
import com.palmyralabs.palmyra.handlers.HandlerContext;
import com.palmyralabs.palmyra.handlers.PreProcessor;
import com.zitlab.palmyra.common.util.TextUtil;
import com.zitlab.palmyra.store.Tuple;
import com.zitlab.palmyra.store.base.security.ACLRights;
import com.zitlab.palmyra.store.base.security.AuthProvider;

public abstract class AbstractRefHandler implements PreProcessor {
	private AuthProvider userProvider;

	public void aclCheck(FilterCriteria criteria, Map<String, String> map) {

	}

	@Override
	public final int aclCheck(Tuple item, HandlerContext ctx) {
		return ACLRights.ALL;
	}
	
	@Override
	public Tuple preProcess(Tuple data, HandlerContext ctx) {
		Map<String, String> inputs = ctx.getParams();
		if (null != inputs) {
			for (Entry<String, String> entry : inputs.entrySet()) {
				String eKey = entry.getKey();
				if (TextUtil.contains(eKey, '_')) {
					String key = TextUtil.replaceAll(entry.getKey(), '_', '.');
					data.setParentAttribute(key, entry.getValue());
				} else {
					data.setAttribute(eKey, entry.getValue());
				}
			}
		}
		return PreProcessor.super.preProcess(data, ctx);
	}

	public void preProcess(FilterCriteria criteria, HandlerContext ctx) {
		Map<String, String> inputs = ctx.getParams();
		if (null != inputs) {
			for (Entry<String, String> entry : inputs.entrySet()) {
				String eKey = entry.getKey();
				if (TextUtil.contains(eKey, '_')) {
					String key = TextUtil.replaceAll(entry.getKey(), '_', '.');
					criteria.addRefCriteria(key, entry.getValue());
				} else {
					criteria.addCriteria(eKey, entry.getValue());
				}
			}
		}
	}

	public void preApplyCriteria(FilterCriteria criteria, HandlerContext ctx) {
		Map<String, String> inputs = ctx.getParams();
		if (null != inputs) {
			for (Entry<String, String> entry : inputs.entrySet()) {
				String eKey = entry.getKey();
				if (TextUtil.contains(eKey, '_')) {
					String key = TextUtil.replaceAll(entry.getKey(), '_', '.');
					criteria.addRefCriteria(key, entry.getValue());
				} else {
					criteria.addCriteria(eKey, entry.getValue());
				}
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
