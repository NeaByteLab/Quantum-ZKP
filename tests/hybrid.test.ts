import { HybridZKP } from '../src/algorithms/hybrid'
import { HashZKP } from '../src/algorithms/hash'
import { LatticeZKP } from '../src/algorithms/lattice'
import { MultivariateZKP } from '../src/algorithms/multivariate'
import type { HybridProof, AlgorithmType } from '../src/types'

describe('HybridZKP Algorithm', () => {
  const testSecret = 'test-secret-data'
  const testBuffer = Buffer.from(testSecret, 'utf8')

  describe('createProof', () => {
    it('should create a valid hybrid proof with default parameters', () => {
      const proof = HybridZKP.createProof(testSecret)
      
      expect(proof).toBeDefined()
      expect(proof.type).toBe('hybrid')
      expect(proof.quantumSafe).toBe(true)
      expect(proof.version).toBe('1.0.0')
      expect(proof.commitment).toBeDefined()
      expect(proof.challenge).toBeDefined()
      expect(proof.response).toBeDefined()
      expect(proof.proofs).toBeDefined()
      expect(proof.proofs.length).toBeGreaterThan(0)
      expect(proof.combined).toBeDefined()
      expect(proof.algorithmWeights).toBeDefined()
    })

    it('should create a valid hybrid proof with custom parameters', () => {
      const proof = HybridZKP.createProof(testSecret, {
        algorithms: ['hash', 'lattice'],
        weights: { hash: 0.6, lattice: 0.4, multivariate: 0, hybrid: 0 }
      })
      
      expect(proof.proofs.length).toBe(2)
      expect(proof.algorithmWeights.hash).toBe(0.6)
      expect(proof.algorithmWeights.lattice).toBe(0.4)
    })

    it('should create different proofs for different secrets', () => {
      const proof1 = HybridZKP.createProof('secret1')
      const proof2 = HybridZKP.createProof('secret2')
      
      expect(proof1.commitment).not.toEqual(proof2.commitment)
      expect(proof1.challenge).not.toEqual(proof2.challenge)
      expect(proof1.response).not.toEqual(proof2.response)
    })

    it('should create different proofs for same secret (due to randomness)', () => {
      const proof1 = HybridZKP.createProof(testSecret)
      const proof2 = HybridZKP.createProof(testSecret)
      
      expect(proof1.commitment).not.toEqual(proof2.commitment)
      expect(proof1.challenge).not.toEqual(proof2.challenge)
      expect(proof1.response).not.toEqual(proof2.response)
    })

    it('should work with Buffer input', () => {
      const proof = HybridZKP.createProof(testBuffer)
      
      expect(proof.type).toBe('hybrid')
      expect(proof.quantumSafe).toBe(true)
    })

    it('should validate parameters correctly', () => {
      expect(() => HybridZKP.createProof(testSecret, { algorithms: ['invalid' as any] }))
        .toThrow('Invalid hybrid parameters')
    })
  })

  describe('verifyProof', () => {
    let validProof: HybridProof

    beforeEach(() => {
      validProof = HybridZKP.createProof(testSecret)
    })

    it('should verify a valid proof', () => {
      const isValid = HybridZKP.verifyProof(validProof)
      expect(isValid).toBe(true)
    })

    it('should reject proof with invalid structure', () => {
      const invalidProof = { ...validProof, type: 'invalid' }
      const isValid = HybridZKP.verifyProof(invalidProof as HybridProof)
      expect(isValid).toBe(false)
    })

    it('should reject proof with corrupted commitment', () => {
      const invalidProof = { 
        ...validProof, 
        commitment: Buffer.from('corrupted') 
      }
      const isValid = HybridZKP.verifyProof(invalidProof)
      expect(isValid).toBe(false)
    })

    it('should reject proof with corrupted challenge', () => {
      const invalidProof = { 
        ...validProof, 
        challenge: Buffer.from('corrupted') 
      }
      const isValid = HybridZKP.verifyProof(invalidProof)
      expect(isValid).toBe(false)
    })

    it('should reject proof with corrupted response', () => {
      const invalidProof = { 
        ...validProof, 
        response: Buffer.from('corrupted') 
      }
      const isValid = HybridZKP.verifyProof(invalidProof)
      expect(isValid).toBe(false)
    })

    it('should reject proof with empty proofs array', () => {
      const invalidProof = { ...validProof, proofs: [] }
      const isValid = HybridZKP.verifyProof(invalidProof)
      expect(isValid).toBe(false)
    })

    it('should reject proof with corrupted combined proof', () => {
      const invalidProof = { 
        ...validProof, 
        combined: Buffer.from('corrupted') 
      }
      const isValid = HybridZKP.verifyProof(invalidProof)
      expect(isValid).toBe(false)
    })
  })

  describe('component proof generation', () => {
    it('should generate component proofs', () => {
      const algorithms: AlgorithmType[] = ['hash', 'lattice']
      const proofs = HybridZKP['generateComponentProofs'](testBuffer, algorithms)
      
      expect(proofs).toBeDefined()
      expect(proofs.length).toBe(2)
      expect(proofs[0].type).toBe('hash')
      expect(proofs[1].type).toBe('lattice')
    })

    it('should generate all component proof types', () => {
      const algorithms: AlgorithmType[] = ['hash', 'lattice', 'multivariate']
      const proofs = HybridZKP['generateComponentProofs'](testBuffer, algorithms)
      
      expect(proofs.length).toBe(3)
      expect(proofs.some(p => p.type === 'hash')).toBe(true)
      expect(proofs.some(p => p.type === 'lattice')).toBe(true)
      expect(proofs.some(p => p.type === 'multivariate')).toBe(true)
    })
  })

  describe('hybrid commitment creation', () => {
    it('should create hybrid commitment', () => {
      const proofs = [
        HashZKP.createProof(testSecret),
        LatticeZKP.createProof(testSecret)
      ]
      
      const commitment = HybridZKP['createHybridCommitment'](testBuffer, proofs)
      
      expect(commitment).toBeDefined()
      expect(commitment.length).toBeGreaterThan(0)
    })
  })

  describe('hybrid challenge generation', () => {
    it('should generate hybrid challenge', () => {
      const commitment = Buffer.from('commitment', 'utf8')
      const witness = Buffer.from('witness', 'utf8')
      const proofs = [
        HashZKP.createProof(testSecret),
        LatticeZKP.createProof(testSecret)
      ]
      
      const challenge = HybridZKP['generateHybridChallenge'](commitment, witness, proofs)
      
      expect(challenge).toBeDefined()
      expect(challenge.length).toBe(32)
    })
  })

  describe('hybrid response creation', () => {
    it('should create hybrid response', () => {
      const secret = Buffer.from('secret', 'utf8')
      const witness = Buffer.from('witness', 'utf8')
      const challenge = Buffer.from('challenge', 'utf8')
      const proofs = [
        HashZKP.createProof(testSecret),
        LatticeZKP.createProof(testSecret)
      ]
      
      const response = HybridZKP['createHybridResponse'](secret, witness, challenge, proofs)
      
      expect(response).toBeDefined()
      expect(response.length).toBeGreaterThan(0)
    })
  })

  describe('proof combination', () => {
    it('should combine proofs with weights', () => {
      const proofs = [
        HashZKP.createProof(testSecret),
        LatticeZKP.createProof(testSecret)
      ]
      const weights = { hash: 0.6, lattice: 0.4, multivariate: 0, hybrid: 0 }
      
      const combined = HybridZKP['combineProofs'](proofs, weights)
      
      expect(combined).toBeDefined()
      expect(combined.length).toBeGreaterThan(0)
    })

    it('should handle different weight distributions', () => {
      const proofs = [
        HashZKP.createProof(testSecret),
        LatticeZKP.createProof(testSecret)
      ]
      const weights1 = { hash: 0.8, lattice: 0.2, multivariate: 0, hybrid: 0 }
      const weights2 = { hash: 0.2, lattice: 0.8, multivariate: 0, hybrid: 0 }
      
      const combined1 = HybridZKP['combineProofs'](proofs, weights1)
      const combined2 = HybridZKP['combineProofs'](proofs, weights2)
      
      expect(combined1).not.toEqual(combined2)
    })
  })

  describe('component proof verification', () => {
    it('should verify component proofs', () => {
      const hashProof = HashZKP.createProof(testSecret)
      const latticeProof = LatticeZKP.createProof(testSecret)
      
      const isValid1 = HybridZKP['verifyComponentProof'](hashProof)
      const isValid2 = HybridZKP['verifyComponentProof'](latticeProof)
      
      expect(isValid1).toBe(true)
      expect(isValid2).toBe(true)
    })

    it('should reject invalid component proofs', () => {
      const invalidProof = { type: 'hash', commitment: Buffer.alloc(0) }
      const isValid = HybridZKP['verifyComponentProof'](invalidProof as any)
      expect(isValid).toBe(false)
    })
  })

  describe('hybrid commitment verification', () => {
    it('should verify hybrid commitment', () => {
      const proof = HybridZKP.createProof(testSecret)
      const isValid = HybridZKP['verifyHybridCommitment'](proof)
      expect(isValid).toBe(true)
    })

    it('should reject invalid hybrid commitment', () => {
      const proof = HybridZKP.createProof(testSecret)
      const invalidProof = { 
        ...proof, 
        commitment: Buffer.from('corrupted') 
      }
      const isValid = HybridZKP['verifyHybridCommitment'](invalidProof)
      expect(isValid).toBe(false)
    })
  })

  describe('zero-knowledge verification', () => {
    it('should verify zero-knowledge property', () => {
      const proof = HybridZKP.createProof(testSecret)
      const isValid = HybridZKP['verifyZeroKnowledge'](proof)
      expect(isValid).toBe(true)
    })

    it('should reject proof that reveals secret', () => {
      const proof = HybridZKP.createProof(testSecret)
      const invalidProof = { 
        ...proof, 
        response: proof.challenge // This would reveal information
      }
      const isValid = HybridZKP['verifyZeroKnowledge'](invalidProof)
      expect(isValid).toBe(false)
    })
  })

  describe('combined proof verification', () => {
    it('should verify combined proof', () => {
      const proof = HybridZKP.createProof(testSecret)
      const isValid = HybridZKP['verifyCombinedProof'](proof)
      expect(isValid).toBe(true)
    })

    it('should reject invalid combined proof', () => {
      const proof = HybridZKP.createProof(testSecret)
      const invalidProof = { 
        ...proof, 
        combined: Buffer.from('corrupted') 
      }
      const isValid = HybridZKP['verifyCombinedProof'](invalidProof)
      expect(isValid).toBe(false)
    })
  })

  describe('optimized proof creation', () => {
    it('should create optimized proof', () => {
      const proof = HybridZKP.createOptimizedProof(testSecret, ['hash', 'lattice'])
      
      expect(proof.type).toBe('hybrid')
      expect(proof.proofs.length).toBe(2)
      expect(proof.proofs[0].type).toBe('hash')
      expect(proof.proofs[1].type).toBe('lattice')
    })

    it('should create maximum security proof', () => {
      const proof = HybridZKP.createMaximumSecurityProof(testSecret)
      
      expect(proof.type).toBe('hybrid')
      expect(proof.proofs.length).toBe(3) // hash, lattice, multivariate
      expect(proof.quantumSafe).toBe(true)
    })
  })

  describe('performance metrics', () => {
    it('should return performance metrics', () => {
      const metrics = HybridZKP.getPerformanceMetrics()
      
      expect(metrics.generationTime).toBe(6000)
      expect(metrics.verificationTime).toBe(400)
      expect(metrics.proofSize).toBe(4 * 1024 * 1024)
    })
  })

  describe('security level', () => {
    it('should return security level information', () => {
      const security = HybridZKP.getSecurityLevel()
      
      expect(security.quantumResistant).toBe(true)
      expect(security.classicalSecurity).toBe(512)
      expect(security.quantumSecurity).toBe(256)
    })
  })

  describe('error handling', () => {
    it('should handle invalid input gracefully', () => {
      expect(() => HybridZKP.createProof('')).not.toThrow()
      expect(() => HybridZKP.createProof(Buffer.alloc(0))).not.toThrow()
    })

    it('should handle verification errors gracefully', () => {
      const invalidProof = {
        type: 'hybrid',
        commitment: Buffer.alloc(0),
        challenge: Buffer.alloc(0),
        response: Buffer.alloc(0),
        parameters: {},
        quantumSafe: true,
        timestamp: Date.now(),
        version: '1.0.0',
        proofs: [],
        combined: Buffer.alloc(0),
        algorithmWeights: { hash: 0, lattice: 0, multivariate: 0, hybrid: 0 }
      } as HybridProof
      
      const isValid = HybridZKP.verifyProof(invalidProof)
      expect(isValid).toBe(false)
    })
  })

  describe('algorithm integration', () => {
    it('should integrate all algorithms correctly', () => {
      const proof = HybridZKP.createProof(testSecret)
      
      // Verify all component proofs are valid
      for (const componentProof of proof.proofs) {
        let isValid = false
        switch (componentProof.type) {
          case 'hash':
            isValid = HashZKP.verifyProof(componentProof)
            break
          case 'lattice':
            isValid = LatticeZKP.verifyProof(componentProof)
            break
          case 'multivariate':
            isValid = MultivariateZKP.verifyProof(componentProof)
            break
        }
        expect(isValid).toBe(true)
      }
    })

    it('should maintain security properties across algorithms', () => {
      const proof = HybridZKP.createProof(testSecret)
      
      // All component proofs should be quantum-safe
      expect(proof.proofs.every(p => p.quantumSafe)).toBe(true)
      
      // Combined proof should be quantum-safe
      expect(proof.quantumSafe).toBe(true)
    })
  })
}) 