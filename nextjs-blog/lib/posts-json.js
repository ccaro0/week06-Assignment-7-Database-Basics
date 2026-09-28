// Bring in Node's file-system module so this file can read posts.json from disk
import fs from 'fs';
// Bring in Node's path module so folder and file names can be joined into one path
import path from 'path';

// Build the absolute path to the data folder, starting from the project root
const directoryData = path.join(process.cwd(), 'data');

// Return every post from posts.json, sorted by title, with only the fields the home page lists
export function getSortedPostsData() {
    // Build the full path to data/posts.json
    const filePath = path.join(directoryData, 'posts.json');
    // Read that file as a UTF-8 text string
    const jsonString = fs.readFileSync(filePath, 'utf8');
    // Turn the JSON text into a JavaScript array of post objects
    const jsonObj = JSON.parse(jsonString);
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
          date: item.date
        }
      });
}

// Return the list of { params: { id } } objects Next.js needs for getStaticPaths
export function getAllPostIds() {
    // Build the full path to data/posts.json
    const filePath = path.join(directoryData, 'posts.json');
    // Read that file as a UTF-8 text string
    const jsonString = fs.readFileSync(filePath, 'utf8');
    // Turn the JSON text into a JavaScript array of post objects
    const jsonObj = JSON.parse(jsonString);
    // Print the parsed array in the terminal so you can see what was loaded
    console.log(jsonObj);
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
export function getPostData(id) {
    // Build the full path to data/posts.json
    const filePath = path.join(directoryData, 'posts.json');
    // Read that file as a UTF-8 text string
    const jsonString = fs.readFileSync(filePath, 'utf8');
    // Turn the JSON text into a JavaScript array of post objects
    const jsonObj = JSON.parse(jsonString);
    // Keep only the posts whose id matches the id from the URL
    const objReturned = jsonObj.filter(obj => {
        // Compare both ids as strings so a numeric id still matches the route param
        return obj.id.toString() === id;
      });
      // If the filter found nothing, return placeholder fields instead of crashing
      if (objReturned.length === 0) {
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
        // A match was found, so return that first (and only) post object
        return objReturned[0];
      }
}
