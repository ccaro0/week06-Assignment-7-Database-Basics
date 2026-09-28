// Bring in CSS Module class names (hashed at build time) from utils.module.css
import utilStyles from '../../styles/utils.module.css';
// Bring in Next.js Head so this page can set the browser tab title
import Head from 'next/head';
// Bring in the shared Layout wrapper used around the post content
import Layout from '../../components/layout';
// Bring in helpers: getAllPostIds lists every post, getPostData loads one post
import { getAllPostIds, getPostData } from '../../lib/posts-json';
// Bring in the Date component that formats a post's date string
import Date from '../../components/date';

// The Post page component; postData is the object from getStaticProps for this id
export default function Post({ postData }) {
    // Give React the JSX tree to display for this post
    return (
      <Layout>
        <Head>
          <title>{postData.title}</title>
        </Head>
        <article className={utilStyles.backgroundC}>


          <h1 className={utilStyles.headingXl}>{postData.title}</h1>

          <div className={utilStyles.lightText}>
            <Date dateString={postData.date} />
          </div>

          <div className={utilStyles.secondHeading}>
          <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />            
          </div>

          
          <h2 className={utilStyles.secondHeading}>Climate</h2>
            <p className={utilStyles.lighterText}>{postData.climate}</p>

          <h2 className={utilStyles.secondHeading}>Attractions</h2>
            <p className={utilStyles.lighterText}>{postData.attractions}</p>


        </article>
      </Layout>
    );
  }
//line 27 move to top of DIV or outside of DIV and create a new class for the colors maybe of the text maybe


// Next.js calls this at build time to learn which /posts/[id] URLs to pre-render
export async function getStaticPaths() {
  // Build the list of path objects, each shaped like { params: { id: 'file-name' } }
  const paths = getAllPostIds();
  // Tell Next.js which routes exist and how to handle unknown ids
  return {
    // Same as paths: paths — each entry becomes a static HTML page
    paths,
    // Unknown ids show a 404 instead of generating a page at request time
    fallback: false,
  };
}

// Next.js calls this at build time for each path; params.id is the markdown file name
export async function getStaticProps({ params }) {
    // Wait for the markdown to be read, parsed, and converted to HTML for this id
    const postData = await getPostData(params.id);
   
    // Send that post object back to Next.js so it can pass it into Post
    return {
      // props is the object Next.js injects as arguments to Post
      props: {
        // Same as postData: postData — Post will receive title, date, and contentHtml
        postData,
      },
    };
  }
