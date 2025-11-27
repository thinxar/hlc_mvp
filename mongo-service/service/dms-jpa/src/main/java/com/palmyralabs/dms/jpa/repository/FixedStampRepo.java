package com.palmyralabs.dms.jpa.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.palmyralabs.dms.jpa.entity.FixedStampEntity;

public interface FixedStampRepo extends MongoRepository<FixedStampEntity, Integer>{

	Optional<FixedStampEntity> findById(Integer id);

	Optional<FixedStampEntity> findByCode(String code);

}
