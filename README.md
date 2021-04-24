<p align="center">
	<a href="https://github.com/Remagpie/gha-delete-artifacts/actions">
		<img alt="gha-delete-actions status" src="https://github.com/Remagpie/gha-delete-artifacts/workflows/build-test/badge.svg">
	</a>
</p>

# gha-delete-artifacts

This action automatically deletes the artifacts in the repository by rules specified in the input argument. The following rules are supported:
- Deleting everything except N most recent artifacts
- Deleting artifacts older than N seconds
- Applying the above rules only for artifacts with specific name

## Usage

Following input arguments are used by this action.

### `only-name` (optional)
Exact string for filtering artifacts by name.

### `regex-name` (optional)
Regex for filtering artifacts by name. If both `only-name` and `regex-name` is specified, `only-name` takes precedence.

### `max-count` (optional)
Number of artifacts to keep. If filter arguments are specified, only the artifacts matched by the filters are taken into account.

### `max-age` (optional)
Maximum age(by seconds) of artifacts to keep. For example, `3600` should be used for deleting all artifacts older than 1 hour.  If filter arguments are specified, only the artifacts matched by the filters are taken into account.

## Examples

### Deleting all artifacts with name `foo` except 3 most recent ones

```yaml
- uses: Remagpie/gha-delete-artifacts@v1
  with:
    only-name: 'foo'
    max-count: 3
```

### Deleting all artifacts older than 7 days

```yaml
- uses: Remagpie/gha-delete-artifacts@v1
  with:
    max-age: 604800 # 7 * 24 * 60 * 60
```

### Deleting all artifacts starting with `bar` by count and age

```yaml
- uses: Remagpie/gha-delete-artifacts@v1
  with:
    regex-name: '^bar'
    max-age: 604800 # 7 * 24 * 60 * 60
```
