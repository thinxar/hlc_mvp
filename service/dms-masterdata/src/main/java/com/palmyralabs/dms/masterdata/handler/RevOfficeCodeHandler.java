package com.palmyralabs.dms.masterdata.handler;

import org.springframework.stereotype.Component;

import com.palmyralabs.dms.masterdata.model.RevOfficeCodeModel;
import com.palmyralabs.palmyra.base.annotations.CrudMapping;
import com.palmyralabs.palmyra.handlers.QueryHandler;
import com.palmyralabs.palmyra.handlers.ReadHandler;
import com.palmyralabs.palmyra.handlers.SaveHandler;

@CrudMapping(mapping = "/masterdata/rev/officeCode", type = RevOfficeCodeModel.class, secondaryMapping = "/masterdata/rev/officeCode/{id}")
@Component
public class RevOfficeCodeHandler extends AbstractHandler implements QueryHandler, ReadHandler, SaveHandler {

}
