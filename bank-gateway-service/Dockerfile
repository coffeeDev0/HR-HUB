FROM eclipse-temurin:21-jdk

VOLUME /tmp

ADD target/bank-gateway-service.jar bank-gateway-service.jar

ENTRYPOINT [ "java","-jar","/bank-gateway-service.jar" ]

