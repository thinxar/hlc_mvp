package com.palmyralabs.dms.revival.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.palmyralabs.dms.revival.entity.RevPolicyEntity;

public interface RevPolicyRepository extends MongoRepository<RevPolicyEntity, Integer>{
	Optional<RevPolicyEntity> findById(Integer id);
	
	Optional<RevPolicyEntity> findByPolicyNumberAndSoCode(Long policyNumber, String soCode);

}
