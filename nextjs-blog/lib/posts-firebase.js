// Bring in the Firestore database connection created in firebase.js
import { db } from './firebase';
// Bring in Firestore helpers: collection picks a collection, getDocs reads documents,
// query and where build a filter, and documentId targets a document's own id
import { collection, getDocs, query, where, documentId } from 'firebase/firestore';

// Return every post from the posts collection, sorted by title, with only the fields the home page lists
export async function getSortedPostsData() {
    // Point at the posts collection in Firestore
    const postsReference = collection(db, "posts");
    // Wait for every document in that collection
    const querySnapshot = await getDocs(postsReference);
    // Turn each document into a plain object that includes its id and all of its fields
    const jsonObj = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Sort that array in place by title, A to Z
    jsonObj.sort(function (a, b) {
        // Compare the two titles and return the order localeCompare decides
        return a.title.localeCompare(b.title);
    });

    // Build a new array that keeps only the fields the home page renders
    return jsonObj.map(item => {
        // Return one slim object for this post
        return {
            // Store the id as a string so it matches the [id] route param
            id: item.id.toString(),
            // Keep the post title for the home-page link text
            title: item.title,
            // Keep the post date for the home-page date line
            date: item.date,
        }
    });
}

// Return the list of { params: { id } } objects Next.js needs for getStaticPaths
export async function getAllPostIds() {
    // Point at the posts collection in Firestore
    const postsReference = collection(db, 'posts');
    // Wait for every document in that collection
    const querySnapshot = await getDocs(postsReference);
    // Keep only each document's id
    const jsonObj = querySnapshot.docs.map(doc => ({ id: doc.id }));
    // Turn each post into the path shape Next.js expects
    return jsonObj.map(item => {
        // Return one path entry for this post
        return {
            // params is the object Next.js passes into getStaticProps
            params: {
            // Use the post id as a string; it becomes the [id] part of /posts/[id]
            id: item.id.toString()
            }
        }
    });
}

// Find one post by id and return it, or a placeholder object if that id is missing
export async function getPostData(id) {
    // Point at the posts collection in Firestore
    const postsReference = collection(db, 'posts');
    // Build a query that matches the document whose id equals the id from the URL
    const searchQuery = query(postsReference, 
        where(documentId(), '==', id));
    // Wait for the documents that match that query
    const querySnapshot = await getDocs(searchQuery);
    // Turn each matching document into a plain object with its id and fields
    const jsonObj = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // If the query found nothing, return placeholder fields instead of crashing
    if (jsonObj.length === 0) {
        // Return the stand-in post the page can still render
        return {
            // Keep the requested id so the page knows which route missed
            id: id,
            // Placeholder title shown when no post matches
            title: 'Nothing here to see',
            // Empty date so the missing post has no date to format
            date: '',
            // Placeholder HTML body shown in the content area
            contentHtml: 'Not quite what you were looking for',
            // Placeholder climate shown in the climate section
            climate: 'None found',
            // Placeholder attractions shown in the attractions section
            attractions: 'Nope',
        }
    } else {
        // A match was found, so return that first post object
        return jsonObj[0];
    }
}
