import React, { useState } from "react";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import { ClientType, ShopStateType } from "../types";
import { getData } from "../utils/functions";
import { useAppState, useClientsState, useShopState } from "../lib/store";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { StatusBar } from "expo-status-bar";
// import * as Linking from "expo-linking";
// import { useRouter } from "expo-router";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

SplashScreen.preventAutoHideAsync();

// interface RouteParams {
//   data: string; // Modifie selon tes besoins
// }

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  const { firstTime, setFirstTime } = useAppState();
  const { setShop } = useShopState();
  const { clients, setClients } = useClientsState();
  const [isFirstTimeLoaded, setIsFirstTimeLoaded] = useState(false);

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  // get first time
  useEffect(() => {
    const loadData = async () => {
      // get first time
      const getFirstTime = async () => {
        const value = (await getData("firstTime")) as Boolean;
        if (value === null) {
          setFirstTime(true);
        } else {
          setFirstTime(value);
        }
        setIsFirstTimeLoaded(true); // Marquer que firstTime est chargé
      };
      await getFirstTime();

      // get shop data;
      const getShop = async () => {
        const value = (await getData("shop")) as ShopStateType;
        if (value === null) {
          setShop(null);
        } else {
          setShop(value);
        }
      };
      await getShop();

      // get clients data
      const getClients = async () => {
        const value = (await getData("clients")) as ClientType[];
        if (value === null) {
          setClients([]);
        } else {
          setClients(value);
        }
      };
      await getClients();
    };

    loadData();
  }, []);

  useEffect(() => {
    if (loaded) {
      setTimeout(() => {
        SplashScreen.hideAsync();
      }, 3000);
    }
  }, [loaded]);

  if (!loaded || !isFirstTimeLoaded) {
    return null; // ou un écran de chargement
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const { firstTime } = useAppState();
  // const router = useRouter();

  // // Gestion des liens entrants
  // useEffect(() => {
  //   const handleDeepLink = (event: Linking.EventType) => {
  //     const url = event.url;
  //     const { path, queryParams } = Linking.parse(url);

  //     // Redirige vers la route correspondante avec les paramètres
  //     if (path && !queryParams) {
  //       router.push({
  //         pathname: path,
  //       });
  //     }

  //     if (path && queryParams) {
  //       router.push({
  //         pathname: path,
  //         params: queryParams,
  //       });
  //     }
  //   };

  //   // Écoute les événements de lien entrant
  //   const subscription = Linking.addEventListener("url", handleDeepLink);

  //   // Vérifie si l'application a été ouverte via un lien
  //   Linking.getInitialURL().then((url) => {
  //     if (url) {
  //       const { path, queryParams } = Linking.parse(url);

  //       if (path && !queryParams) {
  //         router.push({
  //           pathname: path,
  //         });
  //       }

  //       if (path && queryParams) {
  //         router.push({
  //           pathname: path,
  //           params: queryParams,
  //         });
  //       }
  //     }
  //   });

  //   return () => subscription.remove();
  // }, [router]);

  if (firstTime) {
    return (
      <>
        <Stack initialRouteName="index">
          <Stack.Screen name="index" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="auto" animated />
      </>
    );
  }

  return (
    <>
      <Stack initialRouteName="shop/index">
        <Stack.Screen
          name="shop/index"
          options={{ headerShown: false, title: "Accueil" }}
        />
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "Modifier votre boutique" }}
        />
        <Stack.Screen
          name="ModalQrCodeReader"
          options={{ presentation: "modal", title: "Scanner le code QR" }}
        />
        <Stack.Screen
          name="action"
          options={{ title: "Vos actions", presentation: "card" }}
        />

        <Stack.Screen
          name="history"
          options={{ presentation: "modal", title: "Repertoire" }}
        />
      </Stack>
      <StatusBar style="auto" animated />
    </>
  );
}
