package com.palmyralabs.dms.ananda.handler;

import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import com.palmyralabs.dms.ananda.model.AndProposalModel;
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
 * Query/read endpoint for and_policy. Replaces AndProposalService.searchPolicies
 * (MongoTemplate) and the GET /and/proposal controller method.
 *
 * Only params whose name differs from a model field are handled here (officecode -> boCode).
 * year and proposalNo match model fields, so palmyra applies them automatically.
 */
@Component
@CrudMapping(mapping = "/and/proposal", type = AndProposalModel.class, secondaryMapping = "/and/proposal/{id}")
public class AndProposalHandler extends AbstractHandler implements QueryHandler, ReadHandler {

	@Override
	public void preProcess(FilterCriteria criteria, HandlerContext ctx) {
		// Explicit filtering below; matching-name params are handled by palmyra.
	}

	@Override
	public QueryFilter applyQueryFilter(QueryFilter filter, HandlerContext ctx) {
		String officecode = queryParam("officecode");
		if (officecode != null && !officecode.isBlank()) {
			filter.addCondition(Criteria.EQ("boCode", officecode));
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
