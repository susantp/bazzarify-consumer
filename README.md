[![Build and push Docker image to dockerhub](https://github.com/susantp/bazzarify-consumer/actions/workflows/docker_image.yml/badge.svg)](https://github.com/susantp/bazzarify-consumer/actions/workflows/docker_image.yml)

## Dependency security

Use Bun 1.4.4 or newer and commit `bun.lock` after dependency changes. CI and Docker builds install with `bun install --frozen-lockfile`. Run `bun audit` to check the locked dependency graph.

As of 2026-10-22, GHSA-vfj7-8cjw-p6xm affects `braces@3.0.3` and has no published patched release. It remains in the ESLint glob tooling dependency chain. Do not pass untrusted glob patterns to this tooling. Recheck the upstream advisory when updating dependencies; this residual finding is not suppressed.
