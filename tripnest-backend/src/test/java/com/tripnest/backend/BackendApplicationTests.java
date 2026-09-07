package com.tripnest.backend;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.ApplicationContext;
import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class BackendApplicationTests {

	@Test
	void contextLoads(ApplicationContext context) {
		assertThat(context).isNotNull();
		assertThat(context.getBean("tripService")).isNotNull();
		assertThat(context.getBean("mediaService")).isNotNull();
		assertThat(context.getBean("analyticsService")).isNotNull();
		assertThat(context.getBean("analyticsController")).isNotNull();
	}

}
