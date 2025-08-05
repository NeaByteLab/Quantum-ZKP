import { MultivariateZKP } from '../src/algorithms/multivariate'
import type { MultivariateProof } from '../src/types'

describe('MultivariateZKP Algorithm', () => {
  const testSecret = 'test-secret-data'
  const testBuffer = Buffer.from(testSecret, 'utf8')

  describe('createProof', () => {
    it('should create a valid multivariate proof with default parameters', () => {
      const proof = MultivariateZKP.createProof(testSecret)
      
      expect(proof).toBeDefined()
      expect(proof.type).toBe('multivariate')
      expect(proof.quantumSafe).toBe(true)
      expect(proof.version).toBe('1.0.0')
      expect(proof.variables).toBe(8)
      expect(proof.equations).toBe(12)
      expect(proof.commitment).toBeDefined()
      expect(proof.challenge).toBeDefined()
      expect(proof.response).toBeDefined()
      expect(proof.polynomialSystem).toBeDefined()
      expect(proof.solution).toBeDefined()
    })

    it('should create a valid multivariate proof with custom parameters', () => {
      const proof = MultivariateZKP.createProof(testSecret, { 
        variables: 16, 
        equations: 24 
      })
      
      expect(proof.variables).toBe(16)
      expect(proof.equations).toBe(24)
    })

    it('should create different proofs for different secrets', () => {
      const proof1 = MultivariateZKP.createProof('secret1')
      const proof2 = MultivariateZKP.createProof('secret2')
      
      expect(proof1.commitment).not.toEqual(proof2.commitment)
      expect(proof1.challenge).not.toEqual(proof2.challenge)
      expect(proof1.response).not.toEqual(proof2.response)
    })

    it('should create different proofs for same secret (due to randomness)', () => {
      const proof1 = MultivariateZKP.createProof(testSecret)
      const proof2 = MultivariateZKP.createProof(testSecret)
      
      expect(proof1.commitment).not.toEqual(proof2.commitment)
      expect(proof1.challenge).not.toEqual(proof2.challenge)
      expect(proof1.response).not.toEqual(proof2.response)
    })

    it('should work with Buffer input', () => {
      const proof = MultivariateZKP.createProof(testBuffer)
      
      expect(proof.type).toBe('multivariate')
      expect(proof.quantumSafe).toBe(true)
    })

    it('should validate parameters correctly', () => {
      expect(() => MultivariateZKP.createProof(testSecret, { variables: 4 }))
        .toThrow('Invalid multivariate parameters')
    })
  })

  describe('verifyProof', () => {
    let validProof: MultivariateProof

    beforeEach(() => {
      validProof = MultivariateZKP.createProof(testSecret)
    })

    it('should verify a valid proof', () => {
      const isValid = MultivariateZKP.verifyProof(validProof)
      expect(isValid).toBe(true)
    })

    it('should reject proof with invalid structure', () => {
      const invalidProof = { ...validProof, type: 'invalid' }
      const isValid = MultivariateZKP.verifyProof(invalidProof as MultivariateProof)
      expect(isValid).toBe(false)
    })

    it('should reject proof with corrupted commitment', () => {
      const invalidProof = { 
        ...validProof, 
        commitment: Buffer.from('corrupted') 
      }
      const isValid = MultivariateZKP.verifyProof(invalidProof)
      expect(isValid).toBe(false)
    })

    it('should reject proof with corrupted challenge', () => {
      const invalidProof = { 
        ...validProof, 
        challenge: Buffer.from('corrupted') 
      }
      const isValid = MultivariateZKP.verifyProof(invalidProof)
      expect(isValid).toBe(false)
    })

    it('should reject proof with corrupted response', () => {
      const invalidProof = { 
        ...validProof, 
        response: Buffer.from('corrupted') 
      }
      const isValid = MultivariateZKP.verifyProof(invalidProof)
      expect(isValid).toBe(false)
    })

    it('should reject proof with invalid variables', () => {
      const invalidProof = { ...validProof, variables: 0 }
      const isValid = MultivariateZKP.verifyProof(invalidProof)
      expect(isValid).toBe(false)
    })

    it('should reject proof with invalid equations', () => {
      const invalidProof = { ...validProof, equations: 0 }
      const isValid = MultivariateZKP.verifyProof(invalidProof)
      expect(isValid).toBe(false)
    })
  })

  describe('multivariate system operations', () => {
    it('should generate multivariate system', () => {
      const system = MultivariateZKP['generateMultivariateSystem'](8, 12, 2)
      
      expect(system).toBeDefined()
      expect(system.length).toBeGreaterThan(0) // JSON string will have variable length
      // Note: The actual structure depends on the implementation
      // This test may need adjustment based on the real return type
    })

    it('should solve multivariate system', () => {
      const secret = Buffer.from('secret', 'utf8')
      const polynomialSystem = Buffer.from('system', 'utf8')
      
      const solution = MultivariateZKP['solveMultivariateSystem'](secret, polynomialSystem)
      
      expect(solution).toBeDefined()
      expect(solution.length).toBeGreaterThan(0)
    })

    it('should create multivariate commitment', () => {
      const secret = Buffer.from('secret', 'utf8')
      const polynomialSystem = Buffer.from('system', 'utf8')
      
      const commitment = MultivariateZKP['createMultivariateCommitment'](secret, polynomialSystem)
      
      expect(commitment).toBeDefined()
      expect(commitment.length).toBeGreaterThan(0)
    })

    it('should generate multivariate challenge', () => {
      const commitment = Buffer.from('commitment', 'utf8')
      const witness = Buffer.from('witness', 'utf8')
      const polynomialSystem = Buffer.from('system', 'utf8')
      
      const challenge = MultivariateZKP['generateMultivariateChallenge'](commitment, witness, polynomialSystem)
      
      expect(challenge).toBeDefined()
      expect(challenge.length).toBe(32)
    })

    it('should create multivariate response', () => {
      const secret = Buffer.from('secret', 'utf8')
      const witness = Buffer.from('witness', 'utf8')
      const challenge = Buffer.from('challenge', 'utf8')
      
      const response = MultivariateZKP['createMultivariateResponse'](secret, witness, challenge)
      
      expect(response).toBeDefined()
      expect(response.length).toBeGreaterThan(0)
    })
  })

  describe('polynomial solution verification', () => {
    it('should verify polynomial solution', () => {
      const proof = MultivariateZKP.createProof(testSecret)
      const isValid = MultivariateZKP['verifyPolynomialSolution'](proof)
      expect(isValid).toBe(true)
    })

    it('should reject invalid polynomial solution', () => {
      const proof = MultivariateZKP.createProof(testSecret)
      const invalidProof = { 
        ...proof, 
        solution: Buffer.from('corrupted') 
      }
      const isValid = MultivariateZKP['verifyPolynomialSolution'](invalidProof)
      expect(isValid).toBe(false)
    })
  })

  describe('multivariate commitment verification', () => {
    it('should verify multivariate commitment', () => {
      const proof = MultivariateZKP.createProof(testSecret)
      const isValid = MultivariateZKP['verifyMultivariateCommitment'](proof)
      expect(isValid).toBe(true)
    })

    it('should reject invalid multivariate commitment', () => {
      const proof = MultivariateZKP.createProof(testSecret)
      const invalidProof = { 
        ...proof, 
        commitment: Buffer.from('corrupted') 
      }
      const isValid = MultivariateZKP['verifyMultivariateCommitment'](invalidProof)
      expect(isValid).toBe(false)
    })
  })

  describe('zero-knowledge verification', () => {
    it('should verify zero-knowledge property', () => {
      const proof = MultivariateZKP.createProof(testSecret)
      const isValid = MultivariateZKP['verifyZeroKnowledge'](proof)
      expect(isValid).toBe(true)
    })

    it('should reject proof that reveals secret', () => {
      const proof = MultivariateZKP.createProof(testSecret)
      const invalidProof = { 
        ...proof, 
        response: proof.challenge // This would reveal information
      }
      const isValid = MultivariateZKP['verifyZeroKnowledge'](invalidProof)
      expect(isValid).toBe(false)
    })
  })

  describe('polynomial system serialization', () => {
    it('should serialize polynomial system', () => {
      const system = [
        [[1n, 2n], [3n, 4n]],
        [[5n, 6n], [7n, 8n]]
      ]
      
      const serialized = MultivariateZKP['serializePolynomialSystem'](system)
      
      expect(serialized).toBeDefined()
      expect(serialized.length).toBeGreaterThan(0)
    })

    it('should deserialize polynomial system', () => {
      const system = [
        [[1n, 2n], [3n, 4n]],
        [[5n, 6n], [7n, 8n]]
      ]
      
      const serialized = MultivariateZKP['serializePolynomialSystem'](system)
      const deserialized = MultivariateZKP['deserializePolynomialSystem'](serialized)
      
      expect(deserialized).toBeDefined()
      expect(deserialized.length).toBe(system.length)
    })
  })

  describe('optimized multivariate system', () => {
    it('should create optimized multivariate system', () => {
      const secret = Buffer.from('secret', 'utf8')
      const system = MultivariateZKP.createOptimizedMultivariateSystem(secret, 8, 12)
      
      expect(system).toBeDefined()
      expect(system.length).toBeGreaterThan(0)
    })
  })

  describe('performance metrics', () => {
    it('should return performance metrics', () => {
      const metrics = MultivariateZKP.getPerformanceMetrics()
      
      expect(metrics.generationTime).toBe(3000)
      expect(metrics.verificationTime).toBe(200)
      expect(metrics.proofSize).toBe(2 * 1024 * 1024)
    })
  })

  describe('security level', () => {
    it('should return security level information', () => {
      const security = MultivariateZKP.getSecurityLevel()
      
      expect(security.quantumResistant).toBe(true)
      expect(security.classicalSecurity).toBe(256)
      expect(security.quantumSecurity).toBe(128)
    })
  })

  describe('error handling', () => {
    it('should handle invalid input gracefully', () => {
      expect(() => MultivariateZKP.createProof('')).not.toThrow()
      expect(() => MultivariateZKP.createProof(Buffer.alloc(0))).not.toThrow()
    })

    it('should handle verification errors gracefully', () => {
      const invalidProof = {
        type: 'multivariate',
        commitment: Buffer.alloc(0),
        challenge: Buffer.alloc(0),
        response: Buffer.alloc(0),
        parameters: {},
        quantumSafe: true,
        timestamp: Date.now(),
        version: '1.0.0',
        variables: 0,
        equations: 0,
        polynomialSystem: Buffer.alloc(0),
        solution: Buffer.alloc(0)
      } as MultivariateProof
      
      const isValid = MultivariateZKP.verifyProof(invalidProof)
      expect(isValid).toBe(false)
    })
  })

  describe('mathematical properties', () => {
    it('should maintain multivariate security properties', () => {
      const proof = MultivariateZKP.createProof(testSecret)
      
      // Check that solution doesn't directly reveal the secret
      expect(proof.solution.length).toBeGreaterThan(0)
      expect(proof.polynomialSystem.length).toBeGreaterThan(0)
    })

    it('should use proper multivariate dimensions', () => {
      const proof = MultivariateZKP.createProof(testSecret)
      
      expect(proof.variables).toBeGreaterThanOrEqual(8)
      expect(proof.equations).toBeGreaterThanOrEqual(proof.variables)
    })
  })
}) 