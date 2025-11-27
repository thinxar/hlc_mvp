package com.palmyralabs.dms.admin.service;

import org.springframework.stereotype.Service;

import com.palmyralabs.dms.jpa.entity.UserEntity;
import com.palmyralabs.dms.jpa.repository.UserRepository;
import com.palmyralabs.palmyra.ext.usermgmt.exception.UnAuthorizedException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepo;

    public UserEntity authenticate(String username, String password) {
    	UserEntity user = userRepo.findUserByLoginName(username)
                .orElseThrow(() -> new UnAuthorizedException("USER001", "Invalid Credientials"));

        if (user.getActive() != 1) {
            throw new UnAuthorizedException("USER002", "This user account has been deactivated.");
        }

        if (!user.getSalt().equals(password)) {
            throw new UnAuthorizedException("USER003", "Invalid Credientials");
        }

        return user;
    }
}



