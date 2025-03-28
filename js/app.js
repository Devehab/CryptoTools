// Inicialización de la aplicación
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar todas las funcionalidades
    initThemeToggle();
    initTabSwitching();
    initClipboard();
    
    // Inicializar herramientas criptográficas
    initWalletGenerator();
    initBase64();
    initAES();
    initSHA256();
    initHexBase58();
    initTextToHash();
    initRSAKeyGenerator();
    initDigitalSignature();
    initVerifySignature();
});

// Alternar entre modo claro y oscuro
function initThemeToggle() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    
    // Verificar si hay un tema guardado en localStorage
    if (localStorage.getItem('theme') === 'dark' || 
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
    
    // Cambiar el tema al hacer clic en el botón
    themeToggleBtn.addEventListener('click', function() {
        if (document.documentElement.classList.contains('dark')) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        }
    });
}

// Cambio de pestañas
function initTabSwitching() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // Verificar si hay una pestaña activa guardada en localStorage
    const activeTab = localStorage.getItem('activeTab');
    if (activeTab) {
        // Ocultar todas las pestañas
        tabContents.forEach(content => {
            content.classList.remove('active');
        });
        
        // Mostrar la pestaña activa
        const activeContent = document.getElementById(activeTab);
        if (activeContent) {
            activeContent.classList.add('active');
            
            // Actualizar el estado de los botones
            tabButtons.forEach(btn => {
                if (btn.getAttribute('data-tab') === activeTab) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
        }
    }
    
    // Cambiar de pestaña al hacer clic en un botón
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Actualizar el estado de los botones
            tabButtons.forEach(btn => {
                if (btn === this) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
            
            // Ocultar todas las pestañas
            tabContents.forEach(content => {
                content.classList.remove('active');
            });
            
            // Mostrar la pestaña seleccionada
            const selectedTab = document.getElementById(tabId);
            if (selectedTab) {
                selectedTab.classList.add('active');
                
                // Guardar la pestaña activa en localStorage
                localStorage.setItem('activeTab', tabId);
            }
        });
    });
}

// Inicializar clipboard.js para copiar al portapapeles
function initClipboard() {
    const clipboard = new ClipboardJS('.copy-btn', {
        text: function(trigger) {
            const targetId = trigger.getAttribute('data-copy');
            return document.getElementById(targetId).value;
        }
    });
    
    clipboard.on('success', function(e) {
        // Mostrar notificación de éxito
        const originalHTML = e.trigger.innerHTML;
        e.trigger.innerHTML = '<i class="fas fa-check"></i>';
        
        setTimeout(function() {
            e.trigger.innerHTML = originalHTML;
        }, 1500);
        
        e.clearSelection();
    });
    
    clipboard.on('error', function(e) {
        console.error('Error al copiar: ', e);
        alert('حدث خطأ أثناء النسخ. يرجى المحاولة مرة أخرى.');
    });
}

// Generador de billetera
function initWalletGenerator() {
    const generateButton = document.getElementById('generate-wallet');
    const walletResult = document.getElementById('wallet-result');
    
    if (!generateButton) return;
    
    generateButton.addEventListener('click', function() {
        try {
            // Generar una billetera nueva
            const wallet = generateWallet();
            
            // Mostrar los resultados
            document.getElementById('seed-phrase').value = wallet.seedPhrase;
            document.getElementById('private-key').value = wallet.privateKey;
            document.getElementById('public-address').value = wallet.publicAddress;
            
            // Generar código QR para la dirección pública
            const qrcodeContainer = document.getElementById('qrcode');
            qrcodeContainer.innerHTML = '';
            new QRCode(qrcodeContainer, {
                text: wallet.publicAddress,
                width: 128,
                height: 128,
                colorDark: '#000000',
                colorLight: '#ffffff',
                correctLevel: QRCode.CorrectLevel.H
            });
            
            // Mostrar el contenedor de resultados
            walletResult.classList.remove('hidden');
        } catch (error) {
            console.error('Error al generar la billetera: ', error);
            alert('حدث خطأ أثناء إنشاء المحفظة. يرجى المحاولة مرة أخرى.');
        }
    });
}

// Base64 Encoder/Decoder
function initBase64() {
    const encodeButton = document.getElementById('encode-base64');
    const decodeButton = document.getElementById('decode-base64');
    
    if (!encodeButton || !decodeButton) return;
    
    encodeButton.addEventListener('click', function() {
        try {
            const input = document.getElementById('base64-input').value;
            if (!input) {
                alert('يرجى إدخال نص للترميز.');
                return;
            }
            
            const encoded = btoa(unescape(encodeURIComponent(input)));
            document.getElementById('base64-output').value = encoded;
        } catch (error) {
            console.error('Error al codificar en Base64: ', error);
            alert('حدث خطأ أثناء الترميز. يرجى التأكد من أن النص المدخل صالح.');
        }
    });
    
    decodeButton.addEventListener('click', function() {
        try {
            const input = document.getElementById('base64-input').value;
            if (!input) {
                alert('يرجى إدخال نص مشفر بـ Base64 لفك الترميز.');
                return;
            }
            
            const decoded = decodeURIComponent(escape(atob(input)));
            document.getElementById('base64-output').value = decoded;
        } catch (error) {
            console.error('Error al decodificar Base64: ', error);
            alert('حدث خطأ أثناء فك الترميز. يرجى التأكد من أن النص المدخل هو Base64 صالح.');
        }
    });
}

// AES Encryption/Decryption
function initAES() {
    const encryptButton = document.getElementById('encrypt-aes');
    const decryptButton = document.getElementById('decrypt-aes');
    const generateKeyButton = document.getElementById('generate-aes-key');
    
    if (!encryptButton || !decryptButton || !generateKeyButton) return;
    
    generateKeyButton.addEventListener('click', function() {
        // Generar una clave aleatoria de 32 caracteres
        const key = generateRandomKey(32);
        document.getElementById('aes-key').value = key;
    });
    
    encryptButton.addEventListener('click', function() {
        try {
            const input = document.getElementById('aes-input').value;
            const key = document.getElementById('aes-key').value;
            
            if (!input) {
                alert('يرجى إدخال نص للتشفير.');
                return;
            }
            
            if (!key) {
                alert('يرجى إدخال مفتاح سري أو توليد واحد.');
                return;
            }
            
            const encrypted = CryptoJS.AES.encrypt(input, key).toString();
            document.getElementById('aes-output').value = encrypted;
        } catch (error) {
            console.error('Error al encriptar con AES: ', error);
            alert('حدث خطأ أثناء التشفير. يرجى المحاولة مرة أخرى.');
        }
    });
    
    decryptButton.addEventListener('click', function() {
        try {
            const input = document.getElementById('aes-input').value;
            const key = document.getElementById('aes-key').value;
            
            if (!input) {
                alert('يرجى إدخال نص مشفر لفك التشفير.');
                return;
            }
            
            if (!key) {
                alert('يرجى إدخال المفتاح السري المستخدم للتشفير.');
                return;
            }
            
            const decrypted = CryptoJS.AES.decrypt(input, key).toString(CryptoJS.enc.Utf8);
            
            if (!decrypted) {
                alert('فشل فك التشفير. يرجى التأكد من صحة المفتاح السري والنص المشفر.');
                return;
            }
            
            document.getElementById('aes-output').value = decrypted;
        } catch (error) {
            console.error('Error al desencriptar con AES: ', error);
            alert('حدث خطأ أثناء فك التشفير. يرجى التأكد من صحة المفتاح السري والنص المشفر.');
        }
    });
}

// SHA-256 Hashing
function initSHA256() {
    const generateButton = document.getElementById('hash-sha256');
    
    if (!generateButton) return;
    
    generateButton.addEventListener('click', function() {
        try {
            const input = document.getElementById('sha256-input').value;
            
            if (!input) {
                alert('يرجى إدخال نص لإنشاء قيمة التجزئة.');
                return;
            }
            
            const hash = CryptoJS.SHA256(input).toString();
            document.getElementById('sha256-output').value = hash;
        } catch (error) {
            console.error('Error al generar hash SHA-256: ', error);
            alert('حدث خطأ أثناء إنشاء قيمة التجزئة. يرجى المحاولة مرة أخرى.');
        }
    });
}

// Hex to Base58 Conversion
function initHexBase58() {
    const hexToBase58Button = document.getElementById('convert-hex-to-base58');
    const base58ToHexButton = document.getElementById('base58-to-hex');
    
    if (!hexToBase58Button) return;
    
    hexToBase58Button.addEventListener('click', function() {
        try {
            const input = document.getElementById('hex-input').value.trim();
            
            if (!input) {
                alert('يرجى إدخال قيمة سداسية عشرية للتحويل.');
                return;
            }
            
            // Validar que la entrada sea hexadecimal
            if (!/^[0-9A-Fa-f]+$/.test(input)) {
                alert('يرجى إدخال قيمة سداسية عشرية صالحة (0-9, A-F).');
                return;
            }
            
            const base58 = hexToBase58(input);
            document.getElementById('base58-output').value = base58;
        } catch (error) {
            console.error('Error al convertir Hex a Base58: ', error);
            alert('حدث خطأ أثناء التحويل. يرجى التأكد من صحة القيمة السداسية العشرية المدخلة.');
        }
    });
    
    if (base58ToHexButton) {
        base58ToHexButton.addEventListener('click', function() {
            try {
                const input = document.getElementById('base58-output').value.trim();
                
                if (!input) {
                    alert('يرجى إدخال قيمة Base58 للتحويل.');
                    return;
                }
                
                // Validar que la entrada sea Base58
                if (!/^[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]+$/.test(input)) {
                    alert('يرجى إدخال قيمة Base58 صالحة.');
                    return;
                }
                
                const hex = base58ToHex(input);
                document.getElementById('hex-input').value = hex;
            } catch (error) {
                console.error('Error al convertir Base58 a Hex: ', error);
                alert('حدث خطأ أثناء التحويل. يرجى التأكد من صحة قيمة Base58 المدخلة.');
            }
        });
    }
}

// Text to Hash Conversion
function initTextToHash() {
    const generateButton = document.getElementById('generate-hashes');
    
    if (!generateButton) return;
    
    generateButton.addEventListener('click', function() {
        try {
            const input = document.getElementById('text-to-hash-input').value;
            
            if (!input) {
                alert('يرجى إدخال نص لإنشاء قيم التجزئة.');
                return;
            }
            
            // حساب قيم التجزئة باستخدام جميع الخوارزميات
            document.getElementById('md5-output').value = CryptoJS.MD5(input).toString();
            document.getElementById('sha1-output').value = CryptoJS.SHA1(input).toString();
            document.getElementById('sha256-output-multi').value = CryptoJS.SHA256(input).toString();
            document.getElementById('sha512-output').value = CryptoJS.SHA512(input).toString();
            document.getElementById('ripemd160-output').value = CryptoJS.RIPEMD160(input).toString();
            
            // إظهار النتائج
            document.getElementById('hash-results').classList.remove('hidden');
        } catch (error) {
            console.error('Error al generar hash: ', error);
            alert('حدث خطأ أثناء إنشاء قيم التجزئة. يرجى المحاولة مرة أخرى.');
        }
    });
}

// RSA Key Generator
function initRSAKeyGenerator() {
    const generateButton = document.getElementById('generate-rsa-keys-btn');
    
    if (!generateButton) return;
    
    generateButton.addEventListener('click', function() {
        try {
            // Generar un par de claves RSA
            const keyPair = RSA.generateKeyPair();
            
            // Mostrar las claves generadas
            document.getElementById('public-key-output').value = keyPair.publicKey;
            document.getElementById('private-key-output').value = keyPair.privateKey;
            
            // Mostrar mensaje de éxito
            const resultElement = document.getElementById('rsa-key-result');
            if (resultElement) {
                resultElement.textContent = 'تم إنشاء زوج المفاتيح RSA بنجاح!';
                resultElement.classList.remove('hidden', 'text-red-500');
                resultElement.classList.add('text-green-500');
            }
            
            // Mostrar el contenedor de resultados
            const keysContainer = document.getElementById('rsa-keys-output');
            if (keysContainer) {
                keysContainer.classList.remove('hidden');
            }
        } catch (error) {
            console.error('Error al generar claves RSA: ', error);
            
            // Mostrar mensaje de error
            const resultElement = document.getElementById('rsa-key-result');
            if (resultElement) {
                resultElement.textContent = 'حدث خطأ أثناء إنشاء المفاتيح. يرجى المحاولة مرة أخرى.';
                resultElement.classList.remove('hidden', 'text-green-500');
                resultElement.classList.add('text-red-500');
            }
        }
    });
}

// Digital Signature
function initDigitalSignature() {
    const signButton = document.getElementById('sign-data-btn');
    
    if (!signButton) return;
    
    signButton.addEventListener('click', function() {
        try {
            const message = document.getElementById('text-to-sign').value;
            const privateKey = document.getElementById('signing-private-key').value;
            
            if (!message) {
                alert('يرجى إدخال النص المراد توقيعه.');
                return;
            }
            
            if (!privateKey) {
                alert('يرجى إدخال المفتاح الخاص RSA.');
                return;
            }
            
            // Firmar el mensaje
            const signature = RSA.sign(message, privateKey);
            
            // Mostrar la firma
            document.getElementById('signature-output').value = signature;
            
            // Mostrar mensaje de éxito
            const resultElement = document.getElementById('sign-result');
            if (resultElement) {
                resultElement.textContent = 'تم توقيع الرسالة بنجاح!';
                resultElement.classList.remove('hidden', 'text-red-500');
                resultElement.classList.add('text-green-500');
            }
            
            // Mostrar el contenedor de resultados
            const signatureContainer = document.getElementById('signature-result');
            if (signatureContainer) {
                signatureContainer.classList.remove('hidden');
            }
        } catch (error) {
            console.error('Error al firmar el mensaje: ', error);
            
            // Mostrar mensaje de error
            const resultElement = document.getElementById('sign-result');
            if (resultElement) {
                resultElement.textContent = 'حدث خطأ أثناء توقيع الرسالة. يرجى التأكد من صحة المفتاح الخاص.';
                resultElement.classList.remove('hidden', 'text-green-500');
                resultElement.classList.add('text-red-500');
            }
        }
    });
}

// Verify Signature
function initVerifySignature() {
    const verifyButton = document.getElementById('verify-signature-btn');
    
    if (!verifyButton) return;
    
    verifyButton.addEventListener('click', function() {
        try {
            const message = document.getElementById('verify-original-text').value;
            const signature = document.getElementById('verify-signature').value;
            const publicKey = document.getElementById('verify-public-key').value;
            
            if (!message) {
                alert('يرجى إدخال النص الأصلي.');
                return;
            }
            
            if (!signature) {
                alert('يرجى إدخال التوقيع الرقمي.');
                return;
            }
            
            if (!publicKey) {
                alert('يرجى إدخال المفتاح العام RSA.');
                return;
            }
            
            // التحقق من التوقيع
            const isValid = RSA.verify(message, signature, publicKey);
            
            // إظهار نتيجة التحقق
            const resultElement = document.getElementById('verification-result');
            const messageElement = document.getElementById('verification-message');
            
            resultElement.classList.remove('hidden');
            
            if (isValid) {
                messageElement.textContent = 'التوقيع صحيح';
                messageElement.classList.remove('text-red-500');
                messageElement.classList.add('text-green-500');
                resultElement.querySelector('div').classList.remove('bg-red-100', 'dark:bg-red-900');
                resultElement.querySelector('div').classList.add('bg-green-100', 'dark:bg-green-900');
            } else {
                messageElement.textContent = 'التوقيع غير صحيح';
                messageElement.classList.remove('text-green-500');
                messageElement.classList.add('text-red-500');
                resultElement.querySelector('div').classList.remove('bg-green-100', 'dark:bg-green-900');
                resultElement.querySelector('div').classList.add('bg-red-100', 'dark:bg-red-900');
            }
        } catch (error) {
            console.error('Error al verificar la firma: ', error);
            
            // إظهار رسالة الخطأ
            const resultElement = document.getElementById('verification-result');
            const messageElement = document.getElementById('verification-message');
            
            resultElement.classList.remove('hidden');
            messageElement.textContent = 'حدث خطأ أثناء التحقق من التوقيع';
            messageElement.classList.remove('text-green-500');
            messageElement.classList.add('text-red-500');
            resultElement.querySelector('div').classList.remove('bg-green-100', 'dark:bg-green-900');
            resultElement.querySelector('div').classList.add('bg-red-100', 'dark:bg-red-900');
        }
    });
}
