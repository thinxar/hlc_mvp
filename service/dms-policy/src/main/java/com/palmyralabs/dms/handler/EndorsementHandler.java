package com.palmyralabs.dms.handler;

import org.springframework.stereotype.Component;

import com.palmyralabs.dms.masterdata.handler.AbstractHandler;
import com.palmyralabs.dms.model.EndorsementSummaryModel;
import com.palmyralabs.palmyra.base.annotations.CrudMapping;
import com.palmyralabs.palmyra.handlers.HandlerContext;
import com.palmyralabs.palmyra.handlers.QueryHandler;
import com.palmyralabs.palmyra.handlers.ReadHandler;
import com.zitlab.palmyra.sqlbuilder.condition.Criteria;
import com.zitlab.palmyra.store.QueryFilter;

@Component
@CrudMapping(mapping = "/policy/endorsement", type = EndorsementSummaryModel.class, secondaryMapping = "/policy/endorsement/{id}")
public class EndorsementHandler extends AbstractHandler implements QueryHandler, ReadHandler {

	@Override
	public QueryFilter applyQueryFilter(QueryFilter filter, HandlerContext ctx) {
		filter.addCondition(Criteria.EQ("docketType", 15));
		filter.addOrderDesc("id");
		return QueryHandler.super.applyQueryFilter(filter, ctx);
	}

}
