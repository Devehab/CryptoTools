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
    // تبويبات التنقل
    const encodeTab = document.getElementById('encode-tab');
    const decodeTab = document.getElementById('decode-tab');
    const encodeContent = document.getElementById('encode-content');
    const decodeContent = document.getElementById('decode-content');
    
    // أزرار التحويل
    const convertToBase64Button = document.getElementById('convert-to-base64');
    const convertFromBase64Button = document.getElementById('convert-from-base64');
    
    // حقول الإدخال والإخراج
    const textToBase64Input = document.getElementById('text-to-base64');
    const base64ToDecodeInput = document.getElementById('base64-to-decode');
    const base64ResultOutput = document.getElementById('base64-result');
    const textResultOutput = document.getElementById('text-result');
    
    // تحميل الملفات
    const fileToBase64Input = document.getElementById('file-to-base64');
    const fileToBase64Name = document.getElementById('file-to-base64-name');
    const fileToBase64Actions = document.getElementById('file-to-base64-actions');
    const removeFileToBase64Button = document.getElementById('remove-file-to-base64');
    
    // معاينة الملفات
    const filePreviewContainer = document.getElementById('file-preview-container');
    const imagePreviewContainer = document.getElementById('image-preview-container');
    const imagePreview = document.getElementById('image-preview');
    const pdfPreviewContainer = document.getElementById('pdf-preview-container');
    const pdfPreviewName = document.getElementById('pdf-preview-name');
    const fileInfo = document.getElementById('file-info');
    const fileInfoName = document.getElementById('file-info-name');
    const fileInfoSize = document.getElementById('file-info-size');
    const fileInfoType = document.getElementById('file-info-type');
    const downloadButton = document.getElementById('download-file');
    
    // متغيرات لتخزين معلومات الملف
    let selectedFile = null;
    let fileType = '';
    let decodedFileName = '';
    
    // التحقق من وجود العناصر
    if (!encodeTab || !decodeTab) return;
    
    // تبديل التبويبات
    encodeTab.addEventListener('click', function() {
        encodeTab.classList.add('border-blue-600', 'text-blue-600', 'dark:text-blue-400', 'dark:border-blue-400');
        encodeTab.classList.remove('border-transparent', 'hover:text-gray-600', 'hover:border-gray-300', 'dark:hover:text-gray-300');
        decodeTab.classList.remove('border-blue-600', 'text-blue-600', 'dark:text-blue-400', 'dark:border-blue-400');
        decodeTab.classList.add('border-transparent', 'hover:text-gray-600', 'hover:border-gray-300', 'dark:hover:text-gray-300');
        
        encodeContent.classList.remove('hidden');
        decodeContent.classList.add('hidden');
    });
    
    decodeTab.addEventListener('click', function() {
        decodeTab.classList.add('border-blue-600', 'text-blue-600', 'dark:text-blue-400', 'dark:border-blue-400');
        decodeTab.classList.remove('border-transparent', 'hover:text-gray-600', 'hover:border-gray-300', 'dark:hover:text-gray-300');
        encodeTab.classList.remove('border-blue-600', 'text-blue-600', 'dark:text-blue-400', 'dark:border-blue-400');
        encodeTab.classList.add('border-transparent', 'hover:text-gray-600', 'hover:border-gray-300', 'dark:hover:text-gray-300');
        
        decodeContent.classList.remove('hidden');
        encodeContent.classList.add('hidden');
    });
    
    // تحميل الملفات
    if (fileToBase64Input) {
        fileToBase64Input.addEventListener('change', function(e) {
            if (e.target.files.length > 0) {
                selectedFile = e.target.files[0];
                fileType = selectedFile.type;
                fileToBase64Name.textContent = `الملف المحدد: ${selectedFile.name} (${formatFileSize(selectedFile.size)})`;
                
                // إظهار زر إزالة الملف
                if (fileToBase64Actions) fileToBase64Actions.classList.remove('hidden');
                
                // مسح حقل النص عند اختيار ملف
                if (textToBase64Input) textToBase64Input.value = '';
            } else {
                resetFileUpload();
            }
        });
    }
    
    // زر إزالة الملف المرفوع
    if (removeFileToBase64Button) {
        removeFileToBase64Button.addEventListener('click', function() {
            resetFileUpload();
            // إعادة تفعيل حقل النص
            if (textToBase64Input) textToBase64Input.disabled = false;
        });
    }
    
    // تنسيق حجم الملف بوحدات KB, MB, إلخ
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    // إعادة تعيين حالة تحميل الملف
    function resetFileUpload() {
        selectedFile = null;
        fileType = '';
        if (fileToBase64Name) fileToBase64Name.textContent = '';
        if (fileToBase64Input) fileToBase64Input.value = '';
        if (fileToBase64Actions) fileToBase64Actions.classList.add('hidden');
    }
    
    // تحويل النص أو الملف إلى Base64
    if (convertToBase64Button) {
        convertToBase64Button.addEventListener('click', function() {
            try {
                // التحقق من وجود ملف للتحويل
                if (selectedFile) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        // الحصول على سلسلة Base64 (إزالة بادئة URL البيانات)
                        const base64String = e.target.result;
                        const base64Content = base64String.split(',')[1];
                        
                        // عرض سلسلة Base64 في الإخراج
                        if (base64ResultOutput) base64ResultOutput.value = base64Content;
                    };
                    reader.readAsDataURL(selectedFile);
                } else {
                    // تحويل النص
                    const input = textToBase64Input ? textToBase64Input.value : '';
                    if (!input) {
                        alert('يرجى إدخال نص للترميز أو تحميل ملف.');
                        return;
                    }
                    
                    const encoded = btoa(unescape(encodeURIComponent(input)));
                    if (base64ResultOutput) base64ResultOutput.value = encoded;
                }
            } catch (error) {
                console.error('Error encoding to Base64: ', error);
                alert('حدث خطأ أثناء الترميز. يرجى التأكد من أن النص المدخل صالح.');
            }
        });
    }
    
    // تحويل Base64 إلى نص أو ملف
    if (convertFromBase64Button) {
        convertFromBase64Button.addEventListener('click', function() {
            try {
                const input = base64ToDecodeInput ? base64ToDecodeInput.value.trim() : '';
                if (!input) {
                    alert('يرجى إدخال نص مشفر بـ Base64 لفك الترميز.');
                    return;
                }
                
                // تنظيف المدخلات (إزالة بادئة data URL إذا وجدت)
                let cleanInput = input;
                if (input.startsWith('data:')) {
                    const parts = input.split(',');
                    if (parts.length > 1) {
                        cleanInput = parts[1];
                    }
                }
                
                // محاولة فك الترميز كنص أولاً
                try {
                    const decoded = decodeURIComponent(escape(atob(cleanInput)));
                    if (textResultOutput) textResultOutput.value = decoded;
                    
                    // إخفاء معاينة الملف لفك ترميز النص
                    if (filePreviewContainer) filePreviewContainer.classList.add('hidden');
                } catch (textError) {
                    console.log("فشل فك الترميز كنص، محاولة التعامل معه كملف ثنائي");
                    // إذا فشل فك الترميز كنص، حاول التعامل معه كملف ثنائي
                    try {
                        // محاولة تخمين نوع الملف من المحتوى المفكك
                        const binary = atob(cleanInput);
                        const bytes = new Uint8Array(binary.length);
                        for (let i = 0; i < binary.length; i++) {
                            bytes[i] = binary.charCodeAt(i);
                        }
                        
                        // إنشاء blob ومحاولة اكتشاف نوع الملف
                        const blob = new Blob([bytes]);
                        fileType = guessFileType(bytes) || 'application/octet-stream';
                        
                        // إنشاء URL بيانات
                        const dataUrl = `data:${fileType};base64,${cleanInput}`;
                        
                        // عرض معاينة بناءً على نوع الملف
                        if (fileType.startsWith('image/')) {
                            // إنها صورة، عرض معاينة الصورة
                            if (imagePreview) {
                                imagePreview.src = dataUrl;
                                imagePreviewContainer.classList.remove('hidden');
                            }
                            if (pdfPreviewContainer) pdfPreviewContainer.classList.add('hidden');
                            if (fileInfo) fileInfo.classList.add('hidden');
                        } else if (fileType === 'application/pdf') {
                            // إنه ملف PDF، عرض أيقونة PDF
                            if (imagePreviewContainer) imagePreviewContainer.classList.add('hidden');
                            if (pdfPreviewContainer) {
                                if (pdfPreviewName) pdfPreviewName.textContent = 'ملف PDF';
                                pdfPreviewContainer.classList.remove('hidden');
                            }
                            if (fileInfo) fileInfo.classList.add('hidden');
                        } else {
                            // إنه نوع آخر من الملفات، عرض معلومات الملف
                            if (imagePreviewContainer) imagePreviewContainer.classList.add('hidden');
                            if (pdfPreviewContainer) pdfPreviewContainer.classList.add('hidden');
                            if (fileInfoName) fileInfoName.textContent = 'ملف غير معروف';
                            if (fileInfoSize) fileInfoSize.textContent = formatFileSize(bytes.length);
                            if (fileInfoType) fileInfoType.textContent = `نوع الملف: ${getFileTypeName(fileType)}`;
                            if (fileInfo) fileInfo.classList.remove('hidden');
                        }
                        
                        if (filePreviewContainer) filePreviewContainer.classList.remove('hidden');
                        
                        // تعيين URL البيانات للتنزيل
                        if (downloadButton) {
                            downloadButton.setAttribute('data-url', dataUrl);
                            decodedFileName = 'decoded_file' + getFileExtension(fileType);
                            downloadButton.setAttribute('data-filename', decodedFileName);
                        }
                        
                        // مسح نتيجة النص لأننا نتعامل مع ملف
                        if (textResultOutput) textResultOutput.value = '';
                    } catch (binaryError) {
                        console.error("فشل التعامل مع الملف الثنائي:", binaryError);
                        // إذا فشل كلا الفك كنص وكملف ثنائي، أظهر الخطأ الأصلي
                        throw textError;
                    }
                }
            } catch (error) {
                console.error('Error decoding Base64: ', error);
                alert('حدث خطأ أثناء فك الترميز. يرجى التأكد من أن النص المدخل هو Base64 صالح.');
                if (filePreviewContainer) filePreviewContainer.classList.add('hidden');
            }
        });
    }
    
    // زر تنزيل الملف
    if (downloadButton) {
        downloadButton.addEventListener('click', function() {
            const dataUrl = this.getAttribute('data-url');
            const filename = this.getAttribute('data-filename');
            
            if (dataUrl && filename) {
                const link = document.createElement('a');
                link.href = dataUrl;
                link.download = filename;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        });
    }
    
    // الحصول على امتداد الملف من نوع MIME
    function getFileExtension(mimeType) {
        const extensions = {
            'image/jpeg': '.jpg',
            'image/png': '.png',
            'image/gif': '.gif',
            'image/svg+xml': '.svg',
            'image/webp': '.webp',
            'image/bmp': '.bmp',
            'image/tiff': '.tiff',
            'image/x-icon': '.ico',
            'application/pdf': '.pdf',
            'application/json': '.json',
            'text/plain': '.txt',
            'text/html': '.html',
            'text/css': '.css',
            'text/javascript': '.js',
            'application/zip': '.zip',
            'application/x-rar-compressed': '.rar',
            'audio/mpeg': '.mp3',
            'audio/wav': '.wav',
            'video/mp4': '.mp4',
            'video/webm': '.webm',
            'application/msword': '.doc',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
            'application/vnd.ms-excel': '.xls',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
            'application/vnd.ms-powerpoint': '.ppt',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation': '.pptx',
            'application/octet-stream': ''
        };
        
        return extensions[mimeType] || '';
    }
    
    // الحصول على اسم نوع الملف بالعربية
    function getFileTypeName(mimeType) {
        const typeNames = {
            'image/jpeg': 'صورة JPEG',
            'image/png': 'صورة PNG',
            'image/gif': 'صورة متحركة GIF',
            'image/svg+xml': 'رسم متجهي SVG',
            'image/webp': 'صورة WebP',
            'image/bmp': 'صورة BMP',
            'image/tiff': 'صورة TIFF',
            'image/x-icon': 'أيقونة ICO',
            'application/pdf': 'ملف PDF',
            'application/json': 'ملف JSON',
            'text/plain': 'ملف نصي',
            'text/html': 'صفحة HTML',
            'text/css': 'ملف CSS',
            'text/javascript': 'ملف JavaScript',
            'application/zip': 'ملف مضغوط ZIP',
            'application/x-rar-compressed': 'ملف مضغوط RAR',
            'audio/mpeg': 'ملف صوتي MP3',
            'audio/wav': 'ملف صوتي WAV',
            'video/mp4': 'ملف فيديو MP4',
            'video/webm': 'ملف فيديو WebM',
            'application/msword': 'مستند Word',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'مستند Word',
            'application/vnd.ms-excel': 'جدول بيانات Excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'جدول بيانات Excel',
            'application/vnd.ms-powerpoint': 'عرض تقديمي PowerPoint',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'عرض تقديمي PowerPoint',
            'application/octet-stream': 'ملف ثنائي'
        };
        
        return typeNames[mimeType] || 'ملف غير معروف';
    }
    
    // محاولة تخمين نوع الملف من البايتات الأولى
    function guessFileType(bytes) {
        // التحقق من توقيعات الملفات (أرقام سحرية)
        if (bytes.length < 8) return null;
        
        // JPEG: FF D8 FF
        if (bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF) {
            return 'image/jpeg';
        }
        
        // PNG: 89 50 4E 47
        if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47) {
            return 'image/png';
        }
        
        // GIF: 47 49 46 38
        if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x38) {
            return 'image/gif';
        }
        
        // PDF: 25 50 44 46
        if (bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46) {
            return 'application/pdf';
        }
        
        // ZIP: 50 4B 03 04
        if (bytes[0] === 0x50 && bytes[1] === 0x4B && bytes[2] === 0x03 && bytes[3] === 0x04) {
            return 'application/zip';
        }
        
        // BMP: 42 4D
        if (bytes[0] === 0x42 && bytes[1] === 0x4D) {
            return 'image/bmp';
        }
        
        // WEBP: 52 49 46 46 ?? ?? ?? ?? 57 45 42 50
        if (bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 && 
            bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50) {
            return 'image/webp';
        }
        
        // TIFF: 49 49 2A 00 or 4D 4D 00 2A
        if ((bytes[0] === 0x49 && bytes[1] === 0x49 && bytes[2] === 0x2A && bytes[3] === 0x00) ||
            (bytes[0] === 0x4D && bytes[1] === 0x4D && bytes[2] === 0x00 && bytes[3] === 0x2A)) {
            return 'image/tiff';
        }
        
        // ICO: 00 00 01 00
        if (bytes[0] === 0x00 && bytes[1] === 0x00 && bytes[2] === 0x01 && bytes[3] === 0x00) {
            return 'image/x-icon';
        }
        
        // SVG: محاولة البحث عن نص XML يحتوي على svg
        try {
            const textChunk = String.fromCharCode.apply(null, bytes.slice(0, Math.min(bytes.length, 100)));
            if (textChunk.includes('<svg') || textChunk.includes('<?xml') && textChunk.includes('<svg')) {
                return 'image/svg+xml';
            }
        } catch (e) {
            // تجاهل أي أخطاء في تحويل النص
        }
        
        return null;
    }
}

// AES Encryption/Decryption
function initAES() {
    // تبديل بين تبويبات التشفير وفك التشفير
    const encryptTab = document.getElementById('encrypt-tab');
    const decryptTab = document.getElementById('decrypt-tab');
    const encryptContent = document.getElementById('encrypt-content');
    const decryptContent = document.getElementById('decrypt-content');
    
    if (encryptTab && decryptTab) {
        encryptTab.addEventListener('click', function() {
            encryptTab.classList.add('border-blue-600', 'text-blue-600', 'dark:text-blue-400', 'dark:border-blue-400');
            encryptTab.classList.remove('border-transparent', 'hover:text-gray-600', 'hover:border-gray-300', 'dark:hover:text-gray-300');
            
            decryptTab.classList.remove('border-blue-600', 'text-blue-600', 'dark:text-blue-400', 'dark:border-blue-400');
            decryptTab.classList.add('border-transparent', 'hover:text-gray-600', 'hover:border-gray-300', 'dark:hover:text-gray-300');
            
            encryptContent.classList.remove('hidden');
            decryptContent.classList.add('hidden');
        });
        
        decryptTab.addEventListener('click', function() {
            decryptTab.classList.add('border-blue-600', 'text-blue-600', 'dark:text-blue-400', 'dark:border-blue-400');
            decryptTab.classList.remove('border-transparent', 'hover:text-gray-600', 'hover:border-gray-300', 'dark:hover:text-gray-300');
            
            encryptTab.classList.remove('border-blue-600', 'text-blue-600', 'dark:text-blue-400', 'dark:border-blue-400');
            encryptTab.classList.add('border-transparent', 'hover:text-gray-600', 'hover:border-gray-300', 'dark:hover:text-gray-300');
            
            decryptContent.classList.remove('hidden');
            encryptContent.classList.add('hidden');
        });
    }
    
    // توليد مفتاح عشوائي للتشفير
    const generateEncryptKeyButton = document.getElementById('generate-encrypt-key');
    if (generateEncryptKeyButton) {
        generateEncryptKeyButton.addEventListener('click', function() {
            const randomKey = generateRandomKey(32); // 256 بت
            document.getElementById('encrypt-key').value = randomKey;
        });
    }
    
    // معالجة تحميل الملف للتشفير
    const fileToEncryptInput = document.getElementById('file-to-encrypt');
    const fileToEncryptName = document.getElementById('file-to-encrypt-name');
    const fileToEncryptActions = document.getElementById('file-to-encrypt-actions');
    const removeFileToEncrypt = document.getElementById('remove-file-to-encrypt');
    
    if (fileToEncryptInput) {
        fileToEncryptInput.addEventListener('change', function(event) {
            if (event.target.files.length > 0) {
                const file = event.target.files[0];
                fileToEncryptName.textContent = `${file.name} (${formatFileSize(file.size)})`;
                fileToEncryptActions.classList.remove('hidden');
                
                // تعطيل حقل النص عند اختيار ملف
                document.getElementById('text-to-encrypt').disabled = true;
                document.getElementById('text-to-encrypt').classList.add('bg-gray-100', 'dark:bg-gray-700');
            }
        });
    }
    
    if (removeFileToEncrypt) {
        removeFileToEncrypt.addEventListener('click', function() {
            fileToEncryptInput.value = '';
            fileToEncryptName.textContent = '';
            fileToEncryptActions.classList.add('hidden');
            
            // إعادة تفعيل حقل النص
            document.getElementById('text-to-encrypt').disabled = false;
            document.getElementById('text-to-encrypt').classList.remove('bg-gray-100', 'dark:bg-gray-700');
        });
    }
    
    // معالجة تحميل الملف لفك التشفير
    const fileToDecryptInput = document.getElementById('file-to-decrypt');
    const fileToDecryptName = document.getElementById('file-to-decrypt-name');
    const fileToDecryptActions = document.getElementById('file-to-decrypt-actions');
    const removeFileToDecrypt = document.getElementById('remove-file-to-decrypt');
    
    if (fileToDecryptInput) {
        fileToDecryptInput.addEventListener('change', function(event) {
            if (event.target.files.length > 0) {
                const file = event.target.files[0];
                fileToDecryptName.textContent = `${file.name} (${formatFileSize(file.size)})`;
                fileToDecryptActions.classList.remove('hidden');
                
                // تعطيل حقل النص عند اختيار ملف
                document.getElementById('text-to-decrypt').disabled = true;
                document.getElementById('text-to-decrypt').classList.add('bg-gray-100', 'dark:bg-gray-700');
            }
        });
    }
    
    if (removeFileToDecrypt) {
        removeFileToDecrypt.addEventListener('click', function() {
            fileToDecryptInput.value = '';
            fileToDecryptName.textContent = '';
            fileToDecryptActions.classList.add('hidden');
            
            // إعادة تفعيل حقل النص
            document.getElementById('text-to-decrypt').disabled = false;
            document.getElementById('text-to-decrypt').classList.remove('bg-gray-100', 'dark:bg-gray-700');
            
            // إخفاء معاينة الملف
            document.getElementById('decrypted-file-preview-container').classList.add('hidden');
        });
    }
    
    // زر تشفير AES
    const encryptAesButton = document.getElementById('encrypt-aes-btn');
    if (encryptAesButton) {
        encryptAesButton.addEventListener('click', function() {
            try {
                const key = document.getElementById('encrypt-key').value;
                
                if (!key) {
                    alert('يرجى إدخال مفتاح سري أو توليد مفتاح عشوائي.');
                    return;
                }
                
                // التحقق مما إذا كان هناك ملف للتشفير
                if (fileToEncryptInput.files.length > 0) {
                    const file = fileToEncryptInput.files[0];
                    
                    // قراءة الملف كـ ArrayBuffer
                    const reader = new FileReader();
                    reader.onload = function(event) {
                        const arrayBuffer = event.target.result;
                        
                        // تحويل ArrayBuffer إلى قاعدة 64
                        const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);
                        
                        // تشفير البيانات
                        const encrypted = CryptoJS.AES.encrypt(wordArray, key).toString();
                        
                        // إظهار النتيجة المشفرة
                        document.getElementById('encrypt-result').value = encrypted;
                        
                        // إعداد زر التنزيل
                        const downloadButton = document.getElementById('download-encrypted-file');
                        const encryptedFileContainer = document.getElementById('encrypted-file-container');
                        
                        if (downloadButton && encryptedFileContainer) {
                            // إنشاء Blob من النص المشفر
                            const blob = new Blob([encrypted], { type: 'application/octet-stream' });
                            const url = URL.createObjectURL(blob);
                            
                            // إعداد زر التنزيل
                            downloadButton.setAttribute('data-url', url);
                            downloadButton.setAttribute('data-filename', `${file.name}.enc`);
                            
                            // إظهار قسم تنزيل الملف
                            encryptedFileContainer.classList.remove('hidden');
                        }
                    };
                    
                    reader.readAsArrayBuffer(file);
                } else {
                    // تشفير النص
                    const text = document.getElementById('text-to-encrypt').value;
                    
                    if (!text) {
                        alert('يرجى إدخال نص للتشفير أو تحميل ملف.');
                        return;
                    }
                    
                    const encrypted = CryptoJS.AES.encrypt(text, key).toString();
                    document.getElementById('encrypt-result').value = encrypted;
                    
                    // إخفاء قسم تنزيل الملف إذا كان ظاهرًا
                    const encryptedFileContainer = document.getElementById('encrypted-file-container');
                    if (encryptedFileContainer) {
                        encryptedFileContainer.classList.add('hidden');
                    }
                }
            } catch (error) {
                console.error('Error encrypting with AES: ', error);
                alert('حدث خطأ أثناء التشفير. يرجى المحاولة مرة أخرى.');
            }
        });
    }
    
    // زر تنزيل الملف المشفر
    const downloadEncryptedFileButton = document.getElementById('download-encrypted-file');
    if (downloadEncryptedFileButton) {
        downloadEncryptedFileButton.addEventListener('click', function() {
            const dataUrl = this.getAttribute('data-url');
            const filename = this.getAttribute('data-filename');
            
            if (dataUrl && filename) {
                const link = document.createElement('a');
                link.href = dataUrl;
                link.download = filename;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        });
    }
    
    // زر فك تشفير AES
    const decryptAesButton = document.getElementById('decrypt-aes-btn');
    if (decryptAesButton) {
        decryptAesButton.addEventListener('click', function() {
            try {
                const key = document.getElementById('decrypt-key').value;
                
                if (!key) {
                    alert('يرجى إدخال المفتاح السري المستخدم للتشفير.');
                    return;
                }
                
                // التحقق مما إذا كان هناك ملف لفك التشفير
                if (fileToDecryptInput.files.length > 0) {
                    const file = fileToDecryptInput.files[0];
                    
                    // قراءة الملف كنص
                    const reader = new FileReader();
                    reader.onload = function(event) {
                        try {
                            const encryptedText = event.target.result;
                            
                            // فك تشفير البيانات
                            const decrypted = CryptoJS.AES.decrypt(encryptedText, key);
                            
                            // محاولة تحويل النتيجة إلى نص
                            try {
                                // محاولة فك التشفير كنص
                                const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);
                                
                                if (decryptedText) {
                                    // إذا كان النص صالحًا، فهو على الأرجح ملف نصي
                                    document.getElementById('decrypt-result').value = decryptedText;
                                    
                                    // إخفاء معاينة الملف
                                    document.getElementById('decrypted-file-preview-container').classList.add('hidden');
                                    return;
                                }
                            } catch (e) {
                                // إذا فشل التحويل إلى نص، فهو على الأرجح ملف ثنائي
                                console.log("Not a text file, trying as binary...");
                            }
                            
                            // معالجة كملف ثنائي
                            const wordArray = decrypted;
                            const arrayBuffer = wordArrayToArrayBuffer(wordArray);
                            const blob = new Blob([arrayBuffer]);
                            
                            // محاولة تحديد نوع الملف
                            const fileType = guessFileTypeFromArrayBuffer(arrayBuffer);
                            const mimeType = fileType ? fileType : 'application/octet-stream';
                            
                            // إنشاء عنوان URL للملف
                            const blobWithType = new Blob([arrayBuffer], { type: mimeType });
                            const url = URL.createObjectURL(blobWithType);
                            
                            // إعداد معاينة الملف
                            const filePreviewContainer = document.getElementById('decrypted-file-preview-container');
                            const imagePreviewContainer = document.getElementById('decrypted-image-preview-container');
                            const pdfPreviewContainer = document.getElementById('decrypted-pdf-preview-container');
                            const fileInfoContainer = document.getElementById('decrypted-file-info');
                            const downloadButton = document.getElementById('download-decrypted-file');
                            
                            // إخفاء جميع الحاويات أولاً
                            imagePreviewContainer.classList.add('hidden');
                            pdfPreviewContainer.classList.add('hidden');
                            fileInfoContainer.classList.add('hidden');
                            
                            // إظهار الحاوية المناسبة بناءً على نوع الملف
                            if (mimeType.startsWith('image/')) {
                                // معاينة الصور
                                const imagePreview = document.getElementById('decrypted-image-preview');
                                imagePreview.src = url;
                                imagePreviewContainer.classList.remove('hidden');
                            } else if (mimeType === 'application/pdf') {
                                // معاينة ملفات PDF
                                const pdfPreviewName = document.getElementById('decrypted-pdf-preview-name');
                                const originalName = file.name.replace('.enc', '');
                                pdfPreviewName.textContent = originalName;
                                pdfPreviewContainer.classList.remove('hidden');
                            } else {
                                // معلومات الملفات الأخرى
                                const fileInfoName = document.getElementById('decrypted-file-info-name');
                                const fileInfoSize = document.getElementById('decrypted-file-info-size');
                                const fileInfoType = document.getElementById('decrypted-file-info-type');
                                
                                const originalName = file.name.replace('.enc', '');
                                fileInfoName.textContent = originalName;
                                fileInfoSize.textContent = `الحجم: ${formatFileSize(arrayBuffer.byteLength)}`;
                                fileInfoType.textContent = `النوع: ${getFileTypeName(mimeType)}`;
                                
                                fileInfoContainer.classList.remove('hidden');
                            }
                            
                            // إعداد زر التنزيل
                            const originalName = file.name.replace('.enc', '');
                            downloadButton.setAttribute('data-url', url);
                            downloadButton.setAttribute('data-filename', originalName);
                            
                            // إظهار حاوية معاينة الملف
                            filePreviewContainer.classList.remove('hidden');
                            
                            // إخفاء نتيجة النص
                            document.getElementById('decrypt-result').value = '';
                        } catch (error) {
                            console.error('Error decrypting file: ', error);
                            alert('فشل فك تشفير الملف. يرجى التأكد من صحة المفتاح السري والملف المشفر.');
                        }
                    };
                    
                    reader.readAsText(file);
                } else {
                    // فك تشفير النص
                    const encryptedText = document.getElementById('text-to-decrypt').value;
                    
                    if (!encryptedText) {
                        alert('يرجى إدخال نص مشفر لفك التشفير أو تحميل ملف مشفر.');
                        return;
                    }
                    
                    const decrypted = CryptoJS.AES.decrypt(encryptedText, key).toString(CryptoJS.enc.Utf8);
                    
                    if (!decrypted) {
                        alert('فشل فك التشفير. يرجى التأكد من صحة المفتاح السري والنص المشفر.');
                        return;
                    }
                    
                    document.getElementById('decrypt-result').value = decrypted;
                    
                    // إخفاء معاينة الملف
                    document.getElementById('decrypted-file-preview-container').classList.add('hidden');
                }
            } catch (error) {
                console.error('Error decrypting with AES: ', error);
                alert('حدث خطأ أثناء فك التشفير. يرجى التأكد من صحة المفتاح السري والنص المشفر.');
            }
        });
    }
    
    // زر تنزيل الملف الأصلي بعد فك التشفير
    const downloadDecryptedFileButton = document.getElementById('download-decrypted-file');
    if (downloadDecryptedFileButton) {
        downloadDecryptedFileButton.addEventListener('click', function() {
            const dataUrl = this.getAttribute('data-url');
            const filename = this.getAttribute('data-filename');
            
            if (dataUrl && filename) {
                const link = document.createElement('a');
                link.href = dataUrl;
                link.download = filename;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        });
    }
    
    // توليد مفتاح عشوائي
    function generateRandomKey(length) {
        const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=';
        let result = '';
        const randomValues = new Uint8Array(length);
        window.crypto.getRandomValues(randomValues);
        
        for (let i = 0; i < length; i++) {
            result += charset.charAt(randomValues[i] % charset.length);
        }
        
        return result;
    }
    
    // تحويل WordArray إلى ArrayBuffer
    function wordArrayToArrayBuffer(wordArray) {
        const words = wordArray.words;
        const sigBytes = wordArray.sigBytes;
        
        const buffer = new ArrayBuffer(sigBytes);
        const uint8View = new Uint8Array(buffer);
        
        for (let i = 0; i < sigBytes; i++) {
            uint8View[i] = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
        }
        
        return buffer;
    }
    
    // تنسيق حجم الملف
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 بايت';
        
        const k = 1024;
        const sizes = ['بايت', 'كيلوبايت', 'ميجابايت', 'جيجابايت', 'تيرابايت'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    // تخمين نوع الملف من ArrayBuffer
    function guessFileTypeFromArrayBuffer(buffer) {
        const uint8Array = new Uint8Array(buffer.slice(0, 16));
        const byteArray = Array.from(uint8Array);
        const magicNumbers = byteArray.map(byte => byte.toString(16).padStart(2, '0')).join('').toLowerCase();
        
        // التحقق من توقيعات الملفات الشائعة
        if (magicNumbers.startsWith('89504e47')) return 'image/png';
        if (magicNumbers.startsWith('ffd8ff')) return 'image/jpeg';
        if (magicNumbers.startsWith('47494638')) return 'image/gif';
        if (magicNumbers.startsWith('25504446')) return 'application/pdf';
        if (magicNumbers.startsWith('504b0304')) return 'application/zip';
        if (magicNumbers.startsWith('52494646') && magicNumbers.includes('57454250')) return 'image/webp';
        if (magicNumbers.startsWith('424d')) return 'image/bmp';
        if (magicNumbers.startsWith('7b') || magicNumbers.startsWith('7b0d') || magicNumbers.startsWith('7b0a')) return 'application/json';
        
        // التحقق من ملفات النص
        const textTypes = ['3c21444f', '3c68746d', '3c737667', '68746d6c', '3c3f786d'];
        for (const textType of textTypes) {
            if (magicNumbers.startsWith(textType)) return 'text/html';
        }
        
        // إذا لم يتم التعرف على نوع الملف
        return 'application/octet-stream';
    }
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
    const signTextTab = document.getElementById('sign-text-tab');
    const signFileTab = document.getElementById('sign-file-tab');
    const signTextContent = document.getElementById('sign-text-content');
    const signFileContent = document.getElementById('sign-file-content');
    const fileToSignInput = document.getElementById('file-to-sign');
    const fileToSignInfo = document.getElementById('file-to-sign-info');
    const fileToSignName = document.getElementById('file-to-sign-name');
    const fileToSignSize = document.getElementById('file-to-sign-size');
    const removeFileToSignButton = document.getElementById('remove-file-to-sign');
    const downloadSigBtn = document.getElementById('download-sig-btn');
    const downloadAscBtn = document.getElementById('download-asc-btn');
    
    let fileToSign = null;
    let currentFileName = '';
    
    if (!signButton) return;
    
    // Cambio entre pestañas de texto y archivo
    if (signTextTab && signFileTab) {
        signTextTab.addEventListener('click', function() {
            signTextTab.classList.add('active', 'border-b-2', 'border-blue-600', 'text-blue-600', 'dark:text-blue-400', 'dark:border-blue-400');
            signFileTab.classList.remove('active', 'border-b-2', 'border-blue-600', 'text-blue-600', 'dark:text-blue-400', 'dark:border-blue-400');
            signTextContent.classList.remove('hidden');
            signFileContent.classList.add('hidden');
        });
        
        signFileTab.addEventListener('click', function() {
            signFileTab.classList.add('active', 'border-b-2', 'border-blue-600', 'text-blue-600', 'dark:text-blue-400', 'dark:border-blue-400');
            signTextTab.classList.remove('active', 'border-b-2', 'border-blue-600', 'text-blue-600', 'dark:text-blue-400', 'dark:border-blue-400');
            signFileContent.classList.remove('hidden');
            signTextContent.classList.add('hidden');
        });
    }
    
    // Manejo de carga de archivos
    if (fileToSignInput) {
        fileToSignInput.addEventListener('change', function(e) {
            if (e.target.files.length > 0) {
                fileToSign = e.target.files[0];
                currentFileName = fileToSign.name;
                
                // Mostrar información del archivo
                fileToSignName.textContent = fileToSign.name;
                fileToSignSize.textContent = formatFileSize(fileToSign.size);
                fileToSignInfo.classList.remove('hidden');
            }
        });
        
        // Drag and drop
        const dropZone = fileToSignInput.parentElement.parentElement;
        
        dropZone.addEventListener('dragover', function(e) {
            e.preventDefault();
            dropZone.classList.add('border-blue-500', 'dark:border-blue-400');
        });
        
        dropZone.addEventListener('dragleave', function(e) {
            e.preventDefault();
            dropZone.classList.remove('border-blue-500', 'dark:border-blue-400');
        });
        
        dropZone.addEventListener('drop', function(e) {
            e.preventDefault();
            dropZone.classList.remove('border-blue-500', 'dark:border-blue-400');
            
            if (e.dataTransfer.files.length > 0) {
                fileToSignInput.files = e.dataTransfer.files;
                const event = new Event('change');
                fileToSignInput.dispatchEvent(event);
            }
        });
        
        // Remover archivo
        if (removeFileToSignButton) {
            removeFileToSignButton.addEventListener('click', function() {
                fileToSign = null;
                fileToSignInput.value = '';
                fileToSignInfo.classList.add('hidden');
            });
        }
    }
    
    // Firmar datos (texto o archivo)
    signButton.addEventListener('click', async function() {
        try {
            let dataToSign = '';
            let isFile = false;
            
            // Verificar si estamos firmando un archivo o texto
            if (!signTextContent.classList.contains('hidden')) {
                // Modo texto
                dataToSign = document.getElementById('text-to-sign').value;
                
                if (!dataToSign) {
                    alert('يرجى إدخال النص المراد توقيعه.');
                    return;
                }
            } else {
                // Modo archivo
                if (!fileToSign) {
                    alert('يرجى تحميل الملف المراد توقيعه.');
                    return;
                }
                
                // Leer el archivo como ArrayBuffer
                dataToSign = await readFileAsArrayBuffer(fileToSign);
                isFile = true;
                currentFileName = fileToSign.name;
            }
            
            const privateKey = document.getElementById('signing-private-key').value;
            
            if (!privateKey) {
                alert('يرجى إدخال المفتاح الخاص RSA.');
                return;
            }
            
            // Firmar los datos
            let signature;
            if (isFile) {
                // Para archivos, primero calculamos el hash SHA-256
                const hashBuffer = await crypto.subtle.digest('SHA-256', dataToSign);
                const hashArray = Array.from(new Uint8Array(hashBuffer));
                const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
                
                // Luego firmamos el hash
                signature = RSA.sign(hashHex, privateKey);
            } else {
                // Para texto, usamos la función existente
                signature = RSA.sign(dataToSign, privateKey);
            }
            
            // Mostrar la firma
            document.getElementById('signature-output').value = signature;
            
            // Mostrar mensaje de éxito
            const resultElement = document.getElementById('sign-result');
            if (resultElement) {
                resultElement.textContent = 'تم توقيع ' + (isFile ? 'الملف' : 'الرسالة') + ' بنجاح!';
                resultElement.classList.remove('hidden', 'text-red-500');
                resultElement.classList.add('text-green-500');
            }
            
            // Mostrar el contenedor de resultados
            const signatureContainer = document.getElementById('signature-result');
            if (signatureContainer) {
                signatureContainer.classList.remove('hidden');
            }
            
            // Configurar los botones de descarga
            if (downloadSigBtn && downloadAscBtn) {
                downloadSigBtn.onclick = function() {
                    // Para el formato .sig, guardamos la firma directamente
                    const blob = new Blob([signature], { type: 'application/octet-stream' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = currentFileName + '.sig';
                    document.body.appendChild(a);
                    a.click();
                    setTimeout(function() {
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                    }, 0);
                };
                
                downloadAscBtn.onclick = function() {
                    // ASCII armored version
                    const asciiArmored = 
                        "-----BEGIN PGP SIGNATURE-----\n\n" +
                        signature.match(/.{1,64}/g).join('\n') +
                        "\n-----END PGP SIGNATURE-----";
                    
                    const blob = new Blob([asciiArmored], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = currentFileName + '.asc';
                    document.body.appendChild(a);
                    a.click();
                    setTimeout(function() {
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                    }, 0);
                };
            }
        } catch (error) {
            console.error('Error al firmar: ', error);
            
            // Mostrar mensaje de error
            const resultElement = document.getElementById('sign-result');
            if (resultElement) {
                resultElement.textContent = 'حدث خطأ أثناء توقيع ' + (fileToSign ? 'الملف' : 'الرسالة') + '. يرجى التأكد من صحة المفتاح الخاص.';
                resultElement.classList.remove('hidden', 'text-green-500');
                resultElement.classList.add('text-red-500');
            }
        }
    });
}

// Verify Signature
function initVerifySignature() {
    const verifyButton = document.getElementById('verify-signature-btn');
    const verifyTextTab = document.getElementById('verify-text-tab');
    const verifyFileTab = document.getElementById('verify-file-tab');
    const verifyTextContent = document.getElementById('verify-text-content');
    const verifyFileContent = document.getElementById('verify-file-content');
    const fileToVerifyInput = document.getElementById('file-to-verify');
    const fileToVerifyInfo = document.getElementById('file-to-verify-info');
    const fileToVerifyName = document.getElementById('file-to-verify-name');
    const fileToVerifySize = document.getElementById('file-to-verify-size');
    const removeFileToVerifyButton = document.getElementById('remove-file-to-verify');
    const signatureFileInput = document.getElementById('signature-file');
    const signatureFileName = document.getElementById('signature-file-name');
    
    let fileToVerify = null;
    let signatureFile = null;
    
    if (!verifyButton) return;
    
    // Cambio entre pestañas de texto y archivo
    if (verifyTextTab && verifyFileTab) {
        verifyTextTab.addEventListener('click', function() {
            verifyTextTab.classList.add('active', 'border-b-2', 'border-blue-600', 'text-blue-600', 'dark:text-blue-400', 'dark:border-blue-400');
            verifyFileTab.classList.remove('active', 'border-b-2', 'border-blue-600', 'text-blue-600', 'dark:text-blue-400', 'dark:border-blue-400');
            verifyTextContent.classList.remove('hidden');
            verifyFileContent.classList.add('hidden');
        });
        
        verifyFileTab.addEventListener('click', function() {
            verifyFileTab.classList.add('active', 'border-b-2', 'border-blue-600', 'text-blue-600', 'dark:text-blue-400', 'dark:border-blue-400');
            verifyTextTab.classList.remove('active', 'border-b-2', 'border-blue-600', 'text-blue-600', 'dark:text-blue-400', 'dark:border-blue-400');
            verifyFileContent.classList.remove('hidden');
            verifyTextContent.classList.add('hidden');
        });
    }
    
    // Manejo de carga de archivos para verificación
    if (fileToVerifyInput) {
        fileToVerifyInput.addEventListener('change', function(e) {
            if (e.target.files.length > 0) {
                fileToVerify = e.target.files[0];
                
                // Mostrar información del archivo
                fileToVerifyName.textContent = fileToVerify.name;
                fileToVerifySize.textContent = formatFileSize(fileToVerify.size);
                fileToVerifyInfo.classList.remove('hidden');
            }
        });
        
        // Drag and drop
        const dropZone = fileToVerifyInput.parentElement.parentElement;
        
        dropZone.addEventListener('dragover', function(e) {
            e.preventDefault();
            dropZone.classList.add('border-blue-500', 'dark:border-blue-400');
        });
        
        dropZone.addEventListener('dragleave', function(e) {
            e.preventDefault();
            dropZone.classList.remove('border-blue-500', 'dark:border-blue-400');
        });
        
        dropZone.addEventListener('drop', function(e) {
            e.preventDefault();
            dropZone.classList.remove('border-blue-500', 'dark:border-blue-400');
            
            if (e.dataTransfer.files.length > 0) {
                fileToVerifyInput.files = e.dataTransfer.files;
                const event = new Event('change');
                fileToVerifyInput.dispatchEvent(event);
            }
        });
        
        // Remover archivo
        if (removeFileToVerifyButton) {
            removeFileToVerifyButton.addEventListener('click', function() {
                fileToVerify = null;
                fileToVerifyInput.value = '';
                fileToVerifyInfo.classList.add('hidden');
            });
        }
    }
    
    // Manejo de carga de archivo de firma
    if (signatureFileInput) {
        signatureFileInput.addEventListener('change', function(e) {
            if (e.target.files.length > 0) {
                signatureFile = e.target.files[0];
                signatureFileName.textContent = signatureFile.name;
                signatureFileName.classList.remove('hidden');
                
                // Leer el archivo de firma
                const reader = new FileReader();
                reader.onload = function(event) {
                    let signature = event.target.result;
                    
                    // Si es un archivo .asc, extraer solo la parte de la firma
                    if (signatureFile.name.endsWith('.asc')) {
                        const matches = signature.match(/-----BEGIN PGP SIGNATURE-----([\s\S]*?)-----END PGP SIGNATURE-----/);
                        if (matches && matches[1]) {
                            signature = matches[1].replace(/[\r\n\s]/g, '');
                        }
                    }
                    
                    // Establecer la firma en el campo de texto
                    document.getElementById('verify-signature').value = signature;
                };
                
                if (signatureFile.name.endsWith('.asc')) {
                    reader.readAsText(signatureFile);
                } else {
                    reader.readAsText(signatureFile);
                }
            }
        });
    }
    
    // Verificar firma
    verifyButton.addEventListener('click', async function() {
        try {
            let originalData = '';
            let isFile = false;
            
            // Verificar si estamos verificando un archivo o texto
            if (!verifyTextContent.classList.contains('hidden')) {
                // Modo texto
                originalData = document.getElementById('verify-original-text').value;
                
                if (!originalData) {
                    alert('يرجى إدخال النص الأصلي.');
                    return;
                }
            } else {
                // Modo archivo
                if (!fileToVerify) {
                    alert('يرجى تحميل الملف الأصلي.');
                    return;
                }
                
                // Leer el archivo como ArrayBuffer
                originalData = await readFileAsArrayBuffer(fileToVerify);
                isFile = true;
            }
            
            const signature = document.getElementById('verify-signature').value;
            const publicKey = document.getElementById('verify-public-key').value;
            
            if (!signature) {
                alert('يرجى إدخال التوقيع الرقمي أو تحميل ملف التوقيع.');
                return;
            }
            
            if (!publicKey) {
                alert('يرجى إدخال المفتاح العام RSA.');
                return;
            }
            
            // Verificar la firma
            let isValid;
            if (isFile) {
                // Para archivos, primero calculamos el hash SHA-256
                const hashBuffer = await crypto.subtle.digest('SHA-256', originalData);
                const hashArray = Array.from(new Uint8Array(hashBuffer));
                const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
                
                // Luego verificamos la firma del hash
                isValid = RSA.verify(hashHex, signature, publicKey);
            } else {
                // Para texto, usamos la función existente
                isValid = RSA.verify(originalData, signature, publicKey);
            }
            
            // Mostrar resultado de la verificación
            const resultElement = document.getElementById('verification-result');
            const messageElement = document.getElementById('verification-message');
            const detailsElement = document.getElementById('verification-details');
            
            resultElement.classList.remove('hidden');
            
            if (isValid) {
                messageElement.textContent = 'التوقيع صحيح';
                messageElement.classList.remove('text-red-500');
                messageElement.classList.add('text-green-500');
                resultElement.querySelector('div').classList.remove('bg-red-100', 'dark:bg-red-900');
                resultElement.querySelector('div').classList.add('bg-green-100', 'dark:bg-green-900');
                
                detailsElement.textContent = 'تم التحقق بنجاح من أن ' + (isFile ? 'الملف' : 'النص') + ' لم يتم تعديله وأنه تم توقيعه باستخدام المفتاح الخاص المقابل للمفتاح العام المدخل.';
            } else {
                messageElement.textContent = 'التوقيع غير صحيح';
                messageElement.classList.remove('text-green-500');
                messageElement.classList.add('text-red-500');
                resultElement.querySelector('div').classList.remove('bg-green-100', 'dark:bg-green-900');
                resultElement.querySelector('div').classList.add('bg-red-100', 'dark:bg-red-900');
                
                detailsElement.textContent = 'فشل التحقق من التوقيع. قد يكون ' + (isFile ? 'الملف' : 'النص') + ' تم تعديله، أو التوقيع غير صحيح، أو تم استخدام مفتاح عام خاطئ.';
            }
        } catch (error) {
            console.error('Error al verificar la firma: ', error);
            
            // Mostrar mensaje de error
            const resultElement = document.getElementById('verification-result');
            const messageElement = document.getElementById('verification-message');
            const detailsElement = document.getElementById('verification-details');
            
            resultElement.classList.remove('hidden');
            messageElement.textContent = 'حدث خطأ أثناء التحقق من التوقيع';
            messageElement.classList.remove('text-green-500');
            messageElement.classList.add('text-red-500');
            resultElement.querySelector('div').classList.remove('bg-green-100', 'dark:bg-green-900');
            resultElement.querySelector('div').classList.add('bg-red-100', 'dark:bg-red-900');
            
            detailsElement.textContent = 'حدث خطأ أثناء عملية التحقق. يرجى التأكد من صحة المفتاح العام والتوقيع.';
        }
    });
}

// Función auxiliar para leer un archivo como ArrayBuffer
function readFileAsArrayBuffer(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(reader.error);
        reader.readAsArrayBuffer(file);
    });
}

// Función auxiliar para formatear el tamaño del archivo
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Función para descargar el archivo de firma
function downloadSignatureFile(content, filename, contentType) {
    const a = document.createElement('a');
    const file = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(a.href);
}
