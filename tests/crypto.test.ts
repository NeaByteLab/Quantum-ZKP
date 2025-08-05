import { QuantumCrypto } from '../src/utils/crypto'
import type { AlgorithmType } from '../src/types'

describe('QuantumCrypto Utilities', () => {
  describe('generateRandomBytes', () => {
    it('should generate random bytes of specified length', () => {
      const bytes = QuantumCrypto.generateRandomBytes(32)
      expect(bytes.length).toBe(32)
      expect(bytes).toBeInstanceOf(Buffer)
    })

    it('should generate different bytes on each call', () => {
      const bytes1 = QuantumCrypto.generateRandomBytes(16)
      const bytes2 = QuantumCrypto.generateRandomBytes(16)
      expect(bytes1).not.toEqual(bytes2)
    })

    it('should throw error for invalid length', () => {
      expect(() => QuantumCrypto.generateRandomBytes(0)).toThrow()
      expect(() => QuantumCrypto.generateRandomBytes(-1)).toThrow()
    })
  })

  describe('generateQuantumSafeChallenge', () => {
    it('should generate challenges for all algorithms', () => {
      const algorithms: AlgorithmType[] = ['lattice', 'hash', 'multivariate', 'hybrid']
      
      for (const algorithm of algorithms) {
        const challenge = QuantumCrypto.generateQuantumSafeChallenge(algorithm)
        expect(challenge).toBeInstanceOf(Buffer)
        expect(challenge.length).toBeGreaterThan(0)
      }
    })

    it('should generate different challenges for different algorithms', () => {
      const challenge1 = QuantumCrypto.generateQuantumSafeChallenge('lattice')
      const challenge2 = QuantumCrypto.generateQuantumSafeChallenge('hash')
      expect(challenge1).not.toEqual(challenge2)
    })
  })

  describe('hash', () => {
    it('should hash string data', () => {
      const data = 'test-data'
      const hash = QuantumCrypto.hash(data)
      expect(hash).toBeInstanceOf(Buffer)
      expect(hash.length).toBe(32) // SHA-256
    })

    it('should hash buffer data', () => {
      const data = Buffer.from('test-data', 'utf8')
      const hash = QuantumCrypto.hash(data)
      expect(hash).toBeInstanceOf(Buffer)
      expect(hash.length).toBe(32)
    })

    it('should use different hash algorithms', () => {
      const data = 'test-data'
      const sha256 = QuantumCrypto.hash(data, 'sha256')
      const sha384 = QuantumCrypto.hash(data, 'sha384')
      const sha512 = QuantumCrypto.hash(data, 'sha512')
      
      expect(sha256.length).toBe(32)
      expect(sha384.length).toBe(48)
      expect(sha512.length).toBe(64)
      
      expect(sha256).not.toEqual(sha384)
      expect(sha384).not.toEqual(sha512)
    })

    it('should produce consistent hashes', () => {
      const data = 'test-data'
      const hash1 = QuantumCrypto.hash(data)
      const hash2 = QuantumCrypto.hash(data)
      expect(hash1).toEqual(hash2)
    })
  })

  describe('hmac', () => {
    it('should create HMAC with string data and key', () => {
      const data = 'test-data'
      const key = 'test-key'
      const hmac = QuantumCrypto.hmac(data, key)
      expect(hmac).toBeInstanceOf(Buffer)
      expect(hmac.length).toBe(32)
    })

    it('should create HMAC with buffer data and key', () => {
      const data = Buffer.from('test-data', 'utf8')
      const key = Buffer.from('test-key', 'utf8')
      const hmac = QuantumCrypto.hmac(data, key)
      expect(hmac).toBeInstanceOf(Buffer)
      expect(hmac.length).toBe(32)
    })

    it('should use different HMAC algorithms', () => {
      const data = 'test-data'
      const key = 'test-key'
      const sha256 = QuantumCrypto.hmac(data, key, 'sha256')
      const sha384 = QuantumCrypto.hmac(data, key, 'sha384')
      const sha512 = QuantumCrypto.hmac(data, key, 'sha512')
      
      expect(sha256.length).toBe(32)
      expect(sha384.length).toBe(48)
      expect(sha512.length).toBe(64)
    })

    it('should produce consistent HMACs', () => {
      const data = 'test-data'
      const key = 'test-key'
      const hmac1 = QuantumCrypto.hmac(data, key)
      const hmac2 = QuantumCrypto.hmac(data, key)
      expect(hmac1).toEqual(hmac2)
    })
  })

  describe('generateLargePrime', () => {
    it('should generate large primes', () => {
      const prime = QuantumCrypto.generateLargePrime(64)
      expect(typeof prime).toBe('bigint')
      expect(prime > 0n).toBe(true)
    })

    it('should generate different primes', () => {
      const prime1 = QuantumCrypto.generateLargePrime(64)
      const prime2 = QuantumCrypto.generateLargePrime(64)
      expect(prime1).not.toEqual(prime2)
    })

    it('should throw error for small bit size', () => {
      expect(() => QuantumCrypto.generateLargePrime(32)).toThrow()
    })
  })

  describe('generateRandomBigInt', () => {
    it('should generate random big integers in range', () => {
      const min = 100n
      const max = 1000n
      const value = QuantumCrypto.generateRandomBigInt(min, max)
      expect(value >= min).toBe(true)
      expect(value < max).toBe(true)
    })

    it('should generate different values', () => {
      const min = 100n
      const max = 1000n
      const value1 = QuantumCrypto.generateRandomBigInt(min, max)
      const value2 = QuantumCrypto.generateRandomBigInt(min, max)
      expect(value1).not.toEqual(value2)
    })
  })

  describe('millerRabinPrimalityTest', () => {
    it('should identify prime numbers', () => {
      expect(QuantumCrypto.millerRabinPrimalityTest(2n)).toBe(true)
      expect(QuantumCrypto.millerRabinPrimalityTest(3n)).toBe(true)
      expect(QuantumCrypto.millerRabinPrimalityTest(17n)).toBe(true)
      expect(QuantumCrypto.millerRabinPrimalityTest(97n)).toBe(true)
    })

    it('should identify composite numbers', () => {
      expect(QuantumCrypto.millerRabinPrimalityTest(4n)).toBe(false)
      expect(QuantumCrypto.millerRabinPrimalityTest(15n)).toBe(false)
      expect(QuantumCrypto.millerRabinPrimalityTest(100n)).toBe(false)
    })

    it('should handle edge cases', () => {
      expect(QuantumCrypto.millerRabinPrimalityTest(1n)).toBe(false)
      expect(QuantumCrypto.millerRabinPrimalityTest(0n)).toBe(false)
    })
  })

  describe('modPow', () => {
    it('should compute modular exponentiation', () => {
      const result = QuantumCrypto.modPow(2n, 10n, 1000n)
      expect(result).toBe(24n) // 2^10 mod 1000 = 1024 mod 1000 = 24
    })

    it('should handle large numbers', () => {
      const base = 123n
      const exponent = 456n
      const modulus = 1000n
      const result = QuantumCrypto.modPow(base, exponent, modulus)
      expect(result >= 0n).toBe(true)
      expect(result < modulus).toBe(true)
    })

    it('should handle modulus of 1', () => {
      const result = QuantumCrypto.modPow(5n, 10n, 1n)
      expect(result).toBe(0n)
    })
  })

  describe('createHashChain', () => {
    it('should create hash chain of specified length', () => {
      const seed = Buffer.from('test-seed', 'utf8')
      const chain = QuantumCrypto.createHashChain(seed, 10)
      expect(chain.length).toBe(10)
      expect(chain.every(hash => hash instanceof Buffer)).toBe(true)
    })

    it('should create valid hash chain', () => {
      const seed = Buffer.from('test-seed', 'utf8')
      const chain = QuantumCrypto.createHashChain(seed, 5)
      
      // Verify chain integrity
      for (let i = 1; i < chain.length; i++) {
        const expected = QuantumCrypto.hash(chain[i - 1], 'sha256')
        expect(chain[i]).toEqual(expected)
      }
    })

    it('should throw error for invalid length', () => {
      const seed = Buffer.from('test-seed', 'utf8')
      expect(() => QuantumCrypto.createHashChain(seed, 0)).toThrow()
      expect(() => QuantumCrypto.createHashChain(seed, -1)).toThrow()
    })
  })

  describe('combineHashes', () => {
    it('should combine multiple hashes', () => {
      const hashes = [
        Buffer.from('hash1', 'utf8'),
        Buffer.from('hash2', 'utf8'),
        Buffer.from('hash3', 'utf8')
      ]
      const combined = QuantumCrypto.combineHashes(hashes)
      expect(combined).toBeInstanceOf(Buffer)
      expect(combined.length).toBe(32)
    })

    it('should handle single hash', () => {
      const hashes = [Buffer.from('hash1', 'utf8')]
      const combined = QuantumCrypto.combineHashes(hashes)
      expect(combined).toEqual(hashes[0])
    })

    it('should throw error for empty array', () => {
      expect(() => QuantumCrypto.combineHashes([])).toThrow()
    })
  })

  describe('validateParameters', () => {
    it('should validate lattice parameters', () => {
      expect(QuantumCrypto.validateParameters('lattice', { dimension: 256, modulus: 1000n })).toBe(true)
      expect(QuantumCrypto.validateParameters('lattice', { dimension: 64, modulus: 1000n })).toBe(false)
      expect(QuantumCrypto.validateParameters('lattice', { dimension: 256, modulus: 0n })).toBe(false)
    })

    it('should validate hash parameters', () => {
      expect(QuantumCrypto.validateParameters('hash', { chainLength: 500 })).toBe(true)
      expect(QuantumCrypto.validateParameters('hash', { chainLength: 50 })).toBe(false)
    })

    it('should validate multivariate parameters', () => {
      expect(QuantumCrypto.validateParameters('multivariate', { variables: 16, equations: 24 })).toBe(true)
      expect(QuantumCrypto.validateParameters('multivariate', { variables: 4, equations: 8 })).toBe(false)
      expect(QuantumCrypto.validateParameters('multivariate', { variables: 16, equations: 8 })).toBe(false)
    })

    it('should validate hybrid parameters', () => {
      expect(QuantumCrypto.validateParameters('hybrid', { algorithms: ['hash', 'lattice'] })).toBe(true)
      expect(QuantumCrypto.validateParameters('hybrid', { algorithms: ['hash'] })).toBe(false)
      expect(QuantumCrypto.validateParameters('hybrid', { algorithms: ['invalid'] })).toBe(false)
    })

    it('should return false for unknown algorithm', () => {
      expect(QuantumCrypto.validateParameters('unknown' as AlgorithmType, {})).toBe(false)
    })
  })

  describe('bufferToBigInts', () => {
    it('should convert buffer to big integers', () => {
      const buffer = Buffer.from([1, 2, 3, 4, 5, 6, 7, 8])
      const ints = QuantumCrypto.bufferToBigInts(buffer, 2)
      expect(ints.length).toBe(2)
      expect(ints.every(int => typeof int === 'bigint')).toBe(true)
    })

    it('should handle different buffer sizes', () => {
      const buffer = Buffer.from([1, 2, 3, 4])
      const ints = QuantumCrypto.bufferToBigInts(buffer, 4)
      expect(ints.length).toBe(4)
    })
  })

  describe('bigIntsToBuffer', () => {
    it('should convert big integers to buffer', () => {
      const ints = [1n, 2n, 3n, 4n]
      const buffer = QuantumCrypto.bigIntsToBuffer(ints)
      expect(buffer).toBeInstanceOf(Buffer)
      expect(buffer.length).toBeGreaterThan(0)
    })

    it('should handle empty array', () => {
      const buffer = QuantumCrypto.bigIntsToBuffer([])
      expect(buffer).toBeInstanceOf(Buffer)
      expect(buffer.length).toBe(0)
    })
  })

  describe('generateLWESample', () => {
    it('should generate LWE sample', () => {
      const sample = QuantumCrypto.generateLWESample(4, 1000n, 8n)
      expect(sample.a.length).toBe(4)
      expect(sample.a.every(val => typeof val === 'bigint')).toBe(true)
      expect(typeof sample.b).toBe('bigint')
    })

    it('should generate different samples', () => {
      const sample1 = QuantumCrypto.generateLWESample(4, 1000n, 8n)
      const sample2 = QuantumCrypto.generateLWESample(4, 1000n, 8n)
      expect(sample1.a).not.toEqual(sample2.a)
      expect(sample1.b).not.toEqual(sample2.b)
    })
  })

  describe('generateDiscreteGaussianError', () => {
    it('should generate discrete Gaussian error', () => {
      const error = QuantumCrypto.generateDiscreteGaussianError(8n)
      expect(typeof error).toBe('bigint')
      expect(Math.abs(Number(error)) <= Number(8n)).toBe(true)
    })

    it('should generate different errors', () => {
      const error1 = QuantumCrypto.generateDiscreteGaussianError(8n)
      const error2 = QuantumCrypto.generateDiscreteGaussianError(8n)
      expect(error1).not.toEqual(error2)
    })
  })

  describe('generateRLWEPolynomial', () => {
    it('should generate RLWE polynomial', () => {
      const polynomial = QuantumCrypto.generateRLWEPolynomial(8, 1000n, 8n)
      expect(polynomial.length).toBe(8)
      expect(polynomial.every(coeff => typeof coeff === 'bigint')).toBe(true)
    })

    it('should throw error for non-power-of-2 degree', () => {
      expect(() => QuantumCrypto.generateRLWEPolynomial(7, 1000n, 8n)).toThrow()
    })
  })

  describe('polynomialMultiply', () => {
    it('should multiply polynomials', () => {
      const a = [1n, 2n, 3n, 4n]
      const b = [5n, 6n, 7n, 8n]
      const modulus = 1000n
      const result = QuantumCrypto.polynomialMultiply(a, b, modulus)
      expect(result.length).toBe(4)
      expect(result.every(coeff => typeof coeff === 'bigint')).toBe(true)
    })
  })

  describe('generateMultivariateSystem', () => {
    it('should generate multivariate system', () => {
      const system = QuantumCrypto.generateMultivariateSystem(4, 6, 2)
      expect(system.length).toBe(6) // equations
      expect(system[0].length).toBe(4) // variables
      expect(system[0][0].length).toBe(3) // coefficients (degree + 1)
    })
  })

  describe('evaluateMultivariatePolynomial', () => {
    it('should evaluate multivariate polynomial', () => {
      const polynomial = [[1n, 2n], [3n, 4n]]
      const values = [5n, 6n]
      const result = QuantumCrypto.evaluateMultivariatePolynomial(polynomial, values)
      expect(typeof result).toBe('bigint')
    })
  })

  describe('generateMerkleTree', () => {
    it('should generate Merkle tree', () => {
      const leaves = [
        Buffer.from('leaf1', 'utf8'),
        Buffer.from('leaf2', 'utf8'),
        Buffer.from('leaf3', 'utf8')
      ]
      const { tree, root } = QuantumCrypto.generateMerkleTree(leaves)
      expect(tree).toBeDefined()
      expect(root).toBeInstanceOf(Buffer)
    })

    it('should throw error for empty leaves', () => {
      expect(() => QuantumCrypto.generateMerkleTree([])).toThrow()
    })
  })

  describe('generateMerkleProof', () => {
    it('should generate Merkle proof', () => {
      const leaves = [
        Buffer.from('leaf1', 'utf8'),
        Buffer.from('leaf2', 'utf8'),
        Buffer.from('leaf3', 'utf8')
      ]
      const { tree } = QuantumCrypto.generateMerkleTree(leaves)
      const proof = QuantumCrypto.generateMerkleProof(tree, 0)
      expect(proof).toBeInstanceOf(Array)
    })
  })

  describe('verifyMerkleProof', () => {
    it('should verify valid Merkle proof', () => {
      const leaves = [
        Buffer.from('leaf1', 'utf8'),
        Buffer.from('leaf2', 'utf8'),
        Buffer.from('leaf3', 'utf8')
      ]
      const { tree, root } = QuantumCrypto.generateMerkleTree(leaves)
      const proof = QuantumCrypto.generateMerkleProof(tree, 0)
      const isValid = QuantumCrypto.verifyMerkleProof(leaves[0], proof, root, 0)
      expect(isValid).toBe(true)
    })

    it('should reject invalid Merkle proof', () => {
      const leaves = [
        Buffer.from('leaf1', 'utf8'),
        Buffer.from('leaf2', 'utf8'),
        Buffer.from('leaf3', 'utf8')
      ]
      const { tree, root } = QuantumCrypto.generateMerkleTree(leaves)
      const proof = QuantumCrypto.generateMerkleProof(tree, 0)
      const isValid = QuantumCrypto.verifyMerkleProof(leaves[1], proof, root, 0)
      expect(isValid).toBe(false)
    })
  })

  describe('getVersion', () => {
    it('should return version string', () => {
      const version = QuantumCrypto.getVersion()
      expect(version).toBe('1.0.0')
    })
  })
}) 