import React from 'react';
import styles from '@styles/header.module.css';
import { Link } from 'react-router-dom';
import { Plus } from 'react-feather';

export default function Header(){
	return (
		<header className={styles.header}>
			<div className="wrapper">
				<div className={styles.grid}>
					<Link to="/"><h1 className={styles.heading}><span>&#123;</span>PASTED<span>&#125;</span></h1></Link>
					<div className={styles.right}>
						<Link to="/" className={styles.newBtn}><Plus /> Buat Baru</Link>
					</div>
				</div>
			</div>
		</header>
	)
}