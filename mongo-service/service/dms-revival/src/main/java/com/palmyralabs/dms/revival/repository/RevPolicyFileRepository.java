package com.palmyralabs.dms.revival.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.palmyralabs.dms.revival.entity.RevPolicyFileEntity;

public interface RevPolicyFileRepository extends MongoRepository<RevPolicyFileEntity, Integer>{

	Optional<RevPolicyFileEntity> findByObjectUrl(String objectUrl);

	Optional<RevPolicyFileEntity> findById(Integer id);

}
