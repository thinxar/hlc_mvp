package com.palmyralabs.dms.neft.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.palmyralabs.dms.neft.entity.NeftDocumentTypeEntity;

public interface NeftDocumentTypeRepository extends MongoRepository<NeftDocumentTypeEntity, Integer>{

}
