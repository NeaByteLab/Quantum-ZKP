/**
 * Comprehensive Performance Benchmark for Quantum-ZKP
 * @author NeaByteLab
 * 
 * Tests real performance on actual hardware
 */

import { QuantumZKP, HashZKP, LatticeZKP, MultivariateZKP, HybridZKP } from '../src/index'

interface BenchmarkResult {
  algorithm: string
  generationTime: number
  verificationTime: number
  proofSize: number
  memoryUsage: number
  operationsPerSecond: number
  cpuUsage: number
}

interface SystemInfo {
  platform: string
  nodeVersion: string
  memory: string
  cpu: string
  architecture: string
}

function getSystemInfo(): SystemInfo {
  return {
    platform: process.platform,
    nodeVersion: process.version,
    memory: `${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)}MB`,
    cpu: process.arch,
    architecture: process.arch
  }
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

function formatTime(ms: number): string {
  if (ms < 1) return `${(ms * 1000).toFixed(2)}μs`
  if (ms < 1000) return `${ms.toFixed(2)}ms`
  return `${(ms / 1000).toFixed(2)}s`
}

function estimateProofSize(proof: any): number {
  try {
    // Custom serializer to handle BigInt
    const serializeProof = (obj: any): string => {
      return JSON.stringify(obj, (key, value) => {
        if (typeof value === 'bigint') {
          return value.toString()
        }
        return value
      })
    }
    return serializeProof(proof).length
  } catch (error) {
    // Fallback estimation
    return 1024 // Default 1KB estimate
  }
}

async function benchmarkAlgorithm(
  algorithm: string,
  createProof: (secret: string) => any,
  verifyProof: (proof: any) => boolean,
  iterations: number = 10
): Promise<BenchmarkResult> {
  console.log(`\n🔬 Benchmarking ${algorithm.toUpperCase()} algorithm...`)
  
  const secret = 'benchmark-secret-data-2025'
  const results: { gen: number[]; ver: number[]; size: number[]; mem: number[] } = {
    gen: [],
    ver: [],
    size: [],
    mem: []
  }
  
  // Warm up
  for (let i = 0; i < 3; i++) {
    try {
      const proof = createProof(secret)
      verifyProof(proof)
    } catch (error) {
      console.log(`  ⚠️  Warm-up ${i + 1} failed: ${error}`)
    }
  }
  
  // Actual benchmark
  for (let i = 0; i < iterations; i++) {
    const startMem = process.memoryUsage().heapUsed
    const startTime = performance.now()
    
    try {
      const proof = createProof(secret)
      const genTime = performance.now() - startTime
      
      const verStart = performance.now()
      const isValid = verifyProof(proof)
      const verTime = performance.now() - verStart
      
      const endMem = process.memoryUsage().heapUsed
      const memUsed = endMem - startMem
      
      if (isValid) {
        const proofSize = estimateProofSize(proof)
        
        results.gen.push(genTime)
        results.ver.push(verTime)
        results.size.push(proofSize)
        results.mem.push(memUsed)
        
        console.log(`  ✅ Run ${i + 1}: Gen=${formatTime(genTime)}, Ver=${formatTime(verTime)}, Size=${formatBytes(proofSize)}`)
      } else {
        console.log(`  ❌ Run ${i + 1}: Verification failed`)
      }
    } catch (error) {
      console.log(`  ❌ Run ${i + 1} failed: ${error}`)
    }
  }
  
  // Calculate averages
  if (results.gen.length === 0) {
    throw new Error(`No successful runs for ${algorithm}`)
  }
  
  const avgGen = results.gen.reduce((a, b) => a + b, 0) / results.gen.length
  const avgVer = results.ver.reduce((a, b) => a + b, 0) / results.ver.length
  const avgSize = results.size.reduce((a, b) => a + b, 0) / results.size.length
  const avgMem = results.mem.reduce((a, b) => a + b, 0) / results.mem.length
  const opsPerSecond = 1000 / avgGen
  
  return {
    algorithm,
    generationTime: avgGen,
    verificationTime: avgVer,
    proofSize: avgSize,
    memoryUsage: avgMem,
    operationsPerSecond: opsPerSecond,
    cpuUsage: avgGen / 1000 // seconds
  }
}

async function runComprehensiveBenchmark() {
  console.log('🚀 Quantum-ZKP Performance Benchmark')
  console.log('=' .repeat(60))
  
  const systemInfo = getSystemInfo()
  console.log('📊 System Information:')
  console.log(`  Platform: ${systemInfo.platform}`)
  console.log(`  Node.js: ${systemInfo.nodeVersion}`)
  console.log(`  Architecture: ${systemInfo.architecture}`)
  console.log(`  Memory: ${systemInfo.memory}`)
  console.log('=' .repeat(60))
  
  const zkp = new QuantumZKP()
  const results: BenchmarkResult[] = []
  
  // Test Hash-based ZKP
  try {
    const hashResult = await benchmarkAlgorithm(
      'Hash',
      (secret) => HashZKP.createProof(secret),
      (proof) => HashZKP.verifyProof(proof),
      15
    )
    results.push(hashResult)
  } catch (error) {
    console.log(`❌ Hash benchmark failed: ${error}`)
  }
  
  // Test Lattice-based ZKP
  try {
    const latticeResult = await benchmarkAlgorithm(
      'Lattice',
      (secret) => LatticeZKP.createProof(secret),
      (proof) => LatticeZKP.verifyProof(proof),
      10
    )
    results.push(latticeResult)
  } catch (error) {
    console.log(`❌ Lattice benchmark failed: ${error}`)
  }
  
  // Test Multivariate ZKP
  try {
    const multivariateResult = await benchmarkAlgorithm(
      'Multivariate',
      (secret) => MultivariateZKP.createProof(secret),
      (proof) => MultivariateZKP.verifyProof(proof),
      8
    )
    results.push(multivariateResult)
  } catch (error) {
    console.log(`❌ Multivariate benchmark failed: ${error}`)
  }
  
  // Test Hybrid ZKP
  try {
    const hybridResult = await benchmarkAlgorithm(
      'Hybrid',
      (secret) => HybridZKP.createProof(secret),
      (proof) => HybridZKP.verifyProof(proof),
      5
    )
    results.push(hybridResult)
  } catch (error) {
    console.log(`❌ Hybrid benchmark failed: ${error}`)
  }
  
  // Display results
  console.log('\n📈 Benchmark Results Summary')
  console.log('=' .repeat(60))
  
  console.log('| Algorithm    | Generation | Verification | Proof Size | Memory | Ops/sec |')
  console.log('|--------------|------------|--------------|------------|--------|---------|')
  
  results.forEach(result => {
    console.log(`| ${result.algorithm.padEnd(11)} | ${formatTime(result.generationTime).padStart(9)} | ${formatTime(result.verificationTime).padStart(11)} | ${formatBytes(result.proofSize).padStart(10)} | ${formatBytes(result.memoryUsage).padStart(6)} | ${result.operationsPerSecond.toFixed(1).padStart(7)} |`)
  })
  
  console.log('\n🎯 Performance Analysis')
  console.log('=' .repeat(60))
  
  // Find fastest and slowest
  const fastest = results.reduce((a, b) => a.generationTime < b.generationTime ? a : b)
  const slowest = results.reduce((a, b) => a.generationTime > b.generationTime ? a : b)
  
  console.log(`🏆 Fastest Algorithm: ${fastest.algorithm} (${formatTime(fastest.generationTime)})`)
  console.log(`🐌 Slowest Algorithm: ${slowest.algorithm} (${formatTime(slowest.generationTime)})`)
  console.log(`📊 Speed Difference: ${(slowest.generationTime / fastest.generationTime).toFixed(1)}x`)
  
  // Memory analysis
  const mostMemory = results.reduce((a, b) => a.memoryUsage > b.memoryUsage ? a : b)
  const leastMemory = results.reduce((a, b) => a.memoryUsage < b.memoryUsage ? a : b)
  
  console.log(`💾 Most Memory: ${mostMemory.algorithm} (${formatBytes(mostMemory.memoryUsage)})`)
  console.log(`💾 Least Memory: ${leastMemory.algorithm} (${formatBytes(leastMemory.memoryUsage)})`)
  
  // Efficiency analysis
  const mostEfficient = results.reduce((a, b) => a.operationsPerSecond > b.operationsPerSecond ? a : b)
  console.log(`⚡ Most Efficient: ${mostEfficient.algorithm} (${mostEfficient.operationsPerSecond.toFixed(1)} ops/sec)`)
  
  console.log('\n💡 Recommendations')
  console.log('=' .repeat(60))
  console.log('• Use Hash-based for fast prototyping and basic ZKP concepts')
  console.log('• Use Lattice-based for quantum resistance research')
  console.log('• Use Multivariate for polynomial cryptography study')
  console.log('• Use Hybrid for maximum security requirements')
  console.log('• Consider memory usage for large-scale deployments')
  
  console.log('\n✅ Benchmark completed successfully!')
}

// Run the benchmark
runComprehensiveBenchmark().catch(console.error) 