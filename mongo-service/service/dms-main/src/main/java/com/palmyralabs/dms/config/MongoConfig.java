package com.palmyralabs.dms.config;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneOffset;
import java.util.Arrays;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import jakarta.annotation.PostConstruct;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.core.convert.converter.Converter;
import org.springframework.data.convert.ReadingConverter;
import org.springframework.data.convert.WritingConverter;
import org.springframework.data.mapping.model.SimpleTypeHolder;
import org.springframework.data.mongodb.MongoDatabaseFactory;
import org.springframework.data.mongodb.core.convert.DbRefResolver;
import org.springframework.data.mongodb.core.convert.DefaultDbRefResolver;
import org.springframework.data.mongodb.core.convert.MappingMongoConverter;
import org.springframework.data.mongodb.core.convert.MongoCustomConversions;
import org.springframework.data.mongodb.core.mapping.MongoMappingContext;
import org.springframework.data.mongodb.core.mapping.MongoSimpleTypes;
import org.springframework.data.util.TypeInformation;

@Configuration
public class MongoConfig {

	private static final Logger log = LoggerFactory.getLogger(MongoConfig.class);

	@PostConstruct
	public void init() {
		log.info(">>> MongoConfig loaded — LocalDate registered as simple type, UTC converters active");
	}

	@Primary
	@Bean
	public MongoCustomConversions mongoCustomConversions() {
		return new MongoCustomConversions(Arrays.asList(
				LocalDateToUtcDateConverter.INSTANCE,
				UtcDateToLocalDateConverter.INSTANCE));
	}

	@Primary
	@Bean
	public MongoMappingContext mongoMappingContext(ApplicationContext applicationContext,
			MongoCustomConversions conversions) {
		Set<Class<?>> simpleTypes = new HashSet<>();
		simpleTypes.add(LocalDate.class);
		simpleTypes.add(LocalDateTime.class);
		simpleTypes.add(LocalTime.class);
		simpleTypes.add(Instant.class);

		SimpleTypeHolder holder = new SimpleTypeHolder(simpleTypes, MongoSimpleTypes.HOLDER);

		MongoMappingContext context = new MongoMappingContext() {
			@Override
			protected boolean shouldCreatePersistentEntityFor(TypeInformation<?> type) {
				Class<?> c = type.getType();
				if (c == LocalDate.class || c == LocalDateTime.class
						|| c == LocalTime.class || c == Instant.class) {
					return false;
				}
				return super.shouldCreatePersistentEntityFor(type);
			}
		};
		context.setApplicationContext(applicationContext);
		context.setSimpleTypeHolder(holder);
		context.setAutoIndexCreation(false);
		context.afterPropertiesSet();
		log.info(">>> MongoMappingContext built with LocalDate in SimpleTypeHolder + hard guard");
		return context;
	}

	@Primary
	@Bean
	public MappingMongoConverter mappingMongoConverter(MongoDatabaseFactory factory,
			MongoMappingContext context, MongoCustomConversions conversions) {
		DbRefResolver dbRefResolver = new DefaultDbRefResolver(factory);
		MappingMongoConverter converter = new MappingMongoConverter(dbRefResolver, context);
		converter.setCustomConversions(conversions);
		converter.setMapKeyDotReplacement("_");
		converter.afterPropertiesSet();
		log.info(">>> MappingMongoConverter built with custom conversions + explicit context");
		return converter;
	}

	@WritingConverter
	public enum LocalDateToUtcDateConverter implements Converter<LocalDate, Date> {
		INSTANCE;

		@Override
		public Date convert(LocalDate source) {
			return Date.from(source.atStartOfDay(ZoneOffset.UTC).toInstant());
		}
	}

	@ReadingConverter
	public enum UtcDateToLocalDateConverter implements Converter<Date, LocalDate> {
		INSTANCE;

		@Override
		public LocalDate convert(Date source) {
			return source.toInstant().atZone(ZoneOffset.UTC).toLocalDate();
		}
	}
}
