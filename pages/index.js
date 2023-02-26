import { Fragment } from 'react'
import Head from 'next/head'
import { MongoClient } from 'mongodb'
import MeetupList from "@/components/meetups/MeetupList"

// const DUMMY_MEETUPS = [
//   {
//     id: "m1",
//     title: "This is a first meetup",
//     image:
//       "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Stadtbild_M%C3%BCnchen.jpg/2560px-Stadtbild_M%C3%BCnchen.jpg",
//     address: "Meetupstreet 5, 12345 Meetup City",
//     description:
//       "This is a first, amazing meetup which you definitely should not miss. It will be a lot of fun!",
//   },
//   {
//     id: "m2",
//     title: "This is a second meetup",
//     image:
//       "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Stadtbild_M%C3%BCnchen.jpg/2560px-Stadtbild_M%C3%BCnchen.jpg",
//     address: "Meetupstreet 5, 12345 Meetup City",
//     description:
//       "This is a first, amazing meetup which you definitely should not miss. It will be a lot of fun!",
//   },
// ];

// the below props is from getStaticProps function
const HomePage = (props) => {
  return (
    <Fragment>
      <Head>
        <title>React Meetups</title>
        <meta name='description' content='Browse a huge list of highly active React meetups!' />
      </Head>
      <MeetupList meetups={props.meetups}/>
    </Fragment>
  )
}

export async function getStaticProps(){
  // fetch data from an API. data will be pre-rendering in the server-side, during the build process
  const client = await MongoClient.connect('mongodb+srv://dquangxyz:12344321@cluster0.feme6.mongodb.net/meetups?retryWrites=true&w=majority')
  const db = client.db()
  const meetupsCollection = db.collection('meetups')
  const DUMMY_MEETUPS_FROM_CLOUD = await meetupsCollection.find().toArray()
  client.close()

  // always must return an object, and must have 'props'
  return {
    props: { 
      meetups: DUMMY_MEETUPS_FROM_CLOUD.map(item => { 
        return {
          id: item._id.toString(),
          title: item.title,
          image: item.image,
          address: item.address,
          description: item.description
        }
      }) 
    },
    revalidate: 1 // re-generate this page after how many seconds if there are incoming requests for this page
  }
}

// // this will not running during the build process, but on the server after the deployment on every request
// export async function getServerSideProps(context){
//   const req =  context.req
//   const res = context.res

//   console.log(res)
//   console.log(req)
//   return {
//     props: { meetups: DUMMY_MEETUPS }
//   }
// }

export default HomePage
