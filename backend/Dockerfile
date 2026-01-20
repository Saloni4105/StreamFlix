# Use Java 17 (Spring Boot compatible & stable)
FROM eclipse-temurin:17-jdk-alpine

# App directory
WORKDIR /app

# Copy all backend files
COPY . .

# Build the application (skip tests for faster deploy)
RUN ./mvnw clean package -DskipTests

# Expose port used by Spring Boot
EXPOSE 8080

# Run the jar
CMD ["java", "-jar", "target/*.jar"]
