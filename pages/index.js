import Image from 'next/image'
import Link from 'next/link'

import styles from '../styles/Home.module.css'

import { useState, useEffect } from 'react'

import styled from 'styled-components'

export default function Home() {
  let [query, setQuery] = useState('');
  let [isAuthed, setAuthed] = useState(false);

  const authURL =  
    `https://api.genius.com/oauth/authorize?` +
    `client_id=${process.env.NEXT_PUBLIC_CLIENT_ID}&` +
    `redirect_uri=${process.env.NEXT_PUBLIC_REDIRECT_URI}&` +
    `scope=me&` +
    `response_type=token`

  useEffect(() => {
    console.log(window.location.href);
    if (window.location.href.includes('access_token')) {
      console.log('authed!');
      setAuthed(true)
    }
  }, [])

  async function getSearchQuery(e) {
    e.preventDefault()

    // make api call
    let res = await fetch(
      `https://api.genius.com/search?q=${query}`, 
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_AUTH_TOKEN}`
        }
      }
    )
  }
  
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to Artisté Finder!
        </h1>
        {!isAuthed && 
          <Link href={authURL}>
            <CallToAction>Authenticate with Genius API</CallToAction>
          </Link>
        }
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}

const CallToAction = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  border-radius: 8px;
  background-color: #008eff;
  color: whitesmoke;
  cursor: pointer;
  margin-top: 30px;

  :hover {
    background-color: #9e4fe3;
  }
`;
