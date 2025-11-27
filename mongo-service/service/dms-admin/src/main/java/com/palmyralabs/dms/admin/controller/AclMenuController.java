//package com.palmyralabs.dms.admin.controller;
//
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.PathVariable;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//
//import com.palmyralabs.dms.base.controller.BaseController;
//import com.palmyralabs.dms.jpa.query.AclMenuQuery;
//import com.zitlab.palmyra.store.base.security.AuthProvider;
//
//import lombok.RequiredArgsConstructor;
//
//@RestController
//@RequiredArgsConstructor
//@RequestMapping(path = "${palmyra.servlet.prefix-path:#{'palmyra'}}")
//public class AclMenuController extends BaseController {
//
//	private final AclMenuQuery aclMenuQuery = new AclMenuQuery();
//	private final AuthProvider authProvider;
//
//	@GetMapping("/acl/menu/parent")
//	public void getSideMenuParent() {
//		asJson(aclMenuQuery.getParentMenu(authProvider.getUser()));
//	}
//
//	@GetMapping("/acl/menu/parent/{parentId}/child")
//	public void getSideMenuChild(@PathVariable("parentId") Integer parentId) {
//		asJson(aclMenuQuery.getChildMenu(authProvider.getUser(), parentId));
//	}
//
//}
