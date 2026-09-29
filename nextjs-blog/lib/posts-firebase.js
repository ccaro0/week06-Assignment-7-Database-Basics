import { db } from './firebase';
import { collection, getDocs, query, where, documentId } from 'firebase/firestore';


export async function getSortedPostsData() {
    const postsReference = collection(db, "posts");
    const querySnapshot = await getDocs(postsReference);
    const jsonObj = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    jsonObj.sort(function (a, b) {
        return a.title.localeCompare(b.title);
    });

    return jsonObj.map(item => {
        return {
            id: item.id.toString(),
            title: item.title,
            date: item.date,

        }
    });
}

export async function getAllPostIds() {
    const postsReference = collection(db, 'posts');
    const querySnapshot = await getDocs(postsReference);
    const jsonObj = querySnapshot.docs.map(doc => ({ id: doc.id }));
    return jsonObj.map(item => {
        return {
            params: {
            id: item.id.toString()
            }
        }
    });
}

export async function getPostData(id) {
    const postsReference = collection(db, 'posts');
    const searchQuery = query(postsReference, 
        where(documentId(), '==', id));
    const querySnapshot = await getDocs(searchQuery);
    const jsonObj = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    if (jsonObj.length === 0) {
        return {
            id: id,
            title: 'Nothing here to see',
            date: '',
            contentHtml: 'Not quite what you were looking for',
            climate: 'None found',
            attractions: 'Nope',
        }
    } else {
        return jsonObj[0];
    }
}