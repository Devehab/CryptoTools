# CryptoTools

🛡️ **CryptoTools Shield** - Cryptography Education Platform in Arabic

> **Arabic Purpose Statement**: أدوات التشفير هي منصة تعليمية متكاملة باللغة العربية لتعلم وفهم مفاهيم التشفير وأمن المعلومات بطريقة عملية وتطبيقية، مصممة خصيصاً للمتحدثين باللغة العربية.

A comprehensive suite of cryptographic tools built for educational purposes in Arabic, allowing users to explore and understand various cryptographic concepts and techniques in a practical, hands-on environment.

## 🌟 Overview

CryptoTools is an open-source web application that provides a collection of cryptographic utilities designed to help students, developers, and security enthusiasts understand the fundamentals of cryptography. All operations are performed client-side, ensuring that sensitive data never leaves your browser.

The primary goal of this project is to provide high-quality educational content about cryptography and information security in Arabic, addressing the lack of reliable Arabic resources in this field.

## 🔐 Features

The application includes the following tools:

- **Wallet Generator**: Create seed phrases, private keys, and public addresses
- **AES Encryption/Decryption**: Encrypt and decrypt data using the Advanced Encryption Standard
  - Support for text and file encryption/decryption
  - Multiple encryption modes (CBC, CFB, OFB, CTR)
  - Customizable key sizes (128, 192, 256 bits)

- **Digital Signatures**: Create and verify digital signatures using RSA
  - Sign both text and files with RSA private keys
  - Verify signatures for text and files
  - Download signatures in both `.sig` (binary) and `.asc` (ASCII-armored) formats
  - Comprehensive explanations about digital signature formats and usage

- **Text to Hash Conversion**: Generate hashes using multiple algorithms
  - Support for MD5, SHA-1, SHA-256, SHA-512, RIPEMD-160
  - Detailed explanations of each algorithm's security properties

- **Base64 Encoding/Decoding**: Convert data to and from Base64 format
  - Support for text and file uploads
  - Automatic file type detection
  - File preview for images and download options for decoded files
  - Handles both raw Base64 strings and data URLs

- **Hex to Base58 Conversion**: Convert between hexadecimal and Base58 encodings

- **RSA Key Generator**: Generate RSA key pairs for asymmetric encryption
  - Multiple key sizes (1024, 2048, 4096 bits)
  - Educational content explaining public/private key concepts

## 💻 Technologies

- HTML5
- JavaScript (vanilla)
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [CryptoJS](https://github.com/brix/crypto-js) for cryptographic operations
- [JSEncrypt](https://github.com/travist/jsencrypt) for RSA encryption
- Web Crypto API for secure random number generation

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)

### Running the Application

Simply open the `index.html` file in your web browser to start using the application. No server setup is required.

## 📖 Usage

1. Visit the landing page to learn about the available tools
2. Navigate to the main application page by clicking "Start Using Tools"
3. Select the desired tool from the tabbed interface
4. Follow the instructions provided for each tool
5. All operations are performed in your browser - no data is sent to any server

### File Operations

Several tools now support file operations:

- **Digital Signatures**: Upload files to sign them with your private key, or verify signatures of uploaded files
- **Base64 Encoding/Decoding**: Convert files to Base64 or decode Base64 strings back to files
- **AES Encryption**: Encrypt and decrypt files with password protection

## 🔍 Educational Purpose

This project was created for educational purposes to:

- Demonstrate cryptographic concepts in a practical way
- Help students understand the implementation of various encryption algorithms
- Provide a hands-on learning environment for cryptography basics
- Serve as a reference for developers interested in implementing cryptographic functions
- Bridge the gap in Arabic technical content in the field of cryptography

## ☕ Support My Work

If you find my tools useful in your daily workflow, please consider supporting my work! I'm passionate about writing educational articles, building open-source web applications, and creating Chrome extensions that solve real problems.

<p align="center">
  <a href="https://www.buymeacoffee.com/ehabkahwati" target="_blank">
    <img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" height="50px">
  </a>
</p>

As an independent developer, I dedicate my time to building and maintaining various open-source web applications and Chrome extensions that are freely available to everyone. Your support helps me:

- ✨ Continue developing new features for my projects
- 🐛 Fix bugs and maintain existing projects
- 🚀 Create new open-source tools for the community
- 📝 Write educational articles to share knowledge
- 💡 Explore innovative ideas and technologies

Even a small contribution goes a long way in supporting the development of tools that make the internet more accessible and useful for everyone.

**Thank you for your support!** ❤️

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

```
MIT License

Copyright (c) 2025 CryptoTools

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 👥 Acknowledgments

- Font Awesome for providing the icons
- Tailwind CSS for the responsive design framework
- The open-source community for various cryptographic libraries
