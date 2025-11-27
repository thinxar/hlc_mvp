package com.palmyralabs.dms.masterdata.controller;


import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.palmyralabs.dms.masterdata.model.EndorsementTypeModel;
import com.palmyralabs.dms.masterdata.service.EndorsementTypeService;
import com.palmyralabs.palmyra.base.PalmyraResponse;
import com.palmyralabs.palmyra.core.rest.controller.AbstractController;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping(path = "${palmyra.servlet.prefix-path:#{'palmyra'}}/masterdata")
public class EndorsementTypeController extends AbstractController {

    private final EndorsementTypeService endorsementTypeService;

    @PostMapping("/endorsementType")
	public PalmyraResponse<EndorsementTypeModel>  createEndorsementType(@RequestBody EndorsementTypeModel request) {
		return apiResponse(endorsementTypeService.createEndorsementType(request));
	}
    
    @GetMapping("/endorsementType")
    public PalmyraResponse<List<EndorsementTypeModel>> getAll() {
        return apiResponse(endorsementTypeService.getAll());
    }

    @GetMapping("/endorsementType/{id}")
    public PalmyraResponse<EndorsementTypeModel> getById(@PathVariable("id") Integer id) {
        return apiResponse(endorsementTypeService.getById(id));
    }
}

