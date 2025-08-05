/**
 * Core types for Quantum-Resistant Zero-Knowledge Proof library
 * @author NeaByteLab
 */

/**
 * Supported quantum-resistant algorithm types
 */
export type AlgorithmType = 'lattice' | 'hash' | 'multivariate' | 'hybrid'

/**
 * Supported proof types corresponding to algorithms
 */
export type ProofType = 'lattice' | 'hash' | 'multivariate' | 'hybrid'

/**
 * Configuration parameters for proof generation
 */
export interface ProofParameters {
  /** Dimension for lattice-based algorithms */
  dimension?: number
  /** Modulus for cryptographic operations */
  modulus?: bigint
  /** Chain length for hash-based algorithms */
  chainLength?: number
  /** Number of variables for multivariate algorithms */
  variables?: number
  /** Number of equations for multivariate algorithms */
  equations?: number
  /** Number of parties for threshold schemes */
  parties?: number
  /** Algorithms to use for hybrid proofs */
  algorithms?: AlgorithmType[]
  /** Weights for hybrid algorithm combination */
  weights?: Record<AlgorithmType, number>
}

/**
 * Base proof structure common to all algorithm types
 */
export interface BaseProof {
  /** Type of proof algorithm used */
  type: ProofType
  /** Cryptographic commitment value */
  commitment: Buffer
  /** Challenge value for proof verification */
  challenge: Buffer
  /** Response to the challenge */
  response: Buffer
  /** Algorithm-specific parameters */
  parameters: ProofParameters
  /** Whether the proof is quantum-resistant */
  quantumSafe: boolean
  /** Timestamp when proof was generated */
  timestamp: number
  /** Version of the proof format */
  version: string
}

/**
 * Lattice-based zero-knowledge proof
 */
export interface LatticeProof extends BaseProof {
  type: 'lattice'
  /** Dimension of the lattice */
  dimension: number
  /** Modulus for lattice operations */
  modulus: bigint
  /** Polynomial commitment for lattice proof */
  polynomialCommitment: Buffer
}

/**
 * Hash-based zero-knowledge proof
 */
export interface HashProof extends BaseProof {
  type: 'hash'
  /** Length of the hash chain */
  chainLength: number
  /** Array of hash chain values */
  hashChain: Buffer[]
  /** Commitment to the hash chain */
  commitmentChain: Buffer
  /** Optional Merkle tree for efficient verification */
  merkleTree?: Buffer[][]
  /** Optional Merkle proof for verification */
  merkleProof?: Buffer[]
}

/**
 * Multivariate polynomial-based zero-knowledge proof
 */
export interface MultivariateProof extends BaseProof {
  type: 'multivariate'
  /** Number of variables in the polynomial system */
  variables: number
  /** Number of equations in the polynomial system */
  equations: number
  /** Serialized polynomial system */
  polynomialSystem: Buffer
  /** Solution to the polynomial system */
  solution: Buffer
}

/**
 * Hybrid proof combining multiple algorithm types
 */
export interface HybridProof extends BaseProof {
  type: 'hybrid'
  /** Array of individual proofs from different algorithms */
  proofs: (LatticeProof | HashProof | MultivariateProof)[]
  /** Combined proof value */
  combined: Buffer
  /** Weight factors for each algorithm in the hybrid */
  algorithmWeights: Record<AlgorithmType, number>
}

/**
 * Union type of all supported proof types
 */
export type Proof = LatticeProof | HashProof | MultivariateProof | HybridProof

/**
 * Threshold-based zero-knowledge proof for multi-party scenarios
 */
export interface ThresholdProof {
  /** Secret shares distributed among parties */
  shares: Buffer[]
  /** Individual proofs from each party */
  proofs: Proof[]
  /** Total number of parties */
  parties: number
  /** Algorithm type used for threshold scheme */
  algorithm: AlgorithmType
  /** Whether the threshold scheme is quantum-resistant */
  quantumSafe: boolean
  /** Minimum number of parties required for reconstruction */
  threshold: number
  /** Key used for secret reconstruction */
  reconstructionKey: Buffer
}

/**
 * Result of proof verification operation
 */
export interface VerificationResult {
  /** Whether the proof is valid */
  isValid: boolean
  /** Algorithm type that was verified */
  algorithm: AlgorithmType
  /** Time taken for verification in milliseconds */
  verificationTime: number
  /** Error message if verification failed */
  error?: string
}

/**
 * Performance metrics for proof operations
 */
export interface PerformanceMetrics {
  /** Time taken for proof generation in milliseconds */
  generationTime: number
  /** Time taken for proof verification in milliseconds */
  verificationTime: number
  /** Size of the proof in bytes */
  proofSize: number
  /** Memory usage in bytes */
  memoryUsage: number
}

/**
 * Security level specifications for algorithms
 */
export interface SecurityLevel {
  /** Whether the algorithm is resistant to quantum attacks */
  quantumResistant: boolean
  /** Classical security level in bits */
  classicalSecurity: number
  /** Quantum security level in bits */
  quantumSecurity: number
  /** Recommended use cases for this security level */
  recommendedUse: string[]
}

/**
 * Configuration for a specific algorithm
 */
export interface AlgorithmConfig {
  /** Name of the algorithm */
  name: AlgorithmType
  /** Security specifications for the algorithm */
  securityLevel: SecurityLevel
  /** Performance characteristics of the algorithm */
  performanceProfile: PerformanceMetrics
  /** Recommended use cases for this algorithm */
  recommendedFor: string[]
  /** Known limitations of the algorithm */
  limitations: string[]
}

/**
 * Global configuration for the ZKP library
 */
export interface ZKPConfig {
  /** Default algorithm to use when none specified */
  defaultAlgorithm: AlgorithmType
  /** Configuration for each supported algorithm */
  algorithms: Record<AlgorithmType, AlgorithmConfig>
  /** Number of proofs to process in a batch */
  batchSize: number
  /** Whether to enable proof caching */
  enableCaching: boolean
  /** Whether to enable parallel processing */
  enableParallelProcessing: boolean
  /** Minimum security level required */
  securityLevel: 'standard' | 'high' | 'maximum'
}

/**
 * Options for proof validation
 */
export interface ValidationOptions {
  /** Whether to use strict validation rules */
  strictMode?: boolean
  /** Whether to allow legacy algorithm support */
  allowLegacyAlgorithms?: boolean
  /** Maximum allowed proof size in bytes */
  maxProofSize?: number
  /** Timeout for validation in milliseconds */
  timeout?: number
}

/**
 * Options for batch processing operations
 */
export interface BatchProcessingOptions {
  /** Whether to process proofs in parallel */
  parallel: boolean
  /** Number of proofs to process in each batch */
  batchSize: number
  /** Optional callback for progress updates */
  progressCallback?: (progress: number) => void
}

/**
 * Detailed error information
 */
export interface ErrorDetails {
  /** Error code for programmatic handling */
  code: string
  /** Human-readable error message */
  message: string
  /** Algorithm type involved in the error */
  algorithm?: AlgorithmType
  /** Suggested resolution for the error */
  suggestion?: string
}

/**
 * Custom error class for ZKP-related errors
 */
export class ZKPError extends Error {
  public readonly code: string
  public readonly algorithm?: AlgorithmType
  public readonly suggestion?: string

  constructor(details: ErrorDetails) {
    super(details.message)
    this.name = 'ZKPError'
    this.code = details.code
    this.algorithm = details.algorithm ?? 'hybrid'
    this.suggestion = details.suggestion ?? 'Check parameters and try again'
  }
}

/**
 * Benchmark results for algorithm performance testing
 */
export interface BenchmarkResult {
  /** Algorithm type that was benchmarked */
  algorithm: AlgorithmType
  /** Number of operations per second */
  operationsPerSecond: number
  /** Average proof size in bytes */
  averageProofSize: number
  /** Average time for proof generation in milliseconds */
  averageGenerationTime: number
  /** Average time for proof verification in milliseconds */
  averageVerificationTime: number
  /** Memory usage in bytes */
  memoryUsage: number
  /** CPU usage percentage */
  cpuUsage: number
}

/**
 * Security audit results for algorithm evaluation
 */
export interface SecurityAuditResult {
  /** Algorithm type that was audited */
  algorithm: AlgorithmType
  /** List of identified vulnerabilities */
  vulnerabilities: string[]
  /** Security recommendations */
  recommendations: string[]
  /** Overall risk level assessment */
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
  /** Educational alignment status with various standards */
  alignment: {
    /** Educational understanding of NIST standards */
    nist: boolean
    /** Educational understanding of ISO standards */
    iso: boolean
    /** Educational understanding of FIPS standards */
    fips: boolean
  }
}
