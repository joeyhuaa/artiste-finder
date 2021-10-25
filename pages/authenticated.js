import React, { useState, useEffect } from 'react'
import styles from '../styles/Home.module.css'

import styled from 'styled-components'

import Link from 'next/link'

export default function Authenticated() {
  let [query, setQuery] = useState('')
  let [songs, setSongs] = useState(null)
  let [authToken, setAuthToken] = useState('')

  const apiUrl = `https://api.genius.com`

  useEffect(() => {
    let url = window.location.href
    let authToken = url.split('#')[1].split(/=|&/)[1]
    setAuthToken(authToken)
  }, [])

  async function getSearchQuery(e) {
    e.preventDefault()

    // * 0) clear previous state
    setSongs([])

    // * 1) search endpoint
    let res = await fetch(
      `${apiUrl}/search?access_token=${authToken}&q=${query}`, 
      {
        method: 'GET',
      }
    )
    let data = await res.json()
    let queryHits = data.response.hits

    // * 2) get artist ID
    // * hits -> result -> primary artist -> id
    let primaryArtistID = queryHits[0]?.result?.primary_artist?.id
    console.log(primaryArtistID)

    // * 3) get all songs of that artist
    res = await fetch(
      `${apiUrl}/artists/${primaryArtistID}/songs?access_token=${authToken}&per_page=50`, // can't go over 50 per page...
      {
        method: 'GET'
      }
    )

    data = await res.json()
    console.log(data)
    setSongs(data?.response?.songs)
  }

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to Artisté Finder!
        </h1>
      </main>

      <form onSubmit={getSearchQuery}>
        <MainLabel>
          Search by artist name:
        </MainLabel>
        <Input
          type='text'
          placeholder='Search Genius API...'
          value={query}
          onChange={e => {
            setQuery(e.target.value)
          }}
        />
      </form>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        width: '800px',
        height: '100%',
        backgroundColor: 'lavender',
        marginTop:'40px',
        padding:'30px',
        overflow: 'auto',
        alignItems: 'center',
      }}>
        {songs?.map((song, idx) => {
          return (
            <Song>
              <Circle>{idx + 1}</Circle>
              <MainLabel>{song.full_title}</MainLabel>
              <SubLabel>{song.api_path}</SubLabel>
              <SubLabel style={{ color: '#008eff' }}>
                <Link href={`https://genius.com/${song.path}`}>{song.path}</Link>
              </SubLabel>
            </Song>
          )
        })}
        {songs?.length === 0 && <Loading />}
        {!songs && <SubLabel>Search for your fav artist ;)</SubLabel>}
      </div>
    </div>
  )
}

const Input = styled.input`
  width: 300px;
  height: 30px;
  margin-bottom: 5px;
  padding: 10px;
  background-color: whitesmoke;
  outline: none;
  border: solid 1px lavender;
`;

const Song = styled.div`
  width: 80%;
  display: flex;
  flex-direction: column;
  padding: 30px;
  border-bottom: solid 1px gray;
  position: relative;
`;

const Circle = styled.div`
  height: 25px;
  width: 25px;
  background-color: #bbb;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  left: -10px;
  font-size: 12px;
`;

const MainLabel = styled.span`
  font-weight: bold;
  margin-right: 10px;
`;

const SubLabel = styled.span`
  margin-right: 10px;
  color: #3d474a;
  margin-top: 5px;
`;

const Loading = styled.div`
  position: absolute;
  top: calc(50% - 4em);
  left: calc(50% - 4em);
  width: 6em;
  height: 6em;
  border: 9px solid black;
  border-left: 1.1em solid black;
  border-radius: 50%;
  animation: loadspinner 1.1s infinite linear;

  @keyframes loadspinner {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;