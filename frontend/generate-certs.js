const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { generateKeyPairSync, createSign } = require('crypto');

const keyPath = path.join(__dirname, 'localhost-key.pem');
const certPath = path.join(__dirname, 'localhost.pem');

console.log('🔐 Generating self-signed SSL certificates for localhost...\n');

// Check if certificates already exist
if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
  console.log('✅ Certificates already exist!');
  console.log(`   - ${keyPath}`);
  console.log(`   - ${certPath}\n`);
  process.exit(0);
}

// Try OpenSSL first (most compatible)
try {
  const command = `openssl req -x509 -newkey rsa:2048 -nodes -sha256 -subj "/CN=localhost" -keyout localhost-key.pem -out localhost.pem -days 365`;
  execSync(command, { cwd: __dirname, stdio: 'inherit' });
  
  console.log('\n✅ SSL certificates generated successfully with OpenSSL!');
  console.log(`   - ${keyPath}`);
  console.log(`   - ${certPath}`);
  console.log('\n⚠️  Note: You may need to accept the self-signed certificate in your browser.\n');
  console.log('📝 To trust the certificate:');
  console.log('   - Chrome: Click "Advanced" → "Proceed to localhost (unsafe)"');
  console.log('   - Firefox: Click "Advanced" → "Accept the Risk and Continue"\n');
  process.exit(0);
} catch (opensslError) {
  console.log('⚠️  OpenSSL not found, using Node.js crypto (fallback)...\n');
}

// Fallback: Use Node.js selfsigned package
try {
  const selfsigned = require('selfsigned');
  
  const attrs = [{ name: 'commonName', value: 'localhost' }];
  const pems = selfsigned.generate(attrs, {
    keySize: 2048,
    days: 365,
    algorithm: 'sha256',
    extensions: [
      {
        name: 'subjectAltName',
        altNames: [
          { type: 2, value: 'localhost' },
          { type: 7, ip: '127.0.0.1' }
        ]
      }
    ]
  });
  
  fs.writeFileSync(keyPath, pems.private);
  fs.writeFileSync(certPath, pems.cert);
  
  console.log('✅ SSL certificates generated successfully with Node.js!');
  console.log(`   - ${keyPath}`);
  console.log(`   - ${certPath}`);
  console.log('\n⚠️  Note: You may need to accept the self-signed certificate in your browser.\n');
  console.log('📝 To trust the certificate:');
  console.log('   - Chrome: Click "Advanced" → "Proceed to localhost (unsafe)"');
  console.log('   - Firefox: Click "Advanced" → "Accept the Risk and Continue"\n');
  
} catch (nodeError) {
  console.error('\n❌ Failed to generate certificates.');
  console.error('\n📝 Installing selfsigned package...\n');
  
  try {
    execSync('npm install --save-dev selfsigned', { cwd: __dirname, stdio: 'inherit' });
    console.log('\n✅ Package installed! Please run this command again:\n');
    console.log('   npm run generate-certs\n');
  } catch (installError) {
    console.error('\n❌ Could not install selfsigned package.');
    console.error('\n📝 Manual options:');
    console.error('   1. Install OpenSSL:');
    console.error('      Windows: choco install openssl');
    console.error('      Or download: https://slproweb.com/products/Win32OpenSSL.html');
    console.error('   2. Or install selfsigned: npm install --save-dev selfsigned');
    console.error('   3. Or use HTTP with localhost only: npm run dev:http\n');
    process.exit(1);
  }
}
