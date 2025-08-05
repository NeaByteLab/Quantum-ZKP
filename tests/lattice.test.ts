import { LatticeZKP } from '../src/algorithms/lattice'
import { QuantumCrypto } from '../src/utils/crypto'
import type { LatticeProof } from '../src/types'

describe('LatticeZKP Algorithm', () => {
  const testSecret = 'test-secret-data'
  const testBuffer = Buffer.from(testSecret, 'utf8')

  describe('createProof', () => {
    it('should create a valid lattice proof with default parameters', () => {
      const proof = LatticeZKP.createProof(testSecret)
      
      expect(proof).toBeDefined()
      expect(proof.type).toBe('lattice')
      expect(proof.quantumSafe).toBe(true)
      expect(proof.version).toBe('1.0.0')
      expect(proof.dimension).toBe(256)
      expect(proof.modulus).toBeGreaterThan(0n)
      expect(proof.commitment).toBeDefined()
      expect(proof.challenge).toBeDefined()
      expect(proof.response).toBeDefined()
      expect(proof.polynomialCommitment).toBeDefined()
    })

    it('should create a valid lattice proof with custom parameters', () => {
      const proof = LatticeZKP.createProof(testSecret, { 
        dimension: 128, 
        modulus: 2n ** 512n 
      })
      
      expect(proof.dimension).toBe(128)
      expect(proof.modulus).toBe(2n ** 512n)
    })

    it('should create different proofs for different secrets', () => {
      const proof1 = LatticeZKP.createProof('secret1')
      const proof2 = LatticeZKP.createProof('secret2')
      
      expect(proof1.commitment).not.toEqual(proof2.commitment)
      expect(proof1.challenge).not.toEqual(proof2.challenge)
      expect(proof1.response).not.toEqual(proof2.response)
    })

    it('should create different proofs for same secret (due to randomness)', () => {
      const proof1 = LatticeZKP.createProof(testSecret)
      const proof2 = LatticeZKP.createProof(testSecret)
      
      expect(proof1.commitment).not.toEqual(proof2.commitment)
      expect(proof1.challenge).not.toEqual(proof2.challenge)
      expect(proof1.response).not.toEqual(proof2.response)
    })

    it('should work with Buffer input', () => {
      const proof = LatticeZKP.createProof(testBuffer)
      
      expect(proof.type).toBe('lattice')
      expect(proof.quantumSafe).toBe(true)
    })

    it('should validate parameters correctly', () => {
      expect(() => LatticeZKP.createProof(testSecret, { dimension: 64 }))
        .toThrow('Invalid lattice parameters')
    })
  })

  describe('verifyProof', () => {
    let validProof: LatticeProof

    beforeEach(() => {
      validProof = LatticeZKP.createProof(testSecret)
    })

    it('should verify a valid proof', () => {
      const isValid = LatticeZKP.verifyProof(validProof)
      expect(isValid).toBe(true)
    })

    it('should reject proof with invalid structure', () => {
      const invalidProof = { ...validProof, type: 'invalid' }
      const isValid = LatticeZKP.verifyProof(invalidProof as LatticeProof)
      expect(isValid).toBe(false)
    })

    it('should reject proof with corrupted commitment', () => {
      const invalidProof = { 
        ...validProof, 
        commitment: Buffer.from('corrupted') 
      }
      const isValid = LatticeZKP.verifyProof(invalidProof)
      expect(isValid).toBe(false)
    })

    it('should reject proof with corrupted challenge', () => {
      const invalidProof = { 
        ...validProof, 
        challenge: Buffer.from('corrupted') 
      }
      const isValid = LatticeZKP.verifyProof(invalidProof)
      expect(isValid).toBe(false)
    })

    it('should reject proof with corrupted response', () => {
      const invalidProof = { 
        ...validProof, 
        response: Buffer.from('corrupted') 
      }
      const isValid = LatticeZKP.verifyProof(invalidProof)
      expect(isValid).toBe(false)
    })

    it('should reject proof with invalid dimension', () => {
      const invalidProof = { ...validProof, dimension: 0 }
      const isValid = LatticeZKP.verifyProof(invalidProof)
      expect(isValid).toBe(false)
    })

    it('should reject proof with invalid modulus', () => {
      const invalidProof = { ...validProof, modulus: 0n }
      const isValid = LatticeZKP.verifyProof(invalidProof)
      expect(isValid).toBe(false)
    })
  })

  describe('LWE operations', () => {
    it('should create LWE commitment', () => {
      const a = [1n, 2n, 3n, 4n]
      const secret = Buffer.from('secret', 'utf8')
      const modulus = 1000n
      
      const commitment = LatticeZKP['createLWECommitment'](a, secret, modulus)
      
      expect(commitment).toBeDefined()
      expect(commitment.length).toBeGreaterThan(0)
    })

    it('should generate LWE challenge', () => {
      const commitment = Buffer.from('commitment', 'utf8')
      const witness = Buffer.from('witness', 'utf8')
      const a = [1n, 2n, 3n, 4n]
      
      const challenge = LatticeZKP['generateLWEChallenge'](commitment, witness, a)
      
      expect(challenge).toBeDefined()
      expect(challenge.length).toBeGreaterThan(0)
    })

    it('should create LWE response', () => {
      const secret = Buffer.from('secret', 'utf8')
      const witness = Buffer.from('witness', 'utf8')
      const challenge = Buffer.from('challenge', 'utf8')
      const a = [1n, 2n, 3n, 4n]
      const modulus = 1000n
      
      const response = LatticeZKP['createLWEResponse'](secret, witness, challenge, a, modulus)
      
      expect(response).toBeDefined()
      expect(response.length).toBeGreaterThan(0)
    })
  })

  describe('LWE equation verification', () => {
    it('should verify LWE equation', () => {
      const proof = LatticeZKP.createProof(testSecret)
      const isValid = LatticeZKP['verifyLWEEquation'](proof)
      expect(isValid).toBe(true)
    })

    it('should reject invalid LWE equation', () => {
      const proof = LatticeZKP.createProof(testSecret)
      const invalidProof = { 
        ...proof, 
        response: Buffer.from('corrupted') 
      }
      const isValid = LatticeZKP['verifyLWEEquation'](invalidProof)
      expect(isValid).toBe(false)
    })
  })

  describe('polynomial commitment', () => {
    it('should verify polynomial commitment', () => {
      const proof = LatticeZKP.createProof(testSecret)
      const isValid = LatticeZKP['verifyPolynomialCommitment'](proof)
      expect(isValid).toBe(true)
    })

    it('should reject invalid polynomial commitment', () => {
      const proof = LatticeZKP.createProof(testSecret)
      const invalidProof = { 
        ...proof, 
        polynomialCommitment: Buffer.from('corrupted') 
      }
      const isValid = LatticeZKP['verifyPolynomialCommitment'](invalidProof)
      expect(isValid).toBe(false)
    })

    it('should create polynomial commitment', () => {
      const commitment = LatticeZKP['createPolynomialCommitment'](256)
      expect(commitment).toBeDefined()
      expect(commitment.length).toBe(32)
    })

    it('should generate polynomial coefficients', () => {
      const coefficients = LatticeZKP['generatePolynomialCoefficients'](10)
      expect(coefficients.length).toBe(10)
      expect(coefficients.every(c => typeof c === 'bigint')).toBe(true)
    })

    it('should create polynomial hash', () => {
      const coefficients = [1n, 2n, 3n, 4n, 5n]
      const hash = LatticeZKP['polynomialHash'](coefficients)
      expect(hash).toBeDefined()
      expect(hash.length).toBe(32)
    })
  })

  describe('zero-knowledge verification', () => {
    it('should verify zero-knowledge property', () => {
      const proof = LatticeZKP.createProof(testSecret)
      const isValid = LatticeZKP['verifyZeroKnowledge'](proof)
      expect(isValid).toBe(true)
    })

    it('should reject proof that reveals secret', () => {
      const proof = LatticeZKP.createProof(testSecret)
      const invalidProof = { 
        ...proof, 
        response: proof.challenge // This would reveal information
      }
      const isValid = LatticeZKP['verifyZeroKnowledge'](invalidProof)
      expect(isValid).toBe(false)
    })
  })

  describe('performance metrics', () => {
    it('should return performance metrics', () => {
      const metrics = LatticeZKP.getPerformanceMetrics()
      
      expect(metrics.generationTime).toBe(2000)
      expect(metrics.verificationTime).toBe(150)
      expect(metrics.proofSize).toBe(1024 * 1024)
    })
  })

  describe('security level', () => {
    it('should return security level information', () => {
      const security = LatticeZKP.getSecurityLevel()
      
      expect(security.quantumResistant).toBe(true)
      expect(security.classicalSecurity).toBe(256)
      expect(security.quantumSecurity).toBe(128)
    })
  })

  describe('error handling', () => {
    it('should handle invalid input gracefully', () => {
      expect(() => LatticeZKP.createProof('')).not.toThrow()
      expect(() => LatticeZKP.createProof(Buffer.alloc(0))).not.toThrow()
    })

    it('should handle verification errors gracefully', () => {
      const invalidProof = {
        type: 'lattice',
        commitment: Buffer.alloc(0),
        challenge: Buffer.alloc(0),
        response: Buffer.alloc(0),
        parameters: {},
        quantumSafe: true,
        timestamp: Date.now(),
        version: '1.0.0',
        dimension: 0,
        modulus: 0n,
        polynomialCommitment: Buffer.alloc(0)
      } as LatticeProof
      
      const isValid = LatticeZKP.verifyProof(invalidProof)
      expect(isValid).toBe(false)
    })
  })

  describe('mathematical properties', () => {
    it('should maintain LWE security properties', () => {
      const proof = LatticeZKP.createProof(testSecret)
      
      // Check that response doesn't directly reveal the secret
      const responseInts = QuantumCrypto.bufferToBigInts(proof.response, proof.dimension)
      
      // Response should be properly randomized
      expect(responseInts.some(r => r !== 0n)).toBe(true)
    })

    it('should use proper lattice dimensions', () => {
      const proof = LatticeZKP.createProof(testSecret)
      
      expect(proof.dimension).toBeGreaterThanOrEqual(128)
      expect(proof.modulus).toBeGreaterThan(2n ** 512n)
    })
  })
}) 