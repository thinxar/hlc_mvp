package com.palmyralabs.dms.masterdata.handler;

import org.springframework.stereotype.Component;

import com.palmyralabs.dms.masterdata.model.PbzOfficeCodeModel;
import com.palmyralabs.palmyra.base.annotations.CrudMapping;
import com.palmyralabs.palmyra.handlers.QueryHandler;
import com.palmyralabs.palmyra.handlers.ReadHandler;
import com.palmyralabs.palmyra.handlers.SaveHandler;

@CrudMapping(mapping = "/masterdata/pbv/officeCode", type = PbzOfficeCodeModel.class, secondaryMapping = "/masterdata/pbv/officeCode/{id}")
@Component
public class PbzOfficeCodeHandler extends AbstractHandler implements QueryHandler, ReadHandler, SaveHandler {

}
