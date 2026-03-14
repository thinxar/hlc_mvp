package com.palmyralabs.dms.revival.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.palmyralabs.dms.revival.entity.RevDocumentTypeEntity;

public interface RevDocumentTypeRepository extends MongoRepository<RevDocumentTypeEntity, Integer>{

}
