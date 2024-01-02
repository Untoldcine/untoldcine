'use client';
import Image from 'next/image'
import styles from './page.module.css'
import { useEffect, useState } from 'react';

export default function Home() {
  const [data, setData] = useState(null);
  useEffect(() => {
  	fetch('http://localhost:3001/api/hello')
  	.then((res) => res.json())
	.then((res) => setData(res.message));
	}, []);
  return (
    <main className={styles.main}>
		  {data && <h1>{data}</h1>}
    </main>
  )
}
