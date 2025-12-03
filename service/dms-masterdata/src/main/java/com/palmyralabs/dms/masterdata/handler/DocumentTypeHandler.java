package com.palmyralabs.dms.masterdata.handler;


import org.springframework.stereotype.Component;

import com.palmyralabs.dms.masterdata.model.DocumentTypeModel;
import com.palmyralabs.palmyra.base.FilterCriteria;
import com.palmyralabs.palmyra.base.annotations.CrudMapping;
import com.palmyralabs.palmyra.base.annotations.Permission;
import com.palmyralabs.palmyra.handlers.HandlerContext;
import com.palmyralabs.palmyra.handlers.QueryHandler;
import com.palmyralabs.palmyra.handlers.ReadHandler;
import com.palmyralabs.palmyra.handlers.SaveHandler;
import com.zitlab.palmyra.sqlbuilder.condition.Criteria;
import com.zitlab.palmyra.store.QueryFilter;

@CrudMapping(mapping = "/masterdata/docketType", type = DocumentTypeModel.class, secondaryMapping = "/masterdata/docketType/{id}")
@Component
@Permission(value = "MasterData", query = "RS", read = "RS", create = "CU", update = "CU")
public class DocumentTypeHandler extends AbstractHandler implements QueryHandler, ReadHandler, SaveHandler{
	
	@Override
	public QueryFilter applyQueryFilter(QueryFilter filter, HandlerContext ctx) {
		filter.addCondition(Criteria.notEquals("id", 15));
		return QueryHandler.super.applyQueryFilter(filter, ctx);
	}

}
