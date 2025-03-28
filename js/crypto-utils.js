/**
 * Utilidades criptográficas para la aplicación CryptoTools
 */

// Generar una billetera (seed phrase, private key, public address)
function generateWallet() {
    try {
        // Generar una frase semilla aleatoria (12 palabras)
        const wordList = [
            "abandon", "ability", "able", "about", "above", "absent", "absorb", "abstract", "absurd", "abuse",
            "access", "accident", "account", "accuse", "achieve", "acid", "acoustic", "acquire", "across", "act",
            "action", "actor", "actress", "actual", "adapt", "add", "addict", "address", "adjust", "admit",
            "adult", "advance", "advice", "aerobic", "affair", "afford", "afraid", "again", "age", "agent",
            "agree", "ahead", "aim", "air", "airport", "aisle", "alarm", "album", "alcohol", "alert",
            "alien", "all", "alley", "allow", "almost", "alone", "alpha", "already", "also", "alter",
            "always", "amateur", "amazing", "among", "amount", "amused", "analyst", "anchor", "ancient", "anger",
            "angle", "angry", "animal", "ankle", "announce", "annual", "another", "answer", "antenna", "antique",
            "anxiety", "any", "apart", "apology", "appear", "apple", "approve", "april", "arch", "arctic",
            "area", "arena", "argue", "arm", "armed", "armor", "army", "around", "arrange", "arrest",
            "arrive", "arrow", "art", "artefact", "artist", "artwork", "ask", "aspect", "assault", "asset",
            "assist", "assume", "asthma", "athlete", "atom", "attack", "attend", "attitude", "attract", "auction",
            "audit", "august", "aunt", "author", "auto", "autumn", "average", "avocado", "avoid", "awake",
            "aware", "away", "awesome", "awful", "awkward", "axis"
        ];
        
        let seedPhrase = '';
        for (let i = 0; i < 12; i++) {
            const randomIndex = Math.floor(Math.random() * wordList.length);
            seedPhrase += wordList[randomIndex];
            if (i < 11) seedPhrase += ' ';
        }
        
        // Generar una clave privada a partir de la frase semilla
        const privateKeyBytes = CryptoJS.SHA256(seedPhrase);
        const privateKey = privateKeyBytes.toString(CryptoJS.enc.Hex);
        
        // Generar una dirección pública a partir de la clave privada
        // Simulamos una dirección de Bitcoin para este ejemplo
        const publicKeyBytes = CryptoJS.SHA256(privateKey);
        const ripemd160 = CryptoJS.RIPEMD160(publicKeyBytes);
        
        // Añadir prefijo de red (0x00 para Bitcoin mainnet)
        const networkPrefix = '00';
        const extendedRipemd = networkPrefix + ripemd160.toString(CryptoJS.enc.Hex);
        
        // Calcular el checksum (doble SHA-256)
        const firstSHA = CryptoJS.SHA256(CryptoJS.enc.Hex.parse(extendedRipemd));
        const secondSHA = CryptoJS.SHA256(firstSHA);
        const checksum = secondSHA.toString(CryptoJS.enc.Hex).substring(0, 8);
        
        // Añadir el checksum
        const binaryAddress = extendedRipemd + checksum;
        
        // Convertir a Base58
        const publicAddress = hexToBase58(binaryAddress);
        
        return {
            seedPhrase,
            privateKey,
            publicAddress
        };
    } catch (error) {
        console.error('Error en generateWallet:', error);
        throw error;
    }
}

// Generar una clave aleatoria
function generateRandomKey(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    
    // Usar la API Web Crypto para generar números aleatorios criptográficamente seguros
    const randomValues = new Uint32Array(length);
    window.crypto.getRandomValues(randomValues);
    
    for (let i = 0; i < length; i++) {
        result += chars.charAt(randomValues[i] % chars.length);
    }
    
    return result;
}

// Convertir hexadecimal a Base58
function hexToBase58(hex) {
    const ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
    const BASE = ALPHABET.length;
    
    // Convertir hex a array de bytes
    const bytes = [];
    for (let i = 0; i < hex.length; i += 2) {
        bytes.push(parseInt(hex.substr(i, 2), 16));
    }
    
    // Contar ceros iniciales
    let zeros = 0;
    for (let i = 0; i < bytes.length && bytes[i] === 0; i++) {
        zeros++;
    }
    
    // Convertir a Base58
    let value = 0;
    for (let i = zeros; i < bytes.length; i++) {
        value = value * 256 + bytes[i];
    }
    
    let result = '';
    while (value > 0) {
        const remainder = value % BASE;
        value = Math.floor(value / BASE);
        result = ALPHABET[remainder] + result;
    }
    
    // Añadir '1's por cada cero inicial
    for (let i = 0; i < zeros; i++) {
        result = '1' + result;
    }
    
    return result;
}

// Convertir Base58 a hexadecimal
function base58ToHex(base58) {
    const ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
    const BASE = ALPHABET.length;
    
    // Decodificar Base58
    let value = 0;
    for (let i = 0; i < base58.length; i++) {
        const char = base58[i];
        const index = ALPHABET.indexOf(char);
        if (index === -1) {
            throw new Error('Invalid Base58 character: ' + char);
        }
        value = value * BASE + index;
    }
    
    // Convertir a hexadecimal
    let hex = '';
    while (value > 0) {
        const remainder = value % 256;
        value = Math.floor(value / 256);
        const hexByte = remainder.toString(16).padStart(2, '0');
        hex = hexByte + hex;
    }
    
    // Añadir ceros iniciales
    let zeros = 0;
    for (let i = 0; i < base58.length && base58[i] === '1'; i++) {
        zeros++;
    }
    for (let i = 0; i < zeros; i++) {
        hex = '00' + hex;
    }
    
    return hex;
}

// Módulo para manejar operaciones de firma digital y verificación
const DigitalSignature = (function() {
    return {
        // Firmar un mensaje con una clave privada RSA
        sign: function(message, privateKey) {
            try {
                const signer = new JSEncrypt();
                signer.setPrivateKey(privateKey);
                
                // Crear un hash SHA-256 del mensaje
                const messageHash = CryptoJS.SHA256(message).toString();
                
                // Firmar el hash
                const signature = signer.sign(messageHash, CryptoJS.SHA256, "sha256");
                
                return signature;
            } catch (error) {
                console.error('Error al firmar el mensaje:', error);
                throw new Error('فشل إنشاء التوقيع الرقمي. يرجى التأكد من صحة المفتاح الخاص.');
            }
        },
        
        // Verificar una firma con una clave pública RSA
        verify: function(message, signature, publicKey) {
            try {
                const verifier = new JSEncrypt();
                verifier.setPublicKey(publicKey);
                
                // Crear un hash SHA-256 del mensaje
                const messageHash = CryptoJS.SHA256(message).toString();
                
                // Verificar la firma
                const isValid = verifier.verify(messageHash, signature, CryptoJS.SHA256);
                
                return isValid;
            } catch (error) {
                console.error('Error al verificar la firma:', error);
                throw new Error('فشل التحقق من التوقيع. يرجى التأكد من صحة المفتاح العام والتوقيع.');
            }
        }
    };
})();

// Módulo para manejar operaciones RSA
const RSA = (function() {
    return {
        // Generar un par de claves RSA
        generateKeyPair: function(keySize = 2048) {
            try {
                const crypt = new JSEncrypt({default_key_size: keySize});
                crypt.getKey();
                
                const privateKey = crypt.getPrivateKey();
                const publicKey = crypt.getPublicKey();
                
                return {
                    privateKey,
                    publicKey
                };
            } catch (error) {
                console.error('Error al generar claves RSA:', error);
                throw new Error('فشل إنشاء زوج المفاتيح RSA. يرجى المحاولة مرة أخرى.');
            }
        },
        
        // Firmar un mensaje con una clave privada RSA
        sign: function(message, privateKey) {
            try {
                const signer = new JSEncrypt();
                signer.setPrivateKey(privateKey);
                
                // Crear un hash SHA-256 del mensaje
                const messageHash = CryptoJS.SHA256(message).toString();
                
                // Firmar el hash
                const signature = signer.sign(messageHash, CryptoJS.SHA256, "sha256");
                
                return signature;
            } catch (error) {
                console.error('Error al firmar el mensaje:', error);
                throw new Error('فشل إنشاء التوقيع الرقمي. يرجى التأكد من صحة المفتاح الخاص.');
            }
        },
        
        // Verificar una firma con una clave pública RSA
        verify: function(message, signature, publicKey) {
            try {
                const verifier = new JSEncrypt();
                verifier.setPublicKey(publicKey);
                
                // Crear un hash SHA-256 del mensaje
                const messageHash = CryptoJS.SHA256(message).toString();
                
                // Verificar la firma
                const isValid = verifier.verify(messageHash, signature, CryptoJS.SHA256);
                
                return isValid;
            } catch (error) {
                console.error('Error al verificar la firma:', error);
                throw new Error('فشل التحقق من التوقيع. يرجى التأكد من صحة المفتاح العام والتوقيع.');
            }
        },
        
        // Cifrar un mensaje con una clave pública RSA
        encrypt: function(message, publicKey) {
            try {
                const encryptor = new JSEncrypt();
                encryptor.setPublicKey(publicKey);
                
                const encrypted = encryptor.encrypt(message);
                
                return encrypted;
            } catch (error) {
                console.error('Error al cifrar el mensaje:', error);
                throw new Error('فشل تشفير الرسالة. يرجى التأكد من صحة المفتاح العام.');
            }
        },
        
        // Descifrar un mensaje con una clave privada RSA
        decrypt: function(encryptedMessage, privateKey) {
            try {
                const decryptor = new JSEncrypt();
                decryptor.setPrivateKey(privateKey);
                
                const decrypted = decryptor.decrypt(encryptedMessage);
                
                if (decrypted === false) {
                    throw new Error('فشل فك تشفير الرسالة. يرجى التأكد من صحة المفتاح الخاص والرسالة المشفرة.');
                }
                
                return decrypted;
            } catch (error) {
                console.error('Error al descifrar el mensaje:', error);
                throw new Error('فشل فك تشفير الرسالة. يرجى التأكد من صحة المفتاح الخاص والرسالة المشفرة.');
            }
        }
    };
})();

// Inicializar la funcionalidad de firma digital
function initDigitalSignature() {
    const signButton = document.getElementById('generate-digital-signature');
    
    if (!signButton) return;
    
    signButton.addEventListener('click', function() {
        try {
            const message = document.getElementById('digital-signature-input').value;
            const privateKey = document.getElementById('digital-signature-private-key').value;
            
            if (!message) {
                alert('يرجى إدخال نص للتوقيع.');
                return;
            }
            
            if (!privateKey) {
                alert('يرجى إدخال المفتاح الخاص.');
                return;
            }
            
            // Firmar el mensaje
            const signature = DigitalSignature.sign(message, privateKey);
            
            // Mostrar la firma
            document.getElementById('digital-signature-output').value = signature;
        } catch (error) {
            console.error('Error al generar firma digital:', error);
            alert(error.message || 'حدث خطأ أثناء إنشاء التوقيع الرقمي. يرجى المحاولة مرة أخرى.');
        }
    });
}

// Inicializar la funcionalidad de verificación de firma
function initVerifySignature() {
    const verifyButton = document.getElementById('verify-signature-btn');
    
    if (!verifyButton) return;
    
    verifyButton.addEventListener('click', function() {
        try {
            const message = document.getElementById('verify-signature-input').value;
            const signature = document.getElementById('verify-signature-signature').value;
            const publicKey = document.getElementById('verify-signature-public-key').value;
            
            if (!message) {
                alert('يرجى إدخال النص المراد التحقق منه.');
                return;
            }
            
            if (!signature) {
                alert('يرجى إدخال التوقيع الرقمي.');
                return;
            }
            
            if (!publicKey) {
                alert('يرجى إدخال المفتاح العام.');
                return;
            }
            
            // Verificar la firma
            const isValid = DigitalSignature.verify(message, signature, publicKey);
            
            // Mostrar el resultado
            const outputElement = document.getElementById('verify-signature-output');
            
            if (isValid) {
                outputElement.value = '✅ التوقيع صحيح. تم التحقق بنجاح من أن الرسالة موقعة بواسطة صاحب المفتاح الخاص المقابل للمفتاح العام المقدم.';
                outputElement.classList.add('bg-green-50', 'dark:bg-green-900', 'text-green-800', 'dark:text-green-200');
                outputElement.classList.remove('bg-red-50', 'dark:bg-red-900', 'text-red-800', 'dark:text-red-200');
            } else {
                outputElement.value = '❌ التوقيع غير صحيح. لا يمكن التحقق من أن الرسالة موقعة بواسطة صاحب المفتاح الخاص المقابل للمفتاح العام المقدم.';
                outputElement.classList.add('bg-red-50', 'dark:bg-red-900', 'text-red-800', 'dark:text-red-200');
                outputElement.classList.remove('bg-green-50', 'dark:bg-green-900', 'text-green-800', 'dark:text-green-200');
            }
        } catch (error) {
            console.error('Error al verificar firma digital:', error);
            
            // Mostrar el error
            const outputElement = document.getElementById('verify-signature-output');
            outputElement.value = '❌ خطأ: ' + (error.message || 'حدث خطأ أثناء التحقق من التوقيع. يرجى المحاولة مرة أخرى.');
            outputElement.classList.add('bg-red-50', 'dark:bg-red-900', 'text-red-800', 'dark:text-red-200');
            outputElement.classList.remove('bg-green-50', 'dark:bg-green-900', 'text-green-800', 'dark:text-green-200');
        }
    });
}
