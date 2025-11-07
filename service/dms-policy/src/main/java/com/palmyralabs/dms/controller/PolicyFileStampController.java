package com.palmyralabs.dms.controller;

import java.io.IOException;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.palmyralabs.dms.service.FileService;
import com.palmyralabs.palmyra.core.rest.controller.AbstractController;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping(path = "${palmyra.servlet.prefix-path:#{'palmyra'}}/policy")
public class PolicyFileStampController extends AbstractController {

	private final FileService fileService;

	@GetMapping("/fixedStamp/{stamp}")
	public void getStampForPolicy(HttpServletRequest request,
			HttpServletResponse response, @PathVariable("stamp") String code) throws IOException {
		fileService.getStamp(request,response,code);
	}

}
