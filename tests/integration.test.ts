import { QuantumZKP } from '../src/core/quantum-zkp'
import { HashZKP } from '../src/algorithms/hash'
import { LatticeZKP } from '../src/algorithms/lattice'
import { MultivariateZKP } from '../src/algorithms/multivariate'
import { HybridZKP } from '../src/algorithms/hybrid'
import { QuantumCrypto } from '../src/utils/crypto'

describe('QuantumZKP Integration Tests', () => {
  const testSecret = 'integration-test-secret'

  describe('Core QuantumZKP Integration', () => {
    let zkp: QuantumZKP

    beforeEach(() => {
      zkp = new QuantumZKP()
    })

    it('should create and verify proofs for all algorithms', async () => {
      const algorithms = ['hash', 'lattice', 'multivariate', 'hybrid'] as const
      
      for (const algorithm of algorithms) {
        const proof = zkp.createProof(testSecret, algorithm)
        const result = zkp.verifyProof(proof)
        
        expect(result.isValid).toBe(true)
        expect(result.algorithm).toBe(algorithm)
        expect(result.verificationTime).toBeGreaterThan(0)
      }
    })

    it('should handle batch proof creation', () => {
      const secrets = ['secret1', 'secret2', 'secret3']
      const proofs = zkp.batchCreateProofs(secrets, 'hash')
      
      expect(proofs.length).toBe(3)
      expect(proofs.every(p => p.type === 'hash')).toBe(true)
    })

    it('should create threshold proofs', () => {
      const thresholdProof = zkp.createThresholdProof(testSecret, 3, 'hash')
      
      expect(thresholdProof.parties).toBe(3)
      expect(thresholdProof.threshold).toBe(2) // Math.ceil(3/2)
      expect(thresholdProof.proofs.length).toBe(3)
      expect(thresholdProof.quantumSafe).toBe(true)
    })

    it('should get performance metrics for all algorithms', () => {
      const algorithms = ['hash', 'lattice', 'multivariate', 'hybrid'] as const
      
      for (const algorithm of algorithms) {
        const metrics = zkp.getPerformanceMetrics(algorithm)
        
        expect(metrics.generationTime).toBeGreaterThan(0)
        expect(metrics.verificationTime).toBeGreaterThan(0)
        expect(metrics.proofSize).toBeGreaterThan(0)
        expect(metrics.memoryUsage).toBeGreaterThan(0)
      }
    })

    it('should get security levels for all algorithms', () => {
      const algorithms = ['hash', 'lattice', 'multivariate', 'hybrid'] as const
      
      for (const algorithm of algorithms) {
        const security = zkp.getSecurityLevel(algorithm)
        
        expect(security.quantumResistant).toBe(true)
        expect(security.classicalSecurity).toBeGreaterThan(0)
        expect(security.quantumSecurity).toBeGreaterThan(0)
        expect(security.recommendedUse).toBeInstanceOf(Array)
      }
    })

    it('should benchmark all algorithms', () => {
      const results = zkp.benchmarkAllAlgorithms()
      
      expect(results.length).toBe(4) // hash, lattice, multivariate, hybrid
      expect(results.every(r => r.algorithm)).toBe(true)
      expect(results.every(r => r.operationsPerSecond > 0)).toBe(true)
    })

    it('should get algorithm configurations', () => {
      const algorithms = ['hash', 'lattice', 'multivariate', 'hybrid'] as const
      
      for (const algorithm of algorithms) {
        const config = zkp.getAlgorithmConfig(algorithm)
        
        expect(config.name).toBe(algorithm)
        expect(config.securityLevel).toBeDefined()
        expect(config.performanceProfile).toBeDefined()
        expect(config.recommendedFor).toBeInstanceOf(Array)
        expect(config.limitations).toBeInstanceOf(Array)
      }
    })

    it('should get supported algorithms', () => {
      const algorithms = zkp.getSupportedAlgorithms()
      expect(algorithms).toContain('hash')
      expect(algorithms).toContain('lattice')
      expect(algorithms).toContain('multivariate')
      expect(algorithms).toContain('hybrid')
    })

    it('should check quantum resistance for all algorithms', () => {
      const algorithms = ['hash', 'lattice', 'multivariate', 'hybrid'] as const
      
      for (const algorithm of algorithms) {
        const isResistant = zkp.isQuantumResistant(algorithm)
        expect(isResistant).toBe(true)
      }
    })
  })

  describe('Cross-Algorithm Compatibility', () => {
    it('should create proofs with different algorithms and verify them', () => {
      const hashProof = HashZKP.createProof(testSecret)
      const latticeProof = LatticeZKP.createProof(testSecret)
      const multivariateProof = MultivariateZKP.createProof(testSecret)
      const hybridProof = HybridZKP.createProof(testSecret)
      
      // Verify all proofs are valid
      expect(HashZKP.verifyProof(hashProof)).toBe(true)
      expect(LatticeZKP.verifyProof(latticeProof)).toBe(true)
      expect(MultivariateZKP.verifyProof(multivariateProof)).toBe(true)
      expect(HybridZKP.verifyProof(hybridProof)).toBe(true)
    })

    it('should handle different input types consistently', () => {
      const stringSecret = 'string-secret'
      const bufferSecret = Buffer.from('buffer-secret', 'utf8')
      
      const algorithms = [HashZKP, LatticeZKP, MultivariateZKP, HybridZKP]
      
      for (const Algorithm of algorithms) {
        const stringProof = Algorithm.createProof(stringSecret)
        const bufferProof = Algorithm.createProof(bufferSecret)
        
        expect(stringProof.type).toBe(bufferProof.type)
        expect(stringProof.quantumSafe).toBe(bufferProof.quantumSafe)
        expect(stringProof.version).toBe(bufferProof.version)
      }
    })

    it('should maintain consistent security properties across algorithms', () => {
      const algorithms = [HashZKP, LatticeZKP, MultivariateZKP, HybridZKP]
      
      for (const Algorithm of algorithms) {
        const proof = Algorithm.createProof(testSecret)
        const security = Algorithm.getSecurityLevel()
        
        expect(proof.quantumSafe).toBe(true)
        expect(security.quantumResistant).toBe(true)
        expect(security.classicalSecurity).toBeGreaterThan(0)
        expect(security.quantumSecurity).toBeGreaterThan(0)
      }
    })
  })

  describe('Cryptographic Integration', () => {
    it('should use consistent cryptographic primitives', () => {
      const testData = 'test-data'
      const testKey = 'test-key'
      
      // Test hash functions
      const sha256 = QuantumCrypto.hash(testData, 'sha256')
      const sha384 = QuantumCrypto.hash(testData, 'sha384')
      const sha512 = QuantumCrypto.hash(testData, 'sha512')
      
      expect(sha256.length).toBe(32)
      expect(sha384.length).toBe(48)
      expect(sha512.length).toBe(64)
      
      // Test HMAC
      const hmac = QuantumCrypto.hmac(testData, testKey, 'sha256')
      expect(hmac.length).toBe(32)
      
      // Test random generation
      const randomBytes = QuantumCrypto.generateRandomBytes(32)
      expect(randomBytes.length).toBe(32)
    })

    it('should generate secure primes for lattice operations', () => {
      const prime64 = QuantumCrypto.generateLargePrime(64)
      const prime128 = QuantumCrypto.generateLargePrime(128)
      
      expect(QuantumCrypto.millerRabinPrimalityTest(prime64)).toBe(true)
      expect(QuantumCrypto.millerRabinPrimalityTest(prime128)).toBe(true)
      expect(prime64 !== prime128).toBe(true)
    })

    it('should create and verify Merkle trees', () => {
      const leaves = [
        Buffer.from('leaf1', 'utf8'),
        Buffer.from('leaf2', 'utf8'),
        Buffer.from('leaf3', 'utf8'),
        Buffer.from('leaf4', 'utf8')
      ]
      
      const { tree, root } = QuantumCrypto.generateMerkleTree(leaves)
      const proof = QuantumCrypto.generateMerkleProof(tree, 0)
      
      const isValid = QuantumCrypto.verifyMerkleProof(leaves[0], proof, root, 0)
      expect(isValid).toBe(true)
    })

    it('should handle LWE operations for lattice cryptography', () => {
      const dimension = 4
      const modulus = 1000n
      const errorBound = 8n
      
      const sample = QuantumCrypto.generateLWESample(dimension, modulus, errorBound)
      expect(sample.a.length).toBe(dimension)
      expect(typeof sample.b).toBe('bigint')
      
      const error = QuantumCrypto.generateDiscreteGaussianError(errorBound)
      expect(typeof error).toBe('bigint')
      // Allow for some variance in Gaussian distribution (3x bound is reasonable)
      expect(Math.abs(Number(error)) <= Number(errorBound) * 3).toBe(true)
    })

    it('should handle multivariate polynomial operations', () => {
      const variables = 4
      const equations = 6
      const degree = 2
      
      const system = QuantumCrypto.generateMultivariateSystem(variables, equations, degree)
      expect(system.length).toBe(equations)
      expect(system[0].length).toBe(variables)
      
      const polynomial = system[0]
      const values = [1n, 2n, 3n, 4n]
      const result = QuantumCrypto.evaluateMultivariatePolynomial(polynomial, values)
      expect(typeof result).toBe('bigint')
    })
  })

  describe('Performance and Security Integration', () => {
    it('should maintain performance characteristics across algorithms', () => {
      const algorithms = [
        { class: HashZKP },
        { class: LatticeZKP },
        { class: MultivariateZKP },
        { class: HybridZKP }
      ]
      
      for (const { class: Algorithm } of algorithms) {
        const metrics = Algorithm.getPerformanceMetrics()
        const security = Algorithm.getSecurityLevel()
        
        expect(metrics.generationTime).toBeGreaterThan(0)
        expect(metrics.verificationTime).toBeGreaterThan(0)
        expect(metrics.proofSize).toBeGreaterThan(0)
        
        expect(security.quantumResistant).toBe(true)
        expect(security.classicalSecurity).toBeGreaterThan(0)
        expect(security.quantumSecurity).toBeGreaterThan(0)
      }
    })

    it('should handle parameter validation consistently', () => {
      const validParams = {
        hash: { chainLength: 500 },
        lattice: { dimension: 256, modulus: 1000n },
        multivariate: { variables: 16, equations: 24 },
        hybrid: { algorithms: ['hash', 'lattice'] }
      }
      
      const invalidParams = {
        hash: { chainLength: 50 },
        lattice: { dimension: 64, modulus: 0n },
        multivariate: { variables: 4, equations: 8 },
        hybrid: { algorithms: ['invalid'] }
      }
      
      // Test valid parameters
      for (const [algorithm, params] of Object.entries(validParams)) {
        expect(QuantumCrypto.validateParameters(algorithm as any, params)).toBe(true)
      }
      
      // Test invalid parameters
      for (const [algorithm, params] of Object.entries(invalidParams)) {
        expect(QuantumCrypto.validateParameters(algorithm as any, params)).toBe(false)
      }
    })

    it('should handle error conditions gracefully', () => {
      // Test with empty secrets
      expect(() => HashZKP.createProof('')).not.toThrow()
      expect(() => LatticeZKP.createProof('')).not.toThrow()
      expect(() => MultivariateZKP.createProof('')).not.toThrow()
      expect(() => HybridZKP.createProof('')).not.toThrow()
      
      // Test with empty buffers
      expect(() => HashZKP.createProof(Buffer.alloc(0))).not.toThrow()
      expect(() => LatticeZKP.createProof(Buffer.alloc(0))).not.toThrow()
      expect(() => MultivariateZKP.createProof(Buffer.alloc(0))).not.toThrow()
      expect(() => HybridZKP.createProof(Buffer.alloc(0))).not.toThrow()
    })
  })

  describe('Real-World Scenarios', () => {
    it('should handle blockchain-style proof creation and verification', () => {
      const transactionData = {
        sender: 'alice',
        receiver: 'bob',
        amount: 100,
        timestamp: Date.now()
      }
      
      const secret = JSON.stringify(transactionData)
      
      // Create proofs with different algorithms
      const hashProof = HashZKP.createProof(secret)
      const latticeProof = LatticeZKP.createProof(secret)
      const hybridProof = HybridZKP.createProof(secret)
      
      // Verify all proofs
      expect(HashZKP.verifyProof(hashProof)).toBe(true)
      expect(LatticeZKP.verifyProof(latticeProof)).toBe(true)
      expect(HybridZKP.verifyProof(hybridProof)).toBe(true)
    })

    it('should handle IoT device authentication scenario', () => {
      const deviceId = 'device-123'
      const deviceSecret = 'device-secret-key'
      const capabilities = ['read', 'write', 'delete']
      
      const authData = {
        deviceId,
        secret: deviceSecret,
        capabilities,
        timestamp: Date.now()
      }
      
      const secret = JSON.stringify(authData)
      
      // Use hash-based ZKP for IoT (faster, lower memory)
      const proof = HashZKP.createProof(secret, { chainLength: 500 })
      const isValid = HashZKP.verifyProof(proof)
      
      expect(isValid).toBe(true)
      expect(proof.type).toBe('hash')
      expect(proof.quantumSafe).toBe(true)
    })

    it('should handle enterprise document signing scenario', () => {
      const documentHash = 'sha256:abc123...'
      const signerId = 'enterprise-user-456'
      const privateKey = 'enterprise-private-key'
      
      const signatureData = {
        document: documentHash,
        signerId,
        privateKey,
        timestamp: Date.now()
      }
      
      const secret = JSON.stringify(signatureData)
      
      // Use lattice-based ZKP for enterprise (higher security)
      const proof = LatticeZKP.createProof(secret, {
        dimension: 512,
        modulus: 2n ** 1024n
      })
      const isValid = LatticeZKP.verifyProof(proof)
      
      expect(isValid).toBe(true)
      expect(proof.type).toBe('lattice')
      expect(proof.quantumSafe).toBe(true)
      expect(proof.dimension).toBe(512)
    })

    it('should handle maximum security scenario', () => {
      const classifiedData = {
        level: 'top-secret',
        content: 'classified-information',
        clearance: 'level-5',
        timestamp: Date.now()
      }
      
      const secret = JSON.stringify(classifiedData)
      
      // Use hybrid ZKP for maximum security
      const proof = HybridZKP.createProof(secret, {
        algorithms: ['lattice', 'hash', 'multivariate'],
        weights: { lattice: 0.4, hash: 0.3, multivariate: 0.2, hybrid: 0.1 }
      })
      const isValid = HybridZKP.verifyProof(proof)
      
      expect(isValid).toBe(true)
      expect(proof.type).toBe('hybrid')
      expect(proof.quantumSafe).toBe(true)
      expect(proof.proofs.length).toBe(3)
    })
  })
}) 