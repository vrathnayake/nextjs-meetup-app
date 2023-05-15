import { MongoClient, ObjectId } from "mongodb";
import MeetupDetail from "../../components/meetups/MeetupDetail";
import { Fragment } from "react";
import Head from "next/head";

function MeetupDetails(props) {
  return (
    <Fragment>
      <Head>
        <title>{props.meetupData.title}</title>
      </Head>
      <MeetupDetail
        image={props.meetupData.image}
        title={props.meetupData.title}
        address={props.meetupData.address}
        description={props.meetupData.description}
      />
    </Fragment>
  );
}

//to tell next js which pages to be regenerated on the serverside. Because it doesn't know which id user
//might endter and so every page(or the ones you choose) has to be regenerated. With the fallback
//you can let some of the pages(eg: not visited frequently) to be generated dynamically.
export async function getStaticPaths() {
  const client = await MongoClient.connect(
    "mongodb+srv://vrathnayake:nzCZ7EJ4AGF2jg6w@cluster0.pjelkrc.mongodb.net/meetups?retryWrites=true&w=majority"
  );
  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray();
  client.close();

  return {
    fallback: false, //false: I have defined all posoble paths so if user enters anything that is not in the list, show 404
    paths: meetups.map((meetup) => ({
      params: { meetupId: meetup._id.toString() },
    })),
  };
}

export async function getStaticProps(context) {
  // fetch data for a single meetup

  const meetupId = context.params.meetupId;

  console.log("***", meetupId); //not in the client console, but dev console.
  const client = await MongoClient.connect(
    "mongodb+srv://vrathnayake:nzCZ7EJ4AGF2jg6w@cluster0.pjelkrc.mongodb.net/meetups?retryWrites=true&w=majority"
  );
  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  const selectedMeetup = await meetupsCollection.findOne({
    _id: new ObjectId(meetupId),
  });

  client.close();
  return {
    props: {
      meetupData: {
        id: selectedMeetup._id.toString(),
        title: selectedMeetup.title,
        address: selectedMeetup.address,
        image: selectedMeetup.image,
        description: selectedMeetup.description,
      },
    },
  };
}

export default MeetupDetails;
