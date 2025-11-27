package com.palmyralabs.dms.jpa.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.palmyralabs.dms.jpa.entity.EndorsementTypeEntity;

public interface EndorsementTypeRepo extends MongoRepository<EndorsementTypeEntity, Integer> {

	Optional<EndorsementTypeEntity> findById(Integer id);
}
