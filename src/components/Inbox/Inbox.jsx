import React, { useEffect, useState } from 'react';
import { db } from '../../firebase/firebaseConfig'; // تأكد من المسار الصحيح
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';

function Inbox() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      const querySnapshot = await getDocs(collection(db, 'inbox'));
      const messagesArray = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMessages(messagesArray);
    };
    fetchMessages();
  }, []);

  const toggleReadStatus = async (id, isRead) => {
    const messageRef = doc(db, 'inbox', id);
    await updateDoc(messageRef, { isRead: !isRead });
    setMessages((prevMessages) =>
      prevMessages.map((msg) => (msg.id === id ? { ...msg, isRead: !isRead } : msg))
    );
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Inbox</h2>
      <div className="space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`p-4 border rounded-lg ${msg.isRead ? 'bg-gray-100' : 'bg-blue-50'}`}>
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">{msg.name}</h3>
              <button onClick={() => toggleReadStatus(msg.id, msg.isRead)} className="text-sm text-blue-500">
                {msg.isRead ? 'Mark as Unread' : 'Mark as Read'}
              </button>
            </div>
            <p className="text-sm">{msg.email}</p>
            <p className="text-sm">{msg.phone}</p>
            <p>{msg.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Inbox;