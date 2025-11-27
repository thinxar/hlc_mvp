package com.palmyralabs.dms.jpa.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.palmyralabs.dms.jpa.entity.PolicyFileEntity;

public interface PolicyFileRepository extends MongoRepository<PolicyFileEntity, Integer>{

	PolicyFileEntity findByPolicyId_IdAndId(Integer id,Integer fileId);

	Optional<PolicyFileEntity> findByObjectUrl(String objectUrl);

	Optional<PolicyFileEntity> findById(Integer id);
	
    List<PolicyFileEntity> findByPolicyId_Id(Integer policyId);

	 List<PolicyFileEntity> findByPolicyId_IdAndDocketType_Id(Integer policyId, Integer docketTypeId);  

}
