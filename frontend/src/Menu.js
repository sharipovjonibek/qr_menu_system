import { useEffect, useState } from "react";
import "./Menu.css";

export default function Menu({ token, tableNumber }) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [menuData, setMenuData] = useState(null);
  function onHandleSelectedCategory(name) {
    setSelectedCategory(name);
  }
  useEffect(() => {
    async function getMenu() {
      const res = await fetch("http://127.0.0.1:8000/api/menu", {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      const data = await res.json();
      setMenuData(data);
    }

    if (token) {
      getMenu();
    }
  }, [token]);

  if (!menuData)
    return (
      <div className="loading-container">
        <div className="loader"></div>
      </div>
    );
  return (
    <div className="menu-body">
      <Header menuData={menuData} tableNumber={tableNumber} />
      <Categories
        menuData={menuData}
        handleSelectCategory={onHandleSelectedCategory}
        selectedCategory={selectedCategory}
      />
      <DisplayCategory
        selectedCategory={selectedCategory}
        categories={menuData.categories}
      />
    </div>
  );
}

function Header({ menuData, tableNumber }) {
  return (
    <div className="header">
      <div>
        <h3>Table {tableNumber}</h3>
        <p>Welcome back, {menuData.customer_name}</p>
      </div>
      <h1>Buxoro Kafe</h1>
    </div>
  );
}

function Categories({ menuData, handleSelectCategory, selectedCategory }) {
  return (
    <div className="categories-container">
      <Category
        catName={"All"}
        handleSelectCategory={handleSelectCategory}
        selectedCategory={selectedCategory}
      />
      {menuData.categories.map((cat) => (
        <Category
          key={cat.id}
          catName={cat.name}
          handleSelectCategory={handleSelectCategory}
          selectedCategory={selectedCategory}
        />
      ))}
    </div>
  );
}

function Category({ catName, handleSelectCategory, selectedCategory }) {
  return (
    <button
      className={`category-btn ${selectedCategory === catName && "selected"}`}
      onClick={() => handleSelectCategory(catName)}
    >
      {catName}
    </button>
  );
}

function DisplayCategory({ selectedCategory, categories }) {
  if (selectedCategory === "All")
    return (
      <div>
        {categories.map(
          (cat) =>
            cat.items.length !== 0 && (
              <div key={cat.id}>
                <h2 style={{ marginLeft: 40 }}>{cat.name}</h2>
                <CategoryGrid chosenCategory={cat} />
              </div>
            ),
        )}
      </div>
    );
  let chosenCategory;
  categories.forEach((e) => {
    if (e.name === selectedCategory) chosenCategory = e;
  });
  return <CategoryGrid chosenCategory={chosenCategory} />;
}

function CategoryGrid({ chosenCategory }) {
  return (
    <div className="category-grid">
      {chosenCategory.items.map((food) => (
        <FoodCard key={food.id} food={food} />
      ))}
    </div>
  );
}

function FoodCard({ food }) {
  return (
    <div className="food-card">
      <img src={`http://127.0.0.1:8000${food.image}`} alt={food.name} />
      <div className="card-info">
        <h3>{food.name}</h3>
        <p>{food.description}</p>
      </div>
      <div className="card-action">
        <h3>{food.price}</h3>
        <button>+</button>
      </div>
    </div>
  );
}
