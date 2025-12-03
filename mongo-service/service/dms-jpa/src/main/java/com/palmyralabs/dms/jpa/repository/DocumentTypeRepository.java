package com.palmyralabs.dms.jpa.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.palmyralabs.dms.jpa.entity.DocumentTypeEntity;

public interface DocumentTypeRepository extends MongoRepository<DocumentTypeEntity, Integer>{

	Optional<DocumentTypeEntity> findById(Integer id);

	Optional<DocumentTypeEntity> findByCode(String code);

	List<DocumentTypeEntity> findByIdNot(Integer id);
}
