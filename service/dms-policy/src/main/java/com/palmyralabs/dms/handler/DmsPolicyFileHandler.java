package com.palmyralabs.dms.handler;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Component;

import com.palmyralabs.dms.masterdata.handler.AbstractHandler;
import com.palmyralabs.dms.model.PolicyFileFixedStampModel;
import com.palmyralabs.dms.model.PolicyFileModel;
import com.palmyralabs.dms.model.PolicyStampModel;
import com.palmyralabs.palmyra.base.Action;
import com.palmyralabs.palmyra.base.annotations.CrudMapping;
import com.palmyralabs.palmyra.core.api2db.service.PalmyraQueryService;
import com.palmyralabs.palmyra.handlers.HandlerContext;
import com.palmyralabs.palmyra.handlers.QueryHandler;
import com.zitlab.palmyra.sqlbuilder.condition.Criteria;
import com.zitlab.palmyra.store.QueryFilter;
import com.zitlab.palmyra.store.Tuple;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
@CrudMapping(mapping = "/policy/{policyId}/file", type = PolicyFileModel.class)
public class DmsPolicyFileHandler extends AbstractHandler implements QueryHandler {

	private final PalmyraQueryService queryService;

	@Override
	public QueryFilter applyQueryFilter(QueryFilter filter, HandlerContext ctx) {
		Integer policyId = Integer.parseInt(ctx.getParams().get("policyId"));
		filter.addCondition(Criteria.EQ("policyId", policyId));
		filter.addOrderAsc("docketType");
		return QueryHandler.super.applyQueryFilter(filter, ctx);
	}

	@Override
	public Tuple onQueryResult(Tuple tuple, Action action) {
		Long policyFileId =  tuple.getAttributeAsLong("id");
		
		QueryFilter filter = new QueryFilter();
		filter.addCondition(Criteria.IN("policyFile", policyFileId));
		List<PolicyFileFixedStampModel> policyFileFixedStampModels = queryService
				.findAll(PolicyFileFixedStampModel.class, filter);
		List<PolicyStampModel> policyStampModels = new ArrayList<PolicyStampModel>();
		
		for(PolicyFileFixedStampModel model: policyFileFixedStampModels) {
			PolicyStampModel policyStampModel = new PolicyStampModel();
			policyStampModel.setStamp( model.getStamp());
			policyStampModel.setCreatedOn(model.getCreatedOn().toString());
			policyStampModels.add(policyStampModel);
		}
		tuple.setAttribute("fixedStamp", policyStampModels);
		return QueryHandler.super.onQueryResult(tuple, action);
	}
}
