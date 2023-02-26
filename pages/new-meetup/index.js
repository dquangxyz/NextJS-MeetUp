import { useRouter } from "next/router"
import { Fragment } from 'react'
import Head from "next/head"
import NewMeetupForm from "@/components/meetups/NewMeetupForm"

const NewMeetupPage = () => {
    const router = useRouter()

    const addMeetupHandler = async (dataFromChild)=>{
        const res = await fetch('/api/new-meetup', {
            method: 'POST',
            body: JSON.stringify(dataFromChild),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        const data = await res.json()

        console.log(data)
        router.push('/')
    }
    return (
        <Fragment>
            <Head>
                <title>Add new Meetups</title>
                <meta name='description' content='Add your own meetups' />
            </Head>
            <NewMeetupForm onAddMeetup={addMeetupHandler}/>
        </Fragment>
    )
}

export default NewMeetupPage