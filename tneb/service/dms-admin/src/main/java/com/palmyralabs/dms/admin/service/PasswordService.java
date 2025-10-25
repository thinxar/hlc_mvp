package com.palmyralabs.dms.admin.service;

import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.DigestUtils;

import com.palmyralabs.dms.admin.model.ResetChangePassword;
import com.palmyralabs.dms.jpa.entity.UserEntity;
import com.palmyralabs.dms.jpa.repository.UserRepository;
import com.palmyralabs.palmyra.ext.usermgmt.model.LoginName;


@Service
public class PasswordService {
	

    private UserRepository userRepository;
	
	@Autowired
	public PasswordService(UserRepository userRepository) {
		this.userRepository = userRepository;
	}

	public LoginName verifyPassword(String loginName , String password) {
		UserEntity userEntity = userRepository.findUserByLoginName(loginName).orElse(null);
		if(null != userEntity) {
			String combinedString = userEntity.getRandom() + password;
			byte[] combinedBytes = combinedString.getBytes(StandardCharsets.UTF_8);
			String enteredPasswordHash = DigestUtils.md5DigestAsHex(combinedBytes);
			if(enteredPasswordHash.equals(userEntity.getPassword())) {
				return new LoginName(loginName, "Password is correct.");
			}
			else {
				return new LoginName(loginName , "Incorrect password.");
			}
		}
		else {
			return new LoginName(loginName , "User not found.");
		}
	    
	}


	public static String generateRandomString() {
        SecureRandom secureRandom = new SecureRandom();
        StringBuilder randomString = new StringBuilder();

        for (int i = 0; i < 128; i++) {
            char randomChar = (char) (32 + secureRandom.nextInt(94)); 
            randomString.append(randomChar);
        }

        return randomString.toString();
    }

	    public String resetPassword(ResetChangePassword password) {
	        String random = generateRandomString();
	        String hashedPassword = hashPasswordWithKey(password.getPassword(), random);
	        String validate = validatePassword(password.getPassword());
	        if (validate.equals("Password is valid.")) {
	            UserEntity userEntity = userRepository.findUserByLoginName(password.getLoginName()).orElse(null);
	            if (userEntity != null) {
	                userEntity.setPassword(hashedPassword);
	                userEntity.setRandom(random);
	                userRepository.save(userEntity);
	                return "Password Changed Successfully.";
	            }
	        }
	        return "Password "+validate;
	    }

	    private String hashPasswordWithKey(String password, String key) {
	        
	        String combinedString = key + password;
	        byte[] combinedBytes = combinedString.getBytes(StandardCharsets.UTF_8);
	        return DigestUtils.md5DigestAsHex(combinedBytes);
	    }

	    
	    public static String validatePassword(String password) {
	        String passwordRegex = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$";
	        Pattern pattern = Pattern.compile(passwordRegex);
	        Matcher matcher = pattern.matcher(password);

	        if (!matcher.matches()) {
	            StringBuilder errorMessage = new StringBuilder();

	            if (password.length() < 8) {
	                errorMessage.append("Must contain at least 8 characters\n");
	            }
	            if (!password.matches(".*[a-z].*")) {
	                errorMessage.append("Must contain at least one lowercase letter\n");
	            }
	            if (!password.matches(".*[A-Z].*")) {
	                errorMessage.append("Must contain at least one uppercase letter\n");
	            }
	            if (!password.matches(".*\\d.*")) {
	                errorMessage.append("Must contain at least one digit\n");
	            }
	            if (!password.matches(".*[@$!%*?&].*")) {
	                errorMessage.append("Must contain at least one special character (@$!%*?&)\n");
	            }
	            if (!password.matches("[A-Za-z\\d@$!%*?&]+")) {
	                errorMessage.append("contains invalid characters. Only use letters, digits, and the specified special characters (@$!%*?&)\n");
	            }

	            return errorMessage.toString().trim();
	        }

	        return "Password is valid.";
	    }
}