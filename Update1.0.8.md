## v1.0.9 – Input Validation Patch
This patch adds stricter input validation to prevent unexpected behavior.

### Added
- Error when `indices.length` does not match `inputs.length`
- Error when `prefixLength` is greater than any mnemonic word length
- Error when `mnemonic` is neither an Array nor a String
-new example

These checks improve safety during RPS verification and reduce silent failures.


