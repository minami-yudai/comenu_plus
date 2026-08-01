
import json
import requests
from bs4 import BeautifulSoup

# ==== 設定項目 ====
TENPO_ID = "650112"  # 店舗ID(URLの t= の値)

# カテゴリコード一覧(ページのJSに書かれていたもの)
CATEGORY_CODES = ["on_a", "on_b", "on_d", "on_e", "on_bunrui1"]

BASE_URL = "https://west2-univ.jp/sp/menu_load.php"
OUTPUT_CSV = "data.json"
# =================================


def fetch_category_html(category_code: str) -> str:
    """1カテゴリ分のHTML断片を取得する"""
    headers = {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/125.0 Safari/537.36"
        )
    }
    params = {"t": TENPO_ID, "a": category_code}
    res = requests.get(BASE_URL, params=params, headers=headers, timeout=10)
    res.raise_for_status()
    res.encoding = res.apparent_encoding
    return res.text


def extract_name_and_price(html: str):
    """HTML断片から「メニュー名」と「価格」のペアを一覧で取得する"""
    soup = BeautifulSoup(html, "html.parser")
    rows = []

    for h3 in soup.select("li h3"):
        # h3タグの直接のテキストのみ(spanの中身を含めない)を取得
        name_parts = h3.find_all(text=True, recursive=False)
        name = "".join(name_parts).strip()

        price_tag = h3.select_one("span.price")
        price = price_tag.get_text(strip=True) if price_tag else ""

        rows.append((name, price))

    return rows


def save_to_json(rows, output_path: str):
    with open(output_path, mode="wt", encoding="utf-8") as f:
	    json.dump(rows, f, ensure_ascii=False, indent=2)


def main():
    all_rows = {"on_a": [],"on_b":[],"on_d": [],"on_e":[],"on_bunrui1": []}

    for code in CATEGORY_CODES:
        print(f"取得中: {code}")
        html = fetch_category_html(code)
        rows = extract_name_and_price(html)
        print(f"  -> {len(rows)} 件")
        all_rows[code] = rows

    save_to_json(all_rows, OUTPUT_CSV)
    print(f"合計 {len(all_rows)} 件のデータを {OUTPUT_CSV} に保存しました。")


if __name__ == "__main__":
    main()
