# infra/

Infrastructure-as-code (Terraform) for GCP resources in the `z-megarepo`
project.

## Architecture

```mermaid
graph LR
    subgraph "Your Devices"
        Phone["Phone (Termius)"]
        Laptop["Laptop"]
    end

    subgraph "GitHub"
        Repo["z-megarepo"]
        Actions["GitHub Actions"]
    end

    subgraph "GCP"
        Bucket["GCS Bucket<br/>(Terraform State)"]
        VM["e2-medium VM<br/>Debian 12 · 20GB SSD<br/>us-east1-b"]
    end

    Phone -- SSH --> VM
    Laptop -- SSH --> VM
    Repo -- push/PR --> Actions
    Actions -- "terraform plan/apply" --> GCP
    Actions -- "Workload Identity<br/>Federation (keyless)" --> GCP
    Actions -- "read/write state" --> Bucket
```

## CI flow

```mermaid
flowchart TD
    A[PR opened/updated] --> B["terraform plan"]
    B --> C[Post plan as PR comment]
    D[Merge to master] --> E["terraform apply"]
    E --> F[Infrastructure updated]

    style A fill:#f5f5f5,stroke:#333
    style D fill:#f5f5f5,stroke:#333
```

Auth via Workload Identity Federation (no stored keys). See
[`bootstrap/`](bootstrap/) for the one-time setup.

## Directory layout

- **[`bootstrap/`](bootstrap/)** — One-time GCP project setup: remote state
  bucket, service account, and Workload Identity Federation for CI.
- **[`cloud-dev-vm/`](cloud-dev-vm/)** — Terraform root module for a remote
  development environment (e2-medium, Debian 12, static IP, OS Login).

## Future work

- **Billing alerts** (`infra/billing/`) — budget thresholds, email notifications
- **Auto-shutdown / scheduling** — stop VM during off-hours to save cost
- **Spot/preemptible** — evaluate for further cost savings
