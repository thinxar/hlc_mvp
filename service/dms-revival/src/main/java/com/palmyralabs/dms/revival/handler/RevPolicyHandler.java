package com.palmyralabs.dms.revival.handler;

import java.time.LocalDate;

import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import com.palmyralabs.dms.masterdata.handler.AbstractHandler;
import com.palmyralabs.dms.revival.model.RevPolicyModel;
import com.palmyralabs.palmyra.base.FilterCriteria;
import com.palmyralabs.palmyra.base.annotations.CrudMapping;
import com.palmyralabs.palmyra.handlers.HandlerContext;
import com.palmyralabs.palmyra.handlers.QueryHandler;
import com.palmyralabs.palmyra.handlers.ReadHandler;
import com.zitlab.palmyra.sqlbuilder.condition.Criteria;
import com.zitlab.palmyra.store.QueryFilter;

import jakarta.servlet.http.HttpServletRequest;

/**
 * Query/read endpoint for rev_policy. Replaces RevPolicyService.searchPolicies
 * (MongoTemplate) and the GET /rev/policy controller method.
 *
 * Custom-named params handled here: officecode -> soCode (eq), srno -> srNo (ne),
 * dos -> dateOfSubmission age band (&lt;3, 3-10, &gt;10 days relative to today).
 * policyNumber matches a model field, so palmyra applies it automatically.
 */
@Component
@CrudMapping(mapping = "/rev/policy", type = RevPolicyModel.class, secondaryMapping = "/rev/policy/{id}")
public class RevPolicyHandler extends AbstractHandler implements QueryHandler, ReadHandler {

	@Override
	public void preProcess(FilterCriteria criteria, HandlerContext ctx) {
		// Explicit filtering below; matching-name params are handled by palmyra.
	}

	@Override
	public QueryFilter applyQueryFilter(QueryFilter filter, HandlerContext ctx) {
		String officecode = queryParam("officecode");
		if (officecode != null && !officecode.isBlank()) {
			filter.addCondition(Criteria.EQ("soCode", officecode));
		}
		String srNo = queryParam("srno");
		if (srNo != null && !srNo.isBlank()) {
			filter.addCondition(Criteria.NE("srNo", srNo));
		}
		String dos = queryParam("dos");
		if (dos != null && !dos.isBlank()) {
			applyDosFilter(filter, dos.trim());
		}
		
		filter.addOrderDesc("id");
		return QueryHandler.super.applyQueryFilter(filter, ctx);
	}

	private void applyDosFilter(QueryFilter filter, String dos) {
		LocalDate today = LocalDate.now();
		switch (dos) {
			case "<3":
				filter.addCondition(Criteria.GT("dateOfSubmission", today.minusDays(3)));
				filter.addCondition(Criteria.LE("dateOfSubmission", today));
				break;
			case "3-10":
				filter.addCondition(Criteria.GE("dateOfSubmission", today.minusDays(10)));
				filter.addCondition(Criteria.LE("dateOfSubmission", today.minusDays(3)));
				break;
			case ">10":
				filter.addCondition(Criteria.LT("dateOfSubmission", today.minusDays(10)));
				break;
			default:
				break;
		}
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
