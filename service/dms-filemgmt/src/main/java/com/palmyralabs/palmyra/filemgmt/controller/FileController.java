package com.palmyralabs.palmyra.filemgmt.controller;

import java.io.FileNotFoundException;
import java.nio.file.Paths;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import com.palmyralabs.palmyra.filemgmt.spring.ResponseFileEmitter;
import com.palmyralabs.palmyra.filemgmt.stream.AsyncStreamDelivery;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
public class FileController {
	
	private final AsyncStreamDelivery streamDelivery;

	@GetMapping("/hello")
	public ResponseFileEmitter get(HttpServletResponse response) throws FileNotFoundException {
		
		return streamDelivery.push(Paths.get("/home/ksvraja/devtools/gradle/LICENSE"));
		
	}
}
