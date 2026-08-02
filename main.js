const url = "data.json";	// JSONファイル名
let result;
const category = {on_a: "主菜", on_b: "副菜", on_d: "丼・カレー", on_e: "デザート", on_bunrui1: "ライス"}

// JSONファイルを整形して表示する
function JSONread(data){
	for (const [key, value] of Object.entries(data)) {
		console.log(key, value);	//key=分類名、value=[[メニュー名、値段]…]
		const menucontainer = document.getElementById("menucontainer");
		let newcategory = document.createElement("div");
		newcategory.className = "category";
		newcategory.id = key;
		menucontainer.appendChild(newcategory);
		newcategory.insertAdjacentHTML('afterbegin', '<div class="categorytitle">'+category[key]+'</div>');
		let newvalue = value.sort((a, b) => b[1] - a[1]);	//価格順ソート
		console.log(newvalue);

		newvalue.forEach((item,index)  =>{	//item=[メニュー名、値段]
			console.log(item[0]+"は"+item[1]+"だよ");
			const newmenu = document.createElement("div");
			newmenu.className = "menu";
			newmenu.id = key+"_"+index;
			newcategory.appendChild(newmenu);
			newmenu.insertAdjacentHTML('beforeend', '<span class="menuname">'+item[0]+'</span><span class="menuprice">'+item[1]+'</span>');
		})
	}
};

//dev class=category id=on_a / dev class = menu / span class = menuname, span class = menuprice
let menus = document.querySelectorAll(".menu");
let seldishesEl = 0;
let selsumEl = 0;
let THRESHOLD = 750;
let seldifEl = THRESHOLD;

function updateFooter() {
	const selected = document.querySelectorAll(".menu.selected");
	let sum = 0;
	selected.forEach((menu) => {
		const priceText = menu.querySelector(".menuprice").textContent;
		sum += Number(priceText);
	});
	const diff = THRESHOLD - sum;
	seldishesEl.textContent = selected.length;
	selsumEl.textContent = sum;
	seldifEl.textContent = diff;
	menus.forEach((menu) => {
		if (menu.querySelector(".menuprice").textContent > diff){
			console.log(menu.querySelector(".menuprice").textContent)
			menu.classList.add("abondoned");
		}else {
			menu.classList.remove("abondoned");
		}
	})
}

// 起動時の処理
window.addEventListener("load", ()=>{
	// JSONファイルを取得して表示
	fetch(url)
		.then( response => response.json())
		.then( data => JSONread(data))
		.then(function(){
			menus = document.querySelectorAll(".menu")
			seldishesEl = document.querySelector("#seldishes span")
			selsumEl = document.querySelector("#selsum span")
			seldifEl = document.querySelector("#seldif span")
			console.log("つけてないよ")
			menus.forEach((menu) => {
				console.log("つけたよ")
				menu.addEventListener("click", () => {
					menu.classList.toggle("selected");
					updateFooter()
				});
			})
		})
});
