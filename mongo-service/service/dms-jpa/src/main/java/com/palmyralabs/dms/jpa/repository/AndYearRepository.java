package com.palmyralabs.dms.jpa.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.palmyralabs.dms.jpa.entity.AndYearEntity;

public interface AndYearRepository extends MongoRepository<AndYearEntity, Integer> {

	Optional<AndYearEntity> findByCode(String code);

}
