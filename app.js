import { firebaseConfig, apiBaseUrl } from './config.js';
document.querySelectorAll('[data-action]').forEach(b=>b.onclick=()=>alert('এই feature-এর জন্য Firebase Auth ও API configuration সম্পন্ন করুন।'));
document.getElementById('authState').textContent='Firebase Auth প্রস্তুত করুন';
export { firebaseConfig, apiBaseUrl };