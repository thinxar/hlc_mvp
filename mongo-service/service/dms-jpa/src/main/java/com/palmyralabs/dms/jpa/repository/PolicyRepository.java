package com.palmyralabs.dms.jpa.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.palmyralabs.dms.jpa.entity.PolicyEntity;

public interface PolicyRepository extends MongoRepository<PolicyEntity, Integer>{

	Optional<PolicyEntity> findById(Integer id);

	List<PolicyEntity> findByPolicyNumber(Long policyNumber);
	
	Optional<PolicyEntity> findByPolicyNumberAndBranchCode(Long policyNumber, String branchCode);

	Page<PolicyEntity> findBySoCodeAndSrNo(String soCode, String srNo, Pageable pageable);

	Page<PolicyEntity> findBySoCode(String soCode, Pageable pageable);

}
