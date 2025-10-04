package com.palmyralabs.dms.masterdata.handler;

import java.util.Map;

import org.springframework.stereotype.Component;

import com.palmyralabs.dms.masterdata.model.EndorsementSubTypeModel;
import com.palmyralabs.palmyra.base.FilterCriteria;
import com.palmyralabs.palmyra.base.annotations.CrudMapping;
import com.palmyralabs.palmyra.base.annotations.Permission;
import com.palmyralabs.palmyra.handlers.HandlerContext;
import com.palmyralabs.palmyra.handlers.QueryHandler;
import com.palmyralabs.palmyra.handlers.ReadHandler;
import com.palmyralabs.palmyra.handlers.SaveHandler;

@CrudMapping(mapping = "/masterdata/{endorsementType}/endorsementSubType", type = EndorsementSubTypeModel.class, secondaryMapping = "/masterdata/{endorsementType}/endorsementSubType/{id}")
@Component
@Permission(value = "MasterData", query = "RS", read = "RS", create = "CU", update = "CU")
public class EndorsementSubTypeHandler extends AbstractHandler implements QueryHandler, ReadHandler, SaveHandler {

	@Override
	public void preProcess(FilterCriteria criteria, HandlerContext ctx) {
		Map<String, String> inputs = ctx.getParams();
		if (null != inputs) {
			criteria.addRefCriteria("endorsementType.id", inputs.get("endorsementType"));
		}
	}
}
