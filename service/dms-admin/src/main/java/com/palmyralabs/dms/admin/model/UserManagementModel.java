package com.palmyralabs.dms.admin.model;

import java.util.Date;

import com.palmyralabs.dms.masterdata.model.UserTypeModel;
import com.palmyralabs.palmyra.base.annotations.PalmyraField;
import com.palmyralabs.palmyra.base.annotations.PalmyraType;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@PalmyraType(type = "XpmUser")
public class UserManagementModel {

	@PalmyraField
	private Integer id;
	
	@PalmyraField
	private String displayName;
	
	@PalmyraField
	private AclMenuModel displayPage;
	
	@PalmyraField
	private String loginName;
	
	@PalmyraField
	private String email;
	
	@PalmyraField
	private String gender;

	@PalmyraField(pattern = "dd-MM-yyyy")
	private Date dob;
	
	@PalmyraField
	private UserTypeModel userType;
	
	@PalmyraField
	private String firstName;
	
	@PalmyraField
	private String lastName;
	
	@PalmyraField
	private String phoneNumber;
	
	@PalmyraField
	private String flatNo;

	@PalmyraField
	private String street;

	@PalmyraField
	private String city;
	
	@PalmyraField
	private String state;

	@PalmyraField
	private String pincode;
	
	@PalmyraField(attribute = "address")
	private String address;

}