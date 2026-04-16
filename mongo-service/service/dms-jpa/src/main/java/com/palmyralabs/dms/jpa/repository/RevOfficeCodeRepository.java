package com.palmyralabs.dms.jpa.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.palmyralabs.dms.jpa.entity.RevOfficeCodeEntity;

public interface RevOfficeCodeRepository extends MongoRepository<RevOfficeCodeEntity, Integer>{


	Optional<RevOfficeCodeEntity> findByCode(String code);

}
