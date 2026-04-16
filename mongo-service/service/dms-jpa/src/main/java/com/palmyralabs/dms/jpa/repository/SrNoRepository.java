package com.palmyralabs.dms.jpa.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.palmyralabs.dms.jpa.entity.SrNoEntity;

public interface SrNoRepository extends MongoRepository<SrNoEntity, Integer>{

	Optional<SrNoEntity> findByCode(String code);

}
