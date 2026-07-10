package com.palmyralabs.dms.ananda.handler;

import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import com.palmyralabs.dms.ananda.model.AndProposalFileModel;
import com.palmyralabs.dms.masterdata.handler.AbstractHandler;
import com.palmyralabs.palmyra.base.FilterCriteria;
import com.palmyralabs.palmyra.base.annotations.CrudMapping;
import com.palmyralabs.palmyra.handlers.HandlerContext;
import com.palmyralabs.palmyra.handlers.QueryHandler;
import com.palmyralabs.palmyra.handlers.ReadHandler;
import com.zitlab.palmyra.sqlbuilder.condition.Criteria;
import com.zitlab.palmyra.store.QueryFilter;

import jakarta.servlet.http.HttpServletRequest;

/**
 * Query/read endpoint for and_policy_file. Replaces
 * AndProposalFileService.getAllProposalFiles (MongoTemplate) and GET /and/proposal/file.
 *
 * All params are custom names filtering the parent proposal: propno -> policyId.proposalNo,
 * officecode -> policyId.boCode, year -> policyId.year.
 */
@Component
@CrudMapping(mapping = "/and/proposal/file", type = AndProposalFileModel.class, secondaryMapping = "/and/proposal/file/{id}")
public class AndProposalFileHandler extends AbstractHandler implements QueryHandler, ReadHandler {

	@Override
	public void preProcess(FilterCriteria criteria, HandlerContext ctx) {
		// Explicit filtering below (nested parent fields).
	}

	@Override
	public QueryFilter applyQueryFilter(QueryFilter filter, HandlerContext ctx) {
		String proposalNo = queryParam("propno");
		if (proposalNo != null && !proposalNo.isBlank()) {
			filter.addCondition(Criteria.EQ("policyId.proposalNo", proposalNo));
		}
		String officecode = queryParam("officecode");
		if (officecode != null && !officecode.isBlank()) {
			filter.addCondition(Criteria.EQ("policyId.boCode", officecode));
		}
		String year = queryParam("year");
		if (year != null && !year.isBlank()) {
			filter.addCondition(Criteria.EQ("policyId.year", year));
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
