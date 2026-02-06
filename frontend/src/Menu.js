import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function Menu({ token }) {
  const { tableNumber } = useParams();
  const [menuData, setMenuData] = useState(null);
  useEffect(() => {
    async function getMenu() {
      const res = await fetch("http://127.0.0.1:8000/api/menu", {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      const data = await res.json(); // ✅ await
      setMenuData(data);
    }

    if (token) {
      getMenu();
    }
  }, [token]); // ✅ runs only when token changes

  return <div>{menuData && menuData.categories[0].name + tableNumber}</div>;
}
