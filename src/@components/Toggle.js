import React from 'react';
import styles from '@styles/toggle.module.css';

export default function Toggle({options,selected,onChange}){
	return (
		<div className={styles.container}>
			{options.map((item,index)=>(
				<div
				key={index}
				onClick={()=>{
					onChange(item.value);
				}}
				className={selected===item.value?styles.active:styles.item}>
					{item.label}
				</div>
			))}
		</div>
	)
}