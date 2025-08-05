/**
 * Educational Quantum-Resistant Zero-Knowledge Proof Library
 * @author NeaByteLab
 * @version 1.0.0
 */

export { QuantumZKP } from '@core/quantum-zkp'
export { LatticeZKP } from '@algorithms/lattice'
export { HashZKP } from '@algorithms/hash'
export { MultivariateZKP } from '@algorithms/multivariate'
export { HybridZKP } from '@algorithms/hybrid'
export { QuantumCrypto } from '@utils/crypto'

// Version and constants
export const VERSION = '1.0.0'
export const QUANTUM_SAFE = true // Educational flag
export const SUPPORTED_ALGORITHMS = ['lattice', 'hash', 'multivariate', 'hybrid'] as const

// Type exports
export type {
  AlgorithmType,
  ProofType,
  ProofParameters,
  BaseProof,
  LatticeProof,
  HashProof,
  MultivariateProof,
  HybridProof,
  Proof,
  ThresholdProof,
  VerificationResult,
  PerformanceMetrics,
  SecurityLevel,
  AlgorithmConfig,
  ZKPConfig,
  ValidationOptions,
  BatchProcessingOptions,
  ErrorDetails,
  ZKPError,
  BenchmarkResult,
  SecurityAuditResult
} from './types' 