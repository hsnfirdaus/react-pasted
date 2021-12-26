import React, {
	useState,
	useEffect
} from 'react';
import styles from '@styles/home.module.css';
import {
	ChevronLeft,
	ChevronRight,
	FileText,
	Clipboard,
	Plus
} from 'react-feather';
import Toggle from '@components/Toggle';
import {
	useAlert
} from 'react-alert';
import config from '@const/config';
import {
	Link,
	useNavigate
} from 'react-router-dom';
import Loading from '@components/Loading';
import AceEditor from 'react-ace';

import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/mode-html';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-php';
import 'ace-builds/src-noconflict/mode-css';

export default function Home(){
	const alert=useAlert();
	const navigate=useNavigate();

	const [loading,setLoading]=useState(false);

	const [page, setPage]=useState(1);
	const [totalPage, setTotalPage]=useState(1);

	const [formData, setFormData]=useState({
		title:'',
		content:'',
		syntax:'',
		password:'',
		public:true
	});
	const [listPasted,setListPasted]=useState(null);
	useEffect(()=>{
		document.title="Pasted";
		setLoading(true);
		fetch(config.API+'/pasted?page='+page)
		.then(r=>r.json())
		.then(j=>{
			setListPasted(j.result);
			setTotalPage(j.total);
		})
		.catch(err=>{
			alert.error(err.message);
		})
		.finally(()=>setLoading(false));
	},[page]);
	const handleSubmit=(ev)=>{
		ev.preventDefault();
		setLoading(true);
		fetch(config.API+'/pasted',{
			method:'POST',
			headers:{
				'Content-Type':'application/json'
			},
			body:JSON.stringify(formData)
		})
		.then(r=>r.json())
		.then(j=>{
			if(j.error){
				alert.error(j.error);
			}else{
				navigate('/'+j.id);
			}
		})
		.catch(err=>{
			alert.error(err.message);
		})
		.finally(()=>setLoading(false));
	}
	const handleChange=(ev)=>{
		setFormData({
			...formData,
			[ev.target.name]:ev.target.value
		})
	}
	return (
		<section>
			<div className="wrapper">
				<div className={styles.homeGrid}>
					<main>
						<h2><Clipboard /> Pasted Baru</h2>
						<fieldset>
							<label htmlFor="title">Judul</label>
							<input type="text" name="title" value={formData.title} onChange={handleChange} />
						</fieldset>
						<fieldset>
							<label htmlFor="content">Konten</label>
							<AceEditor
							mode={formData.syntax}
							value={formData.content}
							theme="monokai"
							onChange={(val)=>setFormData({...formData,content:val})}
							name="content"
							fontSize={14}
							showPrintMargin={false}
							/>
						</fieldset>
						<fieldset>
							<label htmlFor="syntax">Syntax Highlight</label>
							<select name="syntax" value={formData.syntax} onChange={handleChange}>
								<option value="">Tidak Ada</option>
								<option value="php">PHP</option>
								<option value="html">HTML</option>
								<option value="css">CSS</option>
								<option value="javascript">Javascript</option>
							</select>
						</fieldset>
						<fieldset>
							<label htmlFor="public">Visibilitas</label>
							<Toggle
							selected={formData.public}
							onChange={(val)=>setFormData({...formData,public:val})}
							options={[
								{
									label:'Publik',
									value:true
								},
								{
									label:'Private',
									value:false
								}
							]}/>
						</fieldset>
						<fieldset>
							<label htmlFor="password">Password</label>
							<input type="text" name="password" value={formData.password}  onChange={handleChange} />
						</fieldset>
						<button className="button" onClick={handleSubmit}><Plus /> Tambahkan</button>
					</main>
					<aside>
						<h2>Terbaru</h2>
						{listPasted?listPasted.map((item,index)=>(
							<div key={index} className={styles.card}>
								<div className={styles.icon}>
									<FileText/>
								</div>
								<div className={styles.info}>
									<Link className={styles.title} to={"/"+item.id}>{item.title}</Link>
									<small className={styles.meta}>{item.syntax} {new Date(item.created).toLocaleString('id-ID',{
							            weekday: 'short',
							            year: 'numeric',
							            month: 'short',
							            day: 'numeric',
							            hour12:false,
							            hour:'2-digit',
							            minute:'2-digit'
							        })}</small>
								</div>
							</div>
						)):<></>}
						<div className={styles.pagingContainer}>
							<div>
								{page>1?<button onClick={()=>setPage(page-1)} className={styles.prevBtn}><ChevronLeft/></button>:<></>}
							</div>
							<div><button className={styles.currentPage}>{page}</button></div>
							<div>
								{page<totalPage?<button onClick={()=>setPage(page+1)} className={styles.nextBtn}><ChevronRight/></button>:<></>}
							</div>
						</div>
					</aside>
				</div>
			</div>
			<Loading load={loading}/>
		</section>
	)
}