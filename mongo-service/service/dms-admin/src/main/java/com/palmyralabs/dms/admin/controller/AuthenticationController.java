package com.palmyralabs.dms.admin.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.palmyralabs.dms.admin.service.UserService;
import com.palmyralabs.dms.jpa.entity.UserEntity;
import com.palmyralabs.palmyra.ext.usermgmt.model.LoginRequest;

import lombok.RequiredArgsConstructor;
import com.palmyralabs.dms.base.model.LoginResponse;
//
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
//import org.springframework.security.core.Authentication;
//import org.springframework.security.core.context.SecurityContext;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.security.core.context.SecurityContextHolderStrategy;
//import org.springframework.security.web.context.SecurityContextRepository;
//import org.springframework.stereotype.Controller;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestBody;
//
//import com.palmyralabs.dms.admin.service.UserService;
//import com.palmyralabs.dms.base.controller.BaseController;
//import com.palmyralabs.dms.base.model.LoginResponse;
//import com.palmyralabs.palmyra.ext.usermgmt.exception.UnAuthorizedException;
//import com.palmyralabs.palmyra.ext.usermgmt.model.LoginRequest;
//import com.palmyralabs.palmyra.ext.usermgmt.security.LocalDBAuthenticationProvider;
//
//import jakarta.servlet.http.HttpServletRequest;
//import jakarta.servlet.http.HttpServletResponse;
//import lombok.RequiredArgsConstructor;
//
//@Controller
//@RequiredArgsConstructor
//public class AuthenticationController extends BaseController {
//	private final UserService userService;
//	private final SecurityContextRepository securityContextRepository;
//	private final LocalDBAuthenticationProvider authenticationManager;
//	private SecurityContextHolderStrategy securityContextHolderStrategy = SecurityContextHolder
//			.getContextHolderStrategy();
//
//	@PostMapping("/auth/login")
//	public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest, HttpServletRequest request,
//			HttpServletResponse response) {
//		UsernamePasswordAuthenticationToken token = UsernamePasswordAuthenticationToken
//				.unauthenticated(loginRequest.getUserName(), loginRequest.getPassword());
//		Authentication authentication = authenticationManager.authenticate(token);
//		if (null != authentication && authentication.isAuthenticated()) {
//			if(!userService.isUserActive(loginRequest.getUserName())) {
//				throw new UnAuthorizedException("USER001", "This user account has been deactivated.");
//			}
//			SecurityContext context = securityContextHolderStrategy.createEmptyContext();
//			context.setAuthentication(authentication);
//			securityContextHolderStrategy.setContext(context);
//			securityContextRepository.saveContext(context, request, response);
//			String loginName = authentication.getName();
//			LoginResponse loginResponse = userService.getLoginNameAndDisplayPage(loginName);
//			return ResponseEntity.ok(loginResponse);
//
//		} else {
//			throw new UnAuthorizedException("USER001", "Invalid Credientials");
//		}
//	}
//}

@RestController
@RequiredArgsConstructor
public class AuthenticationController {

    private final UserService userService;

    @PostMapping("/auth/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest) {

        UserEntity user = userService.authenticate(
                loginRequest.getUserName(),
                loginRequest.getPassword()
        );

        LoginResponse resp = new LoginResponse();
        resp.setLoginName(user.getLoginName());
        resp.setDisplayPage(user.getDisplayPage());
        resp.setDisplayPage(user.getDisplayName());

        return ResponseEntity.ok(resp);
    }

    @GetMapping("/auth/logout")
    public ResponseEntity<Void> logout() {
        return ResponseEntity.ok().build();
    }
}


