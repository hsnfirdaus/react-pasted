import React from 'react';
import styles from '@styles/loading.module.css';
export default function Loading(props){
	return (
		<div className={props.load===true?styles.backdropBlockShow:styles.backdropBlock}>
			<div className={styles.vhCenter}>
				<div className={styles.loaderLogo}><span>&#123;</span>PASTED<span>&#125;</span></div>
				<div className={styles.loadingContainer}><div className={styles.loadingContent}></div></div>
			</div>
		</div>
	);
}