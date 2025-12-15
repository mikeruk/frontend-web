package insuranceservices.frontendweb.config;

import insuranceservices.frontendweb.clients.OffersClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.support.WebClientAdapter;
import org.springframework.web.service.invoker.HttpServiceProxyFactory;

@Configuration
public class AppConfig {

    @Bean
    public WebClient offersWebClient(@Value("${offer-service.base-url}") String baseUrl) {
        return WebClient.builder()
                .baseUrl(baseUrl)
                .build();
    }

    @Bean
    public OffersClient offersClient(WebClient offersWebClient) {

        WebClientAdapter adapter = WebClientAdapter.create(offersWebClient);

        HttpServiceProxyFactory factory =
                HttpServiceProxyFactory
                        .builderFor(adapter).build();

        return factory.createClient(OffersClient.class);
    }
}
