package com.palmyralabs.dms.handler;

import org.springframework.stereotype.Component;

import com.palmyralabs.dms.masterdata.handler.AbstractHandler;
import com.palmyralabs.dms.model.PolicyFileModel;
import com.palmyralabs.palmyra.base.annotations.CrudMapping;
import com.palmyralabs.palmyra.handlers.HandlerContext;
import com.palmyralabs.palmyra.handlers.QueryHandler;
import com.zitlab.palmyra.sqlbuilder.condition.Criteria;
import com.zitlab.palmyra.store.QueryFilter;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
@CrudMapping(mapping = "/policy/{policyNumber}/file", type = PolicyFileModel.class)
public class DmsPolicyFileHandler extends AbstractHandler implements QueryHandler {

	@Override
	public QueryFilter applyQueryFilter(QueryFilter filter, HandlerContext ctx) {
		Integer PolicyNumber =Integer.parseInt(ctx.getParams().get("policyNumber")) ;
		filter.addCondition(Criteria.EQ("policyId.policyNumber", PolicyNumber));
		return QueryHandler.super.applyQueryFilter(filter, ctx);
	}
}
