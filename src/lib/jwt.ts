import { SignJWT, jwtVerify, type JWTPayload, type JWTHeaderParameters } from 'jose';

const encoder = new TextEncoder();
const decoder = new TextDecoder();

type Callback<T> = (err: Error | null, result?: T) => void;

export interface SignOptions {
  /** JWT algorithm (e.g., 'HS256') */
  algorithm?: JWTHeaderParameters['alg'];
  /** Token expiration duration (e.g., '1h', milliseconds, or numeric seconds) */
  expiresIn?: string | number;
  /** Not-before duration (e.g., '5m') */
  notBefore?: string | number;
  /** Intended audience(s) */
  audience?: string | string[];
  /** Token issuer */
  issuer?: string;
  /** Token subject */
  subject?: string;
  /** JWT ID */
  jwtid?: string;
  /** Additional protected header parameters */
  header?: Partial<JWTHeaderParameters>;
}

export interface VerifyOptions {
  /** Allowed algorithms */
  algorithms?: JWTHeaderParameters['alg'][];
  /** Expected audience(s) */
  audience?: string | string[];
  /** Expected issuer */
  issuer?: string;
  /** Expected subject */
  subject?: string;
  /** Clock skew tolerance in seconds */
  clockTolerance?: number;
  /** If true, skip expiration check (not supported by jose) */
  ignoreExpiration?: boolean;
  /** If true, return full verification result including header and key */
  complete?: boolean;
}

/**
 * Overload signatures for sign:
 * - Without callback returns Promise<string>
 * - With callback returns void
 */
export function sign(
  payload: string | Uint8Array | Record<string, unknown>,
  secret: string | Uint8Array,
  options?: SignOptions
): Promise<string>;
export function sign(
  payload: string | Uint8Array | Record<string, unknown>,
  secret: string | Uint8Array,
  options: SignOptions,
  callback: Callback<string>
): void;
export function sign(
  payload: string | Uint8Array | Record<string, unknown>,
  secret: string | Uint8Array,
  options: SignOptions = {},
  callback?: Callback<string>
): Promise<string> | void {
  const task = (async (): Promise<string> => {
    const keyData = typeof secret === 'string' ? encoder.encode(secret) : secret;
    const payloadObj: Record<string, unknown> =
      typeof payload === 'string'
        ? { data: payload }
        : payload instanceof Uint8Array
        ? { data: decoder.decode(payload) }
        : payload;
    const jwt = new SignJWT(payloadObj as JWTPayload);
    jwt.setProtectedHeader({
      alg: options.algorithm ?? 'HS256',
      typ: 'JWT',
      ...(options.header ?? {}),
    } as JWTHeaderParameters);
    jwt.setIssuedAt();
    if (options.expiresIn !== undefined) jwt.setExpirationTime(options.expiresIn);
    if (options.notBefore !== undefined) jwt.setNotBefore(options.notBefore);
    if (options.audience) jwt.setAudience(options.audience);
    if (options.issuer) jwt.setIssuer(options.issuer);
    if (options.subject) jwt.setSubject(options.subject);
    if (options.jwtid) jwt.setJti(options.jwtid);
    return jwt.sign(keyData);
  })();
  if (callback) {
    task.then(token => callback(null, token)).catch(err => callback(err));
    return;
  }
  return task;
}

/**
 * Overload signatures for verify:
 * - Without callback returns Promise<any>
 * - With callback returns void
 */
export function verify(
  token: string,
  secret: string | Uint8Array,
  options?: VerifyOptions
): Promise<any>;
export function verify(
  token: string,
  secret: string | Uint8Array,
  options: VerifyOptions,
  callback: Callback<any>
): void;
export function verify(
  token: string,
  secret: string | Uint8Array,
  options: VerifyOptions = {},
  callback?: Callback<any>
): Promise<any> | void {
  const task = (async (): Promise<any> => {
    const keyData = typeof secret === 'string' ? encoder.encode(secret) : secret;
    const result = await jwtVerify(token, keyData, {
      algorithms: options.algorithms ?? ['HS256'],
      audience: options.audience,
      issuer: options.issuer,
      subject: options.subject,
      clockTolerance: options.clockTolerance,
    });
    return options.complete ? result : result.payload;
  })();
  if (callback) {
    task.then(payload => callback(null, payload)).catch(err => callback(err));
    return;
  }
  return task;
}

/**
 * Decodes a JWT without verifying the signature.
 * @param token    JWT string
 * @param options  { complete?: boolean }
 * @returns        Decoded payload, or both header and payload if complete=true
 */
export function decode(
  token: string,
  options: { complete?: boolean } = {}
): any {
  const parts = token.split('.');
  if (parts.length < 2) return null;
  const header = JSON.parse(
    atob(parts[0].replace(/-/g, '+').replace(/_/g, '/'))
  );
  const payload = JSON.parse(
    atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'))
  );
  return options.complete ? { header, payload } : payload;
}
