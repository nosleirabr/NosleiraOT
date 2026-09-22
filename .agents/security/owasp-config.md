# OWASP Security Configuration - OTClient Project
# Based on project_skillz.md standards

## SQL Injection Prevention
- Default: Use parameterized queries
- Enforce: Never allow string concatenation in SQL strings
- Exception: Table/column names require allow-list validation

## Input Validation Rules
- All client packets: Validate before processing
- Size limits: Max 65535 bytes per message
- Type checking: Strict type validation for all fields
- Range validation: Integer ranges, coordinate bounds

## XSS Prevention (if web/admin interface)
- Output encoding: Encode all data before client transmission
- Content Security Policy: header setup
- Sanitization: Use DOMPurify for HTML sanitization

## CSRF Protection
- Token generation: bin2hex(random_bytes(16)) per session
- Double-submit cookie pattern
- Validate: $_SESSION['csrf'] !== $_POST['csrf']

## RCE Prevention
- Packet size limits: Enforce maximum message size
- Data sanitization: Sanitize all binary data incoming
- Input boundaries: Validate coordinate systems, player positions