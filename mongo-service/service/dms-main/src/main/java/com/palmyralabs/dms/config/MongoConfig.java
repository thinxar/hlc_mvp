package com.palmyralabs.dms.config;

import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.Arrays;
import java.util.Date;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;
import org.springframework.data.convert.ReadingConverter;
import org.springframework.data.convert.WritingConverter;
import org.springframework.data.mongodb.core.convert.MongoCustomConversions;

@Configuration
public class MongoConfig {

	@Bean
	public MongoCustomConversions mongoCustomConversions() {
		return new MongoCustomConversions(Arrays.asList(
				LocalDateToUtcDateConverter.INSTANCE,
				UtcDateToLocalDateConverter.INSTANCE));
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
