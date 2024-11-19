import { initializeApp } from "firebase/app";
import {
    getFirestore,
    collection,
    query,
    where,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    arrayUnion
} from "firebase/firestore";

// Firebase 클라이언트 SDK 설정 (Firebase 콘솔에서 가져온 설정으로 변경하세요)
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
        if (await this.userExists(user)) {
            console.log(`${this.collectionName} entry for this user already exists!`);
            return null;
        }
        try {
            const docRef = await addDoc(this.collection, data);
            console.log(`${this.collectionName} document created successfully`);
            return docRef;
        } catch (error) {
            console.error("Error creating document:", error);
            return null;
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
                // 배열 업데이트
                const updatedFields = Object.keys(updates).reduce((acc, key) => {
                    acc[key] = Array.isArray(updates[key])
                        ? arrayUnion(...updates[key]) // 배열일 경우 arrayUnion 사용
                        : updates[key];
                    return acc;
                }, {});
                await updateDoc(doc.ref, updatedFields);
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
            snapshot.forEach(async (doc) => {
                await deleteDoc(doc.ref);
            });
            console.log(`${this.collectionName} document deleted successfully`);
        } catch (error) {
            console.error("Error deleting document:", error);
        }
    }


    async uploadImage(imageName, imageFile, completion) {
        try {
            const storage = getStorage();
            // Firebase Storage의 레퍼런스 생성
            const storageRef = ref(storage, `cities/${imageName}`);

            // 이미지 데이터를 업로드
            await uploadBytes(storageRef, imageFile, {
                contentType: "image/jpeg", // 데이터 타입 설정
            });

            console.log("Image uploaded successfully:", imageName);
            completion(); // 완료 콜백 호출
        } catch (error) {
            console.error("Error uploading image:", error);
        }
    }

    // 이미지 다운로드 함수
    async downloadImage(imageName, completion) {
        try {
            const storage = getStorage();
            // Firebase Storage의 레퍼런스 생성
            const storageRef = ref(storage, `cities/${imageName}`);

            // 이미지 다운로드 URL 가져오기
            const url = await getDownloadURL(storageRef);

            // 이미지 로드
            const response = await fetch(url);
            const blob = await response.blob();
            const image = URL.createObjectURL(blob);

            console.log("Image downloaded successfully:", imageName);
            completion(image); // 이미지 객체 콜백 호출
        } catch (error) {
            console.error("Error downloading image:", error);
            completion(null); // 실패 시 null 반환
        }
    }
}

export default FirestoreCollection;