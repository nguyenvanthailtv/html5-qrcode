<script lang="ts" setup>
import { Html5Qrcode } from 'html5-qrcode';


const result = ref(null);
const error = ref(null);
const isScanning = ref(false);
const cameraMode = ref('environment'); // 'environment' (camera sau) hoặc 'user' (camera trước)
let html5QrCode = null;

onMounted(() => {
    // Khởi tạo Html5Qrcode
    html5QrCode = new Html5Qrcode('reader');
});

onUnmounted(() => {
    // Dọn dẹp khi component bị hủy
    if (isScanning.value) {
        html5QrCode.stop().catch((err) => {
            console.error('Lỗi khi dừng quét:', err);
        });
    }
});

const startScanning = async () => {
    try {
        isScanning.value = true;
        error.value = null;

        // Cấu hình quét QR
        const config = { fps: 10, qrbox: { width: 150, height: 150 } };

        // Bắt đầu quét với cameraMode hiện tại
        await html5QrCode.start(
            { facingMode: cameraMode.value },
            config,
            (decodedText) => {
                // Khi quét thành công
                result.value = decodedText;
                stopScanning(); // Dừng quét sau khi tìm thấy mã
            },
            (err) => {
                // Xử lý lỗi (không bắt buộc)
                error.value = err;
            }
        );
    } catch (err) {
        error.value = 'Không thể bắt đầu quét: ' + err.message;
        isScanning.value = false;
    }
};

const stopScanning = async () => {
    try {
        await html5QrCode.stop();
        isScanning.value = false;
        html5QrCode.clear();
    } catch (err) {
        error.value = 'Lỗi khi dừng quét: ' + err.message;
    }
};

const toggleCamera = async () => {
    if (!isScanning.value) return;

    try {
        // Dừng quét hiện tại
        await html5QrCode.stop();
        isScanning.value = false;

        // Chuyển đổi camera
        cameraMode.value = cameraMode.value === 'environment' ? 'user' : 'environment';

        // Bắt đầu lại quét với camera mới
        await startScanning();
    } catch (err) {
        error.value = 'Lỗi khi chuyển camera: ' + err.message;
        isScanning.value = false;
    }
};
</script>
<template>
    <div class="wrapper">
        <div class="box">
            <div id="reader"></div>
            <p v-if="result">Kết quả: {{ result }}</p>
            <p v-if="error">Lỗi: {{ error }}</p>
            <button @click="startScanning" :disabled="isScanning">Bắt đầu quét</button>
            <button @click="stopScanning" :disabled="!isScanning">Dừng quét</button>
            <button @click="toggleCamera" :disabled="!isScanning">Đổi camera</button>
        </div>
    </div>
</template>

<style>
.wrapper {
    position: fixed;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: red;
}

.box {
    width: 100%;
    max-width: 25rem;
    height: 100%;
    max-height: 25rem;
    background-color: white;
}

#reader {
    width: 100%;
    height: 100%;
 max-height: 250px;
 max-width: 250px;
}

/* video {
    width: 300px !important;
} */
</style>
