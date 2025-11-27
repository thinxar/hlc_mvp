package com.palmyralabs.dms.jpa.entity;

import java.time.LocalDateTime;

import org.springframework.data.mongodb.core.mapping.Document;

import com.palmyralabs.dms.base.annotation.AutoIncrementId;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Document(collection = "xpm_user")
public class UserEntity {

	@AutoIncrementId
	private Integer id;

	private String loginName;

	private String displayName;

	private String displayPage;

	private String email;

	private String gender;

	private LocalDateTime dob;

	private String firstName;

	private String lastName;

	private String phoneNumber;

	private String random;
	
	private short active;
	
	private String salt;
	
	private Integer userType;

}
