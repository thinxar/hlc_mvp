package com.palmyralabs.dms.jpa.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.palmyralabs.dms.jpa.entity.AndOfficeCodeEntity;

public interface AndOfficeCodeRepository extends MongoRepository<AndOfficeCodeEntity, Integer> {

	Optional<AndOfficeCodeEntity> findByCode(String code);

}
