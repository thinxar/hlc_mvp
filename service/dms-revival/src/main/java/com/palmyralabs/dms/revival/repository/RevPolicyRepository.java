package com.palmyralabs.dms.revival.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.palmyralabs.dms.revival.entity.RevPolicyEntity;

public interface RevPolicyRepository extends JpaRepository<RevPolicyEntity, Integer>{
	Optional<RevPolicyEntity> findById(Integer id);
	
	Optional<RevPolicyEntity> findByPolicyNumberAndSoCode(String policyNumber, String soCode);

}
