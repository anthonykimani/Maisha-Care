import dotenv from 'dotenv';
import IPFSMedicalStorage from './IPFSMedicalStorage.js';

dotenv.config();

const ipfsMedicalStorage = new IPFSMedicalStorage(
  process.env.JWT,
  process.env.PINATA_GATEWAY
);

const mockEncryptedDataPackage = {
  encryptedData: 'encrypted_data_here',
  iv: 'iv_here',
  authTag: 'auth_tag_here',
  encryptedSymmetricKey: 'encrypted_symmetric_key_here',
  signature: 'signature_here'
};

async function testStoreEncryptedData() {
  console.log('Testing storeEncryptedData method...');
  const patientId = 'test-patient-001';
  const dataType = 'personal_info';
  const result = await ipfsMedicalStorage.storeEncryptedData(patientId, dataType, mockEncryptedDataPackage);
  console.log('Encrypted data stored. Result:', result);
  return result;
}

async function testRetrieveEncryptedData() {
  console.log('Testing retrieveEncryptedData method...');
  const patientId = 'test-patient-001';
  const dataType = 'personal_info';
  const result = await ipfsMedicalStorage.retrieveEncryptedData(patientId, dataType);
  console.log('Retrieved encrypted data:', result);
  return result;
}

async function runTests() {
  try {
    const storedData = await testStoreEncryptedData();
    // Small delay to ensure data is stored before retrieval
    await new Promise(resolve => setTimeout(resolve, 1000));
    const retrievedData = await testRetrieveEncryptedData();
    
    console.log('Comparing stored and retrieved data:');
    console.log('Stored data:', JSON.stringify(storedData));
    console.log('Retrieved data:', JSON.stringify(retrievedData));

    if (JSON.stringify(mockEncryptedDataPackage) !== JSON.stringify(retrievedData)) {
      throw new Error('Stored and retrieved data do not match');
    } else {
      console.log('Stored and retrieved data match successfully.');
    }
    
    console.log('All tests completed successfully.');
  } catch (error) {
    console.error('Test failed:', error);
  }
}

runTests();