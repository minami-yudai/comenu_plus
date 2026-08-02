const url = "data.json";	// JSONファイル名
let result;

// JSONファイルを整形して表示する
function JSONread(data){
	for (const [key, value] of Object.entries(data)) {
		console.log(key, value);	//key=分類名、value=[[メニュー名、値段]…]
		const menucontainer = document.getElementById("menucontainer");
		let newcategory = document.createElement("dev");
		newcategory.className = "category";
		newcategory.id = key;
		menucontainer.appendChild(newcategory);
		let newvalue = value.sort((a, b) => b[1] - a[1]);
		console.log(newvalue);

		newvalue.forEach((item,index)  =>{	//item=[メニュー名、値段]
			console.log(item[0]+"は"+item[1]+"だよ");
			//新しいメニューを作成
			const newmenu = document.createElement("dev");
			newmenu.className = "menu";
			newmenu.id = key+"_"+index;
			newcategory.appendChild(newmenu);
			newmenu.insertAdjacentHTML('beforeend', '<span class="menuname">'+item[0]+'</span><span class="menuprice">'+item[1]+'</span>');
		})
	}
};
//例
//dev class=category id=on_a / dev class = menu / span class = menuname, span class = menuprice

// 起動時の処理
window.addEventListener("load", ()=>{
	// JSONファイルを取得して表示
	fetch(url)
		.then( response => response.json())
		.then( data => JSONread(data));

});
