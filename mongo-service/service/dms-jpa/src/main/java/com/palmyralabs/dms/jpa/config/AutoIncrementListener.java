package com.palmyralabs.dms.jpa.config;

import java.lang.reflect.Field;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.FindAndModifyOptions;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.data.mongodb.core.mapping.event.BeforeConvertEvent;
import org.springframework.data.mongodb.core.mapping.event.AbstractMongoEventListener;
import org.springframework.stereotype.Component;

import com.palmyralabs.dms.base.annotation.AutoIncrementId;

@Component
public class AutoIncrementListener extends AbstractMongoEventListener<Object> {

    @Autowired
    private MongoTemplate mongoTemplate;

    @Override
    public void onBeforeConvert(BeforeConvertEvent<Object> event) {
        Object source = event.getSource();

        for (Field field : source.getClass().getDeclaredFields()) {
            if (field.isAnnotationPresent(AutoIncrementId.class)) {
                field.setAccessible(true);
                try {
                    Object value = field.get(source);
                    if (value == null) {
                        String seqName = source.getClass().getSimpleName() + "_seq";
                        int nextId = getNextSequence(seqName, source.getClass());
                        field.set(source, nextId);
                    }
                } catch (IllegalAccessException e) {
                    throw new RuntimeException(e);
                }
            }
        }
    }

    private int getNextSequence(String seqName, Class<?> entityClass) {
        Query query = new Query(Criteria.where("_id").is(seqName));
        Update update = new Update().inc("seq", 1);
        FindAndModifyOptions options = FindAndModifyOptions.options().returnNew(true).upsert(true);

        SequenceCounter counter = mongoTemplate.findAndModify(query, update, options, SequenceCounter.class);

        Integer maxIdInCollection = mongoTemplate.findAll(entityClass)
                                                 .stream()
                                                 .map(e -> {
                                                     try {
                                                         return (Integer) e.getClass().getMethod("getId").invoke(e);
                                                     } catch (Exception ex) {
                                                         return 0;
                                                     }
                                                 })
                                                 .max(Integer::compareTo)
                                                 .orElse(0);

        int nextSeq = Math.max(counter.getSeq(), maxIdInCollection + 1);
        counter.setSeq(nextSeq);
        mongoTemplate.save(counter);

        return nextSeq;
    }
}

