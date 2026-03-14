package com.palmyralabs.dms.ananda.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.palmyralabs.dms.ananda.entity.AndPolicyFileEntity;

public interface AndPolicyFileRepository extends MongoRepository<AndPolicyFileEntity, Integer>{


	Optional<AndPolicyFileEntity> findByObjectUrl(String objectUrl);

	Optional<AndPolicyFileEntity> findById(Integer id);
	
}
