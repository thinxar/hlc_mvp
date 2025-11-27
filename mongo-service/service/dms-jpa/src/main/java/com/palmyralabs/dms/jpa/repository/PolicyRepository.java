package com.palmyralabs.dms.jpa.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.palmyralabs.dms.jpa.entity.PolicyEntity;

public interface PolicyRepository extends MongoRepository<PolicyEntity, Integer>{

	Optional<PolicyEntity> findById(Integer id);

	List<PolicyEntity> findByPolicyNumber(Long policyNumber);

}
