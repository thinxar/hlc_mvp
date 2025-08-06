package com.palmyralabs.dms.admin.service;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.palmyralabs.dms.admin.security.LoginResponse;
import com.palmyralabs.dms.jpa.entity.MenuEntity;
import com.palmyralabs.dms.jpa.entity.UserEntity;
import com.palmyralabs.dms.jpa.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public Optional<UserEntity> findUserByLoginName(String loginName) {
		return userRepository.findUserByLoginName(loginName);
	}

    public void setLoginNameAndDisplayPage(String email, String loginName, MenuEntity displayPage) {
        Optional<UserEntity> userOptional = userRepository.findByEmail(email);
        userOptional.ifPresent(user -> {
            user.setLoginName(loginName);
            user.setDisplayPage(displayPage);
            userRepository.save(user);
        });
    }

    public LoginResponse getLoginNameAndDisplayPage(String loginName) {
		Optional<UserEntity> userOptional = findUserByLoginName(loginName);
		if (userOptional.isPresent()) {
			UserEntity user = userOptional.get();
			LoginResponse loginResponse = new LoginResponse();
			loginResponse.setLoginName(user.getLoginName());
			if (null != user.getDisplayPage())
				loginResponse.setDisplayPage(user.getDisplayPage().getCode());
			return loginResponse;
		}
		return null;
	}
    
    public boolean isUserActive(String loginName) {
		Optional<UserEntity> userOptional = userRepository.findUserByLoginNameAndActive(loginName, (short) 1);
		if (userOptional.isEmpty()) {
			return false;
		}
		return true;
	}
}
