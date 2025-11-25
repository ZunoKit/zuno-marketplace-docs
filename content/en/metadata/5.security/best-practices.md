---
title: "Security Best Practices"
package: "metadata"
lastUpdated: "2024-11-24"
scope: "security"
complexity: "advanced"
category: "security"
relatedTopics:
  - "authentication"
  - "api-keys"
  - "production-deployment"
---

# Security Best Practices

Comprehensive security guide for the Metadata service.

## Authentication & Authorization

### API Key Management

- **Rotate API keys regularly** via admin dashboard
  - Set rotation schedule (e.g., quarterly)
  - Plan rotation windows to avoid service disruption
  - Delete old keys after successful rotation

- **Use minimal scopes** for each API key
  - `metadata:read` - Reading metadata only
  - `metadata:write` - Creating/updating metadata
  - `media:read` - Accessing media files
  - `media:write` - Uploading media files
  - Combine only necessary scopes

- **Store API keys securely**
  - Never commit keys to repositories
  - Use environment variables or secrets manager
  - Restrict access to key values in admin dashboard
  - Copy key immediately after creation (not shown again)

### Session Authentication

- **Secure admin access** via Better Auth
  - Strong passwords (12+ characters, mixed case, numbers, symbols)
  - Multi-factor authentication (MFA) when available
  - Regular password changes
  - Session timeout on inactivity (e.g., 30 minutes)

- **Role-based access control**
  - Only grant necessary admin roles
  - Document who has admin access
  - Revoke access immediately when user leaves

## API Protection

### Rate Limiting

- **Redis-backed rate limiting** per API key
  - Default: 1000 requests per hour
  - Configure based on expected usage
  - Monitor rate limit headers:
    - `X-RateLimit-Limit`
    - `X-RateLimit-Remaining`
    - `X-RateLimit-Reset`

- **Implement backoff strategy**
  ```typescript
  // Exponential backoff on rate limit
  if (response.status === 429) {
    const retryAfter = response.headers['Retry-After'];
    const delay = Math.pow(2, attempt) * 1000;
    await sleep(Math.max(delay, retryAfter));
  }
  ```

### CORS Configuration

- **Only allow trusted origins**
  ```env
  # Production
  CORS_ORIGINS=https://your-domain.com,https://app.your-domain.com

  # Never use wildcard (*)
  # CORS_ORIGINS=*  # DANGER: DO NOT USE
  ```

- **Verify origin on every request**
  - Configured automatically in infrastructure
  - Test CORS headers in browser:
    ```bash
    curl -H "Origin: https://trusted-origin.com" \
         -H "Access-Control-Request-Method: POST" \
         https://your-domain.com/api/metadata
    ```

### Input Validation

- **Zod validation** on all API inputs
  - Strict schema validation before processing
  - Runtime type safety
  - Clear error messages for invalid input

- **Validate file uploads**
  ```typescript
  // Maximum file size: 50MB
  const MAX_FILE_SIZE = 50 * 1024 * 1024;

  // Allowed MIME types
  const ALLOWED_TYPES = [
    'image/png', 'image/jpeg', 'image/gif', 'image/webp',
    'video/mp4', 'video/webm'
  ];

  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File too large');
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Invalid file type');
  }
  ```

- **Sanitize metadata inputs**
  - HTML encoding to prevent XSS
  - Length limits on strings
  - Number range validation

## Data Security

### Database Security

- **Connection encryption** via TLS
  ```env
  # Ensure connection is encrypted
  DATABASE_URL=postgresql://user:password@host:5432/db
  # Use SSL in production
  ```

- **Hashed credentials**
  - API key hashes (bcrypt) stored in database
  - Never store plaintext keys
  - Use `crypto.subtle` for password hashing

- **SQL Injection prevention**
  - Parameterized queries via Drizzle ORM
  - Never concatenate user input into queries
  - Automatic escaping by ORM

### Secrets Management

- **Environment variables only**
  - Never hardcode secrets in source code
  - Use `.env.local` file (never commit)
  - Use secrets manager in production

- **Minimum 32-character secrets**
  ```bash
  # Generate strong secret
  openssl rand -base64 32

  # Example
  BETTER_AUTH_SECRET=AbCdEfGhIjKlMnOpQrStUvWxYz0123456789
  ```

- **Rotation schedule**
  - Change secrets quarterly
  - Rotate immediately if compromised
  - Keep previous secrets during transition

### TLS/SSL

- **Enable HTTPS everywhere**
  - Development: Localhost (self-signed certificate okay)
  - Production: Valid SSL certificate (Let's Encrypt, etc.)

- **Certificate management**
  ```bash
  # Check certificate expiration
  openssl s_client -connect your-domain.com:443 -servername your-domain.com | grep "Not After"

  # Auto-renewal via Certbot
  certbot renew --dry-run
  ```

- **Security headers**
  ```typescript
  // Add to API responses
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  ```

## Audit & Compliance

### Audit Logging

- **Log all API requests**
  - User/API key identification
  - Request method and path
  - Response status and duration
  - IP address and user agent
  - Timestamp

- **Monitor audit logs**
  - Review logs daily for suspicious activity
  - Set up alerts for:
    - Multiple failed authentications
    - Admin actions
    - Bulk operations
    - Unusual access patterns

- **Audit log retention**
  - Keep logs for minimum 90 days
  - Archive older logs separately
  - Never delete audit logs

### API Key Auditing

```sql
-- Find API key usage
SELECT api_key, COUNT(*) as request_count, MAX(created_at) as last_used
FROM audit_logs
WHERE api_key IS NOT NULL
GROUP BY api_key
ORDER BY last_used DESC;

-- Find suspicious patterns
SELECT api_key, COUNT(*) as error_count
FROM audit_logs
WHERE status >= 400
GROUP BY api_key
HAVING COUNT(*) > 100
ORDER BY error_count DESC;
```

## Network Security

### Rate Limiting by IP

- **DDoS protection**
  - Limit requests per IP
  - Monitor for DDoS patterns
  - Use CDN with DDoS protection (Cloudflare, etc.)

### Firewall Rules

- **Database firewall**
  ```sql
  -- Allow only app server
  ALTER DATABASE zuno_metadata OWNER TO zuno_user;

  -- Restrict connections
  -- Use VPC security groups or network ACLs
  ```

- **Redis firewall**
  - Require authentication
  - Limit network access
  - Use VPC or private network

## Dependency Management

### Keep Dependencies Updated

```bash
# Check for vulnerabilities
npm audit
pnpm audit

# Update dependencies
pnpm update

# View available updates
pnpm outdated
```

### Security Scanning

- **Automated scanning**
  - Enable GitHub Security Scanning
  - Run `npm audit` in CI/CD
  - Scan container images before deployment

- **Manual review**
  - Review major version updates
  - Check changelog for security fixes
  - Test updates in staging before production

## Content Security Policy

### CSP Headers

```typescript
// Set Content Security Policy header
response.headers.set(
  'Content-Security-Policy',
  `
    default-src 'self';
    script-src 'self' 'unsafe-inline';
    style-src 'self' 'unsafe-inline';
    img-src 'self' https: data:;
    font-src 'self' data:;
    connect-src 'self' https://api.imagekit.io https://api.pinata.cloud;
  `.replace(/\n/g, ' ')
);
```

## Monitoring & Alerts

### Security Monitoring

- **Failed login attempts**
  - Alert on multiple failures
  - Temporarily lock account
  - Email user of suspicious activity

- **API key rotation reminders**
  - Quarterly notification emails
  - Track rotation history
  - Alert on old keys still in use

- **Permission changes**
  - Log all permission modifications
  - Alert admins of privilege escalation
  - Require approval for admin grants

## Incident Response

### Security Incident Plan

1. **Detect** - Monitor logs and alerts
2. **Contain** - Disable compromised keys/accounts
3. **Investigate** - Review audit logs
4. **Remediate** - Fix vulnerabilities
5. **Recover** - Restore services
6. **Learn** - Update procedures

### Compromised API Key Response

```bash
# 1. Immediately revoke key
# Via admin dashboard or:
UPDATE api_keys SET revoked_at = NOW() WHERE id = 'compromised_key';

# 2. Review usage in audit logs
SELECT * FROM audit_logs WHERE api_key = 'compromised_key' AND created_at > NOW() - INTERVAL '1 day';

# 3. Create new key for user
# Via admin dashboard

# 4. Notify affected users
# Email template for security incident

# 5. Update security documentation
```

## Compliance Checklist

- [ ] HTTPS enabled in production
- [ ] All secrets in environment variables
- [ ] API keys rotated quarterly
- [ ] Audit logs enabled and monitored
- [ ] Backups tested regularly
- [ ] Disaster recovery plan documented
- [ ] Security policy documented
- [ ] Regular security training for team
- [ ] Dependency vulnerabilities scanned
- [ ] Rate limiting configured
- [ ] CORS properly configured
- [ ] Input validation on all endpoints
- [ ] Database encryption enabled
- [ ] SSL certificate auto-renewal
- [ ] Security incident response plan

## Security Resources

- [OWASP Top 10](https://owasp.org/Top10/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/nodejs-security/)
- [Next.js Security Guide](https://nextjs.org/docs/advanced-features/security-headers)
- [PostgreSQL Security](https://www.postgresql.org/docs/current/sql-syntax.html#SQL-SYNTAX-LEXICAL-KEYWORDS)

## See Also

- [Production Checklist](/en/metadata/deployment/production-checklist)
- [Authentication](/en/metadata/api-reference/authentication)
- [API Key Management](/en/metadata/api-reference/authentication#managing-api-keys)
