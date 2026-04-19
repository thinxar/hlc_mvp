package com.palmyralabs.dms.revival.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.palmyralabs.dms.revival.entity.BranchEntity;

public interface BranchRepository extends MongoRepository<BranchEntity, Integer>{
	

}
