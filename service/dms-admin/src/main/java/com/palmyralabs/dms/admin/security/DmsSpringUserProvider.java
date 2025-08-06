package com.palmyralabs.dms.admin.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import com.palmyralabs.dms.base.config.UserProvider;
import com.palmyralabs.palmyra.base.exception.EndPointForbiddenException;
import com.zitlab.palmyra.store.base.exception.Validation;

@Component
public class DmsSpringUserProvider implements UserProvider{

	@Override
	public String getUserId() {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		if(null ==  auth || null == auth.getName()) {
			throw new EndPointForbiddenException(Validation.INVALID_ACTION, "sdfsdf");
		}
		return auth.getName();
	}

}
