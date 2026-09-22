---
name: otserver-infra-cloud
description: >-
  OT Server infrastructure and cloud deployment standards: Docker containers,
  Kubernetes patterns, cloud hosting (AWS/GCP), backup strategies, monitoring
  and health checks for OT 7.4 server stability in production.
---

# OT Server Infrastructure & Cloud

## When to use

- Deploying OT 7.4 server to production environment
- Setting up Docker containers for server distribution
- Configuring monitoring and health check systems
- Planning cloud infrastructure for multi-region deployment

## Docker & Containerization

- **Official Docker Pattern:** Use multi-stage builds for minimal images
  ```dockerfile
  FROM otserver/otserv74:latest AS builder
  WORKDIR /build
  COPY . .
  
  FROM ubuntu:22.04 AS runtime
  RUN apt-get update && apt-get install -y libssl1.1 libstdc++6
  COPY --from=builder /build/otserv /usr/local/bin/otserv
  ENTRYPOINT ["otserv"]
  ```

- **Container Size:** Keep image < 200MB when possible (distroless base)
- **Entrypoint:** Always define ENTRYPOINT, never rely on default cmd
- **Volume Mounts:** Use named volumes for world data, config, logs
  ```yaml
  volumes:
    - otworld:/var/data/otserver
    - otilogs:/var/log/otserver
  ```

- **Health Checks:** Implement HTTP or TCP health check endpoint
  ```yaml
  healthcheck:
    test: ["CMD", "curl", "-f", "http://localhost:8081/v1/health"]
    interval: 30s
    timeout: 10s
    retries: 3
  ```

## Cloud Deployment Patterns

- **AWS ECS/Fargate:** Deploy OT server as Fargate service
  - Task definition with resource limits (CPU: 500m, Memory: 1GB)
  - Auto-scaling based on CPU utilization > 70%
  - Service connect for internal database access

- **GCP Cloud Run:** Container-native platform
  - Set maximum instance count for consistent availability
  - Environment variables for DB credentials (Secret Manager)

- **Multi-Region:** Use DNS-based failover (Route53/Cloud DNS)
  - Primary region + secondary region standby
  - Automated failover script on health check failure

## Backup & Recovery Strategy

- **Daily World Backups:** Automated snapshots of `data/` folder
  ```bash
  # Cron job - every 6 hours
  0 */6 * * * tar -czf /backups/world_$(date +\%F_\%H).tar.gz /path/to/ot/data/
  ```

- **Retention Policy:** Keep 7 daily + 4 weekly + 1 monthly backups
- **Point-in-Time Recovery:** Test restore procedure monthly
- **Backup Verification:** Run `otserv --check-backup` if available

## Monitoring & Observability

- **Essential Metrics:**
  - `otserver_players_online` - current player count
  - `otserver_uptime_seconds` - server uptime
  - `otserver_tps` - ticks per second (performance)
  - `otserver_memory_usage` - RSS memory in MB

- **Logging Structure:** Structured logs (JSON format) for easier analysis
  ```json
  {"timestamp":"2024-01-15T10:30:00Z","level":"INFO","message":"Player login","player_id":1,"world":"antica"}
  ```

- **Alerting Thresholds:**
  - Players online > 90% max capacity → warning
  - TPS < 15 → critical
  - Memory usage > 80% → warning
  - Crash/restart loop > 3 times/hour → critical

- **Prometheus Exporter:** If using monitoring stack
  ```yaml
  # expose /metrics endpoint
  metrics:
    port: 9797
    endpoints:
      - /players
      - /performance
  ```

## Infrastructure as Code

- **Terraform Example:** Basic OT server deployment
  ```hcl
  resource "docker_container" "otserver" {
    name   "otserver-74"
    image  "otserver/otserv74:latest"
    ports {
      internal = 7171
      external = 7171
    }
    env {
      DB_HOST = var.db_host
      DB_NAME = var.db_name
    }
    restart "unless-stopped"
  }
  ```

- **Secrets Management:** Never hardcode credentials
  - Use AWS Secrets Manager, HashiCorp Vault, or Kubernetes Secrets
  - Reference via environment variables at deployment time

## Cloud Cost Optimization

- **Right-size instances:** Start small, scale based on player count
- **Spot instances:** For standby/replica servers (can lose on interruption)
- **Scheduled scaling:** Scale down nights/weekends if player base varies
- **Reserved instances:** If predictable baseline player count > 6 months

## After Deployment

- Verify server starts correctly: `docker logsotserver-74 | grep -i "ready"`
- Test connection from expected IPs only
- Check backup integrity immediately after first backup cycle
- Document actual vs. expected resource usage for future planning