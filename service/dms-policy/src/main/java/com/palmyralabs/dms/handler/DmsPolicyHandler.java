package com.palmyralabs.dms.handler;

import org.eclipse.jetty.ee10.annotations.AnnotationParser.AbstractHandler;
import org.springframework.stereotype.Component;

import com.palmyralabs.dms.model.PolicyModel;
import com.palmyralabs.palmyra.base.annotations.CrudMapping;
import com.palmyralabs.palmyra.handlers.CreateHandler;
import com.palmyralabs.palmyra.handlers.HandlerContext;
import com.palmyralabs.palmyra.handlers.QueryHandler;
import com.palmyralabs.palmyra.handlers.ReadHandler;
import com.palmyralabs.palmyra.handlers.SaveHandler;
import com.palmyralabs.palmyra.handlers.UpdateHandler;
import com.zitlab.palmyra.store.Tuple;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
@CrudMapping(mapping = "/policy/dms", type = PolicyModel.class, secondaryMapping = "/policy/dms/{id}")
public class DmsPolicyHandler extends AbstractHandler
		implements QueryHandler, ReadHandler, SaveHandler, CreateHandler, UpdateHandler {

	@Override
	public int aclCheck(Tuple item, HandlerContext ctx) {
		// TODO Auto-generated method stub
		return 15;
	}
}
