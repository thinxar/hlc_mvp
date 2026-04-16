package com.palmyralabs.dms.jpa.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.palmyralabs.dms.jpa.entity.RevSrNoEntity;

public interface RevSrNoRepository extends MongoRepository<RevSrNoEntity, Integer>{

	Optional<RevSrNoEntity> findByCode(String code);

}
