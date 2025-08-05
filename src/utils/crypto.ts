/**
 * Cryptographic utilities for Quantum-Resistant ZKP library
 * @author NeaByteLab
 */

import { createHash, randomBytes, createHmac } from 'crypto'
import type { AlgorithmType } from '../types'

/**
 * Quantum-resistant cryptographic utilities
 */
export class QuantumCrypto {
  private static readonly VERSION = '1.0.0'

  /**
   * Generate quantum-resistant random bytes
   * @param length - Number of bytes to generate
   * @returns Random bytes
   */
  public static generateRandomBytes(length: number): Buffer {
    if (length <= 0) {
      throw new Error('Length must be positive')
    }
    return randomBytes(length)
  }

  /**
   * Generate quantum-resistant challenge
   * @param algorithm - Algorithm type for challenge generation
   * @returns Quantum-resistant challenge
   */
  public static generateQuantumSafeChallenge(algorithm: AlgorithmType): Buffer {
    const length = this.getChallengeLength(algorithm)
    return this.generateRandomBytes(length)
  }

  /**
   * Hash data using quantum-resistant algorithms
   * @param data - Data to hash
   * @param algorithm - Hash algorithm
   * @returns Hashed data
   */
  public static hash(data: Buffer | string, algorithm: 'sha256' | 'sha384' | 'sha512' = 'sha256'): Buffer {
    const input = typeof data === 'string' ? Buffer.from(data, 'utf8') : data
    return createHash(algorithm).update(input).digest()
  }

  /**
   * Create HMAC for quantum-resistant authentication
   * @param data - Data to authenticate
   * @param key - Secret key
   * @param algorithm - HMAC algorithm
   * @returns HMAC signature
   */
  public static hmac(
    data: Buffer | string,
    key: Buffer | string,
    algorithm: 'sha256' | 'sha384' | 'sha512' = 'sha256'
  ): Buffer {
    const input = typeof data === 'string' ? Buffer.from(data, 'utf8') : data
    const secretKey = typeof key === 'string' ? Buffer.from(key, 'utf8') : key
    return createHmac(algorithm, secretKey).update(input).digest()
  }

  /**
   * Generate large prime for lattice operations using Miller-Rabin primality test
   * @param bits - Number of bits for prime
   * @returns Large prime number
   */
  public static generateLargePrime(bits: number): bigint {
    if (bits < 64) {
      throw new Error('Prime must be at least 64 bits for security')
    }
    const maxValue = (1n << BigInt(bits)) - 1n
    const minValue = 1n << BigInt(bits - 1)
    let candidate = this.generateRandomBigInt(minValue, maxValue)
    if (candidate % 2n === 0n) {
      candidate += 1n
    }
    while (!this.millerRabinPrimalityTest(candidate, 40)) {
      candidate += 2n
      if (candidate > maxValue) {
        candidate = minValue
      }
    }
    return candidate
  }

  /**
   * Generate random big integer
   * @param min - Minimum value
   * @param max - Maximum value
   * @returns Random big integer
   */
  public static generateRandomBigInt(min: bigint, max: bigint): bigint {
    const range = max - min
    const bytes = Math.ceil(range.toString(16).length / 2)
    const buffer = this.generateRandomBytes(bytes)
    let value = BigInt(`0x${buffer.toString('hex')}`)
    value = (value % range) + min
    return value
  }

  /**
   * Check if number is a strong probable prime base a
   * @param n - Number to test
   * @param a - Base
   * @param d - Odd part of n-1
   * @param r - Power of 2 in n-1
   * @returns True if strong probable prime
   */
  private static isStrongProbablePrime(n: bigint, a: bigint, d: bigint, r: bigint): boolean {
    let x = this.modPow(a, d, n)
    if (x === 1n || x === n - 1n) {
      return true
    }
    for (let j = 1n; j < r; j++) {
      x = (x * x) % n
      if (x === n - 1n) {
        return true
      }
      if (x === 1n) {
        return false
      }
    }
    return false
  }

  /**
   * Miller-Rabin primality test for production use
   * @param n - Number to test
   * @param k - Number of rounds (higher = more accurate)
   * @returns True if probable prime
   */
  public static millerRabinPrimalityTest(n: bigint, k: number = 40): boolean {
    if (n <= 1n) {
      return false
    }
    if (n <= 3n) {
      return true
    }
    if (n % 2n === 0n) {
      return false
    }
    let r = 0n
    let d = n - 1n
    while (d % 2n === 0n) {
      d = d / 2n
      r += 1n
    }
    for (let i = 0; i < k; i++) {
      const a = this.generateRandomBigInt(2n, n - 2n)
      if (!this.isStrongProbablePrime(n, a, d, r)) {
        return false
      }
    }
    return true
  }

  /**
   * Simple probabilistic primality test (deprecated, use millerRabinPrimalityTest)
   * @param n - Number to test
   * @returns True if probable prime
   */
  public static isProbablePrime(n: bigint): boolean {
    return this.millerRabinPrimalityTest(n, 5)
  }

  /**
   * Modular exponentiation
   * @param base - Base number
   * @param exponent - Exponent
   * @param modulus - Modulus
   * @returns Result of modular exponentiation
   */
  public static modPow(base: bigint, exponent: bigint, modulus: bigint): bigint {
    if (modulus === 1n) {
      return 0n
    }
    let result = 1n
    base = base % modulus
    while (exponent > 0n) {
      if (exponent % 2n === 1n) {
        result = (result * base) % modulus
      }
      exponent = exponent >> 1n
      base = (base * base) % modulus
    }
    return result
  }

  /**
   * Create hash chain for hash-based proofs
   * @param seed - Initial seed
   * @param length - Chain length
   * @returns Hash chain
   */
  public static createHashChain(seed: Buffer, length: number): Buffer[] {
    if (length <= 0) {
      throw new Error('Chain length must be positive')
    }
    const chain: Buffer[] = []
    let current = seed
    for (let i = 0; i < length; i++) {
      current = this.hash(current, 'sha256')
      chain.push(current)
    }
    return chain
  }

  /**
   * Combine multiple hashes securely
   * @param hashes - Array of hashes to combine
   * @returns Combined hash
   */
  public static combineHashes(hashes: Buffer[]): Buffer {
    if (hashes.length === 0) {
      throw new Error('Cannot combine empty hash array')
    }
    if (hashes.length === 1) {
      return hashes[0]
    }
    return hashes.reduce((acc, hash) => {
      return this.hash(Buffer.concat([acc, hash]), 'sha256')
    })
  }

  /**
   * Get challenge length for algorithm
   * @param algorithm - Algorithm type
   * @returns Challenge length in bytes
   */
  private static getChallengeLength(algorithm: AlgorithmType): number {
    switch (algorithm) {
      case 'lattice':
        return 32
      case 'hash':
        return 16
      case 'multivariate':
        return 24
      case 'hybrid':
        return 40
      default:
        return 32
    }
  }

  /**
   * Validate cryptographic parameters
   * @param algorithm - Algorithm type
   * @param parameters - Parameters to validate
   * @returns True if valid
   */
  public static validateParameters(algorithm: AlgorithmType, parameters: Record<string, unknown>): boolean {
    switch (algorithm) {
      case 'lattice':
        return this.validateLatticeParameters(parameters)
      case 'hash':
        return this.validateHashParameters(parameters)
      case 'multivariate':
        return this.validateMultivariateParameters(parameters)
      case 'hybrid':
        return this.validateHybridParameters(parameters)
      default:
        return false
    }
  }

  /**
   * Validate lattice parameters
   * @param parameters - Lattice parameters
   * @returns True if valid
   */
  private static validateLatticeParameters(parameters: Record<string, unknown>): boolean {
    const { dimension, modulus } = parameters
    if (typeof dimension !== 'number' || dimension < 128) {
      return false
    }
    if (typeof modulus !== 'bigint' || modulus <= 0n) {
      return false
    }
    return true
  }

  /**
   * Validate hash parameters
   * @param parameters - Hash parameters
   * @returns True if valid
   */
  private static validateHashParameters(parameters: Record<string, unknown>): boolean {
    const { chainLength } = parameters
    if (typeof chainLength !== 'number' || chainLength < 100) {
      return false
    }
    return true
  }

  /**
   * Validate multivariate parameters
   * @param parameters - Multivariate parameters
   * @returns True if valid
   */
  private static validateMultivariateParameters(parameters: Record<string, unknown>): boolean {
    const { variables, equations } = parameters
    if (typeof variables !== 'number' || variables < 8) {
      return false
    }
    if (typeof equations !== 'number' || equations < variables) {
      return false
    }
    return true
  }

  /**
   * Validate hybrid parameters
   * @param parameters - Hybrid parameters
   * @returns True if valid
   */
  private static validateHybridParameters(parameters: Record<string, unknown>): boolean {
    const { algorithms } = parameters
    if (!Array.isArray(algorithms) || algorithms.length < 2) {
      return false
    }
    return algorithms.every(alg => ['lattice', 'hash', 'multivariate'].includes(alg))
  }

  /**
   * Convert buffer to array of big integers
   * @param buffer - Buffer to convert
   * @param count - Number of integers to extract
   * @returns Array of big integers
   */
  public static bufferToBigInts(buffer: Buffer, count: number): bigint[] {
    const ints: bigint[] = []
    const bytesPerInt = Math.ceil(buffer.length / count)
    for (let i = 0; i < count; i++) {
      const start = i * bytesPerInt
      const end = Math.min(start + bytesPerInt, buffer.length)
      const slice = buffer.slice(start, end)
      if (slice.length === 0) {
        ints.push(0n)
        continue
      }
      const hex = slice.toString('hex')
      const paddedHex = hex.padStart(slice.length * 2, '0')
      const value = BigInt(`0x${paddedHex}`)
      ints.push(value)
    }
    return ints
  }

  /**
   * Convert big integers to buffer
   * @param ints - Array of big integers
   * @returns Buffer
   */
  public static bigIntsToBuffer(ints: bigint[]): Buffer {
    const buffers = ints.map(int => {
      const hex = int.toString(16)
      return Buffer.from(hex.padStart(hex.length + (hex.length % 2), '0'), 'hex')
    })
    return Buffer.concat(buffers)
  }

  /**
   * Generate LWE (Learning With Errors) sample
   * @param dimension - Lattice dimension
   * @param modulus - Lattice modulus
   * @param errorBound - Error distribution bound
   * @returns LWE sample (a, b)
   */
  public static generateLWESample(dimension: number, modulus: bigint, errorBound: bigint): { a: bigint[]; b: bigint } {
    const a: bigint[] = []
    for (let i = 0; i < dimension; i++) {
      a.push(this.generateRandomBigInt(0n, modulus))
    }
    const error = this.generateDiscreteGaussianError(errorBound)
    const b = (this.generateRandomBigInt(0n, modulus) + error) % modulus
    return { a, b }
  }

  /**
   * Generate discrete Gaussian error for LWE
   * @param sigma - Standard deviation
   * @returns Error value
   */
  public static generateDiscreteGaussianError(sigma: bigint): bigint {
    const u1 = Math.max(0.0001, Number(this.generateRandomBigInt(0n, 1000n)) / 1000)
    const u2 = Number(this.generateRandomBigInt(0n, 1000n)) / 1000
    const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)
    return BigInt(Math.round(Number(sigma) * z0))
  }

  /**
   * Generate RLWE (Ring Learning With Errors) polynomial
   * @param degree - Polynomial degree (must be power of 2)
   * @param modulus - Ring modulus
   * @param errorBound - Error distribution bound
   * @returns RLWE polynomial coefficients
   */
  public static generateRLWEPolynomial(degree: number, modulus: bigint, errorBound: bigint): bigint[] {
    if ((degree & (degree - 1)) !== 0) {
      throw new Error('Degree must be a power of 2 for RLWE')
    }
    const coefficients: bigint[] = []
    for (let i = 0; i < degree; i++) {
      coefficients.push(this.generateRandomBigInt(0n, modulus))
    }
    for (let i = 0; i < degree; i++) {
      const error = this.generateDiscreteGaussianError(errorBound)
      coefficients[i] = (coefficients[i] + error) % modulus
    }
    return coefficients
  }

  /**
   * Polynomial multiplication in ring R_q
   * @param a - First polynomial coefficients
   * @param b - Second polynomial coefficients
   * @param modulus - Ring modulus
   * @returns Product polynomial coefficients
   */
  public static polynomialMultiply(a: bigint[], b: bigint[], modulus: bigint): bigint[] {
    const degree = a.length
    const result: bigint[] = new Array(degree).fill(0n)
    for (let i = 0; i < degree; i++) {
      for (let j = 0; j < degree; j++) {
        const k = (i + j) % degree
        result[k] = (result[k] + a[i] * b[j]) % modulus
      }
    }
    return result
  }

  /**
   * Generate multivariate polynomial system
   * @param variables - Number of variables
   * @param equations - Number of equations
   * @param degree - Maximum degree of polynomials
   * @returns System of multivariate polynomials
   */
  public static generateMultivariateSystem(variables: number, equations: number, degree: number): bigint[][][] {
    const system: bigint[][][] = []
    for (let eq = 0; eq < equations; eq++) {
      const equation: bigint[][] = []
      for (let v = 0; v < variables; v++) {
        const coefficients: bigint[] = []
        for (let d = 0; d <= degree; d++) {
          coefficients.push(this.generateRandomBigInt(0n, 2n ** 64n))
        }
        equation.push(coefficients)
      }
      system.push(equation)
    }
    return system
  }

  /**
   * Evaluate multivariate polynomial
   * @param polynomial - Polynomial coefficients
   * @param values - Variable values
   * @returns Polynomial evaluation result
   */
  public static evaluateMultivariatePolynomial(polynomial: bigint[][], values: bigint[]): bigint {
    let result = 0n
    for (let i = 0; i < polynomial.length; i++) {
      let term = 1n
      for (let j = 0; j < polynomial[i].length; j++) {
        if (j < values.length) {
          term = term * values[j] ** BigInt(j)
        }
      }
      result += polynomial[i][0] * term
    }
    return result
  }

  /**
   * Generate Merkle tree for hash-based signatures
   * @param leaves - Leaf values
   * @returns Merkle tree structure
   */
  public static generateMerkleTree(leaves: Buffer[]): { tree: Buffer[][]; root: Buffer } {
    if (leaves.length === 0) {
      throw new Error('Cannot generate Merkle tree with no leaves')
    }
    const tree: Buffer[][] = [leaves]
    let currentLevel = leaves
    while (currentLevel.length > 1) {
      const nextLevel: Buffer[] = []
      for (let i = 0; i < currentLevel.length; i += 2) {
        const left = currentLevel[i]
        const right = i + 1 < currentLevel.length ? currentLevel[i + 1] : left
        const combined = Buffer.concat([left, right])
        nextLevel.push(this.hash(combined, 'sha256'))
      }
      tree.push(nextLevel)
      currentLevel = nextLevel
    }
    return { tree, root: currentLevel[0] }
  }

  /**
   * Generate Merkle proof path
   * @param tree - Merkle tree
   * @param leafIndex - Index of leaf to prove
   * @returns Proof path (sibling hashes)
   */
  public static generateMerkleProof(tree: Buffer[][], leafIndex: number): Buffer[] {
    const proof: Buffer[] = []
    let currentIndex = leafIndex
    for (let level = 0; level < tree.length - 1; level++) {
      const isRight = currentIndex % 2 === 1
      const siblingIndex = isRight ? currentIndex - 1 : currentIndex + 1
      if (siblingIndex < tree[level].length) {
        proof.push(tree[level][siblingIndex])
      }
      currentIndex = Math.floor(currentIndex / 2)
    }
    return proof
  }

  /**
   * Verify Merkle proof
   * @param leaf - Leaf value
   * @param proof - Proof path
   * @param root - Expected root
   * @param leafIndex - Index of leaf
   * @returns True if proof is valid
   */
  public static verifyMerkleProof(leaf: Buffer, proof: Buffer[], root: Buffer, leafIndex: number): boolean {
    let currentHash = leaf
    let currentIndex = leafIndex
    for (const sibling of proof) {
      const isRight = currentIndex % 2 === 1
      const combined = isRight ? Buffer.concat([sibling, currentHash]) : Buffer.concat([currentHash, sibling])
      currentHash = this.hash(combined, 'sha256')
      currentIndex = Math.floor(currentIndex / 2)
    }
    return currentHash.equals(root)
  }

  /**
   * Get library version
   * @returns Version string
   */
  public static getVersion(): string {
    return this.VERSION
  }
}
