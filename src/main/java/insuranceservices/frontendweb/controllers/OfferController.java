package insuranceservices.frontendweb.controllers;


import insuranceservices.frontendweb.DTOs.NewOfferRequestDto;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;

public interface OfferController {
    ResponseEntity<?> createOffer(@Valid @RequestBody NewOfferRequestDto req);
}
