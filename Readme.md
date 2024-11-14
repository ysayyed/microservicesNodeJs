# Node JS based containerized microservices project

## Microservice architecure pattern specs:

- API Gateway pattern
- HTTP Proxy pattern
- Database per service pattern

> For building images & to run containers, type:

```
docker-compose up -d --build
```

> See docker logs for containers using

```
docker logs <container id>
```

**.env variables**

- GATEWAY_PORT=3000
- AUTH_PORT=3001
- AUTH_URL = http://auth-service:3001
