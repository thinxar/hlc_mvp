//package com.palmyralabs.dms.admin.handler;
//
//import java.util.Map;
//import java.util.List;
//import java.util.ArrayList;
//import org.springframework.stereotype.Component;
//
//import com.palmyralabs.dms.admin.model.UserManagementModel;
//import com.palmyralabs.palmyra.base.FilterCriteria;
//import com.palmyralabs.palmyra.base.annotations.CrudMapping;
//import com.palmyralabs.palmyra.handlers.CreateHandler;
//import com.palmyralabs.palmyra.handlers.HandlerContext;
//import com.palmyralabs.palmyra.handlers.QueryHandler;
//import com.palmyralabs.palmyra.handlers.ReadHandler;
//import com.palmyralabs.palmyra.handlers.UpdateHandler;
//import com.zitlab.palmyra.store.Tuple;
//import com.zitlab.palmyra.store.base.security.ACLRights;
//
//import lombok.RequiredArgsConstructor;
//
//@Component
//@RequiredArgsConstructor
//@CrudMapping(mapping = "/userManagement", type = UserManagementModel.class, secondaryMapping = "/userManagement/{id}")
//public class UserManagementHandler implements QueryHandler, ReadHandler, CreateHandler, UpdateHandler {
//
//	public void aclCheck(FilterCriteria criteria, Map<String, String> map) {
//
//	}
//
//	@Override
//	public Tuple preCreate(Tuple tuple, HandlerContext ctx) {
//		if (tuple.hasAttribute("email")) {
//			tuple.set("loginName", tuple.get("email"));
//		}
//		String address = getAddress(tuple);
//		if (!address.isEmpty()) {
//			tuple.set("address", address);
//		}
//		return CreateHandler.super.preCreate(tuple, ctx);
//	}
//
//	@Override
//	public Tuple preUpdate(Tuple tuple, Tuple dbTuple, HandlerContext ctx) {
//		String address = getAddress(tuple);
//		tuple.setAttribute("address", address);
//
//		return tuple;
//	}
//
//	@Override
//	public int aclCheck(Tuple item, HandlerContext ctx) {
//		return ACLRights.ALL;
//	}
//
//	public String getAddress(Tuple tuple) {
//		List<String> addressParts = new ArrayList<>();
//
//		if (tuple.getAttributeAsString("flatNo") != null && tuple.getAttributeAsString("flatNo") != "") {
//			addressParts.add(tuple.getAttributeAsString("flatNo"));
//		}
//		if (tuple.getAttributeAsString("street") != null && tuple.getAttributeAsString("street") != "") {
//			addressParts.add(tuple.getAttributeAsString("street"));
//		}
//		if (tuple.getAttributeAsString("city") != null && tuple.getAttributeAsString("city") != "") {
//			addressParts.add(tuple.getAttributeAsString("city"));
//		}
//		if (tuple.getAttributeAsString("state") != null && tuple.getAttributeAsString("state") != "") {
//			addressParts.add(tuple.getAttributeAsString("state"));
//		}
//		if (tuple.getAttributeAsString("pincode") != null && tuple.getAttributeAsString("pincode") != "") {
//			addressParts.add(tuple.getAttributeAsString("pincode"));
//		}
//
//		return String.join(",\n ", addressParts);
//	}
//}