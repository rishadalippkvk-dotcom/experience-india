import fetch from 'node-fetch';
import FormData from 'form-data';
import fs from 'fs';

const testUpload = async () => {
    try {
        const form = new FormData();
        // Use a real image from the project for testing
        const testFile = '../client/public/jaipur.jpg';
        form.append('image', fs.createReadStream(testFile));

        const response = await fetch('http://localhost:5000/api/upload', {
            method: 'POST',
            body: form,
        });

        const data = await response.json();
        console.log('Upload Test Result:', data);
    } catch (error) {
        console.error('Upload Test Failed:', error);
    }
};

testUpload();
