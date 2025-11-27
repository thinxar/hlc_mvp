//package com.palmyra.dms.jpa.config;
//
//import java.time.LocalDate;
//
//import org.springframework.context.annotation.Configuration;
//import org.springframework.data.mongodb.core.mapping.event.BeforeConvertCallback;
//
//import com.palmyralabs.dms.jpa.entity.Auditable;
//import com.palmyralabs.dms.jpa.entity.Timestamps;
//
//@Configuration
//public class MongoAuditingConfig implements BeforeConvertCallback<Auditable> {
//
//    @Override
//    public Auditable onBeforeConvert(Auditable entity, String collection) {
//        Timestamps ts = entity.getTimestamps();
//        
//        if (ts == null) {
//            ts = new Timestamps();
//            ts.setCreatedOn(LocalDate.now());
//            ts.setLastUpdOn(LocalDate.now());
//            ts.setCreatedBy("SYSTEM");
//            ts.setLastUpdBy("SYSTEM");
//            entity.setTimestamps(ts);
//        } else {
//            ts.setLastUpdOn(LocalDate.now());
//            ts.setLastUpdBy("SYSTEM");
//        }
//
//        return entity;
//    }
//}
//
//
//


