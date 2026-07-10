package com.palmyralabs.dms.neft.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.palmyralabs.dms.neft.entity.NeftPolicyEntity;

public interface NeftPolicyRepository extends JpaRepository<NeftPolicyEntity, Integer> {
	Optional<NeftPolicyEntity> findById(Integer id);

	List<NeftPolicyEntity> findByPolicyNumber(Long policyNumber);

}
