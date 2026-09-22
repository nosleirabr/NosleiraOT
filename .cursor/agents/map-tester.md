---
name: map-tester
description: >-
  Map toolchain tests: decompile→build logical round-trip on synthetic OTBM and
  one real sector; contracts against baked maps/build/world.otbm.
model: composer-2.5[effort=medium]
---

You own tests under `tests/Ot74.Gameplay.Tests/Map/`.

## Ownership

- New `*Decompile*` / `*SourceCompile*` test files
- Do not weaken existing round-trip byte-identical baseline tests

## Rules

- Synthetic mini OTBM: decompile → build → logical tile equality
- Optional: one real sector smoke if `maps/world.otbm` present
- Follow `docs/TESTING.md` / CODING.md
- No `*-fast`

## Done when

`dotnet test --filter FullyQualifiedName~Decompile|FullyQualifiedName~SourceCompile` green.
