package com.palmyralabs.dms.jpa.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.palmyralabs.dms.jpa.entity.DocumentTypeEntity;

public interface DocumentTypeRepository extends JpaRepository<DocumentTypeEntity, Integer>{

	Optional<DocumentTypeEntity> findByCode(String code);
}
