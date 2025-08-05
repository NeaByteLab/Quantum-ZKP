# 🤝 Contributing to Quantum-ZKP

**Thank you for your interest in contributing to Quantum-ZKP!** This document provides guidelines for contributing to our educational quantum-resistant zero-knowledge proof library.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Project Overview](#project-overview)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Contribution Guidelines](#contribution-guidelines)
- [Code Style](#code-style)
- [Testing](#testing)
- [Documentation](#documentation)
- [Pull Request Process](#pull-request-process)
- [Release Process](#release-process)
- [Contact](#contact)

## 📜 Code of Conduct

### Our Standards

- **Respectful Communication**: Be respectful and inclusive in all interactions
- **Educational Focus**: Remember this is an educational/research implementation
- **Constructive Feedback**: Provide helpful, constructive feedback
- **Learning Environment**: Foster a supportive learning environment

### Enforcement

- Report violations to [me@neabyte.com](mailto:me@neabyte.com)
- Violations may result in temporary or permanent exclusion from the project

## 🎯 Project Overview

### Purpose
Quantum-ZKP is an **educational implementation** of quantum-resistant zero-knowledge proof protocols. Our goals are:

- **Learning**: Help developers understand quantum-resistant cryptography
- **Research**: Provide tools for cryptographic research and prototyping
- **Education**: Demonstrate cryptographic concepts and implementations
- **Community**: Build a community around quantum-resistant cryptography

### Scope
- ✅ **In Scope**: Educational implementations, documentation, examples, tests
- ❌ **Out of Scope**: Production-ready cryptography, security audits, enterprise features

## 🚀 Getting Started

### Prerequisites
- Node.js 22+ 
- npm or yarn
- TypeScript knowledge
- Basic understanding of cryptography

### Quick Start
```bash
# Clone the repository
git clone https://github.com/NeaByteLab/Quantum-ZKP.git
cd Quantum-ZKP

# Install dependencies
npm install

# Run tests
npm test

# Run examples
npm run example
```

## 🔧 Development Setup

### Environment Setup
```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run in development mode
npm run dev
```

### Available Scripts
```bash
npm run build          # Build the project
npm run test           # Run all tests
npm run test:watch     # Run tests in watch mode
npm run test:coverage  # Run tests with coverage
npm run lint           # Run ESLint
npm run lint:fix       # Fix ESLint issues
npm run format         # Format code with Prettier
npm run example        # Run basic usage example
npm run benchmark      # Run performance benchmarks
npm run clean          # Clean build artifacts
```

## 📝 Contribution Guidelines

### Types of Contributions

#### 🐛 Bug Reports
- Use the GitHub issue template
- Include steps to reproduce
- Provide system information
- Include error messages/logs

#### 💡 Feature Requests
- Explain the educational value
- Provide use case examples
- Consider implementation complexity
- Align with project goals

#### 📚 Documentation
- Improve README sections
- Add code examples
- Update API documentation
- Create tutorials

#### 🧪 Tests
- Add unit tests for new features
- Improve test coverage
- Add integration tests
- Create performance tests

#### 🔧 Code Improvements
- Optimize algorithms
- Improve error handling
- Add type safety
- Enhance performance

### Before Contributing

1. **Check Existing Issues**: Search for similar issues/PRs
2. **Discuss Changes**: Open an issue for significant changes
3. **Follow Guidelines**: Read this document thoroughly
4. **Test Locally**: Ensure all tests pass
5. **Update Documentation**: Keep docs in sync with code

## 🎨 Code Style

### TypeScript Guidelines
- **Strict Mode**: Always use strict TypeScript
- **Type Safety**: Avoid `any` types, use proper interfaces
- **Naming**: Use descriptive names, follow camelCase
- **Comments**: JSDoc for public functions
- **Imports**: Use alias paths (`@types`, `@utils`, etc.)

### Code Formatting
```bash
# Format code
npm run format

# Fix linting issues
npm run lint:fix
```

### File Structure
```
src/
├── algorithms/    # ZKP algorithm implementations
├── core/          # Core library functionality
├── types/         # TypeScript type definitions
├── utils/         # Utility functions
└── index.ts       # Main entry point
```

### Naming Conventions
- **Files**: kebab-case (`hash-zkp.ts`)
- **Classes**: PascalCase (`HashZKP`)
- **Functions**: camelCase (`createProof`)
- **Constants**: SCREAMING_SNAKE_CASE (`DEFAULT_CHAIN_LENGTH`)
- **Types**: PascalCase (`ProofParameters`)

## 🧪 Testing

### Test Structure
```
tests/
├── crypto.test.ts          # Cryptographic utilities
├── hash.test.ts            # Hash-based ZKP
├── lattice.test.ts         # Lattice-based ZKP
├── multivariate.test.ts    # Multivariate ZKP
├── hybrid.test.ts          # Hybrid ZKP
└── integration.test.ts     # Integration tests
```

### Testing Guidelines
- **Coverage**: Aim for >90% test coverage
- **Unit Tests**: Test individual functions
- **Integration Tests**: Test component interactions
- **Performance Tests**: Benchmark critical paths
- **Edge Cases**: Test error conditions

### Running Tests
```bash
# Run all tests
npm test

# Run specific test file
npm test tests/hash.test.ts

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch
```

## 📖 Documentation

### Documentation Standards
- **README.md**: Project overview and quick start
- **PERFORMANCE.md**: Performance analysis and benchmarks
- **SECURITY.md**: Security analysis and considerations
- **CONTRIBUTING.md**: This file
- **JSDoc**: Inline documentation for functions

### Documentation Guidelines
- **Clear Language**: Use simple, clear explanations
- **Examples**: Provide practical code examples
- **Educational Focus**: Explain concepts, not just APIs
- **Visual Aids**: Use diagrams and tables
- **Links**: Cross-reference related documentation

### Updating Documentation
```bash
# Generate API documentation
npm run docs

# Update README examples
# Edit README.md manually

# Update performance data
npm run benchmark
```

## 🔄 Pull Request Process

### Before Submitting
1. **Fork the Repository**: Create your own fork
2. **Create a Branch**: Use descriptive branch names
3. **Make Changes**: Follow coding guidelines
4. **Test Thoroughly**: Run all tests and examples
5. **Update Documentation**: Keep docs in sync

### PR Guidelines
- **Title**: Clear, descriptive title
- **Description**: Explain what and why
- **Tests**: Include relevant tests
- **Documentation**: Update docs if needed
- **Examples**: Add examples for new features

### PR Template
```markdown
## 📝 Description
Brief description of changes

## 🔄 Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Test addition

## 🧪 Testing
- [ ] All tests pass
- [ ] New tests added
- [ ] Examples updated
- [ ] Documentation updated

## ✅ Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No breaking changes
```

## 🚀 Release Process

### Version Strategy
- **Major**: Breaking changes (rare for educational project)
- **Minor**: New features, improvements
- **Patch**: Bug fixes, documentation updates

### Release Checklist
- [ ] All tests passing
- [ ] Documentation updated
- [ ] Examples working
- [ ] Performance benchmarks updated
- [ ] Security analysis reviewed
- [ ] Version bumped
- [ ] Changelog updated

### Publishing
```bash
# Update version
npm version patch|minor|major

# Build and test
npm run build && npm test

# Publish to npm
npm publish

# Create GitHub release
git push --tags
```

## 📞 Contact

### Questions and Support
- **Email**: [me@neabyte.com](mailto:me@neabyte.com)
- **GitHub Issues**: [Create an issue](https://github.com/NeaByteLab/Quantum-ZKP/issues)
- **Discussions**: [GitHub Discussions](https://github.com/NeaByteLab/Quantum-ZKP/discussions)

### Maintainers
- **NeaByteLab**: [@NeaByteLab](https://github.com/NeaByteLab)

## 🙏 Acknowledgments

Thank you for contributing to the quantum-resistant cryptography community! Your contributions help:

- **Educate Developers**: Share knowledge about quantum-resistant cryptography
- **Advance Research**: Improve understanding of post-quantum protocols
- **Build Community**: Create a supportive learning environment
- **Prepare for Future**: Help developers prepare for quantum computing

---

**Happy Contributing! 🚀**

*This project is maintained by NeaByteLab and follows the Apache 2.0 License.* 