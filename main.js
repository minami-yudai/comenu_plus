const jsonFile = './json/data.json'; // JSONファイルのパス

document.addEventListener('DOMContentLoaded', () => {
  fetch(jsonFile)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to fetch ${jsonFile}. HTTP Status: ${response.status}`);
      }
      return response.json();
    })
    .then(array => {
      const addHtml = document.getElementById('addhtml');
      if (!addHtml) {
        console.error('Error: Element with ID "addhtml" not found.');
        return;
      }

      addHtml.innerHTML = '';

      // リストアイテムを生成
      array.forEach(obj => {
        const li = document.createElement('li');
        
        // 各プロパティを追加
        const municipalityCode = document.createElement('span');
        municipalityCode.textContent = obj.municipalityCode || '団体コード';

        const prefectures = document.createElement('span');
        prefectures.textContent = obj.prefectures || '都道府県名（漢字）';

        const prefecturesKana = document.createElement('span');
        prefecturesKana.textContent = obj.prefecturesKana || '都道府県名（カナ）';

        // 各要素をリストアイテムに追加
        li.appendChild(municipalityCode);
        li.appendChild(prefectures);
        li.appendChild(prefecturesKana);

        // リストアイテムをDOMに追加
        addHtml.appendChild(li);
      });
    })
    .catch(error => {
      console.error('Error:', error);
    });
});