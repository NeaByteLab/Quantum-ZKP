/**
 * Basic usage example for Educational Quantum-Resistant ZKP library
 * @author NeaByteLab
 * 
 * ⚠️ DISCLAIMER: This is an educational library for learning quantum-resistant
 * cryptography concepts. It is NOT production-ready cryptography.
 */

import { QuantumZKP, LatticeZKP, HashZKP, MultivariateZKP, HybridZKP } from '@neabyte/quantum-zkp'

async function main() {
  console.log('🚀 Educational Quantum-Resistant ZKP Library - Basic Usage Example')
  console.log('=' .repeat(60))
  console.log('⚠️  DISCLAIMER: This is for learning purposes only!')
  console.log('   NOT production-ready cryptography.')
  console.log('=' .repeat(60))

  // Initialize the main ZKP class
  const zkp = new QuantumZKP()

  // Test secret
  const secret = 'my-super-secret-password-123'
  console.log(`📝 Testing with secret: "${secret}"`)
  console.log()

  // Test all algorithms
  const algorithms = ['lattice', 'hash', 'multivariate', 'hybrid'] as const

  for (const algorithm of algorithms) {
    console.log(`🔐 Testing ${algorithm.toUpperCase()} algorithm (educational):`)
    
    try {
      // Create proof
      const startTime = performance.now()
      const proof = zkp.createProof(secret, algorithm)
      const generationTime = performance.now() - startTime
      
      console.log(`  ✅ Proof created in ${generationTime.toFixed(2)}ms`)
      console.log(`  📊 Proof size: ${proof.commitment.length} bytes`)
      console.log(`  🛡️  Quantum safe: ${proof.quantumSafe} (educational)`)
      
      // Verify proof
      const verifyStartTime = performance.now()
      const verificationResult = zkp.verifyProof(proof)
      const verificationTime = performance.now() - verifyStartTime
      
      console.log(`  ✅ Verification: ${verificationResult.isValid ? 'PASSED' : 'FAILED'}`)
      console.log(`  ⏱️  Verification time: ${verificationTime.toFixed(2)}ms`)
      
      // Get performance metrics
      const metrics = zkp.getPerformanceMetrics(algorithm)
      console.log(`  📈 Expected generation time: ${metrics.generationTime}ms`)
      console.log(`  📈 Expected verification time: ${metrics.verificationTime}ms`)
      console.log(`  📈 Expected proof size: ${metrics.proofSize} bytes`)
      
      // Get security level
      const security = zkp.getSecurityLevel(algorithm)
      console.log(`  🔒 Classical security: ${security.classicalSecurity} bits (educational)`)
      console.log(`  🔒 Quantum security: ${security.quantumSecurity} bits (educational)`)
      console.log(`  🔒 Quantum resistant: ${security.quantumResistant} (educational)`)
      
    } catch (error) {
      console.log(`  ❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
    
    console.log()
  }

  // Test threshold cryptography
  console.log('🔐 Testing Threshold Cryptography (educational):')
  try {
    const thresholdProof = zkp.createThresholdProof(secret, 5, 'hybrid')
    console.log(`  ✅ Threshold proof created with ${thresholdProof.parties} parties`)
    console.log(`  📊 Threshold: ${thresholdProof.threshold} parties required`)
    console.log(`  🛡️  Quantum safe: ${thresholdProof.quantumSafe} (educational)`)
  } catch (error) {
    console.log(`  ❌ Threshold error: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
  console.log()

  // Test batch processing
  console.log('📦 Testing Batch Processing (educational):')
  try {
    const secrets = ['secret1', 'secret2', 'secret3', 'secret4', 'secret5']
    const batchProofs = zkp.batchCreateProofs(secrets, 'hash', {
      parallel: true,
      batchSize: 2,
      progressCallback: (progress) => {
        console.log(`  📊 Progress: ${(progress * 100).toFixed(1)}%`)
      }
    })
    
    console.log(`  ✅ Batch processing completed: ${batchProofs.length} proofs created`)
    
    // Verify all batch proofs
    let validCount = 0
    for (const proof of batchProofs) {
      const result = zkp.verifyProof(proof)
      if (result.isValid) validCount++
    }
    
    console.log(`  ✅ Batch verification: ${validCount}/${batchProofs.length} proofs valid`)
    
  } catch (error) {
    console.log(`  ❌ Batch error: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
  console.log()

  // Benchmark all algorithms
  console.log('📊 Benchmarking All Algorithms:')
  try {
    const benchmarkResults = zkp.benchmarkAllAlgorithms()
    
    for (const result of benchmarkResults) {
      console.log(`  🔐 ${result.algorithm.toUpperCase()}:`)
      console.log(`    📈 Ops/sec: ${result.operationsPerSecond.toFixed(2)}`)
      console.log(`    📊 Proof size: ${result.averageProofSize} bytes`)
      console.log(`    ⏱️  Generation time: ${result.averageGenerationTime}ms`)
      console.log(`    ⏱️  Verification time: ${result.averageVerificationTime}ms`)
      console.log(`    💾 Memory usage: ${(result.memoryUsage / 1024).toFixed(2)} KB`)
      console.log(`    🖥️  CPU usage: ${result.cpuUsage.toFixed(3)}s`)
    }
    
  } catch (error) {
    console.log(`  ❌ Benchmark error: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
  console.log()

  // Test individual algorithm classes
  console.log('🔧 Testing Individual Algorithm Classes:')
  
  // Lattice ZKP
  try {
    const latticeProof = LatticeZKP.createProof(secret)
    const latticeValid = LatticeZKP.verifyProof(latticeProof)
    console.log(`  ✅ LatticeZKP: ${latticeValid ? 'PASSED' : 'FAILED'}`)
  } catch (error) {
    console.log(`  ❌ LatticeZKP error: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
  
  // Hash ZKP
  try {
    const hashProof = HashZKP.createProof(secret)
    const hashValid = HashZKP.verifyProof(hashProof)
    console.log(`  ✅ HashZKP: ${hashValid ? 'PASSED' : 'FAILED'}`)
  } catch (error) {
    console.log(`  ❌ HashZKP error: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
  
  // Multivariate ZKP
  try {
    const multivariateProof = MultivariateZKP.createProof(secret)
    const multivariateValid = MultivariateZKP.verifyProof(multivariateProof)
    console.log(`  ✅ MultivariateZKP: ${multivariateValid ? 'PASSED' : 'FAILED'}`)
  } catch (error) {
    console.log(`  ❌ MultivariateZKP error: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
  
  // Hybrid ZKP
  try {
    const hybridProof = HybridZKP.createProof(secret)
    const hybridValid = HybridZKP.verifyProof(hybridProof)
    console.log(`  ✅ HybridZKP: ${hybridValid ? 'PASSED' : 'FAILED'}`)
  } catch (error) {
    console.log(`  ❌ HybridZKP error: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
  
  console.log()
  console.log('🎉 Basic usage example completed!')
  console.log('=' .repeat(60))
}

// Run the example
main().catch(console.error) 