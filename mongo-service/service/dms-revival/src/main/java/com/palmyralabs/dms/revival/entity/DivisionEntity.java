package com.palmyralabs.dms.revival.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Document(collection = "zone_divisions")
public class DivisionEntity {

    @Id
    private String id;
    private String zone;
    private String divisionName;
    private String doCode;
}