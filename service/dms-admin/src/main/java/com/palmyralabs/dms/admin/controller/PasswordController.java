package com.palmyralabs.dms.admin.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import com.palmyralabs.dms.admin.model.ResetChangePassword;
import com.palmyralabs.dms.admin.service.PasswordService;
import com.palmyralabs.palmyra.ext.usermgmt.model.LoginName;

import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
@RequestMapping
public class PasswordController {
	
	private PasswordService passwordService;
	
	@Autowired
	public PasswordController(PasswordService passwordService) {
		this.passwordService = passwordService;
	}
	
	@PostMapping("/resetPassword")
	public ResponseEntity<LoginName> resetPassword(@RequestBody ResetChangePassword password) {
	    String resetResult = passwordService.resetPassword(password);

	    if (resetResult.equals("Password Changed Successfully.")) {
	        return ResponseEntity.ok(new LoginName(password.getLoginName() , resetResult));
	    } else {
	        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new LoginName(password.getLoginName() , resetResult));
	    }
	}
}
