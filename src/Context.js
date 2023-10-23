import React from "react";
import { useCookie } from "react-use";
// import axios from "axios";
export const Context = React.createContext();

function ContextProvider(props) {
  const [theme, setTheme] = useCookie("theme");
  const [role, setRole] = useCookie("role");

  const intialState = {
    DarkTheme: JSON.parse(decodeURIComponent(theme))
      ? JSON.parse(decodeURIComponent(theme)).dark
      : false,
    Role: JSON.parse(decodeURIComponent(role))
      ? JSON.parse(decodeURIComponent(role)).role
      : "Guest",
    RememberMe: false,
    Home: false,
    CategoryImages: false,
    Account: false,
    CartProdut: false,
    CartSummary: false,
    CartItemsCount: 0,
    PendingOrdersCount: 0,
    CompletedOrders: false,
    PendingOrders: false,
    MyProducts: false,
    Changed: {
      Home: true,
      Account: true,
      Cart: true,
      CompletedOrders: true,
      PendingOrders: true,
      MyProducts: true,
      HeaderJWT_set: false,
    },
    temp: {},
  };

  function reducer(state, action) {
    switch (action.type) {
      case "set_theme":
        return {
          ...state,
          DarkTheme: action.theme,
        };
      case "change_theme":
        return {
          ...state,
          DarkTheme: state.DarkTheme === true ? false : true,
        };
      case "set_user_role":
        const expiryDate = new Date();
        expiryDate.setMonth(expiryDate.getMonth() + 1);
        setRole(encodeURIComponent(JSON.stringify({ role: action.role })), {
          path: "/",
          expires: expiryDate,
          secure: true,
          // httpOnly: true,
        });
        return {
          ...state,
          Role: action.role,
        };
      // =========== caching ============
      // temp
      // case "set_temp":
      //   return {
      //     ...state,
      //     temp: {
      //       ...action.temp,
      //     },
      //   };
      // case "reset_temp":
      //   return {
      //     ...state,
      //     temp: {},
      //   };
      // account
      case "set_account":
        return {
          ...state,
          Account: action.account,
          Changed: {
            ...state.Changed,
            Account: false,
          },
        };
      case "reset_account":
        return {
          ...intialState,
        };
      // cart
      case "set_cart_product":
        return {
          ...state,
          CartProduct: action.cart_product,
          CartItemsCount: action.count,
          Changed: {
            ...state.Changed,
            Cart: false,
          },
        };
      case "set_cart_summary":
        return {
          ...state,
          CartSummary: action.cart_summary,
          Changed: {
            ...state.Changed,
            Cart: false,
          },
        };
      // home
      case "set_home":
        return {
          ...state,
          Home: action.home,
          Changed: {
            ...state.Changed,
            Home: false,
          },
        };
      // category images
      case "set_category_images":
        return {
          ...state,
          CategoryImages: action.images,
        };
      // complete order
      case "set_completed_orders":
        return {
          ...state,
          CompletedOrders: action.completed_orders,
          Changed: {
            ...state.Changed,
            CompletedOrders: false,
          },
        };
      // pending order
      case "set_pending_orders":
        return {
          ...state,
          PendingOrders: action.pending_orders,
          PendingOrdersCount: action.count,
          Changed: {
            ...state.Changed,
            PendingOrders: false,
          },
        };
      // my products
      case "set_my_products":
        return {
          ...state,
          MyProducts: action.my_products,
          Changed: {
            ...state.Changed,
            MyProducts: false,
          },
        };
      // change in Changed Value
      case "Changed":
        return {
          ...state,
          [action.it]: false,
          Changed: {
            ...state.Changed,
            [action.it]: true,
          },
        };
      // change in Changed Value when site reloads
      case "Site_Reloaded":
        return {
          ...state,
          Changed: {
            ...state.Changed,
            Home: true,
            Account: true,
            Cart: true,
            CompletedOrders: true,
            PendingOrders: true,
            MyProducts: true,
            LoggedOut: true,
            // HeaderJWT_set: false,
          },
        };
      case "Header_Set":
        return {
          ...state,
          Role: action.role,
          Changed: {
            ...state.Changed,
            HeaderJWT_set: true,
          },
        };
      default:
        return state;
    }
  }

  const [data, dispatch] = React.useReducer(reducer, intialState);

  React.useEffect(() => {
    setTheme(encodeURIComponent(JSON.stringify({ dark: data.DarkTheme })), {
      path: "/",
      expires: 60 * 60 * 24 * 30,
    });
  }, [data.DarkTheme, setTheme, theme]);

  console.log("Main State : ", data);

  // this basically allow all routes to fetch data from server after reloading site
  window.addEventListener("load", () => {
    console.log("site reloaded");
    // console.log(axios.defaults.headers.common.Authorization);
    dispatch({ type: "Site_Reloaded" });
  });

  return (
    <Context.Provider value={{ Data: data, Dispatch: (a) => dispatch(a) }}>
      {props.children}
    </Context.Provider>
  );
}

export default ContextProvider;
