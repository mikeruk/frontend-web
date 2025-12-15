package insuranceservices.frontendweb.controllers.impl;


import insuranceservices.frontendweb.DTOs.NewOfferRequestDto;
import insuranceservices.frontendweb.DTOs.NewOfferResponseDto;
import insuranceservices.frontendweb.clients.OffersClient;
import insuranceservices.frontendweb.controllers.OfferController;
import jakarta.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClientResponseException;

@RestController
@RequestMapping("/api")
public class OfferControllerImpl implements OfferController {

    private final OffersClient offersClient;

    public OfferControllerImpl(OffersClient offersClient) {
        this.offersClient = offersClient;
    }

    @PostMapping("/offers")
    public ResponseEntity<?> createOffer(@Valid @RequestBody NewOfferRequestDto req) {

        try {

            NewOfferResponseDto responseDto = offersClient.createOffer(req);
            return ResponseEntity.ok(responseDto);

        } catch (WebClientResponseException ex) {

            return ResponseEntity
                    .status(ex.getStatusCode())
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(ex.getResponseBodyAsString());
        }
    }
}
