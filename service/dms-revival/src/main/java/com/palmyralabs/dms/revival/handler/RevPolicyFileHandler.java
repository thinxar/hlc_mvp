package com.palmyralabs.dms.revival.handler;

import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import com.palmyralabs.dms.masterdata.handler.AbstractHandler;
import com.palmyralabs.dms.revival.model.RevPolicyFileModel;
import com.palmyralabs.palmyra.base.FilterCriteria;
import com.palmyralabs.palmyra.base.annotations.CrudMapping;
import com.palmyralabs.palmyra.handlers.HandlerContext;
import com.palmyralabs.palmyra.handlers.QueryHandler;
import com.palmyralabs.palmyra.handlers.ReadHandler;
import com.zitlab.palmyra.sqlbuilder.condition.Criteria;
import com.zitlab.palmyra.store.QueryFilter;

import jakarta.servlet.http.HttpServletRequest;

/**
 * Query/read endpoint for rev_policy_file. Replaces
 * RevPolicyFileService.getAllPolicyFiles (MongoTemplate) and GET /rev/policy/file.
 *
 * All params are custom names filtering the parent policy: policyno -> policyId.policyNumber,
 * officecode -> policyId.soCode (eq), srno -> policyId.srNo (ne), asrno -> policyId.asrNo (eq).
 */
@Component
@CrudMapping(mapping = "/rev/policy/file", type = RevPolicyFileModel.class, secondaryMapping = "/rev/policy/file/{id}")
public class RevPolicyFileHandler extends AbstractHandler implements QueryHandler, ReadHandler {

	@Override
	public void preProcess(FilterCriteria criteria, HandlerContext ctx) {
		// Explicit filtering below (nested parent fields).
	}

	@Override
	public QueryFilter applyQueryFilter(QueryFilter filter, HandlerContext ctx) {
		String officecode = queryParam("officecode");
		if (officecode != null && !officecode.isBlank()) {
			filter.addCondition(Criteria.EQ("policyId.soCode", officecode));
		}
		String srNo = queryParam("srno");
		if (srNo != null && !srNo.isBlank()) {
			filter.addCondition(Criteria.NE("policyId.srNo", srNo));
		}
		String asrNo = queryParam("asrno");
		if (asrNo != null && !asrNo.isBlank()) {
			filter.addCondition(Criteria.EQ("policyId.asrNo", asrNo));
		}
		String policyNumber = queryParam("policyno");
		if (policyNumber != null && !policyNumber.isBlank()) {
			filter.addCondition(Criteria.EQ("policyId.policyNumber", policyNumber));
		}
		filter.addOrderDesc("id");
		return QueryHandler.super.applyQueryFilter(filter, ctx);
	}

	private static String queryParam(String name) {
		ServletRequestAttributes attrs = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
		if (attrs == null) {
			return null;
		}
		HttpServletRequest request = attrs.getRequest();
		return request.getParameter(name);
	}
}
