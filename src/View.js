import React, {
	useState,
	useEffect
} from 'react';
import styles from '@styles/home.module.css';
import {
	Copy,
	Download,
	Lock,
	Clock,
	Code,
	FileText
} from 'react-feather';
import {
	useAlert
} from 'react-alert';
import config from '@const/config';
import {
	Link,
	useParams
} from 'react-router-dom';
import Loading from '@components/Loading';
import AceEditor from 'react-ace';

import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/mode-html';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-php';
import 'ace-builds/src-noconflict/mode-css';

export default function View(){
	const alert=useAlert();
	const {id}=useParams();

	const [password,setPassword]=useState("");
	const [content,setContent]=useState(null);

	const [loading,setLoading]=useState(false);

	const [pasted,setPasted]=useState(null);
	useEffect(()=>{
		fetch(config.API+'/pasted/'+id)
		.then(r=>r.json())
		.then(j=>{
			document.title=j.title+" | Pasted";
			setPasted(j);
			if(j.protected===false){
				loadContent();
			}
		})
		.catch(err=>{
			alert.error(err.message);
		});
	},[]);
	const loadContent=()=>{
		fetch(config.API+'/pasted/'+id+'/content',password?{
			method:'POST',
			headers:{
				'Content-Type':'application/json'
			},
			body:JSON.stringify({password:password})
		}:{})
		.then(r=>r.json())
		.then(j=>{
			if(j.error){
				alert.error(j.message);
			}else{
				setContent(j.content);
			}
		})
		.catch(err=>{
			alert.error(err.message);
		})
		.finally(()=>setLoading(false));
	}
	const doDownload=()=>{
	  var element = document.createElement('a');
	  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
	  element.setAttribute('download', pasted.title);

	  element.style.display = 'none';
	  document.body.appendChild(element);

	  element.click();

	  document.body.removeChild(element);
	}

	const fallbackCopyTextToClipboard=()=>{
	  var textArea = document.createElement("textarea");
	  textArea.value = content;
	  
	  textArea.style.top = "0";
	  textArea.style.left = "0";
	  textArea.style.position = "fixed";

	  document.body.appendChild(textArea);
	  textArea.focus();
	  textArea.select();

	  try {
	    var successful = document.execCommand('copy');
	    if(successful){
	    	alert.success("Konten disalin ke clipboard!");
	    }else{
	    	alert.error("Gagal menyalin konten!");
	    }
	  } catch (err) {
	    alert.error("Gagal menyalin konten!");
	  }
	  document.body.removeChild(textArea);
	}
	const copyTextToClipboard=()=>{
	  if (!navigator.clipboard) {
	    fallbackCopyTextToClipboard();
	    return;
	  }
	  navigator.clipboard.writeText(content).then(function() {
	    alert.success("Konten disalin ke clipboard!");
	  }, (err)=>{
	    alert.error("Gagal menyalin konten!"+err);
	  });
	}
	return pasted?(
		<section>
			<div className="wrapper">
				<div className={styles.detailGrid}>
					<main>
						{content?(
							<fieldset>
								<AceEditor
								mode={pasted.syntax}
								value={content}
								theme="monokai"
								name="content"
								fontSize={14}
								showPrintMargin={false}
								setOptions={{
									readOnly:true
								}}
								/>
							</fieldset>
						):pasted.protected?(
							<>
								<div className={styles.card}>
									Pasted ini terproteksi dengan password, silahkan masukan password terlebih dahulu.
								</div>
								<fieldset>
									<label htmlFor="password">Password</label>
									<input type="text" name="password" value={password}  onChange={(ev)=>setPassword(ev.target.value)} />
								</fieldset>
								<button className="button" onClick={()=>{
									setLoading(true);
									loadContent();
								}}><Lock /> Buka</button>
							</>
						):<Loading load={true}/>}
					</main>
					<aside className={styles.detailGridFirst}>
						<h2><FileText /> {pasted.title}</h2>
						<div className={styles.card}>
							<div className={styles.icon}>
								<Clock />
							</div>
							<div className={styles.info}>
								{new Date(pasted.created).toLocaleString('id-ID',{
						            weekday: 'short',
						            year: 'numeric',
						            month: 'short',
						            day: 'numeric',
						            hour12:false,
						            hour:'2-digit',
						            minute:'2-digit'
						        })}
							</div>
						</div>
						{pasted.syntax?(
							<div className={styles.card}>
								<div className={styles.icon}>
									<Code />
								</div>
								<div className={styles.info}>
									{pasted.syntax}
								</div>
							</div>
						):<></>}
						{content?(
							<div className={styles.btnList}>
								<a href={config.RAW+''+id+''+(password?"?password="+password:"")} target="_blank" className={styles.btnItem}>
									<FileText />
									<span>Raw</span>
								</a>
								<button
								onClick={doDownload}
								className={styles.btnItem}>
									<Download />
									<span>Download</span>
								</button>
								<button
								onClick={copyTextToClipboard}
								className={styles.btnItem}>
									<Copy />
									<span>Salin</span>
								</button>
							</div>
						):<></>}
					</aside>
				</div>
			</div>
			<Loading load={loading}/>
		</section>
	):<Loading load={true}/>
}