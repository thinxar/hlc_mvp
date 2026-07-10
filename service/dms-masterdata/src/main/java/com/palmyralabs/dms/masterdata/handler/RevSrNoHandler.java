package com.palmyralabs.dms.masterdata.handler;

import org.springframework.stereotype.Component;

import com.palmyralabs.dms.masterdata.model.RevSrNoModel;
import com.palmyralabs.palmyra.base.annotations.CrudMapping;
import com.palmyralabs.palmyra.handlers.QueryHandler;
import com.palmyralabs.palmyra.handlers.ReadHandler;
import com.palmyralabs.palmyra.handlers.SaveHandler;

@CrudMapping(mapping = "/masterdata/rev/srNo", type = RevSrNoModel.class, secondaryMapping = "/masterdata/rev/srNo/{id}")
@Component
public class RevSrNoHandler extends AbstractHandler implements QueryHandler, ReadHandler, SaveHandler {

}
