<p align="center">
	<a href="https://github.com/Remagpie/gha-remove-artifact/actions">
		<img alt="gha-remove-artifact status" src="https://github.com/Remagpie/gha-remove-artifact/workflows/build-test/badge.svg">
	</a>
</p>

# gha-remove-artifact

This action automatically removes the artifacts in the repository by rules specified in the input argument. The following rules are supported:
- Removing everything except N most recent artifacts
- Removing artifacts older than N seconds
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
Maximum age(by seconds) of artifacts to keep. For example, `3600` should be used for removing all artifacts older than 1 hour.  If filter arguments are specified, only the artifacts matched by the filters are taken into account.

## Examples

### Removing all artifacts with name `foo` except 3 most recent ones

```yaml
- uses: Remagpie/gha-remove-artifact@v1
  with:
    only-name: 'foo'
    max-count: 3
```

### Removing all artifacts older than 7 days

```yaml
- uses: Remagpie/gha-remove-artifact@v1
  with:
    max-age: 604800 # 7 * 24 * 60 * 60
```

### Removing all artifacts starting with `bar` by count and age

```yaml
- uses: Remagpie/gha-remove-artifact@v1
  with:
    regex-name: '^bar'
    max-age: 604800 # 7 * 24 * 60 * 60
```
