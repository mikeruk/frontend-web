package insuranceservices.frontendweb.clients;

import insuranceservices.frontendweb.DTOs.NewOfferRequestDto;
import insuranceservices.frontendweb.DTOs.NewOfferResponseDto;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.service.annotation.HttpExchange;
import org.springframework.web.service.annotation.PostExchange;

@HttpExchange(
        url = "/api/v1/offers",
        accept = "application/json",
        contentType = "application/json"
)
public interface OffersClient {

    @PostExchange("/create")
    NewOfferResponseDto createOffer(@RequestBody NewOfferRequestDto requestDto);
}
