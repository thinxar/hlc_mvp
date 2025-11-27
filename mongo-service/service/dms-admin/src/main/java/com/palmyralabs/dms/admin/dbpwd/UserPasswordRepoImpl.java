//package com.palmyralabs.dms.admin.dbpwd;
//
//import java.util.Optional;
//
//import org.springframework.stereotype.Service;
//
//import com.palmyralabs.dms.jpa.entity.UserEntity;
//import com.palmyralabs.dms.jpa.repository.UserRepository;
//import com.palmyralabs.palmyra.ext.usermgmt.model.UserPasswordModel;
//import com.palmyralabs.palmyra.ext.usermgmt.repository.UserPasswordRepository;
//
//import lombok.RequiredArgsConstructor;
//
//@Service
//@RequiredArgsConstructor
//public class UserPasswordRepoImpl implements UserPasswordRepository {
//
//	private final UserRepository userRepository;
//
//	@Override
//	public UserPasswordModel findByLoginName(String loginName) {
//		Optional<UserEntity> entityOpt = userRepository.findUserByLoginName(loginName);
//		
//		if (entityOpt.isPresent()) {
//			UserEntity entity = entityOpt.get();
//			UserPasswordModel model = new UserPasswordModel();
//			model.setId(entity.getId());
//			model.setLoginName(entity.getLoginName());
//			model.setRandom(entity.getRandom());
//			model.setSalt(entity.getPassword());
//			return model;
//		}
//
//		return null;
//	}
//
//	@Override
//	public void update(UserPasswordModel user) {
//		Optional<UserEntity> entityOpt = userRepository.findById(user.getId());
//
//		if (entityOpt.isPresent()) {
//			UserEntity entity = entityOpt.get();
//			entity.setPassword(user.getSalt());
//			entity.setRandom(user.getRandom());
//			userRepository.save(entity);
//		}
//	}
//
//}
