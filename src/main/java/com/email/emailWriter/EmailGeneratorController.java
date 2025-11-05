package com.email.emailWriter;

import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/email")
@AllArgsConstructor
public class EmailGeneratorController {
    @Autowired
    private EmailGeneratorService emailGeneratorService;
    @PostMapping("/generate")
    public ResponseEntity<String> generateEmail(@RequestBody EmailRequest emailRequest){
        String response =emailGeneratorService.generateEmailReply(emailRequest);
    return ResponseEntity.ok(response);
    }
}
