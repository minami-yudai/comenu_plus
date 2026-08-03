if(localStorage.getItem('comenu+_where') == null){
	localStorage.setItem('comenu+_where', 2)
}
if(localStorage.getItem('comenu+_price') == null){
	localStorage.setItem('comenu+_price', 750)
}
const url = "data.json";	// JSONファイル名
let result;
const category = [{on_a: "主菜", on_b: "副菜",on_c:"麺類", on_d: "丼・カレー", on_e: "デザート", on_bunrui1: "ライス"},
	{on_a: "主菜", on_b: "副菜", on_c:"麺類", on_d: "丼・カレー", on_e: "デザート", on_bunrui1: "朝食プレート",on_bunrui3: "ライス"},
	{on_a: "主菜", on_b: "副菜", on_c:"麺類", on_d: "丼・カレー", on_e: "デザート", on_bunrui1: "オーダー", on_bunrui2: "ケバブ&ベジタリアン", on_bunrui3: "ケバブ", on_bunrui5: "ライス"},
	{on_a: "主菜", on_b: "副菜", on_c:"麺類", on_d: "丼・カレー", on_e: "デザート", on_bunrui1: "昼 北部限定コーナー",on_bunrui2: "夜 丼・北部限定コーナー", on_bunrui3: "ライス"},
	{on_a: "主菜", on_b: "副菜", on_bunrui1: "ライス"}
	// 冗長
]
const menucontainer = document.getElementById("menucontainer");

// JSONファイルを整形して表示する
function JSONread(datas){
	data = datas[localStorage.getItem('comenu+_where')];
	for (const [key, value] of Object.entries(data)) {
		console.log(key, value);	//key=分類名、value=[[メニュー名、値段]…]
		let newcategory = document.createElement("div");
		newcategory.className = "category";
		newcategory.id = key;
		menucontainer.appendChild(newcategory);
		newcategory.insertAdjacentHTML('afterbegin', '<div class="categorytitle">'+category[localStorage.getItem('comenu+_where')][key]+'</div>');
		let newvalue = value.sort((a, b) => b[1] - a[1]);	//価格順ソート

		newvalue.forEach((item,index)  =>{	//item=[メニュー名、値段]
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
let seldishesEl; //ここらへんconstでグローバルに出来ないのかなぁ
let selsumEl;
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
			menus.forEach((menu) => {
				menu.addEventListener("click", () => {
					menu.classList.toggle("selected");
					updateFooter()
				});
			})
		})

	const selectEl = document.getElementById('storeselect');
  	selectEl.addEventListener('change', (event) => {
		const selectedValue = event.target.value; // 選ばれたvalue値
		localStorage.setItem('comenu+_where', selectedValue);
		menucontainer.innerHTML = "";
		fetch(url) //冗長
		.then( response => response.json())
		.then( data => JSONread(data))
		.then(function(){
			menus = document.querySelectorAll(".menu")
			seldishesEl = document.querySelector("#seldishes span")
			selsumEl = document.querySelector("#selsum span")
			seldifEl = document.querySelector("#seldif span")
			menus.forEach((menu) => {
				menu.addEventListener("click", () => {
					menu.classList.toggle("selected");
					updateFooter()
				});
			})
		})
		seldishesEl.textContent = 0;
		selsumEl.textContent = 0;
		seldifEl.textContent = THRESHOLD;
  	});
});

const hamburger = document.querySelector("#hamburger")
const setting = document.querySelector("#setting")
hamburger.addEventListener("click", ()=> {
	setting.classList.toggle("none");
	menucontainer.classList.toggle("none");
})