package com.palmyralabs.dms.masterdata.handler;

import org.springframework.stereotype.Component;

import com.palmyralabs.dms.masterdata.model.UserTypeModel;
import com.palmyralabs.palmyra.base.annotations.CrudMapping;
import com.palmyralabs.palmyra.base.annotations.Permission;
import com.palmyralabs.palmyra.handlers.QueryHandler;
import com.palmyralabs.palmyra.handlers.ReadHandler;
import com.palmyralabs.palmyra.handlers.SaveHandler;

@CrudMapping(mapping = "/masterdata/userType", type = UserTypeModel.class, secondaryMapping = "/masterdata/userType/{id}")
@Component
@Permission(value = "MasterData", query = "RS", read = "RS", create = "CU", update = "CU")
public class UserTypeHandler extends AbstractHandler implements QueryHandler, ReadHandler, SaveHandler {


}
