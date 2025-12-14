FROM eclipse-temurin:21-jdk

VOLUME /tmp

ADD target/bank_config_service.jar bank_config_service.jar 

ENTRYPOINT [ "java","-jar","/bank_config_service.jar" ]

