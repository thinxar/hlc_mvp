package com.palmyralabs.dms.admin.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResetChangePassword {

	private String loginName;
	
	private String password;
	
	private String currentPassoword;
}
