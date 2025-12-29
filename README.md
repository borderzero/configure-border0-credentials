# Configure Border0 Credentials

GitHub Action to exchange GitHub OIDC tokens for Border0 credentials.

## Usage

```yaml
name: Example
on: workflow_dispatch

permissions:
  id-token: write
  contents: read

jobs:
  example:
    runs-on: ubuntu-latest
    steps:
      - name: Configure Border0 Credentials
        id: border0
        uses: borderzero/configure-border0-credentials@v0.0.4
        with:
          border0-org-subdomain: <your-org-subdomain>
          border0-svc-account-name: <your-service-account-name>
          border0-token-duration-seconds: 3600

      - name: Use Border0 Token
        run: echo "Token received: ${{ steps.border0.outputs.token }}"
```

## Inputs

| Input | Description | Required | Default |
|-------|-------------|----------|---------|
| `border0-org-subdomain` | Border0 organization name | Yes | - |
| `border0-svc-account-name` | Border0 service account name | Yes | - |
| `border0-token-duration-seconds` | Token duration in seconds | No | `3600` |
| `border0-api-url` | Border0 API base URL | No | `https://api.border0.com/api/v1` |

## Outputs

| Output | Description |
|--------|-------------|
| `token` | Border0 authentication token |

## Requirements

- GitHub workflow must have `id-token: write` permission to generate OIDC tokens
