package com.palmyralabs.dms.admin.handler;

import org.springframework.stereotype.Component;

import com.palmyralabs.dms.admin.model.AuthenticationUserModel;
import com.palmyralabs.dms.base.config.UserProvider;
import com.palmyralabs.palmyra.base.annotations.CrudMapping;
import com.palmyralabs.palmyra.base.exception.EndPointForbiddenException;
import com.palmyralabs.palmyra.handlers.HandlerContext;
import com.palmyralabs.palmyra.handlers.ReadHandler;
import com.zitlab.palmyra.sqlbuilder.condition.Criteria;
import com.zitlab.palmyra.store.QueryFilter;
import com.zitlab.palmyra.store.base.exception.Validation;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@CrudMapping(mapping = "/user/about", type = AuthenticationUserModel.class)
@Component
public class AboutUserHandler implements ReadHandler {
	private final UserProvider userProvider;

	@Override
	public QueryFilter applyFilter(QueryFilter filter, HandlerContext ctx) {
		String userId = userProvider.getUserId();
		if(null == userId || userId.equalsIgnoreCase("anonymousUser")) {
			throw new EndPointForbiddenException(Validation.OTHERS, "Not Authenticated");
		}
		filter.addCondition(Criteria.EQ("email", userProvider.getUserId()));
		return filter;
	}

}