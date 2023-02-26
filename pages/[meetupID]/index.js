import React, { Fragment } from 'react'
import Head from 'next/head'
import { MongoClient, ObjectId } from 'mongodb'
import MeetupDetail from '@/components/meetups/MeetupDetail'

const MeetupDetails = (props) => {
  return (
    <Fragment>
        <Head>
            <title>{props.meetupData.title}</title>
            <meta name='description' content={props.meetupData.description} />
        </Head>
        <MeetupDetail 
            image={props.meetupData.image}
            title={props.meetupData.title}
            address={props.meetupData.address}
            descritpion={props.meetupData.description}
        />
    </Fragment>
  )
}

// this is required for dynamic page and using getStaticProps
// because getStaticProps pre-generate the page during build process -> need to pregenerate all version of dynamic path [meetupId]
export async function getStaticPaths(){
    // connect to database
    const client = await MongoClient.connect('mongodb+srv://dquangxyz:12344321@cluster0.feme6.mongodb.net/meetups?retryWrites=true&w=majority')
    const db = client.db()
    const meetupsCollection = db.collection('meetups')
    const meetups_ID_arr = await meetupsCollection.find({}, {_id: 1}).toArray() // find all objects but only include _id field but not other fields
    client.close()
  
    return {
        fallback: false,
        paths: meetups_ID_arr.map(item => {
            return { params: {meetupID: item._id.toString()} }
        })
    }
}

export async function getStaticProps(context){
    // context.params is an object that has the property 'meetupId' which is inside [] in pages folder
    const meetupID = context.params.meetupID

    // connect to database
    const client = await MongoClient.connect('mongodb+srv://dquangxyz:12344321@cluster0.feme6.mongodb.net/meetups?retryWrites=true&w=majority')
    const db = client.db()
    const meetupsCollection = db.collection('meetups')
    const selectedMeetup = await meetupsCollection.findOne({_id: new ObjectId(meetupID)}) // find the meetup object that match _id
    client.close()

    return {
        props: { 
            meetupData: {
                id: selectedMeetup._id.toString(),
                image: selectedMeetup.image,
                title: selectedMeetup.title,
                address: selectedMeetup.address,
                description: selectedMeetup.description
            }
        }
    }
}

export default MeetupDetails