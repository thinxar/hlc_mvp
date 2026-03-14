package com.palmyralabs.dms.policyBazaar.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.palmyralabs.dms.policyBazaar.entity.PbzDocumentTypeEntity;

public interface PbzDocumentTypeRepository extends MongoRepository<PbzDocumentTypeEntity, Integer>{

}
