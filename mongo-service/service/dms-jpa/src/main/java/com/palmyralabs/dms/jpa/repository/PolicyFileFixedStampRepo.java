package com.palmyralabs.dms.jpa.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.palmyralabs.dms.jpa.entity.PolicyFileFixedStampEntity;

public interface PolicyFileFixedStampRepo  extends MongoRepository<PolicyFileFixedStampEntity, Integer>{

	List<PolicyFileFixedStampEntity> findBypolicyFile_id(Integer policyFileId);

	Optional<PolicyFileFixedStampEntity> findByPolicyFile_IdAndStamp_Id(Integer policyFile, Integer stamp);


}
