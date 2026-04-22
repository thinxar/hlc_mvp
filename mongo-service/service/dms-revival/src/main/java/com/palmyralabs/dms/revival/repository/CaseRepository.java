package com.palmyralabs.dms.revival.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.palmyralabs.dms.revival.entity.CaseEntity;

public interface CaseRepository extends MongoRepository<CaseEntity, String> {
}
