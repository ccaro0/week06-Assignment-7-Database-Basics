// Bring in Next.js Head so this page can set the browser tab title
import Head from 'next/head';
// Bring in the shared Layout wrapper and the siteTitle string from layout.js
import Layout, { siteTitle } from '../components/layout';
// Bring in CSS Module class names (hashed at build time) from utils.module.css
import utilStyles from '../styles/utils.module.css';
// Bring in the helper that reads markdown files and returns posts sorted by date
import { getSortedPostsData } from '../lib/posts-json';
// Bring in Next.js Link for client-side navigation between pages
import Link from 'next/link';
// Bring in the Date component that formats a post's date string
import Date from '../components/date';


 
// Next.js calls this at build time to load data before the Home page is rendered
export async function getStaticProps() {
  // Read every markdown post and get an array of { id, date, title } objects
  const allPostsData = getSortedPostsData();
  // Send that array back to Next.js so it can pass it into the Home component
  return {
    // props is the object Next.js injects as arguments to Home
    props: {
      // Same as allPostsData: allPostsData — Home will receive this as a prop
      allPostsData,
    },
  };
}
// The Home page component; allPostsData is the array from getStaticProps
export default function Home({ allPostsData }) {
  // Give React the JSX tree to display for the home page
  return (
    <Layout home>
      <Head>
        <title> Next.js Blog by Caro</title>
      </Head>
      {/* className={utilStyles.headingMd} does not come from a global CSS file as a
          plain string. utilStyles is the object imported from ../styles/utils.module.css
          (a CSS Module). headingMd is the .headingMd class defined in that file (font-size
          1.2rem, etc.). Next.js turns it into a unique hashed class name at build time so
          it will not collide with other styles. The curly braces mean "use this JS value
          as the class name" instead of a hardcoded string like "headingMd". */}
      <section className={utilStyles.headingMd}>
        <p>Hello, I'm Caro and this is my first blog!</p>
        <p>
          (This is a sample website - you’ll be building a site like this on{' '}
          <a href="https://nextjs.org/learn">our Next.js tutorial</a>.)
        </p>
      </section>
      {/* Add this <section> tag below the existing <section> tag */}
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Blog</h2>
        <ul className={utilStyles.list}>
          {allPostsData.map(({ id, date, title }) => ( // For each post, pull id, date, and title and render one list item
            <li className={utilStyles.listItem} key={id}>
            <Link href={`/posts/${id}`}>{title}</Link>
            <br />
            <small className={utilStyles.lightText}>
              <Date dateString={date} />
            </small>
          </li>
          ))}
        </ul>
      </section>
    </Layout>
  );
}
