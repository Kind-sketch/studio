'use client';

import { useState } from 'react';
import { useFirebase } from '@/context/firebase-context';
import { addDoc, collection } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useToast } from '@/hooks/use-toast';

export default function TestFirestoreStoragePage() {
  const { db, storage } = useFirebase();
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const testFirestore = async () => {
    if (!db) {
      toast({
        title: 'Error',
        description: 'Firestore not initialized',
        variant: 'destructive',
      });
      return;
    }

    setSaving(true);
    try {
      // Test creating a document in Firestore
      const docRef = await addDoc(collection(db, 'test'), {
        message: 'Test document',
        timestamp: new Date(),
      });
      
      toast({
        title: 'Success',
        description: `Document added with ID: ${docRef.id}`,
      });
    } catch (error) {
      console.error('Error adding document:', error);
      toast({
        title: 'Error',
        description: 'Failed to add document to Firestore',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const testStorage = async () => {
    if (!storage || !file) {
      toast({
        title: 'Error',
        description: 'Storage not initialized or no file selected',
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);
    try {
      // Test uploading a file to Firebase Storage
      const storageRef = ref(storage, `test/${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      toast({
        title: 'Success',
        description: `File uploaded successfully. URL: ${downloadURL}`,
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload file to Firebase Storage',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/30 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">Test Firestore and Storage</h1>
        
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-2">Test Firestore</h2>
            <button
              onClick={testFirestore}
              disabled={saving}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Add Test Document'}
            </button>
          </div>
          
          <div>
            <h2 className="text-lg font-semibold mb-2">Test Storage</h2>
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full mb-2"
            />
            <button
              onClick={testStorage}
              disabled={uploading || !file}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded disabled:opacity-50"
            >
              {uploading ? 'Uploading...' : 'Upload File'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}