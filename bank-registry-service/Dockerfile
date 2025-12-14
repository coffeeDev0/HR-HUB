FROM eclipse-temurin:21-jdk

VOLUME /tmp

ADD target/bank-registry-service.jar bank-registry-service.jar

ENTRYPOINT [ "java","-jar","/bank-registry-service.jar" ]

