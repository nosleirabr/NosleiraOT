---
name: otserver-release-process
description: >-
  OT Server release and versioning standards: semantic versioning (MAJOR.MINOR.PATCH),
  release workflow (branch → PR → test → tag → deploy), changelog automation,
  rollback procedures and post-release validation for OT 7.4 base stability.
---

# OT Server Release Process

## When to use

- Creating new release tags for OT 7.4 base
- Merging features into stable branch
- Preparing deployment packages for production
- Managing hotfixes and emergency patches

## Semantic Versioning Rules

- **MAJOR** (breaking changes): Incompatible API changes, major gameplay mechanic overhauls
  - Example: `2.0.0` - new engine version, requires client update
  - Example: `7.5.0` - new content system, not backward compatible

- **MINOR** (new features): Adding functionality without breaking existing
  - Example: `7.4.1` - new NPCs, systems, commands
  - Example: `7.4.2` - security fixes, performance improvements

- **PATCH** (bug fixes): Internal changes, bug fixes, security patches
  - Example: `7.4.0` - critical bug fix, balance adjustment
  - Example: `7.4.1` - packet exploit fix, memory leak patch

## Release Workflow

```
1. Feature branch → develop/master
   └─ Branch: feature/Nome-da-functionalida

2. Pull Request
   └─ Apply `otserver-developer` standards
   └─ Run tests from `otserver-testing-ci`
   └─ Code review with checklist

3. Release branch
   └─ Branch: release/7.4.x
   └─ Bump version in `data/version.txt` or similar
   └─ Generate changelog (auto or manual)

4. Tag & Release
   └─ Tag: v7.4.x
   └─ Release assets: server binary, scripts, docs
   └─ Publish to distribution channel (GitHub Release, Docker Hub, etc.)

5. Production Deploy
   └─ Deploy tested tag to staging first
   └─ Smoke test: server start, login, basic actions
   └─ Deploy to production after validation
```

## Changelog Automation

- **Keep a CHANGELOG.md** at repo root following Keep a Changelog format
  ```markdown
  # Changelog
  All notable changes to this project will be documented in this file.

  The format is based on [Keep a Changelog](https://keepachangelog.com/)
  and this project adheres to [Semantic Versioning](https://semver.org/).

  ## [Unreleased]
  ### Added
  - New fire elemental NPC

  ## [7.4.2] - 2024-01-15
  ### Fixed
  - Memory leak in creature movement
  - Packet exploit in trade window

  ### Changed
  - Optimized pathfinding algorithm

  ### Deprecated
  - Old teleport script (use new system)
  ```

- **Automated generation:** Use `git log` + `github/changelog` tooling
  ```bash
  # Generate changelog between tags
  git log v7.4.1..v7.4.2 --pretty=format:"- %s" > CHANGELOG.md
  ```

- **Per category:** Use `Added`, `Changed`, `Deprecated`, `Fixed`, `Security`

## Rollback Procedure

- **Always keep last 2 releases deployable**
  ```bash
  # Before new release:
  docker tag otserver:7.4.1 otserver:7.4.1-backup
  
  # If new release breaks:
  docker stop otserver-container
  docker rm otserver-container
  docker run -d --name otserver-container otserver:7.4.1-backup
  ```

- **Database compatibility:** Ensure world/data backward compatibility
  - Test old world format can read with new server version
  - Have SQL migration scripts ready if schema changed
  - Document breaking changes in release notes

- **Rollback checklist:**
  ```
  [ ] Identify symptom / bug in new release
  [ ] Stop current server container
  [ ] Deploy previous stable tag
  [ ] Verify world loads without corruption
  [ ] Test critical functions (login, trade, combat)
  [ ] Communicate to players if downtime needed
  [ ] Investigate root cause of issue
  [ ] Plan next fix release timeline
  ```

## Version Bumping Automation

- **Git tags:** `git tag v7.4.2` + `git push origin v7.4.2`
- **Version file:** Keep single source of truth
  - `data/version.txt` containing `7.4.2`
  - Script to update: `./scripts/bump-version.sh minor|major|patch`
- **CI integration:** Auto-create release on tag push
  ```yaml
  # .github/workflows/release.yml
  on:
    push:
      tags: ['v*.*.*']
  
  jobs:
    release:
      runs-on: ubuntu-latest
      steps:
        - name: Create GitHub Release
          uses: softprops/action-gh-release@v1
          with:
            tag_name: ${{ github.ref }}
            generate_release_notes: true
  ```

## Release Release Checklist

```
[ ] All tests passing (otserver-testing-ci)
[ ] Code review completed (otserver-developer)
[ ] CHANGELOG.md updated with all changes
[ ] Version bumped in version.txt or equivalent
[ ] Git tag created: v7.4.x
[ ] Docker image built and pushed to registry
[ ] Staging deployment tested successfully
[ ] Backup created before production deploy
[ ] Release notes documented (what's new, fixed, changed)
[ ] Rollback procedure documented and tested
[ ] Announcement prepared for players (if needed)
```

## Post-Release Validation

- **First 24h monitoring:** Check player count, crashes, performance
- **Critical issue window:** If severe bug found, create hotfix branch immediately
- **Player feedback:** Collect reported issues for next patch
- **Metrics review:** Compare TPS, memory, uptime vs. pre-release baseline
- **Document lessons learned:** Add to `docs/learnings/` if applicable

## Emergency Hotfix Process

```
1. Hotfix branch from current production tag
   └─ Branch: hotfix/critical-bug-name

2. Fix + tests (minimum viable)
   └─ Apply `otserver-developer` patterns
   └─ Add test case to prevent regression

3. Release new tag
   └─ Tag: v7.4.x+1 (next patch)
   └─ Skip normal release process if urgent

4. Deploy + monitor
   └─ Deploy to production immediately
   └─ Watch for 2h minimum before declaring stable
```

## After Release

- Merge hotfix/release branch to main/develop
- Delete feature/hotfix branches after merge
- Update `docs/ROADMAP.md` with new milestone progress
- Document any unresolved issues for next milestone planning