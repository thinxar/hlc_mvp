package com.palmyralabs.dms.jpa.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import com.palmyralabs.dms.jpa.entity.UserEntity;

public interface UserRepository extends JpaRepository<UserEntity, Integer> {

	Optional<UserEntity> findByEmail(@Param("email") String email);

	Optional<UserEntity> findUserByLoginName(@Param("loginName") String loginName);

	Optional<UserEntity> findUserByLoginNameAndActive(@Param("loginName") String loginName,
			@Param("active") short active);

}