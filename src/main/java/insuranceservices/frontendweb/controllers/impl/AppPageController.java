package insuranceservices.frontendweb.controllers.impl;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class AppPageController {

    @GetMapping({"/"})
    public String index() {
        return "index"; // templates/index.html
    }
}
