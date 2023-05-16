import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";
import "../styles/addFoodList.css";
import FoodDetailsNutrients from "./FoodDetailsNutrients";

function AddFoodList({ onCancelButtonClick, foodSection }) {
  // 點擊 "推薦食品" 隱藏 食品的div們
  const [isThirdAreaVisible, setIsThirdAreaVisible] = useState(true);
  const [isFourAreaVisible, setIsFourAreaVisible] = useState(true);
  const [isFiveAreaVisible, setIsFiveAreaVisible] = useState(false);
  const [isFoodId, setIsFoodId] = useState();
  const [FoodIdNutrients, setFoodIdNutrients] = useState([]);
  // 點擊推薦後觸發 產品資訊API
  // const [recommendProduct, setRecommendProduct] = useState();
  function getRecommendProduct() {
    axios
      .get(
        `${process.env.REACT_APP_API_URL}/api/product/getProducts?category=1&page=1`
      )
      .then((res) => {
        let foodIds = res.data.results.map((result) => result.food_id);
        setIsFoodId(foodIds);
      })
      .catch((error) => console.error(error));
  }

  useEffect(() => {
    if (isFoodId) {
      Promise.all(
        isFoodId.map((foodId) =>
          axios.get(
            `${process.env.REACT_APP_API_URL}/api/food/search?food_id=${foodId}`
          )
        )
      )
        .then((responses) => {
          const nutrients = responses.map((res) => res.data);
          setFoodIdNutrients(nutrients);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [isFoodId]);

  useEffect(() => {
    console.log(FoodIdNutrients);
  }, [FoodIdNutrients]);

  // 顯示正確的時間
  const [currentDate, setCurrentDate] = useState("");

  const getWeekday = (weekday) => {
    const weekdays = [
      "星期日",
      "星期一",
      "星期二",
      "星期三",
      "星期四",
      "星期五",
      "星期六",
    ];
    return weekdays[weekday];
  };

  const getMonth = (month) => {
    const months = [
      "1月",
      "2月",
      "3月",
      "4月",
      "5月",
      "6月",
      "7月",
      "8月",
      "9月",
      "10月",
      "11月",
      "12月",
    ];
    return months[month];
  };

  useEffect(() => {
    const date = new Date();
    const weekday = getWeekday(date.getDay());
    const month = getMonth(date.getMonth());
    const day = date.getDate();
    setCurrentDate(`${weekday}, ${month} ${day}日`);
  }, []);

  // 判斷早餐、午餐、晚餐、零食
  const [eatingTime, setEatingTime] = useState();

  const eatingTimeObj = {
    breakfast: "早餐",
    lunch: "午餐",
    dinner: "晚餐",
    snack: "零食",
  };

  useEffect(() => {
    setEatingTime(eatingTimeObj[foodSection]);
  }, [foodSection]);

  // 搜尋相關程式
  const [categories, setCategories] = useState([]);
  const [tempCategory, setTempCategory] = useState("all");
  const [keyword, setKeyword] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showcase, setShowcase] = useState(false);
  const [selected, setSelected] = useState("尚未選擇食物");
  const [showAddFoodItem, setshowAddFoodItem] = useState(false);

  // 點擊食品後跳出的食品細項
  function addFoodItemClick() {
    setshowAddFoodItem(true);
  }

  function handleCancelClick() {
    setshowAddFoodItem(false);
  }

  // 連接資料庫，並搜尋食物的API
  const searchFood = (category, keyword, qty) => {
    axios
      .get(
        `${process.env.REACT_APP_API_URL}/api/food/search?category=${category}&qty=${qty}&keyword=${keyword}`
      )
      .then((res) => {
        // console.log("ressss", res);
        setSuggestions(res.data.suggestions);
        // console.log(suggestions);
      })
      .catch((err) => {
        console.log(err);
        setSuggestions([]);
        // setSelected(err.response.data.message);
      });
  };

  //取得 category列表
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/food/category=all`)
      .then((res) => {
        // console.log("all categories", res.data.categories);
        setCategories(res.data.categories);
      })
      .catch((error) => console.error(error));
  }, []);
  // 根據input 內容推薦可能項目
  useEffect(() => {
    setShowcase(false);
    let inputTimer = null;
    const delay = 500;
    if (keyword.trim().length > 0) {
      inputTimer = setTimeout(() => {
        // console.log("query", query);
        searchFood(tempCategory, keyword, 9999);
        setShowcase(true);
      }, delay);
    }
    return () => {
      if (inputTimer) {
        clearTimeout(inputTimer);
      }
    };
  }, [tempCategory, keyword]);

  useEffect(() => {
    console.log(selected);
  }, [selected]);

  // 取消按鈕點擊後，視窗消失
  const handleCancelButtonClick = () => {
    onCancelButtonClick();
  };

  return (
    <Fragment>
      <div className="userAddFoodBgDiv">
        {/* 我是第一區 _ 選擇哪餐 日期 取消 */}
        <div className="d-flex">
          <div className="dateDiv w-50 p-3">
            <div>{eatingTime}</div>
            <div>{currentDate}</div>
          </div>
          <div
            className="cancelButton p-3 d-flex align-items-center justify-content-end"
            onClick={handleCancelButtonClick}
          >
            取消
          </div>
        </div>
        {/* 我是第二區 _ 選擇食物 或 推薦食品 */}
        <div className="selectFoodOrShopFoodDiv d-flex justify-content-around align-items-center">
          <div
            onClick={() => {
              setIsThirdAreaVisible(true);
              setIsFourAreaVisible(true);
              setIsFiveAreaVisible(false);
            }}
          >
            食品
          </div>
          <div
            onClick={() => {
              setIsThirdAreaVisible(false);
              setIsFourAreaVisible(false);
              setIsFiveAreaVisible(true);
              getRecommendProduct();
            }}
          >
            推薦食品
          </div>
        </div>
        {/* 我是第三區 */}
        {isThirdAreaVisible && (
          <div className="searchFoodBgDiv d-flex">
            <div className="searchFoodBg d-flex">
              {/* 搜尋圖片 */}
              {/* <img src="./img/search.png" alt="" /> */}
              {/* /Users/apple/Desktop/前端React/client/public/img/search.png */}
              <div className="searchFoodTitle d-flex align-items-center">
                {/* 選擇食物種類 */}
                {/* 種類 */}
                <select
                  className="categorySelect"
                  name="tempCategory"
                  value={tempCategory}
                  onChange={(event) => {
                    setTempCategory(event.target.value);
                  }}
                >
                  <option value="all">全部種類</option>
                  {categories.map((category, index) => (
                    <option key={index} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                {/* 文字輸入框 */}
                <input
                  className="inputSelect"
                  type="text"
                  value={keyword}
                  onChange={(event) => {
                    setKeyword(event.target.value);
                  }}
                  placeholder="請點擊輸入食物名稱"
                />
                {/* 搜尋按鈕 */}
                <button
                  className="btn btn-danger"
                  onClick={() => {
                    searchFood(tempCategory, keyword);
                  }}
                >
                  search
                </button>
              </div>
            </div>
          </div>
        )}
        {/* 我是第四區-根據搜尋的結果，新增對應的食品區 */}
        {isFourAreaVisible && (
          <div className="searchFoodList">
            {showcase &&
              suggestions.map((suggestion, index) => (
                <div
                  className="foodItem"
                  key={suggestion.food_id}
                  onClick={() => {
                    setSelected(suggestion.food_id);
                    addFoodItemClick();
                  }}
                >
                  <div>{suggestion.sample_name}</div>
                  <div>
                    <span>每{suggestion.unit}克 - </span>
                    <span>{suggestion.Calories_adjusted}大卡</span>
                  </div>
                  <hr />
                </div>
              ))}
          </div>
        )}

        {/* 我是第五區 - 推薦食品區域 */}
        {isFiveAreaVisible && (
          <div className="recommendArea">
            <div className="recommendItem">
              <div className="recommendImg">
                <img
                  src="https://res.cloudinary.com/ddh6e9dad/image/upload/v1683013671/ipltppdac2iqofo7hu2s.png"
                  alt=""
                />
              </div>
              <div className="recommendText">
                <table>
                  <thead>
                    <tr>
                      <th>餐盒</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>卡路里</td>
                      <td>鈉</td>
                    </tr>
                    <tr>
                      <td>碳水化合物</td>
                      <td>蛋白質</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* 食品營養細細區 */}
      {showAddFoodItem && (
        <FoodDetailsNutrients
          cancelButtonClick={handleCancelClick}
          selected={selected}
          foodSection={foodSection}
        />
      )}
    </Fragment>
  );
}

export default AddFoodList;
