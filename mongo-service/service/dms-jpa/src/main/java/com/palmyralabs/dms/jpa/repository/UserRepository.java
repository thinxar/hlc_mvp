package com.palmyralabs.dms.jpa.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.palmyralabs.dms.jpa.entity.UserEntity;

public interface UserRepository extends MongoRepository<UserEntity, Integer> {

	Optional<UserEntity> findByEmail(String email);

	Optional<UserEntity> findUserByLoginName(String loginName);

	Optional<UserEntity> findUserByLoginNameAndActive(String loginName, short active);

}