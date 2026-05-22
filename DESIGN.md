# Design: Unified Tag Schema for Docker Images and Helm Charts

## Summary

Refactor the CI workflows to use a unified, predictable tag schema for both Docker images and Helm charts across PRs, pushes to main, and release tags. Move tag computation into the `workflow-metadata` action as a JSON structure (`stable-tag` + `additional-tags`), add main branch triggers for the helm workflow, and refactor the PR cleanup workflow into a general tag cleanup workflow that also removes stale `<version>-main` tags on release.

## Goals

- **Unified tag format**: Docker images and Helm charts follow the same versioned tag naming convention so users only need to learn one schema.
- **Predictable PR tags**: Every PR gets a stable versioned tag plus a per-commit SHA tag for both Docker and Helm.
- **Main branch publishing**: Helm charts are published on every push to main with a `<version>-main` tag. Docker images also get `<version>-main` alongside the existing bare `main` tag.
- **Centralized tag logic**: The `workflow-metadata` action computes all tags as a JSON object (`stable-tag` + `additional-tags`), making workflows simple consumers.
- **Automatic cleanup**: PR-close deletes all PR-specific tags; release deletes the corresponding `<version>-main` tag.
- **Aligned version computation**: Both app and chart versions use `uv-dynamic-versioning` with `bump=true`, ensuring PR/main versions are always one step ahead of the latest release.

## Non-Goals

- No changes to the Docker build process, multi-platform support, or build caching strategy.
- No changes to the Helm chart content, dependencies, or `values.yaml` structure beyond version injection.
- No changes to the `Chart.yaml` dependency on `ravnar`.
- No changes to the release tag format (`vX.Y.Z` for app, `chart/vX.Y.Z` for chart).

## Background / Motivation

### Current State (after partial refactoring)

The CI has three workflows (`docker.yml`, `helm.yml`, `pr-cleanup.yml`) and two composite actions (`workflow-metadata`, `patch-helm-chart`). A partial refactoring commit already restructured `workflow-metadata` into three steps (`workflow`, `git`, `docker`) and introduced an `image-tag` output. However, it is incomplete and introduces a bug:

**`workflow-metadata/action.yml` (partially refactored):**
- Restructured into `workflow`, `git`, `docker` steps
- Outputs: `workflow-type`, `app-version-raw`, `app-version-latest`, `chart-version-latest`, `image-tag`
- `image-tag` uses **dashes** (`pr-<number>-<app-version>`) instead of periods
- No JSON output for centralized tag management (`stable-tag` + `additional-tags`)
- Chart version still uses raw `git describe` — no `uv-dynamic-versioning` with `pattern_prefix="chart/"`
- No `app-base-version` or `chart-base-version` outputs

**`docker.yml` (partially refactored):**
- Uses `image-tag` as the primary tag (replaces old multi-tag approach)
- Still uses dash format: `pr-${{ github.event.number }}` for the PR convenience tag
- Cache tags still use dash format: `pr-${{ github.event.number }}-buildcache`
- Missing `<base>.pr.<number>` and `<base>.pr.<number>.<sha>` tags for PRs
- Missing `<base>.main` tag for main pushes

**`helm.yml` (not updated, has a bug):**
- Uses `chart-version-latest` + suffix approach (no bumping)
- **Bug**: `APP_VERSION` is set to `image-tag` (e.g. `pr-42-0.1.0.dev9-g66ea5c8`) instead of `app-version-raw`. This produces an invalid `appVersion` in Chart.yaml.
- Missing `push: branches: ["main"]` trigger — charts are never published on main

**`pr-cleanup.yml` (not updated):**
- Only triggers on PR close — no release tag trigger
- Regex matches old dash format: `(^pr-${PR_NUMBER}($|-))|(-pr\.${PR_NUMBER}$)`
- No `<version>-main` cleanup
- Still named "PR cleanup" rather than a general tag cleanup

### Problem

- Users can't predict what tag to pull for a PR or main build — the schema differs between Docker and Helm.
- Helm charts on PRs use the *latest released* version as base, while Docker images use a *bumped* version. This inconsistency is confusing.
- There's no way to pin a Helm chart from main at a specific version.
- The `pr-cleanup` workflow doesn't handle release-time cleanup of `<version>-main` tags.
- The bug in `helm.yml` (`APP_VERSION` set to `image-tag` instead of `app-version-raw`) corrupts the `appVersion` field in Chart.yaml.

## Design

### Tag Schema

| Trigger | Docker Image Tags | Helm Chart Version |
|---|---|---|
| **PR** | `pr.<number>` (convenience)<br>`<base>-pr.<number>` (stable)<br>`<base>-pr.<number>.<sha>` (per-commit) | `<base>-pr.<number>` (stable)<br>`<base>-pr.<number>.<sha>` (per-commit) |
| **Push to main** | `main` (permanent, never cleaned)<br>`<base>-main` | `<base>-main` |
| **Release** (`v*` / `chart/v*`) | `latest` (permanent, never cleaned)<br>`<version>` | `<version>` |

Where:
- `<base>` is the **bumped** version (e.g. `0.0.20` when latest tag is `v0.0.19`)
- `<sha>` is the short git commit SHA (e.g. `66ea5c8`)
- `<number>` is the PR number (e.g. `42`)
- `<version>` is the raw version from the release tag (e.g. `0.0.20`)

**Why this format:**
- Helm chart versions are semver pre-release identifiers: `0.0.20-pr.42` = version `0.0.20`, pre-release identifiers `pr` and `42`. Periods separate semver identifiers within the pre-release segment, giving correct numeric ordering (`pr.2` < `pr.12`).
- Docker tags reuse the same string (Docker allows any characters), so users learn one format that works everywhere.
- The bare `pr.<number>` Docker tag is a convenience short form (no version prefix). It has no Helm equivalent because Helm requires semver.
- The bare `main` and `latest` Docker tags are Docker-specific conveniences (Helm doesn't support non-semver versions).

### Version Computation

Both app and chart versions use `uv-dynamic-versioning` with `bump=true`, ensuring the base version is always one step ahead of the latest tag.

**App version** (existing, unchanged):
```python
# Already configured in backend/pyproject.toml
[tool.uv-dynamic-versioning]
vcs = "git"
style = "pep440"
bump = true
ignore_untracked = true
```
Produces output like `0.1.0.dev9+g66ea5c8`. The base version is `0.1.0`.

**Chart version** (new):
```python
import dataclasses
from uv_dynamic_versioning.main import get_version
from uv_dynamic_versioning.version_source import DynamicVersionSource

source = DynamicVersionSource(root=".", config={})
config = dataclasses.replace(source.project_config, pattern_prefix="chart/")
version_obj = get_version(config)
# version_obj.base == "0.0.20" (bumped from latest chart/v0.0.19)
```
This is run from `./backend` where `uv` is already set up, using the same `uv-dynamic-versioning` library. The `pattern_prefix="chart/"` tells it to look for `chart/v*` tags instead of `v*` tags.

### workflow-metadata Action Changes

The action outputs a JSON string with pre-computed tags:

```json
{
  "app-version": "0.1.0.dev9+g66ea5c8",
  "app-base-version": "0.1.0",
  "chart-base-version": "0.0.20",
  "stable-tag": "0.1.0-pr.42.66ea5c8",
  "additional-tags": ["0.1.0-pr.42", "0.1.0-main"]
}
```

Structure:
- `app-version`: Raw pep440 version from `hatch version`. Used for `appVersion` in Chart.yaml and Docker build args.
- `app-base-version`: The bumped base version (e.g. `0.1.0`). Used as prefix for versioned tags.
- `chart-base-version`: The bumped chart base version (e.g. `0.0.20`). Used as prefix for chart versioned tags.
- `stable-tag`: The canonical versioned tag for this build. For PRs: `<app-base>-pr.<number>.<sha>`. For main: `<app-base>-main`. For releases: `<app-version>` (e.g. `0.0.20`). On release commits, `uv-dynamic-versioning` with `bump=true` returns the exact tag version (distance=0, no `.dev` suffix), so `app-base-version` equals the release version.
- `additional-tags`: All other versioned tags to push (excludes Docker-specific bare tags like `main`, `latest`, `pr.<number>`).

Workflows consume this via `fromJson()` in GHA expressions:

```yaml
- name: Setup image metadata
  uses: docker/metadata-action@v6
  with:
    tags: |
      type=raw,value=${{ fromJson(steps.workflow-metadata.outputs.tags).stable-tag }}
      ${{ join(fromJson(steps.workflow-metadata.outputs.tags).additional-tags, '\n') }}
      type=raw,value=pr.${{ github.event.number }},enable=${{ ... == 'PR' }}
      type=raw,value=latest,enable=${{ ... == 'release' }}
```

### Docker Workflow Changes

- Replace the old `image-tag` output consumption with `fromJson(steps.workflow-metadata.outputs.tags).stable-tag` + `additional-tags`.
- Keep Docker-specific tags (`pr.<number>`, `latest`, `main`) in the `metadata-action` step as today. Change dash-based `pr-${{ github.event.number }}` to period-based `pr.${{ github.event.number }}`.
- Add `<app-base>.main` tag for main pushes alongside the existing bare `main` tag.
- Update cache tags to use the new period-based format (`pr.42-buildcache` instead of `pr-42-buildcache`).
- No changes to build args (`app-version-raw`), platforms, or push logic.

### Helm Workflow Changes

- **Add trigger**: `push: branches: ["main"]` so charts publish on every main push.
- Remove the old `Set versions` step that manually constructed chart versions (it also has a bug: `APP_VERSION` is set to `image-tag` instead of `app-version-raw`).
- Construct chart versions using `chart-base-version` from the metadata action with the same suffix pattern used for Docker tags:
  - **PR**: `<chart-base>-pr.<number>` (stable) and `<chart-base>-pr.<number>.<sha>` (per-commit)
  - **Main**: `<chart-base>-main`
  - **Release**: `<raw-chart-version>` extracted from the pushed tag (e.g. `0.0.20` from `chart/v0.0.20`)
- For Helm, the `appVersion` field in Chart.yaml is set to `app-version-raw` (the raw pep440 version, e.g. `0.1.0.dev9+g66ea5c8`). This is correct because `appVersion` is not semver-constrained.
- The `version` field gets the chart-specific version (e.g. `0.0.20-pr.42`).

Note: the `stable-tag` and `additional-tags` in the JSON output use `app-base-version` (for Docker). The helm workflow constructs its own chart versions using `chart-base-version`. This is necessary because app and chart versions come from different tag namespaces (`v*` vs `chart/v*`) and have different base numbers.

### Tag Cleanup Workflow (renamed from `pr-cleanup.yml`)

Renamed to `tag-cleanup.yml` with two trigger paths:

**1. On PR close** (`pull_request.types: [closed]`):
- Delete all tags containing `pr.<number>` (e.g. `0.1.0-pr.42`, `0.1.0-pr.42.66ea5c8`, `pr.42`)
- Uses `skopeo list-tags | jq '.Tags[] | select(contains("pr.42"))'` — no regex needed
- Applies to all three registries: backend, frontend, charts

**2. On release** (`push.tags: ['v*', 'chart/v*']`):
- Extract the version from the pushed tag (e.g. `0.0.20` from `v0.0.20` or `chart/v0.0.20`)
- Delete `<version>-main` from all three registries (e.g. `0.0.20-main`)
- This prevents stale main tags accumulating alongside the new release
- The cleanup runs for both app releases (`v*`) and chart releases (`chart/v*`), but always deletes the version number from the tag. Since app and chart releases are typically pushed together with the same version number, this is fine. Even if only one is pushed, the cleanup is best-effort — deleting a non-existent tag is a no-op.

### Cleanup Workflow Trigger Configuration

```yaml
on:
  pull_request:
    types: [closed]
  push:
    tags: ['v[0-9]+.[0-9]+.[0-9]+', 'chart/v[0-9]+.[0-9]+.[0-9]+']

jobs:
  cleanup:
    if: github.event_name == 'pull_request' || github.ref_type == 'tag'
```

The `if` condition ensures the cleanup job only runs for the intended triggers. The version is extracted from `github.ref_name` (e.g. `v0.0.20` → `0.0.20` by stripping the `v` or `chart/v` prefix).

## Tradeoffs & Risks

1. **uv-dynamic-versioning for charts** — Running the chart version computation from `./backend` ties the chart versioning to the backend's Python environment. This is acceptable because: (a) `uv` is already set up there for app versioning, (b) the `uv-dynamic-versioning` library is a pure dependency, and (c) the chart version only depends on git tags, not on backend code.

2. **Semver pre-release sorting** — `0.0.20-pr.42` sorts before `0.0.20` (release), which is correct for semver. But `0.0.20-pr.42.66ea5c8` sorts after `0.0.20-pr.42` because semver compares pre-release identifiers left-to-right: `pr` == `pr`, then `42` == `42`, then `66ea5c8` (extra identifier) sorts higher. This means the per-commit tag is considered "newer" than the stable PR tag, which is the desired behavior.

3. **Docker tag `pr.<number>` collision** — If the app version is `0.1.0` and a PR is `42`, the tags `pr.42` and `0.1.0-pr.42` are distinct. But if someone accidentally uses the `pr.<number>` convention as a release tag, it could conflict. This is a negligible risk.

4. **Cleanup on release is best-effort** — If a release tag is pushed but the cleanup workflow fails, the old `<version>-main` tag persists. This is benign — it just means an extra tag exists. Users pulling `<version>-main` would get the main build instead of the release, but they should be pulling `<version>` for releases anyway.

5. **Helm chart `appVersion` vs `version`** — The `appVersion` in Chart.yaml uses the raw pep440 version (e.g. `0.1.0.dev9+g66ea5c8`), while `version` uses the semver-compatible chart version (e.g. `0.0.20-pr.42`). This is intentional: `appVersion` is not semver-constrained and can carry full build metadata.

## Testing Strategy

### Workflow Validation

- **Unit test the version computation script**: Create a test that runs the chart version script against a repo with known tags and verifies the output (base version, distance, commit SHA).
- **Dry-run PR**: Open a test PR and verify that all expected tags are generated for both Docker and Helm without actually pushing to the registry (use `docker/metadata-action` dry-run or `--dry-run` flag on build-push-action).

### Integration Testing

- **PR flow**: Open a PR and verify:
  - Docker images get tags: `pr.<N>`, `<base>-pr.<N>`, `<base>-pr.<N>.<sha>`
  - Helm chart gets version: `<base>-pr.<N>` (stable) and `<base>-pr.<N>.<sha>` (per-commit)
  - Both use the same base version prefix
- **Main push flow**: Merge to main and verify:
  - Docker images get tags: `main`, `<base>-main`
  - Helm chart gets version: `<base>-main`
- **Release flow**: Push a `v0.0.20` / `chart/v0.0.20` tag and verify:
  - Docker images get tags: `latest`, `0.0.20`
  - Helm chart gets version: `0.0.20`
  - `0.0.20-main` is deleted from all registries

### Cleanup Testing

- **PR close**: Close a PR and verify all tags containing `pr.<N>` are deleted from all three registries.
- **Release cleanup**: Push a release tag and verify the corresponding `<version>-main` tag is deleted.
- **Edge case**: Push a release tag when no `<version>-main` exists (e.g., first release). Cleanup should succeed without errors.

### Regression Testing

- Verify the `docker/metadata-action` labels are still correctly set (source, revision, event metadata).
- Verify Docker build caching still works with the renamed cache tags.
- Verify the `patch-helm-chart` action still correctly injects versions into `Chart.yaml` and `values.yaml`.
- Verify the `ravnar` dependency version in `values.yaml` is still set correctly.

## Open Questions
