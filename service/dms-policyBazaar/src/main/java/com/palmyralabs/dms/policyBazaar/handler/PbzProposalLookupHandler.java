package com.palmyralabs.dms.policyBazaar.handler;

import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import com.palmyralabs.dms.masterdata.handler.AbstractHandler;
import com.palmyralabs.dms.policyBazaar.model.PbzProposalLookUpModel;
import com.palmyralabs.palmyra.base.FilterCriteria;
import com.palmyralabs.palmyra.base.annotations.CrudMapping;
import com.palmyralabs.palmyra.handlers.HandlerContext;
import com.palmyralabs.palmyra.handlers.QueryHandler;
import com.palmyralabs.palmyra.handlers.ReadHandler;
import com.zitlab.palmyra.sqlbuilder.condition.Criteria;
import com.zitlab.palmyra.store.QueryFilter;

import jakarta.servlet.http.HttpServletRequest;

/**
 * Lightweight lookup (id, proposalNo) over pbz_policy. Replaces
 * PbzProposallookupService.getAllProposal (MongoTemplate) and GET /pbv/proposal/lookup.
 *
 * boCode/year are not model fields here, so they are read as custom params
 * (officecode -> boCode, year); proposalNo matches the model field and is applied by palmyra.
 */
@Component
@CrudMapping(mapping = "/pbv/proposal/lookup", type = PbzProposalLookUpModel.class, secondaryMapping = "/pbv/proposal/lookup/{id}")
public class PbzProposalLookupHandler extends AbstractHandler implements QueryHandler, ReadHandler {

	@Override
	public void preProcess(FilterCriteria criteria, HandlerContext ctx) {
		// Explicit filtering below.
	}

	@Override
	public QueryFilter applyQueryFilter(QueryFilter filter, HandlerContext ctx) {
		String officecode = queryParam("officecode");
		if (officecode != null && !officecode.isBlank()) {
			filter.addCondition(Criteria.EQ("boCode", officecode));
		}
		String year = queryParam("year");
		if (year != null && !year.isBlank()) {
			filter.addCondition(Criteria.EQ("year", year));
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
