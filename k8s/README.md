# k3s frontend deployment

This directory contains frontend-only manifests for `baeksungbus_web`.

The backend repository owns:

- API Deployment and Service
- MySQL StatefulSet and Service
- `/api` Ingress route

This frontend repository owns:

- Web Deployment and Service
- `/` Ingress route

## GitHub Actions

`.github/workflows/deploy.yaml` builds and pushes the frontend image, copies this
`k8s/` directory to the k3s server, updates the image placeholder, and applies
the frontend manifests.

Required GitHub Environment or Repository secrets:

- `DOCKER_USERNAME`
- `DOCKER_PASSWORD`
- `SSH_HOST`
- `SSH_PORT`
- `SSH_USER`
- `SSH_PRIVATE_KEY`
- `KUBE_CONFIG_B64`
- `VITE_API_URL`
- `VITE_KAKAO_MAP_API_KEY`

Create `KUBE_CONFIG_B64` on the k3s server:

```bash
sudo cat /etc/rancher/k3s/k3s.yaml | base64 -w0
```

Recommended `VITE_API_URL` value for same-host deployment:

```text
https://bs.baeksung.kr
```
