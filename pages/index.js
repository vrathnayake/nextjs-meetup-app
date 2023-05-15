import { Fragment } from "react";
import Head from "next/head";
import { MongoClient } from "mongodb";
import MeetupList from "../components/meetups/MeetupList";

function HomePage(props) {
  return(
  <Fragment>
    {/* can add a head to all pages */}
    <Head>
      <title>Next Meetups</title>
      <meta
        name="description"
        content="Browse a huge list of highly active React meetups!"
      />
    </Head>
    <MeetupList meetups={props.meetups} />
  </Fragment>
  );
}

//function provided by nextjs. This will execute before pre-rendering(or at build process) and would execute before the page component.
//this will execute on the server side and will never get sent to the client/browser.
export async function getStaticProps() {
  // fetch data from an API
  const client = await MongoClient.connect(
    "mongodb+srv://vrathnayake:nzCZ7EJ4AGF2jg6w@cluster0.pjelkrc.mongodb.net/meetups?retryWrites=true&w=majority"
  );
  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  const meetups = await meetupsCollection.find().toArray();

  client.close();

  return {
    props: {
      meetups: meetups.map((meetup) => ({
        title: meetup.title,
        address: meetup.address,
        image: meetup.image,
        id: meetup._id.toString(),
      })),
    },
    revalidate: 1,
  };
}

////if you want the page to be regenerated for every incoming request. still runs on the server
//   export async function getServerSideProps(context){
//     const req = context.req;
//     const res = context.res;
//     //fetch data from API
//     return {
//         props: {
//           meetups: DUMMY_MEETUPS
//         }
//       };
//   }

export default HomePage;
