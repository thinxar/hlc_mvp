package com.palmyralabs.dms.handler;

import org.eclipse.jetty.ee10.annotations.AnnotationParser.AbstractHandler;
import org.springframework.stereotype.Component;

import com.palmyralabs.dms.model.PolicyFileModel;
import com.palmyralabs.palmyra.base.annotations.CrudMapping;
import com.palmyralabs.palmyra.handlers.HandlerContext;
import com.palmyralabs.palmyra.handlers.QueryHandler;
import com.zitlab.palmyra.sqlbuilder.condition.Criteria;
import com.zitlab.palmyra.store.QueryFilter;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
@CrudMapping(mapping = "/policy/dms/{policyNumber}", type = PolicyFileModel.class)
public class DmsPolicyFileHandler extends AbstractHandler implements QueryHandler{

	@Override
	public QueryFilter applyQueryFilter(QueryFilter filter, HandlerContext ctx) {
		String PolicyNumber = ctx.getParams().get("policyNumber");
		filter.addCondition(Criteria.EQ("policyNumber",PolicyNumber));
		return QueryHandler.super.applyQueryFilter(filter, ctx);
		}
}
