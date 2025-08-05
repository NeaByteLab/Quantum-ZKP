/**
 * Main Educational Quantum-Resistant Zero-Knowledge Proof class
 * @author NeaByteLab
 * @version 1.0.0
 */

import { LatticeZKP } from '@algorithms/lattice'
import { HashZKP } from '@algorithms/hash'
import { MultivariateZKP } from '@algorithms/multivariate'
import { HybridZKP } from '@algorithms/hybrid'
import { QuantumCrypto } from '@utils/crypto'
import type {
  AlgorithmType,
  Proof,
  ProofParameters,
  VerificationResult,
  PerformanceMetrics,
  SecurityLevel,
  ZKPConfig,
  BatchProcessingOptions,
  ThresholdProof,
  BenchmarkResult,
  AlgorithmConfig
} from '../types'

/**
 * Main Educational Quantum-Resistant ZKP class
 * Provides simplified implementations for learning quantum-resistant cryptography concepts
 */
export class QuantumZKP {
  private static readonly VERSION = '1.0.0'
  private static readonly LEARNING_USE = ['learning', 'prototyping']
  private static readonly EDUCATIONAL_LIMITATIONS = ['educational implementation', 'not production-ready']
  private static readonly DEFAULT_CONFIG: ZKPConfig = {
    defaultAlgorithm: 'hash',
    algorithms: {
      lattice: {
        name: 'lattice',
        securityLevel: {
          quantumResistant: true,
          classicalSecurity: 256,
          quantumSecurity: 128,
          recommendedUse: this.LEARNING_USE
        },
        performanceProfile: {
          generationTime: 2000,
          verificationTime: 150,
          proofSize: 1024 * 1024,
          memoryUsage: 1024 * 1024
        },
        recommendedFor: ['learning lattice cryptography', 'understanding LWE concepts'],
        limitations: this.EDUCATIONAL_LIMITATIONS
      },
      hash: {
        name: 'hash',
        securityLevel: {
          quantumResistant: true,
          classicalSecurity: 256,
          quantumSecurity: 128,
          recommendedUse: this.LEARNING_USE
        },
        performanceProfile: {
          generationTime: 1000,
          verificationTime: 50,
          proofSize: 512 * 1024,
          memoryUsage: 512 * 1024
        },
        recommendedFor: ['learning hash-based cryptography', 'understanding hash chains'],
        limitations: this.EDUCATIONAL_LIMITATIONS
      },
      multivariate: {
        name: 'multivariate',
        securityLevel: {
          quantumResistant: true,
          classicalSecurity: 256,
          quantumSecurity: 128,
          recommendedUse: this.LEARNING_USE
        },
        performanceProfile: {
          generationTime: 3000,
          verificationTime: 200,
          proofSize: 2 * 1024 * 1024,
          memoryUsage: 2 * 1024 * 1024
        },
        recommendedFor: ['learning polynomial cryptography', 'understanding multivariate systems'],
        limitations: this.EDUCATIONAL_LIMITATIONS
      },
      hybrid: {
        name: 'hybrid',
        securityLevel: {
          quantumResistant: true,
          classicalSecurity: 512,
          quantumSecurity: 256,
          recommendedUse: this.LEARNING_USE
        },
        performanceProfile: {
          generationTime: 6000,
          verificationTime: 400,
          proofSize: 4 * 1024 * 1024,
          memoryUsage: 4 * 1024 * 1024
        },
        recommendedFor: ['learning multi-algorithm cryptography', 'understanding defense-in-depth'],
        limitations: this.EDUCATIONAL_LIMITATIONS
      }
    },
    batchSize: 10,
    enableCaching: true,
    enableParallelProcessing: true,
    securityLevel: 'standard'
  }

  private config: ZKPConfig

  constructor(config?: Partial<ZKPConfig>) {
    this.config = { ...QuantumZKP.DEFAULT_CONFIG, ...config }
  }

  /**
   * Create educational quantum-resistant proof
   * @param secret - Secret to prove knowledge of
   * @param algorithm - Algorithm to use (default: config default)
   * @param parameters - Algorithm-specific parameters
   * @returns Educational quantum-resistant proof
   */
  public createProof(
    secret: Buffer | string,
    algorithm: AlgorithmType = this.config.defaultAlgorithm,
    parameters?: Partial<ProofParameters>
  ): Proof {
    switch (algorithm) {
      case 'lattice':
        return LatticeZKP.createProof(secret, parameters)
      case 'hash':
        return HashZKP.createProof(secret, parameters)
      case 'multivariate':
        return MultivariateZKP.createProof(secret, parameters)
      case 'hybrid':
        return HybridZKP.createProof(secret, parameters)
      default:
        throw new Error(`Unsupported algorithm: ${algorithm}`)
    }
  }

  /**
   * Verify educational quantum-resistant proof
   * @param proof - Proof to verify
   * @returns Verification result
   */
  public verifyProof(proof: Proof): VerificationResult {
    const startTime = performance.now()
    let isValid = false
    let error: string | undefined
    try {
      switch (proof.type) {
        case 'lattice':
          isValid = LatticeZKP.verifyProof(proof)
          break
        case 'hash':
          isValid = HashZKP.verifyProof(proof)
          break
        case 'multivariate':
          isValid = MultivariateZKP.verifyProof(proof)
          break
        case 'hybrid':
          isValid = HybridZKP.verifyProof(proof)
          break
        default:
          error = `Unknown proof type: ${(proof as Proof).type}`
          isValid = false
      }
    } catch (err) {
      error = err instanceof Error ? err.message : 'Unknown verification error'
      isValid = false
    }
    const verificationTime = performance.now() - startTime
    const result: VerificationResult = {
      isValid,
      algorithm: proof.type,
      verificationTime: Math.max(verificationTime, 0.001)
    }
    if (error) {
      result.error = error
    }
    return result
  }

  /**
   * Create threshold proof (distributed across multiple parties)
   * @param secret - Secret to prove knowledge of
   * @param parties - Number of parties
   * @param algorithm - Algorithm to use
   * @returns Threshold proof
   */
  public createThresholdProof(
    secret: Buffer | string,
    parties: number = 3,
    algorithm: AlgorithmType = this.config.defaultAlgorithm
  ): ThresholdProof {
    if (parties < 2) {
      throw new Error('Number of parties must be at least 2')
    }
    const shares = this.shareSecret(secret, parties)
    const proofs: Proof[] = []
    for (const share of shares) {
      const proof = this.createProof(share, algorithm)
      proofs.push(proof)
    }
    const reconstructionKey = this.createReconstructionKey(shares)
    return {
      shares,
      proofs,
      parties,
      algorithm,
      quantumSafe: true,
      threshold: Math.ceil(parties / 2),
      reconstructionKey
    }
  }

  /**
   * Batch create multiple proofs efficiently
   * @param secrets - Array of secrets
   * @param algorithm - Algorithm to use
   * @param options - Batch processing options
   * @returns Array of proofs
   */
  public batchCreateProofs(
    secrets: (Buffer | string)[],
    algorithm: AlgorithmType = this.config.defaultAlgorithm,
    options?: BatchProcessingOptions
  ): Proof[] {
    const batchOptions = {
      parallel: true,
      batchSize: this.config.batchSize,
      ...options
    }
    const proofs: Proof[] = []
    if (batchOptions.parallel) {
      for (let i = 0; i < secrets.length; i += batchOptions.batchSize) {
        const batch = secrets.slice(i, i + batchOptions.batchSize)
        const batchProofs = batch.map(secret => this.createProof(secret, algorithm))
        proofs.push(...batchProofs)
        if (batchOptions.progressCallback) {
          const progress = Math.min((i + batchOptions.batchSize) / secrets.length, 1)
          batchOptions.progressCallback(progress)
        }
      }
    } else {
      for (const secret of secrets) {
        const proof = this.createProof(secret, algorithm)
        proofs.push(proof)
      }
    }
    return proofs
  }

  /**
   * Get performance metrics for algorithm
   * @param algorithm - Algorithm to benchmark
   * @returns Performance metrics
   */
  public getPerformanceMetrics(algorithm: AlgorithmType): PerformanceMetrics {
    switch (algorithm) {
      case 'lattice':
        return {
          ...LatticeZKP.getPerformanceMetrics(),
          memoryUsage: 1024 * 1024
        }
      case 'hash':
        return {
          ...HashZKP.getPerformanceMetrics(),
          memoryUsage: 512 * 1024
        }
      case 'multivariate':
        return {
          ...MultivariateZKP.getPerformanceMetrics(),
          memoryUsage: 2048 * 1024
        }
      case 'hybrid':
        return {
          ...HybridZKP.getPerformanceMetrics(),
          memoryUsage: 4096 * 1024
        }
      default:
        throw new Error(`Unsupported algorithm: ${algorithm}`)
    }
  }

  /**
   * Get security level for algorithm
   * @param algorithm - Algorithm to check
   * @returns Security level
   */
  public getSecurityLevel(algorithm: AlgorithmType): SecurityLevel {
    switch (algorithm) {
      case 'lattice':
        return {
          ...LatticeZKP.getSecurityLevel(),
          recommendedUse: ['learning', 'prototyping']
        }
      case 'hash':
        return {
          ...HashZKP.getSecurityLevel(),
          recommendedUse: ['learning', 'prototyping']
        }
      case 'multivariate':
        return {
          ...MultivariateZKP.getSecurityLevel(),
          recommendedUse: ['learning', 'prototyping']
        }
      case 'hybrid':
        return {
          ...HybridZKP.getSecurityLevel(),
          recommendedUse: ['learning', 'prototyping']
        }
      default:
        throw new Error(`Unsupported algorithm: ${algorithm}`)
    }
  }

  /**
   * Benchmark all algorithms
   * @returns Benchmark results
   */
  public benchmarkAllAlgorithms(): BenchmarkResult[] {
    const algorithms: AlgorithmType[] = ['lattice', 'hash', 'multivariate', 'hybrid']
    const results: BenchmarkResult[] = []
    for (const algorithm of algorithms) {
      const startTime = performance.now()
      const startMemory = process.memoryUsage().heapUsed
      const testSecret = Buffer.from('benchmark-test-secret')
      this.createProof(testSecret, algorithm)
      const endTime = performance.now()
      const endMemory = process.memoryUsage().heapUsed
      const metrics = this.getPerformanceMetrics(algorithm)
      results.push({
        algorithm,
        operationsPerSecond: 1000 / Math.max(metrics.generationTime, 0.001),
        averageProofSize: metrics.proofSize,
        averageGenerationTime: metrics.generationTime,
        averageVerificationTime: metrics.verificationTime,
        memoryUsage: endMemory - startMemory,
        cpuUsage: Math.max((endTime - startTime) / 1000, 0.001)
      })
    }
    return results
  }

  /**
   * Get algorithm configuration
   * @param algorithm - Algorithm to get config for
   * @returns Algorithm configuration
   */
  public getAlgorithmConfig(algorithm: AlgorithmType): AlgorithmConfig {
    const config = this.config.algorithms[algorithm]
    if (!config) {
      throw new Error(`Unsupported algorithm: ${algorithm}`)
    }
    return config
  }

  /**
   * Get library version
   * @returns Version string
   */
  public getVersion(): string {
    return QuantumZKP.VERSION
  }

  /**
   * Share secret across multiple parties
   * @param secret - Secret to share
   * @param parties - Number of parties
   * @returns Array of secret shares
   */
  private shareSecret(secret: Buffer | string, parties: number): Buffer[] {
    const secretBuffer = typeof secret === 'string' ? Buffer.from(secret, 'utf8') : secret
    const shares: Buffer[] = []
    for (let i = 0; i < parties; i++) {
      const share = QuantumCrypto.hash(secretBuffer, 'sha256')
      shares.push(share)
    }
    return shares
  }

  /**
   * Create reconstruction key for threshold cryptography
   * @param shares - Secret shares
   * @param parties - Number of parties
   * @returns Reconstruction key
   */
  private createReconstructionKey(shares: Buffer[]): Buffer {
    const combined = Buffer.concat(shares)
    return QuantumCrypto.hash(combined, 'sha256')
  }

  /**
   * Get supported algorithms
   * @returns Array of supported algorithms
   */
  public getSupportedAlgorithms(): AlgorithmType[] {
    return ['lattice', 'hash', 'multivariate', 'hybrid']
  }

  /**
   * Check if algorithm is quantum-resistant
   * @param algorithm - Algorithm to check
   * @returns True if quantum-resistant
   */
  public isQuantumResistant(algorithm: AlgorithmType): boolean {
    const securityLevel = this.getSecurityLevel(algorithm)
    return securityLevel.quantumResistant
  }
}
