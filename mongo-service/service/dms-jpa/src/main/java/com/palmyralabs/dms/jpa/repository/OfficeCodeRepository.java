package com.palmyralabs.dms.jpa.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.palmyralabs.dms.jpa.entity.OfficeCodeEntity;

public interface OfficeCodeRepository extends MongoRepository<OfficeCodeEntity, Integer>{


	Optional<OfficeCodeEntity> findByCode(String code);

}
