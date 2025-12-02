package com.palmyralabs.dms.jpa.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.palmyralabs.dms.jpa.entity.EndorsementSubTypeEntity;

public interface EndorsementSubTypeRepo extends MongoRepository<EndorsementSubTypeEntity, Integer> {

	Optional<EndorsementSubTypeEntity> findById(Integer id);

	List<EndorsementSubTypeEntity> findByEndorsementType_IdOrderByIdAsc(Integer endorsementType);

}
