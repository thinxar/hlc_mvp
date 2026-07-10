package com.palmyralabs.dms.masterdata.handler;

import org.springframework.stereotype.Component;

import com.palmyralabs.dms.masterdata.model.AndOfficeCodeModel;
import com.palmyralabs.palmyra.base.annotations.CrudMapping;
import com.palmyralabs.palmyra.handlers.QueryHandler;
import com.palmyralabs.palmyra.handlers.ReadHandler;
import com.palmyralabs.palmyra.handlers.SaveHandler;

@CrudMapping(mapping = "/masterdata/and/officeCode", type = AndOfficeCodeModel.class, secondaryMapping = "/masterdata/and/officeCode/{id}")
@Component
public class AndOfficeCodeHandler extends AbstractHandler implements QueryHandler, ReadHandler, SaveHandler {

}
