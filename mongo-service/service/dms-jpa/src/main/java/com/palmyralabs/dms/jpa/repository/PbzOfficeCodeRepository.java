package com.palmyralabs.dms.jpa.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.palmyralabs.dms.jpa.entity.PbzOfficeCodeEntity;

public interface PbzOfficeCodeRepository extends MongoRepository<PbzOfficeCodeEntity, Integer> {

	Optional<PbzOfficeCodeEntity> findByCode(String code);

}
