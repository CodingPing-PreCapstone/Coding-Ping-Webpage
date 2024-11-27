import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  doc
} from "firebase/firestore";

// Firebase 클라이언트 SDK 설정
const firebaseConfig = {
  apiKey: "AIzaSyDDjI5aDVNPBrVfeKP4HMkhSE_h4-4Jq_Q",
  authDomain: "flightinfo-46895.firebaseapp.com",
  projectId: "flightinfo-46895",
  storageBucket: "flightinfo-46895.appspot.com",
  messagingSenderId: "910137329736",
  appId: "1:910137329736:web:e2d9ce78d41c8d928bb07d"
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

class FirestoreCollection {
  constructor(collectionName) {
    this.collectionName = collectionName;
    this.collection = collection(db, collectionName);
  }

  async userExists(user) {
    try {
      const q = query(this.collection, where("user", "==", user));
      const snapshot = await getDocs(q);
      return !snapshot.empty;
    } catch (error) {
      console.error("Error checking user existence:", error);
      return false;
    }
  }

  async create(data) {
    const user = data.user;
    try {
      const q = query(this.collection, where("user", "==", user));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        console.log(`${this.collectionName} entry for this user already exists!`);
        return null;
      }

      await setDoc(doc(this.collection), data); // 새로운 도큐먼트 생성
      console.log(`${this.collectionName} document created successfully`);
    } catch (error) {
      console.error("Error creating document:", error);
    }
  }

  async read(user) {
    try {
      const q = query(this.collection, where("user", "==", user));
      const snapshot = await getDocs(q);
      const results = [];
      snapshot.forEach((doc) => {
        results.push({ id: doc.id, ...doc.data() });
      });
      return results;
    } catch (error) {
      console.error("Error reading documents:", error);
      return [];
    }
  }

async update(user, updates) {
    try {
        const q = query(this.collection, where("user", "==", user));
        const snapshot = await getDocs(q);

        snapshot.forEach(async (doc) => {
            // 배열 필드일 경우에도 배열 자체를 덮어쓰기
            await updateDoc(doc.ref, updates);
        });

        console.log(`${this.collectionName} document updated successfully`);
    } catch (error) {
        console.error("Error updating document:", error);
    }
}


  async delete(user) {
    try {
      const q = query(this.collection, where("user", "==", user));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        console.log(`No document found for user: ${user}`);
        return;
      }

      snapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });

      console.log(`${this.collectionName} document deleted successfully`);
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  }
   
  async addMessageToArray(user, message) {
  try {
    const q = query(this.collection, where("user", "==", user));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      console.error("해당 user에 해당하는 문서를 찾을 수 없습니다.");
      return false;
    }

    snapshot.forEach(async (doc) => {
      const docData = doc.data();
      const currentArray = docData.latestMessageArray || [];

      // 입력 메시지와 중복되는 항목 제거
      const filteredArray = currentArray.filter((item) => item !== message);

      // 입력 메시지 추가
      const updatedArray = [...filteredArray, message];

      // 배열 길이를 10개로 제한
      const limitedArray = updatedArray.slice(-10);

      // Firestore에 업데이트
      await updateDoc(doc.ref, {
        latestMessageArray: limitedArray,
      });
    });

    console.log(`user: ${user}의 latestMessageArray가 성공적으로 업데이트되었습니다.`);
    return true;
  } catch (error) {
    console.error("latestMessageArray를 업데이트하는 중 오류 발생:", error);
    return false;
  }
}

async getMessagesArray(user) {
    try {
      const q = query(this.collection, where("user", "==", user));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        console.error("해당 user에 해당하는 문서를 찾을 수 없습니다.");
        return [];
      }

      let messagesArray = [];
      snapshot.forEach((doc) => {
        const docData = doc.data();
        messagesArray = docData.latestMessageArray || [];
      });

      console.log(`user: ${user}의 latestMessageArray를 불러왔습니다.`);
      return messagesArray;
    } catch (error) {
      console.error("latestMessageArray를 불러오는 중 오류 발생:", error);
      return [];
    }
  }


}

export default FirestoreCollection;

